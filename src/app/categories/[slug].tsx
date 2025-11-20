// app/(shop)/categories/[slug].tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome, Ionicons } from '@expo/vector-icons'

import {
  useCategoryProducts,
  useCategoryBySlug,
} from '../../api/server/api'
import { useSortOptions } from '../../api/server/useSortOptions'

const { width } = Dimensions.get('window')
const NUM_COLUMNS = 2
const H_PADDING = 12
const GAP = 10
const ITEM_WIDTH =
  (width - H_PADDING * 2 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS

// round “Cropped / Long / Regular Fit …”
// Temporary mock images (replace with Supabase images later)
const SUB_FILTERS = [
  {
    id: 'cropped',
    label: 'Cropped',
    image: 'https://picsum.photos/seed/cropped/200/200',
  },
  {
    id: 'long',
    label: 'Long',
    image: 'https://picsum.photos/seed/long/200/200',
  },
  {
    id: 'regular',
    label: 'Regular Fit',
    image: 'https://picsum.photos/seed/regular/200/200',
  },
  {
    id: 'loose',
    label: 'Loose',
    image: 'https://picsum.photos/seed/loose/200/200',
  },
  {
    id: 'stretch',
    label: 'High Stretch',
    image: 'https://picsum.photos/seed/stretch/200/200',
  },
  {
    id: 'slim',
    label: 'Slim',
    image: 'https://picsum.photos/seed/slim/200/200',
  },
]

// small promo chips: Black Friday / QuickShip / …
const TAG_FILTERS = [
  'Black Friday',
  'QuickShip',
  'Tendenze',
  'New Items',
]

const CategorySlug = () => {
  const { slug } = useLocalSearchParams()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSort, setSelectedSort] = useState('featured')
  const [showSortModal, setShowSortModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeSubFilter, setActiveSubFilter] = useState<string>('')

  // Sort options from DB
  const {
    data: sortOptions = [],
    isLoading: sortLoading,
    error: sortError,
  } = useSortOptions()

  // Category by slug
  const {
    data: category,
    isLoading: categoryLoading,
    error: categoryError,
  } = useCategoryBySlug(slug as string)

  // Products for category
  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useCategoryProducts(category?.id ?? '')

  // Category name
  const categoryName =
    category?.name ||
    (typeof slug === 'string'
      ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
      : 'Category')

  // Search filter
  const filteredProducts = products.filter((product: any) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
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

    const price = item.price ?? item.currentPrice ?? 0
    const originalPrice =
      item.originalPrice ?? item.original_price ?? price
    const hasDiscount = originalPrice > price
    const discountAmount = hasDiscount
      ? (
          ((originalPrice - price) / originalPrice) *
          100
        ).toFixed(0)
      : '0'

    const ratingValue = item.rating ?? 4.5
    const reviewsCount = item.reviews ?? 0

    const imageUri =
      item.image ||
      item.image_url ||
      `https://picsum.photos/400?random=${item.id}`

    if (viewMode === 'list') {
      // LIST VIEW (still available from header grid icon)
      return (
        <TouchableOpacity
          style={styles.listProductCard}
          onPress={() => router.push(`/product/${item.id}`)}
          activeOpacity={0.92}
        >
          <View style={styles.listProductImage}>
            <Image
              source={{ uri: imageUri }}
              style={styles.listImage}
              resizeMode='cover'
            />
            {item.isNew && (
              <View style={styles.newBadgeList}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
          </View>

          <View style={styles.listProductInfo}>
            <View style={styles.listProductHeader}>
              <Text style={styles.listProductName} numberOfLines={2}>
                {item.name}
              </Text>
              <TouchableOpacity
                style={styles.favoriteCircle}
                onPress={() => toggleFavorite(item.id)}
              >
                <FontAwesome
                  name={isFavorite ? 'heart' : 'heart-o'}
                  size={16}
                  color={isFavorite ? '#ff3b3b' : '#999'}
                />
              </TouchableOpacity>
            </View>

            {!!item.brand && (
              <Text style={styles.brandText}>{item.brand}</Text>
            )}

            <View style={styles.listRatingContainer}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesome
                    key={star}
                    name={star <= Math.round(ratingValue) ? 'star' : 'star-o'}
                    size={12}
                    color='#FFD700'
                  />
                ))}
              </View>
              <Text style={styles.reviewCount}>
                {ratingValue.toFixed(1)} ({reviewsCount})
              </Text>
            </View>

            <View style={styles.listPriceContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.listPrice}>€{price.toFixed(2)}</Text>
                {hasDiscount && (
                  <Text style={styles.listOriginalPrice}>
                    €{originalPrice.toFixed(2)}
                  </Text>
                )}
              </View>
              {hasDiscount && (
                <View style={styles.discountBadgeList}>
                  <Text style={styles.discountText}>-{discountAmount}%</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      )
    }

    // GRID VIEW (Shein cards)
    return (
      <TouchableOpacity
        style={[styles.productCard, { width: ITEM_WIDTH }]}
        onPress={() => router.push(`/product/${item.id}`)}
        activeOpacity={0.96}
      >
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.productImage}
            resizeMode='cover'
          />

          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountAmount}%</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.favoriteCircle}
            onPress={() => toggleFavorite(item.id)}
          >
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={16}
              color={isFavorite ? '#ff3b3b' : '#fff'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.productInfo}>
          {!!item.brand && (
            <Text style={styles.brandText}>{item.brand}</Text>
          )}
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name={star <= Math.round(ratingValue) ? 'star' : 'star-o'}
                  size={10}
                  color='#FFD700'
                />
              ))}
            </View>
            <Text style={styles.reviewCount}>
              {ratingValue.toFixed(1)} ({reviewsCount})
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.price}>€{price.toFixed(2)}</Text>
              {hasDiscount && (
                <Text style={styles.originalPrice}>
                  €{originalPrice.toFixed(2)}
                </Text>
              )}
            </View>

            <TouchableOpacity style={styles.addToCartBtn}>
              <FontAwesome name='shopping-cart' size={14} color='#2E8C83' />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderSortModal = () => (
    <Modal
      animationType='slide'
      transparent
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
            sortOptions.map((option: any) => (
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
                  name={option.icon as any}
                  size={16}
                  color={
                    selectedSort === option.id ? '#2E8C83' : '#666'
                  }
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
            ))
          )}
        </View>
      </View>
    </Modal>
  )

  const isLoading = categoryLoading || productsLoading

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='dark' />

      {/* SHEIN-STYLE CATEGORY HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={22} color='#111' />
        </TouchableOpacity>

        {/* search bar with category name */}
        <View style={styles.headerSearchWrapper}>
          <FontAwesome name='search' size={14} color='#aaa' />
          <TextInput
            style={styles.headerSearchInput}
            placeholder={categoryName}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor='#aaa'
          />
          <TouchableOpacity>
            <Ionicons name='camera-outline' size={18} color='#666' />
          </TouchableOpacity>
        </View>

        {/* grid toggle icon */}
        <TouchableOpacity
          onPress={() =>
            setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'))
          }
        >
          <Ionicons
            name={viewMode === 'grid' ? 'grid-outline' : 'list-outline'}
            size={20}
            color='#111'
          />
        </TouchableOpacity>

        {/* favourites icon */}
        <TouchableOpacity>
          <FontAwesome name='heart-o' size={20} color='#111' />
        </TouchableOpacity>
      </View>

      {/* SUB-FILTER ROUND CHIPS (Cropped / Long / …) */}
      <View style={styles.subFiltersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: H_PADDING }}
        >
          {SUB_FILTERS.map((f) => {
            const active = activeSubFilter === f.id
            return (
              <TouchableOpacity
                key={f.id}
                style={[
                  styles.subFilterChip,
                  active && styles.subFilterChipActive,
                ]}
                onPress={() =>
                  setActiveSubFilter((prev) =>
                    prev === f.id ? '' : f.id
                  )
                }
                activeOpacity={0.8}
              >
                <View style={styles.subFilterCircle}>
                  <Image
                    source={{ uri: f.image }}
                    style={{ width: '100%', height: '100%', borderRadius: 29 }}
                    resizeMode='cover'
                  />
                </View>
                <Text
                  style={[
                    styles.subFilterLabel,
                    active && styles.subFilterLabelActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* SORT TABS (Recommend / Most Popular / Price / Filter) */}
      <View style={styles.sortTabsRow}>
        <TouchableOpacity
          style={styles.sortTab}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.sortTabActiveText}>Recommend</Text>
          <FontAwesome name='chevron-down' size={10} color='#111' />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortTab}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.sortTabText}>Most Popular</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortTab}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.sortTabText}>Price</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortTab, { justifyContent: 'flex-end' }]}
          onPress={() => console.log('Open filters')}
        >
          <Text style={styles.sortTabText}>Filter</Text>
          <Ionicons
            name='filter-outline'
            size={14}
            color='#555'
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>

      {/* PROMO TAG FILTERS (Black Friday / QuickShip / …) */}
      <View style={styles.tagFiltersRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: H_PADDING }}
        >
          {TAG_FILTERS.map((t) => (
            <TouchableOpacity key={t} style={styles.tagChip}>
              <Text style={styles.tagChipText}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* MAIN CONTENT */}
      {isLoading ? (
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
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => String(item.id)}
            numColumns={viewMode === 'grid' ? NUM_COLUMNS : 1}
            key={viewMode}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            columnWrapperStyle={
              viewMode === 'grid'
                ? { justifyContent: 'space-between', marginBottom: 12 }
                : undefined
            }
          />

          {renderSortModal()}
        </>
      )}
    </SafeAreaView>
  )
}

export default CategorySlug

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6fb',
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  headerSearchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f3f6',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  headerSearchInput: {
    flex: 1,
    marginHorizontal: 6,
    fontSize: 14,
    color: '#111',
  },

  // SUB FILTER ROUND CHIPS
  subFiltersWrapper: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ececf2',
  },
  subFilterChip: {
    alignItems: 'center',
    marginRight: 14,
  },
  subFilterChipActive: {},
  subFilterCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#f3f3f3',
    marginBottom: 4,
  },
  subFilterLabel: {
    fontSize: 11,
    color: '#444',
  },
  subFilterLabelActive: {
    fontWeight: '700',
  },

  // SORT TABS ROW
  sortTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ececf2',
  },
  sortTab: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  sortTabActiveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginRight: 4,
  },
  sortTabText: {
    fontSize: 14,
    color: '#555',
  },

  // TAG FILTERS
  tagFiltersRow: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ececf2',
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f3f3f6',
    marginRight: 8,
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  // PRODUCTS
  productsList: {
    paddingHorizontal: H_PADDING,
    paddingTop: 10,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    height: 190,
    backgroundColor: '#f8f8f8',
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
    backgroundColor: '#000000b3',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  favoriteCircle: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  brandText: {
    fontSize: 10,
    color: '#999',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 10,
    color: '#777',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e0004d',
  },
  originalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  addToCartBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // LIST VIEW
  listProductCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  listProductImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  newBadgeList: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  listProductInfo: {
    flex: 1,
  },
  listProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  listProductName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  listRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  listPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e0004d',
  },
  listOriginalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  discountBadgeList: {
    backgroundColor: '#000000b3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedSortOption: {
    backgroundColor: '#f0f8f7',
  },
  sortOptionText: {
    flex: 1,
    fontSize: 15,
    color: '#666',
    marginLeft: 10,
  },
  selectedSortText: {
    color: '#2E8C83',
    fontWeight: '600',
  },

  // STATES
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
})
