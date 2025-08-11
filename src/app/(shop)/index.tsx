import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Alert,
} from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCartStore } from '../../store'
import { useAppToast, Header } from '../../components'
import { useAuth } from '../../providers'

const { width } = Dimensions.get('window')

// Mock data
const bannerData = [
  {
    id: '1',
    title: 'Summer Sale',
    subtitle: 'Up to 50% Off',
    description: 'Shop the latest trends',
    backgroundColor: '#FF6B6B',
    textColor: '#fff',
  },
  {
    id: '2',
    title: 'New Arrivals',
    subtitle: 'Fresh Collection',
    description: 'Discover new products',
    backgroundColor: '#4ECDC4',
    textColor: '#fff',
  },
  {
    id: '3',
    title: 'Tech Deals',
    subtitle: 'Latest Gadgets',
    description: 'Starting from $99',
    backgroundColor: '#45B7D1',
    textColor: '#fff',
  },
]

const categories = [
  { id: '1', name: 'Electronics', icon: 'laptop', color: '#FF6B6B' },
  { id: '2', name: 'Fashion', icon: 'shopping-bag', color: '#4ECDC4' },
  { id: '3', name: 'Home', icon: 'home', color: '#45B7D1' },
  { id: '4', name: 'Sports', icon: 'futbol-o', color: '#FFA726' },
  { id: '5', name: 'Books', icon: 'book', color: '#AB47BC' },
  { id: '6', name: 'Toys', icon: 'gamepad', color: '#26A69A' },
]

const featuredProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 129.99,
    originalPrice: 199.99,
    discount: 35,
    image: 'https://via.placeholder.com/200x200/FF6B6B/fff?text=Headphones',
    rating: 4.5,
    reviews: 234,
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    image: 'https://via.placeholder.com/200x200/4ECDC4/fff?text=Watch',
    rating: 4.8,
    reviews: 156,
  },
  {
    id: '3',
    name: 'Laptop Backpack',
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    image: 'https://via.placeholder.com/200x200/45B7D1/fff?text=Backpack',
    rating: 4.3,
    reviews: 89,
  },
]

const Home = () => {
  const [currentBanner, setCurrentBanner] = useState(0)
  const { addToCart } = useCartStore()
  const {
    showProductAddedToCart,
    showLoadingToast,
    hideLoadingToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
  } = useAppToast()
  const { user } = useAuth()

  // Demo function to showcase world-class animations
  const demoAnimations = () => {
    // Sequence of demo animations
    const demoSequence = [
      {
        delay: 0,
        action: () => showLoadingToast('Processing payment...'),
        name: 'Loading Animation',
      },
      {
        delay: 2000,
        action: () => {
          hideLoadingToast()
          showSuccessToast('Payment Success!', 'Your order has been processed')
        },
        name: 'Success Toast',
      },
      {
        delay: 6000,
        action: () =>
          showErrorToast({
            title: 'Network Error',
            message: 'Connection timeout. Please try again.',
          }),
        name: 'Error Toast',
      },
      {
        delay: 10000,
        action: () =>
          showInfoToast({
            title: 'New Update Available',
            message: 'Version 2.0 is ready to download',
            icon: 'download',
          }),
        name: 'Info Toast',
      },
      {
        delay: 14000,
        action: () =>
          showProductAddedToCart(
            'Demo Product',
            99.99,
            2,
            'https://via.placeholder.com/200x200/4ECDC4/fff?text=Demo'
          ),
        name: 'Cart Toast',
      },
    ]

    // Execute demo sequence
    demoSequence.forEach(({ delay, action, name }) => {
      setTimeout(() => {
        console.log(`🎭 Demo: ${name}`)
        action()
      }, delay)
    })
  }

  const handleAddToCart = (product: any) => {
    try {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          color: 'Default',
          size: 'Default',
          image: product.image,
          inStock: true,
          category: 'Featured',
          rating: product.rating || 4.0,
          estimatedDelivery: '2-3 days',
        },
        1
      )

      // Enhanced toast with loading animation
      showProductAddedToCart(product.name, product.price, 1, product.image)
    } catch (error) {
      console.error('Add to cart error:', error)
      Alert.alert('Error', 'Failed to add item to cart. Please try again.', [
        { text: 'OK', style: 'default' },
      ])
    }
  }

  const renderBanner = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.bannerItem, { backgroundColor: item.backgroundColor }]}
      onPress={() => router.push('/(shop)/shop')}
    >
      <View style={styles.bannerContent}>
        <Text style={[styles.bannerTitle, { color: item.textColor }]}>
          {item.title}
        </Text>
        <Text style={[styles.bannerSubtitle, { color: item.textColor }]}>
          {item.subtitle}
        </Text>
        <Text style={[styles.bannerDescription, { color: item.textColor }]}>
          {item.description}
        </Text>
        <TouchableOpacity
          style={styles.bannerButton}
          onPress={() => router.push('/(shop)/shop')}
        >
          <Text style={styles.bannerButtonText}>Shop Now</Text>
          <FontAwesome name='arrow-right' size={14} color='#333' />
        </TouchableOpacity>
      </View>
      <View style={styles.bannerImageContainer}>
        <FontAwesome
          name='shopping-bag'
          size={60}
          color='rgba(255,255,255,0.3)'
        />
      </View>
    </TouchableOpacity>
  )

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => router.push(`/categories/${item.name.toLowerCase()}`)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <FontAwesome name={item.icon} size={24} color='#fff' />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  )

  const renderFeaturedProduct = ({ item }: any) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        )}
        <TouchableOpacity style={styles.wishlistButton}>
          <FontAwesome name='heart-o' size={18} color='#666' />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingContainer}>
          <FontAwesome name='star' size={12} color='#FFD700' />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>({item.reviews})</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <FontAwesome name='shopping-cart' size={14} color='#fff' />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Header />

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => router.push('/(shop)/shop')}
      >
        <FontAwesome name='search' size={16} color='#999' />
        <Text style={styles.searchPlaceholder}>Search products...</Text>
        <FontAwesome name='sliders' size={16} color='#999' />
      </TouchableOpacity>

      {/* Welcome Message */}
      {user && (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Welcome back, {user.email?.split('@')[0] || 'User'}! 👋
          </Text>
        </View>
      )}

      {/* Banner Carousel */}
      <View style={styles.sectionContainer}>
        <FlatList
          data={bannerData}
          renderItem={renderBanner}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / (width - 40)
            )
            setCurrentBanner(newIndex)
          }}
          contentContainerStyle={styles.bannerContainer}
        />

        {/* Banner Indicators */}
        <View style={styles.indicatorContainer}>
          {bannerData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentBanner === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <TouchableOpacity onPress={() => router.push('/categories')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      {/* Featured Products */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => router.push('/(shop)/shop')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredProducts}
          renderItem={renderFeaturedProduct}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
        />
      </View>

      {/* Special Offers */}
      <View style={styles.specialOfferContainer}>
        <View style={styles.specialOfferContent}>
          <FontAwesome name='gift' size={40} color='#FF6B6B' />
          <View style={styles.specialOfferText}>
            <Text style={styles.specialOfferTitle}>Special Offer!</Text>
            <Text style={styles.specialOfferSubtitle}>
              Get 20% off on your first order
            </Text>
          </View>
          <TouchableOpacity
            style={styles.specialOfferButton}
            onPress={() => router.push('/(shop)/shop')}
          >
            <Text style={styles.specialOfferButtonText}>Claim Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Demo Button for Animation Showcase */}
      <TouchableOpacity
        style={styles.floatingDemoButton}
        onPress={demoAnimations}
      >
        <FontAwesome name='magic' size={20} color='#fff' />
        <Text style={styles.demoButtonText}>Demo</Text>
      </TouchableOpacity>

      <StatusBar style='auto' />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#999',
  },
  welcomeContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 16,
    color: '#2E8C83',
    fontWeight: '600',
  },
  bannerContainer: {
    paddingHorizontal: 20,
  },
  bannerItem: {
    width: width - 40,
    height: 150,
    marginRight: 15,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bannerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  bannerDescription: {
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 15,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 5,
  },
  bannerImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#2E8C83',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  productsContainer: {
    paddingHorizontal: 20,
  },
  productCard: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8C83',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E8C83',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addToCartText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 5,
  },
  specialOfferContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  specialOfferContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialOfferText: {
    flex: 1,
    marginLeft: 15,
  },
  specialOfferTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  specialOfferSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  specialOfferButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  specialOfferButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  floatingDemoButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  demoButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
})

export default Home
