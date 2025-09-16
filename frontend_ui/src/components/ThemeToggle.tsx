import React from 'react';
import { useTheme } from '../theme/ThemeProvider';

// PUBLIC_INTERFACE
export default function ThemeToggle() {
  /** Toggle between light and dark modes and persist selection. */
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-gray-100"
      aria-label="Toggle theme"
      title="Toggle light/dark"
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
