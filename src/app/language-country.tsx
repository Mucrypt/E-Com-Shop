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
    router.replace('/(shop)/')
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor='#2E8C83' />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <FontAwesome name='chevron-left' size={20} color='#fff' />
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
                <FontAwesome name='check-circle' size={24} color='#2E8C83' />
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
            <FontAwesome name='chevron-right' size={16} color='#fff' />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E8C83',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 25,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 30,
    lineHeight: 24,
  },
  countriesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCountryItem: {
    borderColor: '#2E8C83',
    backgroundColor: '#f0fffe',
    shadowColor: '#2E8C83',
    shadowOpacity: 0.2,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagText: {
    fontSize: 32,
    marginRight: 16,
  },
  countryDetails: {
    flex: 1,
  },
  countryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedText: {
    color: '#2E8C83',
  },
  languageText: {
    fontSize: 14,
    color: '#666',
  },
  selectedLanguageText: {
    color: '#2E8C83',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  continueButton: {
    backgroundColor: '#2E8C83',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#2E8C83',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
})

export default LanguageCountryScreen
