import { createContext, useState, useEffect } from 'react';
import { THEME_STORAGE_KEY, DEFAULT_THEME, THEMES } from './theme.config.js';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME;
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === THEMES.LIGHT || stored === THEMES.DARK ? stored : DEFAULT_THEME;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(THEMES.LIGHT, THEMES.DARK);
    root.classList.add(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (value) => {
    if (typeof value === 'function') {
      setThemeState(value);
    } else if (value === THEMES.LIGHT || value === THEMES.DARK) {
      setThemeState(value);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
