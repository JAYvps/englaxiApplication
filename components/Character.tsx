import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SkinId } from '../types';

interface CharacterProps {
  emotion?: 'happy' | 'neutral' | 'shocked';
  scale?: number;
  skin?: SkinId;
}

const Character: React.FC<CharacterProps> = ({ emotion = 'neutral', scale = 1, skin = 'default' }) => {
  const [clickAnim, setClickAnim] = useState<string>('idle');

  // Random animation trigger
  const triggerAction = () => {
    const actions = ['jump', 'wiggle', 'spin', 'pulse', 'shake'];
    const available = actions.filter(a => a !== clickAnim);
    const randomAction = available[Math.floor(Math.random() * available.length)];
    setClickAnim(randomAction);
    setTimeout(() => setClickAnim('idle'), 1000);
  };

  // Skin Configuration
  // Design: Round Cute Mascot (Doraemon-esque structure) + West Journey Elements (Headband)
  const skinStyles: Record<SkinId, { 
    base: string;     // Main body color
    face: string;     // Face mask color (usually white)
    accent: string;   // Scarf/Collar color
    band: string;     // Headband color
  }> = {
    default: {
      base: 'bg-pink-400',
      face: 'bg-white',
      accent: 'bg-red-500', // Red Scarf
      band: 'bg-yellow-400', // Golden Headband
    },
    ice: {
      base: 'bg-cyan-400',
      face: 'bg-blue-50',
      accent: 'bg-blue-600',
      band: 'bg-cyan-200',
    },
    fire: {
      base: 'bg-red-500',
      face: 'bg-yellow-50',
      accent: 'bg-yellow-500',
      band: 'bg-orange-800',
    },
    gold: {
      base: 'bg-yellow-400',
      face: 'bg-yellow-50',
      accent: 'bg-red-600',
      band: 'bg-white',
    },
    ninja: {
      base: 'bg-slate-800',
      face: 'bg-slate-200',
      accent: 'bg-purple-600',
      band: 'bg-slate-900',
    }
  };

  const s = skinStyles[skin] || skinStyles.default;

  const variants = {
    idle: { 
      y: [0, -3, 0],
      scale: 1,
      rotate: 0,
      transition: { y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }
    },
    jump: {
      y: [0, -40, 0],
      scale: [1, 0.9, 1.1, 1],
      transition: { duration: 0.5 }
    },
    wiggle: {
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { duration: 0.5 }
    },
    spin: {
      rotate: [0, 360],
      transition: { duration: 0.6 }
    },
    pulse: {
      scale: [1, 1.15, 0.95, 1.05, 1],
      transition: { duration: 0.5 }
    },
    shake: {
      x: [0, -8, 8, -8, 8, 0],
      transition: { duration: 0.4 }
    }
  };

  const getEyes = () => {
    if (skin === 'ninja') {
        return (
             <div className="flex gap-8 mt-6">
                <div className="w-3 h-1 bg-slate-900 rotate-12" />
                <div className="w-3 h-1 bg-slate-900 -rotate-12" />
             </div>
        );
    }
    
    // Standard Anime Eyes
    switch(emotion) {
      case 'happy': 
        return (
          <div className="flex gap-8 mt-4">
            <div className="w-3 h-3 border-t-4 border-slate-900 rounded-full" />
            <div className="w-3 h-3 border-t-4 border-slate-900 rounded-full" />
          </div>
        );
      case 'shocked': 
        return (
          <div className="flex gap-6 mt-4">
            <div className="w-3 h-3 bg-slate-900 rounded-full animate-ping" />
            <div className="w-3 h-3 bg-slate-900 rounded-full animate-ping" />
          </div>
        );
      case 'neutral':
      default: 
        return (
          <div className="flex gap-6 mt-4">
             <div className="w-3 h-5 bg-slate-900 rounded-full relative">
                <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 left-0.5" />
             </div>
             <div className="w-3 h-5 bg-slate-900 rounded-full relative">
                <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 left-0.5" />
             </div>
          </div>
        );
    }
  };

  const getMouth = () => {
     if (skin === 'ninja') return null;

     switch(emotion) {
      case 'happy': 
        return <div className="w-4 h-4 bg-red-400 rounded-b-full mt-1 border-t-2 border-red-500" />;
      case 'shocked': 
        return <div className="w-3 h-4 bg-slate-800 rounded-full mt-2 border-2 border-white" />;
      case 'neutral': 
      default: 
        return (
            <div className="flex justify-center mt-2">
                <div className="w-2 h-2 border-b-2 border-r-2 border-slate-400 rounded-full rotate-45" />
                <div className="w-2 h-2 border-b-2 border-l-2 border-slate-400 rounded-full -rotate-45" />
            </div>
        );
    }
  };

  return (
    <motion.div 
      className="relative flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={triggerAction}
      variants={variants as any}
      animate={clickAnim}
      style={{ scale }}
      whileTap={{ scale: scale * 0.9 }}
    >
      
      {/* 2. BODY / HEAD CONTAINER - ROUND SPHERE */}
      <div className={`w-36 h-32 ${s.base} rounded-[50%] relative z-10 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.15)] flex flex-col items-center overflow-visible`}>
           
           {/* Specular Highlight */}
           <div className="absolute top-3 left-8 w-8 h-4 bg-white/40 rounded-full rotate-[-15deg]" />

           {/* Golden Headband (West Journey Theme) */}
           <div className={`absolute top-6 w-[96%] h-3 ${s.band} rounded-full shadow-sm z-20 border border-black/5 opacity-90`} />
           <div className={`absolute top-5 w-5 h-5 ${s.band} rounded-full shadow-md z-30 border-2 border-white/50 flex items-center justify-center`}>
              <div className="w-2 h-2 bg-white/80 rounded-full" />
           </div>

           {/* Face Mask (Doraemon style white area) */}
           <div className={`absolute bottom-2 w-[80%] h-[65%] ${s.face} rounded-[50%_50%_45%_45%] shadow-inner flex flex-col items-center z-10`}>
              {/* Eyes */}
              {getEyes()}
              
              {/* Nose */}
              <div className="w-3 h-3 bg-pink-500 rounded-full mt-1 shadow-sm" />

              {/* Whiskers */}
              <div className="absolute top-10 -left-2 w-5 h-0.5 bg-slate-300 rotate-12" />
              <div className="absolute top-12 -left-2 w-5 h-0.5 bg-slate-300 rotate-6" />
              <div className="absolute top-10 -right-2 w-5 h-0.5 bg-slate-300 -rotate-12" />
              <div className="absolute top-12 -right-2 w-5 h-0.5 bg-slate-300 -rotate-6" />

              {/* Mouth */}
              {getMouth()}
           </div>

           {/* Arms (Nubs) */}
           <div className={`absolute top-16 -left-2 w-6 h-6 ${s.base} rounded-full border-2 border-white/10 shadow-sm`} />
           <div className={`absolute top-16 -right-2 w-6 h-6 ${s.base} rounded-full border-2 border-white/10 shadow-sm`} />
      </div>

      {/* 3. SCARF / COLLAR (Adventure Theme) */}
      <div className={`absolute bottom-[-8px] w-20 h-8 ${s.accent} rounded-full z-20 shadow-md flex items-center justify-center`}>
          {/* Knot */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-6 ${s.accent} rounded-md rotate-12 border border-black/10`} />
          {/* Magic Crystal */}
          <div className="w-4 h-4 bg-blue-400 rounded-full border-2 border-white shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
      </div>

      {/* 4. FEET */}
      <div className="flex gap-6 -mt-2 z-0">
         <div className={`w-8 h-5 ${s.base} rounded-full shadow-md border-b-2 border-black/10`} />
         <div className={`w-8 h-5 ${s.base} rounded-full shadow-md border-b-2 border-black/10`} />
      </div>
      
      {/* 5. SHADOW */}
      <div className="w-20 h-3 bg-black/10 rounded-[100%] mt-1 blur-sm" />
    </motion.div>
  );
};

export default Character;