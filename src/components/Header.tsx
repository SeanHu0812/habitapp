import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';

export function Header() {
  const { user } = useGameStore();

  return (
    <header className="safe-area-top px-4 pb-3 bg-cream/80 backdrop-blur-sm border-b border-softPeach/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏡</span>
          <h1 className="font-cozy font-bold text-lg text-darkBrown">
            My Farm
          </h1>
        </div>

        <motion.div
          className="coin-display"
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg">🪙</span>
          <span>{user?.coins || 0}</span>
        </motion.div>
      </div>
    </header>
  );
}
