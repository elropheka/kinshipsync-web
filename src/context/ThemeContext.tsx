import React, { useState, useEffect } from 'react'; // Removed createContext
import type { ReactNode } from 'react';
// Removed Theme import, as it's used in themeContextDefinition.ts
import { lightTheme, darkTheme } from '../theme/themeConfigurations'; // Import themes
import { ThemeContext } from './themeContextDefinition'; // Import context

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const storedPreference = localStorage.getItem('themeMode');
    return (storedPreference as 'light' | 'dark') || 'light'; // Default to light if no preference
  });

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    // You might want to apply a class to the body for global CSS overrides
    document.documentElement.setAttribute('data-theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// The useTheme hook has been moved to src/hooks/useAppTheme.ts
// Remove the old useTheme export from this file
