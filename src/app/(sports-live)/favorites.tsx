// app/sports-live/favorites.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors, Spacing, Typography } from '../../constants'

export default function SportsFavoritesScreen() {
  return (
    <View style={styles.root}>
      <MaterialCommunityIcons
        name="star-circle-outline"
        size={60}
        color={Colors.primary[500]}
      />
      <Text style={styles.title}>Your favourite teams & leagues</Text>
      <Text style={styles.subtitle}>
        Soon you’ll be able to follow clubs, players and competitions from all
        sports and see them here.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background.secondary, // Brighter background
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[6],
  },
  title: {
    color: Colors.text.primary,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },
  subtitle: {
    color: Colors.text.muted,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
  },
})
