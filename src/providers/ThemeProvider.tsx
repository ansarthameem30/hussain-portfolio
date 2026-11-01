'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  themes,
  defaultTheme,
  themeToCSS,
  type ThemeId,
  type Theme,
} from '@/config/theme.config';

interface ThemeContextValue {
  themeId: ThemeId;
  theme: Theme;
  setTheme: (id: ThemeId) => void;
  toggleLightDark: () => void;
  availableThemes: Theme[];
  isThemeStudioOpen: boolean;
  openThemeStudio: () => void;
  closeThemeStudio: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(defaultTheme);
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false);

  const setTheme = (id: ThemeId) => {
    const validId = themes[id] ? id : defaultTheme;
    setThemeId(validId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-theme', validId);
      document.documentElement.setAttribute('data-theme', validId);
      const cssVars = themeToCSS(themes[validId]);
      document.documentElement.style.cssText = cssVars;
    }
  };

  const toggleLightDark = () => {
    if (themeId === 'light') {
      setTheme('deep-green');
    } else {
      setTheme('light');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') as ThemeId | null;
    const initial = saved && themes[saved] ? saved : defaultTheme;
    setTheme(initial);
  }, []);

  const availableThemes = Object.values(themes);

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme: themes[themeId] || themes[defaultTheme],
        setTheme,
        toggleLightDark,
        availableThemes,
        isThemeStudioOpen,
        openThemeStudio: () => setIsThemeStudioOpen(true),
        closeThemeStudio: () => setIsThemeStudioOpen(false),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
