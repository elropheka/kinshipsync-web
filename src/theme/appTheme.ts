// Define the structure for the light color palette
export interface AppThemeLightPalette {
  text: string;
  textSecondary: string;
  textLight: string;
  textDarkContrast: string;

  background: string;
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundLight: string;
  backgroundPaper: string;
  neutralBg: string;
  buttonPrimary: string;

  primary: string;
  primaryContrastText: string;
  accent: string;
  accentContrastText: string;
  accentHighlight: string;

  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  border: string;
  divider: string;

  success: string;
  successContrastText: string;
  error: string;
  danger: string;
  errorContrastText: string;
  warning: string;
  warningContrastText: string;
  info: string;
  infoContrastText: string;

  primaryLight: string;
  successLight: string;
  warningLight: string;
  infoLight: string;
  errorLight: string;
  dangerLight: string;
  secondary: string;
  secondaryLight: string;
  tertiary: string;
  tertiaryLight: string;
  grey: string;
  textMuted: string; // Added for consistency with dark theme
}

// Define the structure for the dark color palette
export interface AppThemeDarkPalette {
  text: string;
  textSecondary: string;
  textLight: string;
  textDarkContrast: string;

  background: string;
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundLight: string;
  backgroundPaper: string;
  neutralBg: string;
  buttonPrimary: string;

  primary: string;
  primaryContrastText: string;
  accent: string;
  accentContrastText: string;
  accentHighlight: string;

  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  border: string;
  divider: string;

  success: string;
  successContrastText: string;
  error: string;
  danger: string;
  errorContrastText: string;
  warning: string;
  warningContrastText: string;
  info: string;
  infoContrastText: string;

  // Properties from light theme not explicitly in user's dark theme
  // Add them as optional or with default/derived values if needed
  // For now, keeping it strict to user's provided dark theme structure
  // Consider adding these for consistency if they are used:
  primaryLight?: string;
  successLight?: string;
  warningLight?: string;
  infoLight?: string;
  errorLight?: string;
  dangerLight?: string;
  secondary?: string;
  secondaryLight?: string;
  tertiary?: string;
  tertiaryLight?: string;
  grey?: string;
  textMuted?: string; // Added for consistency with light theme
}

// Define the complete theme structure
export interface AppTheme {
  light: AppThemeLightPalette;
  dark: AppThemeDarkPalette;
}

// Import color constants from the colors utility
import { teal, lightTeal, baseNude, lightNude, brown, darkBrown } from '../lib/colors';

// The user's color theme object
export const AppColors: AppTheme = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    textLight: '#FFFFFF',
    textDarkContrast: '#076678',

    background: baseNude,
    backgroundPrimary: '#FFF8F0',
    backgroundSecondary: lightNude,
    backgroundLight: '#FFFFFF',
    backgroundPaper: '#FFFFFF',
    neutralBg: '#FFF5EC',
    buttonPrimary: teal,

    primary: teal,
    primaryContrastText: '#FFFFFF',
    accent: brown,
    accentContrastText: '#FFFFFF',
    accentHighlight: '#E6C300',

    tint: teal,
    icon: '#687076',
    tabIconDefault: '#A47551',
    tabIconSelected: teal,
    border: '#D1D5DB',
    divider: '#E5E7EB',

    success: '#4CAF50',
    successContrastText: '#FFFFFF',
    error: '#F44336',
    danger: '#D32F2F',
    errorContrastText: '#FFFFFF',
    warning: '#FFC107',
    warningContrastText: '#11181C',
    info: '#2196F3',
    infoContrastText: '#FFFFFF',

    primaryLight: lightTeal,
    successLight: '#E8F5E9',
    warningLight: '#FFF8E1',
    infoLight: '#E3F2FD',
    errorLight: '#FFEBEE',
    dangerLight: '#FFCDD2',
    secondary: brown,
    secondaryLight: '#D8BFA6',
    tertiary: '#FF6F00',
    tertiaryLight: '#FFE0B2',
    grey: '#B0BEC5',
    textMuted: '#9BA1A6', // Added for consistency with dark theme
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    textLight: '#1E1E1E',
    textDarkContrast: '#E0F2F7',

    background: '#121212',
    backgroundPrimary: '#1E1E1E',
    backgroundSecondary: '#2E2E2E',
    backgroundLight: '#1A1A1A',
    backgroundPaper: '#1E1E1E',
    neutralBg: '#2B2B2B',
    buttonPrimary: darkBrown,

    primary: '#0EA175',
    primaryContrastText: '#FFFFFF',
    accent: '#A47551',
    accentContrastText: '#FFFFFF',
    accentHighlight: '#FFD700',

    tint: '#0EA175',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#0EA175',
    border: '#424242',
    divider: '#2E2E2E',

    success: '#66BB6A',
    successContrastText: '#121212',
    error: '#EF5350',
    danger: '#E57373',
    errorContrastText: '#121212',
    warning: '#FFEE58',
    warningContrastText: '#121212',
    info: '#42A5F5',
    infoContrastText: '#121212',
    textMuted: '#9BA1A6', // Added for consistency with light theme
  },
};
