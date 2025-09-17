import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import axios from 'axios';
import { useData } from '../contexts/DataContext';

interface CymaticData {
  wave_field: number[][][];
  phase_lock_points: number[][];
  resonance_overlap_percent: number;
  alert_level: string;
  day: number;
}

const WaveField: React.FC<{ data: CymaticData; time: number }> = ({ data, time }) => {
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
          positions[i + 2] = waveValue * 2 + Math.sin(time + x * 0.1 + y * 0.1) * 0.5;
        }
      }
      geometry.attributes.position.needsUpdate = true;
    }
    
    return geometry;
  }, [data.wave_field, time]);

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

  return (
    <group>
      <mesh ref={meshRef} geometry={waveGeometry}>
        <meshPhongMaterial 
          color={data.alert_level === 'CRITICAL' ? '#ff4444' : '#4444ff'}
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

const CymaticVisualization: React.FC = () => {
  const { location } = useData();
  const [cymaticData, setCymaticData] = useState<CymaticData | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [time, setTime] = useState(0);
  const [alertSound, setAlertSound] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
      
      console.log(`Cymatic API Request for Day ${day}:`, requestData);
      
      const response = await axios.post(`${API_BASE_URL}/api/prediction/cymatic`, requestData, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        timeout: 30000
      });
      
      console.log(`Cymatic API Response for Day ${day}:`, response.data);
      
      if (response.data && typeof response.data.resonance_overlap_percent === 'number') {
        console.log(`Day ${day} validation: ${response.data.resonance_overlap_percent}% overlap, ${response.data.alert_level} alert`);
        setCymaticData(response.data);
      } else {
        console.error(`Invalid cymatic data received for Day ${day}:`, response.data);
        setError('Invalid data received from server');
      }
    } catch (err: any) {
      console.error(`Cymatic API Error for Day ${day}:`, err);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center text-white">
          <div className="w-6 h-6 mr-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded"></div>
          3D Cymatic Visualization
        </h2>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              soundEnabled ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 hover:bg-gray-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(parseInt(e.target.value))}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
          >
            {Array.from({ length: 21 }, (_, i) => i + 1).map(day => (
              <option key={day} value={day}>Day {day}</option>
            ))}
          </select>
        </div>
      </div>

      {cymaticData?.alert_level === 'CRITICAL' && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg animate-pulse">
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

      <div className="bg-black rounded-lg overflow-hidden" style={{ height: '600px' }}>
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
            
            <WaveField data={cymaticData} time={time} />
            
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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Resonance Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Overlap Percentage:</span>
                <span className={`font-bold ${
                  cymaticData.resonance_overlap_percent > 52 ? 'text-red-400' : 
                  cymaticData.resonance_overlap_percent > 35 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {cymaticData.resonance_overlap_percent.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Alert Level:</span>
                <span className={`font-bold ${
                  cymaticData.alert_level === 'CRITICAL' ? 'text-red-400' : 
                  cymaticData.alert_level === 'HIGH' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {cymaticData.alert_level}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phase Lock Points:</span>
                <span className="text-white">{cymaticData.phase_lock_points.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Visualization Controls</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• Mouse: Rotate view</p>
              <p>• Scroll: Zoom in/out</p>
              <p>• Drag: Pan view</p>
              <p>• Red spheres: Phase lock points</p>
              <p>• Wave field: Real resonance data</p>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Technical Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Analysis Day:</span>
                <span className="text-white">{cymaticData.day}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Wave Layers:</span>
                <span className="text-white">36</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Update Rate:</span>
                <span className="text-white">60 FPS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Data Source:</span>
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
    </div>
  );
};

export default CymaticVisualization;
