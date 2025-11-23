import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Image,
} from 'react-native'
import { router } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { Colors, Typography, Spacing, Shadows } from '../constants'

const { width, height } = Dimensions.get('window')

interface InspirationItem {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  type: 'offer' | 'category' | 'product' | 'service'
  price?: string
  originalPrice?: string
  discount?: string
}

const inspirationData: InspirationItem[] = [
  {
    id: '1',
    title: 'Social Commerce Revolution',
    subtitle: 'Create & Monetize Content',
    description: 'Share videos, earn from every interaction, build your empire',
    icon: 'video-camera',
    color: Colors.status.error,
    type: 'offer',
    discount: 'Unlimited',
  },
  {
    id: '2',
    title: 'Crypto-Powered Economy',
    subtitle: 'Digital Assets & Trading',
    description: 'Trade, invest, and earn with integrated cryptocurrency hub',
    icon: 'bitcoin',
    color: Colors.status.success,
    type: 'service',
    price: 'Free Trading',
    originalPrice: 'No Fees',
  },
  {
    id: '3',
    title: 'Global Job Market',
    subtitle: 'Work Without Borders',
    description: 'Find opportunities worldwide, freelance, or build your team',
    icon: 'briefcase',
    color: Colors.status.info,
    type: 'category',
  },
  {
    id: '4',
    title: 'Travel & Experiences',
    subtitle: 'Explore The World',
    description: 'Book flights, hotels, experiences - all while earning rewards',
    icon: 'plane',
    color: Colors.primary[500],
    type: 'category',
  },
  {
    id: '5',
    title: 'Real Estate Network',
    subtitle: 'Property & Investment',
    description: 'Buy, sell, rent properties globally with smart contracts',
    icon: 'building',
    color: Colors.special.featured,
    type: 'service',
  },
]

const InspirationScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const progressAnim = useRef(new Animated.Value(0)).current
  const loadingAnim = useRef(new Animated.Value(0)).current
  const animationRef = useRef<Animated.CompositeAnimation | null>(null)

  useEffect(() => {
    // Initial entrance animation
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start()

    // Start auto-changing animation
    startAutoChange()

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.stop()
      }
    }
  }, [])

  const startAutoChange = () => {
    // Progress bar animation
    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    })

    animationRef.current.start(({ finished }) => {
      if (finished) {
        // Change to next item
        setCurrentIndex((prev) => (prev + 1) % inspirationData.length)
        progressAnim.setValue(0)

        // Restart the cycle
        startAutoChange()
      }
    })
  }

  const handleLogin = () => {
    if (isLoading) return

    setIsLoading(true)

    // Loading animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(loadingAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start()

    // Simulate loading and redirect
    setTimeout(() => {
      setIsLoading(false)
      // Use push instead of replace to avoid navigation stack issues
      router.push('/auth')
    }, 2000)
  }

  const handleMaybeLater = () => {
    if (isLoading) return
    // Use push instead of replace to avoid navigation stack issues
    router.push('/(main)/')
  }

  const currentItem = inspirationData[currentIndex]

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor={Colors.background.primary} />

      {/* Fixed background */}
      <View style={styles.backgroundGradient} />

      {/* Subtle floating elements */}
      <View style={styles.floatingElements}>
        <Animated.View
          style={[
            styles.floatingElement,
            styles.element1,
            {
              transform: [
                {
                  rotate: loadingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingElement,
            styles.element2,
            {
              transform: [
                {
                  scale: loadingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome to the Future</Text>
          <Text style={styles.headerSubtitle}>
            Experience the world's most comprehensive social ecosystem
          </Text>
        </View>

        {/* Inspiration card */}
        <Animated.View
          style={[
            styles.inspirationCard,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: currentItem.color },
              ]}
            >
              <FontAwesome
                name={currentItem.icon as any}
                size={32}
                color={Colors.text.primary}
              />
            </View>
            {currentItem.type === 'offer' && currentItem.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  {currentItem.discount} OFF
                </Text>
              </View>
            )}
          </View>

          <View style={styles.cardContent}>
            <View style={styles.typeIndicator}>
              <Text style={[styles.typeText, { color: currentItem.color }]}>
                {currentItem.type.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.cardTitle}>{currentItem.title}</Text>
            <Text style={styles.cardSubtitle}>{currentItem.subtitle}</Text>
            <Text style={styles.cardDescription}>
              {currentItem.description}
            </Text>

            {/* Price section for products */}
            {currentItem.type === 'product' && currentItem.price && (
              <View style={styles.priceContainer}>
                <Text style={styles.currentPrice}>{currentItem.price}</Text>
                {currentItem.originalPrice && (
                  <Text style={styles.originalPrice}>
                    {currentItem.originalPrice}
                  </Text>
                )}
              </View>
            )}

            {/* Action button based on type */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: currentItem.color },
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>
                {currentItem.type === 'offer'
                  ? 'Start Creating'
                  : currentItem.type === 'product'
                  ? 'Explore Hub'
                  : currentItem.type === 'category'
                  ? 'Discover More'
                  : 'Join Revolution'}
              </Text>
              <FontAwesome name='arrow-right' size={14} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Progress indicators */}
          <View style={styles.progressContainer}>
            {inspirationData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor:
                      index === currentIndex
                        ? currentItem.color
                        : Colors.overlay.light10,
                  }
                ]}
              />
            ))}
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                { backgroundColor: currentItem.color },
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </Animated.View>

        {/* Features list */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <FontAwesome
              name='check-circle'
              size={20}
              color={Colors.primary[500]}
            />
            <Text style={styles.featureText}>AI-powered content monetization</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome
              name='check-circle'
              size={20}
              color={Colors.primary[500]}
            />
            <Text style={styles.featureText}>Global marketplace integration</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome
              name='check-circle'
              size={20}
              color={Colors.primary[500]}
            />
            <Text style={styles.featureText}>Blockchain-secured transactions</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom buttons */}
      <Animated.View
        style={[
          styles.bottomContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loadingButton]}
          onPress={handleLogin}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <Animated.View
              style={[
                styles.loadingIndicator,
                {
                  transform: [
                    {
                      rotate: loadingAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <FontAwesome name='spinner' size={20} color={Colors.background.primary} />
            </Animated.View>
          ) : (
            <>
              <Text style={styles.loginButtonText}>Login</Text>
              <FontAwesome name='sign-in' size={18} color={Colors.background.primary} />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.laterButton}
          onPress={handleMaybeLater}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <Text style={styles.laterButtonText}>Maybe Later</Text>
          <FontAwesome
            name='chevron-right'
            size={16}
            color={Colors.primary[500]}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background.primary,
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingElement: {
    position: 'absolute',
    backgroundColor: Colors.overlay.light10,
    borderRadius: 999,
  },
  element1: {
    width: 60,
    height: 60,
    top: 120,
    right: 30,
  },
  element2: {
    width: 40,
    height: 40,
    bottom: 200,
    left: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing[8],
    paddingTop: Spacing[20],
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing[10],
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primary[500],
    textAlign: 'center',
    marginBottom: Spacing[3],
    letterSpacing: 1,
    lineHeight: 34,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  inspirationCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 25,
    padding: Spacing[6],
    marginBottom: Spacing[8],
    borderWidth: 1,
    borderColor: Colors.border.primary,
    ...Shadows.lg,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: Spacing[5],
    position: 'relative',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  discountBadge: {
    position: 'absolute',
    top: -Spacing[3],
    right: width / 2 - 80,
    backgroundColor: Colors.status.error,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: 12,
  },
  discountText: {
    color: Colors.text.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  cardContent: {
    alignItems: 'center',
  },
  typeIndicator: {
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: 12,
    marginBottom: Spacing[4],
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing[2],
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  cardSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing[3],
    fontWeight: '600',
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing[5],
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[5],
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary[500],
    marginRight: Spacing[3],
    lineHeight: 26,
  },
  originalPrice: {
    fontSize: 16,
    color: Colors.text.muted,
    textDecorationLine: 'line-through',
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderRadius: 20,
    ...Shadows.md,
  },
  actionButtonText: {
    color: Colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
    marginRight: Spacing[2],
    lineHeight: 18,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: Spacing[1],
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 1.5,
  },
  featuresList: {
    marginBottom: Spacing[5],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[3],
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[2],
    backgroundColor: Colors.overlay.light10,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 15,
    color: Colors.text.primary,
    marginLeft: Spacing[3],
    fontWeight: '500',
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: Spacing[8],
    paddingBottom: Spacing[12],
    paddingTop: Spacing[5],
  },
  loginButton: {
    backgroundColor: Colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[5],
    borderRadius: 25,
    marginBottom: Spacing[4],
    ...Shadows.lg,
  },
  loadingButton: {
    opacity: 0.8,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    marginRight: Spacing[3],
    letterSpacing: 0.5,
    color: Colors.background.primary,
    lineHeight: 20,
  },
  loadingIndicator: {
    // Additional styles for loading state if needed
  },
  laterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[4],
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.border.secondary,
    backgroundColor: Colors.overlay.light10,
    ...Shadows.sm,
  },
  laterButtonText: {
    fontSize: 15,
    color: Colors.text.primary,
    fontWeight: '600',
    marginRight: Spacing[2],
    letterSpacing: 0.3,
    lineHeight: 18,
  },
})

export default InspirationScreen
