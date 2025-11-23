/**
 * index.ts - Main exports for theme system
 * Import from here to access all theme constants
 */

// Core theme constants
export { default as Colors } from './Colors'
export { default as Typography } from './Typography'
export { default as Spacing, SpacingPatterns } from './Spacing'
export { default as BorderRadius, RadiusPatterns } from './BorderRadius'
export { default as Shadows } from './Shadows'
export { default as CommonStyles } from './CommonStyles'
export { default as ThemeUtils } from './ThemeUtils'

// Complete theme object
import Colors from './Colors'
import Typography from './Typography'
import Spacing, { SpacingPatterns } from './Spacing'
import BorderRadius, { RadiusPatterns } from './BorderRadius'
import Shadows from './Shadows'
import CommonStyles from './CommonStyles'
import ThemeUtils from './ThemeUtils'

export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  spacingPatterns: SpacingPatterns,
  borderRadius: BorderRadius,
  radiusPatterns: RadiusPatterns,
  shadows: Shadows,
  commonStyles: CommonStyles,
  utils: ThemeUtils,
}

// Convenience exports for most commonly used items
export const {
  primary,
  background,
  text,
  status,
  sections,
} = Colors

export const {
  sizes: fontSizes,
  weights: fontWeights,
  styles: textStyles,
} = Typography

export default Theme