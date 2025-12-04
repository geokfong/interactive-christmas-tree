import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { generateChristmasBlessing } from '../services/geminiService';

// SVG Icons
const Icons = {
    Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>,
    Gift: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-amber-500 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>,
    Heart: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-rose-400 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>,
};

export const InterfaceOverlay: React.FC = () => {
  const { 
    addWish, 
    isGenerating, 
    setGenerating, 
    showWishModal, 
    setShowWishModal,
    isAssembled,
    toggleAssembly,
    currentSurprise,
    closeSurprise,
    viewedWish,
    closeWish
  } = useAppState();

  const [wishInput, setWishInput] = useState("");

  const handleGenerateBlessing = async () => {
    if (!wishInput.trim()) return;
    setGenerating(true);
    
    // Simulate slight network feel + animation
    const response = await generateChristmasBlessing(wishInput);
    
    addWish(wishInput, response);
    setGenerating(false);
    setWishInput("");
    setShowWishModal(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 pointer-events-none font-serif text-white">

      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="text-left">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 drop-shadow-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
            Merry Christmas 2025
          </h1>
        </div>
      </div>

      {/* Surprise Gift Modal */}
      {currentSurprise && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto transition-all duration-500">
           <div className="bg-gradient-to-b from-emerald-900 to-black border border-amber-500/30 p-12 rounded-2xl max-w-md w-full text-center shadow-2xl transform scale-100 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                  <Icons.Gift />
                  <h3 className="text-2xl font-playfair text-amber-300 mb-2">{currentSurprise.title}</h3>
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent my-4"></div>
                  <p className="text-white text-xl font-light italic mb-8">"{currentSurprise.description}"</p>
                  
                  <button 
                    onClick={closeSurprise}
                    className="px-8 py-2 bg-transparent border border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-black transition-all rounded-full uppercase text-sm tracking-widest"
                  >
                    Collect Gift
                  </button>
              </div>
           </div>
        </div>
      )}

      {/* Read Wish Modal */}
      {viewedWish && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto transition-all duration-500">
           <div className="bg-gradient-to-b from-rose-950 to-black border border-rose-400/30 p-10 rounded-2xl max-w-md w-full text-center shadow-2xl transform scale-100 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                  <Icons.Heart />
                  <h3 className="text-xl font-playfair text-rose-200 mb-4 opacity-80">A Christmas Wish</h3>
                  <p className="text-white text-2xl font-medium italic mb-6">"{viewedWish.userText}"</p>
                  
                  <div className="w-full bg-rose-900/30 p-4 rounded-lg border border-rose-500/20 mb-8">
                    <p className="text-amber-200 text-lg font-serif">"{viewedWish.aiResponse}"</p>
                  </div>
                  
                  <button 
                    onClick={closeWish}
                    className="px-8 py-2 bg-transparent border border-rose-400/50 text-rose-300 hover:bg-rose-500 hover:text-white transition-all rounded-full uppercase text-sm tracking-widest"
                  >
                    Close
                  </button>
              </div>
           </div>
        </div>
      )}

      {/* Make a Wish Modal */}
      {showWishModal && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
           <div className="bg-black/80 border border-emerald-500/30 p-8 rounded-xl max-w-lg w-full shadow-2xl">
              <h3 className="text-2xl font-playfair text-emerald-300 mb-6 text-center">Make a Wish</h3>
              <textarea 
                value={wishInput}
                onChange={(e) => setWishInput(e.target.value)}
                placeholder="What is your heart's desire this season?"
                className="w-full bg-emerald-950/50 border border-emerald-500/30 rounded-lg p-4 text-emerald-100 placeholder-emerald-700 focus:outline-none focus:border-amber-500 transition-colors h-32 resize-none mb-6"
              />
              <div className="flex gap-4 justify-center">
                 <button 
                    onClick={() => setShowWishModal(false)}
                    className="px-6 py-2 text-emerald-400 hover:text-emerald-200 transition-colors"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={handleGenerateBlessing}
                    disabled={isGenerating}
                    className="px-8 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-black font-bold rounded-lg hover:from-amber-500 hover:to-yellow-500 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] disabled:opacity-50"
                 >
                    {isGenerating ? "Consulting the Stars..." : "Send Wish"}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="flex flex-col items-center gap-6 pointer-events-auto mb-8">
         {/* Main Action Button */}
         <button 
            onClick={toggleAssembly}
            className={`
                group relative px-12 py-4 rounded-full text-lg font-bold tracking-widest uppercase transition-all duration-700
                ${isAssembled 
                    ? 'bg-transparent border border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/30' 
                    : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black shadow-[0_0_40px_rgba(251,191,36,0.4)] hover:shadow-[0_0_60px_rgba(251,191,36,0.6)] hover:scale-105'
                }
            `}
         >
            {isAssembled ? "Disassemble" : "Assemble Tree"}
         </button>

         {/* Make a Wish Button */}
         <button 
            onClick={() => setShowWishModal(true)}
            className="flex items-center gap-2 text-emerald-300/80 hover:text-amber-300 transition-colors text-sm uppercase tracking-widest group"
         >
            <span className="group-hover:animate-pulse"><Icons.Sparkles /></span>
            <span>Make a Wish</span>
         </button>
      </div>
    </div>
  );
};