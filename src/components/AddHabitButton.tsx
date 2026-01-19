import { motion } from 'framer-motion';

interface AddHabitButtonProps {
  onClick: () => void;
}

export function AddHabitButton({ onClick }: AddHabitButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-softPink shadow-lg flex items-center justify-center text-2xl text-darkBrown"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        boxShadow: '0 4px 15px rgba(255, 214, 224, 0.5)',
      }}
    >
      <motion.span
        animate={{ rotate: [0, 90, 0] }}
        transition={{ duration: 0.3 }}
      >
        +
      </motion.span>
    </motion.button>
  );
}
