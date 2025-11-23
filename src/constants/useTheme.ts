/**
 * useTheme.ts - React hooks for accessing theme values
 */

import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  CommonStyles,
  ThemeUtils,
  Theme,
} from './index'

/**
 * Main theme hook - provides access to entire theme system
 * Usage: const { colors, typography, spacing } = useTheme()
 */
export const useTheme = () => {
  return {
    colors: Colors,
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    commonStyles: CommonStyles,
    utils: ThemeUtils,
    theme: Theme,
  }
}

/**
 * Colors hook - most commonly used
 * Usage: const colors = useColors()
 */
export const useColors = () => Colors

/**
 * Typography hook
 * Usage: const typography = useTypography()
 */
export const useTypography = () => Typography

/**
 * Spacing hook
 * Usage: const spacing = useSpacing()
 */
export const useSpacing = () => Spacing

/**
 * Section-specific colors hook
 * Usage: const sportsColors = useSectionColors('sports')
 */
export const useSectionColors = (section: keyof typeof Colors.sections) => {
  return Colors.sections[section]
}

/**
 * Common styles hook
 * Usage: const styles = useCommonStyles()
 */
export const useCommonStyles = () => CommonStyles

/**
 * Theme utilities hook
 * Usage: const { withOpacity, getGradient } = useThemeUtils()
 */
export const useThemeUtils = () => ThemeUtils

export default useTheme