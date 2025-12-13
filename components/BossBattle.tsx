import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sword, AlertCircle, FlaskConical } from 'lucide-react';
import { LevelData } from '../types';

interface Props {
  levelData: LevelData;
  onVictory: () => void;
  onDefeat: () => void;
  potions: number;
  onUsePotion: () => void;
}

const BossBattle: React.FC<Props> = ({ levelData, onVictory, onDefeat, potions, onUsePotion }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerHp, setPlayerHp] = useState(3);
  const [bossHp, setBossHp] = useState(levelData.words.length);
  const [shaking, setShaking] = useState(false);
  const [attackAnim, setAttackAnim] = useState<'none' | 'player' | 'boss'>('none');
  const [gameState, setGameState] = useState<'playing' | 'defeat' | 'victory' | 'potion_check'>('playing');

  const currentWord = levelData.words[currentQuestion];
  
  // 新问题出现时自动朗读
  useEffect(() => {
    if (gameState === 'playing' && currentWord) {
      if ('speechSynthesis' in window) {
        // 取消任何正在进行的朗读
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(currentWord.term);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        
        // 尝试获取一个较好的语音
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Samantha')));
        if (preferredVoice) utterance.voice = preferredVoice;

        window.speechSynthesis.speak(utterance);
      }
    }
  }, [currentQuestion, currentWord, gameState]);

  // 生成选项（1个正确，2个随机错误）
  const options = React.useMemo(() => {
    const correct = currentWord.translation;
    const others = levelData.words
      .filter(w => w.id !== currentWord.id)
      .map(w => w.translation);
    // 如果需要，添加假的选项
    while (others.length < 2) others.push("未知的魔法");
    
    const all = [correct, ...others.slice(0, 2)];
    return all.sort(() => Math.random() - 0.5);
  }, [currentWord, levelData.words]);

  const handleAnswer = (answer: string) => {
    if (gameState !== 'playing') return;

    const isCorrect = answer === currentWord.translation;

    if (isCorrect) {
      setAttackAnim('player');
      setTimeout(() => {
        setBossHp(prev => prev - 1);
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
        
        if (bossHp <= 1) {
            setGameState('victory');
            setTimeout(onVictory, 1000);
        } else {
            setCurrentQuestion(prev => (prev + 1) % levelData.words.length); 
        }
        setAttackAnim('none');
      }, 500);
    } else {
      setAttackAnim('boss');
      
      const newHp = Math.max(0, playerHp - 1);
      
      setTimeout(() => {
        setPlayerHp(newHp);
        setAttackAnim('none');
        
        if (newHp <= 0) {
            // 检查药水逻辑
            if (potions > 0) {
                setGameState('potion_check');
            } else {
                setGameState('defeat');
                setTimeout(onDefeat, 2000);
            }
        }
      }, 500);
    }
  };

  const handleUsePotionClick = () => {
      onUsePotion(); // 扣除药水
      setPlayerHp(1); // 恢复1点生命值
      setGameState('playing'); // 继续游戏
  };

  const handleDeclinePotion = () => {
      setGameState('defeat');
      setTimeout(onDefeat, 1000);
  };

  return (
    <div className="h-full flex flex-col p-4 relative overflow-hidden bg-slate-900">
      {/* 动态背景 */}
      <div className="absolute inset-0 opacity-20">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-slate-900" />
      </div>

      {/* 药水检查模态框 */}
      <AnimatePresence>
        {gameState === 'potion_check' && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            >
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl">
                    <FlaskConical size={48} className="text-pink-500 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold text-white mb-2">濒临失败！</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        你还有 <span className="text-pink-400 font-bold">{potions}</span> 瓶生命恢复药水。<br/>
                        是否使用1瓶恢复1点生命值继续战斗？
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={handleDeclinePotion}
                            className="py-3 rounded-xl bg-slate-700 text-slate-400 font-bold hover:bg-slate-600"
                        >
                            放弃
                        </button>
                        <button 
                            onClick={handleUsePotionClick}
                            className="py-3 rounded-xl bg-pink-500 text-white font-bold hover:bg-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                        >
                            使用药水
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* 失败遮罩层 */}
      {gameState === 'defeat' && (
          <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center animate-in fade-in duration-500">
              <AlertCircle size={60} className="text-red-500 mb-4 animate-bounce" />
              <h2 className="text-3xl font-black text-red-500 mb-2">挑战失败</h2>
              <p className="text-white/70">重新复习一下吧...</p>
          </div>
      )}

      {/* 游戏信息显示 */}
      <div className="flex justify-between items-center mb-8 z-10 text-white mt-4">
        <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-pink-300 tracking-wider">HERO</span>
            <div className="flex text-pink-500">
                {[...Array(3)].map((_, i) => (
                    <Heart key={i} size={24} fill={i < playerHp ? "currentColor" : "none"} className={i < playerHp ? "drop-shadow-lg transition-all" : "opacity-30"} />
                ))}
            </div>
        </div>
        <div className="text-center">
            <span className="text-xl font-black italic tracking-widest text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">VS</span>
        </div>
        <div className="flex flex-col gap-1 items-end">
             <span className="text-xs font-bold text-red-300 uppercase tracking-wider">{levelData.bossName}</span>
             <div className="w-32 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-600 shadow-inner">
                <motion.div 
                    className="h-full bg-gradient-to-l from-red-500 to-orange-500"
                    initial={{ width: "100%" }}
                    animate={{ width: `${(bossHp / levelData.words.length) * 100}%` }}
                />
             </div>
        </div>
      </div>

      {/* 战斗场景 */}
      <div className="flex-1 relative flex items-center justify-center mb-8">
        
        {/* CSS实现的怪物Boss */}
        <motion.div
            animate={shaking ? { x: [-10, 10, -10, 10, 0], filter: ["brightness(2)", "brightness(1)"] } : { y: [0, -10, 0] }}
            transition={shaking ? { duration: 0.4 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-0"
        >
            {/* 发光效果 */}
            <div className="w-56 h-56 bg-purple-600 rounded-full blur-[80px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60" />
            
            {/* 身体 */}
            <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-indigo-700 shadow-2xl relative flex items-center justify-center"
                 style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}>
                 
                 {/* 眼睛 */}
                 <div className="flex gap-6 mt-4">
                     <motion.div 
                        className="w-10 h-10 bg-yellow-300 rounded-full shadow-[0_0_15px_rgba(253,224,71,0.8)] flex items-center justify-center overflow-hidden"
                        animate={{ height: [40, 5, 40] }}
                        transition={{ duration: 4, repeat: Infinity, times: [0.9, 0.95, 1] }}
                     >
                        <div className="w-2 h-6 bg-black rounded-full" />
                     </motion.div>
                     <motion.div 
                        className="w-8 h-8 bg-yellow-300 rounded-full shadow-[0_0_15px_rgba(253,224,71,0.8)] flex items-center justify-center overflow-hidden mt-2"
                        animate={{ height: [32, 4, 32] }}
                        transition={{ duration: 4.2, repeat: Infinity, times: [0.9, 0.95, 1] }}
                     >
                         <div className="w-2 h-4 bg-black rounded-full" />
                     </motion.div>
                 </div>
            </div>

            {/* Boss攻击效果 */}
            {attackAnim === 'boss' && (
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }} 
                    animate={{ scale: 1.5, opacity: 1, y: 100 }} 
                    className="absolute inset-0 flex items-center justify-center text-red-500 z-20"
                >
                    <Sword size={80} fill="currentColor" />
                </motion.div>
            )}
        </motion.div>

        {/* 玩家攻击效果 */}
        {attackAnim === 'player' && (
             <motion.div 
                initial={{ bottom: -50, opacity: 0, scale: 0.5 }} 
                animate={{ bottom: 100, opacity: [0, 1, 0], scale: 1.2 }} 
                transition={{ duration: 0.6 }}
                className="absolute z-20"
            >
                <div className="text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-500 drop-shadow-sm">CRITICAL!</div>
            </motion.div>
        )}
      </div>

      {/* 控制区域 */}
      <div className="bg-slate-800/80 backdrop-blur-lg rounded-t-3xl p-6 border-t border-slate-700 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="mb-6 text-center">
            <span className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-2 block">Cast Spell</span>
            <h2 className="text-4xl font-black text-white drop-shadow-md">{currentWord.term}</h2>
        </div>

        <div className="grid grid-cols-1 gap-3">
            {options.map((opt, i) => (
                <motion.button
                    key={i}
                    disabled={gameState !== 'playing'}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(opt)}
                    className="py-4 px-6 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl font-bold text-lg transition-all border border-slate-600 shadow-lg flex items-center justify-between group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10">{opt}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-yellow-400 text-sm font-black italic relative z-10 transition-opacity">CAST ⚡️</span>
                </motion.button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BossBattle;