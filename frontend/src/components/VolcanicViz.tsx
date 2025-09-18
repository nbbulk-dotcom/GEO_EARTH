import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface VolcanicVizProps {
  data: any[]
  resonanceData?: any
}

interface CymaticSphereProps {
  resonanceData: any
  waveAmplitude: number
  frequencyRange: [number, number]
}

const CymaticSphere: React.FC<CymaticSphereProps> = ({ 
  resonanceData, 
  waveAmplitude, 
  frequencyRange 
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const geometryRef = useRef<THREE.SphereGeometry>(null)
  
  useFrame((state) => {
    if (meshRef.current && geometryRef.current) {
      const time = state.clock.elapsedTime
      const intensity = resonanceData?.probability || 0.5
      
      meshRef.current.rotation.x = time * 0.5 * intensity
      meshRef.current.rotation.y = time * 0.3 * intensity
      
      const positions = geometryRef.current.attributes.position
      const vertex = new THREE.Vector3()
      
      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i)
        const distance = vertex.length()
        
        const wave1 = Math.sin(distance * frequencyRange[0] + time * 2) * waveAmplitude
        const wave2 = Math.cos(distance * frequencyRange[1] + time * 1.5) * waveAmplitude * 0.5
        const wave3 = Math.sin(distance * 7.83 + time) * waveAmplitude * 0.3  // Schumann resonance
        
        const displacement = (wave1 + wave2 + wave3) * intensity
        vertex.normalize().multiplyScalar(2 + displacement)
        
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z)
      }
      
      positions.needsUpdate = true
      
      const hue = 0.1 - intensity * 0.1  // Red to orange based on intensity
      const saturation = 0.8 + intensity * 0.2
      const lightness = 0.4 + intensity * 0.3
      
      const color = new THREE.Color().setHSL(hue, saturation, lightness)
      ;(meshRef.current.material as THREE.MeshStandardMaterial).color = color
      
      const opacity = 0.6 + (resonanceData?.confidence || 0.5) * 0.4
      ;(meshRef.current.material as THREE.MeshStandardMaterial).opacity = opacity
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry 
        ref={geometryRef}
        args={[2, 64, 64]} 
      />
      <meshStandardMaterial 
        wireframe={true}
        transparent={true}
        opacity={0.8}
        color="#ff4444"
      />
    </mesh>
  )
}

const ResonanceParticles: React.FC<{ count: number; resonanceData: any }> = ({ 
  count, 
  resonanceData 
}) => {
  const pointsRef = useRef<THREE.Points>(null)
  
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime
      const intensity = resonanceData?.probability || 0.5
      
      pointsRef.current.rotation.y = time * 0.1 * intensity
      
      const positions = pointsRef.current.geometry.attributes.position
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const radius = 3 + Math.sin(time + i * 0.1) * intensity
        const theta = (i / count) * Math.PI * 2 + time * 0.5
        const phi = Math.acos(2 * (i / count) - 1)
        
        positions.array[i3] = radius * Math.sin(phi) * Math.cos(theta)
        positions.array[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions.array[i3 + 2] = radius * Math.cos(phi)
      }
      
      positions.needsUpdate = true
    }
  })

  const particlePositions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const radius = 3
    const theta = (i / count) * Math.PI * 2
    const phi = Math.acos(2 * (i / count) - 1)
    
    particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    particlePositions[i3 + 2] = radius * Math.cos(phi)
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffaa00"
        transparent={true}
        opacity={0.6}
      />
    </points>
  )
}

const VolcanicViz: React.FC<VolcanicVizProps> = ({ data, resonanceData }) => {
  const [waveAmplitude, setWaveAmplitude] = useState(0.2)
  const [frequencyRange, setFrequencyRange] = useState<[number, number]>([5, 10])
  const [showParticles, setShowParticles] = useState(true)
  
  const currentResonance = resonanceData || data[0] || {}
  
  const getAlertLevel = (probability: number) => {
    if (probability >= 0.8) return 'CRITICAL'
    if (probability >= 0.6) return 'HIGH'
    if (probability >= 0.4) return 'ELEVATED'
    return 'NORMAL'
  }
  
  const alertLevel = getAlertLevel(currentResonance.probability || 0)
  
  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-4 p-4 bg-gray-700/50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Wave Amplitude: {waveAmplitude.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={waveAmplitude}
              onChange={(e) => setWaveAmplitude(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Frequency Range: {frequencyRange[0]}-{frequencyRange[1]} Hz
            </label>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={frequencyRange[1]}
              onChange={(e) => setFrequencyRange([frequencyRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showParticles}
                onChange={(e) => setShowParticles(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-300">Show Resonance Particles</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Alert Status */}
      <div className={`mb-4 p-3 rounded-lg border ${
        alertLevel === 'CRITICAL' ? 'bg-red-900/30 border-red-500' :
        alertLevel === 'HIGH' ? 'bg-orange-900/30 border-orange-500' :
        alertLevel === 'ELEVATED' ? 'bg-yellow-900/30 border-yellow-500' :
        'bg-green-900/30 border-green-500'
      }`}>
        <div className="flex items-center justify-between">
          <span className="font-medium">Resonance Alert Level: {alertLevel}</span>
          <span className="text-sm">
            Probability: {((currentResonance.probability || 0) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
      
      {/* 3D Visualization */}
      <div style={{ width: '100%', height: '500px' }} className="bg-black rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.4} color="#ff4444" />
          
          <CymaticSphere 
            resonanceData={currentResonance} 
            waveAmplitude={waveAmplitude}
            frequencyRange={frequencyRange}
          />
          
          {showParticles && (
            <ResonanceParticles 
              count={200} 
              resonanceData={currentResonance}
            />
          )}
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>
      
      {/* Statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700/50 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-blue-400">
            {((currentResonance.interference_factor || 1) * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-400">Interference</div>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-green-400">
            {((currentResonance.confidence || 0.5) * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-400">Confidence</div>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-yellow-400">
            {(currentResonance.sun_zenith_angle || 45).toFixed(1)}°
          </div>
          <div className="text-xs text-gray-400">Sun Zenith</div>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-purple-400">
            VEI {(currentResonance.magnitude_estimate || 2.0).toFixed(1)}
          </div>
          <div className="text-xs text-gray-400">Est. Magnitude</div>
        </div>
      </div>
    </div>
  )
}

export default VolcanicViz
