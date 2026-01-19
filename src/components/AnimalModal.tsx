import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ANIMAL_INFO, LEVEL_THRESHOLDS } from '../types';

interface AnimalModalProps {
  animalId: string;
  onClose: () => void;
}

interface CheckInReward {
  coinsEarned: number;
  xpEarned: number;
  leveledUp: boolean;
}

export function AnimalModal({ animalId, onClose }: AnimalModalProps) {
  const { getAnimalById, getHabitByAnimalId, checkInHabit, canCheckIn } = useGameStore();
  const [showReward, setShowReward] = useState(false);
  const [reward, setReward] = useState<CheckInReward | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const animal = getAnimalById(animalId);
  const habit = getHabitByAnimalId(animalId);
  const canCheckInNow = animal ? canCheckIn(animal.id) : false;

  useEffect(() => {
    // Check if already checked in today
    if (animal && !canCheckInNow) {
      setIsCheckedIn(true);
    }
  }, [animal, canCheckInNow]);

  if (!animal || !habit) {
    return null;
  }

  const animalInfo = ANIMAL_INFO[animal.type];

  // Calculate XP progress
  const currentLevelXP = LEVEL_THRESHOLDS[animal.level - 1] || 0;
  const nextLevelXP = LEVEL_THRESHOLDS[animal.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpProgress = ((animal.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  const xpToNext = nextLevelXP - animal.experience;

  const handleCheckIn = () => {
    if (!canCheckInNow) return;

    const result = checkInHabit(animal.id);
    setReward(result);
    setShowReward(true);
    setIsCheckedIn(true);

    // Auto-close reward after showing
    setTimeout(() => {
      setShowReward(false);
    }, 2000);
  };

  const getStateMessage = () => {
    switch (animal.state) {
      case 'thriving':
        return `${animal.name} is so happy! Keep it up!`;
      case 'neutral':
        return `${animal.name} is doing well.`;
      case 'resting':
        return `${animal.name} missed you! Welcome back!`;
      default:
        return '';
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="cozy-card w-full max-w-sm mx-4 relative overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-warmBrown hover:text-darkBrown text-xl"
        >
          ✕
        </button>

        {/* Animal display */}
        <div className="text-center pt-2 pb-4">
          <motion.div
            className={`text-7xl inline-block ${
              animal.state === 'thriving'
                ? 'state-thriving'
                : animal.state === 'resting'
                ? 'state-resting'
                : 'state-neutral'
            }`}
            style={{
              filter:
                animal.state === 'thriving'
                  ? 'brightness(1.1) saturate(1.2)'
                  : animal.state === 'resting'
                  ? 'brightness(0.9) saturate(0.8)'
                  : undefined,
            }}
          >
            {animalInfo.emoji}
          </motion.div>

          {/* State indicators */}
          {animal.state === 'thriving' && (
            <motion.span
              className="absolute top-8 right-1/4 text-2xl"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ✨
            </motion.span>
          )}
          {animal.state === 'resting' && (
            <motion.span
              className="absolute top-8 right-1/4 text-xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              💤
            </motion.span>
          )}
        </div>

        {/* Animal info */}
        <div className="text-center mb-4">
          <h3 className="font-cozy font-bold text-xl text-darkBrown mb-1">
            {animal.name}
          </h3>
          <p className="text-warmBrown text-sm">{getStateMessage()}</p>
        </div>

        {/* Level and XP */}
        <div className="bg-softYellow/20 rounded-2xl p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-darkBrown">
              Level {animal.level}
            </span>
            <span className="text-xs text-warmBrown">
              {xpToNext} XP to next level
            </span>
          </div>
          <div className="xp-bar h-3">
            <motion.div
              className="xp-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(xpProgress, 100)}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Habit display */}
        <div className="bg-softPeach/30 rounded-2xl p-4 mb-4">
          <p className="text-xs text-warmBrown mb-1 uppercase tracking-wide">
            Daily Habit
          </p>
          <p className="font-medium text-darkBrown">{habit.description}</p>
        </div>

        {/* Check-in button - ONE TAP! */}
        <motion.button
          onClick={handleCheckIn}
          disabled={!canCheckInNow}
          className={`cozy-btn w-full text-lg ${
            canCheckInNow
              ? 'cozy-btn-primary'
              : isCheckedIn
              ? 'bg-softMint text-darkBrown'
              : 'bg-gray-200 text-gray-400'
          }`}
          whileTap={canCheckInNow ? { scale: 0.98 } : {}}
        >
          {isCheckedIn ? (
            <span className="flex items-center justify-center gap-2">
              <span>✓</span> Done for today!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>🎯</span> Complete Habit
            </span>
          )}
        </motion.button>

        {/* Reward animation overlay */}
        <AnimatePresence>
          {showReward && reward && (
            <motion.div
              className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center rounded-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                {reward.leveledUp ? '🎉' : '💖'}
              </motion.div>

              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-cozy font-bold text-xl text-darkBrown mb-2"
              >
                {reward.leveledUp ? 'Level Up!' : 'Well Done!'}
              </motion.h3>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4"
              >
                <div className="flex items-center gap-1 text-warmBrown">
                  <span>🪙</span>
                  <span className="font-semibold">+{reward.coinsEarned}</span>
                </div>
                <div className="flex items-center gap-1 text-warmBrown">
                  <span>⭐</span>
                  <span className="font-semibold">+{reward.xpEarned} XP</span>
                </div>
              </motion.div>

              {/* Floating hearts */}
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl"
                  initial={{
                    x: (Math.random() - 0.5) * 100,
                    y: 50,
                    opacity: 1,
                  }}
                  animate={{
                    y: -100,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: 'easeOut',
                  }}
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                  }}
                >
                  💕
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
