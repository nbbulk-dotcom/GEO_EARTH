import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationSelectorProps {
  onLocationChange: (location: LocationData) => void;
  initialLocation?: LocationData | null;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  onLocationChange, 
  initialLocation 
}) => {
  const [inputType, setInputType] = useState<'coordinates' | 'city' | 'auto'>('coordinates');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialLocation) {
      setLatitude(initialLocation.latitude.toString());
      setLongitude(initialLocation.longitude.toString());
    }
  }, [initialLocation]);

  const handleCoordinateSubmit = async () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      setError('Please enter valid coordinates');
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError('Coordinates out of valid range');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isValid = await apiService.validateCoordinates(lat, lon);
      if (isValid) {
        onLocationChange({ latitude: lat, longitude: lon });
      } else {
        setError('Invalid coordinates');
      }
    } catch (err) {
      setError('Failed to validate coordinates');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySubmit = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const location = await apiService.resolveLocation(
        undefined, undefined, city, country
      );
      onLocationChange(location);
    } catch (err) {
      setError('Failed to find location');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetect = async () => {
    setLoading(true);
    setError('');

    try {
      const location = await apiService.resolveLocation(
        undefined, undefined, undefined, undefined, true
      );
      onLocationChange(location);
      setLatitude(location.latitude.toString());
      setLongitude(location.longitude.toString());
    } catch (err) {
      setError('Failed to detect location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Location Selection</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ color: 'white', marginRight: '1rem' }}>
          <input
            type="radio"
            checked={inputType === 'coordinates'}
            onChange={() => setInputType('coordinates')}
            style={{ marginRight: '0.5rem' }}
          />
          Coordinates
        </label>
        <label style={{ color: 'white', marginRight: '1rem' }}>
          <input
            type="radio"
            checked={inputType === 'city'}
            onChange={() => setInputType('city')}
            style={{ marginRight: '0.5rem' }}
          />
          City/Country
        </label>
        <label style={{ color: 'white' }}>
          <input
            type="radio"
            checked={inputType === 'auto'}
            onChange={() => setInputType('auto')}
            style={{ marginRight: '0.5rem' }}
          />
          Auto-detect
        </label>
      </div>

      {inputType === 'coordinates' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="number"
              placeholder="Latitude (-90 to 90)"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                marginBottom: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="number"
              placeholder="Longitude (-180 to 180)"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          </div>
          <button
            onClick={handleCoordinateSubmit}
            disabled={loading}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Validating...' : 'Set Location'}
          </button>
        </div>
      )}

      {inputType === 'city' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="City name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                marginBottom: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="text"
              placeholder="Country (optional)"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          </div>
          <button
            onClick={handleCitySubmit}
            disabled={loading}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Searching...' : 'Find Location'}
          </button>
        </div>
      )}

      {inputType === 'auto' && (
        <div>
          <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
            Automatically detect your current location using your device's GPS or IP address.
          </p>
          <button
            onClick={handleAutoDetect}
            disabled={loading}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Detecting...' : 'Auto-detect Location'}
          </button>
        </div>
      )}

      {error && (
        <div style={{ 
          color: '#ff4444', 
          marginTop: '1rem', 
          padding: '0.5rem',
          background: 'rgba(255, 68, 68, 0.1)',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
