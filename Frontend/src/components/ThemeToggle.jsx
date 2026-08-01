import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "", size = 20 }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center border ${
        isDark
          ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 hover:text-amber-300 hover:border-slate-600 shadow-sm"
          : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-sm"
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun size={size} className="transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon size={size} className="transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
