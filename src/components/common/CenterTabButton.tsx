/**
 * CenterTabButton.tsx - Modern floating action button for tab navigation
 * Reusable across multiple layouts with customizable icons and colors
 */

import React from 'react'
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons'
import { Colors, Shadows, BorderRadius } from '../../constants'

type IconLibrary = 'FontAwesome' | 'MaterialIcons' | 'Feather'

type CenterTabButtonProps = {
  onPress: () => void
  iconName: string
  iconLibrary?: IconLibrary
  size?: number
  gradient?: string[]
  backgroundColor?: string
  iconColor?: string
  shadow?: boolean
  pulse?: boolean
  style?: ViewStyle
}

const CenterTabButton: React.FC<CenterTabButtonProps> = ({
  onPress,
  iconName,
  iconLibrary = 'FontAwesome',
  size = 36, // Smaller default size
  gradient = Colors.gradients.primary,
  backgroundColor,
  iconColor = '#FFFFFF',
  shadow = true,
  pulse = false,
  style,
}) => {
  const iconSize = size * 0.5 // Icon is 50% of button size
  const buttonWidth = size * 1.4 // Rectangular width
  const buttonHeight = size // Height

  const renderIcon = () => {
    const iconProps = {
      name: iconName as any,
      size: iconSize,
      color: iconColor,
    }

    switch (iconLibrary) {
      case 'MaterialIcons':
        return <MaterialIcons {...iconProps} />
      case 'Feather':
        return <Feather {...iconProps} />
      case 'FontAwesome':
      default:
        return <FontAwesome {...iconProps} />
    }
  }

  const buttonContent = (
    <View style={[
      styles.innerButton,
      { width: buttonWidth, height: buttonHeight, borderRadius: 8 }
    ]}>
      {renderIcon()}
    </View>
  )

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        shadow && styles.shadowContainer,
        style,
      ]}
      activeOpacity={0.8}
    >
      {gradient && !backgroundColor ? (
        <LinearGradient
          colors={gradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientButton,
            { width: buttonWidth, height: buttonHeight, borderRadius: 8 }
          ]}
        >
          {buttonContent}
        </LinearGradient>
      ) : (
        <View style={[
          styles.solidButton,
          {
            width: buttonWidth,
            height: buttonHeight,
            borderRadius: 8,
            backgroundColor: backgroundColor || Colors.primary[500],
          }
        ]}>
          {buttonContent}
        </View>
      )}
    </TouchableOpacity>
  )
}

// Preset configurations for common use cases
export const CenterTabPresets = {
  // Social media style (like TikTok)
  social: {
    iconName: 'plus',
    iconLibrary: 'FontAwesome' as IconLibrary,
    gradient: ['#FF6B6B', '#FF8E53', '#FF6B6B'],
    size: 56,
  },
  
  // E-commerce style
  commerce: {
    iconName: 'shopping-bag',
    iconLibrary: 'Feather' as IconLibrary,
    gradient: Colors.gradients.primary,
    size: 52,
  },
  
  // Services/Professional
  services: {
    iconName: 'briefcase',
    iconLibrary: 'Feather' as IconLibrary,
    gradient: ['#667eea', '#764ba2'],
    size: 54,
  },
  
  // Creative/Media
  media: {
    iconName: 'camera',
    iconLibrary: 'Feather' as IconLibrary,
    gradient: ['#f093fb', '#f5576c'],
    size: 56,
  },
  
  // Finance/Crypto
  finance: {
    iconName: 'trending-up',
    iconLibrary: 'Feather' as IconLibrary,
    gradient: ['#4facfe', '#00f2fe'],
    size: 50,
  },
  
  // Real Estate
  realEstate: {
    iconName: 'home',
    iconLibrary: 'Feather' as IconLibrary,
    gradient: ['#a8edea', '#fed6e3'],
    size: 52,
  },
  
  // Jobs/Career
  jobs: {
    iconName: 'user-plus',
    iconLibrary: 'Feather' as IconLibrary,
    gradient: ['#ffecd2', '#fcb69f'],
    size: 54,
  },
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -8, // Move down to align perfectly with other tab icons
    marginTop: 8, // Add top margin to maintain proper spacing
  },
  
  shadowContainer: {
    // Subtle shadow for classic look
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  
  gradientButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  solidButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  innerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default CenterTabButton