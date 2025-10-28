'use client';

import { Search, Plus, BarChart3, MapPin, X, Mail } from 'lucide-react';
import { useState } from 'react';
import { AfricaMap } from './Map';

interface HeaderProps {
  search: string;
  setSearch: (search: string) => void;
  setShowSubmit: (show: boolean) => void;
  showStatistics: boolean;
  setShowStatistics: (show: boolean) => void;
  language: 'fr' | 'en';
  t: any;
  resources?: any[];
  onContactClick?: () => void;
}


export default function Header({resources = [], search, setSearch, setShowSubmit, showStatistics, setShowStatistics, language, t, onContactClick }: HeaderProps) {
   const [showMap, setShowMap] = useState(false);
    const countries = Array.from(new Set(resources.map(r => r.country).filter(Boolean)));
  const countryCount = countries.length;

  return (
    <header className="border-b border-gray-200 shadow-sm bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo + Title */}
        <div className="hidden md:flex items-center gap-3">
          <img
            src="/logo-afrimvoe3.png"
            alt="Logo Afri-fek"
            className="h-15 w-15 drop-shadow-sm hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-1 text-white">
            <span className="text-[40px] text-amber-600">Afri-</span>
            <span className="text-[40px] text-amber-600">Fek</span>
          </h1>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-xl w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
            <input
              type="search"
              aria-label={t[language].search}
              placeholder={`🔍 ${t[language].search}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/90 border border-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-800 placeholder-gray-500"
            />
          </div>
        </div>

          {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
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
                  <span>Pays avec des organisations enregistrées ({countryCount} pays)</span>
                </div>
                <div className="text-xs text-gray-500">
                  Pays représentés: {countries.join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        
        {/* Buttons */}
        <div className="flex items-center gap-3">
          {/* <button
            type="button"
            onClick={() => setShowStatistics(!showStatistics)}
            className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 shadow-sm hover:shadow-md ${
              showStatistics 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Statistiques
          </button> */}

          <button
  onClick={() => setShowMap(true)}
  className={`hidden sm:flex px-4 py-2 rounded-full font-medium transition items-center gap-2 shadow-sm hover:shadow-md ${
    showMap 
      ? 'bg-gray-300 text-gray-500 hover:bg-gray-200' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`}
>
  <MapPin className="w-5 h-5" />
  Voir sur la carte
</button>

          
          <button
            type="button"
            onClick={() => setShowSubmit(true)}
            className="bg-amber-600 text-white px-4 py-2 rounded-full font-medium hover:bg-amber-500 transition flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            {t[language].submit}
          </button>
        </div>
      </div>
    </header>
  );
}