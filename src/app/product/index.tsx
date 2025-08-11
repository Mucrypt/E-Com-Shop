import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'

const { width } = Dimensions.get('window')

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Premium Wireless Headphones',
  price: 199.99,
  originalPrice: 249.99,
  rating: 4.5,
  reviews: 128,
  description:
    'Experience premium sound quality with these wireless headphones featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
  features: [
    'Active Noise Cancellation',
    '30-hour battery life',
    'Wireless connectivity',
    'Premium materials',
    'Comfortable fit',
  ],
  colors: ['Black', 'White', 'Blue'],
  sizes: ['One Size'],
}

const Product = () => {
  const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0])
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    // TODO: Implement add to cart logic
    console.log('Added to cart:', {
      product: mockProduct.name,
      color: selectedColor,
      quantity,
    })
  }

  const handleBuyNow = () => {
    // TODO: Implement buy now logic
    console.log('Buy now:', {
      product: mockProduct.name,
      color: selectedColor,
      quantity,
    })
  }

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
          <Text style={styles.productName}>{mockProduct.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${mockProduct.price}</Text>
            <Text style={styles.originalPrice}>
              ${mockProduct.originalPrice}
            </Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>20% OFF</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name={star <= mockProduct.rating ? 'star' : 'star-o'}
                  size={16}
                  color='#FFD700'
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {mockProduct.rating} ({mockProduct.reviews} reviews)
            </Text>
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.colorContainer}>
              {mockProduct.colors.map((color) => (
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
            <Text style={styles.description}>{mockProduct.description}</Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            {mockProduct.features.map((feature, index) => (
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

export default Product
