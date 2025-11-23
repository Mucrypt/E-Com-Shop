// app/(crypto-hub)/trade.tsx
import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

const orderTabs = ['Convert', 'Spot', 'Margin', 'Buy/Sell', 'Alpha']

export default function CryptoTradeScreen() {
  const [activeTab, setActiveTab] = useState('Margin')

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top order type tabs */}
        <View style={styles.orderTabsRow}>
          {orderTabs.map((tab) => {
            const active = activeTab === tab
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={styles.orderTab}
              >
                <Text style={[styles.orderTabText, active && styles.orderTabTextActive]}>
                  {tab}
                </Text>
                {active && <View style={styles.orderTabUnderline} />}
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Pair title */}
        <Text style={styles.pairTitle}>AVAXUSDT</Text>
        <Text style={styles.pairStatus}>Trading suspended (demo)</Text>

        {/* Warning / info banner */}
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>Margin services disabled</Text>
          <Text style={styles.warningText}>
            This is the Mukulah demo trading form. Real margin / futures logic
            will be connected later to your strategy engine.
          </Text>
        </View>

        {/* Basic buy/sell form layout */}
        <View style={styles.buySellTabsRow}>
          <TouchableOpacity style={[styles.buySellTab, styles.buyActive]}>
            <Text style={styles.buySellTextActive}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buySellTab}>
            <Text style={styles.buySellTextInactive}>Sell</Text>
          </TouchableOpacity>
        </View>

        {/* Order block (simplified) */}
        <View style={styles.orderCard}>
          <Text style={styles.fieldLabel}>Order type</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Limit</Text>
          </View>

          <Text style={styles.fieldLabel}>Price (USDT)</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldPlaceholder}>0.0000</Text>
          </View>

          <Text style={styles.fieldLabel}>Amount (AVAX)</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldPlaceholder}>0</Text>
          </View>

          <View style={styles.sliderPlaceholder}>
            <Text style={styles.sliderText}>[ Position size slider ]</Text>
          </View>

          <View style={styles.orderFooterRow}>
            <Text style={styles.orderFooterLabel}>Available</Text>
            <Text style={styles.orderFooterValue}>0.0000 AVAX</Text>
          </View>

          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Margin Buy</Text>
          </TouchableOpacity>
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
  orderTabsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  orderTab: {
    marginRight: 16,
    alignItems: 'center',
  },
  orderTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  orderTabTextActive: {
    color: '#F9FAFB',
  },
  orderTabUnderline: {
    marginTop: 3,
    height: 2,
    width: '100%',
    backgroundColor: '#F5C451',
    borderRadius: 999,
  },

  pairTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F9FAFB',
  },
  pairStatus: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 10,
  },

  warningCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  buySellTabsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  buySellTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#111827',
  },
  buyActive: {
    backgroundColor: '#16A34A',
  },
  buySellTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  buySellTextInactive: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5E7EB',
  },

  orderCard: {
    backgroundColor: '#0B0F1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#111827',
    padding: 12,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
    marginBottom: 4,
  },
  fieldBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F2937',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  fieldValue: {
    fontSize: 13,
    color: '#F9FAFB',
  },
  fieldPlaceholder: {
    fontSize: 13,
    color: '#6B7280',
  },
  sliderPlaceholder: {
    marginTop: 12,
    marginBottom: 10,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderText: {
    fontSize: 11,
    color: '#6B7280',
  },
  orderFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderFooterLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  orderFooterValue: {
    fontSize: 11,
    color: '#E5E7EB',
  },
  submitBtn: {
    borderRadius: 10,
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F9FAFB',
  },
})
