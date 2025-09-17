import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface LocationData {
  latitude: number;
  longitude: number;
  location_name: string;
  radius_km: number;
}

interface DataSource {
  source_name: string;
  status: string;
  last_update: string | null;
  error_message: string | null;
  reliability_percent: number;
}


interface DataContextType {
  location: LocationData | null;
  setLocation: (location: LocationData) => void;
  dataSourcesStatus: DataSource[];
  predictions: any[];
  setPredictions: (predictions: any[]) => void;
  isRefreshing: boolean;
  lastRefresh: string | null;
  nextRefresh: string | null;
  refreshDataSources: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [dataSourcesStatus, setDataSourcesStatus] = useState<DataSource[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [nextRefresh, setNextRefresh] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const refreshDataSources = async () => {
    if (!location) return;

    try {
      setIsRefreshing(true);
      
      const response = await axios.post(`${API_BASE_URL}/api/sources/refresh`, {
        latitude: location.latitude,
        longitude: location.longitude,
        radius_km: location.radius_km
      });

      if (response.data.success) {
        setLastRefresh(new Date().toISOString());
        
        const nextUpdate = new Date();
        nextUpdate.setMinutes(nextUpdate.getMinutes() + 20);
        setNextRefresh(nextUpdate.toISOString());
        
        await fetchDataSourcesStatus();
      }
    } catch (error) {
      console.error('Failed to refresh data sources:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchDataSourcesStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sources/status`);
      setDataSourcesStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch data sources status:', error);
      setDataSourcesStatus([]);
    }
  };

  useEffect(() => {
    fetchDataSourcesStatus();
    
    const interval = setInterval(fetchDataSourcesStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location) {
      refreshDataSources();
    }
  }, [location]);

  const value: DataContextType = {
    location,
    setLocation,
    dataSourcesStatus,
    predictions,
    setPredictions,
    isRefreshing,
    lastRefresh,
    nextRefresh,
    refreshDataSources
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
