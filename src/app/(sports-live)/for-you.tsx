// app/sports-live/for-you.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors, Spacing, Typography } from '../../constants'

export default function SportsForYouScreen() {
  return (
    <View style={styles.root}>
      <MaterialCommunityIcons
        name="flash-outline"
        size={56}
        color={Colors.primary[500]}
      />
      <Text style={styles.title}>Smart sport feed</Text>
      <Text style={styles.subtitle}>
        Mukulah will learn what you like and build a live feed with your clubs,
        bets, highlights and news in one place.
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
