import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { AnimalType, ANIMAL_INFO } from '../types';

type OnboardingStep = 'welcome' | 'select-animal' | 'name-animal' | 'create-habit';

export function Onboarding() {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType | null>(null);
  const [animalName, setAnimalName] = useState('');
  const [habitText, setHabitText] = useState('');

  const { createAnimalWithHabit, completeOnboarding } = useGameStore();

  const animalTypes = Object.values(ANIMAL_INFO);

  const handleComplete = () => {
    if (selectedAnimal && animalName && habitText) {
      createAnimalWithHabit(selectedAnimal, animalName.trim(), habitText.trim());
      completeOnboarding();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'welcome':
        return true;
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
      case 'welcome':
        setStep('select-animal');
        break;
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

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-softBlue to-cream">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-7xl mb-6"
            >
              🏡
            </motion.div>
            <h1 className="font-cozy font-bold text-3xl text-darkBrown mb-4 text-center">
              Welcome to
              <br />
              Cozy Habit Farm
            </h1>
            <p className="text-warmBrown text-center max-w-xs mb-8">
              Build healthy habits by caring for adorable animal companions.
              No pressure, just warmth!
            </p>
            <div className="flex gap-3 text-4xl">
              <motion.span
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                🐱
              </motion.span>
              <motion.span
                animate={{ rotate: [5, -5, 5] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
              >
                🐰
              </motion.span>
              <motion.span
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
              >
                🦊
              </motion.span>
            </div>
          </motion.div>
        )}

        {step === 'select-animal' && (
          <motion.div
            key="select-animal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col p-6"
          >
            <h2 className="font-cozy font-bold text-2xl text-darkBrown mb-2 text-center">
              Choose Your Companion
            </h2>
            <p className="text-warmBrown text-center text-sm mb-6">
              Pick an animal friend to help with your first habit
            </p>

            <div className="grid grid-cols-3 gap-4 flex-1 content-start">
              {animalTypes.map((animal) => (
                <motion.button
                  key={animal.type}
                  onClick={() => setSelectedAnimal(animal.type)}
                  className={`cozy-card flex flex-col items-center p-4 transition-all ${
                    selectedAnimal === animal.type
                      ? 'ring-4 ring-softPink bg-softPink/30'
                      : ''
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-4xl mb-2">{animal.emoji}</span>
                  <span className="text-sm font-medium text-darkBrown">
                    {animal.displayName}
                  </span>
                </motion.button>
              ))}
            </div>

            {selectedAnimal && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-warmBrown text-sm mt-4 italic"
              >
                "{ANIMAL_INFO[selectedAnimal].description}"
              </motion.p>
            )}
          </motion.div>
        )}

        {step === 'name-animal' && selectedAnimal && (
          <motion.div
            key="name-animal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl mb-6"
            >
              {ANIMAL_INFO[selectedAnimal].emoji}
            </motion.div>

            <h2 className="font-cozy font-bold text-2xl text-darkBrown mb-2 text-center">
              Name Your Friend
            </h2>
            <p className="text-warmBrown text-center text-sm mb-6">
              Give your new companion a special name
            </p>

            <input
              type="text"
              value={animalName}
              onChange={(e) => setAnimalName(e.target.value)}
              placeholder="Enter a name..."
              className="cozy-input max-w-xs text-center text-lg"
              maxLength={15}
              autoFocus
            />
          </motion.div>
        )}

        {step === 'create-habit' && selectedAnimal && (
          <motion.div
            key="create-habit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-5xl"
              >
                {ANIMAL_INFO[selectedAnimal].emoji}
              </motion.div>
              <span className="text-3xl">💭</span>
            </div>

            <h2 className="font-cozy font-bold text-2xl text-darkBrown mb-2 text-center">
              Create Your Habit
            </h2>
            <p className="text-warmBrown text-center text-sm mb-6">
              What habit will <span className="font-semibold">{animalName}</span> help you build?
            </p>

            <input
              type="text"
              value={habitText}
              onChange={(e) => setHabitText(e.target.value)}
              placeholder="e.g., Read for 10 minutes"
              className="cozy-input max-w-sm text-center"
              maxLength={50}
              autoFocus
            />

            <p className="text-warmBrown/70 text-xs mt-4 text-center max-w-xs">
              Don't worry about being perfect. You can always change this later!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="p-6 safe-area-bottom">
        <motion.button
          onClick={nextStep}
          disabled={!canProceed()}
          className={`cozy-btn w-full text-lg ${
            canProceed() ? 'cozy-btn-primary' : 'bg-gray-200 text-gray-400'
          }`}
          whileTap={canProceed() ? { scale: 0.98 } : {}}
        >
          {step === 'create-habit' ? "Let's Start!" : 'Continue'}
        </motion.button>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-4">
          {(['welcome', 'select-animal', 'name-animal', 'create-habit'] as const).map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all ${
                step === s ? 'bg-softPink w-6' : 'bg-softPeach'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
