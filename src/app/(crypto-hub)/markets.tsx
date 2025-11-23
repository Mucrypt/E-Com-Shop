// app/(crypto-hub)/markets.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

const pairs = [
  { name: 'ADA/EUR', vol: '1.30M', price: '0.3479', fiat: '€0.3478', change: '-3.55%' },
  { name: 'AVAX/EUR', vol: '182,314.38', price: '11.48', fiat: '€11.48', change: '-1.46%' },
  { name: 'BCH/EUR', vol: '475,438.46', price: '476.4', fiat: '€476.39', change: '+7.49%' },
  { name: 'BNB/EUR', vol: '2.96M', price: '719.05', fiat: '€719.05', change: '-0.52%' },
  { name: 'BTC/EUR', vol: '27.62M', price: '73,440.44', fiat: '€73,440.43', change: '-0.71%' },
  { name: 'DOGE/EUR', vol: '1.20M', price: '0.12077', fiat: '€0.12077', change: '-2.51%' },
  { name: 'DOT/EUR', vol: '347,949.07', price: '1.989', fiat: '€1.98', change: '-5.42%' },
]

const topTabs = ['Favorites', 'Market', 'Alpha', 'Square', 'Data']
const subTabs = ['Crypto', 'Spot', 'USDⓈ-M', 'COIN-M', 'Options']

export default function CryptoMarketsScreen() {
  const [activeTop, setActiveTop] = useState('Market')
  const [activeSub, setActiveSub] = useState('Spot')

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={16} color="#8589A0" />
          <TextInput
            placeholder="Search coin pairs"
            placeholderTextColor="#8589A0"
            style={styles.searchInput}
          />
          <TouchableOpacity>
            <FontAwesome name="ellipsis-h" size={18} color="#E5E7EB" />
          </TouchableOpacity>
        </View>

        {/* Top category tabs */}
        <View style={styles.topTabsRow}>
          {topTabs.map((tab) => {
            const active = activeTop === tab
            return (
              <TouchableOpacity
                key={tab}
                style={styles.topTab}
                onPress={() => setActiveTop(tab)}
              >
                <Text style={[styles.topTabText, active && styles.topTabTextActive]}>
                  {tab}
                </Text>
                {active && <View style={styles.topTabUnderline} />}
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Sub-tabs row */}
        <View style={styles.subTabsRow}>
          {subTabs.map((tab) => {
            const active = activeSub === tab
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.subTab,
                  active && styles.subTabActive,
                ]}
                onPress={() => setActiveSub(tab)}
              >
                <Text
                  style={[
                    styles.subTabText,
                    active && styles.subTabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1.4 }}>
            <Text style={styles.headerText}>Name / Vol</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>Last Price</Text>
          </View>
          <View style={{ width: 88, alignItems: 'flex-end' }}>
            <Text style={styles.headerText}>24h Chg%</Text>
          </View>
        </View>

        {/* Market rows */}
        {pairs.map((p) => {
          const positive = p.change.startsWith('+')
          return (
            <View key={p.name} style={styles.row}>
              <View style={{ flex: 1.4 }}>
                <Text style={styles.pairName}>{p.name}</Text>
                <Text style={styles.pairVol}>{p.vol}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.pairPrice}>{p.price}</Text>
                <Text style={styles.pairFiat}>{p.fiat}</Text>
              </View>
              <View style={{ width: 88, alignItems: 'flex-end' }}>
                <View
                  style={[
                    styles.changeBadge,
                    { backgroundColor: positive ? '#16A34A' : '#DC2626' },
                  ]}
                >
                  <Text style={styles.changeText}>{p.change}</Text>
                </View>
              </View>
            </View>
          )
        })}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    color: '#E5E7EB',
    fontSize: 14,
  },

  topTabsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  topTab: {
    marginRight: 16,
    alignItems: 'center',
  },
  topTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  topTabTextActive: {
    color: '#F9FAFB',
  },
  topTabUnderline: {
    marginTop: 3,
    height: 2,
    width: '100%',
    backgroundColor: '#F5C451',
    borderRadius: 999,
  },

  subTabsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  subTab: {
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  subTabActive: {
    backgroundColor: '#111827',
    borderColor: '#F5C451',
  },
  subTabText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  subTabTextActive: {
    color: '#F9FAFB',
    fontWeight: '600',
  },

  headerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  headerText: {
    fontSize: 11,
    color: '#6B7280',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#111827',
  },
  pairName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  pairVol: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  pairPrice: {
    fontSize: 13,
    color: '#F9FAFB',
  },
  pairFiat: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  changeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 11,
    color: '#F9FAFB',
    fontWeight: '600',
  },
})
