// app/(travel)/index.tsx
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
import TravelSidebar from '../../components/travel/TravelSidebar'
import NavigationHeader from '../../components/common/NavigationHeader'

type Destination = {
  id: string
  name: string
  country: string
  tag: string
  priceFrom: string
  imageUrl: string
  rating: number
}

const popularDestinations: Destination[] = [
  {
    id: '1',
    name: 'Bali',
    country: 'Indonesia',
    tag: 'Beach • Digital nomads',
    priceFrom: '€32/night',
    imageUrl: 'https://picsum.photos/seed/travel-bali/600/380',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Florence',
    country: 'Italy',
    tag: 'Art • Food • History',
    priceFrom: '€58/night',
    imageUrl: 'https://picsum.photos/seed/travel-florence/600/380',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Dubai',
    country: 'UAE',
    tag: 'Luxury • Business',
    priceFrom: '€75/night',
    imageUrl: 'https://picsum.photos/seed/travel-dubai/600/380',
    rating: 4.7,
  },
]

const quickFilters = ['Stays', 'Flights', 'Road trips', 'Experiences', 'Work trips']

const TravelHomeScreen = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tab, setTab] = useState<'Discover' | 'Stays' | 'Flights' | 'Routes'>(
    'Discover',
  )

  return (
    <View style={styles.root}>
      <NavigationHeader
        title="Mukulah Travel"
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => setSidebarOpen(true)}
            >
              <FontAwesome name="bars" size={16} color="#F9FAFB" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle}>
              <FontAwesome name="bell-o" size={16} color="#F9FAFB" />
            </TouchableOpacity>
          </View>
        }
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Travel subtitle */}
        <Text style={styles.travelSubtitle}>Plan everything in one place</Text>

        {/* Main search module */}
        <View style={styles.searchCard}>
          <Text style={styles.sectionLabel}>Where to?</Text>

          <View style={styles.inputRow}>
            <FontAwesome name="map-marker" size={16} color="#9CA3AF" />
            <TextInput
              placeholder="City, region, country..."
              placeholderTextColor="#6B7280"
              style={styles.input}
            />
          </View>

          <View style={styles.inlineRow}>
            <View style={styles.inlineField}>
              <Text style={styles.inlineLabel}>Dates</Text>
              <Text style={styles.inlineValue}>Choose dates</Text>
            </View>
            <View style={styles.inlineDivider} />
            <View style={styles.inlineField}>
              <Text style={styles.inlineLabel}>Guests</Text>
              <Text style={styles.inlineValue}>1 adult, 0 children</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton}>
            <FontAwesome name="search" size={14} color="#050509" />
            <Text style={styles.primaryButtonText}>Search trips</Text>
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickFiltersRow}
          >
            {quickFilters.map((f) => (
              <TouchableOpacity key={f} style={styles.chip}>
                <Text style={styles.chipText}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tabs inside travel home */}
        <View style={styles.topTabsRow}>
          {(['Discover', 'Stays', 'Flights', 'Routes'] as const).map((name) => {
            const active = tab === name
            return (
              <TouchableOpacity
                key={name}
                onPress={() => setTab(name)}
                style={[styles.topTabChip, active && styles.topTabChipActive]}
              >
                <Text
                  style={[styles.topTabLabel, active && styles.topTabLabelActive]}
                >
                  {name}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Promo banner for partners */}
        <View style={styles.promoCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.promoTitle}>Promote your hotel or service</Text>
            <Text style={styles.promoText}>
              Hotels, restaurants, taxi companies and travel agencies can reach
              Mukulah users across the world with smart, targeted campaigns.
            </Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Advertise on Mukulah</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promoBadge}>
            <FontAwesome name="line-chart" size={18} color="#F5C451" />
          </View>
        </View>

        {/* Popular destinations */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Popular this season</Text>
          <TouchableOpacity>
            <Text style={styles.sectionSeeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.destinationsRow}
        >
          {popularDestinations.map((d) => (
            <TouchableOpacity
              key={d.id}
              style={styles.destinationCard}
              activeOpacity={0.9}
              onPress={() => router.push('/(travel)/destination-detail')}
            >
              <Image
                source={{ uri: d.imageUrl }}
                style={styles.destinationImage}
              />
              <View style={styles.destinationContent}>
                <View style={styles.destinationHeaderRow}>
                  <View>
                    <Text style={styles.destinationName}>{d.name}</Text>
                    <Text style={styles.destinationCountry}>{d.country}</Text>
                  </View>
                  <View style={styles.ratingTag}>
                    <FontAwesome name="star" size={12} color="#FBBF24" />
                    <Text style={styles.ratingText}>{d.rating.toFixed(1)}</Text>
                  </View>
                </View>
                <Text style={styles.destinationTag}>{d.tag}</Text>
                <Text style={styles.destinationPrice}>From {d.priceFrom}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Multi-mode highlight cards */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>All your travel in one app</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <View style={styles.gridIconCircle}>
              <FontAwesome name="hotel" size={16} color="#F5C451" />
            </View>
            <Text style={styles.gridTitle}>Stay</Text>
            <Text style={styles.gridText}>
              Hotels, apartments and long-stay homes with honest reviews.
            </Text>
          </View>
          <View style={styles.gridCard}>
            <View style={styles.gridIconCircle}>
              <FontAwesome name="plane" size={16} color="#F87171" />
            </View>
            <Text style={styles.gridTitle}>Move</Text>
            <Text style={styles.gridText}>
              Flights, trains, buses and airport transfers – optimized by price.
            </Text>
          </View>
          <View style={styles.gridCard}>
            <View style={styles.gridIconCircle}>
              <FontAwesome name="map" size={16} color="#34D399" />
            </View>
            <Text style={styles.gridTitle}>Explore</Text>
            <Text style={styles.gridText}>
              Experiences, tours and local guides that match your interests.
            </Text>
          </View>
          <View style={styles.gridCard}>
            <View style={styles.gridIconCircle}>
              <FontAwesome name="briefcase" size={16} color="#60A5FA" />
            </View>
            <Text style={styles.gridTitle}>Work & business</Text>
            <Text style={styles.gridText}>
              Smart itineraries for conferences, remote work and business trips.
            </Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <TravelSidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  )
}

export default TravelHomeScreen

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050509',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  travelSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0B0F1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#111827',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#9CA3AF',
    fontSize: 11,
  },

  searchCard: {
    backgroundColor: '#0B0F1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#111827',
    padding: 12,
    marginBottom: 12,
  },
  sectionLabel: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#050509',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#111827',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: '#F9FAFB',
    fontSize: 14,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#050509',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#111827',
    marginBottom: 10,
  },
  inlineField: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inlineDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#111827',
  },
  inlineLabel: {
    color: '#6B7280',
    fontSize: 11,
  },
  inlineValue: {
    color: '#F9FAFB',
    fontSize: 13,
    marginTop: 2,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5C451',
    borderRadius: 999,
    paddingVertical: 10,
    gap: 6,
    marginBottom: 8,
  },
  primaryButtonText: {
    color: '#050509',
    fontWeight: '700',
    fontSize: 13,
  },
  quickFiltersRow: {
    paddingTop: 2,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  chipText: {
    color: '#E5E7EB',
    fontSize: 11,
  },

  topTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  topTabChip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#0B0F1A',
    alignItems: 'center',
  },
  topTabChipActive: {
    backgroundColor: '#111827',
  },
  topTabLabel: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  topTabLabelActive: {
    color: '#F9FAFB',
    fontWeight: '700',
  },

  promoCard: {
    flexDirection: 'row',
    backgroundColor: '#0B0F1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#111827',
    padding: 12,
    marginBottom: 14,
  },
  promoTitle: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  promoText: {
    color: '#D1D5DB',
    fontSize: 12,
    marginBottom: 8,
  },
  promoButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5C451',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  promoButtonText: {
    color: '#050509',
    fontSize: 11,
    fontWeight: '700',
  },
  promoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    alignSelf: 'center',
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionSeeAll: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  destinationsRow: {
    paddingVertical: 6,
    gap: 10,
  },
  destinationCard: {
    width: 230,
    backgroundColor: '#0B0F1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#111827',
    overflow: 'hidden',
  },
  destinationImage: {
    width: '100%',
    height: 130,
  },
  destinationContent: {
    padding: 10,
  },
  destinationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  destinationName: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '700',
  },
  destinationCountry: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  destinationTag: {
    color: '#D1D5DB',
    fontSize: 11,
    marginBottom: 2,
  },
  destinationPrice: {
    color: '#F5C451',
    fontSize: 12,
    fontWeight: '700',
  },
  ratingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  ratingText: {
    color: '#F9FAFB',
    fontSize: 11,
    fontWeight: '600',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  gridCard: {
    flexBasis: '48%',
    backgroundColor: '#0B0F1A',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#111827',
  },
  gridIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#050509',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  gridTitle: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  gridText: {
    color: '#9CA3AF',
    fontSize: 11,
  },
})
