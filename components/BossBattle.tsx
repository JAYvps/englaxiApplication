import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sword, AlertCircle, FlaskConical, Home, Volume2, Zap } from 'lucide-react';
import { LevelData } from '../types';

interface Props {
  levelData: LevelData;
  onVictory: () => void;
  onDefeat: () => void;
  onBack: () => void;
  potions: number;
  onUsePotion: () => void;
}

const BossBattle: React.FC<Props> = ({ levelData, onVictory, onDefeat, onBack, potions, onUsePotion }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerHp, setPlayerHp] = useState(3);
  const [bossHp, setBossHp] = useState(levelData.words.length);
  const [shaking, setShaking] = useState(false);
  const [attackAnim, setAttackAnim] = useState<'none' | 'player' | 'boss'>('none');
  const [isDamaged, setIsDamaged] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'defeat' | 'victory' | 'potion_check'>('playing');

  const currentWord = levelData.words[currentQuestion];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };
  
  useEffect(() => {
    if (gameState === 'playing' && currentWord) {
      speak(currentWord.term);
    }
  }, [currentQuestion, currentWord, gameState]);

  const options = React.useMemo(() => {
    const correct = currentWord.translation;
    const others = Array.from(new Set(levelData.words
      .filter(w => w.id !== currentWord.id && w.translation !== correct)
      .map(w => w.translation)));
      
    while (others.length < 3) {
        others.push("未知奥秘");
    }
    
    const shuffledOthers = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const all = [correct, ...shuffledOthers];
    return all.sort(() => Math.random() - 0.5);
  }, [currentWord, levelData.words]);

  const handleAnswer = (answer: string) => {
    if (gameState !== 'playing' || attackAnim !== 'none') return;
    const isCorrect = answer === currentWord.translation;

    if (isCorrect) {
      setAttackAnim('player');
      setTimeout(() => {
        setBossHp(prev => prev - 1);
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
        if (bossHp <= 1) {
            setGameState('victory');
            setTimeout(onVictory, 1200);
        } else {
            setCurrentQuestion(prev => (prev + 1) % levelData.words.length); 
        }
        setAttackAnim('none');
      }, 800);
    } else {
      setAttackAnim('boss');
      const newHp = Math.max(0, playerHp - 1);
      setTimeout(() => {
        setIsDamaged(true);
        setPlayerHp(newHp);
        setTimeout(() => setIsDamaged(false), 400);
        setAttackAnim('none');
        if (newHp <= 0) {
            if (potions > 0) setGameState('potion_check');
            else {
                setGameState('defeat');
                setTimeout(onDefeat, 2000);
            }
        }
      }, 600);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 relative overflow-hidden bg-slate-950">
      {/* Damage Flash Overlay */}
      <AnimatePresence>
        {isDamaged && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-red-600 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Global Animation Overlay (Ensures effects are not clipped or blocked) */}
      <div className="absolute inset-0 pointer-events-none z-[70]">
        <AnimatePresence>
          {attackAnim === 'player' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 100 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 1.5], y: -200 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 flex flex-col items-center"
            >
               <Zap size={80} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
               <span className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-600 drop-shadow-lg">
                 CRITICAL!
               </span>
            </motion.div>
          )}

          {attackAnim === 'boss' && (
            <motion.div 
              initial={{ opacity: 0, scale: 2, y: -200 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [2, 1, 1.5, 2], y: 300 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 flex flex-col items-center"
            >
               <Sword size={120} className="text-red-500 fill-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.7)] rotate-[135deg]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 opacity-20">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#4c1d95_0%,_transparent_70%)]" />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-30">
        <button onClick={onBack} className="p-2.5 bg-white/10 text-white/60 rounded-2xl border border-white/10 active:scale-90 transition-all hover:text-white">
          <Home size={18} />
        </button>
      </div>

      <AnimatePresence>
        {gameState === 'potion_check' && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            >
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl">
                    <FlaskConical size={48} className="text-pink-500 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-2xl font-black text-white mb-2">濒死关头！</h3>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">你有 <span className="text-pink-400 font-bold">{potions}</span> 瓶灵丹妙药。<br/>是否服下一枚重振旗鼓？</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => { setGameState('defeat'); setTimeout(onDefeat, 1000); }} className="py-4 rounded-2xl bg-slate-800 text-slate-500 font-black">放弃</button>
                        <button onClick={() => { onUsePotion(); setPlayerHp(1); setGameState('playing'); }} className="py-4 rounded-2xl bg-pink-500 text-white font-black shadow-lg shadow-pink-500/20">服用</button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-6 z-10 text-white mt-12 px-4">
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-pink-300 tracking-widest uppercase">修行者</span>
            <motion.div 
              animate={isDamaged ? { x: [-5, 5, -5, 5, 0] } : {}}
              className="flex text-pink-500"
            >
                {[...Array(3)].map((_, i) => (
                    <Heart key={i} size={20} fill={i < playerHp ? "currentColor" : "none"} className={i < playerHp ? "drop-shadow-lg" : "opacity-20"} />
                ))}
            </motion.div>
        </div>
        <div className="text-center">
            <span className="text-xl font-black italic text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] px-2">VS</span>
        </div>
        <div className="flex flex-col gap-1 items-end">
             <span className="text-[10px] font-black text-red-300 uppercase tracking-widest">{levelData.bossName}</span>
             <div className="w-24 h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <motion.div className="h-full bg-gradient-to-l from-red-600 to-orange-500" initial={{ width: "100%" }} animate={{ width: `${(bossHp / levelData.words.length) * 100}%` }} />
             </div>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center mb-6">
        <motion.div animate={shaking ? { x: [-15, 15, -15, 15, 0] } : { y: [0, -15, 0] }} transition={shaking ? { duration: 0.4 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <div className="w-40 h-40 bg-gradient-to-br from-indigo-600 to-purple-900 shadow-2xl relative flex items-center justify-center border-4 border-white/10" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}>
                 <div className="flex gap-4 mt-2">
                     <motion.div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20" animate={{ height: [36, 4, 36] }} transition={{ duration: 5, repeat: Infinity, times: [0.9, 0.95, 1] }}>
                        <div className="w-2 h-6 bg-black rounded-full" />
                     </motion.div>
                     <motion.div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center overflow-hidden mt-2 border-2 border-white/20" animate={{ height: [28, 4, 28] }} transition={{ duration: 5.2, repeat: Infinity, times: [0.9, 0.95, 1] }}>
                         <div className="w-2 h-4 bg-black rounded-full" />
                     </motion.div>
                 </div>
            </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 pb-8 z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] relative">
        <div className="mb-6 text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1.5 block">释放法术</span>
            <h2 className="text-3xl font-black text-slate-800 leading-tight">{currentWord.term}</h2>
            <button 
              onClick={() => speak(currentWord.term)}
              className="mt-1 flex items-center justify-center gap-1.5 mx-auto group transition-all active:scale-95"
            >
              <p className="text-xs text-slate-400 font-medium group-hover:text-indigo-500 transition-colors">{currentWord.phonetic}</p>
              <Volume2 size={12} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </button>
        </div>
        <div className="grid grid-cols-1 gap-3">
            {options.map((opt, i) => (
                <motion.button 
                    key={`${currentWord.id}-${opt}-${i}`} 
                    disabled={gameState !== 'playing' || attackAnim !== 'none'} 
                    whileTap={{ scale: 0.97 }} 
                    onClick={() => handleAnswer(opt)} 
                    className={`py-4 px-6 rounded-2xl font-black text-base transition-all border-2 flex items-center justify-between group disabled:opacity-50 ${
                      gameState === 'playing' ? 'bg-slate-50 hover:bg-indigo-50 border-slate-100 text-slate-800' : 'bg-slate-100 border-slate-100 text-slate-400'
                    }`}
                >
                    <span className="text-left pr-2">{opt}</span>
                    <Sword size={16} className="text-slate-200 group-hover:text-indigo-500 transition-colors shrink-0" />
                </motion.button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BossBattle;