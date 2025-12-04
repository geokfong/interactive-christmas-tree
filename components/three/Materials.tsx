import React from 'react';
import { MeshStandardMaterial, MeshPhysicalMaterial } from 'three';

// High-fidelity Emerald: Uses physical properties for gem-like appearance
export const EmeraldMaterial = (props: any) => (
  <meshPhysicalMaterial
    color="#004d25"         // Deep, rich green
    emissive="#001a0a"
    emissiveIntensity={0.2}
    roughness={0.15}        // Very smooth
    metalness={0.0}         // Dielectric (stone/gem)
    reflectivity={1.0}
    clearcoat={1.0}         // Polish layer
    clearcoatRoughness={0.1}
    ior={1.6}               // Index of Refraction for Emerald
    thickness={2.0}         // Volume simulation
    attenuationColor="#004d25"
    attenuationDistance={1.0}
    {...props}
  />
);

// High-fidelity Gold: High metalness with specific roughness for "brushed" or "polished" look
export const GoldMaterial = (props: any) => (
  <meshStandardMaterial
    color="#FFD700"
    emissive="#b8860b"
    emissiveIntensity={0.2}
    roughness={0.15}
    metalness={1.0}
    envMapIntensity={1.5}
    {...props}
  />
);

export const RubyMaterial = (props: any) => (
  <meshPhysicalMaterial
    color="#8a0303"
    roughness={0.1}
    metalness={0.1}
    transmission={0.2}
    thickness={1}
    clearcoat={1}
    {...props}
  />
);

// NEW: Adorable Rose Gold/Pink for Wishes
export const HeartMaterial = (props: any) => (
  <meshPhysicalMaterial
    color="#ff99aa"
    emissive="#550011"
    emissiveIntensity={0.2}
    roughness={0.2}
    metalness={0.8}
    clearcoat={1.0}
    {...props}
  />
);

// UPDATED: Bright, cheerful gift wrapping material
export const GiftWrappingMaterial = (props: any) => (
  <meshStandardMaterial
    roughness={0.3}
    metalness={0.1}
    emissiveIntensity={0.1}
    {...props}
  />
);

// UPDATED: Shiny satin ribbon - Brighter Gold
export const RibbonMaterial = (props: any) => (
  <meshPhysicalMaterial
    color="#FFD700"
    roughness={0.2}
    metalness={0.8}
    clearcoat={0.8}
    emissive="#b8860b"
    emissiveIntensity={0.2}
    {...props}
  />
);

// NEW: Bright Santa Red
export const SantaRedMaterial = (props: any) => (
  <meshStandardMaterial
    color="#ff2222"
    roughness={0.6}
    metalness={0.1}
    emissive="#550000"
    emissiveIntensity={0.2}
    {...props}
  />
);

// NEW: Fluffy Snow White (for sock cuffs)
export const SnowWhiteMaterial = (props: any) => (
  <meshStandardMaterial
    color="#ffffff"
    roughness={1.0}
    metalness={0.0}
    emissive="#aaaaaa"
    emissiveIntensity={0.3}
    {...props}
  />
);

export const LightStringMaterial = ({ on }: { on: boolean }) => (
  <meshStandardMaterial
    color={on ? "#fffae0" : "#222"}
    emissive={on ? "#ffbd2e" : "#000"}
    emissiveIntensity={on ? 8 : 0}
    toneMapped={false} 
  />
);