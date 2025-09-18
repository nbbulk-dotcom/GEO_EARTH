import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import VolcanicCymaticViz from './VolcanicCymaticViz';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface ForecastData {
  date: string;
  magnitude?: number;
  probability: number;
  depth?: number;
  eruption_probability?: number;
  alert_level?: string;
  expected_vei?: number;
  confidence?: number;
}

interface CymaticData {
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

interface LiveViewProps {
  system: string;
  location: LocationData;
  radius: number;
  mode: string;
}

const LiveView: React.FC<LiveViewProps> = ({
  system,
  location,
  radius,
  mode
}) => {
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [cymaticData, setCymaticData] = useState<CymaticData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showCymatic, setShowCymatic] = useState<boolean>(false);

  useEffect(() => {
    if (location) {
      fetchForecastData();
    }
  }, [location, radius, mode, system]);

  const fetchForecastData = async () => {
    setLoading(true);
    setError('');

    try {
      if (system === 'volcanic') {
        const result = await apiService.getVolcanicLiveForecast(
          location.latitude,
          location.longitude,
          radius,
          mode
        );

        if (result.success) {
          setForecast(result.forecast);
          setCymaticData(result.cymatic_data);
        } else {
          setError('Failed to fetch volcanic forecast');
        }
      } else {
        const result = await apiService.getEarthquakeLiveForecast(
          location.latitude,
          location.longitude,
          radius,
          mode
        );

        if (result.success) {
          setForecast(result.forecast);
        } else {
          setError('Failed to fetch earthquake forecast');
        }
      }
    } catch (err) {
      setError('Error loading forecast data');
    } finally {
      setLoading(false);
    }
  };

  const getAlertColor = (level?: string) => {
    switch (level) {
      case 'RED': return '#ff4444';
      case 'ORANGE': return '#FF9800';
      case 'YELLOW': return '#FFEB3B';
      case 'GREEN': return '#4CAF50';
      default: return '#b0b0b0';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability > 70) return '#ff4444';
    if (probability > 40) return '#FF9800';
    if (probability > 20) return '#FFEB3B';
    return '#4CAF50';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          Generating {system} forecast...
        </div>
        <div style={{ color: '#b0b0b0' }}>
          Analyzing 21-day prediction window
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: '#ff4444', 
        padding: '2rem',
        background: 'rgba(255, 68, 68, 0.1)',
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          Error Loading Forecast
        </div>
        <div>{error}</div>
        <button
          onClick={fetchForecastData}
          style={{
            marginTop: '1rem',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: 'white', margin: 0 }}>
          Live {system.charAt(0).toUpperCase() + system.slice(1)} Forecast
        </h2>
        {system === 'volcanic' && cymaticData && (
          <button
            onClick={() => setShowCymatic(!showCymatic)}
            style={{
              background: '#FF5722',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showCymatic ? 'Hide' : 'Show'} Cymatic Visualization
          </button>
        )}
      </div>

      <div style={{ 
        color: '#b0b0b0', 
        marginBottom: '2rem',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px'
      }}>
        <p style={{ margin: 0 }}>
          <strong>Location:</strong> {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
        </p>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          <strong>Radius:</strong> {radius}km | 
          <strong> Mode:</strong> {mode === 'earth' ? 'Earth-based' : 'Combined'} |
          <strong> Forecast Period:</strong> 21 days
        </p>
      </div>

      {showCymatic && cymaticData && (
        <div style={{ 
          marginBottom: '2rem',
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>
            Cymatic Visualization - {cymaticData.magma_type.charAt(0).toUpperCase() + cymaticData.magma_type.slice(1)} Magma
          </h3>
          <VolcanicCymaticViz cymaticData={cymaticData} />
        </div>
      )}

      {forecast.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1rem' 
        }}>
          {forecast.map((day, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <div style={{ 
                color: 'white', 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>
                {new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>

              {system === 'volcanic' ? (
                <>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: '#b0b0b0' }}>Eruption Probability: </span>
                    <span style={{ 
                      color: getProbabilityColor(day.eruption_probability || 0),
                      fontWeight: 'bold'
                    }}>
                      {day.eruption_probability?.toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: '#b0b0b0' }}>Alert Level: </span>
                    <span style={{ 
                      color: getAlertColor(day.alert_level),
                      fontWeight: 'bold'
                    }}>
                      {day.alert_level}
                    </span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: '#b0b0b0' }}>Expected VEI: </span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>
                      {day.expected_vei}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#b0b0b0' }}>Confidence: </span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>
                      {day.confidence?.toFixed(1)}%
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: '#b0b0b0' }}>Magnitude: </span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>
                      {day.magnitude?.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: '#b0b0b0' }}>Probability: </span>
                    <span style={{ 
                      color: getProbabilityColor(day.probability),
                      fontWeight: 'bold'
                    }}>
                      {day.probability.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#b0b0b0' }}>Depth: </span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>
                      {day.depth?.toFixed(1)} km
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          color: '#b0b0b0', 
          padding: '3rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            No forecast data available
          </p>
          <p>
            Unable to generate predictions for the selected location and parameters.
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveView;
