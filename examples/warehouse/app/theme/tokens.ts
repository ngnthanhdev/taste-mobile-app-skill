// Tokens from MOBILE-DESIGN.md (schema 2, direction "Nhãn đen"). The only place hex values live.
import { Platform } from 'react-native';

export const colors = {
  light: {
    surface: '#FFFFFF',
    surfaceAlt: '#F2F2F0',
    text: '#111111',
    textMuted: '#5C5C5C',
    accent: '#111111',
    onAccent: '#FFFFFF',
    warn: '#F5B400',
    danger: '#B3261E',
    divider: '#E4E4E1',
  },
  dark: {
    surface: '#121212',
    surfaceAlt: '#1E1E1E',
    text: '#F4F4F2',
    textMuted: '#A3A3A0',
    accent: '#F4F4F2',
    onAccent: '#121212',
    warn: '#F5B400',
    danger: '#F2B8B5',
    divider: '#2A2A2A',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type Palette = (typeof colors)[ColorScheme];

// Five even sizes, line heights fixed. Display is for the quantity being edited and the headline count only.
export const type = {
  caption: { fontSize: 12, lineHeight: 16 },
  body: { fontSize: 14, lineHeight: 20 },
  bodyLg: { fontSize: 16, lineHeight: 24 },
  heading: { fontSize: 20, lineHeight: 28 },
  display: { fontSize: 32, lineHeight: 40 },
} as const;

// Roboto is the Android system face. Roboto Mono is to be loaded with expo-font before release;
// until then the platform monospace face with tabular figures keeps codes and quantities aligned.
export const fontFamily = {
  ui: Platform.select({ android: 'Roboto', ios: 'System', default: undefined }),
  mono: Platform.select({ android: 'monospace', ios: 'Menlo', default: 'monospace' }),
} as const;

export const spacing = { s4: 4, s8: 8, s12: 12, s16: 16, s24: 24, s32: 32, s40: 40, s48: 48 } as const;

// 0 on everything that comes from the label world; pill only on chips; sheet follows Material 3.
export const radius = { control: 0, field: 4, chip: 999, sheet: 28 } as const;

export const duration = { fast: 120, base: 180, slow: 250 } as const;

// Tap sizes: 48 dp on Android survives gloves; the stepper is 56.
export const touch = { min: 48, stepper: 56 } as const;
