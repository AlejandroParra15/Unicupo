import '@/global.css';

import { Platform } from 'react-native';

export const UniColors = {
  black: '#1A1A1A',
  white: '#FFFFFF',
  primary: '#1A8A7D',
  primaryBg: '#0F2E2D',
  primaryDark: '#0D3D3B',
  fontPrimary: '#1A1A1A',
  fontSecondary: '#666666',
  fontWhite: '#FFFFFF',
  border: '#E0E0E0',
  error: '#E74C3C',
  gray100: '#F5F5F5',
  gray300: '#D1D1D1',
  gray500: '#888888',
  gray700: '#555555',
} as const;

export const UniSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const UniRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const Colors = {
  light: {
    text: UniColors.fontPrimary,
    background: UniColors.white,
    backgroundElement: UniColors.gray100,
    backgroundSelected: UniColors.gray300,
    textSecondary: UniColors.fontSecondary,
  },
  dark: {
    text: UniColors.fontPrimary,
    background: UniColors.white,
    backgroundElement: UniColors.gray100,
    backgroundSelected: UniColors.gray300,
    textSecondary: UniColors.fontSecondary,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
