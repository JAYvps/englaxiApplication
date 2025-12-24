
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Lock, Star, Shield, Award, Medal } from 'lucide-react';

interface Props {
  playerMedals: number;
  completedNodesCount: number;
  onBack: () => void;
}

const AchievementScreen: React.FC<Props> = ({ playerMedals, completedNodesCount, onBack }) => {
  // Define medals based on journey milestones
  const achievementList = [
    { id: '1', name: '大唐先驱', desc: '开启取经之路', requirement: 1, icon: <Star className="text-yellow-500" /> },
    { id: '2', name: '初露锋芒', desc: '收集 3 枚勋章', requirement: 3, icon: <Shield className="text-blue-500" /> },
    { id: '3', name: '降妖达人', desc: '累计通关 10 个关卡', requirement: 10, countBased: true, icon: <Award className="text-purple-500" /> },
    { id: '4', name: '西行宗师', desc: '收集 8 枚勋章', requirement: 8, icon: <Trophy className="text-orange-500" /> },
    { id: '5', name: '功德无量', desc: '收集 15 枚勋章', requirement: 15, icon: <Medal className="text-red-500" /> },
  ];

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-4 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full text-slate-600 active:scale-90 transition-transform">
          <ArrowLeft size={20}/>
        </button>
        <h2 className="text-lg font-black text-slate-800">成就勋章墙</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-20">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-5 rounded-[2rem] border border-orange-100 shadow-sm flex flex-col items-center"
          >
            <Trophy size={40} className="text-orange-500 mb-2 drop-shadow-sm" />
            <span className="text-3xl font-black text-slate-800">{playerMedals}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">当前勋章</span>
          </motion.div>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-5 rounded-[2rem] border border-indigo-100 shadow-sm flex flex-col items-center"
          >
             <Star size={40} className="text-indigo-500 mb-2 drop-shadow-sm" />
             <span className="text-3xl font-black text-slate-800">{completedNodesCount}</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">通关节点</span>
          </motion.div>
        </div>

        {/* List */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2">所有成就</h3>
          <div className="flex flex-col gap-4">
            {achievementList.map((ach, idx) => {
              const currentVal = ach.countBased ? completedNodesCount : playerMedals;
              const isUnlocked = currentVal >= ach.requirement;
              const progress = Math.min(100, (currentVal / ach.requirement) * 100);

              return (
                <motion.div 
                  key={ach.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className={`p-5 rounded-3xl border-2 flex flex-col gap-4 transition-all ${
                    isUnlocked ? 'bg-white border-orange-100 shadow-lg' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${
                      isUnlocked ? 'bg-gradient-to-br from-orange-50 to-orange-100' : 'bg-slate-200'
                    }`}>
                      {isUnlocked ? ach.icon : <Lock size={24} className="text-slate-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-base font-black ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>{ach.name}</h4>
                        {isUnlocked && <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-black">已达成</span>}
                      </div>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">{ach.desc}</p>
                    </div>
                  </div>

                  {!isUnlocked && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-wider">
                         <span>进度: {currentVal} / {ach.requirement}</span>
                         <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-orange-400"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementScreen;
