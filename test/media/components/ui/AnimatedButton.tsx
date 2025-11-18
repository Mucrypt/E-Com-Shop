import React, { useRef } from 'react'
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Animated,
  Easing,
} from 'react-native'
import * as Haptics from 'expo-haptics'

interface AnimatedButtonProps extends TouchableOpacityProps {
  scaleTo?: number
  withHapticFeedback?: boolean
  hapticType?: Haptics.ImpactFeedbackStyle
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  scaleTo = 0.95,
  withHapticFeedback = false,
  hapticType = Haptics.ImpactFeedbackStyle.Light,
  children,
  onPress,
  style,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: scaleTo,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start()
  }

  const handlePress = (e: any) => {
    if (withHapticFeedback) {
      Haptics.impactAsync(hapticType)
    }
    onPress?.(e)
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
        style={style}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  )
}

export default AnimatedButton
