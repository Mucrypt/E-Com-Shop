import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useWizardStore } from '../../../utils/wizardStore'
import StepHeader from '../StepHeader'
import { ReviewCard } from '../ReviewCard'
import { Colors, Typography, Spacing, CommonStyles } from '../../../constants'

export default function Step6() {
  const { formData, images, location, price, category, resetAll } = useWizardStore()

  const handlePublish = () => {
    console.log('Publishing...', {
      category,
      ...formData,
      images,
      location,
      price
    })

    resetAll()
    // TODO: Replace with proper success notification
    alert('Published successfully!')
  }

  return (
    <View style={CommonStyles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <StepHeader step={6} title="Review & Publish" />

        <ReviewCard
          data={{
            category: category || undefined,
            ...formData,
            images,
            location,
            price: price || undefined
          }}
        />

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
            <Text style={styles.publishTxt}>🚀 Publish Now</Text>
          </TouchableOpacity>
          
          <Text style={styles.noteText}>
            By publishing, you agree to our terms and conditions
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing[5],
    paddingBottom: Spacing[8],
  },
  actionContainer: {
    marginTop: Spacing[8],
    alignItems: 'center',
  },
  publishBtn: {
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[8],
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  publishTxt: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700' as const,
    color: Colors.background.primary,
    textAlign: 'center',
  },
  noteText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: Spacing[3],
    lineHeight: Typography.lineHeights.relaxed,
  },
})
