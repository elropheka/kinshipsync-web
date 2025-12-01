import type { Theme, ThemeColors, ThemeFonts } from '../types/themeTypes';
import { AppColors } from './appTheme';

// Define default light and dark theme configurations
const defaultLightColors: ThemeColors = AppColors.light;
const defaultDarkColors: ThemeColors = AppColors.dark;

const defaultFonts: ThemeFonts = {
  heading: { fontFamily: 'Poppins, sans-serif', fontWeight: 'bold' },
  body: { fontFamily: 'Poppins, sans-serif', fontWeight: 'normal' },
};

export const lightTheme: Theme = {
  id: 'light',
  name: 'Light Mode',
  isPredefined: true,
  colors: defaultLightColors,
  fonts: defaultFonts,
};

export const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark Mode',
  isPredefined: true,
  colors: defaultDarkColors,
  fonts: defaultFonts, // Can be customized further if needed
};
