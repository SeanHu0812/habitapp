import { useGameStore } from '../store/gameStore';
import { AnimalSprite } from './AnimalSprite';
import { motion } from 'framer-motion';

interface FarmProps {
  onAnimalClick: (animalId: string) => void;
}

// Positions for animals on the farm (up to 6)
const ANIMAL_POSITIONS = [
  { x: 25, y: 35 },
  { x: 65, y: 25 },
  { x: 45, y: 55 },
  { x: 15, y: 65 },
  { x: 75, y: 60 },
  { x: 50, y: 20 },
];

export function Farm({ onAnimalClick }: FarmProps) {
  const { animals } = useGameStore();

  return (
    <div className="h-full w-full farm-bg relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Trees */}
        <div className="absolute top-4 left-4 text-4xl opacity-80">🌳</div>
        <div className="absolute top-8 right-8 text-3xl opacity-80">🌲</div>
        <div className="absolute bottom-20 left-8 text-4xl opacity-80">🌸</div>
        <div className="absolute bottom-32 right-4 text-3xl opacity-80">🌷</div>

        {/* Flowers */}
        <div className="absolute top-1/4 left-1/4 text-2xl opacity-70">🌼</div>
        <div className="absolute top-1/3 right-1/3 text-xl opacity-70">🌻</div>
        <div className="absolute bottom-1/4 left-1/2 text-2xl opacity-70">🌺</div>

        {/* Fence elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-warmBrown/20 to-transparent" />
      </div>

      {/* Animals */}
      {animals.map((animal, index) => {
        const position = ANIMAL_POSITIONS[index % ANIMAL_POSITIONS.length];
        return (
          <motion.div
            key={animal.id}
            className="absolute"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
          >
            <AnimalSprite
              animal={animal}
              onClick={() => onAnimalClick(animal.id)}
            />
          </motion.div>
        );
      })}

      {/* Empty farm message */}
      {animals.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="cozy-card text-center max-w-xs mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-5xl block mb-4">🏕️</span>
            <p className="text-darkBrown font-medium mb-2">
              Your farm is waiting!
            </p>
            <p className="text-warmBrown text-sm">
              Tap the + button to add your first animal companion
            </p>
          </motion.div>
        </div>
      )}

      {/* Cozy house in the back */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-5xl opacity-90">
        🏠
      </div>
    </div>
  );
}
