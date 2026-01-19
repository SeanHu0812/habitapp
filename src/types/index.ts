// Animal state - no failure states, only positive/neutral
export type AnimalState = 'thriving' | 'neutral' | 'resting';

// Available animal types for the MVP
export type AnimalType = 'cat' | 'bunny' | 'bear' | 'fox' | 'duck' | 'hamster';

export interface Animal {
  id: string;
  type: AnimalType;
  name: string;
  habitId: string;
  state: AnimalState;
  level: number;
  experience: number; // XP toward next level
  lastCheckIn: string | null; // ISO date string
  checkInStreak: number; // Internal tracking, not shown to user
  createdAt: string;
}

export interface Habit {
  id: string;
  description: string;
  animalId: string;
  createdAt: string;
}

export interface User {
  id: string;
  coins: number;
  createdAt: string;
  hasCompletedOnboarding: boolean;
}

export interface FarmDecoration {
  id: string;
  type: string;
  position: { x: number; y: number };
}

export interface GameState {
  user: User | null;
  animals: Animal[];
  habits: Habit[];
  decorations: FarmDecoration[];
}

// Animal info for display
export interface AnimalInfo {
  type: AnimalType;
  displayName: string;
  emoji: string;
  description: string;
}

export const ANIMAL_INFO: Record<AnimalType, AnimalInfo> = {
  cat: {
    type: 'cat',
    displayName: 'Kitty',
    emoji: '🐱',
    description: 'A cozy companion who loves naps',
  },
  bunny: {
    type: 'bunny',
    displayName: 'Bunny',
    emoji: '🐰',
    description: 'A fluffy friend who hops with joy',
  },
  bear: {
    type: 'bear',
    displayName: 'Bear',
    emoji: '🐻',
    description: 'A gentle giant with a warm heart',
  },
  fox: {
    type: 'fox',
    displayName: 'Fox',
    emoji: '🦊',
    description: 'A clever friend who loves adventures',
  },
  duck: {
    type: 'duck',
    displayName: 'Duckling',
    emoji: '🦆',
    description: 'A cheerful companion who quacks happily',
  },
  hamster: {
    type: 'hamster',
    displayName: 'Hamster',
    emoji: '🐹',
    description: 'A tiny friend with big energy',
  },
};

// Level thresholds and rewards
export const LEVEL_THRESHOLDS = [0, 10, 25, 50, 100, 175, 275, 400, 550, 725];
export const COIN_REWARD_PER_CHECK_IN = 5;
export const XP_PER_CHECK_IN = 10;
export const BONUS_XP_FOR_STREAK = 5;
