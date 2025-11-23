// app/(services)/index.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Colors, Spacing } from '../../constants'
import ServiceFiltersModal, {
  ServiceFilters,
} from '../../components/services/ServiceFiltersModal'

type Service = {
  id: string
  title: string
  category: string
  seller: string
  country: string
  rating: number
  reviews: number
  priceFrom: number
  delivery: string
  isPro: boolean
  avatarUrl: string
  imageUrl: string
}

const mockServices: Service[] = [
  {
    id: '1',
    title: 'Modern luxury logo for tech & e-commerce brands',
    category: 'Design',
    seller: 'Mukulah Studio',
    country: 'Italy',
    rating: 4.9,
    reviews: 328,
    priceFrom: 149,
    delivery: '3 days',
    isPro: true,
    avatarUrl: 'https://picsum.photos/seed/service-seller-1/80',
    imageUrl: 'https://picsum.photos/seed/service-hero-1/400/240',
  },
  {
    id: '2',
    title: 'Full Shopify store setup with high-converting design',
    category: 'E-commerce',
    seller: 'Shop Genius',
    country: 'Germany',
    rating: 4.8,
    reviews: 210,
    priceFrom: 320,
    delivery: '5 days',
    isPro: true,
    avatarUrl: 'https://picsum.photos/seed/service-seller-2/80',
    imageUrl: 'https://picsum.photos/seed/service-hero-2/400/240',
  },
  {
    id: '3',
    title: 'TikTok & Reels content editing for personal brands',
    category: 'Video',
    seller: 'Motion Flow',
    country: 'Cameroon',
    rating: 4.7,
    reviews: 89,
    priceFrom: 60,
    delivery: '48 hours',
    isPro: false,
    avatarUrl: 'https://picsum.photos/seed/service-seller-3/80',
    imageUrl: 'https://picsum.photos/seed/service-hero-3/400/240',
  },
]

const categoryTabs = ['All', 'Design', 'Development', 'Marketing', 'Video', 'AI']

const ServiceCard = ({ item }: { item: Service }) => {
  const handlePress = () => {
    router.push('/(services)/service-detail')
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.cardSellerRow}>
          <Image source={{ uri: item.avatarUrl }} style={styles.cardAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardSellerName}>{item.seller}</Text>
            <Text style={styles.cardSellerMeta}>{item.country}</Text>
          </View>
          {item.isPro && (
            <View style={styles.cardProBadge}>
              <Text style={styles.cardProText}>PRO</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooterRow}>
          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={12} color="#FBBF24" />
            <Text style={styles.ratingValue}>{item.rating.toFixed(1)}</Text>
            <Text style={styles.ratingReviews}>({item.reviews})</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.fromLabel}>Starting at</Text>
            <Text style={styles.priceText}>€{item.priceFrom}</Text>
          </View>
        </View>

        <Text style={styles.deliveryText}>{item.delivery} delivery</Text>
      </View>
    </TouchableOpacity>
  )
}

const ServicesHomeScreen = () => {
  const [search, setSearch] = useState('')
  const [selectedTab, setSelectedTab] = useState('All')
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [filters, setFilters] = useState<ServiceFilters>({
    budget: 'any',
    delivery: 'any',
    rating: 'any',
    proOnly: false,
    onlineNow: false,
  })

  const filteredServices = mockServices.filter((s) => {
    if (selectedTab !== 'All' && s.category !== selectedTab) return false
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.proOnly && !s.isPro) return false
    return true
  })

  return (
    <View style={styles.root}>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={16} color={Colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services, skills, keywords..."
            placeholderTextColor={Colors.text.placeholder}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity
            style={styles.searchFiltersButton}
            onPress={() => setFiltersVisible(true)}
          >
            <FontAwesome name="sliders" size={16} color="#F9FAFB" />
          </TouchableOpacity>
        </View>

        {/* Location row (simple for now) */}
        <View style={styles.locationRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome name="map-marker" size={14} color="#9CA3AF" />
            <Text style={styles.locationText}> Worldwide • Remote & On-site</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeLocationText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Quick filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          <TouchableOpacity
            style={styles.chipPrimary}
            onPress={() => setFiltersVisible(true)}
          >
            <FontAwesome name="filter" size={12} color="#050509" />
            <Text style={styles.chipPrimaryText}>Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipLabel}>Pro experts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipLabel}>Delivery ≤ 3 days</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipLabel}>4★ & up</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Sort & results */}
        <View style={styles.sortRow}>
          <Text style={styles.resultsText}>{filteredServices.length} services</Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortButtonText}>Best match</Text>
            <FontAwesome name="angle-down" size={14} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* Category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {categoryTabs.map((tab) => {
            const active = selectedTab === tab
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                style={[styles.tabChip, active && styles.tabChipActive]}
              >
                <Text
                  style={[styles.tabChipText, active && styles.tabChipTextActive]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Service list */}
        <View style={styles.list}>
          {filteredServices.map((s) => (
            <ServiceCard key={s.id} item={s} />
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <ServiceFiltersModal
        visible={filtersVisible}
        initialFilters={filters}
        onClose={() => setFiltersVisible(false)}
        onApply={setFilters}
      />
    </View>
  )
}

export default ServicesHomeScreen

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[3],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 999,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.border.primary,
    marginBottom: Spacing[2],
  },
  searchInput: {
    flex: 1,
    marginHorizontal: Spacing[2],
    color: Colors.text.primary,
    fontSize: 14,
  },
  searchFiltersButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  locationText: {
    color: Colors.text.muted,
    fontSize: 12,
  },
  changeLocationText: {
    color: Colors.primary[500],
    fontSize: 12,
    fontWeight: '600',
  },
  chipRow: {
    paddingVertical: Spacing[1],
    gap: Spacing[2],
  },
  chipPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primary[500],
    borderRadius: 999,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  chipPrimaryText: {
    color: Colors.background.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  chipLabel: {
    color: Colors.text.secondary,
    fontSize: 12,
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing[1],
    marginBottom: Spacing[1],
  },
  resultsText: {
    color: Colors.text.muted,
    fontSize: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortButtonText: {
    color: Colors.text.tertiary,
    fontSize: 12,
  },
  tabRow: {
    paddingVertical: Spacing[1],
    gap: Spacing[2],
  },
  tabChip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: 999,
    backgroundColor: Colors.background.secondary,
  },
  tabChipActive: {
    backgroundColor: Colors.background.tertiary,
  },
  tabChipText: {
    color: Colors.text.muted,
    fontSize: 12,
  },
  tabChipTextActive: {
    color: Colors.text.primary,
    fontWeight: '700',
  },
  list: {
    marginTop: Spacing[1],
    gap: Spacing[2],
  },
  card: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border.primary,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: Spacing[3],
  },
  cardCategory: {
    color: Colors.text.muted,
    fontSize: 11,
    marginBottom: 2,
  },
  cardTitle: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing[2],
  },
  cardSellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  cardAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Spacing[2],
  },
  cardSellerName: {
    color: Colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  cardSellerMeta: {
    color: Colors.text.muted,
    fontSize: 11,
  },
  cardProBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 999,
    backgroundColor: Colors.status.success,
  },
  cardProText: {
    color: Colors.text.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    color: Colors.text.primary,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  ratingReviews: {
    color: Colors.text.muted,
    fontSize: 11,
    marginLeft: 4,
  },
  fromLabel: {
    color: Colors.text.muted,
    fontSize: 11,
  },
  priceText: {
    color: Colors.text.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  deliveryText: {
    color: Colors.text.muted,
    fontSize: 11,
    marginTop: Spacing[1],
  },
})
