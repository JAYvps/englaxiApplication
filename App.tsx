import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GamePhase, LevelData, DifficultyLevel, SkinId } from './types';
import { generateLevelContent, generateCheatList, PROLOGUE_SCRIPT, CHEAT_SCRIPT } from './services/serviceLayer';
import WelcomeScreen from './components/WelcomeScreen';
import StoryMode from './components/StoryMode';
import LearningMode from './components/LearningMode';
import BossBattle from './components/BossBattle';
import RewardScreen from './components/RewardScreen';
import Shop from './components/Shop';
import { ArrowLeft, Home, Trophy, FlaskConical, Zap, BookOpen } from 'lucide-react';

/**为什么要{*这么写*} 因为比较炫酷 */

const App: React.FC = () => {

  const [phase, setPhase] = useState<GamePhase>(GamePhase.PROLOGUE);
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('Basic');
  const [stageIndex, setStageIndex] = useState(0);
  

  const [playerLevel, setPlayerLevel] = useState(1);
  const [exp, setExp] = useState(0); 
  const [gems, setGems] = useState(0);
  const [potions, setPotions] = useState(0);
  

  const [gemMultiplier, setGemMultiplier] = useState(1);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [hasCompletedChallenge, setHasCompletedChallenge] = useState(false);
  const [isCheatMode, setIsCheatMode] = useState(false);


  const [ownedSkins, setOwnedSkins] = useState<SkinId[]>(['default']);
  const [equippedSkin, setEquippedSkin] = useState<SkinId>('default');

  const [showExitModal, setShowExitModal] = useState(false);


  const getMaxExp = (level: number) => {
    if (level === 1) return 1000;
    if (level === 2) return 2500;
    return 2500 + (level - 2) * 1000;
  };

  const handlePrologueComplete = () => {
    setPhase(GamePhase.WELCOME);
  };



  const startGame = async (difficulty: DifficultyLevel) => {
    setLoading(true);
    setCurrentDifficulty(difficulty);
    setStageIndex(0); 
    setGemMultiplier(1); 
    setIsChallengeMode(false);
    setIsCheatMode(false);
    setHasCompletedChallenge(false); 
    
    const data = await generateLevelContent(difficulty, 0, false);
    setLevelData(data);
    setLoading(false);
    setPhase(GamePhase.STORY_INTRO);
  };

  const startChallengeLevel = async () => {
    setLoading(true);
    setIsChallengeMode(true);
    setIsCheatMode(false);
    
    const data = await generateLevelContent(currentDifficulty, stageIndex, true);
    setLevelData(data);
    setLoading(false);
    setPhase(GamePhase.STORY_INTRO);
  };



  const startCheatMode = () => {
      setPhase(GamePhase.CHEAT_STORY);
  };

  const handleCheatStoryComplete = () => {
      setPhase(GamePhase.CHEAT_SELECTION);
  };

  const selectCheatDifficulty = async (difficulty: DifficultyLevel) => {
      setLoading(true);
      setIsCheatMode(true);
      const words = await generateCheatList(difficulty);
      
      setLevelData({
          title: "高效速记",
          introStory: [],
          words: words,
          bossName: "None",
          theme: difficulty
      });
      setLoading(false);
      setPhase(GamePhase.LEARNING);
  };


  const handleStoryComplete = () => {
    setPhase(GamePhase.LEARNING);
  };

  const handleLearningComplete = () => {
    if (isCheatMode) {
        setPhase(GamePhase.WELCOME);
        setLevelData(null);
    } else {
        setPhase(GamePhase.BATTLE);
    }
  };

  const handleVictory = () => {
    setPhase(GamePhase.REWARD);
  };

  const handleDefeat = () => {
    setPhase(GamePhase.LEARNING);
  };

  const handleUsePotion = () => {
      setPotions(prev => Math.max(0, prev - 1));
  };

  const handleNextChapter = async () => {
    let earnedExp = 0;
    let earnedGems = 50 * gemMultiplier;

    if (isChallengeMode) {
        earnedExp = 66; 
        earnedGems = 66; 
        setGemMultiplier(2); // 宝石*2
        setHasCompletedChallenge(true); // 标记已经完成
        setIsChallengeMode(false); // 重置挑战标志
    } else {

        if (currentDifficulty === 'Basic') earnedExp = 150;
        if (currentDifficulty === 'CET-4') earnedExp = 200;
        if (currentDifficulty === 'CET-6') earnedExp = 300;
    }

    // 2. Update State
    setGems(prev => prev + earnedGems);
    
    // 3. 升级逻辑 有bug 现在不管
    let currentExpTotal = exp + earnedExp;
    let currentLvl = playerLevel;
    let nextMaxExp = getMaxExp(currentLvl);

    while (currentExpTotal >= nextMaxExp) {
      currentExpTotal -= nextMaxExp;
      currentLvl += 1;
      nextMaxExp = getMaxExp(currentLvl);
    }
    
    setPlayerLevel(currentLvl);
    setExp(currentExpTotal);

    // 4. 下一个阶段生成内容
    setPhase(GamePhase.STORY_INTRO);
    setLoading(true);
    
    const nextStage = stageIndex + 1;
    setStageIndex(nextStage);

    const data = await generateLevelContent(currentDifficulty, nextStage, false);
    setLevelData(data);
    setLoading(false);
  };

  const handleBackClick = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    setShowExitModal(false);
    setPhase(GamePhase.WELCOME);
    setLevelData(null);
    setStageIndex(0);
    setGemMultiplier(1);
    setHasCompletedChallenge(false);
    setIsCheatMode(false);
  };

  const openShop = () => setPhase(GamePhase.SHOP);
  const closeShop = () => setPhase(GamePhase.WELCOME);
  
  const handleBuySkin = (skin: SkinId, price: number) => {
    if (gems >= price && !ownedSkins.includes(skin)) {
      setGems(prev => prev - price);
      setOwnedSkins(prev => [...prev, skin]);
    }
  };

  const handleBuyItem = (id: string, price: number) => {
      if (gems >= price) {
          setGems(prev => prev - price);
          if (id === 'potion') {
              setPotions(prev => prev + 1);
          }
      }
  };

  const handleEquipSkin = (skin: SkinId) => {
    if (ownedSkins.includes(skin)) {
      setEquippedSkin(skin);
    }
  };

  return (
    <div className="w-full h-screen bg-pink-50 flex justify-center overflow-hidden">
      <div className="w-full max-w-md h-full bg-white shadow-2xl overflow-hidden relative font-sans">
        
        {/* --- 全局标题 --- */}
        {phase !== GamePhase.WELCOME && phase !== GamePhase.SHOP && phase !== GamePhase.PROLOGUE && phase !== GamePhase.CHEAT_SELECTION && (
          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-40 pointer-events-none">
             <button 
                onClick={handleBackClick} 
                className="pointer-events-auto bg-white/90 backdrop-blur p-2.5 rounded-2xl shadow-sm border border-slate-100 text-slate-600 active:scale-90 transition-transform"
             >
               <ArrowLeft size={22} />
             </button>

             <div className="flex gap-2">
      
                 <div className="bg-white/90 backdrop-blur pl-2 pr-3 py-1.5 rounded-2xl shadow-sm border border-pink-100 text-slate-800 font-bold flex items-center gap-1">
                    <FlaskConical size={14} className="text-pink-500" />
                    <span className="text-sm">{potions}</span>
                 </div>

                 <div className="bg-white/90 backdrop-blur pl-3 pr-4 py-1.5 rounded-2xl shadow-sm border border-pink-100 text-slate-800 font-black italic flex items-center gap-2">
                   <div className="bg-pink-500 text-white text-[10px] font-bold px-1.5 rounded-md">LV</div>
                   <span className="text-xl text-pink-500">{playerLevel}</span>
                 </div>
             </div>
          </div>
        )}

        <AnimatePresence>
          {showExitModal && (
            <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm text-center"
               >
                  <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">返回主页？</h3>
                  <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                    {isCheatMode ? "秘籍修习将被中断，要返回吗？" : "这将返回到游戏开始页面。当前关卡进度将会丢失，要继续吗？"}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                     <button 
                       onClick={() => setShowExitModal(false)}  
                       className="py-3 px-4 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                     >
                       取消
                     </button>
                     <button 
                       onClick={confirmExit}
                       className="py-3 px-4 rounded-xl bg-pink-500 text-white font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200"
                     >
                       确认退出
                     </button>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        
        {phase === GamePhase.PROLOGUE && (
          <StoryMode 
            script={PROLOGUE_SCRIPT} 
            onComplete={handlePrologueComplete} 
          />
        )}

        {/* --- Cheat Story Screen --- */}
        {phase === GamePhase.CHEAT_STORY && (
            <StoryMode 
                script={CHEAT_SCRIPT}
                onComplete={handleCheatStoryComplete}
            />
        )}

        
        {phase === GamePhase.CHEAT_SELECTION && (
            <div className="h-full bg-gradient-to-b from-indigo-900 to-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full blur-[100px]" />
                </div>
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="z-10 w-full max-w-sm space-y-6"
                >
                    <div className="text-center">
                        <Zap size={64} className="text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                        <h2 className="text-3xl font-black text-white italic mb-2">速记秘籍</h2>
                        <p className="text-indigo-200 text-sm">选择你要强化的魔法领域</p>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={() => selectCheatDifficulty('CET-4')}
                            className="w-full bg-white/10 backdrop-blur border border-white/20 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-all group"
                        >
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <BookOpen className="text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-white font-bold text-lg">四级高频口诀</h3>
                                <p className="text-slate-400 text-xs">CET-4 High Frequency</p>
                            </div>
                        </button>

                        <button 
                            onClick={() => selectCheatDifficulty('CET-6')}
                            className="w-full bg-white/10 backdrop-blur border border-white/20 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-all group"
                        >
                            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <BookOpen className="text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-white font-bold text-lg">六级进阶口诀</h3>
                                <p className="text-slate-400 text-xs">CET-6 High Frequency</p>
                            </div>
                        </button>
                    </div>

                    <button 
                        onClick={() => setPhase(GamePhase.WELCOME)}
                        className="text-slate-500 text-sm font-bold mt-8 hover:text-white transition-colors"
                    >
                        返回主页
                    </button>
                </motion.div>
            </div>
        )}

        
        {phase === GamePhase.WELCOME && (
          <WelcomeScreen 
            onStart={startGame} 
            isLoading={loading} 
            onOpenShop={openShop}
            level={playerLevel}
            gems={gems}
            currentExp={exp}
            maxExp={getMaxExp(playerLevel)}
            equippedSkin={equippedSkin}
            onCheatMode={startCheatMode}
          />
        )}

        
        {phase === GamePhase.SHOP && (
          <Shop 
            gems={gems} 
            ownedSkins={ownedSkins} 
            equippedSkin={equippedSkin} 
            onClose={closeShop}
            onBuy={handleBuySkin}
            onBuyItem={handleBuyItem}
            onEquip={handleEquipSkin}
          />
        )}

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex items-center justify-center flex-col gap-4"
              >
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-pink-100 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-pink-600 font-bold text-lg animate-pulse">
                      {isChallengeMode ? 'BOSS 降临中...' : (stageIndex > 0 ? `前往下一章...` : `正在生成世界...`)}
                    </h3>
                  </div>
              </motion.div>
          )}
        </AnimatePresence>

        {levelData && !loading && (
          <>
            {phase === GamePhase.STORY_INTRO && (
              <StoryMode 
                script={levelData.introStory} 
                onComplete={handleStoryComplete} 
              />
            )}

            {phase === GamePhase.LEARNING && (
              <LearningMode 
                words={levelData.words} 
                onComplete={handleLearningComplete} 
              />
            )}

            {phase === GamePhase.BATTLE && (
              <BossBattle 
                levelData={levelData} 
                onVictory={handleVictory} 
                onDefeat={handleDefeat}
                potions={potions}
                onUsePotion={handleUsePotion}
              />
            )}

            {phase === GamePhase.REWARD && (
              <RewardScreen 
                onRestart={handleNextChapter}
                onChallenge={startChallengeLevel} 
                playerLevel={playerLevel} 
                earnedExp={isChallengeMode ? 66 : (currentDifficulty === 'Basic' ? 150 : currentDifficulty === 'CET-4' ? 200 : 300)}
                earnedGems={isChallengeMode ? 66 : (50 * gemMultiplier)}
                currentExp={exp}
                maxExp={getMaxExp(playerLevel)}
                showChallengeButton={!hasCompletedChallenge} 
              /> 
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;