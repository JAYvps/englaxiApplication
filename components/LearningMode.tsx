
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Volume2, Sparkles, BookOpen, Star, Feather, Tag, GitBranch, RotateCw, Sword, Shield, ArrowRight, ArrowLeft, RefreshCcw, Home } from 'lucide-react';
import { Word } from '../types';

interface Props {
  words: Word[];
  onComplete: () => void;
  onBack: () => void;
}

const LearningMode: React.FC<Props> = ({ words, onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | 'back' | null>(null);
  const [isReadyPhase, setIsReadyPhase] = useState(false);
  const [dragX, setDragX] = useState(0);

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  const speakText = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    setDirection('right');
    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
        setDirection(null);
      } else {
        setIsReadyPhase(true);
      }
    }, 200); 
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
        setDirection('left'); 
        
        setTimeout(() => {
            setCurrentIndex(prev => prev - 1);
            setIsFlipped(false);
            setDirection('back');
            setTimeout(() => setDirection(null), 100);
        }, 200);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragX(0);
    const threshold = 50;
    if (info.offset.x > threshold) {
        handleNext();
    } else if (info.offset.x < -threshold) {
        handlePrevious();
    }
  };

  const highlightWord = (sentence: string, word: string) => {
      const parts = sentence.split(new RegExp(`(${word})`, 'gi'));
      return parts.map((part, i) => 
          part.toLowerCase() === word.toLowerCase() ? 
          <span key={i} className="text-pink-600 font-extrabold bg-pink-100 px-1 rounded shadow-sm border border-pink-200">{part}</span> : 
          part
      );
  };

  const difficultyColor = (level: string) => {
    switch (level) {
      case 'CET-4': return 'bg-green-100 text-green-600 border-green-200';
      case 'CET-6': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'IELTS': return 'bg-purple-100 text-purple-600 border-purple-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (isReadyPhase) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-800 to-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute top-6 left-6 z-20">
          <button onClick={onBack} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full active:scale-90 transition-all border border-white/10">
            <Home size={20} />
          </button>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute -top-20 -right-20 text-indigo-500/20"
           >
              <Star size={300} />
           </motion.div>
        </div>

        <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="z-10 flex flex-col items-center gap-8 w-full max-w-sm"
        >
            <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-3xl rotate-3 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.5)] border-4 border-yellow-200">
                    <Sword size={56} className="text-white drop-shadow-md" strokeWidth={2.5} />
                </div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-2 -right-2 bg-pink-500 rounded-full p-2 border-4 border-slate-900"
                >
                  <Shield size={20} className="text-white" />
                </motion.div>
            </div>
            
            <div>
                <motion.h2 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="text-4xl font-black italic mb-3 tracking-wider"
                >
                  准备好了
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="text-indigo-200 text-sm leading-relaxed"
                >
                    所有的魔法口诀已铭记于心。<br/>
                    是时候去检验你的成果了！
                </motion.p>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="w-full py-5 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl font-black text-xl shadow-[0_10px_30px_rgba(236,72,153,0.4)] flex items-center justify-center gap-3 group relative overflow-hidden border-b-4 border-red-700"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
                <span className="relative z-10 group-hover:translate-x-1 transition-transform">开始讨伐</span>
                <Sword size={24} className="relative z-10 group-hover:rotate-45 transition-transform" />
            </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-between py-6 px-4 bg-gradient-to-b from-indigo-50 to-purple-100 relative overflow-hidden">
      
      {/* Header Controls */}
      <div className="w-full flex items-center justify-between px-2 mb-4 z-20">
        <button onClick={onBack} className="p-2.5 bg-white text-slate-400 rounded-2xl border border-slate-100 shadow-sm active:scale-90 transition-all">
          <Home size={18} />
        </button>
        <div className="text-center">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">修行进度</span>
           <span className="text-indigo-600 font-black text-lg">{currentIndex + 1} <span className="text-slate-300 text-sm">/ {words.length}</span></span>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-sm z-10 px-2 mb-4">
        <div className="h-2 bg-white rounded-full overflow-hidden shadow-sm border border-white/50">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-400 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card Container */}
      <div className="flex-1 w-full max-w-sm flex items-center justify-center perspective-1000 z-20 my-4 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            dragSnapToOrigin
            onDrag={(e, info) => setDragX(info.offset.x)}
            onDragEnd={handleDragEnd}
            initial={direction === 'back' ? { x: -300, opacity: 0, rotate: -10 } : { x: 300, opacity: 0, rotate: 10 }}
            animate={
                direction === 'right' ? { x: 300, opacity: 0, rotate: 20 } :
                direction === 'left' ? { x: -300, opacity: 0, rotate: -20 } :
                { x: 0, opacity: 1, rotate: 0 }
            }
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full h-[450px] relative cursor-grab active:cursor-grabbing group perspective-1000"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: "preserve-3d" }}
          >
            {dragX > 50 && (
                <div className="absolute top-10 left-[-20px] z-50 bg-green-500 text-white font-black text-base px-5 py-2 rounded-2xl rotate-[-15deg] shadow-lg border-2 border-white">
                    记住了
                </div>
            )}
            {dragX < -50 && (
                <div className="absolute top-10 right-[-20px] z-50 bg-slate-500 text-white font-black text-base px-5 py-2 rounded-2xl rotate-[15deg] shadow-lg border-2 border-white">
                    没记住
                </div>
            )}

            <motion.div
                className="w-full h-full relative"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                <div 
                    className="absolute inset-0 bg-white rounded-[2.5rem] shadow-2xl border-2 border-white flex flex-col items-center justify-center p-8 backface-hidden overflow-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="absolute top-6 left-6 flex gap-2">
                         {currentWord.tags.slice(0, 2).map(tag => (
                             <span key={tag} className="flex items-center gap-1 text-[9px] font-black bg-slate-100 text-slate-400 px-2 py-1 rounded-lg uppercase tracking-wider">
                                <Tag size={8} /> {tag}
                             </span>
                         ))}
                    </div>
                    <div className={`absolute top-6 right-6 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${difficultyColor(currentWord.difficulty)}`}>
                        {currentWord.difficulty}
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
                        <h2 className="text-5xl font-black text-slate-800 tracking-tight text-center break-words w-full px-2">
                            {currentWord.term}
                        </h2>
                        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-2xl text-indigo-500 font-bold italic text-base border border-indigo-100">
                            <span>{currentWord.phonetic}</span>
                            <button onClick={(e) => speakText(currentWord.term, e)} className="p-1.5 bg-white rounded-full shadow-sm text-indigo-400 hover:text-indigo-600 active:scale-90 transition-all">
                                <Volume2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto text-slate-300 text-[10px] font-black flex items-center gap-2 animate-pulse uppercase tracking-[0.2em]">
                        <RotateCw size={12} /> 点击翻面
                    </div>
                </div>

                <div 
                    className="absolute inset-0 bg-indigo-50 rounded-[2.5rem] shadow-2xl border-2 border-white flex flex-col p-8 backface-hidden"
                    style={{ backfaceVisibility: 'hidden', transform: "rotateY(180deg)" }}
                >
                    <div className="text-center border-b border-indigo-100 pb-4 mb-4">
                        <h3 className="text-2xl font-black text-indigo-900">{currentWord.translation}</h3>
                        <p className="text-xs text-slate-400 mt-1 font-bold italic">{currentWord.definition}</p>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                        {currentWord.etymology && (
                            <div className="bg-orange-100/50 p-4 rounded-2xl border border-orange-200">
                                <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase mb-1.5">
                                    <GitBranch size={12} /> 魔法溯源
                                </div>
                                <p className="text-slate-700 text-xs leading-relaxed font-medium">{currentWord.etymology}</p>
                            </div>
                        )}
                        <div className="bg-blue-100/50 p-4 rounded-2xl border border-blue-200">
                            <div className="flex items-center justify-between gap-2 text-blue-600 font-black text-[10px] uppercase mb-1.5">
                                <div className="flex items-center gap-2"><BookOpen size={12} /> 咒语应用</div>
                                <button onClick={(e) => speakText(currentWord.example, e)} className="p-1.5 bg-white rounded-full text-blue-500 shadow-sm active:scale-90"><Volume2 size={12} /></button>
                            </div>
                            <p className="text-slate-700 text-xs italic mb-1 font-bold leading-relaxed italic">"{highlightWord(currentWord.example, currentWord.term)}"</p>
                            <p className="text-[10px] text-slate-500 font-medium">{currentWord.exampleTranslation}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-sm z-20 pb-4">
         <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="w-full bg-slate-900 text-white font-black text-xl py-5 rounded-3xl shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
         >
             <span>我记住了</span>
             <Sparkles size={20} className="text-yellow-400 animate-pulse" />
         </motion.button>
         <div className="flex justify-between items-center text-[9px] text-slate-400 mt-4 px-2 font-black uppercase tracking-widest">
             <span className="flex items-center gap-1"><ArrowLeft size={10} /> 没记住</span>
             <span>铭记于心，方能降妖</span>
             <span className="flex items-center gap-1">记住了 <ArrowRight size={10} /></span>
         </div>
      </div>
    </div>
  );
};

export default LearningMode;
