import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Volume2, X, BookOpen, GitBranch, Sparkles, PlayCircle, BookCheck, RefreshCw } from 'lucide-react';
import { getWords } from '../services/apiService';
import { DifficultyLevel, Word } from '../types';

interface Props {
  onBack: () => void;
  onStartPractice: (words: Word[]) => void;
}

const WordVault: React.FC<Props> = ({ onBack, onStartPractice }) => {
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<DifficultyLevel | 'All'>('All');
  const [search, setSearch] = useState('');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  useEffect(() => {
    const fetchAllWords = async () => {
      setIsLoading(true);
      // Fetch a large number of words to populate the vault. 'All' difficulty.
      const words = await getWords('All', 500); 
      setAllWords(words);
      setIsLoading(false);
    };

    fetchAllWords();
  }, []);

  const filteredWords = allWords.filter(w => {
    const matchesFilter = filter === 'All' || w.difficulty === filter;
    const matchesSearch = w.term.toLowerCase().includes(search.toLowerCase()) || 
                          w.translation.includes(search);
    return matchesFilter && matchesSearch;
  });

  const speak = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handlePractice = () => {
    if (filteredWords.length > 0) {
      const practiceSet = [...filteredWords].sort(() => 0.5 - Math.random());
      onStartPractice(practiceSet.slice(0, 10)); // Take 10 random words from the filtered list
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-100 rounded-full text-slate-600 active:scale-90 transition-transform"><ArrowLeft size={20}/></button>
          <h2 className="text-lg font-black text-slate-800">单词宝库</h2>
        </div>
        <button 
          onClick={handlePractice}
          disabled={filteredWords.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-xl font-black text-xs shadow-lg shadow-orange-100 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayCircle size={14} />
          刷单词
        </button>
      </div>

      {/* Controls */}
      <div className="p-4 bg-white shadow-sm space-y-4 z-10">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索单词或翻译..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
           {['All', 'Basic', 'CET-4', 'CET-6'].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f as any)}
               className={`px-4 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all ${
                 filter === f ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-400'
               }`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <RefreshCw size={48} className="animate-spin" />
            <p className="font-bold mt-4">正在从书海中捞取...</p>
          </div>
        ) : filteredWords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-2">
            <BookCheck size={48} />
            <p className="font-bold">未找到相关单词</p>
          </div>
        ) : (
          filteredWords.map((word) => (
            <motion.div 
              layout
              key={word.id}
              onClick={() => setSelectedWord(word)}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group active:scale-95 transition-transform cursor-pointer hover:border-orange-200"
            >
              <div className="flex flex-col">
                 <div className="flex items-center gap-2">
                   <span className="text-lg font-black text-slate-800">{word.term}</span>
                   <span className="text-[10px] text-slate-400 font-bold">{word.phonetic}</span>
                 </div>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-orange-600">{word.translation}</span>
                    <span className={`text-[8px] px-1.5 rounded border ${word.difficulty === 'CET-4' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {word.difficulty}
                    </span>
                 </div>
              </div>
              <button 
                onClick={(e) => speak(word.term, e)}
                className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
              >
                <Volume2 size={18} />
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Word Detail Modal (Sentence Analysis) */}
      <AnimatePresence>
        {selectedWord && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setSelectedWord(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md rounded-t-[3rem] p-8 shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
               <button 
                 onClick={() => setSelectedWord(null)}
                 className="absolute top-6 right-8 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
               >
                 <X size={20} />
               </button>

               <div className="text-center mb-6">
                  <h2 className="text-4xl font-black text-slate-800">{selectedWord.term}</h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-slate-400 font-medium italic">{selectedWord.phonetic}</span>
                    <button onClick={() => speak(selectedWord.term)} className="text-orange-500 p-1.5 bg-orange-50 rounded-full active:scale-90 transition-transform">
                      <Volume2 size={16} />
                    </button>
                  </div>
                  <div className="mt-4 inline-block px-4 py-1.5 bg-orange-100 rounded-2xl">
                    <p className="text-xl font-black text-orange-600">{selectedWord.translation}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  {/* Definition */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <BookOpen size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">词典释义</span>
                     </div>
                     <p className="text-sm text-slate-600 leading-relaxed italic">{selectedWord.definition}</p>
                  </div>

                  {/* Example (Sentence Analysis Focus) */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-3xl border border-orange-200 shadow-sm relative group">
                     <div className="flex items-center justify-between gap-2 text-orange-400 mb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-orange-500" />
                          <span className="text-xs font-black uppercase tracking-widest text-orange-600">例句精析</span>
                        </div>
                        <button 
                          onClick={() => speak(selectedWord.example)} 
                          className="bg-white text-orange-500 p-2 rounded-full shadow-sm active:scale-90 transition-transform"
                        >
                           <Volume2 size={18} />
                        </button>
                     </div>
                     <p className="text-lg font-black text-slate-800 leading-snug mb-2">
                        {selectedWord.example.split(new RegExp(`(${selectedWord.term})`, 'gi')).map((part, i) => 
                          part.toLowerCase() === selectedWord.term.toLowerCase() ? 
                          <span key={i} className="text-orange-600 bg-orange-100/50 px-1 rounded">{part}</span> : part
                        )}
                     </p>
                     <p className="text-sm font-bold text-slate-500 italic border-t border-orange-100 pt-2">{selectedWord.exampleTranslation}</p>
                  </div>

                  {/* Etymology */}
                  {selectedWord.etymology && (
                    <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                      <div className="flex items-center gap-2 text-indigo-400 mb-1">
                        <GitBranch size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">记忆口诀</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{selectedWord.etymology}</p>
                    </div>
                  )}
               </div>

               <button 
                 onClick={() => setSelectedWord(null)}
                 className="w-full mt-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-transform"
               >
                 掌握了
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WordVault;