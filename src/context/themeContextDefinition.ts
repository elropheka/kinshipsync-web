import { createContext } from 'react';
import type { Theme } from '../types/themeTypes';

export interface ThemeContextType {
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  currentTheme: Theme;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
