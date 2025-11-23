import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native'
import { router } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { useAuth } from '../providers/auth-provider'
import { Colors, Typography, Spacing, Shadows } from '../constants'

const { width, height } = Dimensions.get('window')

const SplashScreen = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const logoScale = useRef(new Animated.Value(0)).current
  const logoOpacity = useRef(new Animated.Value(0)).current
  const textOpacity = useRef(new Animated.Value(0)).current
  const backgroundOpacity = useRef(new Animated.Value(1)).current

  // Loading dots animation
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animateSequence = () => {
      // Logo entrance animation
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start()

      // Text entrance animation (slightly delayed)
      setTimeout(() => {
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start()

        // Start loading dots animation
        animateLoadingDots()
      }, 400)

      // Navigate based on auth state after animations
      setTimeout(() => {
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          handleNavigation()
        })
      }, 2500)
    }

    const animateLoadingDots = () => {
      const animateDot = (dot: Animated.Value, delay: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ).start()
      }

      animateDot(dot1, 0)
      animateDot(dot2, 200)
      animateDot(dot3, 400)
    }

    const handleNavigation = () => {
      // Wait for auth loading to complete before navigation
      if (authLoading) {
        // If still loading auth state, wait a bit more
        setTimeout(handleNavigation, 500)
        return
      }

      if (isAuthenticated) {
        // User has active session - go directly to main app
        router.replace('/(main)')
      } else {
        // User not authenticated - start onboarding flow
        router.replace('/start')
      }
    }

    // Only start animations if auth is not loading
    if (!authLoading) {
      animateSequence()
    } else {
      // If auth is still loading, wait for it
      const checkAuthInterval = setInterval(() => {
        if (!authLoading) {
          clearInterval(checkAuthInterval)
          animateSequence()
        }
      }, 100)

      return () => clearInterval(checkAuthInterval)
    }
  }, [authLoading, isAuthenticated])

  return (
    <Animated.View style={[styles.container, { opacity: backgroundOpacity }]}>
      <StatusBar barStyle='light-content' backgroundColor={Colors.background.primary} />

      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />

      {/* Floating elements for visual appeal */}
      <View style={styles.floatingElement1} />
      <View style={styles.floatingElement2} />
      <View style={styles.floatingElement3} />

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <FontAwesome name='shopping-bag' size={60} color={Colors.background.primary} />
          </View>
          <View style={styles.logoGlow} />
        </Animated.View>

        {/* App name and tagline */}
        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <Text style={styles.appName}>Mukulah</Text>
          <Text style={styles.tagline}>Your Shopping Paradise</Text>

          {/* Loading indicator */}
          <View style={styles.loadingContainer}>
            <View style={styles.loadingDots}>
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity: dot1,
                    transform: [{ scale: dot1 }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity: dot2,
                    transform: [{ scale: dot2 }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity: dot3,
                    transform: [{ scale: dot3 }],
                  },
                ]}
              />
            </View>
            <Text style={styles.loadingText}>
              {authLoading ? 'Checking session...' : 'Loading...'}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: textOpacity }]}>
        <Text style={styles.footerText}>Welcome to the future of shopping</Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background.primary,
    opacity: 0.9,
  },
  floatingElement1: {
    position: 'absolute',
    top: 100,
    right: 50,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.overlay.light10,
  },
  floatingElement2: {
    position: 'absolute',
    bottom: 200,
    left: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.overlay.light10,
  },
  floatingElement3: {
    position: 'absolute',
    top: 300,
    left: 80,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: Colors.overlay.light10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[10],
  },
  logoContainer: {
    marginBottom: Spacing[10],
    position: 'relative',
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary[400],
    ...Shadows.accentLarge,
  },
  logoGlow: {
    position: 'absolute',
    top: -Spacing[3],
    left: -Spacing[3],
    right: -Spacing[3],
    bottom: -Spacing[3],
    borderRadius: 80,
    backgroundColor: Colors.overlay.light10,
    zIndex: -1,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.primary[500],
    textAlign: 'center',
    marginBottom: Spacing[2],
    letterSpacing: 1,
    textShadowColor: Colors.overlay.dark30,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
    lineHeight: 44,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing[10],
    fontStyle: 'italic',
    letterSpacing: 0.5,
    opacity: 0.9,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[500],
    marginHorizontal: Spacing[1],
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: Spacing[16],
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing[1],
    opacity: 0.8,
    lineHeight: 18,
  },
  versionText: {
    fontSize: 12,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 16,
  },
})

export default SplashScreen
