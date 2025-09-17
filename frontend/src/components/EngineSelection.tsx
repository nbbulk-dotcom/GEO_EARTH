// BRETT EngineSelection v3.0.0 - Earth System Engine Selection
import React, { useState } from 'react';
import { Zap, Rocket, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useData } from '../contexts/DataContext';

const EngineSelection: React.FC = () => {
  const { location, setPredictions } = useData();
  const [selectedEngine, setSelectedEngine] = useState<'brettearth' | 'brettcombo' | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const handleEngineSelection = async (engine: 'brettearth' | 'brettcombo') => {
    setSelectedEngine(engine);
    setError('');

    await runCalculation(engine);
  };


  const runCalculation = async (engine: 'brettearth' | 'brettcombo') => {
    if (!location) return;

    setIsCalculating(true);
    setError('');

    try {
      const endpoint = engine === 'brettearth' ? 'brettearth' : 'brettcombo';
      
      const response = await axios.post(`${API_BASE_URL}/api/prediction/${endpoint}`, {
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          radius_km: location.radius_km
        },
        engine_type: engine.toUpperCase(),
        live_mode: true
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (engine === 'brettcombo') {
        setPredictions(response.data.combined_predictions);
      } else {
        setPredictions(response.data.predictions);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || `${engine.toUpperCase()} calculation failed`;
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setIsCalculating(false);
    }
  };


  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 flex items-center text-white">
        <Zap className="w-6 h-6 mr-3 text-yellow-400" />
        Engine Selection and Activation
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border border-green-500/50 rounded-lg p-6 hover:border-green-400/70 transition-all duration-300 cursor-pointer"
             onClick={() => handleEngineSelection('brettearth')}>
          <div className="flex items-center mb-4">
            <Zap className="w-8 h-8 text-green-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">BRETTEARTH ENGINE</h3>
          </div>
          
          <p className="text-gray-300 mb-4">
            Terrestrial earthquake prediction using 8 EVAR subroutines and GENERIC_MODEL_B calculations.
          </p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-green-300">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Magnetometer Analysis
            </div>
            <div className="flex items-center text-green-300">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Schumann Resonance Monitoring
            </div>
            <div className="flex items-center text-green-300">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Lightning Activity Analysis
            </div>
            <div className="flex items-center text-green-300">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Geological Data Integration
            </div>
          </div>
          
          <button
            disabled={isCalculating && selectedEngine === 'brettearth'}
            className="w-full mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50"
          >
            {isCalculating && selectedEngine === 'brettearth' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Calculating...
              </div>
            ) : (
              'Activate BRETTEARTH'
            )}
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/50 rounded-lg p-6 hover:border-purple-400/70 transition-all duration-300 cursor-pointer"
             onClick={() => handleEngineSelection('brettcombo')}>
          <div className="flex items-center mb-4">
            <Rocket className="w-8 h-8 text-purple-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">BRETTCOMBO</h3>
          </div>
          
          <p className="text-gray-300 mb-4">
            Combined BRETTEARTH + BRETTSPACE engines with blockchain authentication and GENERIC_MODEL_A.
          </p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-purple-300">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              All BRETTEARTH Features
            </div>
            <div className="flex items-center text-purple-300">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Space Weather Analysis
            </div>
            <div className="flex items-center text-purple-300">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Solar Activity Monitoring
            </div>
            <div className="flex items-center text-purple-300">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              3D Tetrahedron Array
            </div>
          </div>
          
          
          <button
            disabled={isCalculating && selectedEngine === 'brettcombo'}
            className="w-full mt-4 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50"
          >
            {isCalculating && selectedEngine === 'brettcombo' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Calculating...
              </div>
            ) : (
              'Activate BRETTCOMBO'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-200 font-medium">Calculation Error</span>
          </div>
          <p className="text-red-100 mt-1">{error}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
        <h4 className="font-semibold text-white mb-2">Engine Comparison</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-green-400 font-medium">BRETTEARTH:</span>
            <p className="text-gray-300">
              Focuses on terrestrial electromagnetic and geological data for earthquake prediction.
            </p>
          </div>
          <div>
            <span className="text-purple-400 font-medium">BRETTCOMBO:</span>
            <p className="text-gray-300">
              Combines terrestrial and space weather data for enhanced prediction accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineSelection;
