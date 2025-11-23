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
import { Colors, Typography, Spacing, Shadows } from '../constants'

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
      <StatusBar barStyle='light-content' backgroundColor={Colors.background.primary} />

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
              <FontAwesome name='shield' size={40} color={Colors.primary[500]} />
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
                trackColor={{ false: Colors.border.secondary, true: Colors.primary[500] }}
                thumbColor={settings.personalisedAds ? Colors.text.primary : Colors.background.tertiary}
                ios_backgroundColor={Colors.border.secondary}
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
                trackColor={{ false: Colors.border.secondary, true: Colors.primary[500] }}
                thumbColor={Colors.text.primary}
                ios_backgroundColor={Colors.primary[500]}
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
                trackColor={{ false: Colors.border.secondary, true: Colors.primary[500] }}
                thumbColor={settings.personalisation ? Colors.text.primary : Colors.background.tertiary}
                ios_backgroundColor={Colors.border.secondary}
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
            <FontAwesome name='chevron-right' size={16} color={Colors.primary[500]} />
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
    backgroundColor: Colors.background.primary,
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
    paddingHorizontal: Spacing[7],
    paddingTop: Spacing[15],
    paddingBottom: Spacing[7],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.overlay.light10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[5],
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary[500],
    textAlign: 'center',
    marginBottom: Spacing[4],
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing[2],
  },
  settingsContainer: {
    paddingHorizontal: Spacing[7],
    marginBottom: Spacing[5],
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 15,
    padding: Spacing[5],
    marginBottom: Spacing[4],
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  settingContent: {
    flex: 1,
    marginRight: Spacing[4],
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing[7],
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    borderRadius: 15,
    marginBottom: Spacing[5],
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[500],
  },
  infoContainer: {
    paddingHorizontal: Spacing[7],
    marginBottom: Spacing[5],
  },
  infoText: {
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: Spacing[7],
    paddingVertical: Spacing[5],
    backgroundColor: Colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
  allowAllButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing[4],
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: Spacing[3],
    ...Shadows.lg,
  },
  allowAllButtonText: {
    color: Colors.background.primary,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  confirmButton: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing[4],
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  confirmButtonText: {
    color: Colors.primary[500],
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
})

export default PrivacyPolicyScreen
