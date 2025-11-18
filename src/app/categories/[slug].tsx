import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'

const { width } = Dimensions.get('window')
const numColumns = 2
const itemWidth = (width - 60) / numColumns

import { useCategoryProducts, useCategoryBySlug } from '../../api/server/api'
import { useSortOptions } from '../../api/server/useSortOptions'

const CategorySlug = () => {
  const { slug } = useLocalSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSort, setSelectedSort] = useState('featured')
  const [showSortModal, setShowSortModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<string[]>([])

  // Fetch sort options from database
  const {
    data: sortOptions = [],
    isLoading: sortLoading,
    error: sortError,
  } = useSortOptions()

  // Fetch category by slug
  const {
    data: category,
    isLoading: categoryLoading,
    error: categoryError,
  } = useCategoryBySlug(slug as string)

  // Fetch products by category ID
  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useCategoryProducts(category?.id ?? '')

  // Format the category name from slug or category
  const categoryName =
    category?.name ||
    (typeof slug === 'string'
      ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
      : 'Category')

  // Filter products by search query
  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const renderProduct = ({ item }: { item: any }) => {
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

            <Text style={styles.brandText}>{item.brand}</Text>

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
              <Text style={styles.listPrice}>${item.price.toFixed(2)}</Text>
              {item.originalPrice > item.price && (
                <Text style={styles.listOriginalPrice}>
                  ${item.originalPrice.toFixed(2)}
                </Text>
              )}
              {item.originalPrice > item.price && (
                <View style={styles.discountBadgeList}>
                  <Text style={styles.discountText}>-{discountAmount}%</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      )
    }

    // Grid view
    return (
      <TouchableOpacity
        style={[styles.productCard, { width: itemWidth }]}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <View style={styles.productImageContainer}>
          <View style={styles.productImage}>
            <FontAwesome name='image' size={40} color='#ccc' />
            {item.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
            {item.originalPrice > item.price && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discountAmount}%</Text>
              </View>
            )}
            {!item.inStock && (
              <View style={styles.outOfStockOverlay}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
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
          </View>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.brandText}>{item.brand}</Text>
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
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            {item.originalPrice > item.price && (
              <Text style={styles.originalPrice}>
                ${item.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.addToCartBtn, !item.inStock && styles.disabledBtn]}
            disabled={!item.inStock}
          >
            <FontAwesome
              name='shopping-cart'
              size={16}
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

          {sortLoading ? (
            <ActivityIndicator
              size='small'
              color='#2E8C83'
              style={styles.loadingIndicator}
            />
          ) : sortError ? (
            <Text style={styles.errorText}>Error loading sort options</Text>
          ) : (
            sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortOption,
                  selectedSort === option.id ? styles.selectedSortOption : null,
                ]}
                onPress={() => {
                  setSelectedSort(option.id)
                  setShowSortModal(false)
                }}
              >
                <FontAwesome
                  name={option.icon as any}
                  size={16}
                  color={selectedSort === option.id ? '#2E8C83' : '#666'}
                />
                <Text
                  style={[
                    styles.sortOptionText,
                    selectedSort === option.id ? styles.selectedSortText : null,
                  ]}
                >
                  {option.name}
                </Text>
                {selectedSort === option.id && (
                  <FontAwesome name='check' size={16} color='#2E8C83' />
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </Modal>
  )

  // ADD THE RETURN STATEMENT HERE
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{categoryName}</Text>
        <Text style={styles.subtitle}>
          {filteredProducts.length} products found
        </Text>
      </View>

      {/* Loading/Error States */}
      {categoryLoading || productsLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size='large' color='#2E8C83' />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : categoryError ? (
        <View style={styles.centerContainer}>
          <FontAwesome name='exclamation-triangle' size={40} color='red' />
          <Text style={styles.errorText}>Error loading category</Text>
        </View>
      ) : productsError ? (
        <View style={styles.centerContainer}>
          <FontAwesome name='exclamation-triangle' size={40} color='red' />
          <Text style={styles.errorText}>Error loading products</Text>
        </View>
      ) : (
        <>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <FontAwesome name='search' size={16} color='#999' />
              <TextInput
                style={styles.searchInput}
                placeholder={`Search in ${categoryName}...`}
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

          {/* Controls */}
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
                  viewMode === 'grid' ? styles.activeViewButton : null,
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
                  viewMode === 'list' ? styles.activeViewButton : null,
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
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? numColumns : 1}
            key={viewMode}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.productsList,
              viewMode === 'list' ? styles.listView : null,
            ]}
            columnWrapperStyle={
              viewMode === 'grid' ? styles.productRow : undefined
            }
          />
          {renderSortModal()}
        </>
      )}
      <StatusBar style='auto' />
    </SafeAreaView>
  )
}

// Your styles remain the same...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1317ff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#2E8C83',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 2,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  activeViewButton: {
    backgroundColor: '#2E8C83',
  },
  productsList: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  listView: {
    paddingHorizontal: 20,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
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
    height: 140,
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
    padding: 12,
  },
  brandText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
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
    fontSize: 11,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    color: 'red',
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
})

export default CategorySlug
