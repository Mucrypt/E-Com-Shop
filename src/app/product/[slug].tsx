import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import { useCartStore } from '../../store'
import { useAppToast } from '../../components/toast'

const { width } = Dimensions.get('window')

// Mock product data that changes based on slug
const getProductBySlug = (slug: string) => {
  const products = {
    'wireless-headphones': {
      id: '1',
      name: 'Wireless Headphones',
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.5,
      reviews: 128,
      description:
        'Premium wireless headphones with active noise cancellation.',
      features: ['Active Noise Cancellation', '30-hour battery', 'Wireless'],
      colors: ['Black', 'White', 'Blue'],
    },
    smartphone: {
      id: '2',
      name: 'Smartphone Pro',
      price: 899.99,
      originalPrice: 999.99,
      rating: 4.8,
      reviews: 256,
      description: 'Latest smartphone with advanced camera and processor.',
      features: ['Triple Camera', '5G Ready', 'Fast Charging'],
      colors: ['Black', 'Silver', 'Gold'],
    },
    laptop: {
      id: '3',
      name: 'Gaming Laptop',
      price: 1299.99,
      originalPrice: 1499.99,
      rating: 4.6,
      reviews: 89,
      description: 'High-performance gaming laptop with RTX graphics.',
      features: ['RTX Graphics', '16GB RAM', 'RGB Keyboard'],
      colors: ['Black', 'Red'],
    },
  }

  return (
    products[slug as keyof typeof products] || products['wireless-headphones']
  )
}

const ProductSlug = () => {
  const { slug } = useLocalSearchParams()
  const addToCart = useCartStore((state) => state.addToCart)
  const { showCartSuccessToast } = useAppToast()
  const product = getProductBySlug(
    typeof slug === 'string' ? slug : 'wireless-headphones'
  )

  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      color: selectedColor,
      size: 'Default',
      image: 'default',
      inStock: true,
      category: 'Electronics',
      rating: product.rating,
      estimatedDelivery: '2-3 days',
    }

    addToCart(cartItem, quantity)

    // Show beautiful toast notification
    showCartSuccessToast({
      productName: product.name,
      productPrice: product.price,
      quantity: quantity,
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    // Navigate directly to cart for immediate checkout
    setTimeout(() => {
      router.push('/(shop)/cart')
    }, 100)
  }

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <FontAwesome name='image' size={100} color='#ccc' />
          <View style={styles.imageIndicator}>
            <Text style={styles.imageIndicatorText}>1 / 3</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Product Info */}
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            <Text style={styles.originalPrice}>${product.originalPrice}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name={star <= product.rating ? 'star' : 'star-o'}
                  size={16}
                  color='#FFD700'
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews} reviews)
            </Text>
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.colorContainer}>
              {product.colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  <Text
                    style={[
                      styles.colorText,
                      selectedColor === color && styles.selectedColorText,
                    ]}
                  >
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <FontAwesome name='minus' size={16} color='#666' />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <FontAwesome name='plus' size={16} color='#666' />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            {product.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <FontAwesome name='check' size={16} color='#2E8C83' />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <FontAwesome name='shopping-cart' size={20} color='#2E8C83' />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style='auto' />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  imageIndicatorText: {
    color: '#fff',
    fontSize: 12,
  },
  content: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8C83',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 10,
  },
  ratingText: {
    color: '#666',
    fontSize: 14,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedColor: {
    backgroundColor: '#2E8C83',
    borderColor: '#2E8C83',
  },
  colorText: {
    color: '#666',
    fontSize: 14,
  },
  selectedColorText: {
    color: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2E8C83',
    paddingVertical: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  addToCartText: {
    color: '#2E8C83',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#2E8C83',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buyNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default ProductSlug
