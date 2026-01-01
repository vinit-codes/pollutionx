'use client';

import { useState } from 'react';
import { useHotspots, Hotspot } from '@/hooks/useHotspots';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <ReportHotspotDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen} />
      <Toaster position="top-center" richColors toastOptions={{ className: 'z-[10000]' }} />
      
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header with Stats */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-white">PollutionX</h1>
              <p className="text-sm text-gray-400">Bhubaneswar Monitor</p>
            </div>
            <Button 
              onClick={() => setReportDialogOpen(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
            >
              + Report
            </Button>
          </div>
          
          {/* Mobile Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-700 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{hotspots.length}</div>
              <div className="text-xs text-gray-400">Hotspots</div>
            </div>
            <div className="bg-gray-700 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-red-400">
                {sortedHotspots.filter(h => h.aqi > 300).length}
              </div>
              <div className="text-xs text-gray-400">Critical</div>
            </div>
            <div className="bg-gray-700 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round(hotspots.reduce((acc, h) => acc + h.aqi, 0) / hotspots.length) || 0}
              </div>
              <div className="text-xs text-gray-400">Avg AQI</div>
            </div>
          </div>
        </div>

        {/* Full Screen Map */}
        <div className="h-[60vh] relative">
          {loading ? (
            <div className="h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                <p className="text-gray-400 text-sm">Loading map...</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="text-red-400 text-lg mb-2">⚠️ Map Error</div>
                <p className="text-gray-400 text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <DynamicMap hotspots={hotspots} selectedHotspot={selectedHotspot} />
          )}

          {/* Floating Clear Button */}
          {selectedHotspot && (
            <div className="absolute top-4 left-4 z-[1000]">
              <Button
                onClick={() => setSelectedHotspot(null)}
                size="sm"
                variant="outline"
                className="bg-white/90 text-gray-900 border-gray-300 hover:bg-white shadow-lg"
              >
                ← Clear
              </Button>
            </div>
          )}

          {/* Selected Hotspot Info Card */}
          {selectedHotspot && (
            <div className="absolute bottom-4 left-4 right-4 z-[1000]">
              <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight pr-2">
                      {selectedHotspot.name}
                    </h3>
                    <Badge className={`${getAqiInfo(selectedHotspot.aqi).color} ${getAqiInfo(selectedHotspot.aqi).textColor} text-xs shrink-0`}>
                      AQI {selectedHotspot.aqi}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 capitalize">
                    {selectedHotspot.type} • {getAqiInfo(selectedHotspot.aqi).status}
                  </p>
                  <p className="text-xs text-gray-700 line-clamp-2">
                    {selectedHotspot.source}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Bottom Sheet with Hotspot List */}
        <div className="bg-gray-800 border-t border-gray-700 h-[40vh] flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Top Polluted Areas</h3>
            <p className="text-sm text-gray-400">Tap to view on map</p>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="bg-gray-700 rounded-xl p-4 animate-pulse">
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                sortedHotspots.map((hotspot, index) => {
                  const aqiInfo = getAqiInfo(hotspot.aqi);
                  const isSelected = selectedHotspot?._id === hotspot._id;
                  
                  return (
                    <Card
                      key={hotspot._id}
                      className={`bg-gray-700 border-gray-600 cursor-pointer transition-all active:scale-95 ${
                        isSelected ? 'ring-2 ring-blue-500 bg-blue-900/20' : ''
                      }`}
                      onClick={() => setSelectedHotspot(hotspot)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-gray-400 bg-gray-600 px-2 py-1 rounded">
                                #{index + 1}
                              </span>
                              <Badge className={`${aqiInfo.color} ${aqiInfo.textColor} text-xs`}>
                                AQI {hotspot.aqi}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-white text-sm mb-1">
                              {hotspot.name}
                            </h4>
                            <p className="text-xs text-gray-400 capitalize">
                              {hotspot.type} • {aqiInfo.status}
                            </p>
                          </div>
                          <div className="text-gray-400 ml-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block h-screen">
        {/* Desktop Header */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">PollutionX Bhubaneswar</h1>
                <p className="text-gray-400 mt-1">Environmental GIS & Community Monitoring</p>
              </div>
              <Button 
                onClick={() => setReportDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
              >
                Report Hotspot
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Main Content */}
        <div className="flex h-[calc(100vh-88px)]">
          {/* Desktop Sidebar */}
          <div className="w-1/4 bg-gray-800 border-r border-gray-700 flex flex-col">
            {/* Statistics */}
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Pollution Overview</h2>
              <div className="space-y-4">
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-blue-400">{hotspots.length}</div>
                    <p className="text-sm text-gray-400">Total Hotspots</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-red-400">
                      {sortedHotspots.filter(h => h.aqi > 300).length}
                    </div>
                    <p className="text-sm text-gray-400">Critical Areas</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-yellow-400">
                      {Math.round(hotspots.reduce((acc, h) => acc + h.aqi, 0) / hotspots.length) || 0}
                    </div>
                    <p className="text-sm text-gray-400">Average AQI</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Top Emissions List */}
            <div className="flex-1 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Top 5 Worst Polluters</h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="px-6 pb-6">
                  <div className="space-y-3">
                    {sortedHotspots.slice(0, 5).map((hotspot, index) => {
                      const aqiInfo = getAqiInfo(hotspot.aqi);
                      return (
                        <Card 
                          key={hotspot._id} 
                          className={`bg-gray-700 border-gray-600 cursor-pointer transition-all hover:bg-gray-600 hover:scale-[1.02] ${
                            selectedHotspot?._id === hotspot._id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setSelectedHotspot(hotspot)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-mono text-gray-400">#{index + 1}</span>
                                  <Badge className={`${aqiInfo.color} ${aqiInfo.textColor} text-xs px-2 py-0.5`}>
                                    {aqiInfo.status}
                                  </Badge>
                                </div>
                                <h4 className="text-base font-medium text-white mb-1 truncate">
                                  {hotspot.name}
                                </h4>
                                <p className="text-xs text-gray-400 capitalize">
                                  {hotspot.type} • AQI {hotspot.aqi}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {hotspot.source}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Desktop Map */}
          <div className="w-3/4 relative">
            {loading ? (
              <div className="h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading pollution data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-400 text-lg">Error loading data</p>
                  <p className="text-gray-400 mt-2">{error}</p>
                </div>
              </div>
            ) : (
              <DynamicMap hotspots={hotspots} selectedHotspot={selectedHotspot} />
            )}
          </div>
        </div>
      </div>
    </div>
  );

}
