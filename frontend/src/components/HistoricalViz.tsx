import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { HistoricalData, VolcanoLocation } from '../types/historical';

interface HistoricalVizProps {
  historicalData: HistoricalData | null;
  selectedVolcano: VolcanoLocation | null;
  timeRange: [number, number];
}

const HistoricalViz: React.FC<HistoricalVizProps> = ({
  historicalData,
  selectedVolcano,
  timeRange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff6b35, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    createVolcanicChamber(scene);

    if (historicalData) {
      createCymaticPatterns(scene, historicalData);
    }

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      setAnimationTime(prev => prev + 0.01);
      
      scene.traverse((object) => {
        if (object.userData.isCymatic) {
          object.rotation.y += 0.005;
          object.rotation.z += 0.003;
          
          const scale = 1 + Math.sin(animationTime * 2) * 0.1;
          object.scale.setScalar(scale);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current && historicalData) {
      const objectsToRemove: THREE.Object3D[] = [];
      sceneRef.current.traverse((object) => {
        if (object.userData.isCymatic) {
          objectsToRemove.push(object);
        }
      });
      objectsToRemove.forEach(obj => sceneRef.current?.remove(obj));

      createCymaticPatterns(sceneRef.current, historicalData);
    }
  }, [historicalData]);

  const createVolcanicChamber = (scene: THREE.Scene) => {
    const chamberGeometry = new THREE.SphereGeometry(1, 32, 32);
    const chamberMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b0000,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    });
    const chamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
    chamber.position.set(0, -1, 0);
    scene.add(chamber);

    const conduitGeometry = new THREE.CylinderGeometry(0.2, 0.5, 3, 16);
    const conduitMaterial = new THREE.MeshPhongMaterial({
      color: 0xff4500,
      transparent: true,
      opacity: 0.6,
    });
    const conduit = new THREE.Mesh(conduitGeometry, conduitMaterial);
    conduit.position.set(0, 0.5, 0);
    scene.add(conduit);
  };

  const createCymaticPatterns = (scene: THREE.Scene, data: HistoricalData) => {
    const interferenceEvents = data.simulation?.interference_patterns?.interference_events || [];
    
    interferenceEvents.slice(0, 10).forEach((event, index) => {
      const geometry = new THREE.IcosahedronGeometry(0.3, 2);
      
      const intensity = event.intensity || 0.5;
      const color = new THREE.Color().setHSL(0.1 - intensity * 0.1, 1, 0.5 + intensity * 0.3);
      
      const material = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.7,
        wireframe: false,
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      
      const angle = (index / interferenceEvents.length) * Math.PI * 2;
      const radius = 2 + index * 0.1;
      sphere.position.set(
        Math.cos(angle) * radius,
        Math.sin(index * 0.5) * 2,
        Math.sin(angle) * radius
      );
      
      sphere.userData.isCymatic = true;
      sphere.userData.intensity = intensity;
      scene.add(sphere);

      createParticleSystem(scene, sphere.position, intensity);
    });
  };

  const createParticleSystem = (scene: THREE.Scene, position: THREE.Vector3, intensity: number) => {
    const particleCount = Math.floor(intensity * 100) + 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = position.x + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0xff6b35,
      size: 0.05,
      transparent: true,
      opacity: intensity,
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.userData.isCymatic = true;
    scene.add(particles);
  };

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
      }} 
    />
  );
};

export default HistoricalViz;
