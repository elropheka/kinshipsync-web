export interface ColorPalette {
  // Core Interactive & Brand Colors
  primary: string;
  primaryContrastText: string;
  secondary: string;
  secondaryContrastText: string;
  accent: string;
  accentContrastText: string;

  // Backgrounds & Surfaces
  background: string;
  surface: string; // For cards, modals, sidebars, etc.

  // Text & Borders
  textOnBackground: string; // Primary text on main background
  textOnSurface: string;    // Primary text on surface backgrounds
  textSecondary: string;    // For less important text, subheadings
  border: string;           // For borders and dividers

  // Semantic/Status Colors
  success: string;
  successContrastText: string;
  error: string;
  errorContrastText: string;
  warning: string;
  warningContrastText: string;
  info: string;
  infoContrastText: string;

  // States
  disabledBackground: string; // Background for disabled interactive elements
  disabledText: string;       // Text color for disabled interactive elements
}

// Import color constants from the colors utility
import { teal, baseNude, lightNude, brown } from '../lib/colors';

export const standardLightPalette: ColorPalette = {
  primary: teal,
  primaryContrastText: '#FFFFFF',
  secondary: brown,
  secondaryContrastText: '#FFFFFF',
  accent: brown,
  accentContrastText: '#FFFFFF',
  background: baseNude,
  surface: lightNude,
  textOnBackground: '#11181C',
  textOnSurface: '#11181C',
  textSecondary: '#687076',
  border: '#D1D5DB',
  success: '#4CAF50',
  successContrastText: '#FFFFFF',
  error: '#F44336',
  errorContrastText: '#FFFFFF',
  warning: '#FFC107',
  warningContrastText: '#11181C',
  info: '#2196F3',
  infoContrastText: '#FFFFFF',
  disabledBackground: '#E5E7EB',
  disabledText: '#9CA3AF',
};

export const standardDarkPalette: ColorPalette = {
  primary: '#0EA175',
  primaryContrastText: '#FFFFFF',
  secondary: '#A47551',
  secondaryContrastText: '#121212',
  accent: '#A47551',
  accentContrastText: '#FFFFFF',
  background: '#121212',
  surface: '#1E1E1E',
  textOnBackground: '#ECEDEE',
  textOnSurface: '#ECEDEE',
  textSecondary: '#9BA1A6',
  border: '#424242',
  success: '#66BB6A',
  successContrastText: '#121212',
  error: '#EF5350',
  errorContrastText: '#121212',
  warning: '#FFEE58',
  warningContrastText: '#121212',
  info: '#42A5F5',
  infoContrastText: '#121212',
  disabledBackground: '#2E2E2E',
  disabledText: '#6B7280',
};
