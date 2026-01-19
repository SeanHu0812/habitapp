import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Animal,
  AnimalState,
  AnimalType,
  Habit,
  User,
  FarmDecoration,
  COIN_REWARD_PER_CHECK_IN,
  XP_PER_CHECK_IN,
  BONUS_XP_FOR_STREAK,
  LEVEL_THRESHOLDS,
} from '../types';

interface GameStore {
  // State
  user: User | null;
  animals: Animal[];
  habits: Habit[];
  decorations: FarmDecoration[];

  // Actions
  initializeUser: () => void;
  completeOnboarding: () => void;
  createAnimalWithHabit: (animalType: AnimalType, animalName: string, habitDescription: string) => void;
  checkInHabit: (animalId: string) => { coinsEarned: number; xpEarned: number; leveledUp: boolean };
  updateAnimalStates: () => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  canCheckIn: (animalId: string) => boolean;
  getAnimalById: (id: string) => Animal | undefined;
  getHabitByAnimalId: (animalId: string) => Habit | undefined;
}

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper to get today's date string
const getTodayString = () => new Date().toISOString().split('T')[0];

// Helper to check if a date is today
const isToday = (dateString: string | null): boolean => {
  if (!dateString) return false;
  return dateString.split('T')[0] === getTodayString();
};

// Helper to calculate days since last check-in
const daysSinceCheckIn = (lastCheckIn: string | null): number => {
  if (!lastCheckIn) return Infinity;
  const last = new Date(lastCheckIn.split('T')[0]);
  const today = new Date(getTodayString());
  const diffTime = today.getTime() - last.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// Helper to determine animal state based on check-in history
const calculateAnimalState = (animal: Animal): AnimalState => {
  const daysMissed = daysSinceCheckIn(animal.lastCheckIn);

  if (daysMissed === 0 || daysMissed === 1) {
    // Checked in today or yesterday
    if (animal.checkInStreak >= 3) {
      return 'thriving';
    }
    return 'neutral';
  } else if (daysMissed <= 3) {
    return 'neutral';
  } else {
    // More than 3 days - animal is resting but NOT punished
    return 'resting';
  }
};

// Helper to calculate level from experience
const calculateLevel = (experience: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (experience >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      user: null,
      animals: [],
      habits: [],
      decorations: [],

      initializeUser: () => {
        const existingUser = get().user;
        if (!existingUser) {
          set({
            user: {
              id: generateId(),
              coins: 0,
              createdAt: new Date().toISOString(),
              hasCompletedOnboarding: false,
            },
          });
        }
      },

      completeOnboarding: () => {
        set((state) => ({
          user: state.user
            ? { ...state.user, hasCompletedOnboarding: true }
            : null,
        }));
      },

      createAnimalWithHabit: (animalType, animalName, habitDescription) => {
        const animalId = generateId();
        const habitId = generateId();
        const now = new Date().toISOString();

        const newAnimal: Animal = {
          id: animalId,
          type: animalType,
          name: animalName,
          habitId,
          state: 'neutral',
          level: 1,
          experience: 0,
          lastCheckIn: null,
          checkInStreak: 0,
          createdAt: now,
        };

        const newHabit: Habit = {
          id: habitId,
          description: habitDescription,
          animalId,
          createdAt: now,
        };

        set((state) => ({
          animals: [...state.animals, newAnimal],
          habits: [...state.habits, newHabit],
        }));
      },

      checkInHabit: (animalId) => {
        const animal = get().animals.find((a) => a.id === animalId);
        if (!animal || !get().canCheckIn(animalId)) {
          return { coinsEarned: 0, xpEarned: 0, leveledUp: false };
        }

        const daysMissed = daysSinceCheckIn(animal.lastCheckIn);
        const wasConsecutive = daysMissed <= 1;
        const newStreak = wasConsecutive ? animal.checkInStreak + 1 : 1;

        // Calculate rewards
        const coinsEarned = COIN_REWARD_PER_CHECK_IN;
        let xpEarned = XP_PER_CHECK_IN;

        // Bonus XP for maintaining streak
        if (newStreak >= 3) {
          xpEarned += BONUS_XP_FOR_STREAK;
        }

        const newExperience = animal.experience + xpEarned;
        const oldLevel = animal.level;
        const newLevel = calculateLevel(newExperience);
        const leveledUp = newLevel > oldLevel;

        set((state) => ({
          animals: state.animals.map((a) =>
            a.id === animalId
              ? {
                  ...a,
                  lastCheckIn: new Date().toISOString(),
                  checkInStreak: newStreak,
                  experience: newExperience,
                  level: newLevel,
                  state: newStreak >= 3 ? 'thriving' : 'neutral',
                }
              : a
          ),
          user: state.user
            ? { ...state.user, coins: state.user.coins + coinsEarned }
            : null,
        }));

        return { coinsEarned, xpEarned, leveledUp };
      },

      updateAnimalStates: () => {
        set((state) => ({
          animals: state.animals.map((animal) => ({
            ...animal,
            state: calculateAnimalState(animal),
          })),
        }));
      },

      addCoins: (amount) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, coins: state.user.coins + amount }
            : null,
        }));
      },

      spendCoins: (amount) => {
        const user = get().user;
        if (!user || user.coins < amount) {
          return false;
        }
        set((state) => ({
          user: state.user
            ? { ...state.user, coins: state.user.coins - amount }
            : null,
        }));
        return true;
      },

      canCheckIn: (animalId) => {
        const animal = get().animals.find((a) => a.id === animalId);
        if (!animal) return false;
        return !isToday(animal.lastCheckIn);
      },

      getAnimalById: (id) => {
        return get().animals.find((a) => a.id === id);
      },

      getHabitByAnimalId: (animalId) => {
        return get().habits.find((h) => h.animalId === animalId);
      },
    }),
    {
      name: 'cozy-habit-farm-storage',
    }
  )
);
