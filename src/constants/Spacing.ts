/**
 * Spacing.ts - Consistent spacing system based on 4px grid
 */

export const Spacing = {
  // Base spacing units (4px grid system)
  0: 0,
  1: 4,    // 0.25rem
  2: 8,    // 0.5rem
  3: 12,   // 0.75rem
  4: 16,   // 1rem
  5: 20,   // 1.25rem
  6: 24,   // 1.5rem
  7: 28,   // 1.75rem
  8: 32,   // 2rem
  10: 40,  // 2.5rem
  12: 48,  // 3rem
  14: 56,  // 3.5rem
  16: 64,  // 4rem
  20: 80,  // 5rem
  24: 96,  // 6rem
  28: 112, // 7rem
  32: 128, // 8rem
  36: 144, // 9rem
  40: 160, // 10rem
  44: 176, // 11rem
  48: 192, // 12rem
  52: 208, // 13rem
  56: 224, // 14rem
  60: 240, // 15rem
  64: 256, // 16rem
  72: 288, // 18rem
  80: 320, // 20rem
  96: 384, // 24rem
}

// Common spacing patterns
export const SpacingPatterns = {
  // Container padding
  container: {
    horizontal: Spacing[4], // 16px
    vertical: Spacing[6],   // 24px
  },
  
  // Card spacing
  card: {
    padding: Spacing[4],    // 16px
    margin: Spacing[3],     // 12px
    gap: Spacing[2],        // 8px
  },
  
  // List spacing
  list: {
    itemGap: Spacing[2],    // 8px
    sectionGap: Spacing[6], // 24px
  },
  
  // Form spacing
  form: {
    fieldGap: Spacing[4],   // 16px
    groupGap: Spacing[6],   // 24px
    labelGap: Spacing[2],   // 8px
  },
  
  // Navigation spacing
  navigation: {
    tabHeight: 80,
    tabPadding: Spacing[4], // 16px
    iconGap: Spacing[2],    // 8px
  },
  
  // Header spacing
  header: {
    height: 60,
    padding: Spacing[4],    // 16px
    gap: Spacing[3],        // 12px
  },
}

export default Spacing