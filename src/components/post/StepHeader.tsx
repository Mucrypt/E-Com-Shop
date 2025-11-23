import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Colors, Typography, Spacing } from '../../constants'

type StepHeaderProps = {
  step: number
  title: string
}

export default function StepHeader({ step, title }: StepHeaderProps) {
  const router = useRouter()
  
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.step}>Step {step} of 6</Text>
      </View>
      <View style={styles.spacer} />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[5],
    paddingVertical: Spacing[2],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: Colors.text.primary,
    fontSize: Typography.sizes['2xl'],
    fontWeight: '700' as const,
  },
  step: {
    color: Colors.text.muted,
    fontSize: Typography.sizes.sm,
    marginTop: Spacing[1],
  },
  spacer: {
    width: 40,
  },
})
