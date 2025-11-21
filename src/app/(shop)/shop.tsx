// app/(shop)/shop.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'

import {
  useCategories,
  useSaleProducts,
  useFeaturedProducts,
  useProducts,
} from '../../api/server/api'
import { Header } from '../../components'
import FloatingSearchBar from '../../components/layout/FloatingSearchBar'
import { visualSearchPipeline } from '../../services/imageSearchService'
import type { VisualSearchPipelineResult } from '../../types/image-search'



const { width } = Dimensions.get('window')

// Small helpers
const formatPrice = (value: number | null | undefined) => {
  if (value == null) return ''
  return `€${value.toFixed(2)}`
}

const getImage = (item: any, fallbackIndex: number) =>
  item.image ||
  item.image_url ||
  item.thumbnail ||
  `https://picsum.photos/seed/shop_${fallbackIndex}/600/800`

const ShopScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [loadingImageSearch, setLoadingImageSearch] = useState(false)
  const [visualSearchResult, setVisualSearchResult] = useState<VisualSearchPipelineResult | null>(null)

  // Dynamic data
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useCategories()

  const {
    data: saleProducts = [],
    isLoading: saleLoading,
  } = useSaleProducts(6)

  const {
    data: featuredProducts = [],
    isLoading: featuredLoading,
  } = useFeaturedProducts(8)

  const {
    data: allProducts = [],
    isLoading: allLoading,
  } = useProducts({ limit: 20 })

  const [topTab, setTopTab] = useState<'all' | 'fast' | 'women' | 'men'>(
    'all'
  )

  const isLoading =
    categoriesLoading || saleLoading || featuredLoading || allLoading

  // Filtered grid section (simple for now)
  const gridProducts = allProducts

  async function handleImageSearch() {
    if (loadingImageSearch) return
    setLoadingImageSearch(true)
    try {
      const result = await visualSearchPipeline()
      setVisualSearchResult(result)
      if (result?.classification?.topLabel?.label) {
        setSearchText(result.classification.topLabel.label)
      }
    } catch (e) {
      console.warn('Visual search failed', e)
    } finally {
      setLoadingImageSearch(false)
    }
  }

  function clearVisualSearch() {
    setVisualSearchResult(null)
  }

  return (
    <View style={styles.screen}>
      <StatusBar style='dark' />
      {/* Global Shein-style header with sidebar/search/cart */}
      <FloatingSearchBar
        inline
        value={searchText}
        onChange={setSearchText}
        suggestions={['Shoes','Jackets','Phones','Watches']}
        onAIPress={() => router.push('/ai-search')}
        onVoicePress={() => console.log('voice')}
        onImagePress={handleImageSearch}
        loadingImageSearch={loadingImageSearch}
      />

    

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO BANNER CAROUSEL */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.heroCarousel}
        >
          {HERO_BANNERS.map((banner) => (
            <TouchableOpacity
              key={banner.id}
              activeOpacity={0.95}
              style={styles.heroSlide}
            >
              <Image
                source={{ uri: banner.image }}
                style={styles.heroImage}
              />
              <View style={styles.heroOverlay}>
                <Text style={styles.heroEyebrow}>{banner.eyebrow}</Text>
                <Text style={styles.heroTitle}>{banner.title}</Text>
                <Text style={styles.heroSubtitle}>{banner.subtitle}</Text>
                <View style={styles.heroButton}>
                  <Text style={styles.heroButtonText}>Shop Now</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* TOP TABS (Tutto / Fast Shipping / Women / Men …) */}
        <View style={styles.topTabsBar}>
          {TOP_TABS.map((tab) => {
            const active = topTab === tab.id
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.topTabItem}
                onPress={() => setTopTab(tab.id as any)}
              >
                <Text
                  style={[
                    styles.topTabText,
                    active && styles.topTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
                {active && <View style={styles.topTabUnderline} />}
              </TouchableOpacity>
            )
          })}
        </View>

        {/* NEW USER GIFTS SECTION */}
        <View style={styles.giftsCard}>
          <View style={styles.giftsHeader}>
            <Text style={styles.giftsTitle}>New User Gifts</Text>
            <View style={styles.giftsTag}>
              <Text style={styles.giftsTagText}>Limited-time</Text>
            </View>
          </View>

          <View style={styles.giftsContent}>
            {NEW_USER_GIFTS.map((gift) => (
              <View key={gift.id} style={styles.giftItem}>
                <Image
                  source={{ uri: gift.image }}
                  style={styles.giftImage}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.giftsButton}>
            <Text style={styles.giftsButtonText}>Get Now</Text>
          </TouchableOpacity>
        </View>

        {/* CATEGORY ICON GRID (DONNA / CURVY / KIDS / MEN / etc) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
        </View>
        <View style={styles.categoryGrid}>
          {isLoading && categories.length === 0
            ? Array.from({ length: 8 }).map((_, idx) => (
                <View key={idx} style={styles.categorySkeleton} />
              ))
            : categories.slice(0, 12).map((cat: any, idx: number) => {
                const slug =
                  cat.slug ||
                  cat.CategorySlug ||
                  cat.category_slug ||
                  String(cat.id)
                const image = cat.image_url || getImage(cat, idx)
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.categoryItem}
                    activeOpacity={0.9}
                    onPress={() => router.push(`/categories/${slug}`)}
                  >
                    <View style={styles.categoryImageWrapper}>
                      <Image
                        source={{ uri: image }}
                        style={styles.categoryImage}
                      />
                    </View>
                    <Text
                      style={styles.categoryName}
                      numberOfLines={2}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                )
              })}
        </View>

        {/* BLACK-LINE DIVIDER STRIP (FREE SHIPPING / NEW USER …) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.benefitStrip}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {BENEFITS.map((benefit) => (
            <View key={benefit.id} style={styles.benefitPill}>
              <FontAwesome
                name={benefit.icon as any}
                size={13}
                color={benefit.color}
              />
              <Text style={styles.benefitText}>{benefit.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* TOP DEALS SECTION (LIKE “Saldi Top”) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Top Deals</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalProductScroller}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
        >
          {saleLoading && saleProducts.length === 0
            ? Array.from({ length: 4 }).map((_, idx) => (
                <View key={idx} style={styles.dealSkeleton} />
              ))
            : saleProducts.map((item: any, idx: number) => {
                const price = item.price ?? item.currentPrice ?? 0
                const original =
                  item.originalPrice ?? item.original_price ?? price
                const hasDiscount = original > price
                const discountPercent = hasDiscount
                  ? Math.round(((original - price) / original) * 100)
                  : 0
                const image = getImage(item, idx + 100)

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.dealCard}
                    activeOpacity={0.95}
                    onPress={() => router.push(`/product/${item.id}`)}
                  >
                    <Image
                      source={{ uri: image }}
                      style={styles.dealImage}
                    />
                    {hasDiscount && (
                      <View style={styles.dealBadge}>
                        <Text style={styles.dealBadgeText}>
                          -{discountPercent}%
                        </Text>
                      </View>
                    )}
                    <View style={styles.dealInfo}>
                      <Text
                        style={styles.dealName}
                        numberOfLines={2}
                      >
                        {item.name}
                      </Text>
                      <View style={styles.dealPriceRow}>
                        <Text style={styles.dealPrice}>
                          {formatPrice(price)}
                        </Text>
                        {hasDiscount && (
                          <Text style={styles.dealOriginalPrice}>
                            {formatPrice(original)}
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}
        </ScrollView>

        {/* FEATURED STORES / TREND CARD ROW (like Tendenze / Best Sellers) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Trending Picks</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.featuredRow}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {featuredLoading && featuredProducts.length === 0
            ? Array.from({ length: 3 }).map((_, idx) => (
                <View key={idx} style={styles.featureSkeleton} />
              ))
            : featuredProducts.map((item: any, idx: number) => {
                const image = getImage(item, idx + 200)
                const price = item.price ?? 0
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.95}
                    style={styles.featureCard}
                    onPress={() => router.push(`/product/${item.id}`)}
                  >
                    <Image
                      source={{ uri: image }}
                      style={styles.featureImage}
                    />
                    <View style={styles.featureOverlay}>
                      <Text
                        style={styles.featureTitle}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text style={styles.featureCaption}>
                        From {formatPrice(price)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
        </ScrollView>

        {/* VISUAL SEARCH RESULT PREVIEW (if any) */}
        {visualSearchResult && (
          <View style={styles.visualSearchContainer}>
            <View style={styles.visualSearchHeader}>
              <Text style={styles.sectionTitle}>Visual Matches</Text>
              <TouchableOpacity onPress={clearVisualSearch}>
                <Text style={styles.sectionLink}>Clear</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalProductScroller}
              contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
            >
              {visualSearchResult.matches.map((m) => (
                <TouchableOpacity
                  key={m.product_id}
                  style={styles.dealCard}
                  activeOpacity={0.95}
                  onPress={() => router.push(`/product/${m.product_id}`)}
                >
                  <Image
                    source={{ uri: m.image_url || `https://picsum.photos/seed/vs_${m.product_id}/400/400` }}
                    style={styles.dealImage}
                  />
                  <View style={styles.dealInfo}>
                    <Text style={styles.dealName} numberOfLines={2}>{m.name || 'Product'}</Text>
                    <View style={styles.dealPriceRow}>
                      {m.price && <Text style={styles.dealPrice}>{formatPrice(m.price)}</Text>}
                      <Text style={styles.dealOriginalPrice}>Score {(m.score * 100).toFixed(0)}%</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {visualSearchResult.usedFallbackTextSearch && (
              <Text style={styles.fallbackNote}>Used fallback keyword search (embedding unavailable).</Text>
            )}
          </View>
        )}

        {/* MAIN PRODUCT GRID (like Shein “Per Te” grid) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>For You</Text>
          {isLoading && (
            <ActivityIndicator size='small' color='#2E8C83' />
          )}
        </View>

        <View style={styles.gridWrapper}>
          {gridProducts.length === 0 && !isLoading ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                No products found yet. Try again later.
              </Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {isLoading && gridProducts.length === 0
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <View key={idx} style={styles.gridSkeleton} />
                  ))
                : gridProducts.map((item: any, idx: number) => {
                    const price = item.price ?? 0
                    const original =
                      item.originalPrice ?? item.original_price ?? price
                    const hasDiscount = original > price
                    const image = getImage(item, idx + 300)

                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.gridItem}
                        activeOpacity={0.95}
                        onPress={() => router.push(`/product/${item.id}`)}
                      >
                        <View style={styles.gridImageWrapper}>
                          <Image
                            source={{ uri: image }}
                            style={styles.gridImage}
                          />
                          {hasDiscount && (
                            <View style={styles.gridDiscountChip}>
                              <Text style={styles.gridDiscountText}>
                                -{Math.round(
                                  ((original - price) / original) * 100
                                )}
                                %
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          style={styles.gridName}
                          numberOfLines={2}
                        >
                          {item.name}
                        </Text>
                        <View style={styles.gridPriceRow}>
                          <Text style={styles.gridPrice}>
                            {formatPrice(price)}
                          </Text>
                          {hasDiscount && (
                            <Text style={styles.gridOriginalPrice}>
                              {formatPrice(original)}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    )
                  })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default ShopScreen

// ------- STATIC DATA FOR BANNERS / GIFTS / BENEFITS -------

const HERO_BANNERS = [
  {
    id: 'banner1',
    image:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1100&q=80',
    eyebrow: 'Holiday Sale',
    title: 'Up to 40% OFF',
    subtitle: 'On selected winter favourites',
  },
  {
    id: 'banner2',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1100&q=80',
    eyebrow: 'New User Gifts',
    title: 'Welcome to Mukulah Shop',
    subtitle: 'Claim your exclusive welcome bundle',
  },
  {
    id: 'banner3',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1100&q=80',
    eyebrow: 'Express Shipping',
    title: 'Fast delivery in 2–5 days',
    subtitle: 'Across Europe on thousands of items',
  },
]

const TOP_TABS = [
  { id: 'all', label: 'All' },
  { id: 'fast', label: 'Fast Shipping' },
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
]

const NEW_USER_GIFTS = [
  {
    id: 'g1',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'g2',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'g3',
    image:
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'g4',
    image:
      'https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=600&q=80',
  },
]

const BENEFITS = [
  { id: 'b1', icon: 'truck', label: 'Free Shipping over €49', color: '#00b341' },
  { id: 'b2', icon: 'calendar-check-o', label: 'Easy Returns 30 Days', color: '#00b341' },
  { id: 'b3', icon: 'gift', label: 'New User Only', color: '#ff3b3b' },
]

// ------- STYLES -------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f6fb',
  },
  scroll: {
    flex: 1,
  },

  // HERO
  heroCarousel: {
    height: width * 0.6,
  },
  heroSlide: {
    width,
    height: width * 0.6,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    left: 18,
    bottom: 18,
    right: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 14,
    borderRadius: 16,
  },
  heroEyebrow: {
    fontSize: 12,
    color: '#ffe9f3',
    marginBottom: 4,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '800',
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#fdfdfd',
  },
  heroButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },

  // Top tabs
  topTabsBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffe3eb',
  },
  topTabItem: {
    marginRight: 18,
  },
  topTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8a4b55',
  },
  topTabTextActive: {
    color: '#111',
  },
  topTabUnderline: {
    marginTop: 3,
    height: 2,
    width: 24,
    borderRadius: 999,
    backgroundColor: '#111',
  },

  // New User Gifts card
  giftsCard: {
    marginTop: 8,
    marginHorizontal: 12,
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#ffe1cf',
    overflow: 'hidden',
  },
  giftsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  giftsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ff5b5b',
  },
  giftsTag: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#ff8a5c',
  },
  giftsTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  giftsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  giftItem: {
    width: (width - 12 * 2 - 12) / 4,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  giftImage: {
    width: '100%',
    height: '100%',
  },
  giftsButton: {
    alignSelf: 'center',
    marginTop: 4,
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#ff5b5b',
  },
  giftsButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  // Section headers
  sectionHeaderRow: {
    marginTop: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  sectionLink: {
    fontSize: 13,
    color: '#ff5b5b',
    fontWeight: '600',
  },

  // Category grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  categoryItem: {
    width: width / 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryImageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  categorySkeleton: {
    width: width / 4,
    alignItems: 'center',
    marginBottom: 16,
  },

  // Benefit strip
  benefitStrip: {
    marginTop: 4,
    marginBottom: 4,
    paddingVertical: 6,
    backgroundColor: '#ffeaf0',
  },
  benefitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  benefitText: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },

  // Top deals
  horizontalProductScroller: {
    marginTop: 8,
  },
  dealCard: {
    width: 150,
    marginRight: 10,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  dealImage: {
    width: '100%',
    height: 120,
  },
  dealBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#ff5b5b',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dealBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  dealInfo: {
    padding: 8,
  },
  dealName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dealPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dealPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  dealOriginalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  dealSkeleton: {
    width: 150,
    height: 170,
    marginRight: 10,
    borderRadius: 14,
    backgroundColor: '#ececf4',
  },

  // Featured / trending row
  featuredRow: {
    marginTop: 8,
  },
  featureCard: {
    width: 220,
    height: 130,
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  featureImage: {
    width: '100%',
    height: '100%',
  },
  featureOverlay: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  featureCaption: {
    fontSize: 11,
    color: '#f3f3f3',
    marginTop: 2,
  },
  featureSkeleton: {
    width: 220,
    height: 130,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: '#ececf4',
  },

  // Grid
  gridWrapper: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 8 * 2 - 10) / 2,
    borderRadius: 14,
    backgroundColor: '#fff',
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
  },
  gridImageWrapper: {
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: 190,
    backgroundColor: '#f6f6f6',
  },
  gridDiscountChip: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#000000b3',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  gridDiscountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  gridName: {
    paddingHorizontal: 8,
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  gridPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    marginTop: 4,
  },
  gridPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  gridOriginalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  gridSkeleton: {
    width: (width - 8 * 2 - 10) / 2,
    height: 260,
    borderRadius: 14,
    backgroundColor: '#ececf4',
    marginBottom: 12,
  },

  emptyBox: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#777',
  },
  // Visual search styles
  visualSearchContainer: {
    marginTop: 8,
  },
  visualSearchHeader: {
    marginTop: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fallbackNote: {
    paddingHorizontal: 16,
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },
})
