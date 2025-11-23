/**
 * ThemeUtils.ts - Utility functions for theme manipulation
 */

import Colors from './Colors'

export const ThemeUtils = {
  /**
   * Add opacity to a hex color
   * @param color - Hex color string (e.g., '#F5C451')
   * @param opacity - Opacity value between 0 and 1
   * @returns RGBA color string
   */
  withOpacity: (color: string, opacity: number): string => {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }
    // Return original if not hex
    return color
  },

  /**
   * Get gradient colors for LinearGradient component
   * @param gradientName - Name of gradient from Colors.gradients
   * @returns Array of gradient colors
   */
  getGradient: (gradientName: keyof typeof Colors.gradients): string[] => {
    return Colors.gradients[gradientName]
  },

  /**
   * Get section-specific colors
   * @param section - Section name from Colors.sections
   * @returns Section color object
   */
  getSectionColors: (section: keyof typeof Colors.sections) => {
    return Colors.sections[section]
  },

  /**
   * Create a lighter version of a color
   * @param color - Base color
   * @param amount - Amount to lighten (0-1)
   * @returns Lightened color
   */
  lighten: (color: string, amount: number): string => {
    // This is a simplified version - you might want to use a color manipulation library
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.round(255 * amount))
      const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.round(255 * amount))
      const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.round(255 * amount))
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }
    return color
  },

  /**
   * Create a darker version of a color
   * @param color - Base color
   * @param amount - Amount to darken (0-1)
   * @returns Darkened color
   */
  darken: (color: string, amount: number): string => {
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.round(255 * amount))
      const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.round(255 * amount))
      const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.round(255 * amount))
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }
    return color
  },

  /**
   * Get status color based on condition
   * @param condition - Status condition
   * @returns Appropriate status color
   */
  getStatusColor: (condition: 'success' | 'error' | 'warning' | 'info' | 'pending'): string => {
    return Colors.status[condition]
  },

  /**
   * Get appropriate text color for background
   * @param backgroundColor - Background color
   * @returns Appropriate text color (light or dark)
   */
  getContrastTextColor: (backgroundColor: string): string => {
    // Simplified contrast calculation
    // In a real app, you might want to use a more sophisticated algorithm
    const darkBackgrounds = [
      Colors.background.primary,
      Colors.background.secondary,
      Colors.background.tertiary,
    ]
    
    if (darkBackgrounds.includes(backgroundColor)) {
      return Colors.text.primary
    }
    
    return Colors.background.primary
  },

  /**
   * Generate theme variant for specific section
   * @param section - Section name
   * @returns Theme variant object
   */
  createSectionTheme: (section: keyof typeof Colors.sections) => {
    const sectionColors = Colors.sections[section]
    return {
      ...Colors,
      primary: {
        ...Colors.primary,
        500: sectionColors.primary,
      },
    }
  },
}

export default ThemeUtils