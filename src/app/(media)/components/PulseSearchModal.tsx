import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native'
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import usePulseSearch from '../../../hooks/usePulseSearch'
import { Colors, Spacing, Typography } from '../../../constants'

const { height } = Dimensions.get('window')

interface PulseSearchModalProps {
  visible: boolean
  onClose: () => void
}

const PulseSearchModal: React.FC<PulseSearchModalProps> = ({
  visible,
  onClose,
}) => {
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    filters: searchFilters,
    updateFilters,
    searchResults: hookSearchResults,
    recentSearches,
    searchSuggestions,
    trendingSearches: hookTrendingSearches,
    isLoading,
    performSearch,
    clearRecentSearches: hookClearRecentSearches,
  } = usePulseSearch()

  const slideAnim = useRef(new Animated.Value(height)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const searchInputRef = useRef<TextInput>(null)

  const filterOptions = [
    'All',
    'Creators',
    'Crypto',
    'Travel',
    'Jobs',
    'Real Estate',
    'Sports',
    'Services',
    'Shop',
  ]

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()

      // Fade in content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()

      // Focus search input
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, fadeAnim, opacityAnim, slideAnim])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      performSearch(query)
    }
  }

  const renderDefaultContent = () => (
    <View>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={hookClearRecentSearches}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentItem}
              onPress={() => setSearchQuery(search)}
            >
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.recentText}>{search}</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Trending Now */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <View style={styles.trendingGrid}>
          {hookTrendingSearches.map((trend, index) => (
            <TouchableOpacity
              key={index}
              style={styles.trendingItem}
              onPress={() => setSearchQuery(trend)}
            >
              <View style={styles.trendingIcon}>
                <Ionicons name="trending-up" size={16} color="#FF375F" />
              </View>
              <Text style={styles.trendingText}>{trend}</Text>
              <Text style={styles.trendingCount}>
                {Math.floor(Math.random() * 900 + 100)}K
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Popular Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore Categories</Text>
        <View style={styles.categoriesGrid}>
          {[
            { name: 'Crypto Trading', icon: '₿', color: '#F7931A', count: '2.1M' },
            { name: 'Remote Jobs', icon: '💻', color: '#0066CC', count: '1.8M' },
            { name: 'Travel Guides', icon: '✈️', color: '#00D4AA', count: '3.2M' },
            { name: 'Real Estate', icon: '🏠', color: '#FF6B6B', count: '892K' },
            { name: 'Sports Live', icon: '⚽', color: '#FF4081', count: '1.5M' },
            { name: 'Services', icon: '🔧', color: '#9C27B0', count: '675K' },
          ].map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => updateFilters({ category: category.name.split(' ')[0] })}
            >
              <View
                style={[
                  styles.categoryIconContainer,
                  { backgroundColor: category.color + '20' },
                ]}
              >
                <Text
                  style={[styles.categoryIcon, { color: category.color }]}
                >
                  {category.icon}
                </Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count} posts</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Top Creators */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Creators</Text>
        {[
          {
            name: 'Alex Chen',
            category: 'Crypto Expert',
            followers: '2.1M',
            verified: true,
            avatar: '₿',
          },
          {
            name: 'Sarah Johnson',
            category: 'Tech Career Coach',
            followers: '890K',
            verified: true,
            avatar: '👩‍💼',
          },
          {
            name: 'Travel Maya',
            category: 'Digital Nomad',
            followers: '1.3M',
            verified: true,
            avatar: '✈️',
          },
        ].map((creator, index) => (
          <TouchableOpacity key={index} style={styles.creatorItem}>
            <View style={styles.creatorAvatar}>
              <Text style={styles.creatorAvatarText}>{creator.avatar}</Text>
            </View>
            <View style={styles.creatorInfo}>
              <View style={styles.creatorHeader}>
                <Text style={styles.creatorName}>{creator.name}</Text>
                {creator.verified && (
                  <FontAwesome
                    name="check-circle"
                    size={14}
                    color="#1DA1F2"
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>
              <Text style={styles.creatorCategory}>
                {creator.category} • {creator.followers} followers
              </Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  if (!visible) return null

  return (
    <View style={styles.modalOverlay}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.8)" />

      {/* Background Blur */}
      <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Search Modal - Fixed Layout */}
      <Animated.View 
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search Pulse Universe..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* AI Search Suggestions */}
        <View style={styles.aiSuggestions}>
          <View style={styles.aiHeader}>
            <MaterialIcons name="auto-awesome" size={16} color="#FFD700" />
            <Text style={styles.aiHeaderText}>AI Suggestions</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsScroll}
          >
            {searchSuggestions.map((trend, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => setSearchQuery(trend.substring(2))}
              >
                <Text style={styles.suggestionText}>{trend}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                searchFilters.category === filter && styles.activeFilterChip,
              ]}
              onPress={() => updateFilters({ category: filter })}
            >
              <Text
                style={[
                  styles.filterText,
                  searchFilters.category === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content Container - Fixed Layout */}
        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={{ opacity: fadeAnim }}>
              {searchQuery.length === 0 ? (
                renderDefaultContent()
              ) : (
                <View style={styles.searchResults}>
                {hookSearchResults.length > 0 ? (
                  <>
                    <View style={styles.resultsHeader}>
                      <Text style={styles.sectionTitle}>
                        Results for "{searchQuery}"
                      </Text>
                      <Text style={styles.resultsCount}>
                        {hookSearchResults.length} found
                      </Text>
                    </View>
                    {hookSearchResults.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.resultItem}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.resultIcon,
                            { backgroundColor: item.color + '20' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.resultIconText,
                              { color: item.color },
                            ]}
                          >
                            {item.icon}
                          </Text>
                        </View>

                        <View style={styles.resultContent}>
                          <View style={styles.resultHeader}>
                            <Text style={styles.resultTitle}>{item.title}</Text>
                            {item.verified && (
                              <FontAwesome
                                name="check-circle"
                                size={14}
                                color="#1DA1F2"
                                style={{ marginLeft: 4 }}
                              />
                            )}
                            {item.trending && (
                              <View style={styles.trendingBadge}>
                                <Ionicons
                                  name="trending-up"
                                  size={10}
                                  color="#fff"
                                />
                              </View>
                            )}
                          </View>
                          <Text style={styles.resultSubtitle}>
                            {item.subtitle}
                          </Text>
                        </View>

                        <TouchableOpacity style={styles.resultAction}>
                          <Ionicons
                            name="chevron-forward"
                            size={16}
                            color="#666"
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </>
                ) : (
                  <View style={styles.noResults}>
                    <Ionicons name="search" size={48} color="#666" />
                    <Text style={styles.noResultsText}>No results found</Text>
                    <Text style={styles.noResultsSubtext}>
                      Try searching for something else
                    </Text>
                  </View>
                )}
              </View>
            )}
            </Animated.View>
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay.backdrop,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingTop: 50,
    paddingBottom: Spacing[4],
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  // Legacy support
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#000',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 45,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  aiSuggestions: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
    backgroundColor: Colors.background.primary,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  aiHeaderText: {
    color: Colors.primary[500],
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  suggestionsScroll: {
    flexDirection: 'row',
  },
  suggestionChip: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  suggestionText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '500',
  },
  filtersContainer: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
  },
  filterChip: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: 20,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    marginRight: Spacing[2],
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    flexShrink: 0,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary[500],
  },
  filterText: {
    color: Colors.text.muted,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeFilterText: {
    color: Colors.background.primary,
    fontWeight: '700',
  },
  searchContent: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 8,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  // NEW: ScrollView takes full remaining height
  listScroll: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 32,
  },
  // FIX: remove flexGrow so content doesn’t get pushed weirdly
  scrollContent: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
    paddingBottom: Spacing[8],
  },
  // FIX: remove flex:1 to avoid stretching and empty gap
  defaultContent: {},
  searchResults: {},
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  clearText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 8,
  },
  recentText: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    marginLeft: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginBottom: 12,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultIconText: {
    fontSize: 20,
    fontWeight: '600',
  },
  resultContent: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  trendingBadge: {
    backgroundColor: '#FF375F',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  resultSubtitle: {
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
  },
  resultAction: {
    padding: 8,
  },
  // Trending styles
  trendingGrid: {
    marginTop: 8,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 6,
  },
  trendingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 55, 95, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trendingText: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  trendingCount: {
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
  },
  // Enhanced category styles
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryCount: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },
  // Creator styles
  creatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginBottom: 8,
  },
  creatorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  creatorAvatarText: {
    fontSize: 20,
    fontWeight: '600',
  },
  creatorInfo: {
    flex: 1,
  },
  creatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  creatorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  creatorCategory: {
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
  },
  followButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  followButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  // Results styles
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsCount: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  noResultsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
})

export default PulseSearchModal
