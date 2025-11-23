# 🎨 Constants Folder - Theme System Documentation

> **Complete design system for Mukulah E-Commerce App**  
> Centralized theme management for consistent styling, easy maintenance, and scalable development.

---

## 📁 Folder Structure

```
src/constants/
├── README.md              # This documentation
├── index.ts              # Main exports - import from here
├── useTheme.ts           # React hooks for theme access
├── Colors.ts             # Complete color system
├── Typography.ts         # Text styles and font scales
├── Spacing.ts            # 4px-grid spacing system
├── BorderRadius.ts       # Consistent rounded corners
├── Shadows.ts            # Elevation and shadow system
├── CommonStyles.ts       # Pre-built component styles
└── ThemeUtils.ts         # Color manipulation utilities
```

---

## 🎯 Core Theme Files

### 1. **Colors.ts** - Color Management
```typescript
// 9-shade primary color scale based on #F5C451
Colors.primary[50]   // Lightest
Colors.primary[500]  // Main brand color (#F5C451)
Colors.primary[900]  // Darkest

// Dark theme backgrounds
Colors.background.primary    // #050509 (main)
Colors.background.secondary  // #0B0F1A (cards)
Colors.background.tertiary   // #111827 (inputs)

// Text hierarchy
Colors.text.primary     // #F9FAFB (main text)
Colors.text.secondary   // #E5E7EB (secondary)
Colors.text.muted       // #9CA3AF (muted)
```

### 2. **Typography.ts** - Text System
```typescript
// Font sizes (based on mobile-first design)
Typography.sizes.xs     // 10px
Typography.sizes.base   // 12px
Typography.sizes.xl     // 16px
Typography.sizes['2xl'] // 18px

// Pre-defined text styles
Typography.styles.h1    // Headers
Typography.styles.body  // Body text
Typography.styles.caption // Small text
```

### 3. **Spacing.ts** - 4px Grid System
```typescript
// Base spacing units
Spacing[1]  // 4px
Spacing[4]  // 16px (most common)
Spacing[6]  // 24px (sections)

// Common patterns
SpacingPatterns.container.horizontal // 16px
SpacingPatterns.card.padding        // 16px
```

### 4. **CommonStyles.ts** - Pre-built Components
```typescript
// Ready-to-use styles
CommonStyles.container      // Main container
CommonStyles.card          // Card component
CommonStyles.buttonPrimary // Primary button
CommonStyles.textPrimary   // Main text style
```

---

## 🌟 Key Features

### ✅ **Brand Consistency**
- Single source of truth for all colors
- Consistent spacing across all components
- Unified typography system
- Standardized shadows and borders

### ✅ **Section-Specific Branding**
Each app section has its own color identity:
```typescript
Colors.sections.realEstate  // Purple theme (#C084FC)
Colors.sections.sports      // Live indicators, team colors
Colors.sections.crypto      // Bitcoin/Ethereum colors
Colors.sections.services    // Course and mentor colors
Colors.sections.jobs        // Remote/hybrid indicators
Colors.sections.media       // Play/pause/like colors
```

### ✅ **Developer Experience**
- TypeScript support with autocomplete
- React hooks for easy access
- Utility functions for color manipulation
- Pre-built component styles

### ✅ **Scalability & Maintenance**
- Easy global color updates
- Modular file organization
- Extensible for new features
- Consistent design patterns

---

## 🎨 Brand Colors

### Primary Brand Scale
```typescript
// Golden yellow brand color with 9 shades
const brandColors = {
  primary50:  '#FFF9E6',  // Lightest tint
  primary100: '#FFF0B3',
  primary200: '#FFE680',
  primary300: '#FFDC4D',
  primary400: '#FFD21A',
  primary500: '#F5C451',  // 🌟 Main brand color
  primary600: '#E6B546',
  primary700: '#CC9E3A',
  primary800: '#B3882F',
  primary900: '#997123',  // Darkest shade
}
```

### Dark Theme Hierarchy
```typescript
const darkTheme = {
  background: {
    primary:    '#050509',  // Main background
    secondary:  '#0B0F1A',  // Cards, elevated surfaces
    tertiary:   '#111827',  // Input fields, inactive
    quaternary: '#1F2937',  // Borders, dividers
  }
}
```

### Status Colors
```typescript
const statusColors = {
  success: '#10B981',  // Green
  warning: '#F59E0B',  // Orange
  error:   '#EF4444',  // Red
  info:    '#3B82F6',  // Blue
}
```

---

## 🧩 Component System

### Pre-Built Styles
```typescript
// Import and use directly
import { CommonStyles } from '@/constants'

<View style={CommonStyles.card}>
  <Text style={CommonStyles.textPrimary}>Hello World</Text>
  <TouchableOpacity style={CommonStyles.buttonPrimary}>
    <Text>Click Me</Text>
  </TouchableOpacity>
</View>
```

### Layout Helpers
```typescript
// Flexbox utilities
CommonStyles.row        // Horizontal layout
CommonStyles.rowBetween // Space between items
CommonStyles.center     // Center content

// Spacing utilities
CommonStyles.mb4        // Margin bottom 16px
CommonStyles.p4         // Padding 16px
CommonStyles.px4        // Horizontal padding 16px
```

---

## 🚀 Usage Examples

### Method 1: Using Hooks (Recommended)
```typescript
import { useTheme, useColors, useSectionColors } from '@/constants'

const MyComponent = () => {
  // Get entire theme
  const { colors, spacing, typography } = useTheme()
  
  // Get only colors
  const colors = useColors()
  
  // Get section-specific colors
  const sportsColors = useSectionColors('sports')
  
  return (
    <View style={{
      backgroundColor: colors.background.primary,
      padding: spacing[4],
    }}>
      <Text style={{
        color: colors.text.primary,
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
      }}>
        Themed Component
      </Text>
    </View>
  )
}
```

### Method 2: Direct Imports
```typescript
import { Colors, Spacing, Typography, CommonStyles } from '@/constants'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    padding: Spacing[4],
  },
  title: {
    color: Colors.text.primary,
    ...Typography.styles.h2,
  },
  card: {
    ...CommonStyles.card,
    marginBottom: Spacing[3],
  },
})
```

### Method 3: Utility Functions
```typescript
import { ThemeUtils } from '@/constants'

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: ThemeUtils.withOpacity('#F5C451', 0.1),
  },
  gradient: {
    // Use with LinearGradient
    colors: ThemeUtils.getGradient('primary'),
  },
  sectionStyle: {
    backgroundColor: ThemeUtils.getSectionColors('sports').primary,
  },
})
```

---

## 🔮 Future Enhancements

### 🎯 **Planned Features**

#### 1. **Theme Variants**
```typescript
// Future: Multiple theme variants
import { useTheme } from '@/constants'

const { theme, setTheme } = useTheme()
// Switch between: 'dark', 'light', 'auto', 'seasonal'
setTheme('light')
```

#### 2. **Seasonal Themes**
```typescript
// Future: Holiday and seasonal color schemes
Colors.variants.christmas = {
  primary: '#DC2626',   // Red
  secondary: '#059669', // Green
}

Colors.variants.summer = {
  primary: '#F59E0B',   // Orange
  secondary: '#3B82F6', // Blue
}
```

#### 3. **Animation Constants**
```typescript
// Future: Animation/transition constants
export const Animations = {
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease-in-out',
    bounce: 'spring',
  },
}
```

#### 4. **Responsive Breakpoints**
```typescript
// Future: Responsive design breakpoints
export const Breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  large: 1440,
}
```

#### 5. **Accessibility Constants**
```typescript
// Future: Accessibility improvements
export const A11y = {
  minTouchTarget: 44,    // Minimum touch target size
  contrastRatios: {
    normal: 4.5,         // WCAG AA normal text
    large: 3.0,          // WCAG AA large text
  },
  focusRing: {
    width: 2,
    color: Colors.primary[500],
  },
}
```

### 🛠 **How to Extend**

#### Adding New Colors
```typescript
// In Colors.ts, add to sections object
sections: {
  // ... existing sections
  newSection: {
    primary: '#YOUR_COLOR',
    secondary: '#SECONDARY_COLOR',
    accent: '#ACCENT_COLOR',
  },
}
```

#### Adding New Component Styles
```typescript
// In CommonStyles.ts, add new styles
export const CommonStyles = StyleSheet.create({
  // ... existing styles
  newComponentStyle: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    // ... your styles
  },
})
```

#### Adding New Utility Functions
```typescript
// In ThemeUtils.ts, add new functions
export const ThemeUtils = {
  // ... existing functions
  yourNewUtility: (param: string): string => {
    // Your utility logic
    return result
  },
}
```

---

## 📋 Best Practices

### ✅ **Do's**
- Always use theme values instead of hardcoded colors
- Use hooks in functional components for better performance
- Follow the 4px spacing grid system
- Use semantic color names (primary, secondary, etc.)
- Leverage pre-built CommonStyles when possible

### ❌ **Don'ts**
- Don't hardcode colors like `#F5C451` in components
- Don't create custom spacing values outside the grid
- Don't mix theme system with manual color calculations
- Don't import individual files when you can use index.ts

### 🎯 **Performance Tips**
- Use `useColors()` instead of `useTheme()` when you only need colors
- Import only what you need: `import { Colors } from '@/constants'`
- Use `CommonStyles` for frequently used component patterns
- Cache theme values in components that re-render frequently

---

## 🆘 Troubleshooting

### Common Issues & Solutions

#### "Cannot resolve module '@/constants'"
```typescript
// Make sure you're importing from the correct path
import { useTheme } from '../constants'  // Relative path
// OR
import { useTheme } from '@/constants'   // If you have path mapping
```

#### "Colors.primary is undefined"
```typescript
// Make sure you're importing Colors correctly
import { Colors } from '@/constants'  // ✅ Correct
import Colors from '@/constants'      // ❌ Wrong - imports Theme object
```

#### TypeScript errors with section colors
```typescript
// Use proper typing for section names
const sectionColors = useSectionColors('sports' as const)
// OR use the type
type SectionName = keyof typeof Colors.sections
```

---

## 📞 Support

For questions about the theme system:
1. Check this documentation first
2. Look at usage examples in existing components
3. Check TypeScript definitions for available options
4. Refer to individual theme files for complete options

---

**🎨 Happy Theming!**  
*Consistent design, effortless maintenance, scalable growth.*