"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { collection, getDocs, query } from "firebase/firestore";
import { Resource } from "@/lib/types/resource";
import { db } from "@/lib/firebase";

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
export function AfricaMap() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [countries, setCountries] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsClient(true);
    
    // Cleanup function to prevent memory leaks
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
      const fetchResources = async () => {
        try {
          let q = query(collection(db, 'ResourceFromA'))
  
          const snapshot = await getDocs(q)
          const resourcesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Resource[]
  
          console.log('Fetched resources:', resourcesData.length, resourcesData)
          setResources(resourcesData)
          
          // Extract countries from resources
          const extractedCountries = Array.from(new Set(resourcesData.map(r => r.country).filter(Boolean)))
          setCountries(extractedCountries)
          console.log('Extracted countries:', extractedCountries)
  
        } catch (error) {
          console.error('Error fetching resources:', error)
        } finally {
          setLoading(false)
        }
      }
  
      fetchResources()
    }, [])
  
  // console.log('AfricaMap - Countries received:', countries)
  // console.log('AfricaMap - Resources received:', resources.length)
  
  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Chargement de la carte...</div>
      </div>
    );
  }
  
  // Country coordinates with multiple name variations
  const countryCoordinates: Record<string, [number, number]> = {
    // French names
    'cameroun': [7.3697, 12.3547],
    'Cameroun': [7.3697, 12.3547],
    'maroc': [31.7917, -7.0926],
    'algérie': [28.0339, 1.6596],
    'tunisie': [33.8869, 9.5375],
    'nigeria': [9.0820, 8.6753],
    'ghana': [7.9465, -1.0232],
    'sénégal': [14.4974, -14.4524],
    'mali': [17.5707, -3.9962],
    'burkina faso': [12.2383, -1.5616],
    'côte d\'ivoire': [7.5400, -5.5471],
    'niger': [17.6078, 8.0817],
    'tchad': [15.4542, 18.7322],
    'gabon': [-0.8037, 11.6094],
    'congo': [-0.2280, 15.8277],
    'rdc': [-4.0383, 21.7587],
    'centrafrique': [6.6111, 20.9394],
    'bénin': [9.3077, 2.3158],
    'togo': [8.6195, 0.8248],
    // English names
    'cameroon': [7.3697, 12.3547],
    'Cameroon': [7.3697, 12.3547],
    'morocco': [31.7917, -7.0926],
    'algeria': [28.0339, 1.6596],
    'tunisia': [33.8869, 9.5375],
    'egypt': [26.8206, 30.8025],
    'sudan': [12.8628, 30.2176],
    'ethiopia': [9.1450, 40.4897],
    'somalia': [5.1521, 46.1996],
    'kenya': [-0.0236, 37.9062],
    'tanzania': [-6.3690, 34.8888],
    'mozambique': [-18.6657, 35.5296],
    'south africa': [-30.5595, 22.9375],
    'namibia': [-22.9576, 18.4904],
    'botswana': [-22.3285, 24.6849],
    'zimbabwe': [-19.0154, 29.1549],
    'zambia': [-13.1339, 27.8493],
    'angola': [-11.2027, 17.8739],
    'uganda': [1.3733, 32.2903],
    'rwanda': [-1.9403, 29.8739],
    'burundi': [-3.3731, 29.9189],
    'malawi': [-13.2543, 34.3015],
    'madagascar': [-18.7669, 46.8691],
    'mauritius': [-20.3484, 57.5522],
    'senegal': [14.4974, -14.4524],
    'guinea': [9.9456, -9.6966],
    'liberia': [6.4281, -9.4295],
    'sierra leone': [8.4606, -11.7799],
    'mauritania': [21.0079, -10.9408],
  };
  
  return (
    <div ref={containerRef} className="w-full h-full">
      <MapContainer
        key={`map-${isClient}`}
        center={[0, 20]}
        zoom={3}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        ref={mapRef}
        whenCreated={(map: any) => {
          mapRef.current = map;
          setTimeout(() => {
            if (map && map.invalidateSize) {
              map.invalidateSize();
            }
          }, 100);
        }}
      >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {countries.map((country) => {
        // Try exact match first, then normalized
        let coords = countryCoordinates[country] || countryCoordinates[country.toLowerCase().trim()];
        console.log(`Country: ${country}, Coords: ${coords}`);
        if (!coords) {
          console.log(`No coordinates found for: ${country}`);
          return null;
        }
        
        const resourceCount = resources.filter(r => 
          r.country && (r.country === country || r.country.toLowerCase().trim() === country.toLowerCase().trim())
        ).length;
        console.log(`${country} has ${resourceCount} resources`);
        
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
    </div>
  );
}