import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

type Props = {
  title?: string
  description?: string
}

const AdSlotBanner: React.FC<Props> = ({
  title = 'Promote on Mukulah',
  description = 'Run targeted campaigns across marketplace, media, jobs and more. Ads follow what users are truly interested in.',
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.badgeRow}>
        <View style={styles.adBadge}>
          <Text style={styles.adBadgeText}>Advert</Text>
        </View>
        <Text style={styles.subBadge}>For businesses & creators</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Create campaign</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn}>
          <FontAwesome name='info-circle' size={12} color='#E5E7EB' />
          <Text style={styles.secondaryBtnText}>Learn how it works</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#050812',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 14,
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  adBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#F97316',
  },
  adBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#050509',
  },
  subBadge: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  primaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#F5C451',
  },
  primaryBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#050509',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 4,
  },
  secondaryBtnText: {
    fontSize: 11,
    color: '#E5E7EB',
  },
})

export default AdSlotBanner
