export interface ColorPalette {
  primary: string;
  primaryContrastText: string;
  secondary: string;
  secondaryContrastText: string;
  accent: string;
  accentContrastText: string;
  background: string;
  surface: string;
  textOnBackground: string;
  textOnSurface: string;
  textSecondary: string;
  border: string;
  success: string;
  successContrastText: string;
  error: string;
  errorContrastText: string;
  warning: string;
  warningContrastText: string;
  info: string;
  infoContrastText: string;
  disabledBackground: string;
  disabledText: string;
}

import { cream, heritageGreen, sand, rust, orange, golden } from '../lib/colors';

export const standardLightPalette: ColorPalette = {
  primary: heritageGreen,
  primaryContrastText: cream,
  secondary: orange,
  secondaryContrastText: cream,
  accent: golden,
  accentContrastText: rust,
  background: cream,
  surface: sand,
  textOnBackground: rust,
  textOnSurface: rust,
  textSecondary: heritageGreen,
  border: sand,
  success: heritageGreen,
  successContrastText: cream,
  error: rust,
  errorContrastText: cream,
  warning: golden,
  warningContrastText: rust,
  info: orange,
  infoContrastText: cream,
  disabledBackground: sand,
  disabledText: heritageGreen,
};

export const standardDarkPalette: ColorPalette = {
  primary: heritageGreen,
  primaryContrastText: cream,
  secondary: orange,
  secondaryContrastText: rust,
  accent: golden,
  accentContrastText: rust,
  background: rust,
  surface: heritageGreen,
  textOnBackground: cream,
  textOnSurface: cream,
  textSecondary: sand,
  border: heritageGreen,
  success: heritageGreen,
  successContrastText: cream,
  error: orange,
  errorContrastText: rust,
  warning: golden,
  warningContrastText: rust,
  info: orange,
  infoContrastText: rust,
  disabledBackground: heritageGreen,
  disabledText: sand,
};
