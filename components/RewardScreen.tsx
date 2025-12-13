import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, Skull, AlertTriangle, Zap } from 'lucide-react';

interface Props {
  onRestart: () => void;
  onChallenge: () => void;
  playerLevel: number;
  earnedExp: number;
  earnedGems: number;
  currentExp: number;
  maxExp: number;
  showChallengeButton: boolean;
}

const RewardScreen: React.FC<Props> = ({ 
  onRestart, 
  onChallenge,
  playerLevel,
  earnedExp,
  earnedGems,
  currentExp,
  maxExp,
  showChallengeButton
}) => {
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  // 随机鼓励语句
  const victoryQuote = useMemo(() => {
    const quotes = [
      "太棒了！离大魔法师又近了一步！",
      "今天的努力，是明天闪闪发光的宝藏。",
      "哇！你竟然一口气通过了所有试炼！",
      "好好休息一下，奖励自己一杯奶茶吧！",
      "即使是小小的进步，也值得大大的庆祝！"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.max(0, (currentExp / maxExp) * 100));

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-600 to-indigo-900 text-white text-center relative">
      
      {/* 挑战模式 */}
      <AnimatePresence>
        {showChallengeModal && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-800 border border-red-500/50 p-6 rounded-3xl w-full max-w-sm text-center shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                >
                    <Skull size={48} className="text-red-500 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-2xl font-black text-white mb-2 italic">⚠️ 危险警告</h3>
                    <div className="text-slate-300 text-sm mb-6 leading-relaxed">
                        前方检测到高能反应！<br/>
                        <span className="text-red-400 font-bold">25个单词</span> 的连环试炼。<br/>
                        
                        <div className="bg-slate-700/50 p-3 rounded-lg mt-3 border border-slate-600">
                             <div className="flex items-center justify-center gap-2 text-yellow-400 font-bold mb-1">
                                <Trophy size={14} /> 丰厚奖励
                             </div>
                             <div className="text-xs text-slate-300">
                                通关即得 <span className="text-yellow-400">+66 EXP</span> & <span className="text-blue-400">+66 GEMS</span>
                             </div>
                             <div className="text-xs text-green-400 mt-1 font-bold">
                                并且接下来的地图宝石获取 x2 !
                             </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => setShowChallengeModal(false)}
                            className="py-3 rounded-xl bg-slate-700 text-slate-400 font-bold hover:bg-slate-600"
                        >
                            我再想想
                        </button>
                        <button 
                            onClick={() => { setShowChallengeModal(false); onChallenge(); }}
                            className="py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold hover:brightness-110 shadow-lg flex items-center justify-center gap-2"
                        >
                           <SwordIcon /> 接受挑战
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="mb-6 relative"
      >
        <Trophy size={100} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-2 -right-2 bg-pink-500 text-white font-bold px-3 py-1 rounded-full border-2 border-white shadow-lg rotate-12"
        >
            Lv.{playerLevel}
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-black mb-2 italic"
      >
        VICTORY!
      </motion.h1>
      
      <p className="text-purple-200 mb-8">Level Complete</p>

      {/* */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="mb-8 px-4 py-3 bg-white/10 rounded-xl border border-white/20"
      >
        <p className="text-yellow-200 text-sm font-medium">✨ {victoryQuote}</p>
      </motion.div>

      {/* */}
      <div className="w-full max-w-sm grid grid-cols-2 gap-4 mb-8">
        <motion.div 
            initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur rounded-2xl p-4 flex flex-col items-center"
        >
            <Star className="text-yellow-400 mb-2" fill="currentColor" />
            <span className="text-2xl font-bold">+{earnedExp}</span>
            <span className="text-xs text-purple-300 uppercase">EXP</span>
        </motion.div>
        
        <motion.div 
            initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur rounded-2xl p-4 flex flex-col items-center"
        >
            <div className="w-6 h-6 rounded-full bg-blue-400 mb-2 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
            <span className="text-2xl font-bold">+{earnedGems}</span>
            <span className="text-xs text-purple-300 uppercase">GEMS</span>
        </motion.div>
      </div>

      <motion.div className="w-full max-w-xs space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden relative">
            <motion.div 
                initial={{ width: "0%" }} 
                animate={{ width: `${progressPercent}%` }} 
                transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500" 
            />
        </div>
        <p className="text-xs text-purple-300 text-right">{currentExp} / {maxExp} EXP</p>

        {/**/}
        <div className="flex flex-col gap-3 mt-6">
            <button 
                onClick={onRestart}
                className="w-full py-4 bg-white text-purple-900 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
            >
                <span>下一章</span>
                <ArrowRight size={20} />
            </button>
            
            {showChallengeButton && (
                <button 
                    onClick={() => setShowChallengeModal(true)}
                    className="w-full py-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-2xl font-bold text-sm hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                >
                    <Skull size={16} />
                    <span>挑战关卡 (BOSS)</span>
                </button>
            )}
        </div>
      </motion.div>

    </div>
  );
};

const SwordIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
        <line x1="13" y1="19" x2="19" y2="13" />
        <line x1="16" y1="16" x2="20" y2="20" />
        <line x1="19" y1="21" x2="21" y2="19" />
    </svg>
);

export default RewardScreen;