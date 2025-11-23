import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const AboutMukulahSection: React.FC = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>What is Mukulah Universe?</Text>
      <Text style={styles.paragraph}>
        Mukulah is not just another app. It’s a living ecosystem where
        commerce, media, jobs, services, sports and crypto all connect in one
        interface. Built for creators, builders and everyday people.
      </Text>
      <View style={styles.tagsRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Own your data</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Multi-universe</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Africa + World</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0B0F1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#111827',
    padding: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  heading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 11,
    color: '#9CA3AF',
    lineHeight: 16,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  tagText: {
    fontSize: 10,
    color: '#E5E7EB',
  },
})

export default AboutMukulahSection
