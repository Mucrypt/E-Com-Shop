import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
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
  { id: '4', name: 'Sports', icon: 'futbol-o', color: '#96CEB4' },
  { id: '5', name: 'Books', icon: 'book', color: '#FFEAA7' },
  { id: '6', name: 'Beauty', icon: 'star', color: '#DDA0DD' },
]

const featuredProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.5,
    reviews: 128,
    discount: 20,
    isNew: false,
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 89,
    discount: 25,
    isNew: true,
  },
  {
    id: '3',
    name: 'Gaming Mouse',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.3,
    reviews: 156,
    discount: 20,
    isNew: false,
  },
  {
    id: '4',
    name: 'USB-C Hub',
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.6,
    reviews: 67,
    discount: 25,
    isNew: true,
  },
]

const Home = () => {
  const [currentBanner, setCurrentBanner] = useState(0)
  const cartCount = useCartStore((state) => state.getCartCount())
  const addToCart = useCartStore((state) => state.addToCart)
  const { showProductAddedToCart } = useAppToast()

  // Auth state management
  const { user, isAuthenticated, getGreeting, getUserInitials } = useAuth()

  const renderBanner = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        style={[styles.bannerItem, { backgroundColor: item.backgroundColor }]}
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
          <TouchableOpacity style={styles.shopNowButton}>
            <Text style={styles.shopNowText}>Shop Now</Text>
            <FontAwesome name='arrow-right' size={14} color='#333' />
          </TouchableOpacity>
        </View>
        <View style={styles.bannerIcon}>
          <FontAwesome name='shopping-bag' size={60} color={item.textColor} />
        </View>
      </View>
    )
  }

  const renderCategory = ({ item }: { item: any }) => {
    return (
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
  }

  const renderProduct = ({ item }: { item: any }) => {
    const handleAddToCart = () => {
      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        color: 'Default',
        size: 'Default',
        image: 'default',
        inStock: true,
        category: 'Electronics',
        rating: item.rating,
        estimatedDelivery: '2-3 days',
      }
      addToCart(cartItem, 1)

      // Show beautiful toast notification
      showProductAddedToCart(item.name, item.price, 1)
    }

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        {item.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}% OFF</Text>
        </View>

        <View style={styles.productImage}>
          <FontAwesome name='image' size={60} color='#ccc' />
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name={star <= Math.floor(item.rating) ? 'star' : 'star-o'}
                  size={12}
                  color='#FFD700'
                />
              ))}
            </View>
            <Text style={styles.reviewCount}>({item.reviews})</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          </View>

          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={handleAddToCart}
          >
            <FontAwesome name='plus' size={12} color='#2E8C83' />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

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

      {/* Banner Carousel */}
      <View style={styles.bannerContainer}>
        <FlatList
          data={bannerData}
          renderItem={renderBanner}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width)
            setCurrentBanner(index)
          }}
        />
        <View style={styles.bannerDots}>
          {bannerData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentBanner === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push('/categories')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => router.push('/(shop)/shop')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => router.push('/(shop)/orders')}
          >
            <FontAwesome name='truck' size={24} color='#2E8C83' />
            <Text style={styles.quickActionText}>Track Order</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => router.push('/(shop)/cart')}
          >
            <FontAwesome name='shopping-cart' size={24} color='#2E8C83' />
            <Text style={styles.quickActionText}>View Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => router.push('/(shop)/profile')}
          >
            <FontAwesome name='heart' size={24} color='#2E8C83' />
            <Text style={styles.quickActionText}>Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => router.push('/(shop)/profile')}
          >
            <FontAwesome name='headphones' size={24} color='#2E8C83' />
            <Text style={styles.quickActionText}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#999',
  },
  bannerContainer: {
    marginBottom: 25,
  },
  bannerItem: {
    width: width - 40,
    height: 160,
    marginHorizontal: 20,
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
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bannerDescription: {
    fontSize: 14,
    marginBottom: 15,
    opacity: 0.9,
  },
  shopNowButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  shopNowText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  bannerIcon: {
    opacity: 0.3,
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#2E8C83',
    width: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1317ff',
  },
  seeAll: {
    fontSize: 14,
    color: '#2E8C83',
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 70,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  productsList: {
    paddingHorizontal: 15,
  },
  productCard: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4444',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productImage: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8C83',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  addToCartBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
})

export default Home
