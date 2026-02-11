import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import { THEMES } from './theme.config.js';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  const { theme, setTheme } = context;

  function toggleTheme() {
    setTheme((prev) => (prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
  }

  return { theme, setTheme, toggleTheme, isDark: theme === THEMES.DARK };
}
