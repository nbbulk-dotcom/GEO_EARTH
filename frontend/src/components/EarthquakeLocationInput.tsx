import React, { useState } from 'react';
import { MapPin, Search, Navigation, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useData } from '../contexts/DataContext';

const EarthquakeLocationInput: React.FC = () => {
  const { setLocation } = useData();
  const [inputType, setInputType] = useState<'coordinates' | 'city' | 'auto'>('coordinates');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [radiusKm, setRadiusKm] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let requestData: any = {};

      if (inputType === 'coordinates') {
        if (!latitude || !longitude) {
          throw new Error('Please enter both latitude and longitude');
        }
        requestData = {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        };
      } else if (inputType === 'city') {
        if (!city) {
          throw new Error('Please enter a city name');
        }
        requestData = {
          city,
          country: country || undefined
        };
      } else if (inputType === 'auto') {
        requestData = {
          auto_detect: true
        };
      }

      const response = await axios.post(`${API_BASE_URL}/api/location/resolve`, requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const locationData = {
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        location_name: response.data.location_name,
        radius_km: radiusKm
      };

      setLocation(locationData);
      setIsConfirmed(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Location resolution failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoDetect = async () => {
    setInputType('auto');
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/location/resolve`, {
        auto_detect: true
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const locationData = {
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        location_name: response.data.location_name,
        radius_km: radiusKm
      };

      setLocation(locationData);
      setIsConfirmed(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Auto-detection failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
          <h2 className="text-2xl font-semibold text-white">Earthquake Location Confirmed</h2>
        </div>
        <p className="text-gray-300 mb-2">Earthquake monitoring location has been set successfully.</p>
        <button
          onClick={() => setIsConfirmed(false)}
          className="text-yellow-400 hover:text-yellow-300 underline"
        >
          Change Location
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 flex items-center text-white">
        <MapPin className="w-6 h-6 mr-3 text-yellow-400" />
        Earthquake Location Input and Confirmation
      </h2>

      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setInputType('coordinates')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              inputType === 'coordinates'
                ? 'bg-yellow-600 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Coordinates
          </button>
          <button
            onClick={() => setInputType('city')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              inputType === 'city'
                ? 'bg-yellow-600 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            City/Country
          </button>
        </div>

        <button
          onClick={handleAutoDetect}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Auto-Detect Location
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {inputType === 'coordinates' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 40.7128"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., -74.0060"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                required
              />
            </div>
          </div>
        )}

        {inputType === 'city' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., New York"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Country (Optional)
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., United States"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Monitoring Radius
          </label>
          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
          >
            <option value={100}>100 km</option>
            <option value={200}>200 km</option>
            <option value={500}>500 km</option>
            <option value={1000}>1000 km</option>
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {inputType !== 'auto' && (
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Resolving Location...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Confirm Location
              </>
            )}
          </button>
        )}
      </form>
    </div>
  );
};

export default EarthquakeLocationInput;
