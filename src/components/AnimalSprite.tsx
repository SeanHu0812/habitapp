import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal, ANIMAL_INFO, LEVEL_THRESHOLDS } from '../types';
import { useGameStore } from '../store/gameStore';

interface AnimalSpriteProps {
  animal: Animal;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
}

// Get visual size based on animal level
const getLevelSize = (level: number, baseSize: number): number => {
  // Animals grow slightly with level (max 30% larger at level 10)
  const growthFactor = 1 + (Math.min(level, 10) - 1) * 0.033;
  return baseSize * growthFactor;
};

// Get state-based CSS class
const getStateClass = (state: Animal['state']): string => {
  switch (state) {
    case 'thriving':
      return 'state-thriving';
    case 'neutral':
      return 'state-neutral';
    case 'resting':
      return 'state-resting';
    default:
      return '';
  }
};

// Get state-based filter/brightness
const getStateStyle = (state: Animal['state']): React.CSSProperties => {
  switch (state) {
    case 'thriving':
      return { filter: 'brightness(1.1) saturate(1.2)' };
    case 'neutral':
      return { filter: 'brightness(1)' };
    case 'resting':
      return { filter: 'brightness(0.9) saturate(0.8)' };
    default:
      return {};
  }
};

export function AnimalSprite({ animal, onClick, size = 'medium' }: AnimalSpriteProps) {
  const [showHearts, setShowHearts] = useState(false);
  const { canCheckIn } = useGameStore();
  const animalInfo = ANIMAL_INFO[animal.type];
  const canCheckInNow = canCheckIn(animal.id);

  // Size mapping
  const baseSizes = { small: 48, medium: 72, large: 96 };
  const baseSize = baseSizes[size];
  const displaySize = getLevelSize(animal.level, baseSize);

  // Calculate XP progress
  const currentLevelXP = LEVEL_THRESHOLDS[animal.level - 1] || 0;
  const nextLevelXP = LEVEL_THRESHOLDS[animal.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpProgress = ((animal.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const handleClick = useCallback(() => {
    if (canCheckInNow) {
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 800);
    }
    onClick();
  }, [canCheckInNow, onClick]);

  return (
    <div
      className="animal-container"
      onClick={handleClick}
      style={{ width: displaySize, height: displaySize }}
    >
      {/* Level badge */}
      <div className="level-badge" style={{ fontSize: animal.level >= 10 ? '0.6rem' : '0.7rem' }}>
        {animal.level}
      </div>

      {/* Check-in indicator */}
      {canCheckInNow && (
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span className="text-lg">💭</span>
        </motion.div>
      )}

      {/* Animal emoji with state animation */}
      <motion.div
        className={`flex items-center justify-center ${getStateClass(animal.state)}`}
        style={{
          width: displaySize,
          height: displaySize,
          fontSize: displaySize * 0.7,
          ...getStateStyle(animal.state),
        }}
        whileTap={{ scale: 0.9 }}
      >
        {animalInfo.emoji}
      </motion.div>

      {/* Animal name */}
      <div
        className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <span className="text-xs font-semibold text-darkBrown bg-white/70 px-2 py-0.5 rounded-full">
          {animal.name}
        </span>
      </div>

      {/* XP progress bar (only show when size is large or medium) */}
      {size !== 'small' && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16">
          <div className="xp-bar">
            <div
              className="xp-bar-fill"
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Heart animation on check-in available */}
      <AnimatePresence>
        {showHearts && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.span
                key={i}
                className="heart-burst"
                style={{
                  left: `${30 + i * 20}%`,
                  top: '20%',
                }}
                initial={{ scale: 0, y: 0 }}
                animate={{ scale: 1, y: -30 - i * 10 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                💕
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* State indicator */}
      {animal.state === 'thriving' && (
        <motion.div
          className="absolute -top-1 -right-1 text-sm"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          ✨
        </motion.div>
      )}
      {animal.state === 'resting' && (
        <motion.div
          className="absolute top-0 right-0 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          💤
        </motion.div>
      )}
    </div>
  );
}
