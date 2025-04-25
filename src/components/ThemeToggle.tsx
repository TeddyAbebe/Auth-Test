import { useEffect } from "react";
import { motion } from "framer-motion";
import { useThemeStore } from "../lib/store";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative cursor-pointer w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full p-1 flex items-center border border-gray-400 dark:border-gray-500"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className="w-5 h-5 bg-[var(--primary)] dark:bg-[var(--primary-dark)] rounded-full shadow-md"
      />
      <span className="absolute left-2 text-xs text-gray-600 dark:text-gray-300">
        {isDark ? "🌙" : "☀️"}
      </span>
    </motion.button>
  );
}
