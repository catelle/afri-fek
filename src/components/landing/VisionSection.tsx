import { Globe, Undo2, X } from 'lucide-react';
import { useState } from 'react';
import { AfricaMap } from '../Map';

interface VisionSectionProps {
  visionTitle: string;
  visionTexts: string[];
  countries: string[];
  resources: any[];
}

export const VisionSection = ({ visionTitle, visionTexts, countries, resources }: VisionSectionProps) => {
  const [showMap, setShowMap] = useState(false);
  const [colorHistory, setColorHistory] = useState<string[]>([]);

  return (
    <>
      <section id="vision-section" className="py-20 bg-gray-50">
        <div className="max-w-8xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="animate-fade-in-up">
                <h2 className="text-4xl font-bold text-gray-600 mb-6">
                  {visionTitle}
                </h2>
              </div>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                {colorHistory.length > 0 && (
                  <button
                    onClick={() => {
                      setColorHistory([]);
                      document.querySelectorAll('.color-changeable').forEach(el => {
                        el.className = el.className.replace(/text-\w+-\d+/g, 'text-amber-600');
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors mb-4"
                  >
                    <Undo2 className="w-4 h-4" />
                    Annuler les changements de couleur
                  </button>
                )}
                
                {visionTexts.map((text, index) => (
                  <div
                    key={index}
                    className={`animate-fade-in-up delay-${(index + 1) * 100} p-6 rounded-xl border-l-4 hover:shadow-lg transition-shadow ${
                      index % 2 === 0 ? 'bg-amber-50 border-amber-500' : 'bg-gray-50 border-gray-600'
                    }`}
                  >
                    <p className="text-lg" dangerouslySetInnerHTML={{ __html: text }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">
                  {countries.length} Pays représentés
                </h2>
              </div>
              <div className="p-6">
                <div 
                  className="relative rounded-lg overflow-hidden h-[400px] bg-amber-100 flex items-center justify-center cursor-pointer hover:bg-amber-200 transition-colors" 
                  onClick={() => setShowMap(true)}
                >
                  <div className="text-center">
                    <Globe className="w-16 h-16 text-amber-600 mx-auto mb-4 hover:scale-110 transition-transform" />
                    <p className="text-amber-700 font-semibold">Carte Interactive</p>
                    <p className="text-amber-600 text-sm">Cliquez pour ouvrir la carte</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <span>Pays avec des organisations enregistrées ({countries.length} pays)</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Pays représentés: {countries.join(", ")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showMap && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowMap(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Carte de l'Afrique - Pays représentés</h2>
              <button
                onClick={() => setShowMap(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="relative rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <AfricaMap countries={countries} resources={resources} />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span>Pays avec des organisations enregistrées ({countries.length} pays)</span>
                </div>
                <div className="text-xs text-gray-500">
                  Pays représentés: {countries.join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};