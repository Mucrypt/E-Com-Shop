// app/(crypto-hub)/index.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { NavigationHeader } from '../../components/common'

const earnProducts = [
  { symbol: 'USDC', apr: '5.77%', type: 'Flexible' },
  { symbol: 'BTC', apr: '0.26%', type: 'Flexible' },
  { symbol: 'XRP', apr: '0.26%', type: 'Flexible' },
]

const shortcuts = [
  { key: 'rwusd', label: 'RWUSD', icon: 'circle-o' as const },
  { key: 'simple', label: 'Simple Earn', icon: 'refresh' as const },
  { key: 'staking', label: 'SOL Staking', icon: 'bars' as const },
  { key: 'loan', label: 'Loan', icon: 'money' as const },
]

export default function CryptoHubHome() {
  const [showBalance, setShowBalance] = useState(true)
  const [activeTop, setActiveTop] = useState<'earn' | 'trading' | 'launchpool'>(
    'earn',
  )
  const router = useRouter()

  const handleProfilePress = () => {
    router.push('/(profile)')
  }

  return (
    <View style={styles.root}>
      <NavigationHeader 
        title="Crypto Hub"
        backgroundColor="#050509"
        textColor="#F5C451"
        statusBarStyle="light-content"
        rightComponent={
          <View style={{ flexDirection: 'row', gap: 15 }}>
            <TouchableOpacity>
              <MaterialIcons name="notifications-none" size={22} color="#F5C451" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleProfilePress}>
              <FontAwesome name="user-circle-o" size={20} color="#F5C451" />
            </TouchableOpacity>
          </View>
        }
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top segmented: Earn / Trading / Launchpool */}
        <View style={styles.topTabsRow}>
          {['Earn', 'Trading', 'Launchpool'].map((tab) => {
            const key = tab.toLowerCase() as typeof activeTop
            const isActive = activeTop === key
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTop(key)}
                style={[styles.topTab, isActive && styles.topTabActive]}
              >
                <Text
                  style={[
                    styles.topTabText,
                    isActive && styles.topTabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Search bar for coin / product */}
        <View style={styles.searchBar}>
          <FontAwesome name="diamond" size={16} color="#4ADE80" />
          <TextInput
            placeholder="Search asset or product..."
            placeholderTextColor="#8589A0"
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.searchIconRight}>
            <FontAwesome name="search" size={16} color="#E5E7EB" />
          </TouchableOpacity>
        </View>

        {/* Balance block */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Est. Total Value</Text>
            <TouchableOpacity onPress={() => setShowBalance((x) => !x)}>
              <FontAwesome
                name={showBalance ? 'eye' : 'eye-slash'}
                size={16}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.balanceNumbers}>
            <Text style={styles.balanceMain}>
              {showBalance ? '0.00000983 BTC' : '•••••••• BTC'}
            </Text>
            <Text style={styles.balanceFiat}>
              ≈ €0.72{showBalance ? '233496' : '••••••'}
            </Text>
          </View>
          <View style={styles.pnlRow}>
            <Text style={styles.pnlLabel}>Today's PNL</Text>
            <Text style={styles.pnlValue}>-€0.00432362 (-0.59%)</Text>
          </View>

          <View style={styles.balanceButtonsRow}>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Add Funds</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* APR promo banner */}
        <View style={styles.aprBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.aprTitle}>
              Earn up to <Text style={styles.aprHighlight}>5.77% APR</Text>
            </Text>
            <Text style={styles.aprSubtitle}>
              Turn idle assets into rewards automatically.
            </Text>
          </View>
          <TouchableOpacity style={styles.aprButton}>
            <Text style={styles.aprButtonText}>Activate</Text>
          </TouchableOpacity>
        </View>

        {/* Shortcuts row */}
        <View style={styles.shortcutsRow}>
          {shortcuts.map((s) => (
            <TouchableOpacity key={s.key} style={styles.shortcutItem}>
              <View style={styles.shortcutCircle}>
                <FontAwesome name={s.icon} size={18} color="#F5C451" />
              </View>
              <Text style={styles.shortcutLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Earn product cards */}
        <View style={styles.earnCardsContainer}>
          {earnProducts.map((p) => (
            <View key={p.symbol} style={styles.earnCard}>
              <View style={styles.earnHeaderRow}>
                <View style={styles.coinAvatar}>
                  <Text style={styles.coinAvatarText}>
                    {p.symbol.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.earnSymbol}>{p.symbol}</Text>
                  <View style={styles.earnTag}>
                    <Text style={styles.earnTagText}>{p.type}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.earnAprBlock}>
                <Text style={styles.earnAprValue}>{p.apr}</Text>
                <Text style={styles.earnAprLabel}>APR</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Big bottom banner */}
        <View style={styles.bottomPromo}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bottomPromoTitle}>
              Grab 20% APR Mukulah Trial Fund
            </Text>
            <Text style={styles.bottomPromoSubtitle}>
              New users: auto-earn while exploring the Crypto Hub.
            </Text>
          </View>
          <FontAwesome name="arrow-right" size={18} color="#F5C451" />
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

  topTabsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  topTab: {
    marginRight: 16,
    paddingBottom: 4,
  },
  topTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#F5C451',
  },
  topTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  topTabTextActive: {
    color: '#F9FAFB',
  },

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
  searchIconRight: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0B0F1A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  balanceCard: {
    backgroundColor: '#0B0F1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#111827',
    padding: 14,
    marginBottom: 14,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  balanceNumbers: {
    marginTop: 8,
  },
  balanceMain: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F9FAFB',
  },
  balanceFiat: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  pnlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10,
  },
  pnlLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  pnlValue: {
    fontSize: 12,
    color: '#F97316',
  },
  balanceButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryBtn: {
    flex: 1,
    marginRight: 6,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F5C451',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#050509',
  },
  secondaryBtn: {
    flex: 1,
    marginLeft: 6,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1F2937',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E7EB',
  },

  aprBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  aprTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  aprHighlight: {
    color: '#22C55E',
  },
  aprSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  aprButton: {
    marginLeft: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F5C451',
  },
  aprButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#050509',
  },

  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  shortcutItem: {
    alignItems: 'center',
  },
  shortcutCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  shortcutLabel: {
    fontSize: 11,
    color: '#E5E7EB',
  },

  earnCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  earnCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0B0F1A',
    borderWidth: 1,
    borderColor: '#111827',
  },
  earnHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  coinAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  coinAvatarText: {
    color: '#F5C451',
    fontWeight: '700',
  },
  earnSymbol: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  earnTag: {
    marginTop: 2,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  earnTagText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  earnAprBlock: {
    alignItems: 'flex-start',
  },
  earnAprValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F5C451',
  },
  earnAprLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  bottomPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#050812',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 14,
    marginTop: 4,
  },
  bottomPromoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  bottomPromoSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
  },
})
