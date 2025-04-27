import { useAuthStore } from "../lib/store";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";

export default function Navbar() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm sm:text-3xl font-bold text-white"
        >
          Employee Activity Dashboard
        </motion.h1>

        <div className="hidden md:flex items-center space-x-4">
          {user && (
            <>
              <span className="text-sm text-white">Welcome, {user.email}</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="py-2 px-4 bg-[var(--error)] text-white hover:bg-[var(--error)]/90 rounded-md shadow-sm transition-colors cursor-pointer"
              >
                Logout
              </motion.button>
            </>
          )}
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white">
            {isMenuOpen ? (
              <IoCloseOutline size={24} />
            ) : (
              <CiMenuBurger size={24} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-800 glass mt-4 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="flex flex-col items-center space-y-4 py-4">
              {user && (
                <>
                  <span className="text-sm text-white">
                    Welcome, {user.email}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="py-2 px-4 bg-[var(--error)] text-white hover:bg-[var(--error)]/90 rounded-md shadow-sm transition-colors"
                  >
                    Logout
                  </motion.button>
                </>
              )}

              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
