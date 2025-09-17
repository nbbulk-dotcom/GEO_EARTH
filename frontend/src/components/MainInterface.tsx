// BRETT MainInterface v3.0.0 - Sequential Navigation Flow
import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import EarthquakeLocationInput from './EarthquakeLocationInput';
import DataSourceStatus from './DataSourceStatus';
import EngineSelection from './EngineSelection';
import PredictionDisplay from './PredictionDisplay';
import CymaticVisualization from './CymaticVisualization';
import RadiusSelector from './RadiusSelector';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

interface MainInterfaceProps {
  onBackToLanding: () => void;
}

const MainInterface: React.FC<MainInterfaceProps> = ({ onBackToLanding: _onBackToLanding }) => {
  const { isAuthenticated, authenticate } = useAuth();
  const { 
    location, 
    setLocation,
    dataSourcesStatus, 
    predictions, 
    isRefreshing,
    lastRefresh,
    nextRefresh
  } = useData();
  const [radiusKm, setRadiusKm] = useState(location?.radius_km || 100);

  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'location',
      title: 'Location Input and Confirmation',
      description: 'Enter your precise geolocation for earthquake prediction analysis.',
      completed: false,
      active: true
    },
    {
      id: 'data',
      title: 'Data Refresh and Synchronization',
      description: 'Refresh and download the latest data for your selected location.',
      completed: false,
      active: false
    },
    {
      id: 'sources',
      title: 'EMF Data Source Selection',
      description: 'Review and confirm electromagnetic data sources for analysis.',
      completed: false,
      active: false
    },
    {
      id: 'engine',
      title: 'Engine Selection and Activation',
      description: 'Choose between BRETTEARTH or BRETTCOMBO (BRETTSPACE) engines.',
      completed: false,
      active: false
    },
    {
      id: 'results',
      title: 'Prediction Results & Visualization',
      description: 'View 21-day earthquake predictions and cymatic analysis.',
      completed: false,
      active: false
    }
  ]);

  const [showCymatic, setShowCymatic] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      authenticate().catch(console.error);
    }
  }, [isAuthenticated, authenticate]);

  useEffect(() => {
    updateStepCompletion();
  }, [location, dataSourcesStatus, predictions]);

  const updateStepCompletion = () => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      
      newSteps.forEach(step => step.active = false);
      
      newSteps[0].completed = !!location;
      newSteps[1].completed = dataSourcesStatus.some(source => source.status === 'active');
      newSteps[2].completed = dataSourcesStatus.filter(source => source.status === 'active').length >= 3;
      newSteps[3].completed = predictions.length > 0;
      newSteps[4].completed = predictions.length > 0;
      
      if (!newSteps[0].completed) {
        newSteps[0].active = true;
      } else if (newSteps[0].completed && !newSteps[1].completed) {
        newSteps[1].active = true;
      } else if (newSteps[1].completed && !newSteps[2].completed) {
        newSteps[2].active = true;
      } else if (newSteps[2].completed && !newSteps[3].completed) {
        newSteps[3].active = true;
      } else if (newSteps[3].completed) {
        newSteps[4].active = true;
      }
      
      console.log('BRETT v3.0.0 Step States:', JSON.stringify(newSteps.map(s => ({ id: s.id, active: s.active, completed: s.completed })), null, 2));
      
      return newSteps;
    });
  };

  const getStepIcon = (step: Step) => {
    if (step.completed) {
      return <CheckCircle className="w-6 h-6 text-green-400" />;
    } else if (step.active) {
      return <RefreshCw className="w-6 h-6 text-yellow-400 animate-spin" />;
    } else {
      return <XCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatTimeUntilRefresh = () => {
    if (!nextRefresh) return 'Unknown';
    
    const now = new Date();
    const next = new Date(nextRefresh);
    const diff = next.getTime() - now.getTime();
    
    if (diff <= 0) return 'Refreshing...';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-6 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-light mb-4 tracking-wider">
            BRETT System Interface
          </h1>
          <p className="text-xl text-gray-300">
            Geological and Electromagnetic Earthquake Prediction Platform
          </p>
          
          <div className="mt-6 flex justify-center items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>Authentication: {isAuthenticated ? 'Active' : 'Inactive'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-yellow-400' : 'text-gray-400'}`} />
              <span>Next Refresh: {formatTimeUntilRefresh()}</span>
            </div>
            
            {lastRefresh && (
              <div className="text-gray-400">
                Last Update: {new Date(lastRefresh).toLocaleTimeString()}
              </div>
            )}
            
          </div>
          
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-yellow-400" />
                System Steps
              </h2>
              
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const shouldShow = step.active || step.completed;
                  
                  if (!shouldShow) return null;
                  
                  return (
                    <div
                      key={step.id}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        step.active
                          ? 'border-yellow-400/50 bg-yellow-400/10'
                          : step.completed
                          ? 'border-green-400/50 bg-green-400/10'
                          : 'border-gray-600/50 bg-gray-800/20'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getStepIcon(step)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-300">
                              {index + 1}
                            </span>
                            <h3 className="text-sm font-semibold text-white truncate">
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
                {/* Step 1: Location Input - Only show when step 1 is active */}
                {steps[0]?.active && (
                  <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                    <EarthquakeLocationInput />
                  </div>
                )}

                {/* Step 2: Data Sources - Only show when step 2 is active */}
                {steps[1]?.active && (
                  <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                    <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
                      <h4 className="text-lg font-semibold text-blue-200 mb-2">📡 Step 2: Data Source Refresh Required</h4>
                      <p className="text-blue-100 text-sm">
                        Please refresh your data sources to ensure you have the latest seismic and electromagnetic data before proceeding to engine activation.
                      </p>
                    </div>
                    <DataSourceStatus />
                  </div>
                )}

                {/* Step 3: EMF Data Source Selection - Only show when step 3 is active */}
                {steps[2]?.active && (
                  <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                    <h3 className="text-xl font-semibold mb-4">EMF Data Source Selection</h3>
                    <p className="text-gray-300">Review and confirm electromagnetic data sources for analysis.</p>
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setSteps(prevSteps => {
                            const newSteps = [...prevSteps];
                            newSteps[2].completed = true;
                            newSteps[2].active = false;
                            newSteps[3].active = true;
                            return newSteps;
                          });
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                      >
                        Confirm Data Sources
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Engine Selection - Only show when step 4 is active */}
                {steps[3]?.active && (
                  <>
                    <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
                      <h4 className="text-lg font-semibold text-blue-200 mb-2">🚀 Step 4: Engine Activation</h4>
                      <p className="text-blue-100 text-sm">
                        All prerequisites completed! You can now activate your preferred earthquake prediction engine.
                      </p>
                    </div>
                    
                    {/* Location Information Block */}
                    {location && (
                      <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                          <MapPin className="w-5 h-5 mr-2 text-yellow-400" />
                          Current Analysis Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Location</div>
                            <div className="text-white font-medium">{location.location_name}</div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Coordinates</div>
                            <div className="text-white font-medium">
                              {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                            </div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Monitoring Radius</div>
                            <div className="text-white font-medium">{location.radius_km} km</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                      <EngineSelection />
                    </div>
                  </>
                )}

                {/* Step 5: Results - Only show when step 5 is active */}
                {steps[4]?.active && predictions.length > 0 && (
                  <>
                    <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                      <PredictionDisplay />
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowCymatic(!showCymatic)}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105"
                      >
                        {showCymatic ? 'Hide' : 'Show'} 3D Cymatic Visualization
                      </button>
                    </div>

                    {showCymatic && (
                      <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                        <CymaticVisualization />
                      </div>
                    )}
                  </>
                )}

                {/* Add location change button when location is set */}
                {location && !steps[0].active && (
                  <div className="flex justify-center">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <button
                          onClick={() => {
                            setSteps(prevSteps => {
                              const newSteps = [...prevSteps];
                              newSteps.forEach(step => {
                                step.active = false;
                                step.completed = false;
                              });
                              newSteps[0].active = true;
                              return newSteps;
                            });
                          }}
                          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                        >
                          Change Location
                        </button>
                      </div>
                      <div className="ml-4 w-48">
                        <RadiusSelector 
                          radius={radiusKm} 
                          onRadiusChange={(radius: number) => {
                            setRadiusKm(radius);
                            if (location) {
                              setLocation({...location, radius_km: radius});
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
        </div>
      </div>
    </div>
  );
};

export default MainInterface;
