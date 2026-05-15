import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-card hover:bg-border/50 text-foreground transition-all duration-300 flex items-center justify-center shadow-sm border border-border"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0, scale: theme === 'dark' ? 0.8 : 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
        className="absolute"
        style={{ opacity: theme === 'dark' ? 0 : 1 }}
      >
        <FiSun size={18} className="text-amber-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : -180, scale: theme === 'dark' ? 1 : 0.8 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
        style={{ opacity: theme === 'dark' ? 1 : 0 }}
      >
        <FiMoon size={18} className="text-indigo-400" />
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
