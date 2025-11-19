// app/(shop)/categories/index.tsx
import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCategories } from '../../api/server/api'
import { Header } from '../../components'

const { width } = Dimensions.get('window')

// Top “tabs” like SHEIN: All / Women / Curvy / Kids / Men / Home
const TOP_TABS = [
  { id: 'all', label: 'All' },
  { id: 'women', label: 'Women' },
  { id: 'curve', label: 'Curve+Plus' },
  { id: 'kids', label: 'Kids' },
  { id: 'men', label: 'Men' },
  { id: 'home', label: 'Home & Living' },
]

// Mock “Picks for you” items (rounded bubbles on the right)
const MOCK_PICKS = [
  {
    id: 'p1',
    title: 'Teen Boys Jeans',
    image:
      'https://images.unsplash.com/photo-1527010154944-f2241763d806?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p2',
    title: 'Men Shirt Co-ords',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p3',
    title: 'Men Knit Tops',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p4',
    title: 'Men Polo Shirts',
    image:
      'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p5',
    title: 'Men Overcoats',
    image:
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p6',
    title: 'Men Hoodies',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p7',
    title: 'Men Sweatshirts',
    image:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p8',
    title: 'Men Sweatpants',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
  },
]

const LEFT_MENU_EXTRA = {
  id: 'just-for-you',
  name: 'Just for You',
}

const CategoriesScreen: React.FC = () => {
  const { data: categories = [], isLoading, error } = useCategories()
  const [selectedTopTab, setSelectedTopTab] = useState('all')
  const [selectedLeftId, setSelectedLeftId] = useState<string>(
    LEFT_MENU_EXTRA.id
  )

  // Combine “Just for You” + dynamic categories
  const leftMenuData = useMemo(() => {
    const normalized = categories.map((c: any) => ({
      id: c.id,
      // try different possible field names safely
      slug: c.slug || c.CategorySlug || c.category_slug || String(c.id),
      name: c.name || c.title || 'Category',
    }))
    return [LEFT_MENU_EXTRA, ...normalized]
  }, [categories])

  const handleOpenCategory = (item: any) => {
    if (item.id === LEFT_MENU_EXTRA.id) return
    const slug = item.slug || item.CategorySlug || item.category_slug || item.id
    router.push(`/categories/${slug}`)
  }

  const renderLeftItem = ({ item }: { item: any }) => {
    const isSelected = selectedLeftId === item.id
    return (
      <TouchableOpacity
        style={[
          styles.leftItem,
          isSelected && styles.leftItemSelected,
        ]}
        onPress={() => {
          setSelectedLeftId(item.id)
          handleOpenCategory(item)
        }}
        activeOpacity={0.9}
      >
        <View style={styles.leftItemInner}>
          {isSelected && <View style={styles.leftAccentBar} />}
          <Text
            style={[
              styles.leftItemText,
              isSelected && styles.leftItemTextSelected,
            ]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderPick = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.pickCard}
      activeOpacity={0.95}
      onPress={() => router.push('/(shop)/shop')}
    >
      <View style={styles.pickImageWrapper}>
        <Image source={{ uri: item.image }} style={styles.pickImage} />
      </View>
      <Text style={styles.pickTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.root}>
      {/* Global Shein-style header you already use */}
      <Header />

      {/* Top category tabs (Tutto / Donna / Curvy / … in English) */}
      <View style={styles.topTabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topTabsContainer}
        >
          {TOP_TABS.map((tab) => {
            const active = selectedTopTab === tab.id
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setSelectedTopTab(tab.id)}
                style={styles.topTab}
                activeOpacity={0.8}
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
        </ScrollView>
      </View>

      {/* MAIN BODY: left rail + right content */}
      <View style={styles.body}>
        {/* LEFT MENU */}
        <View style={styles.leftColumn}>
          {isLoading ? (
            <>
              {Array.from({ length: 8 }).map((_, idx) => (
                <View key={idx} style={styles.leftSkeleton} />
              ))}
            </>
          ) : error ? (
            <Text style={styles.errorText}>Failed to load categories</Text>
          ) : (
            <FlatList
              data={leftMenuData}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderLeftItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 6 }}
            />
          )}
        </View>

        {/* RIGHT PICKS AREA */}
        <View style={styles.rightColumn}>
          <View style={styles.rightHeader}>
            <Text style={styles.rightTitle}>
              {selectedLeftId === LEFT_MENU_EXTRA.id
                ? 'Picks for You'
                : 'Top picks in this category'}
            </Text>
            <TouchableOpacity
              style={styles.filterChip}
              onPress={() => router.push('/(shop)/trends')}
            >
              <FontAwesome name='bolt' size={12} color='#ff4e8c' />
              <Text style={styles.filterChipText}>Trends</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={MOCK_PICKS}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={renderPick}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.picksList}
          />
        </View>
      </View>
    </View>
  )
}

export default CategoriesScreen

const LEFT_WIDTH = width * 0.3

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f5fb',
  },
  topTabsWrapper: {
    backgroundColor: '#ffffff',
    paddingTop: 6,
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  topTabsContainer: {
    paddingHorizontal: 16,
  },
  topTab: {
    marginRight: 18,
    alignItems: 'center',
  },
  topTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#777',
  },
  topTabTextActive: {
    color: '#111',
  },
  topTabUnderline: {
    marginTop: 3,
    height: 2,
    width: 24,
    borderRadius: 999,
    backgroundColor: '#ff4e8c',
  },

  body: {
    flex: 1,
    flexDirection: 'row',
  },

  // LEFT COLUMN
  leftColumn: {
    width: LEFT_WIDTH,
    backgroundColor: '#f0f1f5',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#e0e1e6',
  },
  leftItem: {
    paddingVertical: 10,
    paddingRight: 6,
  },
  leftItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  leftAccentBar: {
    width: 3,
    height: 26,
    borderRadius: 999,
    backgroundColor: '#ff4e8c',
    marginRight: 8,
  },
  leftItemText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 18,
  },
  leftItemSelected: {
    backgroundColor: '#ffffff',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  leftItemTextSelected: {
    color: '#111',
    fontWeight: '700',
  },
  leftSkeleton: {
    height: 32,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#e2e3ec',
  },

  // RIGHT COLUMN
  rightColumn: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 78, 140, 0.08)',
  },
  filterChipText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#ff4e8c',
  },

  // Picks grid
  picksList: {
    paddingBottom: 20,
  },
  pickCard: {
    width: (width - LEFT_WIDTH - 12 * 2 - 10) / 2,
    marginBottom: 16,
    alignItems: 'center',
  },
  pickImageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    // glassy + shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  pickImage: {
    width: '100%',
    height: '100%',
  },
  pickTitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
  },

  errorText: {
    padding: 16,
    fontSize: 13,
    color: '#d00',
  },
})
