import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { AlertTriangle, Volume2, VolumeX, Download, Settings } from 'lucide-react';
import axios from 'axios';
import { useData } from '../contexts/DataContext';

interface CymaticData {
  wave_field: number[][][];
  phase_lock_points: number[][];
  resonance_overlap_percent: number;
  alert_level: string;
  day: number;
}

interface CymaticVisualizationPageProps {
  onBack: () => void;
}

const WaveField: React.FC<{ data: CymaticData; time: number; waveAmplitude: number; frequencyRange: [number, number]; visualizationMode: string }> = ({ 
  data, 
  time, 
  waveAmplitude, 
  frequencyRange, 
  visualizationMode 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.1;
      meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
    }
    
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
    }
  });

  const waveGeometry = React.useMemo(() => {
    const geometry = new THREE.PlaneGeometry(10, 10, 49, 49);
    const positions = geometry.attributes.position.array as Float32Array;
    
    if (data.wave_field && data.wave_field.length > 0) {
      for (let i = 0; i < positions.length; i += 3) {
        const x = Math.floor((positions[i] + 5) * 5);
        const y = Math.floor((positions[i + 1] + 5) * 5);
        
        if (x >= 0 && x < 50 && y >= 0 && y < 50 && data.wave_field[x] && data.wave_field[x][y]) {
          const waveValue = data.wave_field[x][y][0] || 0;
          const frequency = frequencyRange[0] + (frequencyRange[1] - frequencyRange[0]) * Math.random();
          positions[i + 2] = waveValue * waveAmplitude + Math.sin(time * frequency + x * 0.1 + y * 0.1) * 0.5;
        }
      }
      geometry.attributes.position.needsUpdate = true;
    }
    
    return geometry;
  }, [data.wave_field, time, waveAmplitude, frequencyRange]);

  const phaseLockPoints = React.useMemo(() => {
    if (!data.phase_lock_points) return [];
    
    return data.phase_lock_points.map((point, index) => (
      <mesh key={index} position={[point[0], point[1], point[2]]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial 
          color={data.alert_level === 'CRITICAL' ? '#ff0000' : '#ffff00'} 
          transparent 
          opacity={0.8}
        />
      </mesh>
    ));
  }, [data.phase_lock_points, data.alert_level]);

  const getMaterialColor = () => {
    switch (visualizationMode) {
      case 'seismic':
        return data.alert_level === 'CRITICAL' ? '#ff4444' : '#4444ff';
      case 'electromagnetic':
        return data.alert_level === 'CRITICAL' ? '#ff6644' : '#44ff66';
      case 'harmonic':
        return data.alert_level === 'CRITICAL' ? '#ff44ff' : '#ffff44';
      default:
        return data.alert_level === 'CRITICAL' ? '#ff4444' : '#4444ff';
    }
  };

  return (
    <group>
      <mesh ref={meshRef} geometry={waveGeometry}>
        <meshPhongMaterial 
          color={getMaterialColor()}
          wireframe 
          transparent 
          opacity={0.7}
        />
      </mesh>
      
      {phaseLockPoints}
      
      <Text
        position={[0, 6, 0]}
        fontSize={0.5}
        color={data.alert_level === 'CRITICAL' ? '#ff0000' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
      >
        Resonance Overlap: {data.resonance_overlap_percent.toFixed(1)}%
      </Text>
      
      {data.alert_level === 'CRITICAL' && (
        <Text
          position={[0, 5, 0]}
          fontSize={0.8}
          color="#ff0000"
          anchorX="center"
          anchorY="middle"
        >
          🚨 RED ALERT 🚨
        </Text>
      )}
    </group>
  );
};

const CymaticVisualizationPage: React.FC<CymaticVisualizationPageProps> = ({ onBack }) => {
  const { location } = useData();
  const [cymaticData, setCymaticData] = useState<CymaticData | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [time, setTime] = useState(0);
  const [alertSound, setAlertSound] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [waveAmplitude, setWaveAmplitude] = useState(2.0);
  const [frequencyRange, setFrequencyRange] = useState<[number, number]>([0.1, 1.0]);
  const [visualizationMode, setVisualizationMode] = useState('seismic');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.016);
    }, 16);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location) {
      fetchCymaticData(selectedDay);
    }
  }, [location, selectedDay]);

  useEffect(() => {
    if (cymaticData?.alert_level === 'CRITICAL' && soundEnabled && !alertSound) {
      setAlertSound(true);
      playAlertSound();
    } else if (cymaticData?.alert_level !== 'CRITICAL') {
      setAlertSound(false);
    }
  }, [cymaticData?.alert_level, soundEnabled]);

  const fetchCymaticData = async (day: number) => {
    if (!location) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const requestData = {
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          radius_km: location.radius_km
        },
        day: day
      };
      
      const response = await axios.post(`${API_BASE_URL}/api/prediction/cymatic`, requestData, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        timeout: 30000
      });
      
      if (response.data && typeof response.data.resonance_overlap_percent === 'number') {
        setCymaticData(response.data);
      } else {
        setError('Invalid data received from server');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch cymatic data');
    } finally {
      setIsLoading(false);
    }
  };

  const playAlertSound = () => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.5);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + 1.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.5);
  };

  const exportVisualization = () => {
    console.log('Exporting visualization...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white">
      <style>{`
        .main-container {
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          max-width: 1400px;
          margin: 2rem auto;
        }
        .controls-panel {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .control-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .control-label {
          min-width: 120px;
          color: #e2e8f0;
          font-weight: 500;
        }
        .control-input {
          flex: 1;
          max-width: 200px;
        }
        .day-selector {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
          gap: 0.5rem;
          margin: 1rem 0;
        }
        .day-button {
          padding: 0.5rem;
          border: 1px solid rgba(148, 163, 184, 0.3);
          background: rgba(15, 23, 42, 0.6);
          color: #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }
        .day-button:hover {
          border-color: #3b82f6;
        }
        .day-button.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }
        .visualization-container {
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          height: 600px;
          margin-bottom: 2rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        .stat-card {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          padding: 1.5rem;
        }
        .stat-title {
          font-weight: 600;
          color: white;
          margin-bottom: 1rem;
        }
        .stat-content {
          font-size: 0.875rem;
          color: #94a3b8;
          line-height: 1.5;
        }
        .alert-banner {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          animation: pulse 2s infinite;
        }
        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        .btn-primary:hover {
          background: #2563eb;
        }
        .btn-secondary {
          background: rgba(148, 163, 184, 0.2);
          color: #e2e8f0;
          border: 1px solid rgba(148, 163, 184, 0.3);
        }
        .btn-secondary:hover {
          background: rgba(148, 163, 184, 0.3);
        }
        .btn-success {
          background: #10b981;
          color: white;
        }
        .btn-success:hover {
          background: #059669;
        }
        .btn-danger {
          background: #ef4444;
          color: white;
        }
        .btn-danger:hover {
          background: #dc2626;
        }
      `}</style>

      <div className="container mx-auto px-6">
        <div className="main-container">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></div>
              3D Cymatic Visualization
            </h1>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`btn ${soundEnabled ? 'btn-success' : 'btn-secondary'}`}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                {soundEnabled ? 'Sound On' : 'Sound Off'}
              </button>
              
              <button
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="btn btn-secondary"
              >
                <Settings size={16} />
                Advanced
              </button>
              
              <button
                onClick={exportVisualization}
                className="btn btn-primary"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {cymaticData?.alert_level === 'CRITICAL' && (
            <div className="alert-banner">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-400 mr-3 animate-bounce" />
                <div>
                  <span className="text-red-200 font-bold text-lg">🚨 RED ALERT - CRITICAL RESONANCE DETECTED 🚨</span>
                  <p className="text-red-100 mt-1">
                    Constructive resonance overlap exceeds 52% threshold. Enhanced seismic monitoring recommended.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="controls-panel">
            <div className="control-group">
              <span className="control-label">Time Window:</span>
              <div className="day-selector">
                {Array.from({ length: 21 }, (_, i) => i + 1).map(day => (
                  <button
                    key={day}
                    className={`day-button ${selectedDay === day ? 'active' : ''}`}
                    onClick={() => setSelectedDay(day)}
                  >
                    Day {day}
                  </button>
                ))}
              </div>
            </div>

            {showAdvancedSettings && (
              <>
                <div className="control-group">
                  <label className="control-label">Wave Amplitude:</label>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={waveAmplitude}
                    onChange={(e) => setWaveAmplitude(parseFloat(e.target.value))}
                    className="control-input"
                  />
                  <span className="text-sm text-gray-300">{waveAmplitude.toFixed(1)}</span>
                </div>

                <div className="control-group">
                  <label className="control-label">Frequency Range:</label>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={frequencyRange[1]}
                    onChange={(e) => setFrequencyRange([frequencyRange[0], parseFloat(e.target.value)])}
                    className="control-input"
                  />
                  <span className="text-sm text-gray-300">{frequencyRange[0].toFixed(1)} - {frequencyRange[1].toFixed(1)} Hz</span>
                </div>

                <div className="control-group">
                  <label className="control-label">Visualization Mode:</label>
                  <select
                    value={visualizationMode}
                    onChange={(e) => setVisualizationMode(e.target.value)}
                    className="control-input bg-gray-800 border border-gray-600 rounded text-white p-2"
                  >
                    <option value="seismic">Seismic Wave Field</option>
                    <option value="electromagnetic">Electromagnetic Field</option>
                    <option value="harmonic">Harmonic Resonance</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="visualization-container">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                  <p className="text-gray-400">Generating 3D cymatic visualization...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-red-400">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <p>{error}</p>
                </div>
              </div>
            ) : cymaticData ? (
              <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4444ff" />
                
                <WaveField 
                  data={cymaticData} 
                  time={time} 
                  waveAmplitude={waveAmplitude}
                  frequencyRange={frequencyRange}
                  visualizationMode={visualizationMode}
                />
                
                <OrbitControls 
                  enablePan={true} 
                  enableZoom={true} 
                  enableRotate={true}
                  maxDistance={30}
                  minDistance={5}
                />
              </Canvas>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No cymatic data available</p>
              </div>
            )}
          </div>

          {cymaticData && (
            <div className="stats-grid">
              <div className="stat-card">
                <h4 className="stat-title">Resonance Analysis</h4>
                <div className="stat-content">
                  <div className="flex justify-between mb-2">
                    <span>Overlap Percentage:</span>
                    <span className={`font-bold ${
                      cymaticData.resonance_overlap_percent > 52 ? 'text-red-400' : 
                      cymaticData.resonance_overlap_percent > 35 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {cymaticData.resonance_overlap_percent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Alert Level:</span>
                    <span className={`font-bold ${
                      cymaticData.alert_level === 'CRITICAL' ? 'text-red-400' : 
                      cymaticData.alert_level === 'HIGH' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {cymaticData.alert_level}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phase Lock Points:</span>
                    <span className="text-white">{cymaticData.phase_lock_points.length}</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <h4 className="stat-title">Visualization Controls</h4>
                <div className="stat-content">
                  <p>• Mouse: Rotate view</p>
                  <p>• Scroll: Zoom in/out</p>
                  <p>• Drag: Pan view</p>
                  <p>• Red spheres: Phase lock points</p>
                  <p>• Wave field: Real resonance data</p>
                </div>
              </div>

              <div className="stat-card">
                <h4 className="stat-title">Technical Details</h4>
                <div className="stat-content">
                  <div className="flex justify-between mb-2">
                    <span>Analysis Day:</span>
                    <span className="text-white">{cymaticData.day}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Wave Layers:</span>
                    <span className="text-white">36</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Update Rate:</span>
                    <span className="text-white">60 FPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Source:</span>
                    <span className="text-white">Real-time</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-purple-900/30 border border-purple-500/50 rounded-lg">
            <h4 className="font-semibold text-white mb-2 flex items-center">
              <div className="w-4 h-4 mr-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></div>
              About Cymatic Visualization
            </h4>
            <p className="text-purple-100 text-sm">
              This 3D visualization displays real-time electromagnetic resonance patterns overlaid on your selected location. 
              The wave field represents 36-layer fractal interference patterns, while red spheres indicate phase lock points. 
              When constructive resonance overlap exceeds 52%, a critical alert is triggered with visual and audio warnings.
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <button className="btn btn-secondary" onClick={onBack}>
              Back to Predictions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CymaticVisualizationPage;
