import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback implementation when context is not available
    const [theme, setTheme] = useState<Theme>(() => {
      const stored = localStorage.getItem('ghostguard-theme') as Theme;
      return stored || 'system';
    });

    useEffect(() => {
      localStorage.setItem('ghostguard-theme', theme);
      
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    }, [theme]);

    return { theme, setTheme };
  }
  
  return context;
};