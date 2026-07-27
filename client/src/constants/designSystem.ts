/**
 * Design System Constants - Premium AI SaaS
 * Visual depth, contrast, and personality while remaining clean
 */

// Backgrounds - Layered surfaces for depth
export const backgrounds = {
  main: '#F4F7FB',
  hero: 'linear-gradient(135deg, #EEF6FF 0%, #F8FAFC 100%)',
  primary: '#FFFFFF',
  secondary: '#F8FAFC',
  accent: '#EFF6FF',
  selected: '#DBEAFE',
};

// Brand Colors
export const brand = {
  primary: '#2563EB', // Blue
  secondary: '#0EA5A4', // Teal
  accent: '#F59E0B', // Amber
};

// Widget Colors - Each module gets its own identity
export const widgets = {
  blue: '#3B82F6',
  emerald: '#10B981',
  amber: '#F59E0B',
  purple: '#8B5CF6',
  teal: '#14B8A6',
  indigo: '#6366F1',
  pink: '#EC4899',
};

// Text Colors
export const text = {
  primary: '#0F172A',
  secondary: '#64748B',
  muted: '#94A3B8',
};

// Border Colors
export const border = {
  light: '#E2E8F0',
  medium: '#CBD5E1',
  dark: '#94A3B8',
};

// Shadows - Premium elevation
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: '0 0 20px rgba(59, 130, 246, 0.3)',
};

// Spacing - 8px base system
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
};

// Border Radius
export const borderRadius = {
  none: '0px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
};

// Typography
export const typography = {
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Transitions
export const transitions = {
  fast: '150ms ease-in-out',
  base: '250ms ease-in-out',
  slow: '350ms ease-in-out',
};

// Z-index scale
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

