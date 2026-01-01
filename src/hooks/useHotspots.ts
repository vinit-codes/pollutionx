'use client';

import { useState, useEffect } from 'react';

export interface Hotspot {
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

export interface HotspotsResponse {
  success: boolean;
  data: Hotspot[];
  pagination: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
}

export interface UseHotspotsOptions {
  limit?: number;
  page?: number;
  type?: string;
  minAqi?: number;
  maxAqi?: number;
}

export const useHotspots = (options: UseHotspotsOptions = {}) => {
  const [data, setData] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<HotspotsResponse['pagination'] | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.page) params.append('page', options.page.toString());
      if (options.type) params.append('type', options.type);
      if (options.minAqi) params.append('minAqi', options.minAqi.toString());
      if (options.maxAqi) params.append('maxAqi', options.maxAqi.toString());

      const url = `/api/hotspots${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: HotspotsResponse = await response.json();
      
      if (result.success) {
        setData(result.data);
        setPagination(result.pagination);
      } else {
        throw new Error('Failed to fetch hotspots');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setData([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.page) params.append('page', options.page.toString());
        if (options.type) params.append('type', options.type);
        if (options.minAqi) params.append('minAqi', options.minAqi.toString());
        if (options.maxAqi) params.append('maxAqi', options.maxAqi.toString());

        const url = `/api/hotspots${params.toString() ? `?${params.toString()}` : ''}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: HotspotsResponse = await response.json();
        
        if (result.success) {
          setData(result.data);
          setPagination(result.pagination);
        } else {
          throw new Error('Failed to fetch hotspots');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setData([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options.limit, options.page, options.type, options.minAqi, options.maxAqi]);

  return {
    hotspots: data,
    loading,
    error,
    pagination,
    refetch,
  };
};
