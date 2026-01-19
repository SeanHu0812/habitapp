import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { Farm } from './components/Farm';
import { Onboarding } from './components/Onboarding';
import { AnimalModal } from './components/AnimalModal';
import { AddHabitButton } from './components/AddHabitButton';
import { NewHabitFlow } from './components/NewHabitFlow';
import { Header } from './components/Header';

function App() {
  const { user, animals, initializeUser, updateAnimalStates } = useGameStore();
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [showNewHabitFlow, setShowNewHabitFlow] = useState(false);

  // Initialize user on first load
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  // Update animal states on load and periodically
  useEffect(() => {
    updateAnimalStates();
    const interval = setInterval(updateAnimalStates, 60000); // Every minute
    return () => clearInterval(interval);
  }, [updateAnimalStates]);

  // Show onboarding if user hasn't completed it
  if (!user?.hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="h-full flex flex-col bg-cream">
      <Header />

      <main className="flex-1 overflow-hidden relative">
        <Farm onAnimalClick={setSelectedAnimalId} />

        {/* Add habit button - always visible if there's room for more animals */}
        {animals.length < 6 && (
          <AddHabitButton onClick={() => setShowNewHabitFlow(true)} />
        )}
      </main>

      {/* Animal interaction modal */}
      <AnimatePresence>
        {selectedAnimalId && (
          <AnimalModal
            animalId={selectedAnimalId}
            onClose={() => setSelectedAnimalId(null)}
          />
        )}
      </AnimatePresence>

      {/* New habit creation flow */}
      <AnimatePresence>
        {showNewHabitFlow && (
          <NewHabitFlow onClose={() => setShowNewHabitFlow(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
