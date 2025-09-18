import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import VolcanicMainInterface from '../components/VolcanicMainInterface';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as any;

describe('VolcanicMainInterface', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: {
        forecast: [
          { day: 1, probability: 0.3, risk_level: 'LOW', magnitude_estimate: 2.1, confidence: 0.8 },
          { day: 2, probability: 0.35, risk_level: 'LOW', magnitude_estimate: 2.2, confidence: 0.82 }
        ],
        seismic: [{ magnitude: 2.1, time: '2025-09-18T08:00:00Z', depth: 5000 }],
        gas: [{ so2_ppm: 150, co2_ppm: 400, time: '2025-09-18T08:00:00Z' }],
        alerts: []
      }
    });
  });

  test('renders volcanic dashboard', async () => {
    render(<VolcanicMainInterface onBackToLanding={() => {}} />);
    
    expect(screen.getByText('BRETT VOLCANIC FORECAST v1.0')).toBeDefined();
    expect(screen.getByText('21-Day Eruption Forecast')).toBeDefined();
    expect(screen.getByText('Real-time Seismic Activity')).toBeDefined();
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/volcano/forecast/kilauea');
    });
  });

  test('handles volcano selection change', async () => {
    render(<VolcanicMainInterface onBackToLanding={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('kilauea')).toBeDefined();
    });
  });

  test('displays system status', () => {
    render(<VolcanicMainInterface onBackToLanding={() => {}} />);
    
    expect(screen.getByText('85%')).toBeDefined();
    expect(screen.getByText('ML Accuracy')).toBeDefined();
    expect(screen.getByText('<1s')).toBeDefined();
    expect(screen.getByText('Prediction Latency')).toBeDefined();
  });

  test('handles API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));
    
    render(<VolcanicMainInterface onBackToLanding={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch volcanic data/)).toBeDefined();
    });
  });
});
