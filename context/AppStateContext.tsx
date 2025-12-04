import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, Wish } from '../types';

export interface Surprise {
  title: string;
  description: string;
  type: 'GIFT' | 'SOCK';
}

interface AppContextProps extends AppState {
  setRotationSpeed: (speed: number) => void;
  setBloomIntensity: (intensity: number) => void;
  toggleLights: () => void;
  addWish: (userText: string, aiResponse: string) => void;
  setGenerating: (isGenerating: boolean) => void;
  setShowWishModal: (show: boolean) => void;
  isAssembled: boolean;
  toggleAssembly: () => void;
  currentSurprise: Surprise | null;
  openSurprise: (type: 'GIFT' | 'SOCK') => void;
  closeSurprise: () => void;
  viewedWish: Wish | null;
  openWish: (wish: Wish) => void;
  closeWish: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const LUXURY_GIFTS = [
  "A Weekend in the Swiss Alps",
  "A Vintage 1920s Gold Watch",
  "Arix Signature Diamond",
  "A Private Jazz Concert",
  "Lifetime Supply of Joy",
  "A Golden Ticket to the Stars",
  "A Bottle of Starlight",
  "An Emerald Necklace"
];

const COZY_SOCK_GIFTS = [
  "A Warm Hug",
  "Hot Chocolate & Marshmallows",
  "A Magic Candy Cane",
  "Freshly Baked Gingerbread",
  "A Cozy Cashmere Scarf",
  "The Sound of Sleigh Bells"
];

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // FIXED DEFAULTS
  const [rotationSpeed, setRotationSpeed] = useState(0.3); // Gentle fixed speed
  const [bloomIntensity, setBloomIntensity] = useState(1.5);
  const [lightsOn, setLightsOn] = useState(true); // Always On
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isGenerating, setGenerating] = useState(false);
  const [showWishModal, setShowWishModal] = useState(false);
  const [isAssembled, setIsAssembled] = useState(false);
  const [currentSurprise, setCurrentSurprise] = useState<Surprise | null>(null);
  const [viewedWish, setViewedWish] = useState<Wish | null>(null);

  const toggleLights = () => setLightsOn(prev => !prev);
  const toggleAssembly = () => setIsAssembled(prev => !prev);

  const addWish = (userText: string, aiResponse: string) => {
    const newWish: Wish = {
      id: crypto.randomUUID(),
      userText,
      aiResponse,
      timestamp: Date.now(),
    };
    setWishes(prev => [newWish, ...prev]);
  };

  const openSurprise = (type: 'GIFT' | 'SOCK') => {
    const pool = type === 'GIFT' ? LUXURY_GIFTS : COZY_SOCK_GIFTS;
    const randomItem = pool[Math.floor(Math.random() * pool.length)];
    
    setCurrentSurprise({
      type,
      title: type === 'GIFT' ? "A Luxury Surprise" : "A Cozy Surprise",
      description: randomItem
    });
  };

  const closeSurprise = () => setCurrentSurprise(null);
  const openWish = (wish: Wish) => setViewedWish(wish);
  const closeWish = () => setViewedWish(null);

  return (
    <AppContext.Provider value={{
      rotationSpeed,
      setRotationSpeed,
      bloomIntensity,
      setBloomIntensity,
      lightsOn,
      toggleLights,
      wishes,
      addWish,
      isGenerating,
      setGenerating,
      showWishModal,
      setShowWishModal,
      isAssembled,
      toggleAssembly,
      currentSurprise,
      openSurprise,
      closeSurprise,
      viewedWish,
      openWish,
      closeWish
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppState must be used within AppStateProvider");
  return context;
};