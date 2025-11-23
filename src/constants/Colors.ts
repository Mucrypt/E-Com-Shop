/**
 * Colors.ts - Comprehensive color system for Mukulah App
 * Central color management for easy maintenance and updates
 */

export const Colors = {
  // Primary Brand Colors
  primary: {
    50: '#FFF9E6',
    100: '#FFF0B3',
    200: '#FFE680',
    300: '#FFDC4D',
    400: '#FFD21A',
    500: '#F5C451', // Main accent color
    600: '#E6B546',
    700: '#CC9E3A',
    800: '#B3882F',
    900: '#997123',
  },

  // Background Colors (Dark Theme)
  background: {
    primary: '#050509',    // Main dark background
    secondary: '#0B0F1A',  // Cards and elevated surfaces
    tertiary: '#111827',   // Input fields, inactive states
    quaternary: '#1F2937', // Borders, dividers
    overlay: '#151822',    // Tab bar tops, subtle overlays
  },

  // Text Colors
  text: {
    primary: '#F9FAFB',    // Main text (white)
    secondary: '#E5E7EB',  // Secondary text (light gray)
    tertiary: '#D1D5DB',   // Tertiary text
    muted: '#9CA3AF',      // Muted text
    disabled: '#6B7280',   // Disabled text
    placeholder: '#8589A0', // Placeholder text
    inactive: '#888EA3',   // Inactive tab text
  },

  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    pending: '#F59E0B',
  },

  // Special Purpose Colors
  special: {
    live: '#EF4444',       // Live indicators
    online: '#10B981',     // Online status
    offline: '#6B7280',    // Offline status
    rating: '#FBBF24',     // Star ratings
    verified: '#3B82F6',   // Verification badges
    sponsored: '#F59E0B',  // Sponsored content
    featured: '#8B5CF6',   // Featured items
  },

  // Gradient Color Sets
  gradients: {
    primary: ['#F5C451', '#E6B546'],
    purple: ['#8B5CF6', '#6D28D9'],
    blue: ['#3B82F6', '#1D4ED8'],
    green: ['#10B981', '#047857'],
    red: ['#EF4444', '#DC2626'],
    orange: ['#F59E0B', '#D97706'],
    dark: ['#050509', '#111827'],
    darkCard: ['#0B0F1A', '#111827'],
  },

  // Section-Specific Colors
  sections: {
    // Main App
    main: {
      primary: '#F5C451',
      secondary: '#E6B546',
      accent: '#FFD21A',
    },
    
    // Shop/Commerce
    shop: {
      primary: '#F5C451',
      cart: '#10B981',
      discount: '#EF4444',
      outOfStock: '#6B7280',
    },
    
    // Real Estate
    realEstate: {
      primary: '#C084FC',
      light: '#DDD6FE',
      dark: '#7C3AED',
      featured: '#A855F7',
    },
    
    // Sports
    sports: {
      primary: '#F5C451',
      live: '#EF4444',
      winner: '#10B981',
      loser: '#6B7280',
      draw: '#F59E0B',
    },
    
    // Crypto
    crypto: {
      bitcoin: '#F7931A',
      ethereum: '#627EEA',
      profit: '#10B981',
      loss: '#EF4444',
      neutral: '#9CA3AF',
    },
    
    // Services
    services: {
      primary: '#F5C451',
      category: '#8B5CF6',
      mentor: '#10B981',
      course: '#3B82F6',
      gig: '#F59E0B',
    },
    
    // Jobs
    jobs: {
      primary: '#F5C451',
      remote: '#10B981',
      onSite: '#3B82F6',
      hybrid: '#8B5CF6',
      sponsored: '#F59E0B',
      urgent: '#EF4444',
    },
    
    // Media
    media: {
      play: '#EF4444',
      pause: '#F59E0B',
      live: '#EF4444',
      liked: '#EF4444',
      comment: '#3B82F6',
      share: '#10B981',
    },
  },

  // Overlay Colors with Alpha
  overlay: {
    light10: 'rgba(255, 255, 255, 0.1)',
    light20: 'rgba(255, 255, 255, 0.2)',
    light30: 'rgba(255, 255, 255, 0.3)',
    dark10: 'rgba(0, 0, 0, 0.1)',
    dark30: 'rgba(0, 0, 0, 0.3)',
    dark50: 'rgba(0, 0, 0, 0.5)',
    dark70: 'rgba(0, 0, 0, 0.7)',
    dark90: 'rgba(0, 0, 0, 0.9)',
    backdrop: 'rgba(0, 0, 0, 0.55)',
  },

  // Border Colors
  border: {
    primary: '#111827',
    secondary: '#1F2937',
    tertiary: '#374151',
    accent: '#F5C451',
    muted: '#6B7280',
  },

  // Component-Specific Colors
  components: {
    // Buttons
    button: {
      primary: '#F5C451',
      primaryHover: '#E6B546',
      secondary: 'transparent',
      danger: '#EF4444',
      success: '#10B981',
    },
    
    // Cards
    card: {
      background: '#0B0F1A',
      border: '#111827',
      elevated: '#1F2937',
    },
    
    // Navigation
    navigation: {
      background: '#050509',
      border: '#151822',
      active: '#F5C451',
      inactive: '#888EA3',
    },
    
    // Forms
    form: {
      background: '#111827',
      border: '#1F2937',
      borderFocus: '#F5C451',
      placeholder: '#6B7280',
    },
  },
}

export default Colors