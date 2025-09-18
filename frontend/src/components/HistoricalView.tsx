import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface HistoricalEvent {
  event_date: string;
  latitude: number;
  longitude: number;
  magnitude: number;
  depth_km: number;
  predicted_lead_days: number;
  accuracy_percent: number;
  distance_km: number;
}

interface HistoricalViewProps {
  system: string;
  location: LocationData;
  radius: number;
  mode: string;
  dateRange: [string, string];
}

const HistoricalView: React.FC<HistoricalViewProps> = ({
  system,
  location,
  radius,
  mode,
  dateRange
}) => {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [totalEvents, setTotalEvents] = useState<number>(0);

  useEffect(() => {
    if (location) {
      fetchHistoricalData();
    }
  }, [location, radius, mode, dateRange]);

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await apiService.getHistoricalEarthquakeData(
        location.latitude,
        location.longitude,
        radius,
        dateRange[0],
        dateRange[1],
        mode
      );

      if (result.success) {
        setEvents(result.events);
        setTotalEvents(result.total_events);
      } else {
        setError('Failed to fetch historical data');
      }
    } catch (err) {
      setError('Error loading historical data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'csv') => {
    try {
      const result = await apiService.exportData(events, format);
      if (result.success) {
        alert(`Export successful: ${result.filename}`);
      }
    } catch (err) {
      alert('Export failed');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          Loading historical data...
        </div>
        <div style={{ color: '#b0b0b0' }}>
          Analyzing {system} events from {dateRange[0]} to {dateRange[1]}
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
          Error Loading Data
        </div>
        <div>{error}</div>
        <button
          onClick={fetchHistoricalData}
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
          Historical {system.charAt(0).toUpperCase() + system.slice(1)} Analysis
        </h2>
        <div>
          <button
            onClick={() => handleExport('pdf')}
            style={{
              background: '#FF5722',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '0.5rem'
            }}
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport('csv')}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div style={{ 
        color: '#b0b0b0', 
        marginBottom: '2rem',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px'
      }}>
        <p style={{ margin: 0 }}>
          <strong>Analysis Summary:</strong> Found {totalEvents} events within {radius}km of 
          {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
        </p>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          <strong>Date Range:</strong> {dateRange[0]} to {dateRange[1]} | 
          <strong> Mode:</strong> {mode === 'earth' ? 'Earth-based' : 'Combined'}
        </p>
      </div>

      {events.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px'
          }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left' }}>Date</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left' }}>Magnitude</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left' }}>Depth (km)</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left' }}>Lead Days</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left' }}>Accuracy (%)</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left' }}>Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index} style={{ 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <td style={{ color: '#b0b0b0', padding: '1rem' }}>{event.event_date}</td>
                  <td style={{ color: 'white', padding: '1rem', fontWeight: 'bold' }}>
                    {event.magnitude.toFixed(1)}
                  </td>
                  <td style={{ color: '#b0b0b0', padding: '1rem' }}>{event.depth_km.toFixed(1)}</td>
                  <td style={{ color: '#b0b0b0', padding: '1rem' }}>{event.predicted_lead_days}</td>
                  <td style={{ 
                    color: event.accuracy_percent > 80 ? '#4CAF50' : 
                           event.accuracy_percent > 60 ? '#FF9800' : '#ff4444',
                    padding: '1rem',
                    fontWeight: 'bold'
                  }}>
                    {event.accuracy_percent.toFixed(1)}%
                  </td>
                  <td style={{ color: '#b0b0b0', padding: '1rem' }}>{event.distance_km.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
            No historical events found
          </p>
          <p>
            Try adjusting the date range or increasing the analysis radius.
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoricalView;
