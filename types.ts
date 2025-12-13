export enum GamePhase {
  PROLOGUE = 'PROLOGUE',
  WELCOME = 'WELCOME',
  SHOP = 'SHOP',
  STORY_INTRO = 'STORY_INTRO',
  LEARNING = 'LEARNING',
  BATTLE = 'BATTLE',
  REWARD = 'REWARD',
  CHEAT_STORY = 'CHEAT_STORY',
  CHEAT_SELECTION = 'CHEAT_SELECTION'
}

export type DifficultyLevel = 'Basic' | 'CET-4' | 'CET-6' | 'IELTS' | 'TOEFL';

export type SkinId = 'default' | 'ice' | 'fire' | 'gold' | 'ninja';

export interface Word {
  id: string;
  term: string;
  phonetic: string;
  definition: string;
  example: string;
  exampleTranslation: string; 
  translation: string; 
  difficulty: DifficultyLevel; 
  tags: string[]; 
  
}

export interface LevelData {
  title: string;
  introStory: string[]; 
  words: Word[];
  bossName: string;
  theme: string;
}

export interface PlayerStats {
  level: number;
  exp: number;
  maxExp: number;
  coins: number;
  avatarId: number;
}