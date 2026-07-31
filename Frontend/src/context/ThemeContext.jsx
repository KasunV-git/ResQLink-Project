<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const THEME_STORAGE_KEY = "resqlink_theme";

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Listen to system color scheme changes if user hasn't explicitly overridden preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (!saved) {
        setThemeState(e.matches ? "dark" : "light");
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newTheme) => {
    if (newTheme === "dark" || newTheme === "light") {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
=======
// frontend/src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem('resqlink-theme');
        return stored === 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('resqlink-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
    return ctx;
};
>>>>>>> kasuni-development
