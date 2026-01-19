import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { AnimalType, ANIMAL_INFO } from '../types';

interface NewHabitFlowProps {
  onClose: () => void;
}

type FlowStep = 'select-animal' | 'name-animal' | 'create-habit';

export function NewHabitFlow({ onClose }: NewHabitFlowProps) {
  const [step, setStep] = useState<FlowStep>('select-animal');
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType | null>(null);
  const [animalName, setAnimalName] = useState('');
  const [habitText, setHabitText] = useState('');

  const { createAnimalWithHabit } = useGameStore();

  const animalTypes = Object.values(ANIMAL_INFO);

  const handleComplete = () => {
    if (selectedAnimal && animalName && habitText) {
      createAnimalWithHabit(selectedAnimal, animalName.trim(), habitText.trim());
      onClose();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'select-animal':
        return selectedAnimal !== null;
      case 'name-animal':
        return animalName.trim().length > 0;
      case 'create-habit':
        return habitText.trim().length > 0;
      default:
        return false;
    }
  };

  const nextStep = () => {
    switch (step) {
      case 'select-animal':
        setStep('name-animal');
        break;
      case 'name-animal':
        setStep('create-habit');
        break;
      case 'create-habit':
        handleComplete();
        break;
    }
  };

  const prevStep = () => {
    switch (step) {
      case 'name-animal':
        setStep('select-animal');
        break;
      case 'create-habit':
        setStep('name-animal');
        break;
      default:
        onClose();
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
        className="cozy-card w-full max-w-md mx-4 max-h-[85vh] overflow-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevStep}
            className="text-warmBrown hover:text-darkBrown p-2"
          >
            {step === 'select-animal' ? '✕' : '←'}
          </button>
          <h2 className="font-cozy font-bold text-lg text-darkBrown">
            New Habit
          </h2>
          <div className="w-8" /> {/* Spacer */}
        </div>

        <AnimatePresence mode="wait">
          {step === 'select-animal' && (
            <motion.div
              key="select-animal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-warmBrown text-center text-sm mb-4">
                Choose an animal for your new habit
              </p>

              <div className="grid grid-cols-3 gap-3">
                {animalTypes.map((animal) => (
                  <motion.button
                    key={animal.type}
                    onClick={() => setSelectedAnimal(animal.type)}
                    className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                      selectedAnimal === animal.type
                        ? 'bg-softPink/50 ring-2 ring-softPink'
                        : 'bg-softPeach/30 hover:bg-softPeach/50'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-3xl mb-1">{animal.emoji}</span>
                    <span className="text-xs font-medium text-darkBrown">
                      {animal.displayName}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'name-animal' && selectedAnimal && (
            <motion.div
              key="name-animal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-5xl mb-4"
              >
                {ANIMAL_INFO[selectedAnimal].emoji}
              </motion.div>

              <p className="text-warmBrown text-sm mb-4">
                Give your companion a name
              </p>

              <input
                type="text"
                value={animalName}
                onChange={(e) => setAnimalName(e.target.value)}
                placeholder="Enter a name..."
                className="cozy-input text-center"
                maxLength={15}
                autoFocus
              />
            </motion.div>
          )}

          {step === 'create-habit' && selectedAnimal && (
            <motion.div
              key="create-habit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="flex justify-center items-center gap-2 mb-4">
                <span className="text-4xl">{ANIMAL_INFO[selectedAnimal].emoji}</span>
                <span className="text-2xl">💭</span>
              </div>

              <p className="text-warmBrown text-sm mb-4">
                What habit will <span className="font-semibold">{animalName}</span> help you with?
              </p>

              <input
                type="text"
                value={habitText}
                onChange={(e) => setHabitText(e.target.value)}
                placeholder="e.g., Drink water"
                className="cozy-input text-center"
                maxLength={50}
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action button */}
        <motion.button
          onClick={nextStep}
          disabled={!canProceed()}
          className={`cozy-btn w-full mt-6 ${
            canProceed() ? 'cozy-btn-primary' : 'bg-gray-200 text-gray-400'
          }`}
          whileTap={canProceed() ? { scale: 0.98 } : {}}
        >
          {step === 'create-habit' ? 'Create Habit' : 'Continue'}
        </motion.button>

        {/* Progress */}
        <div className="flex justify-center gap-2 mt-4">
          {(['select-animal', 'name-animal', 'create-habit'] as const).map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all ${
                step === s ? 'bg-softPink w-4' : 'bg-softPeach'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
