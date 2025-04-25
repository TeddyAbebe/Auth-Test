import { create } from "zustand";
import { User } from "./types";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: localStorage.getItem("theme") === "dark" || false,
  toggleTheme: () => {
    set((state) => {
      const newTheme = !state.isDark;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return { isDark: newTheme };
    });
  },
}));
