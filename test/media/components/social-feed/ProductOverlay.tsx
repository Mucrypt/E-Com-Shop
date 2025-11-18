import React from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ProgressiveImage from '../ui/ProgressiveImage'
import AnimatedButton from '../ui/AnimatedButton'
import { useProductOverlayAnimation } from '../../../../src/hooks/useProductOverlayAnimation'
import { styles } from '../../../../src/styles/ProductOverlay.styles'

interface ProductOverlayProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    discount?: number
  }
  onAddToCart: (product: any) => void
}

const ProductOverlay: React.FC<ProductOverlayProps> = ({
  product,
  onAddToCart,
}) => {
  const { slideAnim, fadeAnim } = useProductOverlayAnimation()

  const handleAddToCart = () => {
    onAddToCart(product)
    // Add success animation
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <ProgressiveImage
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode='cover'
      />

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>${product.originalPrice}</Text>
          )}
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
          )}
        </View>
      </View>

      <AnimatedButton
        onPress={handleAddToCart}
        style={styles.addButton}
        scaleTo={0.9}
      >
        <Ionicons name='cart' size={20} color='#fff' />
      </AnimatedButton>
    </Animated.View>
  )
}

export default ProductOverlay
