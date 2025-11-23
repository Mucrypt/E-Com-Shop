// components/main/CuratedSectionCard.tsx
import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'

type Props = {
  title: string
  subtitle: string
  badge?: string
  imageUrl?: string
  onPress?: () => void
}

const CuratedSectionCard: React.FC<Props> = ({
  title,
  subtitle,
  badge,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.textBlock}>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode='cover'
        />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#0B0F1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#111827',
    padding: 12,
    marginBottom: 10,
  },
  textBlock: {
    flex: 1,
    paddingRight: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#111827',
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    color: '#F5C451',
    fontWeight: '600',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
})

export default CuratedSectionCard
