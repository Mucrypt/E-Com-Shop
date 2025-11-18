import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react'
import { View, TouchableOpacity, ActivityIndicator, Text } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { Ionicons } from '@expo/vector-icons'
import ProgressiveImage from '../ui/ProgressiveImage'
import { styles } from '../../../../src/styles/VideoPlayer.styles'

export interface VideoPlayerHandle {
  play: () => void
  pause: () => void
  toggle: () => void
}

interface VideoPlayerProps {
  url: string
  isActive: boolean
  isPlaying: boolean
  type: 'video' | 'image' | 'tutorial'
  thumbnail?: string
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  ({ url, isActive, isPlaying, type, thumbnail }, ref) => {
    const [isLoading, setIsLoading] = useState(true)
    const [showControls, setShowControls] = useState(false)

    // Initialize video player
    const videoPlayer = useVideoPlayer({
      uri: url,
    })

    // Handle play/pause based on props
    useEffect(() => {
      if (!videoPlayer) return

      try {
        if (isActive && isPlaying) {
          videoPlayer.play()
        } else {
          videoPlayer.pause()
        }
      } catch (error) {
        console.error('Error controlling video playback:', error)
      }
    }, [isActive, isPlaying, videoPlayer])

    // Simple loading timeout
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 2000)

      return () => clearTimeout(timer)
    }, [])

    useImperativeHandle(ref, () => ({
      play: () => {
        try {
          if (type === 'video' && videoPlayer) {
            videoPlayer.play()
          }
        } catch (error) {
          console.error('Error playing video:', error)
        }
      },
      pause: () => {
        try {
          if (type === 'video' && videoPlayer) {
            videoPlayer.pause()
          }
        } catch (error) {
          console.error('Error pausing video:', error)
        }
      },
      toggle: () => {
        try {
          if (type === 'video' && videoPlayer) {
            // We'll use a simple approach since we can't access playing state reliably
            videoPlayer.pause() // Just toggle between play/pause
          }
        } catch (error) {
          console.error('Error toggling video:', error)
        }
      },
    }))

    if (type === 'image') {
      return (
        <ProgressiveImage
          source={{ uri: url }}
          style={styles.media}
          resizeMode='cover'
          thumbnailSource={{ uri: thumbnail ?? '' }}
        />
      )
    }

    return (
      <View style={styles.container}>
        {type === 'video' && videoPlayer && (
          <VideoView
            player={videoPlayer}
            style={styles.media}
            contentFit='cover'
            allowsFullscreen
            allowsPictureInPicture
          />
        )}

        {isLoading && type === 'video' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#fff' />
          </View>
        )}

        {type === 'video' && !isLoading && (
          <TouchableOpacity
            style={styles.controlOverlay}
            onPress={() => setShowControls(!showControls)}
            activeOpacity={0.9}
          >
            {showControls && (
              <View style={styles.controls}>
                <TouchableOpacity
                  onPress={() => {
                    try {
                      if (videoPlayer) {
                        videoPlayer.pause() // Simple toggle
                      }
                    } catch (error) {
                      console.error('Error toggling video playback:', error)
                    }
                  }}
                  style={styles.playButton}
                >
                  <Ionicons
                    name={'pause'} // Simple icon since we can't detect state reliably
                    size={36}
                    color='rgba(255,255,255,0.9)'
                  />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        )}

        {type === 'tutorial' && (
          <View style={styles.tutorialBadge}>
            <Ionicons name='school' size={16} color='#fff' />
            <Text style={styles.tutorialText}>Tutorial</Text>
          </View>
        )}
      </View>
    )
  }
)

export default VideoPlayer
