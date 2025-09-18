import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LocationSelector from './LocationSelector';
import RadiusSelector from './RadiusSelector';
import ModeSelector from './ModeSelector';
import HistoricalView from './HistoricalView';
import LiveView from './LiveView';
import { uiConfigService } from '../services/ui_config';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

const MainDashboard: React.FC = () => {
  const { system } = useParams<{ system: string }>();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [radius, setRadius] = useState<number>(100);
  const [mode, setMode] = useState<string>('earth');
  const [isHistorical, setIsHistorical] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[string, string]>(['2020-01-01', '2023-12-31']);
  const [isLocked, setIsLocked] = useState<boolean>(true);

  useEffect(() => {
    loadUIConfig();
  }, []);

  const loadUIConfig = async () => {
    const config = uiConfigService.loadFromLocalStorage();
    if (config) {
      if (config.lastLocation) {
        setLocation(config.lastLocation);
      }
    }
    setIsLocked(uiConfigService.isUILocked());
  };

  const saveUIConfig = async () => {
    if (location) {
      await uiConfigService.updateConfig({
        selectedSystem: system,
        lastLocation: location
      });
    }
  };

  useEffect(() => {
    if (location) {
      saveUIConfig();
    }
  }, [location, system]);

  const systemConfig = {
    earthquake: {
      title: 'BRETT Earthquake Dashboard',
      color: '#4CAF50'
    },
    volcanic: {
      title: 'BRETT Volcanic Dashboard',
      color: '#FF5722'
    }
  };

  const config = systemConfig[system as keyof typeof systemConfig] || systemConfig.earthquake;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {config.title}
          </h1>
          <p style={{ color: '#b0b0b0', fontSize: '1.1rem' }}>
            Advanced {system} prediction and analysis system
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <LocationSelector 
              onLocationChange={setLocation}
              initialLocation={location}
            />
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <RadiusSelector 
              value={radius}
              onChange={setRadius}
            />
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <ModeSelector 
              value={mode}
              onChange={setMode}
            />
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: 'white', marginRight: '1rem' }}>
              <input
                type="radio"
                checked={!isHistorical}
                onChange={() => setIsHistorical(false)}
                style={{ marginRight: '0.5rem' }}
              />
              Live Forecast
            </label>
            <label style={{ color: 'white' }}>
              <input
                type="radio"
                checked={isHistorical}
                onChange={() => setIsHistorical(true)}
                style={{ marginRight: '0.5rem' }}
              />
              Historical Analysis
            </label>
          </div>

          {isHistorical && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                Date Range:
              </label>
              <input
                type="date"
                value={dateRange[0]}
                onChange={(e) => setDateRange([e.target.value, dateRange[1]])}
                style={{ marginRight: '1rem', padding: '0.5rem' }}
              />
              <input
                type="date"
                value={dateRange[1]}
                onChange={(e) => setDateRange([dateRange[0], e.target.value])}
                style={{ padding: '0.5rem' }}
              />
            </div>
          )}
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '2rem'
        }}>
          {location ? (
            isHistorical ? (
              <HistoricalView
                system={system || 'earthquake'}
                location={location}
                radius={radius}
                mode={mode}
                dateRange={dateRange}
              />
            ) : (
              <LiveView
                system={system || 'earthquake'}
                location={location}
                radius={radius}
                mode={mode}
              />
            )
          ) : (
            <div style={{ textAlign: 'center', color: '#b0b0b0', padding: '3rem' }}>
              <p style={{ fontSize: '1.2rem' }}>
                Please select a location to begin analysis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
