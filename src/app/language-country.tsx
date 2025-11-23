import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native'
import { router } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { Colors, Typography, Spacing, Shadows } from '../constants'

interface Country {
  code: string
  name: string
  flag: string
  language: string
}

const countries: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', language: 'English' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', language: 'English' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', language: 'English/French' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', language: 'English' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', language: 'German' },
  { code: 'FR', name: 'France', flag: '🇫🇷', language: 'French' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', language: 'Spanish' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', language: 'Italian' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', language: 'Japanese' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', language: 'Korean' },
  { code: 'CN', name: 'China', flag: '🇨🇳', language: 'Chinese' },
  { code: 'IN', name: 'India', flag: '🇮🇳', language: 'Hindi/English' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', language: 'Portuguese' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', language: 'Spanish' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', language: 'Russian' },
]

const LanguageCountryScreen = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
  }

  const handleContinue = () => {
    // Here you would typically save the selection to storage/context
    // For now, just navigate to the main app
    router.replace('/(main)')
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor={Colors.primary[500]} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <FontAwesome name='chevron-left' size={20} color={Colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Select Country & Language</Text>
          <Text style={styles.headerSubtitle}>
            Choose your preferred shopping region
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.instructionText}>
          Select your country to get the best shopping experience with local
          pricing, delivery options, and language preferences.
        </Text>

        <View style={styles.countriesList}>
          {countries.map((country) => (
            <TouchableOpacity
              key={country.code}
              style={[
                styles.countryItem,
                selectedCountry?.code === country.code &&
                  styles.selectedCountryItem,
              ]}
              onPress={() => handleCountrySelect(country)}
              activeOpacity={0.7}
            >
              <View style={styles.countryInfo}>
                <Text style={styles.flagText}>{country.flag}</Text>
                <View style={styles.countryDetails}>
                  <Text
                    style={[
                      styles.countryName,
                      selectedCountry?.code === country.code &&
                        styles.selectedText,
                    ]}
                  >
                    {country.name}
                  </Text>
                  <Text
                    style={[
                      styles.languageText,
                      selectedCountry?.code === country.code &&
                        styles.selectedLanguageText,
                    ]}
                  >
                    {country.language}
                  </Text>
                </View>
              </View>

              {selectedCountry?.code === country.code && (
                <FontAwesome name='check-circle' size={24} color={Colors.primary[500]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      {selectedCountry && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              Continue with {selectedCountry.name}
            </Text>
            <FontAwesome name='chevron-right' size={16} color={Colors.background.primary} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary[500],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[5],
    paddingTop: Spacing[8], // Increased padding to avoid status bar overlap
  },
  backButton: {
    padding: Spacing[2],
    marginRight: Spacing[4],
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.background.primary,
    marginBottom: Spacing[1],
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: Spacing[6],
  },
  instructionText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginHorizontal: Spacing[7],
    marginBottom: Spacing[7],
    lineHeight: 24,
  },
  countriesList: {
    paddingHorizontal: Spacing[5],
    paddingBottom: 100,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    marginBottom: Spacing[3],
    borderRadius: 12,
    ...Shadows.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCountryItem: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.background.tertiary,
    ...Shadows.lg,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagText: {
    fontSize: 32,
    marginRight: Spacing[4],
  },
  countryDetails: {
    flex: 1,
  },
  countryName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  selectedText: {
    color: Colors.primary[500],
  },
  languageText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  selectedLanguageText: {
    color: Colors.primary[500],
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing[7],
    paddingVertical: Spacing[5],
    paddingBottom: Spacing[7],
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    ...Shadows.xl,
  },
  continueButton: {
    backgroundColor: Colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[4],
    borderRadius: 25,
    ...Shadows.lg,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.background.primary,
    marginRight: Spacing[2],
  },
})

export default LanguageCountryScreen
