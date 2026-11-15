import { Platform, TextStyle } from 'react-native';

/**
 * Mobile Typography Design Tokens for CodeNCampus
 * Tuned specifically for optimal readability on iOS (San Francisco) & Android (Roboto).
 */
export const typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'sans-serif',
  }),

  // Font Sizes
  sizes: {
    hero: 28,
    title1: 24,
    title2: 20,
    title3: 17,
    headline: 16,
    body: 14,
    callout: 13,
    subhead: 12,
    footnote: 11,
    caption: 10,
  },

  // Font Weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  // Line Heights for crisp legibility
  lineHeights: {
    hero: 34,
    title1: 30,
    title2: 26,
    title3: 22,
    headline: 22,
    body: 20,
    callout: 18,
    subhead: 16,
    footnote: 14,
    caption: 12,
  },

  // Pre-composed text styles
  presets: {
    heroTitle: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '800',
      letterSpacing: -0.5,
    } as TextStyle,
    screenTitle: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '800',
      letterSpacing: -0.3,
    } as TextStyle,
    sectionTitle: {
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '700',
      letterSpacing: -0.2,
    } as TextStyle,
    cardTitle: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '700',
    } as TextStyle,
    bodyMedium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    } as TextStyle,
    bodyRegular: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    } as TextStyle,
    captionSemibold: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600',
    } as TextStyle,
    metaText: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
    } as TextStyle,
    badgeText: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '700',
      letterSpacing: 0.2,
    } as TextStyle,
  },
};

