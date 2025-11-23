import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

const brands = [
  { key: 'bybit', name: 'Bybit Labs' },
  { key: 'aws', name: 'AWS Startups' },
  { key: 'stripe', name: 'Stripe Connect' },
  { key: 'supabase', name: 'Supabase' },
  { key: 'vercel', name: 'Vercel' },
  { key: 'openai', name: 'OpenAI' },
]

const SupportingBrandsStrip: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Supported by</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {brands.map((brand) => (
          <View key={brand.key} style={styles.brandPill}>
            <Text style={styles.brandText}>{brand.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  row: {
    paddingRight: 4,
  },
  brandPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1F2937',
    backgroundColor: '#050509',
    marginRight: 8,
  },
  brandText: {
    fontSize: 11,
    color: '#E5E7EB',
    fontWeight: '600',
  },
})

export default SupportingBrandsStrip
