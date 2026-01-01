'use client';

import { useEffect, useState } from 'react';

interface Hotspot {
  _id: string;
  name: string;
  lat: number;
  lng: number;
  intensity: number;
  aqi: number;
  type: 'fire' | 'industrial' | 'vehicular' | 'natural' | 'other';
  source: string;
  recommendation: string;
  createdAt: string;
  updatedAt: string;
}

interface MapWrapperProps {
  hotspots: Hotspot[];
}

const MapWrapper: React.FC<MapWrapperProps> = ({ hotspots }) => {
  const [Map, setMap] = useState<React.ComponentType<object> | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        // Import Leaflet and React-Leaflet components dynamically
        const [
          { MapContainer, TileLayer, CircleMarker, Popup },
          L,
        ] = await Promise.all([
          import('react-leaflet'),
          import('leaflet')
        ]);

        // Fix for Leaflet default markers in Next.js
        if (typeof window !== 'undefined') {
          delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          });
        }

        // Function to determine marker color based on AQI value
        const getMarkerColor = (aqi: number): string => {
          if (aqi > 300) return '#ef4444'; // Red for severely polluted
          if (aqi >= 200) return '#f97316'; // Orange for moderately polluted
          return '#22c55e'; // Green for good air quality
        };

        // Function to get AQI status text
        const getAqiStatus = (aqi: number): string => {
          if (aqi > 300) return 'Hazardous';
          if (aqi >= 200) return 'Unhealthy';
          if (aqi >= 150) return 'Unhealthy for Sensitive Groups';
          if (aqi >= 100) return 'Moderate';
          return 'Good';
        };

        const MapComponent = () => {
          const center: [number, number] = [20.2961, 85.8245];

          return (
            <div className="h-full w-full">
              <MapContainer
                center={center}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg shadow-lg"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {hotspots.map((hotspot) => (
                  <CircleMarker
                    key={hotspot._id}
                    center={[hotspot.lat, hotspot.lng]}
                    radius={Math.max(8, Math.min(20, hotspot.aqi / 20))} // Dynamic radius based on AQI
                    fillColor={getMarkerColor(hotspot.aqi)}
                    color={getMarkerColor(hotspot.aqi)}
                    weight={2}
                    opacity={0.8}
                    fillOpacity={0.6}
                  >
                    <Popup maxWidth={300}>
                      <div className="p-2">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                          {hotspot.name}
                        </h3>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">AQI:</span>
                            <span 
                              className={`px-2 py-1 rounded text-xs font-bold text-white ${
                                hotspot.aqi > 300 ? 'bg-red-500' : 
                                hotspot.aqi >= 200 ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                            >
                              {hotspot.aqi} - {getAqiStatus(hotspot.aqi)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Type:</span>
                            <span className="text-sm text-gray-800 capitalize">{hotspot.type}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Intensity:</span>
                            <span className="text-sm text-gray-800">{hotspot.intensity.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Source:</strong> {hotspot.source}
                          </p>
                          <p className="text-sm text-blue-600">
                            <strong>Recommendation:</strong> {hotspot.recommendation}
                          </p>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          );
        };

        setMap(() => MapComponent);
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    // Only load on client side
    if (typeof window !== 'undefined') {
      loadMap();
    }
  }, [hotspots]);

  // Loading state
  if (!Map) {
    return (
      <div className="h-full w-full bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return <Map />;
};

export default MapWrapper;
