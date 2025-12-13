import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Character from './Character';
import { Sparkles, Play, Star, Volume2, ScrollText, Flame, Skull, ShoppingBag, Zap, RefreshCw } from 'lucide-react';
import { DifficultyLevel, SkinId } from '../types';

interface Props {
  onStart: (difficulty: DifficultyLevel) => void;
  isLoading: boolean;
  onOpenShop: () => void;
  level: number;
  gems: number;
  currentExp: number;
  maxExp: number;
  equippedSkin: SkinId;
  onCheatMode: () => void;
}

interface BilingualQuote {
  zh: string;
  en: string;
}

const WelcomeScreen: React.FC<Props> = ({ 
  onStart, 
  isLoading, 
  onOpenShop,
  level,
  gems,
  currentExp,
  maxExp,
  equippedSkin,
  onCheatMode
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);

  const dailyQuote = useMemo<BilingualQuote>(() => {
    const quotes = [
      { 
        zh: "今天魔力充盈，快去修习新的咒语吧！", 
        en: "Magic is in the air. Go learn some new spells!" 
      },
      { 
        zh: "每一句口诀，都是通往大魔法师之路的阶梯。", 
        en: "Every incantation is a step towards becoming a Grand Mage." 
      },
      { 
        zh: "掌握了语言的魔法，就掌握了世界。", 
        en: "Master the magic of language, master the world." 
      },
      { 
        zh: "休息是为了积蓄魔力，但学习是释放魔法！", 
        en: "Rest to gather mana, learn to cast spells!" 
      },
      { 
        zh: "伟大的魔法始于最基础的咒语。", 
        en: "Great magic begins with the most basic spells." 
      }
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  const speakQuote = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(dailyQuote.en);
      utterance.lang = 'en-US';
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English'));
      if (femaleVoice) utterance.voice = femaleVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartClick = () => {
    if (selectedDifficulty) {
      onStart(selectedDifficulty);
    }
  };
  
  const handleResetProgress = () => {
    if (window.confirm("确定要重置所有学习进度吗？这将清除所有已学单词记录，但等级和宝石将保留。")) {
      localStorage.removeItem('learnedWords');
      alert("学习进度已重置！");
    }
  };

  const difficulties = [
    { 
      id: 'Basic', 
      label: '基础', 
      map: '大唐边境', 
      icon: <ScrollText size={18} />, 
      color: 'bg-green-100 border-green-300 text-green-700',
      desc: '3句口诀 • 轻松'
    },
    { 
      id: 'CET-4', 
      label: '四级', 
      map: '火焰山', 
      icon: <Flame size={18} />, 
      color: 'bg-orange-100 border-orange-300 text-orange-700',
      desc: '5句口诀 • 进阶' 
    },
    { 
      id: 'CET-6', 
      label: '六级', 
      map: '狮驼岭', 
      icon: <Skull size={18} />, 
      color: 'bg-indigo-100 border-indigo-300 text-indigo-700',
      desc: '7句口诀 • 挑战' 
    }
  ];

  const momoEmotion = useMemo(() => {
      if (!selectedDifficulty) return 'happy';
      if (selectedDifficulty === 'Basic') return 'happy';
      if (selectedDifficulty === 'CET-4') return 'neutral';
      if (selectedDifficulty === 'CET-6') return 'shocked';
      return 'happy';
  }, [selectedDifficulty]);

  const progressPercent = (currentExp / maxExp) * 100;

  return (
    <div className="flex flex-col items-center justify-between h-full py-6 px-6 relative overflow-hidden bg-gradient-to-b from-pink-50 to-white">
      
      {/* Background Elements */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] right-[-10%] text-yellow-200/40 pointer-events-none"
      >
        <Star size={300} fill="currentColor" />
      </motion.div>

      {/* --- Player Status Dashboard --- */}
      <div className="w-full z-20 flex gap-2 mb-2">
        {/* Level & XP */}
        <div className="flex-1 bg-white/60 backdrop-blur border border-white rounded-2xl p-3 shadow-sm flex flex-col justify-center">
           <div className="flex justify-between items-center mb-1">
             <div className="flex items-center gap-1">
                <span className="bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">LV.{level}</span>
             </div>
             <span className="text-[10px] text-slate-400 font-bold">{currentExp}/{maxExp} XP</span>
           </div>
           <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-gradient-to-r from-pink-400 to-purple-500" 
               initial={{ width: 0 }}
               animate={{ width: `${progressPercent}%` }}
               transition={{ duration: 1 }}
             />
           </div>
        </div>

        {/* Gems */}
        <div className="bg-white/60 backdrop-blur border border-white rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center min-w-[80px]">
           <div className="w-6 h-6 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)] mb-1" />
           <span className="text-slate-700 font-black text-sm">{gems}</span>
        </div>
      </div>

      {/* Main Character Showcase */}
      <div className="z-10 my-2 relative">
         <Character emotion={momoEmotion} scale={1.1} skin={equippedSkin} />
         <p className="text-center text-[10px] text-slate-400 mt-2 opacity-60">点我互动 / Tap me!</p>
         
         {/* Shop Button */}
         <button 
           onClick={onOpenShop}
           className="absolute right-[-40px] top-10 bg-white p-3 rounded-full shadow-lg border border-indigo-100 text-indigo-500 hover:scale-110 transition-transform"
         >
           <ShoppingBag size={20} />
           <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
         </button>
      </div>

      {/* Content Section */}
      <div className="w-full z-10 mb-4 flex flex-col items-center gap-4">
        
        {/* High Efficiency Tips Button */}
        <motion.button 
            onClick={onCheatMode}
            animate={{ opacity: [1, 0.7, 1], scale: [1, 1.02, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-3 rounded-xl shadow-lg shadow-cyan-200 border border-cyan-200 flex items-center justify-center gap-2 font-bold text-sm relative overflow-hidden group"
        >
             <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
             <Zap size={18} className="fill-yellow-300 text-yellow-300" />
             <span>高效技巧 (High Efficiency Tips)</span>
        </motion.button>

        {/* Quote Bubble */}
        <motion.button 
            onClick={speakQuote}
            whileTap={{ scale: 0.95 }}
            className="bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-pink-100 shadow-sm text-center relative w-full"
        >
            <div className="absolute -top-3 -right-3 bg-pink-500 text-white p-1.5 rounded-full shadow-sm">
                <Volume2 size={12} />
            </div>
            <p className="text-slate-800 font-bold text-sm mb-1">{dailyQuote.zh}</p>
            <p className="text-slate-500 text-xs italic font-serif">"{dailyQuote.en}"</p>
        </motion.button>

        {/* Difficulty Select */}
        <div className="w-full grid grid-cols-3 gap-3">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => setSelectedDifficulty(diff.id as DifficultyLevel)}
              className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                selectedDifficulty === diff.id 
                  ? diff.color + ' shadow-md scale-105' 
                  : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
              }`}
            >
              {selectedDifficulty === diff.id && (
                <div className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full p-1">
                  <Sparkles size={10} />
                </div>
              )}
              <div className={`p-2 rounded-full ${selectedDifficulty === diff.id ? 'bg-white/50' : 'bg-slate-100'}`}>
                {diff.icon}
              </div>
              <div className="text-center">
                <span className="block text-xs font-black">{diff.label}</span>
                <span className="block text-[8px] opacity-80 scale-90">{diff.map}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="w-full z-20">
        <button
          onClick={handleStartClick}
          disabled={!selectedDifficulty || isLoading}
          className={`w-full py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
            selectedDifficulty
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-pink-200 hover:scale-[1.02] active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            <>
              <Play fill="currentColor" /> 开始冒险
            </>
          )}
        </button>
        <div className="text-center mt-4">
          <button
            onClick={handleResetProgress}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 mx-auto"
          >
            <RefreshCw size={12} />
            重置学习进度
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;