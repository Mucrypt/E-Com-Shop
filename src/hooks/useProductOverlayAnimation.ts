import { useRef, useEffect } from 'react'
import { Animated } from 'react-native'

export function useProductOverlayAnimation() {
  const slideAnim = useRef(new Animated.Value(80)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start()
  }, [slideAnim, fadeAnim])

  return { slideAnim, fadeAnim }
}
