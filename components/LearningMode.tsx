import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Volume2, Sparkles, BookOpen, Star, Feather, Tag, GitBranch, RotateCw, Sword, Shield, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, RefreshCcw, Trophy } from 'lucide-react';
import { Word } from '../types';

function saveLearnedWords(newWords: Word[]) {
  if (!newWords || newWords.length === 0) return;
  const learnedWords = localStorage.getItem('learnedWords');
  const learnedWordIds = learnedWords ? JSON.parse(learnedWords) : [];
  const newWordIds = newWords.map(word => word.id);
  const combinedIds = [...new Set([...learnedWordIds, ...newWordIds])];
  localStorage.setItem('learnedWords', JSON.stringify(combinedIds));
}


interface Props {
  words: Word[];
  onComplete: () => void;
}

const LearningMode: React.FC<Props> = ({ words, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | 'back' | null>(null);
  const [isReadyPhase, setIsReadyPhase] = useState(false);
  const [dragX, setDragX] = useState(0);


  useEffect(() => {
    if (isReadyPhase) {
      saveLearnedWords(words);
    }
  }, [isReadyPhase, words]);

  const currentWord = words[currentIndex];
  
  if (!words || words.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-green-800 to-slate-900 text-white text-center">
            <Trophy size={64} className="text-yellow-400 mb-4" />
            <h2 className="text-3xl font-black italic mb-2">太棒了！</h2>
            <p className="text-indigo-200">你已经掌握了这个章节的所有内容！</p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="mt-8 w-full max-w-sm py-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl font-black text-xl shadow-lg"
            >
                继续前进
            </motion.button>
        </div>
      );
  }

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
    // "Remembered" -> Move card to the right
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
    } 
    else if (info.offset.x < -threshold) {
        handlePrevious();
    }
  };

  const highlightWord = (sentence: string, word: string) => {
      if (!sentence) {
          return ''; 
      }
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
        {/* Animated Background */}
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
                <span className="relative z-10 group-hover:translate-x-1 transition-transform">击败它</span>
                <Sword size={24} className="relative z-10 group-hover:rotate-45 transition-transform" />
            </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-between py-6 px-4 bg-gradient-to-b from-indigo-50 to-purple-100 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 left-10 text-pink-200 opacity-50"><Star size={40} /></div>
          <div className="absolute bottom-20 right-10 text-purple-200 opacity-50"><Sparkles size={50} /></div>
          <div className="absolute top-1/2 left-[-20px] w-20 h-20 bg-yellow-200 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Header / Progress */}
      <div className="w-full max-w-sm z-10 space-y-2">
        <div className="flex justify-between items-end px-2">
           <span className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
             <Feather size={12} /> 魔法口诀修习
           </span>
           <span className="text-indigo-600 font-bold text-lg">{currentIndex + 1} <span className="text-slate-300 text-sm">/ {words.length}</span></span>
        </div>
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
            className="w-full h-[480px] relative cursor-grab active:cursor-grabbing group perspective-1000"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Drag Overlay Text - Right (Remembered) */}
            {dragX > 50 && (
                <div className="absolute top-10 left-[-40px] z-50 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl px-6 py-3 rounded-2xl rotate-[-15deg] shadow-lg border-4 border-white flex items-center gap-2">
                    <Sparkles size={24} fill="currentColor" /> 记住了
                </div>
            )}
            {/* Drag Overlay Text - Left (Forgot) */}
            {dragX < -50 && (
                <div className="absolute top-10 right-[-40px] z-50 bg-gradient-to-r from-slate-400 to-slate-500 text-white font-black text-xl px-6 py-3 rounded-2xl rotate-[15deg] shadow-lg border-4 border-white flex items-center gap-2">
                    <RefreshCcw size={24} /> 没记住
                </div>
            )}

            <motion.div
                className="w-full h-full relative"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* FRONT SIDE */}
                <div 
                    className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border-2 border-white flex flex-col items-center justify-center p-8 backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {/* Tags */}
                    <div className="absolute top-6 left-6 flex gap-2">
                         {currentWord.tags.slice(0, 2).map(tag => (
                             <span key={tag} className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wider">
                                <Tag size={10} /> {tag}
                             </span>
                         ))}
                    </div>
                    {/* Difficulty */}
                    <div className={`absolute top-6 right-6 px-3 py-1 rounded-full border text-xs font-bold ${difficultyColor(currentWord.difficulty)}`}>
                        {currentWord.difficulty}
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <motion.h2 layoutId={`word-${currentWord.id}`} className="text-5xl font-black text-slate-800 tracking-tight text-center break-words w-full drop-shadow-sm">
                            {currentWord.term}
                        </motion.h2>
                        
                        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-xl text-indigo-600 font-serif text-lg border border-indigo-100">
                            <span>{currentWord.phonetic}</span>
                            <button 
                                onClick={(e) => speakText(currentWord.term, e)}
                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform active:scale-95 text-indigo-500"
                            >
                                <Volume2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto text-slate-400 text-sm font-medium flex items-center gap-2 animate-pulse">
                        <RotateCw size={14} />
                        点击翻转 / 左右滑动切换
                    </div>
                </div>

                {/* BACK SIDE */}
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white rounded-[2rem] shadow-2xl border-2 border-white flex flex-col p-8 backface-hidden"
                    style={{ 
                        backfaceVisibility: 'hidden', 
                        transform: "rotateY(180deg)" 
                    }}
                >
                    <div className="text-center border-b border-indigo-100 pb-4 mb-4">
                        <h3 className="text-2xl font-bold text-indigo-900">{currentWord.translation}</h3>
                        <p className="text-sm text-slate-500 mt-1 italic">{currentWord.definition}</p>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto">
                        

                        {/* Example */}
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <div className="flex items-center justify-between gap-2 text-blue-600 font-bold text-xs uppercase mb-1">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={12} />
                                    <span>咒语应用 (Context)</span>
                                </div>
                                <button 
                                    onClick={(e) => speakText(currentWord.example, e)}
                                    className="p-1.5 bg-white rounded-full text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
                                    title="Play Example"
                                >
                                    <Volume2 size={14} />
                                </button>
                            </div>
                            <p className="text-slate-700 text-sm italic mb-1 leading-relaxed">
                                "{highlightWord(currentWord.example, currentWord.term)}"
                            </p>
                            <p className="text-slate-500 text-xs">{currentWord.exampleTranslation}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Swipe Arrows Indicators */}
        {currentIndex > 0 && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full lg:translate-x-[-20px] text-white/30 flex flex-col items-center">
                <ArrowLeft size={30} />
                <span className="text-xs font-bold">没记住</span>
            </div>
        )}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full lg:translate-x-[20px] text-white/30 flex flex-col items-center">
            <ArrowRight size={30} />
            <span className="text-xs font-bold">记住了</span>
        </div>
      </div>

      {/* Footer Controls - Single Magic Button */}
      <div className="w-full max-w-sm z-20 pb-4">
         <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black text-xl py-5 rounded-3xl shadow-lg shadow-yellow-200 border-b-4 border-amber-600 hover:brightness-110 flex items-center justify-center gap-2 relative overflow-hidden group"
         >
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
             <Sparkles size={24} className="animate-pulse" />
             <span>我记住了</span>
             <Sparkles size={24} className="animate-pulse delay-100" />
         </motion.button>
         <div className="flex justify-between items-center text-xs text-slate-400 mt-3 px-2 opacity-80">
             <span className="flex items-center gap-1"><ArrowLeft size={10} /> 左滑: 没记住 (Prev)</span>
             <span>铭记于心，才能释放魔法</span>
             <span className="flex items-center gap-1">右滑: 记住了 (Next) <ArrowRight size={10} /></span>
         </div>
      </div>

    </div>
  );
};

export default LearningMode;