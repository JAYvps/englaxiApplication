
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Character from './Character';
import { Map, ShoppingBag, Volume2, Sparkles, BookOpen, Trophy, RefreshCw } from 'lucide-react';
import { SkinId } from '../types';
import { generateDailyQuote } from '../services/aiService';

interface Props {
  onStartJourney: () => void;
  onOpenShop: () => void;
  onOpenVault: () => void;
  onOpenAchievements: () => void;
  level: number;
  gems: number;
  currentExp: number;
  maxExp: number;
  equippedSkin: SkinId;
}

const WelcomeScreen: React.FC<Props> = ({ 
  onStartJourney, onOpenShop, onOpenVault, onOpenAchievements,
  level, gems, currentExp, maxExp, equippedSkin
}) => {
  const [quote, setQuote] = useState({ en: "Loading inspiration...", zh: "加载灵感中..." });
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  const fetchQuote = async () => {
    setIsLoadingQuote(true);
    const newQuote = await generateDailyQuote();
    setQuote(newQuote);
    setIsLoadingQuote(false);
  };

  useEffect(() => { fetchQuote(); }, []);

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(quote.en);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const progressPercent = (currentExp / maxExp) * 100;

  return (
    <div className="flex flex-col items-center justify-between h-full py-8 px-6 bg-gradient-to-b from-orange-50 to-white overflow-hidden relative">
      
      {/* HUD Bar */}
      <div className="w-full flex justify-between items-center z-20">
         <div className="flex flex-col gap-1 flex-1 max-w-[150px]">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-orange-600 bg-orange-100 px-1.5 rounded">LV.{level}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-white">
                <motion.div className="h-full bg-orange-400" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} />
            </div>
         </div>
         <div className="flex gap-2">
            <div className="bg-white px-3 py-1.5 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-blue-400 rounded-full" />
                <span className="text-slate-700 font-black text-xs">{gems}</span>
            </div>
            <button onClick={onOpenShop} className="bg-white p-1.5 rounded-full shadow-sm border border-orange-100 text-orange-500">
                <ShoppingBag size={18} />
            </button>
         </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center gap-4 z-10 w-full">
          <Character emotion="happy" scale={1.1} skin={equippedSkin} />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-orange-200 shadow-xl w-full text-center relative overflow-hidden"
          >
             <button 
               onClick={fetchQuote} 
               className="absolute top-2 right-2 text-orange-300 hover:text-orange-500 transition-colors"
               disabled={isLoadingQuote}
             >
                <RefreshCw size={14} className={isLoadingQuote ? "animate-spin" : ""} />
             </button>
             
             <div className="flex flex-col gap-2">
                <p className="text-slate-800 font-black text-base px-4">{quote.en}</p>
                <p className="text-slate-500 text-xs font-medium">{quote.zh}</p>
                <button 
                  onClick={speak}
                  className="mt-2 mx-auto bg-orange-100 text-orange-600 p-2 rounded-full hover:bg-orange-200 active:scale-90 transition-all"
                >
                  <Volume2 size={16} />
                </button>
             </div>
          </motion.div>
      </div>

      {/* Action Grid */}
      <div className="w-full z-20 space-y-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onStartJourney}
            className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black text-2xl rounded-[2rem] shadow-xl shadow-orange-200 flex flex-col items-center justify-center gap-1 group relative overflow-hidden"
          >
              <div className="flex items-center gap-2">
                <Map className="fill-white" size={28} />
                <span>西天取经</span>
              </div>
              <span className="text-[10px] font-medium opacity-80 tracking-[0.2em] uppercase">Enter Journey</span>
          </motion.button>
          
          <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={onOpenVault}
                className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                 <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><BookOpen size={24} /></div>
                 <span className="text-xs font-black text-slate-600">单词宝库</span>
              </button>
              <button 
                onClick={onOpenAchievements}
                className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                 <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><Trophy size={24} /></div>
                 <span className="text-xs font-black text-slate-600">成就勋章</span>
              </button>
          </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
