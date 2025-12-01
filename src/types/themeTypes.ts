// Defines the structure for font settings within a theme
export interface FontSettings {
  fontFamily: string; // e.g., 'Poppins-Bold', 'System'
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
  // fontSize could also be part of a more detailed FontSetting if needed per element type
}

// Import the new detailed palette types
import type { AppThemeLightPalette, AppThemeDarkPalette } from '../theme/appTheme';

// Defines the color palette for a theme, using the new detailed structure.
// We use AppThemeLightPalette as the base, as it's more comprehensive.
// Alternatively, a union type or a more generic base type could be used if strictness is required
// or if dark/light palettes diverge significantly in keys.
export type ThemeColors = AppThemeLightPalette | AppThemeDarkPalette;

// Defines the font selections for a theme
export interface ThemeFonts {
  heading: FontSettings; // Font for main headings (h1, h2, etc.)
  body: FontSettings;    // Font for body text, paragraphs
  // Add more specific font roles as needed, e.g., buttonFont, captionFont
}

// Represents a complete theme object as stored in Firestore
export interface Theme {
  id: string;                 // Unique identifier for the theme (Firestore document ID)
  name: string;               // User-friendly name for the theme (e.g., "Dark Mode", "Ocean Breeze")
  isPredefined?: boolean;     // True if this is a system-provided theme, false or undefined for user/admin-created
  colors: ThemeColors;
  fonts: ThemeFonts;
  createdAt?: string;         // ISO 8601 date string (from Firestore Timestamp)
  updatedAt?: string;         // ISO 8601 date string (from Firestore Timestamp)
  // createdBy?: string;      // Optional: UID of the admin/user who created it
}

// Payload for creating a new theme.
// id, createdAt, updatedAt, isPredefined are typically set by the system/backend.
export type CreateThemePayload = Omit<Theme, 'id' | 'createdAt' | 'updatedAt' | 'isPredefined'> & {
  name: string; // Ensure name is not optional in payload
};

// Payload for updating an existing theme. All fields are optional.
export type UpdateThemePayload = Partial<CreateThemePayload>;
