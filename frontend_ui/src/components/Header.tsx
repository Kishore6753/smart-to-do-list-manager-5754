import React from 'react';
import ThemeToggle from './ThemeToggle';

// PUBLIC_INTERFACE
export default function Header() {
  /** App header with title, theme toggle, and placeholder for settings/profile. */
  return (
    <header className="theme-transition sticky top-0 z-20 bg-white/70 dark:bg-neutral-900/70 backdrop-blur border-b border-gray-100 dark:border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-black">✓</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Smart To-Do</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
            aria-label="Settings"
            title="Settings (coming soon)"
          >
            ⚙️
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
            aria-label="Profile"
            title="Profile (coming soon)"
          >
            👤
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
