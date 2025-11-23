/**
 * useCenterTabButton.ts - Hook for managing center tab button configurations
 */

import { useMemo } from 'react'
import { Colors } from '../constants'

export type CenterTabTheme = 
  | 'services' 
  | 'social' 
  | 'commerce' 
  | 'media' 
  | 'finance' 
  | 'realEstate' 
  | 'jobs'
  | 'sports'
  | 'crypto'

export const useCenterTabButton = (theme: CenterTabTheme = 'services') => {
  const config = useMemo(() => {
    switch (theme) {
      case 'services':
        return {
          iconName: 'plus',
          iconLibrary: 'FontAwesome' as const,
          gradient: ['#667eea', '#764ba2'],
          size: 32,
          shadow: true,
        }
      
      case 'social':
        return {
          iconName: 'plus',
          iconLibrary: 'FontAwesome' as const,
          gradient: ['#FF6B6B', '#FF8E53'],
          size: 34,
          shadow: true,
        }
      
      case 'commerce':
        return {
          iconName: 'shopping-bag',
          iconLibrary: 'Feather' as const,
          gradient: Colors.gradients.primary,
          size: 32,
          shadow: true,
        }
      
      case 'media':
        return {
          iconName: 'camera',
          iconLibrary: 'Feather' as const,
          gradient: ['#f093fb', '#f5576c'],
          size: 32,
          shadow: true,
        }
      
      case 'finance':
        return {
          iconName: 'trending-up',
          iconLibrary: 'Feather' as const,
          gradient: ['#4facfe', '#00f2fe'],
          size: 32,
          shadow: true,
        }
      
      case 'realEstate':
        return {
          iconName: 'home',
          iconLibrary: 'Feather' as const,
          gradient: ['#C084FC', '#A855F7'],
          size: 32,
          shadow: true,
        }
      
      case 'jobs':
        return {
          iconName: 'briefcase',
          iconLibrary: 'Feather' as const,
          gradient: ['#ffecd2', '#fcb69f'],
          size: 32,
          shadow: true,
        }
      
      case 'sports':
        return {
          iconName: 'activity',
          iconLibrary: 'Feather' as const,
          gradient: ['#FF6B6B', '#4ECDC4'],
          size: 32,
          shadow: true,
        }
      
      case 'crypto':
        return {
          iconName: 'trending-up',
          iconLibrary: 'Feather' as const,
          gradient: ['#F7931A', '#FFD700'], // Bitcoin colors
          size: 32,
          shadow: true,
        }
      
      default:
        return {
          iconName: 'plus',
          iconLibrary: 'FontAwesome' as const,
          gradient: Colors.gradients.primary,
          size: 54,
          shadow: true,
        }
    }
  }, [theme])

  return config
}

export default useCenterTabButton