import { ThreeElements } from '@react-three/fiber';

export interface Wish {
  id: string;
  userText: string;
  aiResponse: string;
  timestamp: number;
}

export interface AppState {
  rotationSpeed: number;
  bloomIntensity: number;
  lightsOn: boolean;
  wishes: Wish[];
  isGenerating: boolean;
  showWishModal: boolean;
}

export enum MaterialType {
  EMERALD = 'EMERALD',
  GOLD = 'GOLD',
  RUBY = 'RUBY',
}

export interface OrnamentData {
  position: [number, number, number];
  type: MaterialType;
  scale: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}