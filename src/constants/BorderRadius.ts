/**
 * BorderRadius.ts - Consistent border radius system
 */

export const BorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  base: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  full: 999, // Fully rounded
}

// Component-specific radius patterns
export const RadiusPatterns = {
  // Buttons
  button: {
    small: BorderRadius.md,   // 8px
    medium: BorderRadius.lg,  // 12px
    large: BorderRadius.xl,   // 16px
    pill: BorderRadius.full,  // 999px
  },
  
  // Cards
  card: {
    small: BorderRadius.md,   // 8px
    medium: BorderRadius.lg,  // 12px
    large: BorderRadius.xl,   // 16px
  },
  
  // Images
  image: {
    avatar: BorderRadius.full, // 999px
    thumbnail: BorderRadius.md, // 8px
    hero: BorderRadius.xl,     // 16px
  },
  
  // Input fields
  input: {
    default: BorderRadius.lg,  // 12px
    search: BorderRadius.full, // 999px
  },
  
  // Modals and overlays
  modal: {
    default: BorderRadius['2xl'], // 20px
    sheet: BorderRadius['3xl'],   // 24px
  },
}

export default BorderRadius