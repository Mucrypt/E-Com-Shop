import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

type Props = {
  title: string
  description: string
  ctaLabel?: string
  onPress?: () => void
  accentColor?: string
}

const MainPromoBanner: React.FC<Props> = ({
  title,
  description,
  ctaLabel = 'Learn more',
  onPress,
  accentColor = '#F5C451',
}) => {
  return (
    <View style={styles.banner}>
      <View style={{ flex: 1 }}>
        <Text style={styles.bannerTitle}>{title}</Text>
        <Text style={styles.bannerText}>{description}</Text>
      </View>

      <TouchableOpacity
        style={[styles.bannerCta, { backgroundColor: accentColor }]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Text style={styles.bannerCtaText}>{ctaLabel}</Text>
        <FontAwesome name='arrow-right' size={12} color='#050509' />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 10,
    gap: 4,
  },
  bannerCtaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#050509',
  },
})

export default MainPromoBanner
