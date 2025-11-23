// app/(crypto-hub)/assets.tsx
import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

const topTabs = ['Overview', 'Earn', 'Spot', 'Funding']

const balances = [
  { label: 'Earn', value: '0.00000583 BTC', fiat: '≈ €0.4280982' },
  { label: 'Spot', value: '0.00000397 BTC', fiat: '≈ €0.29159054' },
  { label: 'Funding', value: '0.00000004 BTC', fiat: '≈ €0.00264621' },
]

export default function CryptoAssetsScreen() {
  const [activeTab, setActiveTab] = useState('Overview')

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top tabs */}
        <View style={styles.topTabsRow}>
          {topTabs.map((tab) => {
            const active = activeTab === tab
            return (
              <TouchableOpacity
                key={tab}
                style={styles.topTab}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.topTabText, active && styles.topTabTextActive]}>
                  {tab}
                </Text>
                {active && <View style={styles.topTabUnderline} />}
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Total value */}
        <Text style={styles.label}>Est. Total Value (BTC)</Text>
        <Text style={styles.totalValue}>0.00000983 BTC</Text>
        <Text style={styles.totalFiat}>≈ €0.72233496</Text>
        <Text style={styles.pnl}>Today's PNL -€0.00401602 (-0.55%)</Text>

        <View style={styles.actionsRow}>
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

        {/* Crypto / Account segment */}
        <View style={styles.segmentRow}>
          <Text style={[styles.segmentLabel, styles.segmentLabelInactive]}>
            Crypto
          </Text>
          <Text style={[styles.segmentLabel, styles.segmentLabelActive]}>
            Account
          </Text>
        </View>

        {/* Balances list */}
        <View style={styles.card}>
          {balances.map((b) => (
            <View key={b.label} style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>{b.label}</Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.balanceValue}>{b.value}</Text>
                <Text style={styles.balanceFiat}>{b.fiat}</Text>
              </View>
            </View>
          ))}
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
    marginBottom: 10,
  },
  topTab: {
    marginRight: 16,
    alignItems: 'center',
  },
  topTabText: {
    fontSize: 16,
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

  label: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F9FAFB',
  },
  totalFiat: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  pnl: {
    fontSize: 12,
    color: '#F97316',
    marginBottom: 10,
  },

  actionsRow: {
    flexDirection: 'row',
    marginBottom: 16,
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

  segmentRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 16,
  },
  segmentLabelInactive: {
    color: '#6B7280',
  },
  segmentLabelActive: {
    color: '#F9FAFB',
    borderBottomWidth: 2,
    borderBottomColor: '#F5C451',
    paddingBottom: 2,
  },

  card: {
    backgroundColor: '#0B0F1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#111827',
    padding: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#111827',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#F9FAFB',
  },
  balanceValue: {
    fontSize: 13,
    color: '#F9FAFB',
  },
  balanceFiat: {
    fontSize: 11,
    color: '#9CA3AF',
  },
})
