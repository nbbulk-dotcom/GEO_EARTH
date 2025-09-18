import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface ForecastData {
  date: string;
  magnitude?: number;
  probability: number;
  depth?: number;
  eruption_probability?: number;
  alert_level?: string;
  expected_vei?: number;
  confidence?: number;
}

export interface HistoricalEvent {
  event_date: string;
  latitude: number;
  longitude: number;
  magnitude: number;
  depth_km: number;
  predicted_lead_days: number;
  accuracy_percent: number;
  distance_km: number;
}

export interface CymaticData {
  magma_type: string;
  wave_patterns: Array<{
    frequency: number;
    amplitude: number;
    phase: number;
    color: string;
  }>;
  sphere_radius: number;
  animation_speed: number;
  color_scheme: string;
  render_mode: string;
}

export const apiService = {
  async getSystems(): Promise<string[]> {
    const response = await api.get('/api/systems');
    return response.data;
  },

  async getEarthquakeLiveForecast(
    lat: number,
    lon: number,
    radius: number = 100,
    mode: string = 'earth'
  ): Promise<{ success: boolean; forecast: ForecastData[]; mode: string; location: LocationData }> {
    const response = await api.get('/api/earthquake/live/forecast', {
      params: { lat, lon, radius, mode }
    });
    return response.data;
  },

  async getVolcanicLiveForecast(
    lat: number,
    lon: number,
    radius: number = 100,
    mode: string = 'earth'
  ): Promise<{
    success: boolean;
    forecast: ForecastData[];
    cymatic_data: CymaticData;
    mode: string;
    location: LocationData;
  }> {
    const response = await api.get('/api/volcanic/live/forecast', {
      params: { lat, lon, radius, mode }
    });
    return response.data;
  },

  async getHistoricalEarthquakeData(
    lat: number,
    lon: number,
    radius: number = 100,
    startDate: string,
    endDate: string,
    mode: string = 'earth'
  ): Promise<{
    success: boolean;
    events: HistoricalEvent[];
    total_events: number;
    location: LocationData;
  }> {
    const response = await api.get('/api/earthquake/historical', {
      params: { lat, lon, radius, start_date: startDate, end_date: endDate, mode }
    });
    return response.data;
  },

  async exportData(data: any[], format: 'pdf' | 'csv'): Promise<{
    success: boolean;
    filename: string;
    format: string;
  }> {
    const response = await api.post('/api/export', {
      data,
      format
    });
    return response.data;
  },

  async getDocumentation(): Promise<{
    manuals: Array<{ name: string; url: string }>;
    specifications: Record<string, any>;
    user_rights: Record<string, string>;
    admin_contact: {
      name: string;
      phone: string;
      email: string;
      website: string;
    };
  }> {
    const response = await api.get('/api/docs');
    return response.data;
  },

  async resolveLocation(
    lat?: number,
    lon?: number,
    city?: string,
    country?: string,
    autoDetect?: boolean
  ): Promise<LocationData> {
    const response = await api.post('/api/location/resolve', {
      latitude: lat,
      longitude: lon,
      city,
      country,
      auto_detect: autoDetect
    });
    return response.data;
  },

  async validateCoordinates(lat: number, lon: number): Promise<boolean> {
    try {
      const response = await api.post('/api/location/validate', {
        latitude: lat,
        longitude: lon
      });
      return response.data.valid;
    } catch {
      return false;
    }
  }
};

export default api;
