import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CymaticData {
  magma_type: string;
  wave_patterns: Array<{
    frequency: number;
    amplitude: number;
    phase: number;
    color: string;
  }>;
  sphere_radius: number;
  animation_speed: number;
  color_scheme: string;
  render_mode: string;
}

interface VolcanicCymaticVizProps {
  cymaticData: CymaticData;
}

const CymaticSphere: React.FC<{ cymaticData: CymaticData }> = ({ cymaticData }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    uniform float frequency1;
    uniform float frequency2;
    uniform float frequency3;
    uniform float amplitude1;
    uniform float amplitude2;
    uniform float amplitude3;
    
    void main() {
      vPosition = position;
      vNormal = normal;
      
      vec3 pos = position;
      float wave1 = sin(pos.x * frequency1 + time) * amplitude1;
      float wave2 = sin(pos.y * frequency2 + time * 1.5) * amplitude2;
      float wave3 = sin(pos.z * frequency3 + time * 0.8) * amplitude3;
      
      pos += normal * (wave1 + wave2 + wave3) * 0.1;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    
    void main() {
      float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
      
      vec3 color = mix(color1, color2, sin(vPosition.x * 2.0 + time) * 0.5 + 0.5);
      color = mix(color, color3, sin(vPosition.y * 3.0 + time * 1.2) * 0.5 + 0.5);
      
      gl_FragColor = vec4(color * intensity, 0.8);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime * cymaticData.animation_speed;
    }
  });

  const uniforms = {
    time: { value: 0 },
    frequency1: { value: cymaticData.wave_patterns[0]?.frequency || 7.83 },
    frequency2: { value: cymaticData.wave_patterns[1]?.frequency || 14.3 },
    frequency3: { value: cymaticData.wave_patterns[2]?.frequency || 20.8 },
    amplitude1: { value: cymaticData.wave_patterns[0]?.amplitude || 1.0 },
    amplitude2: { value: cymaticData.wave_patterns[1]?.amplitude || 0.8 },
    amplitude3: { value: cymaticData.wave_patterns[2]?.amplitude || 0.6 },
    color1: { value: new THREE.Color(cymaticData.wave_patterns[0]?.color || '#FF4444') },
    color2: { value: new THREE.Color(cymaticData.wave_patterns[1]?.color || '#FF8844') },
    color3: { value: new THREE.Color(cymaticData.wave_patterns[2]?.color || '#FFFF44') }
  };

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[cymaticData.sphere_radius, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const VolcanicCymaticViz: React.FC<VolcanicCymaticVizProps> = ({ cymaticData }) => {
  return (
    <div style={{ 
      width: '100%', 
      height: '400px',
      background: 'radial-gradient(circle, #1a1a2e 0%, #000000 100%)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#ff4444" />
        
        <CymaticSphere cymaticData={cymaticData} />
        
        <mesh position={[0, 0, -2]}>
          <planeGeometry args={[10, 10]} />
          <meshBasicMaterial color="#0a0a0a" transparent opacity={0.3} />
        </mesh>
      </Canvas>
      
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1rem',
        color: 'white',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        fontSize: '0.9rem'
      }}>
        <div><strong>Magma Type:</strong> {cymaticData.magma_type}</div>
        <div><strong>Frequencies:</strong> {cymaticData.wave_patterns.map(p => p.frequency.toFixed(1)).join(', ')} Hz</div>
      </div>
    </div>
  );
};

export default VolcanicCymaticViz;
