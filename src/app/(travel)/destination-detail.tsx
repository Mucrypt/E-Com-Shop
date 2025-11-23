import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Colors, Typography, Spacing, CommonStyles } from '../../constants'

export default function DestinationDetailScreen() {
  return (
    <View style={CommonStyles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Destination Details</Text>
          <Text style={styles.description}>
            Explore amazing travel destinations around the world.
          </Text>
          
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              🏝️ Destination content will be displayed here
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing[4],
  },
  title: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: '700' as const,
    lineHeight: Typography.lineHeights.snug,
    color: Colors.text.primary,
    marginBottom: Spacing[4],
  },
  description: {
    fontSize: Typography.sizes.lg,
    fontWeight: '400' as const,
    lineHeight: Typography.lineHeights.normal,
    color: Colors.text.secondary,
    marginBottom: Spacing[6],
  },
  placeholder: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: Spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  placeholderText: {
    fontSize: Typography.sizes.base,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.normal,
  },
})