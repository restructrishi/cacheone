import { useTheme } from '@/theme/useTheme';
import { Sun, Moon } from 'lucide-react';
import { THEMES } from '@/theme/theme.config.js';

export function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === THEMES.DARK ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`rounded-lg p-2 text-secondary transition-theme hover:bg-elevated hover:text-primary focus:outline-none focus:ring-2 focus:ring-border-subtle ${className}`}
    >
      {theme === THEMES.DARK ? (
        <Sun className="h-5 w-5" aria-hidden />
      ) : (
        <Moon className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
