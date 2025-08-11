import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native'
import { router } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

interface PrivacySettings {
  personalisedAds: boolean
  strictlyNecessary: boolean
  personalisation: boolean
}

const PrivacyPolicyScreen = () => {
  const [settings, setSettings] = useState<PrivacySettings>({
    personalisedAds: false,
    strictlyNecessary: true, // Always true for necessary cookies
    personalisation: false,
  })

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const toggleSetting = (key: keyof PrivacySettings) => {
    if (key === 'strictlyNecessary') return // Cannot toggle necessary cookies

    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleAllowAll = () => {
    setSettings({
      personalisedAds: true,
      strictlyNecessary: true,
      personalisation: true,
    })
    // Small delay to show the switches change
    setTimeout(() => {
      router.push('/inspiration')
    }, 300)
  }

  const handleConfirmChoices = () => {
    router.push('/inspiration')
  }

  const handleDetailsPress = () => {
    // In a real app, this would open a detailed privacy policy
    console.log('Opening detailed privacy policy...')
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#f8f9fa' />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <FontAwesome name='shield' size={40} color='#2E8C83' />
            </View>
            <Text style={styles.title}>Privacy & Cookies</Text>
            <Text style={styles.subtitle}>
              We use cookies and similar technologies to provide you with a
              better experience. You can manage your preferences below.
            </Text>
          </View>

          {/* Privacy Settings */}
          <View style={styles.settingsContainer}>
            {/* Personalised Ads */}
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Personalised Ads</Text>
                <Text style={styles.settingDescription}>
                  Allow us to show you ads based on your interests and shopping
                  behavior.
                </Text>
              </View>
              <Switch
                value={settings.personalisedAds}
                onValueChange={() => toggleSetting('personalisedAds')}
                trackColor={{ false: '#e0e0e0', true: '#2E8C83' }}
                thumbColor={settings.personalisedAds ? '#fff' : '#f4f3f4'}
                ios_backgroundColor='#e0e0e0'
              />
            </View>

            {/* Strictly Necessary */}
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Strictly Necessary</Text>
                <Text style={styles.settingDescription}>
                  Essential cookies required for the app to function properly.
                  These cannot be disabled.
                </Text>
              </View>
              <Switch
                value={settings.strictlyNecessary}
                onValueChange={() => toggleSetting('strictlyNecessary')}
                trackColor={{ false: '#e0e0e0', true: '#2E8C83' }}
                thumbColor='#fff'
                ios_backgroundColor='#2E8C83'
                disabled={true}
              />
            </View>

            {/* Personalisation */}
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Personalisation</Text>
                <Text style={styles.settingDescription}>
                  Customize your experience with personalized content and
                  recommendations.
                </Text>
              </View>
              <Switch
                value={settings.personalisation}
                onValueChange={() => toggleSetting('personalisation')}
                trackColor={{ false: '#e0e0e0', true: '#2E8C83' }}
                thumbColor={settings.personalisation ? '#fff' : '#f4f3f4'}
                ios_backgroundColor='#e0e0e0'
              />
            </View>
          </View>

          {/* Details Button */}
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={handleDetailsPress}
            activeOpacity={0.7}
          >
            <Text style={styles.detailsButtonText}>Details Privacy Policy</Text>
            <FontAwesome name='chevron-right' size={16} color='#2E8C83' />
          </TouchableOpacity>

          {/* Additional Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              You can change these settings at any time in the app settings.
              Some features may not work properly if certain cookies are
              disabled.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.allowAllButton}
            onPress={handleAllowAll}
            activeOpacity={0.8}
          >
            <Text style={styles.allowAllButtonText}>Allow All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmChoices}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>Confirm My Choices</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(46, 140, 131, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  settingsContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  settingContent: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 30,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E8C83',
  },
  infoContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  allowAllButton: {
    backgroundColor: '#2E8C83',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#2E8C83',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  allowAllButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  confirmButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2E8C83',
  },
  confirmButtonText: {
    color: '#2E8C83',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
})

export default PrivacyPolicyScreen
