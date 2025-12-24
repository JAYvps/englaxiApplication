import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GamePhase, LevelData, DifficultyLevel, Player, Word } from './types';
import { JOURNEY_MAP, REGION_BOSSES } from './data/journeyMap';
import { getWords, updateUser } from './services/apiService';
import { generatePrologue, generateReplayStory } from './services/aiService';
import WelcomeScreen from './components/WelcomeScreen';
import StoryMode from './components/StoryMode';
import LearningMode from './components/LearningMode';
import BossBattle from './components/BossBattle';
import RewardScreen from './components/RewardScreen';
import MapScreen from './components/MapScreen';
import Shop from './components/Shop';
import AuthScreen from './components/AuthScreen';
import WordVault from './components/WordVault';
import AchievementScreen from './components/AchievementScreen';
import { Sparkles, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.AUTH);
  const [player, setPlayer] = useState<Player | null>(null);
  const [vocabulary, setVocabulary] = useState<Word[]>([]);
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const [selectedRegionIdx, setSelectedRegionIdx] = useState<number | null>(null);
  const [prologueScript, setPrologueScript] = useState<{en: string, zh: string}[]>([]);

  // Fetch all vocabulary once on initial load, only runs once
  useEffect(() => {
    const fetchVocabulary = async () => {
      const words = await getWords('All', 500); // Get all words for highlighting
      setVocabulary(words);
    };
    fetchVocabulary();
  }, []);

  const getMaxExp = (level: number) => 1000 + (level - 1) * 1500;

  const handleLoginSuccess = async (loggedInPlayer: Player) => {
    setPlayer(loggedInPlayer);
    setLoading(true);
    try {
        const script = await generatePrologue();
        setPrologueScript(script || []);
        setPhase(GamePhase.PROLOGUE);
    } catch (e) {
        console.error("Prologue generation failed", e);
        setPhase(GamePhase.WELCOME);
    } finally {
        setLoading(false);
    }
  };

  const handleUpdatePlayer = async (updatedPlayer: Player) => {
    setPlayer(updatedPlayer); // Optimistic update for smooth UI
    try {
      await updateUser(updatedPlayer);
    } catch (error) {
      console.error("Failed to update player on backend, state might be inconsistent.", error);
    }
  };

  const handleSelectStage = async (regionIdx: number, subIdx: number = 0) => {
    if (!JOURNEY_MAP[regionIdx] || !player) return;
    
    setLoading(true);
    setSelectedRegionIdx(regionIdx);
    const region = JOURNEY_MAP[regionIdx];
    const isReplay = player.completedNodes.includes(`${region.id}_${subIdx}`);
    
    // This logic is from the original project
    const nodeCount = regionIdx < 3 ? 5 : regionIdx < 6 ? 8 : 10;
    const isBossNode = subIdx === nodeCount - 1;

    try {
      const script = await generateReplayStory(region.name, isReplay);
      let difficulty: DifficultyLevel = 'Basic';
      if (regionIdx >= 7) difficulty = 'CET-6';
      else if (regionIdx >= 3) difficulty = 'CET-4';
      
      // This is the new progressive word count feature
      const wordCount = isBossNode ? 18 : (6 + (subIdx * 2));
      const selectedWords = await getWords(difficulty, wordCount);

      setLevelData({
          title: `${region.name} [第 ${subIdx + 1} 关]`,
          theme: region.location,
          bossName: isBossNode ? (REGION_BOSSES[region.id] || "终极首领") : "小妖怪",
          introStory: script,
          words: selectedWords,
          type: isBossNode ? 'boss' : 'battle',
          isReplay: isReplay
      });

      setPhase(GamePhase.STORY_INTRO);
    } catch (error) {
      console.error("Stage setup failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVictory = () => {
    if (!levelData || !player) return;
    
    const baseNodeId = levelData.title.split(' [')[0];
    const region = JOURNEY_MAP.find(r => r.name === baseNodeId);
    const subIdxMatch = levelData.title.match(/第 (\d+) 关/);
    const subIdx = subIdxMatch ? parseInt(subIdxMatch[1]) - 1 : 0;
    const uniqueNodeId = region ? `${region.id}_${subIdx}` : "unknown";

    const alreadyCompleted = player.completedNodes.includes(uniqueNodeId);
    const expGain = levelData.isReplay ? 75 : 150;
    const gemGain = levelData.type === 'boss' ? 150 : 50;

    let newMedals = player.medals;
    if (levelData.type === 'boss' && !alreadyCompleted) newMedals += 3;
    
    let newExp = player.exp + expGain;
    let newLevel = player.level;
    while (newExp >= getMaxExp(newLevel)) {
      newExp -= getMaxExp(newLevel);
      newLevel += 1;
    }
    
    const updatedPlayer: Player = {
        ...player,
        level: newLevel,
        exp: newExp,
        gems: player.gems + gemGain,
        medals: newMedals,
        completedNodes: [...new Set([...player.completedNodes, uniqueNodeId])]
    };

    handleUpdatePlayer(updatedPlayer);
    setPhase(GamePhase.REWARD);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    setPhase(GamePhase.WELCOME);
    setLevelData(null);
  };
  
  if (!player) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="w-full h-screen bg-orange-50 flex justify-center overflow-hidden">
      <div className="w-full max-md h-full bg-white shadow-2xl overflow-hidden relative font-sans">
        
        {/* Exit Confirmation Modal (Original Logic) */}
        <AnimatePresence>
          {showExitConfirm && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
               <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 w-full max-w-xs text-center shadow-2xl">
                 <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} /></div>
                 <h3 className="text-xl font-black text-slate-800 mb-2">返回主页？</h3>
                 <p className="text-slate-500 text-sm mb-6 leading-relaxed">当前的修炼进度将<span className="text-red-500 font-bold">丢失</span>。确定要放弃这次修行吗？</p>
                 <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => setShowExitConfirm(false)} className="py-3 bg-slate-100 text-slate-600 font-bold rounded-xl active:scale-95 transition-all">继续修行</button>
                   <button onClick={confirmExit} className="py-3 bg-red-500 text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-red-200">确定离开</button>
                 </div>
               </motion.div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay (Original Logic) */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-white flex flex-col items-center justify-center">
               <div className="relative"><div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" /><Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-400" /></div>
               <p className="mt-4 font-black text-orange-500 animate-pulse tracking-widest uppercase text-xs">AI 正在编织命运...</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {phase === GamePhase.PROLOGUE && <StoryMode title="穿越：大梦初醒" script={prologueScript} onComplete={() => setPhase(GamePhase.WELCOME)} vocabulary={vocabulary} />}
        {phase === GamePhase.WELCOME && <WelcomeScreen onStartJourney={() => setPhase(GamePhase.MAP)} onOpenShop={() => setPhase(GamePhase.SHOP)} onOpenVault={() => setPhase(GamePhase.VAULT)} onOpenAchievements={() => setPhase(GamePhase.ACHIEVEMENTS)} level={player.level} gems={player.gems} currentExp={player.exp} maxExp={getMaxExp(player.level)} equippedSkin={player.equippedSkin}/>}
        {phase === GamePhase.MAP && <MapScreen currentRegionIdx={selectedRegionIdx} setRegionIdx={setSelectedRegionIdx} playerMedals={player.medals} completedNodes={player.completedNodes} onSelectStage={handleSelectStage} onBack={() => setPhase(GamePhase.WELCOME)} />}
        {phase === GamePhase.VAULT && <WordVault onBack={() => setPhase(GamePhase.WELCOME)} onStartPractice={(words) => { setLevelData({ title: "单词精刷练习", theme: "单词宝库", bossName: "练习木人桩", introStory: [{ en: "Practice makes perfect.", zh: "熟能生巧。" }], words: words, type: 'battle', isReplay: true }); setPhase(GamePhase.STORY_INTRO); }} />}
        {phase === GamePhase.ACHIEVEMENTS && <AchievementScreen playerMedals={player.medals} completedNodesCount={player.completedNodes.length} onBack={() => setPhase(GamePhase.WELCOME)} />}
        {phase === GamePhase.SHOP && (
          <Shop 
            gems={player.gems} ownedSkins={player.ownedSkins} equippedSkin={player.equippedSkin}
            potions={player.potions} medals={player.medals}
            onClose={() => setPhase(GamePhase.WELCOME)}
            onBuy={(skin, price) => { if (player.gems >= price) handleUpdatePlayer({ ...player, gems: player.gems - price, ownedSkins: [...player.ownedSkins, skin] }); }}
            onBuyItem={(itemId, price) => { if (player.gems >= price) { const updatedPlayer = { ...player, gems: player.gems - price }; if (itemId === 'potion') updatedPlayer.potions += 1; if (itemId === 'medal') updatedPlayer.medals += 1; handleUpdatePlayer(updatedPlayer); } }}
            onEquip={(skin) => handleUpdatePlayer({ ...player, equippedSkin: skin })}
          />
        )}

        {levelData && (
          <>
            {phase === GamePhase.STORY_INTRO && <StoryMode title={levelData.title} script={levelData.introStory} onComplete={() => levelData.type === 'story' ? handleVictory() : setPhase(GamePhase.LEARNING)} vocabulary={vocabulary} />}
            {phase === GamePhase.LEARNING && <LearningMode words={levelData.words} onComplete={() => setPhase(GamePhase.BATTLE)} onBack={() => setShowExitConfirm(true)} />}
            {phase === GamePhase.BATTLE && <BossBattle levelData={levelData} onVictory={handleVictory} onDefeat={() => setPhase(GamePhase.LEARNING)} onBack={() => setShowExitConfirm(true)} potions={player.potions} onUsePotion={() => { if (player.potions > 0) handleUpdatePlayer({ ...player, potions: player.potions - 1 }); }} />}
            {phase === GamePhase.REWARD && <RewardScreen onNext={() => { setLevelData(null); setPhase(GamePhase.MAP); }} onChallenge={() => {}} playerLevel={player.level} earnedExp={levelData.isReplay ? 75 : 150} earnedGems={levelData.type === 'boss' ? 150 : 50} currentExp={player.exp} maxExp={getMaxExp(player.level)} showChallengeButton={false} />}
          </>
        )}
      </div>
    </div>
  );
};

export default App;