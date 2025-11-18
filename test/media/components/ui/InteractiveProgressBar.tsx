import React, { useRef, useEffect } from 'react'
import {
  View,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native'
import { styles } from '../../../../src/styles/InteractiveProgressBar.styles'

interface InteractiveProgressBarProps {
  progress: number // 0 to 1
  duration: number // in seconds
  buffered?: number // 0 to 1
  onSeek: (position: number) => void
  onSlidingStart?: () => void
  onSlidingEnd?: () => void
  style?: any
}

const InteractiveProgressBar: React.FC<InteractiveProgressBarProps> = ({
  progress,
  duration,
  buffered = 0,
  onSeek,
  onSlidingStart,
  onSlidingEnd,
  style,
}) => {
  const progressAnim = useRef(new Animated.Value(progress)).current
  const isSliding = useRef(false)

  useEffect(() => {
    if (!isSliding.current) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start()
    }
  }, [progress, progressAnim])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isSliding.current = true
        onSlidingStart?.()
      },
      onPanResponderMove: (_, gestureState) => {
        const { moveX } = gestureState
        // Calculate new progress based on gesture position
        // This would need access to container width
      },
      onPanResponderRelease: (_, gestureState) => {
        isSliding.current = false
        const { moveX } = gestureState
        // Calculate final progress and call onSeek
        onSlidingEnd?.()
      },
    })
  ).current

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  const TRACK_WIDTH = 300 // px, should match outputRange and actual track style
  const bufferedWidth = buffered * TRACK_WIDTH

  return (
    <View style={[styles.container, style]} {...panResponder.panHandlers}>
      <View style={styles.track}>
        {/* Buffered progress */}
        <View style={[styles.bufferedProgress, { width: bufferedWidth }]} />

        {/* Current progress */}
        <Animated.View style={[styles.progress, { width: progressWidth }]} />
      </View>

      {/* Thumb handle */}
      <Animated.View
        style={[
          styles.thumb,
          {
            left: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 300], // 300px is assumed track width, adjust as needed
            }),
          },
        ]}
      />
    </View>
  )
}

export default InteractiveProgressBar
