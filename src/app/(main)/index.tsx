// app/core/index.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '../../providers'
import NavigationHeader from '../../components/common/NavigationHeader'

import MainFeatureGrid, {
  MainFeatureItem,
} from '../../components/main/MainFeatureGrid'
import MainPromoBanner from '../../components/main/MainPromoBanner'
import TrendingPillsRow from '../../components/main/TrendingPillsRow'
import SportsCryptoWidget from '../../components/main/SportsCryptoWidget'
import CuratedSections from '../../components/main/CuratedSections'
import SupportingBrandsStrip from '../../components/main/SupportingBrandsStrip'
import AboutMukulahSection from '../../components/main/AboutMukulahSection'
import BlogHighlights from '../../components/main/BlogHighlights'
import AdSlotBanner from '../../components/main/AdSlotBanner'

const featureItems: MainFeatureItem[] = [
  {
    key: 'commerce',
    label: 'Marketplace',
    icon: 'shopping-bag',
    onPress: () => router.push('/(shop)'),
  },
  {
    key: 'media',
    label: 'Media',
    icon: 'play',
    onPress: () => router.push('/(media)'),
  },
  {
    key: 'jobs',
    label: 'Jobs',
    icon: 'briefcase',
    onPress: () => router.push('/(jobs)'),
  },

  {
    key: 'travel',
    label: 'Travel',
    icon: 'plane',
    onPress: () => router.push('/(travel)'),
  },
  {
    key: 'market',
    label: 'Second-hand',
    icon: 'exchange',
    onPress: () => router.push('/market'),
  },
  {
    key: 'services',
    label: 'Services',
    icon: 'handshake-o',
    onPress: () => router.push('/(services)'),
  },
  {
      key: 'realestate',
  label: 'Real Estate',
  icon: 'building',
    onPress: () => router.push('/(real-estate)'),
  },
  {
    key: 'sports',
    label: 'Live Scores',
    icon: 'soccer-ball-o',
    onPress: () => router.push('/(sports-live)'),
  },
  {
    key: 'crypto',
    label: 'Crypto Hub',
    icon: 'bitcoin',
    onPress: () => router.push('/(crypto-hub)'),
  },
  {
    key: 'more',
    label: 'More',
    icon: 'ellipsis-h',
    onPress: () => router.push('/(main)/more'),
  },
]

const categoryTabs = ['Favorites', 'Hot', 'New', 'Gainers', 'Losers', 'Trends']

export default function CoreHome() {
  const { user } = useAuth()
  const [activeCategory, setActiveCategory] = useState('Favorites')

  const firstName =
    user?.user_metadata?.name ??
    user?.email?.split('@')[0] ??
    'Explorer'

  return (
    <View style={styles.root}>
      <NavigationHeader
        title="Mukulah"
        rightComponent={
          <View style={styles.headerActions}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {firstName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={styles.headerIconButton}>
              <FontAwesome name='headphones' size={18} color='#E5E7EB' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton}>
              <FontAwesome name='bell-o' size={18} color='#E5E7EB' />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Universe/Web3 segment toggle */}
        <View style={styles.segmentWrapper}>
          <View style={styles.segmentBackground}>
            <View style={styles.segmentPillActive}>
              <Text style={styles.segmentTextActive}>Universe</Text>
            </View>
            <View style={styles.segmentPillInactive}>
              <Text style={styles.segmentTextInactive}>Web3</Text>
            </View>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <FontAwesome name='search' size={16} color='#8589A0' />
          <TextInput
            placeholder='Search anything on Mukulah...'
            placeholderTextColor='#8589A0'
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.qrButton}>
            <FontAwesome name='qrcode' size={18} color='#E5E7EB' />
          </TouchableOpacity>
        </View>

        {/* Overview / universe summary */}
        <View style={styles.overviewRow}>
          <View>
            <Text style={styles.overviewLabel}>Your universe</Text>
            <Text style={styles.overviewValue}>All in one place</Text>
            <Text style={styles.overviewHint}>
              Commerce, media, jobs, services & more.
            </Text>
          </View>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Explore now</Text>
          </TouchableOpacity>
        </View>

        {/* Main feature grid: e-commerce, media, jobs, market, services, sports, crypto */}
        <MainFeatureGrid items={featureItems} />

        {/* Promo banner for the whole ecosystem */}
        <MainPromoBanner
          title='Mukulah Spotlight'
          description='Discover trending creators, live sessions and hot deals across the whole ecosystem.'
          ctaLabel='Explore'
          onPress={() => router.push('/(shop)')}
        />

        {/* Combined sports + crypto widget */}
        <SportsCryptoWidget
          sports={{
            sportTitle: 'Champions League',
            teamA: 'Inter',
            teamB: 'Barcelona',
            score: '2 : 1',
            status: 'Live 72’',
          }}
          crypto={{
            pair: 'BTC/USDT',
            price: '87,060.00',
            change: '+3.37%',
          }}
        />

        {/* Trending / category pills */}
        <TrendingPillsRow
          tabs={categoryTabs}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {/* Curated / discover sections */}
        <CuratedSections activeCategory={activeCategory} />

                {/* Brands that support Mukulah */}
        <SupportingBrandsStrip />

        {/* About / hype section */}
        <AboutMukulahSection />

        {/* Blog / journal highlights */}
        <BlogHighlights />

        {/* Ad / campaign slot for future ad engine */}
        <AdSlotBanner />

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

  // header
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#F5C451',
    fontWeight: '700',
    fontSize: 16,
  },
  segmentWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  segmentBackground: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 999,
    padding: 2,
  },
  segmentPillActive: {
    flex: 1,
    backgroundColor: '#F5C451',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  segmentPillInactive: {
    flex: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  segmentTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#050509',
  },
  segmentTextInactive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  headerIcons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  headerIconButton: {
    paddingHorizontal: 6,
  },

  // search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    color: '#E5E7EB',
    fontSize: 14,
  },
  qrButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B0F1A',
  },

  // overview
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0B0F1A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#111827',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  overviewHint: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  primaryButton: {
    backgroundColor: '#F5C451',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#050509',
  },
})
