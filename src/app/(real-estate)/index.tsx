// app/(real-estate)/index.tsx
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import type { ComponentProps } from 'react'

const BG = '#050509'
const CARD = '#0B0F1A'
const ACCENT = '#C084FC'
const MUTED = '#9CA3AF'

const CATEGORIES = [
  'Apartments',
  'Rooms & Shared',
  'Villas & Houses',
  'Holiday homes',
  'Offices & Shops',
  'Garages & Parking',
  'Land & Plots',
  'All properties',
]

const MOCK_PROPERTIES = [
  {
    id: '1',
    title: 'Modern apartment with city view',
    location: 'Florence, Italy',
    price: '€1,150 / month',
    meta: '2 bedrooms • 70 m² • Furnished',
    image:
      'https://images.pexels.com/photos/4392279/pexels-photo-4392279.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
  {
    id: '2',
    title: 'Family villa with private garden',
    location: 'Douala, Cameroon',
    price: '€185,000',
    meta: '4 bedrooms • 320 m² • Parking',
    image:
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    title: 'Cozy room close to university',
    location: 'Bologna, Italy',
    price: '€390 / month',
    meta: 'Room in shared flat • Students',
    image:
      'https://images.pexels.com/photos/4392270/pexels-photo-4392270.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
]

export default function ImmobilizerHome() {
  const [activeCategory, setActiveCategory] = React.useState('All properties')

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Search & location */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Feather name='search' size={16} color={MUTED} />
            <TextInput
              placeholder='Search by city, street, ID...'
              placeholderTextColor={MUTED}
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.searchIconRight}>
              <Feather name='map-pin' size={16} color='#F9FAFB' />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.locationRow}>
            <Feather name='navigation' size={14} color={ACCENT} />
            <Text style={styles.locationText}>All locations • Worldwide</Text>
          </TouchableOpacity>
        </View>

        {/* Filters row  */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={{ paddingRight: 8 }}
        >
          <FilterChip label='Filters' icon='sliders' active />
          <FilterChip label='Listing type' />
          <FilterChip label='Price range' />
          <FilterChip label='Rooms' />
          <FilterChip label='More' />
        </ScrollView>

        {/* Category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryRow}
          contentContainerStyle={{ paddingRight: 8 }}
        >
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[
                  styles.categoryChip,
                  active && {
                    backgroundColor: ACCENT,
                    borderColor: 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    active && { color: BG, fontWeight: '700' },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Results header */}
        <View style={styles.resultsHeader}>
          <View>
            <Text style={styles.resultsTitle}>44,548 properties found</Text>
            <Text style={styles.resultsSubtitle}>
              Sorted by relevance • Tap to change
            </Text>
          </View>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortButtonText}>Sort</Text>
            <Feather name='chevron-down' size={16} color='#F9FAFB' />
          </TouchableOpacity>
        </View>

        {/* Property list */}
        <View style={styles.list}>
          {MOCK_PROPERTIES.map((item) => (
            <PropertyCard key={item.id} {...item} />
          ))}
        </View>
      </ScrollView>


    </View>
  )
}



const FilterChip: React.FC<{
  label: string
  icon?: ComponentProps<typeof Feather>['name']
  active?: boolean
}> = ({ label, icon, active }) => (
  <TouchableOpacity
    style={[
      styles.filterChip,
      active && { backgroundColor: ACCENT + '22', borderColor: ACCENT },
    ]}
  >
    {icon && (
      <Feather
        name={icon}
        size={14}
        color={active ? '#F9FAFB' : MUTED}
        style={{ marginRight: 4 }}
      />
    )}
    <Text
      style={[
        styles.filterChipText,
        active && { color: '#F9FAFB', fontWeight: '600' },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
)

type Property = (typeof MOCK_PROPERTIES)[number]

const PropertyCard: React.FC<Property> = ({
  title,
  location,
  price,
  meta,
  image,
  featured,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.image} />

        <TouchableOpacity style={styles.heartButton}>
          <Feather name='heart' size={18} color='#F9FAFB' />
        </TouchableOpacity>

        {featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>Featured</Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.cardLocation}>{location}</Text>
        <Text style={styles.cardPrice}>{price}</Text>
        <Text style={styles.cardMeta}>{meta}</Text>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.notifyButton}>
            <Feather name='bell' size={14} color={BG} />
            <Text style={styles.notifyButtonText}>Notify me</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Details</Text>
            <Feather name='chevron-right' size={16} color={ACCENT} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },

  searchContainer: {
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#111827',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
    color: '#F9FAFB',
  },
  searchIconRight: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  locationText: {
    color: MUTED,
    fontSize: 12,
  },

  filterRow: {
    marginTop: 8,
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#111827',
    marginRight: 8,
    backgroundColor: CARD,
  },
  filterChipText: {
    fontSize: 12,
    color: MUTED,
  },

  categoryRow: {
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: CARD,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#111827',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#E5E7EB',
  },

  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultsTitle: {
    color: '#F9FAFB',
    fontWeight: '600',
    fontSize: 13,
  },
  resultsSubtitle: {
    color: MUTED,
    fontSize: 11,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: '#111827',
    gap: 4,
  },
  sortButtonText: {
    color: '#F9FAFB',
    fontSize: 11,
  },

  list: {
    marginTop: 4,
    gap: 14,
  },
  card: {
    borderRadius: 16,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: '#111827',
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 190,
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: ACCENT,
  },
  featuredBadgeText: {
    color: BG,
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cardTitle: {
    color: '#F9FAFB',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  cardLocation: {
    color: MUTED,
    fontSize: 11,
    marginBottom: 6,
  },
  cardPrice: {
    color: ACCENT,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  cardMeta: {
    color: MUTED,
    fontSize: 11,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: ACCENT,
    gap: 6,
  },
  notifyButtonText: {
    color: BG,
    fontSize: 12,
    fontWeight: '700',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsButtonText: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: '600',
  },
})
