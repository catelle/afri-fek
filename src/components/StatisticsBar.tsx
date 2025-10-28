'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Globe, MapPin, X, BookOpen, FileText, GraduationCap, Building2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Create red marker icon
const createRedIcon = () => {
  if (typeof window !== 'undefined') {
    const L = require('leaflet');
    return new L.Icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 6.9 12.5 28.5 12.5 28.5S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#dc2626"/>
          <circle cx="12.5" cy="12.5" r="6" fill="white"/>
        </svg>
      `),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  }
  return null;
};

interface StatisticsBarProps {
  resources: any[];
  language: 'fr' | 'en';
  t: any;
}

export default function StatisticsBar({ resources, language, t }: StatisticsBarProps) {
  const [showMap, setShowMap] = useState(false);
  
  // Calculate statistics
  const stats = {
    total: resources.length,
    articles: resources.filter(r => r.type === 'article').length,
    journals: resources.filter(r => r.type === 'journal').length,
    academies: resources.filter(r => r.type === 'academy').length,
    institutions: resources.filter(r => r.type === 'institution').length,
    blogs: resources.filter(r => r.type === 'blog').length,
  };

  const countries = Array.from(new Set(resources.map(r => r.country).filter(Boolean)));
  const countryCount = countries.length;

  return (
    <>
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 p-4 rounded-full mb-3">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">{stats.total}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Ressources totales</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">{stats.articles}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Articles</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-3">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">{stats.journals}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Journaux</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-3">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">{stats.academies + stats.institutions}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Institutions</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-red-100 p-4 rounded-full mb-3">
                <Globe className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">{countryCount}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">
                <button
                  onClick={() => setShowMap(true)}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  Pays couverts
                </button>
              </div>
            </div>
          </div>
          
          {/* View on Map Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowMap(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              <MapPin className="w-5 h-5" />
              Voir sur la carte
            </button>
          </div>
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
    </>
  );
}

// Africa Map Component
function AfricaMap({ countries, resources }: { countries: string[], resources: any[] }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Chargement de la carte...</div>
      </div>
    );
  }
  
  // Country coordinates (latitude, longitude)
  const countryCoordinates: Record<string, [number, number]> = {
    'Maroc': [31.7917, -7.0926],
    'Algérie': [28.0339, 1.6596],
    'Tunisie': [33.8869, 9.5375],
    'Libye': [26.3351, 17.2283],
    'Égypte': [26.8206, 30.8025],
    'Soudan': [12.8628, 30.2176],
    'Éthiopie': [9.1450, 40.4897],
    'Somalie': [5.1521, 46.1996],
    'Kenya': [-0.0236, 37.9062],
    'Tanzanie': [-6.3690, 34.8888],
    'Mozambique': [-18.6657, 35.5296],
    'Afrique du Sud': [-30.5595, 22.9375],
    'Namibie': [-22.9576, 18.4904],
    'Botswana': [-22.3285, 24.6849],
    'Zimbabwe': [-19.0154, 29.1549],
    'Zambie': [-13.1339, 27.8493],
    'Angola': [-11.2027, 17.8739],
    'RDC': [-4.0383, 21.7587],
    'Cameroun': [7.3697, 12.3547],
    'Nigeria': [9.0820, 8.6753],
    'Niger': [17.6078, 8.0817],
    'Tchad': [15.4542, 18.7322],
    'Mali': [17.5707, -3.9962],
    'Burkina Faso': [12.2383, -1.5616],
    'Ghana': [7.9465, -1.0232],
    'Côte d\'Ivoire': [7.5400, -5.5471],
    'Liberia': [6.4281, -9.4295],
    'Sierra Leone': [8.4606, -11.7799],
    'Guinée': [9.9456, -9.6966],
    'Sénégal': [14.4974, -14.4524],
    'Mauritanie': [21.0079, -10.9408],
    'Gabon': [-0.8037, 11.6094],
    'Congo': [-0.2280, 15.8277],
    'Centrafrique': [6.6111, 20.9394],
    'Ouganda': [1.3733, 32.2903],
    'Rwanda': [-1.9403, 29.8739],
    'Burundi': [-3.3731, 29.9189],
    'Malawi': [-13.2543, 34.3015],
    'Bénin': [9.3077, 2.3158],
    'Madagascar': [-18.7669, 46.8691],
    'Maurice': [-20.3484, 57.5522],
  };
  
  return (
    <MapContainer
      center={[0, 20]} // Center on Africa
      zoom={3}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {countries.map((country) => {
        const coords = countryCoordinates[country];
        if (!coords) return null;
        
        const resourceCount = resources.filter(r => r.country === country).length;
        
        const redIcon = createRedIcon();
        
        return (
          <Marker key={country} position={coords} icon={redIcon || undefined}>
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold">{country}</h3>
                <p className="text-sm text-gray-600">
                  {resourceCount} organisation{resourceCount > 1 ? 's' : ''}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );}