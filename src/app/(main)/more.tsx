// app/(main)/more.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '../../providers'
import MainFeatureGrid, { MainFeatureItem } from '../../components/main/MainFeatureGrid'

// Additional features that don't fit in the main grid
const additionalFeatures: MainFeatureItem[] = [
  {
    key: 'events',
    label: 'Events',
    icon: 'calendar',
    onPress: () => router.push('/events'),
  },
  {
    key: 'learning',
    label: 'Learning',
    icon: 'graduation-cap',
    onPress: () => router.push('/learning'),
  },
  {
    key: 'finance',
    label: 'Finance',
    icon: 'credit-card',
    onPress: () => router.push('/finance'),
  },
  {
    key: 'travel',
    label: 'Travel',
    icon: 'plane',
    onPress: () => router.push('/travel'),
  },
  {
    key: 'health',
    label: 'Health',
    icon: 'heartbeat',
    onPress: () => router.push('/health'),
  },
  {
    key: 'food',
    label: 'Food & Dining',
    icon: 'cutlery',
    onPress: () => router.push('/food'),
  },
  {
    key: 'entertainment',
    label: 'Entertainment',
    icon: 'film',
    onPress: () => router.push('/entertainment'),
  },
  {
    key: 'gaming',
    label: 'Gaming',
    icon: 'gamepad',
    onPress: () => router.push('/gaming'),
  },
  {
    key: 'automotive',
    label: 'Automotive',
    icon: 'car',
    onPress: () => router.push('/automotive'),
  },
  {
    key: 'fashion',
    label: 'Fashion',
    icon: 'shopping-bag',
    onPress: () => router.push('/fashion'),
  },
  {
    key: 'pets',
    label: 'Pets',
    icon: 'heart',
    onPress: () => router.push('/pets'),
  },
  {
    key: 'home-garden',
    label: 'Home & Garden',
    icon: 'home',
    onPress: () => router.push('/home-garden'),
  },
]

// Business & Professional tools
const businessFeatures: MainFeatureItem[] = [
  {
    key: 'analytics',
    label: 'Analytics',
    icon: 'bar-chart',
    onPress: () => router.push('/analytics'),
  },
  {
    key: 'marketing',
    label: 'Marketing',
    icon: 'bullhorn',
    onPress: () => router.push('/marketing'),
  },
  {
    key: 'payments',
    label: 'Payments',
    icon: 'credit-card-alt',
    onPress: () => router.push('/payments'),
  },
  {
    key: 'logistics',
    label: 'Logistics',
    icon: 'truck',
    onPress: () => router.push('/logistics'),
  },
  {
    key: 'hr',
    label: 'HR & Talent',
    icon: 'users',
    onPress: () => router.push('/hr'),
  },
  {
    key: 'legal',
    label: 'Legal',
    icon: 'gavel',
    onPress: () => router.push('/legal'),
  },
]

// Developer & Tech tools
const developerFeatures: MainFeatureItem[] = [
  {
    key: 'api',
    label: 'API Hub',
    icon: 'code',
    onPress: () => router.push('/api'),
  },
  {
    key: 'ai-tools',
    label: 'AI Tools',
    icon: 'cogs',
    onPress: () => router.push('/ai-tools'),
  },
  {
    key: 'blockchain',
    label: 'Blockchain',
    icon: 'link',
    onPress: () => router.push('/blockchain'),
  },
  {
    key: 'cloud',
    label: 'Cloud Services',
    icon: 'cloud',
    onPress: () => router.push('/cloud'),
  },
]

const categories = [
  { id: 'all', label: 'All Services', count: additionalFeatures.length + businessFeatures.length + developerFeatures.length },
  { id: 'lifestyle', label: 'Lifestyle', count: additionalFeatures.length },
  { id: 'business', label: 'Business', count: businessFeatures.length },
  { id: 'developer', label: 'Developer', count: developerFeatures.length },
]

export default function MoreScreen() {
  const { user } = useAuth()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const firstName = user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? 'Explorer'

  const getAllFeatures = () => {
    switch (activeCategory) {
      case 'lifestyle':
        return additionalFeatures
      case 'business':
        return businessFeatures
      case 'developer':
        return developerFeatures
      default:
        return [...additionalFeatures, ...businessFeatures, ...developerFeatures]
    }
  }

  const filteredFeatures = getAllFeatures().filter(feature =>
    feature.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <View style={styles.root}>
      <StatusBar barStyle='light-content' />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <FontAwesome name='arrow-left' size={18} color='#E5E7EB' />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Explore More</Text>
            <Text style={styles.headerSubtitle}>All Mukulah services in one place</Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIconButton}>
              <FontAwesome name='bell-o' size={18} color='#E5E7EB' />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <FontAwesome name='search' size={16} color='#8589A0' />
          <TextInput
            placeholder='Search services...'
            placeholderTextColor='#8589A0'
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <FontAwesome name='times-circle' size={16} color='#8589A0' />
            </TouchableOpacity>
          )}
        </View>

        {/* Category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryRow}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {categories.map((category) => {
            const isActive = category.id === activeCategory
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => setActiveCategory(category.id)}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isActive && styles.categoryChipTextActive,
                  ]}
                >
                  {category.label}
                </Text>
                <View style={[
                  styles.categoryCount,
                  isActive && styles.categoryCountActive,
                ]}>
                  <Text style={[
                    styles.categoryCountText,
                    isActive && styles.categoryCountTextActive,
                  ]}>
                    {category.count}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Results summary */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {filteredFeatures.length} service{filteredFeatures.length !== 1 ? 's' : ''} available
          </Text>
          <Text style={styles.resultsSubtitle}>
            {searchQuery ? `Results for "${searchQuery}"` : `${activeCategory === 'all' ? 'All categories' : categories.find(c => c.id === activeCategory)?.label}`}
          </Text>
        </View>

        {/* Feature grid */}
        {filteredFeatures.length > 0 ? (
          <MainFeatureGrid items={filteredFeatures} />
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name='search' size={48} color='#374151' />
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or browse a different category
            </Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery('')
                setActiveCategory('all')
              }}
            >
              <Text style={styles.clearButtonText}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Coming soon section */}
        <View style={styles.comingSoonSection}>
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <Text style={styles.comingSoonSubtitle}>
            We're constantly adding new services to the Mukulah ecosystem
          </Text>
          
          <View style={styles.comingSoonGrid}>
            <View style={styles.comingSoonItem}>
              <FontAwesome name='stethoscope' size={24} color='#9CA3AF' />
              <Text style={styles.comingSoonItemText}>Telemedicine</Text>
            </View>
            <View style={styles.comingSoonItem}>
              <FontAwesome name='graduation-cap' size={24} color='#9CA3AF' />
              <Text style={styles.comingSoonItemText}>University</Text>
            </View>
            <View style={styles.comingSoonItem}>
              <FontAwesome name='bank' size={24} color='#9CA3AF' />
              <Text style={styles.comingSoonItemText}>Banking</Text>
            </View>
            <View style={styles.comingSoonItem}>
              <FontAwesome name='shield' size={24} color='#9CA3AF' />
              <Text style={styles.comingSoonItemText}>Insurance</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050509',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F9FAFB',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    color: '#E5E7EB',
    fontSize: 16,
  },

  // Categories
  categoryRow: {
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#111827',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  categoryChipActive: {
    backgroundColor: '#F5C451',
    borderColor: '#F5C451',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    marginRight: 8,
  },
  categoryChipTextActive: {
    color: '#050509',
  },
  categoryCount: {
    backgroundColor: '#1F2937',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  categoryCountActive: {
    backgroundColor: '#050509',
  },
  categoryCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  categoryCountTextActive: {
    color: '#F5C451',
  },

  // Results
  resultsHeader: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  resultsSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  clearButton: {
    backgroundColor: '#F5C451',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#050509',
  },

  // Coming soon
  comingSoonSection: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#0B0F1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#111827',
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  comingSoonSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  comingSoonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  comingSoonItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#111827',
    borderRadius: 12,
    marginBottom: 12,
  },
  comingSoonItemText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
})