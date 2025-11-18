import React, { useState } from 'react'
import {
  View,
  Image,
  ImageProps,
  Animated,
  StyleProp,
  ImageStyle,
} from 'react-native'
import { styles } from '../../../../src/styles/ProgressiveImage.styles'

interface ProgressiveImageProps extends ImageProps {
  thumbnailSource?: { uri: string }
  thumbnailBlurRadius?: number
  style?: StyleProp<ImageStyle>
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  source,
  thumbnailSource,
  thumbnailBlurRadius = 3,
  style,
  onLoad,
  ...props
}) => {
  const [thumbnailAnimated] = useState(new Animated.Value(0))
  const [imageAnimated] = useState(new Animated.Value(0))
  const [isLoaded, setIsLoaded] = useState(false)

  const handleThumbnailLoad = () => {
    Animated.timing(thumbnailAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  const handleImageLoad = (event: any) => {
    setIsLoaded(true)
    Animated.timing(imageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      // Clean up thumbnail after main image loads
      Animated.timing(thumbnailAnimated, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    })

    onLoad?.(event)
  }

  return (
    <View style={[styles.container, style]}>
      {thumbnailSource && !isLoaded && (
        <Animated.View style={{ opacity: thumbnailAnimated }}>
          <Image
            {...props}
            source={thumbnailSource}
            style={[style, styles.image]}
            blurRadius={thumbnailBlurRadius}
            onLoad={handleThumbnailLoad}
          />
        </Animated.View>
      )}

      <Animated.View style={{ opacity: imageAnimated }}>
        <Image
          {...props}
          source={source}
          style={[style, styles.image]}
          onLoad={handleImageLoad}
        />
      </Animated.View>

      {!isLoaded && (
        <View style={styles.loadingPlaceholder}>
          <View style={styles.loadingIndicator} />
        </View>
      )}
    </View>
  )
}

export default ProgressiveImage
