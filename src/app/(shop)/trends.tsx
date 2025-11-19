// app/(shop)/trends.tsx
import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  ImageBackground,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'

const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.35

// ---- MOCK DATA WITH REAL IMAGES ----
const cottagecoreCards = [
  {
    id: 'c1',
    title: 'Michelle Bag',
    price: '€8.34',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'c2',
    title: 'Mix Feel Boots',
    price: '€29.23',
    image:
      'https://images.unsplash.com/photo-1581804928342-4e3405e39c91?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'c3',
    title: 'Nova Chic Bag',
    price: '€6.48',
    image:
      'https://images.unsplash.com/photo-1600185365483-26d7e08c4c77?auto=format&fit=crop&w=500&q=60',
  },
]

const trendBrands = [
  {
    id: 'b1',
    name: 'ROMWE',
    badge: 'Trend Store',
    tagline: '999K+ sold · 3.1M followers',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 'b2',
    name: 'GEMCHO',
    badge: 'Fast Growing',
    tagline: 'Sales up 197% · 260% more followers',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
]

const brandProducts = [
  {
    id: 'p1',
    price: '€10.93',
    image:
      'https://images.unsplash.com/photo-1528701800489-20be3c2a6c6b?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'p2',
    price: '€8.82',
    image:
      'https://images.unsplash.com/photo-1520975918318-3e94d61d93a5?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'p3',
    price: '€8.14',
    image:
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'p4',
    price: '€9.14',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=60',
  },
]

// ---------- SHIMMER SKELETON ----------

const ShimmerBlock: React.FC<{ style?: object }> = ({ style }) => {
  const shimmer = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    )
    loop.start()
    return () => loop.stop()
  }, [shimmer])

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 80],
  })

  return (
    <View style={[styles.shimmerContainer, style]}>
      <Animated.View
        style={[
          styles.shimmerGradient,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  )
}

const TrendsSkeleton: React.FC = () => {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header skeleton */}
      <View style={styles.titleRow}>
        <View>
          <ShimmerBlock style={{ width: 140, height: 20, borderRadius: 10 }} />
          <ShimmerBlock
            style={{ width: 180, height: 12, borderRadius: 6, marginTop: 8 }}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <ShimmerBlock style={styles.skeletonIcon} />
          <ShimmerBlock style={[styles.skeletonIcon, { marginLeft: 8 }]} />
        </View>
      </View>

      {/* Hero section skeleton */}
      <View style={styles.heroCard}>
        <ShimmerBlock
          style={{ width: 120, height: 18, borderRadius: 9, marginBottom: 12 }}
        />
        <View style={{ flexDirection: 'row' }}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.heroItem}>
              <ShimmerBlock style={styles.heroImage} />
              <ShimmerBlock
                style={{
                  width: '70%',
                  height: 12,
                  borderRadius: 6,
                  marginTop: 8,
                }}
              />
              <ShimmerBlock
                style={{
                  width: 50,
                  height: 12,
                  borderRadius: 6,
                  marginTop: 4,
                }}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Brand skeleton blocks */}
      {[1, 2].map((i) => (
        <View key={i} style={styles.brandSection}>
          <View style={styles.brandHeader}>
            <ShimmerBlock style={styles.brandAvatar} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <ShimmerBlock
                style={{ width: 90, height: 14, borderRadius: 7 }}
              />
              <ShimmerBlock
                style={{
                  width: 160,
                  height: 10,
                  borderRadius: 5,
                  marginTop: 6,
                }}
              />
            </View>
            <ShimmerBlock
              style={{ width: 60, height: 24, borderRadius: 12 }}
            />
          </View>
          <View style={{ flexDirection: 'row', paddingHorizontal: 12 }}>
            {[1, 2, 3, 4].map((j) => (
              <View key={j} style={styles.productCard}>
                <ShimmerBlock style={styles.productImage} />
              </View>
            ))}
          </View>
          <View style={styles.quoteRow}>
            <ShimmerBlock
              style={{ flex: 1, height: 12, borderRadius: 6 }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

// ---------- MAIN TRENDS SCREEN ----------

const TrendsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const flatListRef = useRef<FlatList<any> | null>(null)
  const currentIndexRef = useRef(0)

  // fake loading to show shimmer; replace with real API later
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400)
    return () => clearTimeout(timer)
  }, [])

  // auto-scrolling for cottagecore FlatList
  useEffect(() => {
    if (loading) return

    const interval = setInterval(() => {
      if (!flatListRef.current) return
      const nextIndex =
        (currentIndexRef.current + 1) % cottagecoreCards.length
      currentIndexRef.current = nextIndex

      flatListRef.current.scrollToIndex({
        index: nextIndex,
        animated: true,
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [loading])

  if (loading) return <TrendsSkeleton />

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header with glass effect */}
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=60',
        }}
        style={styles.titleBackground}
        imageStyle={{ opacity: 0.4 }}
      >
        <View style={styles.titleOverlay} />
        <View style={styles.titleRowInner}>
          <View>
            <Text style={styles.title}>Trends Store</Text>
            <Text style={styles.subtitle}>
              Fresh collections picked for you every day
            </Text>
          </View>

          <View style={styles.titleIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name='heart-o' size={20} color='#fff' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name='share-alt' size={20} color='#fff' />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Glass + gradient Cottagecore hero */}
      <View style={styles.heroWrapper}>
        <View style={styles.heroCardOuter}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80',
            }}
            style={styles.heroBackground}
            imageStyle={styles.heroBackgroundImage}
          >
            <View style={styles.heroGlassLayer} />
            <View style={styles.heroGradientOverlay} />

            <View style={styles.heroContent}>
              <Text style={styles.heroHashtag}># Cottagecore</Text>

              <FlatList
                ref={flatListRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={cottagecoreCards}
                keyExtractor={(item) => item.id}
                onScrollToIndexFailed={({ index, averageItemLength }) => {
                  if (!flatListRef.current || !averageItemLength) return
                  flatListRef.current.scrollToOffset({
                    offset: index * averageItemLength,
                    animated: true,
                  })
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.heroItem}
                    onPress={() => router.push('/(shop)/shop')}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={styles.heroImage}
                      resizeMode='cover'
                    />
                    <Text style={styles.heroItemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.heroItemPrice}>{item.price}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </ImageBackground>
        </View>
      </View>

      {/* Brand Sections */}
      {trendBrands.map((brand) => (
        <View key={brand.id} style={styles.brandSection}>
          <View style={styles.brandHeader}>
            <Image source={{ uri: brand.avatar }} style={styles.brandAvatar} />

            <View style={{ flex: 1 }}>
              <View style={styles.brandNameRow}>
                <Text style={styles.brandName}>{brand.name}</Text>
                <View style={styles.brandBadge}>
                  <Text style={styles.brandBadgeText}>{brand.badge}</Text>
                </View>
              </View>

              <Text style={styles.brandTagline}>{brand.tagline}</Text>
            </View>

            <TouchableOpacity
              style={styles.brandFollowButton}
              onPress={() => router.push('/(shop)/shop')}
            >
              <Text style={styles.brandFollowText}>Visit</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            data={brandProducts}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.productCard}
                onPress={() => router.push('/(shop)/shop')}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                  resizeMode='cover'
                />
                <Text style={styles.productPrice}>{item.price}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.quoteRow}>
            <Text style={styles.quoteMark}>“</Text>
            <Text style={styles.quoteText} numberOfLines={1}>
              soft, comfortable and high quality – I will buy again!
            </Text>
            <Text style={styles.quoteMark}>”</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

export default TrendsScreen

// ---------- STYLES ----------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f5fb',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
  },
  heroCard: {
    borderRadius: 22,
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  // HEADER
  titleBackground: {
    width: '100%',
  },
  titleOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  titleRowInner: {
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    color: '#e0e0e0',
    marginTop: 2,
  },
  titleIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // HERO
  heroWrapper: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  heroCardOuter: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heroBackground: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  heroBackgroundImage: {
    borderRadius: 22,
  },
  heroGlassLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 12, 30, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  heroGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderRadius: 22,
    borderWidth: 0,
    // fake gradient using two semi-transparent layers
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  heroContent: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  heroHashtag: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
  },
  heroItem: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 16,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  heroImage: {
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f1f1f1',
    marginBottom: 8,
  },
  heroItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  heroItemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ff3162',
  },

  // BRAND SECTIONS
  brandSection: {
    marginTop: 18,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  brandAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  brandNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginRight: 6,
  },
  brandBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#8C4BFF',
  },
  brandBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  brandTagline: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  brandFollowButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8C4BFF',
  },
  brandFollowText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8C4BFF',
  },

  productCard: {
    width: 90,
    marginRight: 8,
    marginTop: 6,
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },

  quoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 10,
  },
  quoteMark: {
    fontSize: 20,
    color: '#d0b8ff',
  },
  quoteText: {
    flex: 1,
    fontSize: 11,
    color: '#777',
    marginHorizontal: 6,
  },

  // SHIMMER
  shimmerContainer: {
    overflow: 'hidden',
    backgroundColor: '#e2e4ec',
  },
  shimmerGradient: {
    width: 80,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    opacity: 0.9,
  },
  skeletonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
})
