/**
 * Typography.ts - Typography system for consistent text styling
 */

export const Typography = {
  // Font Sizes
  sizes: {
    xs: 10,
    sm: 11,
    base: 12,
    md: 13,
    lg: 14,
    xl: 16,
    '2xl': 18,
    '3xl': 20,
    '4xl': 22,
    '5xl': 24,
    '6xl': 28,
    '7xl': 32,
    '8xl': 36,
    '9xl': 42,
    '10xl': 48,
  },
  
  // Font Weights
  weights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line Heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
  
  // Common Text Styles
  styles: {
    // Headers
    h1: {
      fontSize: 32,
      fontWeight: '800',
      lineHeight: 1.25,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 1.4,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 1.4,
    },
    h5: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.5,
    },
    h6: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 1.5,
    },
    
    // Body Text
    body: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    
    // Captions and Labels
    caption: {
      fontSize: 11,
      fontWeight: '400',
      lineHeight: 1.3,
    },
    label: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 1.4,
    },
    
    // Buttons
    button: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 1.2,
    },
    buttonSmall: {
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 1.2,
    },
    
    // Navigation
    tab: {
      fontSize: 11,
      fontWeight: '600',
      lineHeight: 1.2,
    },
    
    // Cards
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      lineHeight: 1.3,
    },
    cardSubtitle: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.4,
    },
  },
}

export default Typography