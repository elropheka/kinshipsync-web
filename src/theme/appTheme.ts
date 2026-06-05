// Define the structure for the light color palette
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

import {
  cream,
  heritageGreen,
  orange,
  sand,
  rust,
  golden,
  BrandTokens,
} from '../lib/colors';

export const AppColors: AppTheme = {
  light: {
    text: rust,
    textSecondary: heritageGreen,
    textMuted: BrandTokens.textMuted,
    textLight: BrandTokens.surface,
    textDarkContrast: heritageGreen,
    background: cream,
    backgroundPrimary: cream,
    backgroundSecondary: '#FBF6EF',
    backgroundLight: BrandTokens.surface,
    backgroundPaper: BrandTokens.surface,
    neutralBg: '#FFF5EC',
    buttonPrimary: orange,
    primary: heritageGreen,
    primaryContrastText: BrandTokens.surface,
    accent: golden,
    accentContrastText: rust,
    accentHighlight: BrandTokens.goldenHover,
    tint: heritageGreen,
    icon: BrandTokens.textMuted,
    tabIconDefault: sand,
    tabIconSelected: heritageGreen,
    border: sand,
    divider: sand,
    success: '#4CAF50',
    successContrastText: BrandTokens.surface,
    error: '#F44336',
    danger: '#D32F2F',
    errorContrastText: BrandTokens.surface,
    warning: golden,
    warningContrastText: rust,
    info: '#2196F3',
    infoContrastText: BrandTokens.surface,
    primaryLight: sand,
    successLight: '#E8F5E9',
    warningLight: '#FFF8E1',
    infoLight: '#E3F2FD',
    errorLight: '#FFEBEE',
    dangerLight: '#FFCDD2',
    secondary: orange,
    secondaryLight: '#F5D4B8',
    tertiary: golden,
    tertiaryLight: '#FFF3D6',
    grey: '#B0BEC5',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: sand,
    textMuted: '#9BA1A6',
    textLight: '#1E1E1E',
    textDarkContrast: cream,
    background: '#1A1814',
    backgroundPrimary: '#1E1C18',
    backgroundSecondary: '#2A2620',
    backgroundLight: '#252220',
    backgroundPaper: '#2E2A24',
    neutralBg: '#2B2B2B',
    buttonPrimary: orange,
    primary: '#7A8F52',
    primaryContrastText: BrandTokens.surface,
    accent: golden,
    accentContrastText: rust,
    accentHighlight: BrandTokens.goldenHover,
    tint: '#7A8F52',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#7A8F52',
    border: '#424242',
    divider: '#3D3830',
    success: '#66BB6A',
    successContrastText: '#121212',
    error: '#EF5350',
    danger: '#E57373',
    errorContrastText: '#121212',
    warning: golden,
    warningContrastText: '#121212',
    info: '#42A5F5',
    infoContrastText: '#121212',
    primaryLight: sand,
    successLight: '#E8F5E9',
    warningLight: '#FFF8E1',
    infoLight: '#E3F2FD',
    errorLight: '#FFEBEE',
    dangerLight: '#FFCDD2',
    secondary: orange,
    secondaryLight: '#D8BFA6',
    tertiary: golden,
    tertiaryLight: '#FFE0B2',
    grey: '#B0BEC5',
  },
};
