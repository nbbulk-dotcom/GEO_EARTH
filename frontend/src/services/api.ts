import axios from 'axios';
import { HistoricalData, BacktestData, TrainingData, VolcanoLocation } from '../types/historical';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const historicalApi = {
  simulateHistoricalPeriod: async (
    startYear: number,
    endYear: number,
    lat: number,
    lon: number
  ): Promise<HistoricalData> => {
    const response = await api.get(`/historical/simulate/${startYear}/${endYear}`, {
      params: { lat, lon },
    });
    return response.data;
  },

  trainModel: async (dataPath: string, epochs?: number, learningRate?: number): Promise<TrainingData> => {
    const response = await api.post('/historical/train', {
      data_path: dataPath,
      epochs,
      learning_rate: learningRate,
    });
    return response.data;
  },

  runBacktest: async (
    startYear: number,
    endYear: number,
    volcanoLocations: VolcanoLocation[]
  ): Promise<BacktestData> => {
    const response = await api.get(`/historical/backtest/${startYear}/${endYear}`, {
      params: {
        volcano_locations: JSON.stringify(volcanoLocations),
      },
    });
    return response.data;
  },

  runKilauea_Validation: async () => {
    const response = await api.get('/historical/kilauea-validation');
    return response.data;
  },

  ingestUSGSData: async (volcanoIds: string[]) => {
    const response = await api.post('/historical/ingest/usgs', volcanoIds);
    return response.data;
  },

  ingestGVPData: async (startYear: number = 1900, endYear: number = 2023) => {
    const response = await api.post('/historical/ingest/gvp', null, {
      params: { start_year: startYear, end_year: endYear },
    });
    return response.data;
  },

  ingestNOAAData: async (volcanoIds: string[]) => {
    const response = await api.post('/historical/ingest/noaa', volcanoIds);
    return response.data;
  },

  getDataStatus: async () => {
    const response = await api.get('/historical/data-status');
    return response.data;
  },
};

export const volcanicApi = {
  calculateChamberResonance: async (
    chamberVolume: number,
    depth: number,
    magmaViscosity: number = 1000.0
  ) => {
    const response = await api.get('/volcanic/chamber-resonance', {
      params: {
        chamber_volume: chamberVolume,
        depth,
        magma_viscosity: magmaViscosity,
      },
    });
    return response.data;
  },

  calculateConstructiveInterference: async (
    lat: number,
    lon: number,
    depth: number,
    historicalEvents: any[] = []
  ) => {
    const response = await api.get('/volcanic/constructive-interference', {
      params: {
        lat,
        lon,
        depth,
        historical_events: JSON.stringify(historicalEvents),
      },
    });
    return response.data;
  },

  getSpaceVariablesStatus: async () => {
    const response = await api.get('/volcanic/space-variables-status');
    return response.data;
  },

  analyzeVolcanicRegion: async (lat: number, lon: number) => {
    const response = await api.get('/volcanic/regional-analysis', {
      params: { lat, lon },
    });
    return response.data;
  },

  getFrameworkParameters: async () => {
    const response = await api.get('/volcanic/framework-parameters');
    return response.data;
  },
};

export const validationApi = {
  getSystemStatus: async () => {
    const response = await api.get('/validation/system-status');
    return response.data;
  },

  validateUpgrade: async () => {
    const response = await api.get('/validation/validate-upgrade');
    return response.data;
  },

  testSpaceVariables: async () => {
    const response = await api.get('/validation/test-space-variables');
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/validation/health-check');
    return response.data;
  },
};

export default api;
