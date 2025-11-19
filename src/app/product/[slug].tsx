// app/(shop)/product/[slug].tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import { useCartStore } from '../../store'
import { useAppToast } from '../../components/toast'

const { width } = Dimensions.get('window')

// ---- Mock product data that changes based on slug ----
const getProductBySlug = (slug: string) => {
  const products = {
    'wireless-headphones': {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.8,
      reviews: 328,
      sold: '9.8K',
      description:
        'Experience studio-quality sound with active noise cancellation, 30-hour battery life and ultra-soft ear cushions designed for all-day comfort.',
      features: [
        'Active Noise Cancellation',
        '30-hour battery life',
        'Wireless Bluetooth 5.3',
        'Fast USB-C charging',
        'Foldable, travel-ready design',
      ],
      colors: ['Black', 'White', 'Blue'],
      images: [
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1518444021430-6433e83b145e?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1524678714210-9917a6c619c3?auto=format&fit=crop&w=900&q=80',
      ],
      category: 'Electronics',
    },
    smartphone: {
      id: '2',
      name: 'Smartphone Pro Max 5G',
      price: 899.99,
      originalPrice: 1049.99,
      rating: 4.9,
      reviews: 512,
      sold: '15.4K',
      description:
        'Flagship 5G smartphone with a cinematic triple-camera system, all-day battery and a stunning 120Hz OLED display.',
      features: [
        'Triple 50MP camera system',
        '6.7" 120Hz OLED display',
        '5G + Wi-Fi 6E',
        'Fast 45W charging',
        'IP68 water resistant',
      ],
      colors: ['Midnight Black', 'Silver', 'Alpine Blue'],
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1512499617640-c2f999018b72?auto=format&fit=crop&w=900&q=80',
      ],
      category: 'Electronics',
    },
    laptop: {
      id: '3',
      name: 'RTX Gaming Laptop 15”',
      price: 1299.99,
      originalPrice: 1549.99,
      rating: 4.7,
      reviews: 189,
      sold: '3.2K',
      description:
        'High-performance gaming laptop powered by RTX graphics, 16GB RAM and a 144Hz display for ultra-smooth gameplay.',
      features: [
        'NVIDIA RTX graphics',
        '16GB DDR5 RAM',
        '1TB NVMe SSD',
        '144Hz FHD display',
        'RGB backlit keyboard',
      ],
      colors: ['Shadow Black', 'Crimson Red'],
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
      ],
      category: 'Electronics',
    },
  }

  return (
    products[slug as keyof typeof products] ||
    products['wireless-headphones']
  )
}

const ProductSlug = () => {
  const { slug } = useLocalSearchParams()
  const { addToCart } = useCartStore()
  const { toast } = useAppToast()

  const product = getProductBySlug(
    typeof slug === 'string' ? slug : 'wireless-headphones'
  )

  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )

  const handleImageScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width)
    setActiveImageIndex(index)
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      color: selectedColor,
      size: 'Default',
      image: product.images[0],
      inStock: true,
      category: product.category,
      rating: product.rating,
      estimatedDelivery: '2-3 days',
    }

    addToCart(cartItem, quantity)
    toast.show(`${product.name} added to cart!`, { type: 'success' })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    setTimeout(() => {
      router.push('/(shop)/cart')
    }, 80)
  }

  return (
    <View style={styles.container}>
      <StatusBar style='light' />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO IMAGE CAROUSEL */}
        <View style={styles.heroWrapper}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleImageScroll}
          >
            {product.images.map((uri, idx) => (
              <Image
                key={uri + idx}
                source={{ uri }}
                style={styles.heroImage}
                resizeMode='cover'
              />
            ))}
          </ScrollView>

          {/* Top-right icons over image */}
          <View style={styles.heroTopIcons}>
            <TouchableOpacity style={styles.heroIconBtn}>
              <FontAwesome name='heart-o' size={18} color='#fff' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroIconBtn}>
              <FontAwesome name='share-alt' size={18} color='#fff' />
            </TouchableOpacity>
          </View>

          {/* Image dots indicator */}
          <View style={styles.imageDots}>
            {product.images.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === activeImageIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>

          {/* Mini counter bottom-right */}
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {activeImageIndex + 1} / {product.images.length}
            </Text>
          </View>
        </View>

        {/* MAIN CONTENT */}
        <View style={styles.content}>
          {/* Name + price block */}
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              €{product.price.toFixed(2)}
            </Text>
            <Text style={styles.originalPrice}>
              €{product.originalPrice.toFixed(2)}
            </Text>
            <View style={styles.discountTag}>
              <Text style={styles.discountTagText}>
                -{discountPercentage}%
              </Text>
            </View>
          </View>

          {/* Rating + sold */}
          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name='star'
                  size={12}
                  color={
                    star <= Math.round(product.rating)
                      ? '#FFD700'
                      : '#E0E0E0'
                  }
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.rating.toFixed(1)} · {product.reviews} reviews ·{' '}
              {product.sold} sold
            </Text>
          </View>

          {/* Benefit strip like Shein: free shipping / returns / delivery */}
          <View style={styles.benefitStrip}>
            <View style={styles.benefitItem}>
              <FontAwesome name='truck' size={14} color='#2E8C83' />
              <Text style={styles.benefitText}>Free Shipping over €49</Text>
            </View>
            <View style={styles.benefitItem}>
              <FontAwesome name='undo' size={14} color='#2E8C83' />
              <Text style={styles.benefitText}>30-day easy returns</Text>
            </View>
            <View style={styles.benefitItem}>
              <FontAwesome name='clock-o' size={14} color='#2E8C83' />
              <Text style={styles.benefitText}>Delivery in 2-5 days</Text>
            </View>
          </View>

          {/* Color selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Color</Text>
              <Text style={styles.sectionSub}>
                Selected: {selectedColor}
              </Text>
            </View>
            <View style={styles.chipRow}>
              {product.colors.map((color) => {
                const selected = selectedColor === color
                return (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorChip,
                      selected && styles.colorChipSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text
                      style={[
                        styles.colorChipText,
                        selected && styles.colorChipTextSelected,
                      ]}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          {/* Quantity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quantity</Text>
            </View>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
              >
                <FontAwesome name='minus' size={16} color='#444' />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((prev) => prev + 1)}
              >
                <FontAwesome name='plus' size={16} color='#444' />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {product.description}
            </Text>
          </View>

          {/* Features list */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key features</Text>
            {product.features.map((feature, idx) => (
              <View key={idx} style={styles.featureRow}>
                <View style={styles.featureIconCircle}>
                  <FontAwesome
                    name='check'
                    size={12}
                    color='#ffffff'
                  />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Maybe: more info section */}
          <View style={styles.sectionLast}>
            <Text style={styles.moreInfoTitle}>Secure checkout</Text>
            <Text style={styles.moreInfoText}>
              All payments are encrypted. You can track your order in
              real time and contact support 24/7 from your Mukulah
              account.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom sticky bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cartIconBtn}
          onPress={() => router.push('/(shop)/cart')}
        >
          <FontAwesome name='shopping-cart' size={20} color='#2E8C83' />
          <Text style={styles.cartIconText}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddToCart}
        >
          <Text style={styles.addBtnText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyBtn}
          onPress={handleBuyNow}
        >
          <Text style={styles.buyBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProductSlug

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6fb',
  },

  // HERO
  heroWrapper: {
    width,
    height: width * 1.1,
    backgroundColor: '#000',
  },
  heroImage: {
    width,
    height: width * 1.1,
  },
  heroTopIcons: {
    position: 'absolute',
    top: 40,
    right: 16,
    flexDirection: 'row',
    gap: 10,
  },
  heroIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageDots: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeDot: {
    width: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  // CONTENT
  content: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 26,
    backgroundColor: '#ffffff',
    marginTop: 6,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#e0004d',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountTag: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#ffe5ec',
  },
  discountTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#e0004d',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 11,
    color: '#666',
  },

  benefitStrip: {
    borderRadius: 10,
    backgroundColor: '#f9fafc',
    padding: 10,
    borderWidth: 1,
    borderColor: '#eef0f5',
    marginBottom: 14,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  benefitText: {
    marginLeft: 6,
    fontSize: 11,
    color: '#555',
  },

  section: {
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0',
  },
  sectionLast: {
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  sectionSub: {
    fontSize: 11,
    color: '#777',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  colorChipSelected: {
    borderColor: '#111',
    backgroundColor: '#111',
  },
  colorChipText: {
    fontSize: 12,
    color: '#444',
  },
  colorChipTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },

  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#555',
    marginTop: 4,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  featureIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2E8C83',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#444',
    flex: 1,
  },

  moreInfoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  moreInfoText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#666',
  },

  // BOTTOM BAR
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
  },
  cartIconBtn: {
    alignItems: 'center',
    marginRight: 8,
  },
  cartIconText: {
    fontSize: 10,
    color: '#2E8C83',
    marginTop: 2,
  },
  addBtn: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2E8C83',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E8C83',
  },
  buyBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#2E8C83',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
})
