import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Character from './Character';

interface Props {
  script: string[];
  onComplete: () => void;
}

const StoryMode: React.FC<Props> = ({ script, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Parse current line into Name and Content
  const currentLine = script[index];
  // Simple parser: assumes "Name: Message" format. If no colon, Name is "System"
  const colonIndex = currentLine.indexOf(':');
  const speakerName = colonIndex !== -1 ? currentLine.substring(0, colonIndex).trim() : '';
  const dialogueContent = colonIndex !== -1 ? currentLine.substring(colonIndex + 1).trim() : currentLine;

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let charIndex = 0; // Local counter for slicing
    
    const timer = setInterval(() => {
      charIndex++;
      // Use slice ensures we always render from the start of the string to the current index
      // avoiding race conditions or dropped characters logic
      const currentSlice = dialogueContent.slice(0, charIndex);
      setDisplayedText(currentSlice);

      if (charIndex >= dialogueContent.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 40); // speed of typing

    return () => clearInterval(timer);
  }, [index, dialogueContent]);

  const handleNext = () => {
    if (isTyping) {
      // Instant finish typing
      setDisplayedText(dialogueContent);
      setIsTyping(false);
    } else {
      // Move to next line
      if (index < script.length - 1) {
        setIndex(index + 1);
      } else {
        onComplete();
      }
    }
  };

  return (
    <div className="h-full relative flex flex-col overflow-hidden bg-slate-50" onClick={handleNext}>
      {/* CSS Background (No Images) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50" />
      
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
         <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[50%] bg-blue-200/20 rounded-full blur-3xl" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] bg-pink-200/20 rounded-full blur-3xl" />
         
         {/* Floating particles */}
         {[...Array(6)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute text-white/40"
             initial={{ 
               x: Math.random() * 300, 
               y: Math.random() * 600,
               scale: Math.random() * 0.5 + 0.5
             }}
             animate={{ 
               y: [0, -50, 0],
               opacity: [0.3, 0.6, 0.3] 
             }}
             transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
             style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
           >
             <div className="w-4 h-4 rounded-full bg-white blur-sm" />
           </motion.div>
         ))}
      </div>

      {/* Character */}
      <div className="flex-1 flex items-end justify-center pb-32 z-10">
        <Character emotion="neutral" scale={1.2} />
      </div>

      {/* Dialogue Box */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-6 left-4 right-4 z-20"
      >
        <div className="glass-panel p-6 rounded-3xl shadow-xl min-h-[160px] relative flex flex-col bg-white/60 backdrop-blur-xl border border-white/50">
          
          {/* Name Tag */}
          {speakerName && (
             <div className="absolute -top-3 left-6">
                <span className="bg-pink-500 text-white font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide shadow-md border border-pink-400">
                  {speakerName}
                </span>
             </div>
          )}

          <p className="text-slate-700 text-lg leading-relaxed font-medium mt-2">
            {displayedText}
            {/* Blinking cursor only when typing */}
            {isTyping && (
                <span className="inline-block w-0.5 h-5 bg-pink-500 ml-1 align-middle animate-pulse" />
            )}
          </p>

          {/* Next Arrow - Only shows when typing is done */}
          {!isTyping && (
            <div className="absolute bottom-4 right-4 text-pink-400 animate-bounce">
                <ChevronRight size={28} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StoryMode;