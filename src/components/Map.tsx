'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import type { Hotspot } from '@/hooks/useHotspots';

interface MapProps {
  hotspots: Hotspot[];
  selectedHotspot?: Hotspot | null;
}

function MapController({ selectedHotspot }: { selectedHotspot?: Hotspot | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedHotspot) {
      map.setView([selectedHotspot.lat, selectedHotspot.lng], 15, {
        animate: true,
        duration: 1,
      });
    }
  }, [selectedHotspot, map]);

  return null;
}

const getMarkerColor = (aqi: number): string => {
  if (aqi > 300) return '#ef4444';
  if (aqi >= 200) return '#f97316';
  return '#22c55e';
};

const getAqiStatus = (aqi: number): string => {
  if (aqi > 300) return 'Hazardous';
  if (aqi >= 200) return 'Unhealthy';
  if (aqi >= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi >= 100) return 'Moderate';
  return 'Good';
};

const Map: React.FC<MapProps> = ({ hotspots, selectedHotspot }) => {
  return (
    <div className="h-full w-full">
      <MapContainer
        center={[20.2961, 85.8245]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg shadow-lg"
      >
        <MapController selectedHotspot={selectedHotspot} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {hotspots.map((hotspot) => (
          <CircleMarker
            key={hotspot._id}
            center={[hotspot.lat, hotspot.lng]}
            radius={Math.max(8, Math.min(20, hotspot.aqi / 20))}
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
                    <span className="text-sm text-gray-800">{hotspot.intensity}</span>
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

export default Map;
