import React, { useState } from 'react';
import { SceneContainer } from './components/SceneContainer';
import { InterfaceOverlay } from './components/InterfaceOverlay';
import { AppStateProvider } from './context/AppStateContext';

const App: React.FC = () => {
  return (
    <AppStateProvider>
      <main className="relative w-full h-screen bg-gradient-to-b from-gray-900 to-emerald-950 overflow-hidden">
        {/* The 3D Layer */}
        <div className="absolute inset-0 z-0">
          <SceneContainer />
        </div>

        {/* The UI Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <InterfaceOverlay />
        </div>
      </main>
    </AppStateProvider>
  );
};

export default App;