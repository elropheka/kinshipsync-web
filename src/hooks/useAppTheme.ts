import { useContext } from 'react';
import { ThemeContext, type ThemeContextType } from '../context/themeContextDefinition'; // Updated path

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
