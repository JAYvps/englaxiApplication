import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Volume2 } from 'lucide-react';
import Character from './Character';
import { Word } from '../types';

interface Props {
  script: { en: string; zh: string }[];
  onComplete: () => void;
  title?: string;
  vocabulary: Word[]; // Receive vocabulary from parent
}

const StoryMode: React.FC<Props> = ({ script, onComplete, title, vocabulary }) => {
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedEn, setDisplayedEn] = useState('');

  const currentLine = script[index];

  const speakerMatch = currentLine.en.match(/^([^:]+):/);
  const speaker = speakerMatch ? speakerMatch[1] : (title?.includes("穿越") ? "系统" : "Momo");
  const cleanEn = currentLine.en.replace(/^[^:]+:\s*/, '');
  const cleanZh = currentLine.zh.replace(/^[^:]+[:：]\s*/, '');

  const renderHighlightedText = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, i) => {
        const cleanWord = word.replace(/[.,!?;]/g, "").toLowerCase();
        // Use the vocabulary from props
        const vocabMatch = vocabulary.find(v => v.term.toLowerCase() === cleanWord);
        
        if (vocabMatch) {
            return (
                <span key={i} className="relative inline-block group">
                    <span className="text-orange-400 font-black underline decoration-orange-300/50 decoration-2 underline-offset-4">
                        {word}
                    </span>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-white/10 shadow-xl">
                        {vocabMatch.difficulty} | {vocabMatch.translation}
                    </span>
                </span>
            );
        }
        return word;
    });
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    setDisplayedEn('');
    setIsTyping(true);
    speak(cleanEn);

    let charIndex = 0;
    const timer = setInterval(() => {
      charIndex++;
      setDisplayedEn(cleanEn.slice(0, charIndex));
      if (charIndex >= cleanEn.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [index, cleanEn]);

  const handleNext = () => {
    if (isTyping) {
      setDisplayedEn(cleanEn);
      setIsTyping(false);
    } else {
      if (index < script.length - 1) {
        setIndex(index + 1);
      } else {
        onComplete();
      }
    }
  };

  return (
    <div className="h-full bg-slate-950 relative flex flex-col items-center overflow-hidden" onClick={handleNext}>
      {/* (Rest of the JSX is the same) */}
      <div className="flex-1 flex items-center justify-center z-10 w-full mb-24">
          <motion.div 
            key={index}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1.1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Character emotion={isTyping ? 'neutral' : 'happy'} scale={1.4} />
          </motion.div>
      </div>
      <div className="absolute bottom-6 left-4 right-4 z-30 flex flex-col items-center">
          <div className="w-full max-w-sm relative">
              <motion.div 
                key={`speaker-${speaker}`}
                className="absolute -top-10 left-6 bg-gradient-to-r from-orange-500 to-red-600 px-6 py-1.5 rounded-t-2xl border-t border-x border-white/20 shadow-lg"
              >
                  <span className="text-white text-[11px] font-black italic tracking-widest uppercase">{speaker}</span>
              </motion.div>
              <motion.div 
                className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 pb-10 shadow-2xl overflow-hidden group"
              >
                  <div className="space-y-4 relative">
                      <motion.div 
                        key={`en-${index}`}
                        className="text-white text-lg font-bold leading-relaxed tracking-wide min-h-[3rem]"
                      >
                         {renderHighlightedText(displayedEn)}
                         {isTyping && <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="inline-block w-2 h-5 bg-orange-500 ml-1 translate-y-1" />}
                      </motion.div>
                      <AnimatePresence>
                         {!isTyping && (
                             <motion.div 
                                 initial={{ opacity: 0, y: 5 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 className="text-slate-400 text-sm font-medium tracking-wide pt-3 border-t border-white/5"
                             >
                                 {cleanZh}
                             </motion.div>
                         )}
                      </AnimatePresence>
                  </div>
                  <motion.div 
                     animate={!isTyping ? { opacity: [0.4, 1, 0.4] } : { opacity: 0 }}
                     className="absolute bottom-3 right-8 flex items-center gap-1 text-[8px] font-black text-orange-400 tracking-widest uppercase"
                  >
                     <span>TAP TO NEXT</span>
                     <ChevronRight size={12} />
                  </motion.div>
              </motion.div>
          </div>
      </div>
    </div>
  );
};

export default StoryMode;