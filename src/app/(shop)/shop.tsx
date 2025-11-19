import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
  Modal,
  Image,
} from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Header } from '../../components'

const { width } = Dimensions.get('window')
const numColumns = 2
const horizontalPadding = 16
const itemGap = 10
const itemWidth =
  (width - horizontalPadding * 2 - itemGap * (numColumns - 1)) / numColumns

// Categories row (top tabs)
const categories = [
  { id: 'all', name: 'All', count: 156 },
  { id: 'electronics', name: 'Electronics', count: 45 },
  { id: 'fashion', name: 'Fashion', count: 67 },
  { id: 'home', name: 'Home & Living', count: 23 },
  { id: 'sports', name: 'Sports', count: 21 },
]

const sortOptions = [
  { id: 'popular', name: 'Most Popular', icon: 'fire' as const },
  { id: 'newest', name: 'Newest First', icon: 'clock-o' as const },
  {
    id: 'price-low',
    name: 'Price: Low to High',
    icon: 'sort-amount-asc' as const,
  },
  {
    id: 'price-high',
    name: 'Price: High to Low',
    icon: 'sort-amount-desc' as const,
  },
  { id: 'rating', name: 'Highest Rated', icon: 'star' as const },
]

// Product data with curated images (option D: per category)
const products = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones Pro',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviews: 324,
    discount: 20,
    isNew: false,
    isFavorite: false,
    category: 'electronics',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1518444021430-6433e83b145e?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: '2',
    name: '4K Ultra HD Smart TV 50”',
    price: 499.99,
    originalPrice: 699.99,
    rating: 4.6,
    reviews: 182,
    discount: 29,
    isNew: true,
    isFavorite: true,
    category: 'electronics',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: '3',
    name: 'Premium Gaming Mechanical Keyboard',
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 567,
    discount: 25,
    isNew: false,
    isFavorite: false,
    category: 'electronics',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: '4',
    name: 'Ultra HD 4K Monitor 27”',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.5,
    reviews: 214,
    discount: 25,
    isNew: true,
    isFavorite: false,
    category: 'electronics',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: '5',
    name: 'Minimalist Cotton Hoodie',
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.7,
    reviews: 256,
    discount: 33,
    isNew: true,
    isFavorite: false,
    category: 'fashion',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: '6',
    name: 'Luxury Leather Handbag',
    price: 159.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviews: 76,
    discount: 20,
    isNew: false,
    isFavorite: false,
    category: 'fashion',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: '7',
    name: 'Smart Home Security Camera',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.5,
    reviews: 234,
    discount: 20,
    isNew: false,
    isFavorite: true,
    category: 'home',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1517502884422-3c57a1a30701?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: '8',
    name: 'Premium Memory Foam Mattress Topper',
    price: 129.99,
    originalPrice: 169.99,
    rating: 4.6,
    reviews: 109,
    discount: 23,
    isNew: true,
    isFavorite: false,
    category: 'home',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: '9',
    name: 'High-Performance Running Shoes',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.9,
    reviews: 654,
    discount: 31,
    isNew: true,
    isFavorite: true,
    category: 'sports',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: '10',
    name: 'Adjustable Dumbbell Set',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviews: 143,
    discount: 20,
    isNew: false,
    isFavorite: false,
    category: 'sports',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: '11',
    name: 'Nordic Floor Lamp',
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.4,
    reviews: 89,
    discount: 25,
    isNew: true,
    isFavorite: false,
    category: 'home',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: '12',
    name: 'Professional Yoga Mat',
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.7,
    reviews: 156,
    discount: 29,
    isNew: true,
    isFavorite: false,
    category: 'sports',
    inStock: true,
    image: 'https://picsum.photos/400?random=12',
  },
]

const Shop = () => {
  // Cart logic (keep your existing store + toast)
  const { addToCart } = require('../../store/cartStore').useCartStore()
  const { toast } = require('../../components/toast').useAppToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSort, setSelectedSort] = useState('popular')
  const [showSortModal, setShowSortModal] = useState(false)
  const [favorites, setFavorites] = useState(
    products.filter((p) => p.isFavorite).map((p) => p.id)
  )

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'newest':
          return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'popular':
        default:
          return b.reviews - a.reviews
      }
    })

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const renderProductCard = ({ item }: { item: any }) => {
    const handleAddToShippingBag = () => {
      if (!item.inStock) return
      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        color: 'Default',
        size: 'Default',
        image: item.image,
        inStock: item.inStock,
        category: item.category,
        rating: item.rating,
        estimatedDelivery: '2-3 days',
      }
      addToCart(cartItem, 1)
      toast.show(`${item.name} added to shipping bag!`, {
        type: 'success',
      })
    }

    const isFavorite = favorites.includes(item.id)
    const discountAmount = (
      ((item.originalPrice - item.price) / item.originalPrice) *
      100
    ).toFixed(0)

    return (
      <TouchableOpacity
        activeOpacity={0.95}
        style={[styles.productCard, { width: itemWidth }]}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <View style={styles.productImageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountAmount}% OFF</Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={16}
              color={isFavorite ? '#ff3b3b' : '#fff'}
            />
          </TouchableOpacity>
          {!item.inStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Sold out</Text>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>€{item.price.toFixed(2)}</Text>
            <Text style={styles.originalPrice}>
              €
              {item.originalPrice.toFixed(2)}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name='star'
                  size={10}
                  color={star <= Math.round(item.rating) ? '#FFD700' : '#ddd'}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {item.rating.toFixed(1)} · {item.reviews}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style='dark' />
      

      {/* Search + sort */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrapper}>
          <FontAwesome name='search' size={16} color='#888' />
          <TextInput
            style={styles.searchInput}
            placeholder='Search in Mukulah Shop'
            placeholderTextColor='#aaa'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <FontAwesome name='sliders' size={16} color='#222' />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoryRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
        >
          {categories.map((category) => {
            const selected = selectedCategory === category.id
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selected && styles.categoryChipSelected,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selected && styles.categoryChipTextSelected,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* Product grid – 2 columns like Shein */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.productsList}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
        renderItem={renderProductCard}
        showsVerticalScrollIndicator={false}
      />

      {/* Sort modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType='slide'
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort by</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortOption,
                  selectedSort === option.id && styles.selectedSortOption,
                ]}
                onPress={() => {
                  setSelectedSort(option.id)
                  setShowSortModal(false)
                }}
              >
                <FontAwesome
                  name={option.icon}
                  size={16}
                  color={selectedSort === option.id ? '#2E8C83' : '#666'}
                />
                <Text
                  style={[
                    styles.sortOptionText,
                    selectedSort === option.id && styles.selectedSortText,
                  ]}
                >
                  {option.name}
                </Text>
                {selectedSort === option.id && (
                  <FontAwesome
                    name='check'
                    size={16}
                    color='#2E8C83'
                    style={{ marginLeft: 'auto' }}
                  />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6fb',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalPadding,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#fff0f4', // soft pink like Shein header
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f5c2d7',
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 14,
    color: '#111',
    flex: 1,
  },
  sortButton: {
    marginLeft: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f5c2d7',
  },
  categoryRow: {
    paddingVertical: 10,
    backgroundColor: '#ffe3ec',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ffc2d1',
    marginRight: 8,
    backgroundColor: '#fff5f7',
  },
  categoryChipSelected: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#444',
  },
  categoryChipTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  productsList: {
    paddingHorizontal: horizontalPadding,
    paddingTop: 12,
    paddingBottom: 40,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
    backgroundColor: '#f8f8f8',
  },
  productImage: {
    width: '100%',
    height: 140,
  },
  newBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#ff7f50',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#000000b3',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  productInfo: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  productName: {
    fontSize: 12,
    color: '#111',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e0004d',
    marginRight: 4,
  },
  originalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stars: {
    flexDirection: 'row',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 10,
    color: '#777',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedSortOption: {
    backgroundColor: '#f0f8f7',
  },
  sortOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  selectedSortText: {
    color: '#2E8C83',
    fontWeight: '600',
  },
  closeModalBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#111',
  },
  closeModalText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})

export default Shop
