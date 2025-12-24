
export enum GamePhase {
  AUTH = 'AUTH',
  PROLOGUE = 'PROLOGUE',
  WELCOME = 'WELCOME',
  MAP = 'MAP',
  SHOP = 'SHOP',
  VAULT = 'VAULT',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  STORY_INTRO = 'STORY_INTRO',
  LEARNING = 'LEARNING',
  BATTLE = 'BATTLE',
  REWARD = 'REWARD'
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
  etymology?: string;
}

export interface MapNode {
  id: string;
  name: string;
  location: string;
  type: 'story' | 'battle' | 'boss';
  description: string;
  script?: {
    en: string;
    zh: string;
  }[];
  wordCount?: number;
  medalsRequired?: number;
  isUnlocked?: boolean;
}

export interface LevelData {
  title: string;
  introStory: { en: string; zh: string }[];
  words: Word[];
  bossName: string;
  theme: string;
  type: 'story' | 'battle' | 'boss';
  isReplay: boolean;
}

export interface Medal {
  id: string;
  name: string;
  image: string;
  description: string;
  isUnlocked: boolean;
}

export interface Player {
  id: string;
  level: number;
  exp: number;
  gems: number;
  potions: number;
  medals: number;
  completedNodes: string[];
  ownedSkins: SkinId[];
  equippedSkin: SkinId;
}
