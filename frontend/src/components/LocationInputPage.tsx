import React, { useState } from 'react';
import { MapPin, RotateCcw } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface LocationInputPageProps {
  onNext: () => void;
}

const LocationInputPage: React.FC<LocationInputPageProps> = ({ onNext }) => {
  const { location, setLocation } = useData();
  const [inputMode, setInputMode] = useState<'coordinates' | 'city'>('coordinates');
  const [latitude, setLatitude] = useState(location?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(location?.longitude?.toString() || '');
  const [cityName, setCityName] = useState(location?.location_name || '');
  const [country, setCountry] = useState('');
  const [radiusKm, setRadiusKm] = useState(location?.radius_km || 100);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = () => {
    setLatitude('');
    setLongitude('');
    setCityName('');
    setCountry('');
    setRadiusKm(100);
  };

  const handleConfirmLocation = async () => {
    setIsLoading(true);
    
    try {
      let lat: number, lng: number, locationName: string;
      
      if (inputMode === 'coordinates') {
        lat = parseFloat(latitude);
        lng = parseFloat(longitude);
        locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      } else {
        lat = 48.8566; // Paris coordinates as example
        lng = 2.3522;
        locationName = cityName + (country ? `, ${country}` : '');
      }
      
      setLocation({
        latitude: lat,
        longitude: lng,
        location_name: locationName,
        radius_km: radiusKm
      });
      
      onNext();
    } catch (error) {
      console.error('Error setting location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidCoordinates = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  const isValidCity = () => {
    return cityName.trim().length > 0;
  };

  const canConfirm = inputMode === 'coordinates' ? isValidCoordinates() : isValidCity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white">
      <style>{`
        .progress-bar {
          background: rgba(30, 41, 59, 0.8);
          border-bottom: 1px solid rgba(148, 163, 184, 0.3);
          padding: 1rem 0;
        }
        .progress-steps {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .progress-step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        .progress-step.active {
          color: #3b82f6;
          font-weight: 600;
        }
        .progress-step.completed {
          color: #10b981;
        }
        .progress-step-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .progress-step.active .progress-step-number {
          background: #3b82f6;
          color: white;
        }
        .progress-step.completed .progress-step-number {
          background: #10b981;
          color: white;
        }
        .progress-step:not(.active):not(.completed) .progress-step-number {
          background: rgba(148, 163, 184, 0.3);
          color: #94a3b8;
        }
        .main-container {
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          max-width: 600px;
          margin: 4rem auto;
        }
        .toggle-buttons {
          display: flex;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 2rem;
        }
        .toggle-button {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          color: #94a3b8;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        .toggle-button.active {
          background: #3b82f6;
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #e2e8f0;
          font-weight: 500;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
        }
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          cursor: pointer;
        }
        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-secondary {
          background: rgba(148, 163, 184, 0.2);
          color: #e2e8f0;
          border: 1px solid rgba(148, 163, 184, 0.3);
        }
        .btn-secondary:hover {
          background: rgba(148, 163, 184, 0.3);
        }
        .btn-primary {
          background: #3b82f6;
          color: white;
          flex: 1;
        }
        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="progress-bar">
        <div className="progress-steps">
          <div className="progress-step active">
            <div className="progress-step-number">1</div>
            <span>Location Input and Confirmation</span>
          </div>
          <div className="progress-step">
            <div className="progress-step-number">2</div>
            <span>Data Sources</span>
          </div>
          <div className="progress-step">
            <div className="progress-step-number">3</div>
            <span>Engine Selection</span>
          </div>
          <div className="progress-step">
            <div className="progress-step-number">4</div>
            <span>Engine Activation</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="main-container">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">
              Earthquake Location Input and Confirmation
            </h1>
            <p className="text-slate-300">
              Enter your precise geolocation for earthquake prediction analysis.
            </p>
          </div>

          <div className="toggle-buttons">
            <button
              className={`toggle-button ${inputMode === 'coordinates' ? 'active' : ''}`}
              onClick={() => setInputMode('coordinates')}
            >
              Coordinates
            </button>
            <button
              className={`toggle-button ${inputMode === 'city' ? 'active' : ''}`}
              onClick={() => setInputMode('city')}
            >
              City/Country
            </button>
          </div>

          {inputMode === 'coordinates' ? (
            <>
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g., 40.7128"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  step="any"
                  min="-90"
                  max="90"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g., -74.0060"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  step="any"
                  min="-180"
                  max="180"
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., New York"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country (auto-detected)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Monitoring Radius</label>
            <select
              className="form-select"
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseInt(e.target.value))}
            >
              <option value={100}>100 km</option>
              <option value={200}>200 km</option>
              <option value={500}>500 km</option>
              <option value={1000}>1000 km</option>
            </select>
          </div>

          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleReset}>
              <RotateCcw size={16} />
              Reset to Default
            </button>
            <button
              className="btn btn-primary"
              onClick={handleConfirmLocation}
              disabled={!canConfirm || isLoading}
            >
              <MapPin size={16} />
              {isLoading ? 'Confirming...' : 'Confirm Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInputPage;
