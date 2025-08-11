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
} from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Header } from '../../components'

const { width } = Dimensions.get('window')
const numColumns = 2
const itemWidth = (width - 60) / numColumns

// Mock data
const categories = [
  { id: 'all', name: 'All', count: 156 },
  { id: 'electronics', name: 'Electronics', count: 45 },
  { id: 'fashion', name: 'Fashion', count: 67 },
  { id: 'home', name: 'Home & Garden', count: 23 },
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
  },
  {
    id: '2',
    name: 'Smart Fitness Watch Series 7',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.9,
    reviews: 189,
    discount: 25,
    isNew: true,
    isFavorite: true,
    category: 'electronics',
    inStock: true,
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
  },
  {
    id: '4',
    name: 'Ultra HD 4K Webcam',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.6,
    reviews: 143,
    discount: 31,
    isNew: false,
    isFavorite: true,
    category: 'electronics',
    inStock: false,
  },
  {
    id: '5',
    name: 'Designer Cotton T-Shirt',
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.4,
    reviews: 89,
    discount: 25,
    isNew: true,
    isFavorite: false,
    category: 'fashion',
    inStock: true,
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
  },
  {
    id: '8',
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
  },
]

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSort, setSelectedSort] = useState('popular')
  const [showSortModal, setShowSortModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<string[]>(
    products.filter((p) => p.isFavorite).map((p) => p.id)
  )

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const renderCategoryItem = ({ item }: { item: any }) => {
    const isSelected = selectedCategory === item.id
    return (
      <TouchableOpacity
        style={[styles.categoryChip, isSelected && styles.selectedCategory]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.selectedCategoryText,
          ]}
        >
          {item.name}
        </Text>
        <View
          style={[
            styles.categoryCount,
            isSelected && styles.selectedCategoryCount,
          ]}
        >
          <Text
            style={[styles.countText, isSelected && styles.selectedCountText]}
          >
            {item.count}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderProductCard = ({ item }: { item: any }) => {
    const isFavorite = favorites.includes(item.id)
    const discountAmount = (
      ((item.originalPrice - item.price) / item.originalPrice) *
      100
    ).toFixed(0)

    if (viewMode === 'list') {
      return (
        <TouchableOpacity
          style={styles.listProductCard}
          onPress={() => router.push(`/product/${item.id}`)}
        >
          <View style={styles.listProductImage}>
            <FontAwesome name='image' size={40} color='#ccc' />
            {item.isNew && (
              <View style={styles.newBadgeList}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
            {!item.inStock && (
              <View style={styles.outOfStockOverlay}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
          </View>

          <View style={styles.listProductInfo}>
            <View style={styles.listProductHeader}>
              <Text style={styles.listProductName} numberOfLines={2}>
                {item.name}
              </Text>
              <TouchableOpacity
                style={styles.favoriteBtn}
                onPress={() => toggleFavorite(item.id)}
              >
                <FontAwesome
                  name={isFavorite ? 'heart' : 'heart-o'}
                  size={18}
                  color={isFavorite ? '#ff4444' : '#999'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.listRatingContainer}>
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
              <Text style={styles.reviewCount}>
                {item.rating} ({item.reviews})
              </Text>
            </View>

            <View style={styles.listPriceContainer}>
              <View>
                <Text style={styles.listPrice}>${item.price}</Text>
                <Text style={styles.listOriginalPrice}>
                  ${item.originalPrice}
                </Text>
              </View>
              <View style={styles.discountBadgeList}>
                <Text style={styles.discountText}>{discountAmount}% OFF</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity
        style={[styles.productCard, { width: itemWidth }]}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <View style={styles.productImageContainer}>
          <View style={styles.productImage}>
            <FontAwesome name='image' size={50} color='#ccc' />
          </View>

          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}

          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountAmount}% OFF</Text>
          </View>

          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(item.id)}
          >
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={16}
              color={isFavorite ? '#ff4444' : '#999'}
            />
          </TouchableOpacity>

          {!item.inStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
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
                  size={10}
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
            style={[styles.addToCartBtn, !item.inStock && styles.disabledBtn]}
            disabled={!item.inStock}
          >
            <FontAwesome
              name={item.inStock ? 'plus' : 'ban'}
              size={12}
              color={item.inStock ? '#2E8C83' : '#999'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  const renderSortModal = () => (
    <Modal
      animationType='slide'
      transparent={true}
      visible={showSortModal}
      onRequestClose={() => setShowSortModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort by</Text>
            <TouchableOpacity onPress={() => setShowSortModal(false)}>
              <FontAwesome name='times' size={20} color='#666' />
            </TouchableOpacity>
          </View>

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
                <FontAwesome name='check' size={16} color='#2E8C83' />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title='Shop'
        showProfile={false}
        onNotificationPress={() => console.log('Shop notifications')}
      />

      {/* Search Bar Section */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <FontAwesome name='search' size={16} color='#999' />
          <TextInput
            style={styles.searchInput}
            placeholder='Search products...'
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor='#999'
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <FontAwesome name='times-circle' size={16} color='#999' />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Filter and View Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <FontAwesome name='sort' size={16} color='#2E8C83' />
          <Text style={styles.sortButtonText}>Sort</Text>
        </TouchableOpacity>

        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'grid' && styles.activeViewButton,
            ]}
            onPress={() => setViewMode('grid')}
          >
            <FontAwesome
              name='th'
              size={16}
              color={viewMode === 'grid' ? '#2E8C83' : '#666'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'list' && styles.activeViewButton,
            ]}
            onPress={() => setViewMode('list')}
          >
            <FontAwesome
              name='list'
              size={16}
              color={viewMode === 'list' ? '#2E8C83' : '#666'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Products */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? numColumns : 1}
        key={viewMode} // Force re-render when view mode changes
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.productsList,
          viewMode === 'list' && styles.listView,
        ]}
        columnWrapperStyle={viewMode === 'grid' ? styles.productRow : undefined}
      />

      {renderSortModal()}
      <StatusBar style='auto' />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e9ea',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  categoriesSection: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e8e9ea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCategory: {
    backgroundColor: '#2E8C83',
    borderColor: '#2E8C83',
    shadowColor: '#2E8C83',
    shadowOpacity: 0.15,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    marginRight: 5,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  categoryCount: {
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  selectedCategoryCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  countText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
  },
  selectedCountText: {
    color: '#fff',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8e9ea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sortButtonText: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: '500',
    color: '#2E8C83',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: '#e8e9ea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  activeViewButton: {
    backgroundColor: '#2E8C83',
    shadowColor: '#2E8C83',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  productsList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  listView: {
    paddingHorizontal: 16,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    height: 120,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4444',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  favoriteBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    lineHeight: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  reviewCount: {
    fontSize: 11,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
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
    bottom: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#e0e0e0',
  },
  // List View Styles
  listProductCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listProductImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  newBadgeList: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listProductInfo: {
    flex: 1,
    marginLeft: 12,
  },
  listProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  listProductName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 20,
    marginRight: 8,
  },
  listRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8C83',
  },
  listOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountBadgeList: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
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
})

export default Shop
