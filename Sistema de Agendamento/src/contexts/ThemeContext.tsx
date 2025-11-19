import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';
export type BackgroundType = 'solid' | 'gradient' | 'mesh';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ThemeSettings {
  mode: ThemeMode;
  backgroundType: BackgroundType;
  colors: ThemeColors;
  transparency: number;
}

interface ThemeContextType {
  theme: ThemeSettings;
  setThemeMode: (mode: ThemeMode) => void;
  setBackgroundType: (type: BackgroundType) => void;
  setColors: (colors: ThemeColors) => void;
  setTransparency: (value: number) => void;
  resetTheme: () => void;
}

const defaultTheme: ThemeSettings = {
  mode: 'light',
  backgroundType: 'solid',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
  },
  transparency: 0.95,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('theme-settings');
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem('theme-settings', JSON.stringify(theme));
    
    // Apply dark mode class
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setThemeMode = (mode: ThemeMode) => {
    setTheme((prev) => ({ ...prev, mode }));
  };

  const setBackgroundType = (backgroundType: BackgroundType) => {
    setTheme((prev) => ({ ...prev, backgroundType }));
  };

  const setColors = (colors: ThemeColors) => {
    setTheme((prev) => ({ ...prev, colors }));
  };

  const setTransparency = (transparency: number) => {
    setTheme((prev) => ({ ...prev, transparency }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setThemeMode,
        setBackgroundType,
        setColors,
        setTransparency,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
