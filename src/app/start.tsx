import React, { useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native'
import { router } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { Colors, Typography, Spacing, Shadows } from '../constants'

const { width, height } = Dimensions.get('window')

const StartScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const logoScale = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    // Start animations on component mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleStart = () => {
    router.push('/privacy-policy')
  }

  const handleLanguageCountry = () => {
    router.push('/language-country')
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor={Colors.background.primary} />

      {/* Background decorative elements */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <FontAwesome name='th-large' size={80} color={Colors.background.primary} />
            </View>
            <View style={styles.logoGlow} />
          </View>

          <Text style={styles.appName}>Mukulah</Text>
          <Text style={styles.appSubtitle}>Your All-in-One Platform</Text>
        </Animated.View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Mukulah</Text>
          <Text style={styles.welcomeDescription}>
            Explore, connect, and thrive on our comprehensive platform. Shop, travel, trade crypto, find jobs, book services, discover real estate, and enjoy live sports - all in one place.
          </Text>
        </View>

        {/* Features highlights */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <FontAwesome
              name='users'
              size={20}
              color={Colors.primary[500]}
            />
            <Text style={styles.featureText}>Connect & Share</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome
              name='globe'
              size={20}
              color={Colors.primary[500]}
            />
            <Text style={styles.featureText}>All Services</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome
              name='line-chart'
              size={20}
              color={Colors.primary[500]}
            />
            <Text style={styles.featureText}>Opportunities</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Actions */}
      <Animated.View
        style={[
          styles.bottomContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Get Started</Text>
          <FontAwesome
            name='chevron-right'
            size={16}
            color='#000000'
            style={styles.startButtonIcon}
          />
        </TouchableOpacity>

        {/* Language/Country Button */}
        <TouchableOpacity
          style={styles.languageButton}
          onPress={handleLanguageCountry}
          activeOpacity={0.7}
        >
          <FontAwesome
            name='globe'
            size={18}
            color={Colors.primary[500]}
            style={styles.languageIcon}
          />
          <Text style={styles.languageButtonText}>
            Select your country and language
          </Text>
        </TouchableOpacity>

        {/* Footer text */}
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: Colors.overlay.light10,
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    top: 200,
    left: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing[8],
    paddingTop: Spacing[20],
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing[10],
  },
  logoContainer: {
    position: 'relative',
    marginBottom: Spacing[5],
  },
  logoBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary[400],
    ...Shadows.accentLarge,
  },
  logoGlow: {
    position: 'absolute',
    top: -Spacing[4],
    left: -Spacing[4],
    right: -Spacing[4],
    bottom: -Spacing[4],
    borderRadius: 95,
    backgroundColor: Colors.overlay.light10,
    zIndex: -1,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.primary[500],
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: Colors.overlay.dark50,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 42,
  },
  appSubtitle: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: Spacing[2],
    fontStyle: 'italic',
    letterSpacing: 0.5,
    lineHeight: 20,
    opacity: 0.9,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: Spacing[10],
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary[500],
    textAlign: 'center',
    marginBottom: Spacing[4],
    letterSpacing: 0.5,
    lineHeight: 30,
  },
  welcomeDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing[3],
    opacity: 0.85,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: Spacing[5],
    paddingHorizontal: Spacing[4],
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    padding: Spacing[3],
    borderRadius: 12,
    backgroundColor: Colors.overlay.light10,
    marginHorizontal: Spacing[1],
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: Spacing[2],
    textAlign: 'center',
    lineHeight: 16,
  },
  bottomContainer: {
    paddingHorizontal: Spacing[8],
    paddingBottom: Spacing[12],
    paddingTop: Spacing[5],
  },
  startButton: {
    backgroundColor: Colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[5],
    paddingHorizontal: Spacing[8],
    borderRadius: 25,
    marginBottom: Spacing[4],
    ...Shadows.accentLarge,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    marginRight: Spacing[3],
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  startButtonIcon: {
    marginLeft: Spacing[1],
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[8],
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.border.secondary,
    backgroundColor: Colors.overlay.light10,
    marginBottom: Spacing[6],
    ...Shadows.sm,
  },
  languageIcon: {
    marginRight: Spacing[3],
  },
  languageButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    letterSpacing: 0,
    lineHeight: 18,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: Spacing[5],
    opacity: 0.8,
  },
})

export default StartScreen
