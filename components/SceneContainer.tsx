import React, { Suspense, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Stars, Sparkles, Lightformer, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { ChristmasTree } from './three/ChristmasTree';
import { useAppState } from '../context/AppStateContext';
import * as THREE from 'three';

// --- BACKGROUND ANIMATIONS ---

const ShootingStars = () => {
    const starsRef = useRef<THREE.InstancedMesh>(null);
    const count = 5; // Reduced count significantly for rarity
    const dummy = useMemo(() => new THREE.Object3D(), []);
    
    // Store state for each star
    const starData = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            pos: new THREE.Vector3(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 30 + 10,
                -30 - Math.random() * 20
            ),
            speed: 30 + Math.random() * 30, // Faster
            scale: 5 + Math.random() * 10,  // Longer streaks
            active: false
        }));
    }, []);

    useFrame((state, delta) => {
        if (!starsRef.current) return;

        starData.forEach((star, i) => {
            if (!star.active) {
                // Very low chance to spawn for "occasionally" feel
                // Approx 0.2% chance per frame (every few seconds)
                if (Math.random() < 0.002) {
                    star.active = true;
                    star.pos.set(
                        -50, // Start far left
                        5 + Math.random() * 20, // High up
                        -20 - Math.random() * 30
                    );
                } else {
                    // Hide
                    dummy.position.set(0, -1000, 0);
                    dummy.updateMatrix();
                    starsRef.current!.setMatrixAt(i, dummy.matrix);
                    return;
                }
            }

            // Move
            star.pos.x += star.speed * delta;
            star.pos.y -= star.speed * 0.1 * delta; // Slight slope down

            // Check bounds
            if (star.pos.x > 50) {
                star.active = false;
            }

            dummy.position.copy(star.pos);
            // Rotate to match direction (streaks are horizontal-ish)
            dummy.rotation.z = -0.1; 
            dummy.scale.set(star.scale, 0.15, 0.15); // Long streak
            dummy.updateMatrix();
            starsRef.current!.setMatrixAt(i, dummy.matrix);
        });
        starsRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={starsRef} args={[undefined, undefined, count]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color="#ccf" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </instancedMesh>
    );
};

// --- SCENE ---

const SceneContent: React.FC = () => {
    const { bloomIntensity } = useAppState();

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 1, 9]} fov={50} />
            <OrbitControls 
                enablePan={false} 
                minPolarAngle={Math.PI / 3} 
                maxPolarAngle={Math.PI / 2}
                minDistance={5}
                maxDistance={14}
                autoRotate={false}
            />

            {/* Cinematic Lighting - Main Scene Lights */}
            <ambientLight intensity={0.2} color="#001e10" />
            <spotLight 
                position={[10, 10, 10]} 
                angle={0.5} 
                penumbra={1} 
                intensity={2} 
                color="#ffd700" 
                castShadow 
            />
            <pointLight position={[-5, 2, -5]} intensity={1} color="#00ff88" />
            <pointLight position={[5, -2, 5]} intensity={0.5} color="#ffaa00" />

            {/* Procedural Environment for Gold Reflections */}
            <Environment resolution={512}>
                <group rotation={[-Math.PI / 4, -0.3, 0]}>
                    <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                    <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
                    <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
                    <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 10, 1]} />
                    <Lightformer intensity={5} color="#ffb700" rotation-y={-Math.PI / 2} position={[-10, 2, 0]} scale={[20, 10, 1]} />
                </group>
            </Environment>

            {/* Background Atmosphere */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={200} scale={15} size={3} speed={0.4} opacity={0.4} color="#ffd700" />
            
            <ShootingStars />

            {/* The Main Subject */}
            <ChristmasTree />

            {/* Post Processing for Luxury Glow */}
            <EffectComposer disableNormalPass>
                <Bloom 
                    luminanceThreshold={1.1} 
                    mipmapBlur 
                    intensity={bloomIntensity} 
                    radius={0.6}
                />
                <Vignette eskil={false} offset={0.1} darkness={0.6} />
                <Noise opacity={0.02} />
            </EffectComposer>
        </>
    );
};

export const SceneContainer: React.FC = () => {
  return (
    <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ antialias: false, toneMappingExposure: 1.5 }}
        className="w-full h-full"
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
};