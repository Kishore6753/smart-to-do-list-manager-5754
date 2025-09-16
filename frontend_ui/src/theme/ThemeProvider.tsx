import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';
type Ctx = { theme: Theme; toggleTheme: () => void; setTheme: (t: Theme) => void };

const ThemeContext = createContext<Ctx | null>(null);
const THEME_KEY = 'smarttodo_theme';

// PUBLIC_INTERFACE
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /** Provide theme state and toggle, synchronizing with <html> class and localStorage. */
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as Theme) || 'light';
    setTheme(saved);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(t);
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    // initialize html class on first mount as well
    const html = document.documentElement;
    if (!html.classList.contains(theme)) {
      html.classList.add(theme);
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// PUBLIC_INTERFACE
export function useTheme(): Ctx {
  /** Access current theme and controls. */
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
