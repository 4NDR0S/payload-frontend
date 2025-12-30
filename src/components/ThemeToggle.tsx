"use client";

import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center p-1 cursor-pointer transition-colors"
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
          theme === "dark" ? "translate-x-7" : "translate-x-0"
        }`}
      ></div>
    </button>
  );
}
