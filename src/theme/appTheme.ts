export interface AppThemeLightPalette {
  text: string;
  textSecondary: string;
  textMuted: string;
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
}

export type AppThemeDarkPalette = AppThemeLightPalette;

export interface AppTheme {
  light: AppThemeLightPalette;
  dark: AppThemeDarkPalette;
}

import { Colors } from '../lib/colors';

export const AppColors: AppTheme = {
  light: Colors.light,
  dark: Colors.dark,
};
