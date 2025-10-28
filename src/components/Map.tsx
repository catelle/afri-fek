"use client";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.Marker })), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.Popup })), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.TileLayer })), { ssr: false });



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

// Africa Map Component
export function AfricaMap({ countries, resources }: { countries: string[], resources: any[] }) {
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