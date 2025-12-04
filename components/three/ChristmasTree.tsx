import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { StarTopper } from './Ornaments';
import * as THREE from 'three';
import { 
  EmeraldMaterial, 
  GoldMaterial, 
  LightStringMaterial, 
  RibbonMaterial, 
  SantaRedMaterial,
  SnowWhiteMaterial,
  GiftWrappingMaterial,
  HeartMaterial 
} from './Materials';
import { useAppState } from '../../context/AppStateContext';

// --- MATH HELPERS ---

const randomVector = (r: number) => {
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(2 * Math.random() - 1);
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// --- GEOMETRY HELPERS ---

const createSockShape = () => {
  const shape = new THREE.Shape();
  // Rounded Santa Boot Shape
  shape.moveTo(0, 0.6);      // Top left
  shape.lineTo(0.35, 0.6);   // Top right
  shape.lineTo(0.4, 0.2);    // Ankle back
  shape.bezierCurveTo(0.4, 0.0, 0.5, 0.0, 0.55, 0.0); // Heel curve start
  shape.lineTo(0.65, 0.0);   // Toe tip top
  shape.bezierCurveTo(0.8, 0.0, 0.8, -0.25, 0.65, -0.25); // Toe curve (rounder)
  shape.lineTo(0.15, -0.25); // Sole
  shape.bezierCurveTo(0.0, -0.25, -0.05, 0.0, 0.05, 0.2); // Heel back
  shape.lineTo(0.0, 0.6);    // Back to top
  return shape;
};

// Shape for the fluffy white top
const createCuffShape = () => {
    const shape = new THREE.Shape();
    const w = 0.45;
    const h = 0.15;
    const x = -0.05;
    const y = 0.55;
    
    shape.moveTo(x, y);
    shape.lineTo(x + w, y);
    shape.lineTo(x + w, y + h);
    shape.lineTo(x, y + h);
    shape.lineTo(x, y);
    return shape;
}

// Shape for Heart Ornaments
const createHeartShape = () => {
  const x = 0, y = 0;
  const shape = new THREE.Shape();
  shape.moveTo( x + 0.25, y + 0.25 );
  shape.bezierCurveTo( x + 0.25, y + 0.25, x + 0.20, y, x, y );
  shape.bezierCurveTo( x - 0.30, y, x - 0.30, y + 0.35, x - 0.30, y + 0.35 );
  shape.bezierCurveTo( x - 0.30, y + 0.55, x - 0.10, y + 0.77, x + 0.25, y + 0.95 );
  shape.bezierCurveTo( x + 0.60, y + 0.77, x + 0.80, y + 0.55, x + 0.80, y + 0.35 );
  shape.bezierCurveTo( x + 0.80, y + 0.35, x + 0.80, y, x + 0.50, y );
  shape.bezierCurveTo( x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25 );
  return shape;
};

// --- CONFIG ---
const NEEDLE_COUNT = 1800;
const LIGHT_COUNT = 150;
const ORNAMENT_COUNT = 80;
const PRESENT_COUNT = 8; 
const SOCK_COUNT = 6;    
const MAX_WISH_SLOTS = 100; // Max visual wishes
const SCATTER_RADIUS = 15;

// --- COMPONENT ---

export const ChristmasTree: React.FC = () => {
  const { isAssembled, rotationSpeed, lightsOn, openSurprise, wishes, openWish } = useAppState();
  const groupRef = useRef<THREE.Group>(null);

  // References
  const needlesRef = useRef<THREE.InstancedMesh>(null);
  const lightsRef = useRef<THREE.InstancedMesh>(null);
  const ornamentsRef = useRef<THREE.InstancedMesh>(null);
  const heartsRef = useRef<THREE.InstancedMesh>(null);
  
  // Presents References
  const presentsRef = useRef<THREE.InstancedMesh>(null);
  const ribbonsRef = useRef<THREE.InstancedMesh>(null);
  const bowsRef = useRef<THREE.InstancedMesh>(null); 
  
  // Socks References
  const socksRef = useRef<THREE.InstancedMesh>(null);
  const cuffsRef = useRef<THREE.InstancedMesh>(null); 

  // --- PRE-CALCULATE DUAL POSITIONS ---
  
  const needleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < NEEDLE_COUNT; i++) {
      const scatterPos = randomVector(SCATTER_RADIUS);
      const scatterRot = new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      const t = i / NEEDLE_COUNT;
      const y = t * 7 - 3.5; 
      const maxR = 2.5; 
      const r = maxR * (1 - t); 
      const angle = t * 50; 
      
      const jitter = 0.2;
      const treePos = new THREE.Vector3(
        Math.cos(angle) * r + (Math.random() - 0.5) * jitter, 
        y, 
        Math.sin(angle) * r + (Math.random() - 0.5) * jitter
      );

      const treeRot = new THREE.Euler(0, -angle, Math.PI / 4 + (Math.random() - 0.5) * 0.5);
      data.push({ scatterPos, scatterRot, treePos, treeRot });
    }
    return data;
  }, []);

  const ornamentData = useMemo(() => {
    const data = [];
    for(let i=0; i<ORNAMENT_COUNT; i++) {
      const scatterPos = randomVector(SCATTER_RADIUS);
      const t = Math.random(); 
      const y = t * 6 - 3.0; 
      const r = 2.2 * (1 - (y + 3.5)/7) + 0.3;
      const angle = Math.random() * Math.PI * 2;
      const treePos = new THREE.Vector3(Math.cos(angle)*r, y, Math.sin(angle)*r);
      const scale = Math.random() * 0.5 + 0.5;
      data.push({ scatterPos, treePos, scale });
    }
    return data;
  }, []);

  const lightsData = useMemo(() => {
    const data = [];
    for(let i=0; i<LIGHT_COUNT; i++) {
       const scatterPos = randomVector(SCATTER_RADIUS);
       const t = i / LIGHT_COUNT;
       const y = t * 7 - 3.4;
       const r = 2.6 * (1 - t) + 0.1;
       const angle = t * 15;
       const treePos = new THREE.Vector3(Math.cos(angle)*r, y, Math.sin(angle)*r);
       data.push({ scatterPos, treePos });
    }
    return data;
  }, []);

  // WISHES (Hearts) - Pre-calculated slots
  const heartSlots = useMemo(() => {
    const data = [];
    for(let i=0; i<MAX_WISH_SLOTS; i++) {
        const scatterPos = randomVector(SCATTER_RADIUS);
        // Distribute nicely around the tree
        const t = (i / MAX_WISH_SLOTS);
        // Use Golden Angle for nice spiral distribution
        const angle = t * Math.PI * 2 * 10; // multiple turns
        const y = t * 6 - 3.0; // From bottom to top
        
        const rBase = 2.2 * (1 - (y + 3.5)/7) + 0.4;
        const r = rBase; // Slightly outer layer

        const treePos = new THREE.Vector3(Math.cos(angle)*r, y, Math.sin(angle)*r);
        
        // Face outwards
        const treeRot = new THREE.Euler(0, -angle - Math.PI/2, 0);

        data.push({ scatterPos, treePos, treeRot });
    }
    // Shuffle slots so they appear randomly, not bottom-up linearly
    return data.sort(() => Math.random() - 0.5);
  }, []);

  // PRESENTS - GROUNDED BELOW TREE
  const presentsData = useMemo(() => {
    const data = [];
    const colors = [
        new THREE.Color("#ff3333"), 
        new THREE.Color("#22aa44"), 
        new THREE.Color("#3366ff"), 
        new THREE.Color("#ffaa00"), 
        new THREE.Color("#aa00aa"), 
    ];

    for(let i=0; i<PRESENT_COUNT; i++) {
        const scatterPos = randomVector(SCATTER_RADIUS);
        const scatterRot = new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, 0);

        // Place on the floor (Y ~ -3.8)
        const y = -3.8; 
        
        // Scatter around the trunk radius (approx 1.0 to 3.0)
        const r = 1.5 + Math.random() * 2.0; 
        
        // Evenly distributed angle + random jitter
        const angle = (i / PRESENT_COUNT) * Math.PI * 2 + (Math.random() - 0.5);

        const treePos = new THREE.Vector3(Math.cos(angle)*r, y, Math.sin(angle)*r);
        const treeRot = new THREE.Euler(0, Math.random() * Math.PI * 2, 0); 
        const scale = 0.6 + Math.random() * 0.4;
        
        const color = colors[Math.floor(Math.random() * colors.length)];

        data.push({ scatterPos, scatterRot, treePos, treeRot, scale, color });
    }
    return data;
  }, []);

  // SOCKS - EVENLY DISTRIBUTED SPIRAL
  const socksData = useMemo(() => {
    const data = [];
    const red = new THREE.Color("#ee1111");
    // Golden angle for even spiral distribution
    const phi = Math.PI * (3 - Math.sqrt(5)); 

    for(let i=0; i<SOCK_COUNT; i++) {
        const scatterPos = randomVector(SCATTER_RADIUS);
        const scatterRot = new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, 0);

        // Distribute Y from bottom (-2.5) to mid-top (1.5)
        const y = ((i / (SOCK_COUNT - 1)) * 4) - 2.5; 
        
        // Radius based on cone shape at height Y
        // Tree height roughly -3.5 to 3.5. 
        // Normalized height h (0 at bottom, 1 at top) = (y + 3.5) / 7
        const normalizedH = (y + 3.5) / 7;
        const maxR = 2.5 * (1 - normalizedH);
        const r = maxR + 0.2; // Slightly offset from branches

        // Spiral angle
        const angle = i * phi * 5; // Multiplier to spin it around

        const treePos = new THREE.Vector3(Math.cos(angle)*r, y, Math.sin(angle)*r);
        // Rotate to face outward + slight dangle
        const treeRot = new THREE.Euler(0, -angle - Math.PI/2, 0);
        
        const scale = 0.5 + Math.random() * 0.3;

        data.push({ scatterPos, scatterRot, treePos, treeRot, scale, color: red });
    }
    return data;
  }, []);


  // --- ANIMATION LOOP ---

  const dummy = new THREE.Object3D();
  const dummy2 = new THREE.Object3D(); 
  const vec3 = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const animRef = useRef({ val: 0 }); 

  useFrame((state, delta) => {
    const target = isAssembled ? 1 : 0;
    animRef.current.val = THREE.MathUtils.lerp(animRef.current.val, target, delta * 2.5);
    const progress = animRef.current.val;

    if (groupRef.current) {
        const speed = isAssembled ? rotationSpeed : rotationSpeed * 0.2;
        groupRef.current.rotation.y += delta * speed;
    }

    // 1. NEEDLES
    if (needlesRef.current) {
      needleData.forEach((data, i) => {
        vec3.lerpVectors(data.scatterPos, data.treePos, progress);
        const qStart = new THREE.Quaternion().setFromEuler(data.scatterRot);
        const qEnd = new THREE.Quaternion().setFromEuler(data.treeRot);
        quat.slerpQuaternions(qStart, qEnd, progress);
        if (progress < 0.5) vec3.y += Math.sin(state.clock.elapsedTime + i) * 0.005;

        dummy.position.copy(vec3);
        dummy.quaternion.copy(quat);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        needlesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      needlesRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. ORNAMENTS
    if (ornamentsRef.current) {
      ornamentData.forEach((data, i) => {
        vec3.lerpVectors(data.scatterPos, data.treePos, progress);
        dummy.position.copy(vec3);
        dummy.rotation.set(0,0,0);
        dummy.scale.setScalar(data.scale);
        dummy.updateMatrix();
        ornamentsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      ornamentsRef.current.instanceMatrix.needsUpdate = true;
    }

    // 3. LIGHTS
    if (lightsRef.current) {
        lightsData.forEach((data, i) => {
            vec3.lerpVectors(data.scatterPos, data.treePos, progress);
            dummy.position.copy(vec3);
            const pulse = lightsOn ? 1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.2 : 1;
            dummy.scale.setScalar(pulse);
            dummy.updateMatrix();
            lightsRef.current!.setMatrixAt(i, dummy.matrix);
        });
        lightsRef.current.instanceMatrix.needsUpdate = true;
    }

    // 4. PRESENTS SYSTEM
    if (presentsRef.current && ribbonsRef.current && bowsRef.current) {
        presentsData.forEach((data, i) => {
            vec3.lerpVectors(data.scatterPos, data.treePos, progress);
            const qStart = new THREE.Quaternion().setFromEuler(data.scatterRot);
            const qEnd = new THREE.Quaternion().setFromEuler(data.treeRot);
            quat.slerpQuaternions(qStart, qEnd, progress);
            
            if(progress < 0.9) quat.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(delta, delta, 0)));

            dummy.position.copy(vec3);
            dummy.quaternion.copy(quat);
            dummy.scale.setScalar(data.scale);
            dummy.updateMatrix();
            
            presentsRef.current!.setMatrixAt(i, dummy.matrix);
            presentsRef.current!.setColorAt(i, data.color);
            ribbonsRef.current!.setMatrixAt(i, dummy.matrix);

            const bowOffset = new THREE.Matrix4().makeTranslation(0, 0.22, 0); 
            const bowScale = new THREE.Matrix4().makeScale(0.5, 0.5, 0.5); 
            const bowRot = new THREE.Matrix4().makeRotationX(Math.PI/2);

            dummy2.matrix.copy(dummy.matrix);
            dummy2.matrix.multiply(bowOffset);
            dummy2.matrix.multiply(bowRot);
            dummy2.matrix.multiply(bowScale);
            
            bowsRef.current!.setMatrixAt(i, dummy2.matrix);
        });
        presentsRef.current.instanceMatrix.needsUpdate = true;
        if (presentsRef.current.instanceColor) presentsRef.current.instanceColor.needsUpdate = true;
        ribbonsRef.current.instanceMatrix.needsUpdate = true;
        bowsRef.current.instanceMatrix.needsUpdate = true;
    }

    // 5. SOCKS SYSTEM
    if (socksRef.current && cuffsRef.current) {
      socksData.forEach((data, i) => {
        vec3.lerpVectors(data.scatterPos, data.treePos, progress);
        const qStart = new THREE.Quaternion().setFromEuler(data.scatterRot);
        const qEnd = new THREE.Quaternion().setFromEuler(data.treeRot);
        quat.slerpQuaternions(qStart, qEnd, progress);

        if (isAssembled) {
           const swing = Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;
           quat.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(swing, 0, swing)));
        }

        dummy.position.copy(vec3);
        dummy.quaternion.copy(quat);
        dummy.scale.setScalar(data.scale);
        dummy.updateMatrix();
        
        socksRef.current!.setMatrixAt(i, dummy.matrix);
        socksRef.current!.setColorAt(i, data.color);
        cuffsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      socksRef.current.instanceMatrix.needsUpdate = true;
      if (socksRef.current.instanceColor) socksRef.current.instanceColor.needsUpdate = true;
      cuffsRef.current.instanceMatrix.needsUpdate = true;
    }

    // 6. HEART ORNAMENTS (WISHES)
    // Only render as many hearts as there are wishes
    if (heartsRef.current && wishes.length > 0) {
        const renderCount = Math.min(wishes.length, MAX_WISH_SLOTS);
        for(let i=0; i<renderCount; i++) {
            const data = heartSlots[i];
            
            vec3.lerpVectors(data.scatterPos, data.treePos, progress);
            const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, 0));
            const qEnd = new THREE.Quaternion().setFromEuler(data.treeRot);
            quat.slerpQuaternions(qStart, qEnd, progress);

            // Gentle wobble for hearts
            const wobble = Math.sin(state.clock.elapsedTime * 2 + i * 10) * 0.1;
            quat.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, wobble)));

            dummy.position.copy(vec3);
            dummy.quaternion.copy(quat);
            dummy.scale.setScalar(0.4); // Heart scale
            dummy.updateMatrix();
            heartsRef.current.setMatrixAt(i, dummy.matrix);
        }
        heartsRef.current.count = renderCount; // IMPORTANT: limit draw count
        heartsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const handlePointerOver = () => document.body.style.cursor = 'pointer';
  const handlePointerOut = () => document.body.style.cursor = 'default';

  return (
    <group ref={groupRef}>
      
      {/* 1. NEEDLES */}
      <instancedMesh ref={needlesRef} args={[undefined, undefined, NEEDLE_COUNT]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} /> 
        <EmeraldMaterial />
      </instancedMesh>

      {/* 2. ORNAMENTS */}
      <instancedMesh ref={ornamentsRef} args={[undefined, undefined, ORNAMENT_COUNT]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <GoldMaterial />
      </instancedMesh>

      {/* 3. LIGHTS */}
      <instancedMesh ref={lightsRef} args={[undefined, undefined, LIGHT_COUNT]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <LightStringMaterial on={lightsOn} />
      </instancedMesh>

      {/* 4. PRESENTS */}
      <instancedMesh 
        ref={presentsRef} 
        args={[undefined, undefined, PRESENT_COUNT]}
        onClick={(e) => {
          e.stopPropagation();
          openSurprise('GIFT');
        }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
         <boxGeometry args={[0.4, 0.4, 0.4]} />
         <GiftWrappingMaterial />
      </instancedMesh>

      <instancedMesh ref={ribbonsRef} args={[undefined, undefined, PRESENT_COUNT]}>
         <boxGeometry args={[0.42, 0.42, 0.05]} />
         <RibbonMaterial />
      </instancedMesh>

      <instancedMesh ref={bowsRef} args={[undefined, undefined, PRESENT_COUNT]}>
         <torusKnotGeometry args={[0.15, 0.04, 64, 8, 2, 3]} />
         <RibbonMaterial />
      </instancedMesh>

      {/* 5. SOCKS */}
      <instancedMesh 
        ref={socksRef} 
        args={[undefined, undefined, SOCK_COUNT]}
        onClick={(e) => {
          e.stopPropagation();
          openSurprise('SOCK');
        }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <extrudeGeometry args={[createSockShape(), { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 }]} />
        <SantaRedMaterial />
      </instancedMesh>

      <instancedMesh ref={cuffsRef} args={[undefined, undefined, SOCK_COUNT]}>
        <extrudeGeometry args={[createCuffShape(), { depth: 0.12, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01 }]} />
        <SnowWhiteMaterial />
      </instancedMesh>

      {/* 6. HEARTS (WISHES) */}
      <instancedMesh 
        ref={heartsRef} 
        args={[undefined, undefined, MAX_WISH_SLOTS]} // Max capacity
        onClick={(e) => {
            e.stopPropagation();
            if (e.instanceId !== undefined && wishes[e.instanceId]) {
                openWish(wishes[e.instanceId]);
            }
        }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
         <extrudeGeometry args={[createHeartShape(), { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 }]} />
         <HeartMaterial />
      </instancedMesh>

      {/* 7. TOPPER */}
      <group scale={isAssembled ? 1 : 0}>
         <StarTopper />
      </group>

    </group>
  );
};