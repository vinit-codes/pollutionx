'use client';

import { useState } from 'react';
import { useHotspots, Hotspot } from '@/hooks/useHotspots';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReportHotspotDialog } from '@/components/ReportHotspotDialog';
import { Toaster } from 'sonner';

// Dynamic import with SSR disabled for the map  
const DynamicMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-400">Loading map...</div>
    </div>
  ),
});

export default function Home() {
  const { hotspots, loading, error } = useHotspots({ limit: 100 });
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  // Sort hotspots by AQI for the sidebar
  const sortedHotspots = [...hotspots].sort((a, b) => b.aqi - a.aqi);

  // Function to get AQI status and color
  const getAqiInfo = (aqi: number) => {
    if (aqi > 300) return { status: 'Hazardous', color: 'bg-red-500', textColor: 'text-red-100' };
    if (aqi >= 200) return { status: 'Unhealthy', color: 'bg-orange-500', textColor: 'text-orange-100' };
    if (aqi >= 150) return { status: 'Unhealthy for Sensitive', color: 'bg-yellow-500', textColor: 'text-yellow-100' };
    if (aqi >= 100) return { status: 'Moderate', color: 'bg-blue-500', textColor: 'text-blue-100' };
    return { status: 'Good', color: 'bg-green-500', textColor: 'text-green-100' };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster position="top-right" richColors />
      <ReportHotspotDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen} />
      
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-full px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                Bhubaneswar Urban Emission Tracker
              </h1>
              <p className="text-gray-400 mt-1 text-sm lg:text-base">Real-time pollution monitoring and analysis</p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm lg:text-base w-full sm:w-auto"
              onClick={() => setReportDialogOpen(true)}
            >
              📍 Report Hotspot
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-88px)]">
        {/* Sidebar - 1/4 width on large screens, full width on mobile */}
        <div className="w-full lg:w-1/4 bg-gray-800 border-r border-gray-700 flex flex-col max-h-[50vh] lg:max-h-none">
          {/* Stats Section */}
          <div className="p-4 lg:p-6 border-b border-gray-700">
            <h2 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4">Overview</h2>
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-2 lg:gap-4">
              <div className="bg-gray-700 p-2 lg:p-3 rounded-lg">
                <div className="text-xl lg:text-2xl font-bold text-blue-400">{hotspots.length}</div>
                <div className="text-xs text-gray-300">Total Hotspots</div>
              </div>
              <div className="bg-gray-700 p-2 lg:p-3 rounded-lg">
                <div className="text-xl lg:text-2xl font-bold text-red-400">
                  {hotspots.filter(h => h.aqi > 300).length}
                </div>
                <div className="text-xs text-gray-300">Critical Areas</div>
              </div>
              <div className="col-span-3 lg:col-span-2 bg-gray-700 p-2 lg:p-3 rounded-lg">
                <div className="text-xl lg:text-2xl font-bold text-yellow-400">
                  {hotspots.length > 0 ? Math.round(hotspots.reduce((acc, h) => acc + h.aqi, 0) / hotspots.length) : 0}
                </div>
                <div className="text-xs text-gray-300">Average AQI</div>
              </div>
            </div>
          </div>

          {/* Top Emissions List */}
          <div className="flex-1 p-4 lg:p-6 overflow-hidden">
            <h2 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4">Top Emissions</h2>
            
            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4">
                <div className="text-red-300 text-sm">Error loading data: {error}</div>
              </div>
            )}

            <ScrollArea className="h-full">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-700 rounded-lg p-3 animate-pulse">
                      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedHotspots.map((hotspot, index) => {
                    const aqiInfo = getAqiInfo(hotspot.aqi);
                    const isSelected = selectedHotspot?._id === hotspot._id;
                    
                    return (
                      <Card
                        key={hotspot._id}
                        className={`bg-gray-700 border-gray-600 cursor-pointer transition-all duration-200 hover:bg-gray-650 ${
                          isSelected ? 'ring-2 ring-blue-500 bg-gray-650' : ''
                        }`}
                        onClick={() => setSelectedHotspot(hotspot)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-medium text-white text-sm leading-tight">
                                {hotspot.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={`${aqiInfo.color} ${aqiInfo.textColor} text-xs px-2 py-1`}>
                                  AQI {hotspot.aqi}
                                </Badge>
                                <span className="text-xs text-gray-400">#{index + 1}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 capitalize">
                            {hotspot.type} • {aqiInfo.status}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {hotspot.source}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Map Area - 3/4 width on large screens, full on mobile */}
        <div className="flex-1 p-4 lg:p-6">
          <Card className="h-full bg-gray-800 border-gray-700">
            <CardHeader className="pb-3 lg:pb-4">
              <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-lg lg:text-xl">Live Pollution Map</span>
                {selectedHotspot && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedHotspot(null)}
                    className="text-gray-300 border-gray-600 hover:bg-gray-700 text-xs lg:text-sm"
                  >
                    Clear Selection
                  </Button>
                )}
              </CardTitle>
              {selectedHotspot && (
                <div className="text-xs lg:text-sm text-gray-400">
                  Focused on: <span className="text-white font-medium">{selectedHotspot.name}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-3 lg:p-6 h-[calc(100%-70px)] lg:h-[calc(100%-80px)]">
              {error ? (
                <div className="h-full bg-red-900/20 border border-red-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-red-400 mb-2">⚠️ Error loading map data</div>
                    <div className="text-sm text-red-300">{error}</div>
                  </div>
                </div>
              ) : (
                <DynamicMap hotspots={hotspots} selectedHotspot={selectedHotspot} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

}
