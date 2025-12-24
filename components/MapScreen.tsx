
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JOURNEY_MAP } from '../data/journeyMap';
import { ArrowLeft, Lock, CheckCircle2, Sword, Trophy, ChevronRight, Map as MapIcon, Skull, Zap } from 'lucide-react';

interface Props {
  currentRegionIdx: number | null;
  setRegionIdx: (idx: number | null) => void;
  playerMedals: number;
  completedNodes: string[];
  onSelectStage: (index: number, subIndex?: number) => void;
  onBack: () => void;
}

const MapScreen: React.FC<Props> = ({ currentRegionIdx, setRegionIdx, playerMedals, completedNodes, onSelectStage, onBack }) => {
  if (!JOURNEY_MAP || JOURNEY_MAP.length === 0) {
    return <div className="p-20 text-center font-bold text-slate-400">地图数据加载中...</div>;
  }

  const getNodeCount = (regionIdx: number) => {
    if (regionIdx < 3) return 5;
    if (regionIdx < 6) return 8;
    return 10;
  };

  const isNodeUnlocked = (regionIdx: number, nodeIdx: number) => {
    const region = JOURNEY_MAP[regionIdx];
    if (playerMedals < (region.medalsRequired || 0)) return false;

    if (nodeIdx === 0) {
      if (regionIdx === 0) return true;
      const prevRegionNodeCount = getNodeCount(regionIdx - 1);
      const lastNodeOfPrevRegionId = `${JOURNEY_MAP[regionIdx - 1].id}_${prevRegionNodeCount - 1}`;
      return completedNodes.includes(lastNodeOfPrevRegionId);
    }

    const prevNodeId = `${region.id}_${nodeIdx - 1}`;
    return completedNodes.includes(prevNodeId);
  };

  // Find the first uncompleted but unlocked node in a region
  const getNextPlayableNode = (regionIdx: number) => {
    const count = getNodeCount(regionIdx);
    const region = JOURNEY_MAP[regionIdx];
    for (let i = 0; i < count; i++) {
      const nodeId = `${region.id}_${i}`;
      if (!completedNodes.includes(nodeId) && isNodeUnlocked(regionIdx, i)) {
        return i;
      }
    }
    return null;
  };

  const renderWorldMap = () => (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex-1 overflow-y-auto p-6 space-y-4"
    >
      <div className="bg-orange-100/50 p-4 rounded-3xl border border-orange-200 mb-4">
        <p className="text-xs font-black text-orange-600 flex items-center gap-2 uppercase tracking-tight">
          <MapIcon size={14} /> 选择你想前往的章节大区
        </p>
      </div>

      {JOURNEY_MAP.map((region, idx) => {
        const medalsNeeded = region.medalsRequired || 0;
        const isLocked = playerMedals < medalsNeeded;
        
        return (
          <motion.button
            key={region.id}
            whileTap={!isLocked ? { scale: 0.98 } : {}}
            onClick={() => !isLocked && setRegionIdx(idx)}
            className={`w-full p-4 rounded-[1.5rem] border-2 flex items-center justify-between transition-all shadow-sm ${
              isLocked ? 'bg-slate-100 border-slate-200 opacity-60' : 'bg-white border-orange-100 hover:border-orange-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLocked ? 'bg-slate-200' : 'bg-orange-50'}`}>
                {isLocked ? <Lock size={20} className="text-slate-400" /> : <MapIcon size={20} className="text-orange-500" />}
              </div>
              <div className="text-left">
                <h3 className={`font-black text-sm ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>{region.name}</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{region.location}</span>
              </div>
            </div>
            {!isLocked ? (
              <ChevronRight size={20} className="text-orange-300" />
            ) : (
              <div className="bg-red-50 px-2 py-1 rounded-lg flex items-center gap-1">
                 <Trophy size={10} className="text-red-400" />
                 <span className="text-[10px] font-black text-red-400">{medalsNeeded}</span>
              </div>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );

  const renderRegionDetail = (idx: number) => {
    const region = JOURNEY_MAP[idx];
    const nodeCount = getNodeCount(idx);
    const nextNode = getNextPlayableNode(idx);

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="flex-1 flex flex-col"
      >
        <div className="p-4 bg-orange-50 border-b border-orange-100 flex items-center justify-between">
          <button 
            onClick={() => setRegionIdx(null)}
            className="flex items-center gap-2 text-xs font-black text-orange-600 bg-white px-3 py-1.5 rounded-xl border border-orange-200 active:scale-90 transition-all shadow-sm"
          >
            <ArrowLeft size={14} /> 返回大地图
          </button>
          <div className="text-right">
             <span className="text-[10px] font-black text-slate-400 uppercase block leading-none">当前章节</span>
             <span className="text-sm font-black text-slate-800">{region.name}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 relative flex flex-col items-center gap-14 pb-48">
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-l-2 border-dashed border-orange-200 -translate-x-1/2 z-0" />

          {Array.from({ length: nodeCount }).map((_, nodeIdx) => {
            const nodeId = `${region.id}_${nodeIdx}`;
            const isCompleted = completedNodes.includes(nodeId);
            const isUnlocked = isNodeUnlocked(idx, nodeIdx);
            const isBoss = nodeIdx === nodeCount - 1;

            return (
              <motion.div 
                key={nodeId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative z-10 flex flex-col items-center ${nodeIdx % 2 === 0 ? 'translate-x-10' : '-translate-x-10'}`}
              >
                <button 
                  disabled={!isUnlocked}
                  onClick={() => onSelectStage(idx, nodeIdx)}
                  className="relative group active:scale-90 transition-transform"
                >
                   <div className={`
                     w-16 h-16 rounded-3xl flex items-center justify-center border-4 transition-all shadow-xl
                     ${!isUnlocked ? 'bg-slate-100 border-slate-200 text-slate-300' : 
                       isCompleted ? 'bg-green-500 border-green-300 text-white' : 
                       isBoss ? 'bg-gradient-to-br from-red-600 to-purple-800 border-red-200 text-white shadow-red-200' :
                       'bg-gradient-to-br from-orange-400 to-amber-600 border-white text-white animate-pulse shadow-orange-100'}
                   `}>
                     {!isUnlocked ? <Lock size={20} /> : 
                      isCompleted ? <CheckCircle2 size={24} /> :
                      isBoss ? <Skull size={32} /> : <Sword size={28} />}
                   </div>
                   <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap flex flex-col items-center">
                       <span className={`text-[10px] font-black tracking-tight ${isCompleted ? 'text-green-600' : isUnlocked ? 'text-slate-600' : 'text-slate-300'}`}>
                          {isBoss ? '终极 Boss' : `第 ${nodeIdx + 1} 关`}
                       </span>
                   </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Floating Continue Button */}
        {nextNode !== null && (
          <div className="absolute bottom-6 left-6 right-6 z-30">
            <motion.button
              initial={{ y: 100 }} animate={{ y: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectStage(idx, nextNode)}
              className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black text-xl rounded-2xl shadow-xl shadow-orange-200 flex items-center justify-center gap-3 group border-b-4 border-red-800"
            >
              <Zap size={24} className="animate-pulse" />
              <span>继续修行 (第 {nextNode + 1} 关)</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="h-full bg-[#FFF9F2] flex flex-col relative overflow-hidden">
      <div className="p-4 flex items-center justify-between bg-white/80 backdrop-blur z-20 border-b border-orange-100 shadow-sm">
        <button onClick={onBack} className="p-2 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-lg font-black text-slate-800 italic">西天取经之路</h2>
            <div className="flex items-center gap-1 bg-orange-100 px-2 py-0.5 rounded-full">
                <Trophy size={10} className="text-orange-600" />
                <span className="text-[10px] font-black text-orange-600">{playerMedals} 勋章</span>
            </div>
        </div>
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">
        {currentRegionIdx === null ? renderWorldMap() : renderRegionDetail(currentRegionIdx)}
      </AnimatePresence>
    </div>
  );
};

export default MapScreen;
