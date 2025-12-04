import React, { useMemo } from 'react';
import { GoldMaterial } from './Materials';
import { Sphere, Torus, Extrude } from '@react-three/drei';
import * as THREE from 'three';

interface BaubleProps {
  position: [number, number, number];
  scale?: number;
}

export const GoldBauble: React.FC<BaubleProps> = ({ position, scale = 1 }) => {
  return (
    <Sphere args={[0.15 * scale, 32, 32]} position={position}>
      <GoldMaterial />
    </Sphere>
  );
};

export const StarTopper: React.FC = () => {
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 0.6;
    const innerRadius = 0.25;
    
    // Rotate -Math.PI/2 to point upwards
    const offsetAngle = -Math.PI / 2;

    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const a = (i / (points * 2)) * Math.PI * 2 + offsetAngle;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const extrudeSettings = {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2
  };

  return (
    <group position={[0, 4.0, 0]}>
        {/* Main 5-Point Star */}
        <mesh rotation={[0, 0, 0]}>
             <extrudeGeometry args={[starShape, extrudeSettings]} />
             <meshStandardMaterial 
                color="#FFD700" 
                emissive="#ffcc00" 
                emissiveIntensity={2} 
                toneMapped={false}
                roughness={0.1}
                metalness={1}
            />
        </mesh>
        
        {/* Central Glow Core */}
        <mesh position={[0, 0, 0.1]}>
             <sphereGeometry args={[0.15, 16, 16]} />
             <meshBasicMaterial color="#fff" />
        </mesh>

        {/* Halo Ring */}
        <Torus args={[0.7, 0.01, 16, 100]} rotation={[0, 0, 0]}>
             <meshStandardMaterial 
                color="#FFF" 
                emissive="#FFF" 
                emissiveIntensity={5} 
                toneMapped={false}
            />
        </Torus>
        
        {/* Shine Light */}
        <pointLight intensity={3} distance={5} color="#ffd700" />
    </group>
  );
};