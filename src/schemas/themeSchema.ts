import * as z from 'zod';

// Regex for validating hex color codes (e.g., #RRGGBB, #RGB, #RRGGBBAA, #RGBA)
const hexColorRegex = /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{3})$/;

const fontSettingsSchema = z.object({
  fontFamily: z.string().min(1, "Font family cannot be empty."),
  fontWeight: z.enum(['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']).optional(),
  fontStyle: z.enum(['normal', 'italic']).optional(),
});

const themeColorsSchema = z.object({
  primary: z.string().regex(hexColorRegex, "Invalid primary color hex code."),
  primaryContrastText: z.string().regex(hexColorRegex, "Invalid primary contrast text color hex code."),
  secondary: z.string().regex(hexColorRegex, "Invalid secondary color hex code."),
  secondaryContrastText: z.string().regex(hexColorRegex, "Invalid secondary contrast text color hex code."),
  accent: z.string().regex(hexColorRegex, "Invalid accent color hex code."),
  accentContrastText: z.string().regex(hexColorRegex, "Invalid accent contrast text color hex code."),
  background: z.string().regex(hexColorRegex, "Invalid background color hex code."),
  surface: z.string().regex(hexColorRegex, "Invalid surface color hex code."),
  textOnBackground: z.string().regex(hexColorRegex, "Invalid text on background color hex code."),
  textOnSurface: z.string().regex(hexColorRegex, "Invalid text on surface color hex code."),
  textSecondary: z.string().regex(hexColorRegex, "Invalid secondary text color hex code."),
  border: z.string().regex(hexColorRegex, "Invalid border color hex code."),
  success: z.string().regex(hexColorRegex, "Invalid success color hex code."),
  successContrastText: z.string().regex(hexColorRegex, "Invalid success contrast text color hex code."),
  error: z.string().regex(hexColorRegex, "Invalid error color hex code."),
  errorContrastText: z.string().regex(hexColorRegex, "Invalid error contrast text color hex code."),
  warning: z.string().regex(hexColorRegex, "Invalid warning color hex code."),
  warningContrastText: z.string().regex(hexColorRegex, "Invalid warning contrast text color hex code."),
  info: z.string().regex(hexColorRegex, "Invalid info color hex code."),
  infoContrastText: z.string().regex(hexColorRegex, "Invalid info contrast text color hex code."),
  disabledBackground: z.string().regex(hexColorRegex, "Invalid disabled background color hex code."),
  disabledText: z.string().regex(hexColorRegex, "Invalid disabled text color hex code."),
});

const themeFontsSchema = z.object({
  heading: fontSettingsSchema,
  body: fontSettingsSchema,
});

export const createThemeFormSchema = z.object({
  name: z.string().min(2, "Theme name must be at least 2 characters.").max(100),
  colors: themeColorsSchema,
  fonts: themeFontsSchema,
});

export type CreateThemeFormData = z.infer<typeof createThemeFormSchema>;
