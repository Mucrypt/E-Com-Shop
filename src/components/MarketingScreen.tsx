import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { router } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors, Typography, Spacing, Shadows } from '../constants'

const { width, height } = Dimensions.get('window')

interface MarketingItem {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  type: 'benefit' | 'feature' | 'reward' | 'exclusive'
  value?: string
}

interface MarketingScreenProps {
  title?: string
  subtitle?: string
  data: MarketingItem[]
  primaryButtonText?: string
  secondaryButtonText?: string
  onPrimaryPress?: () => void
  onSecondaryPress?: () => void
  backgroundColor?: string
  showRegisterOption?: boolean
}

const MarketingScreen: React.FC<MarketingScreenProps> = ({
  title = 'Join the Revolution',
  subtitle = 'The world\'s first all-in-one social commerce ecosystem',
  data,
  primaryButtonText = 'Login',
  secondaryButtonText = 'Create Account',
  onPrimaryPress,
  onSecondaryPress,
  backgroundColor = Colors.background.primary,
  showRegisterOption = true,
}) => {
  const insets = useSafeAreaInsets()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const progressAnim = useRef(new Animated.Value(0)).current
  const loadingAnim = useRef(new Animated.Value(0)).current
  const cardRotateAnim = useRef(new Animated.Value(0)).current
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
      duration: 5000, // Slightly longer for reading
      useNativeDriver: false,
    })

    animationRef.current.start(({ finished }) => {
      if (finished) {
        // Subtle card animation when changing
        Animated.sequence([
          Animated.timing(cardRotateAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(cardRotateAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start()

        // Change to next item
        setCurrentIndex((prev) => (prev + 1) % data.length)
        progressAnim.setValue(0)

        // Restart the cycle
        startAutoChange()
      }
    })
  }

  const handlePrimaryPress = () => {
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
      if (onPrimaryPress) {
        onPrimaryPress()
      } else {
        router.push('/auth')
      }
    }, 1500)
  }

  const handleSecondaryPress = () => {
    if (isLoading) return
    if (onSecondaryPress) {
      onSecondaryPress()
    } else {
      router.push('/auth?mode=register')
    }
  }

  const currentItem = data[currentIndex]

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <StatusBar barStyle='light-content' backgroundColor={backgroundColor} />

      <View style={[styles.container, { backgroundColor }]}>
        {/* Fixed background */}
        <View style={[styles.backgroundGradient, { backgroundColor }]} />

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
          <Animated.View
            style={[
              styles.floatingElement,
              styles.element3,
              {
                transform: [
                  {
                    translateY: loadingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        {/* Scrollable content */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>{subtitle}</Text>
          </Animated.View>

          {/* Marketing card */}
          <Animated.View
            style={[
              styles.marketingCard,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  {
                    rotateY: cardRotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '5deg'],
                    }),
                  },
                ],
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
              {currentItem.value && (
                <View
                  style={[
                    styles.valueBadge,
                    { backgroundColor: currentItem.color },
                  ]}
                >
                  <Text style={styles.valueText}>{currentItem.value}</Text>
                </View>
              )}
            </View>

            <View style={styles.cardContent}>
              <View
                style={[
                  styles.typeIndicator,
                  { backgroundColor: `${currentItem.color}15` },
                ]}
              >
                <Text style={[styles.typeText, { color: currentItem.color }]}>
                  {currentItem.type.toUpperCase()}
                </Text>
              </View>

              <Text style={styles.cardTitle}>{currentItem.title}</Text>
              <Text style={styles.cardSubtitle}>{currentItem.subtitle}</Text>
              <Text style={styles.cardDescription}>
                {currentItem.description}
              </Text>

              {/* Call to action based on type */}
              <TouchableOpacity
                style={[
                  styles.ctaButton,
                  { backgroundColor: currentItem.color },
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.ctaButtonText}>
                  {currentItem.type === 'benefit'
                    ? 'Learn More'
                    : currentItem.type === 'feature'
                    ? 'Try Now'
                    : currentItem.type === 'reward'
                    ? 'Claim Reward'
                    : 'Get Access'}
                </Text>
                <FontAwesome name='arrow-right' size={14} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Progress indicators */}
            <View style={styles.progressContainer}>
              {data.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor:
                        index === currentIndex
                          ? currentItem.color
                          : Colors.overlay.light10,
                      transform: [
                        {
                          scale: index === currentIndex ? 1.2 : 1,
                        },
                      ],
                    },
                  ]}
                  onPress={() => {
                    setCurrentIndex(index)
                    progressAnim.setValue(0)
                    if (animationRef.current) {
                      animationRef.current.stop()
                    }
                    startAutoChange()
                  }}
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

          {/* Benefits list */}
          <Animated.View
            style={[
              styles.benefitsList,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.benefitsTitle}>Why Join the Revolution?</Text>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <FontAwesome
                  name='rocket'
                  size={18}
                  color={Colors.text.secondary}
                />
              </View>
              <Text style={styles.benefitText}>Launch your digital empire</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <FontAwesome
                  name='globe'
                  size={18}
                  color={Colors.text.secondary}
                />
              </View>
              <Text style={styles.benefitText}>
                Connect with global community
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <FontAwesome
                  name='bitcoin'
                  size={18}
                  color={Colors.text.secondary}
                />
              </View>
              <Text style={styles.benefitText}>
                Earn cryptocurrency rewards
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <FontAwesome
                  name='bolt'
                  size={18}
                  color={Colors.text.secondary}
                />
              </View>
              <Text style={styles.benefitText}>AI-powered growth tools</Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Bottom buttons - using flex instead of absolute */}
        <Animated.View
          style={[
            styles.bottomContainer,
            {
              paddingBottom: insets.bottom + 12,
              backgroundColor: `${backgroundColor}F0`,
            },
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.loadingButton]}
              onPress={handlePrimaryPress}
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
                  <FontAwesome
                    name='spinner'
                    size={20}
                    color={Colors.background.primary}
                  />
                </Animated.View>
              ) : (
                <>
                  <FontAwesome
                    name='sign-in'
                    size={18}
                    color={Colors.background.primary}
                  />
                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: Colors.background.primary },
                    ]}
                  >
                    {primaryButtonText}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {showRegisterOption && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleSecondaryPress}
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <FontAwesome
                  name='user-plus'
                  size={16}
                  color={Colors.primary[500]}
                />
                <Text style={styles.secondaryButtonText}>
                  {secondaryButtonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Trust indicators */}
          <View style={styles.trustIndicators}>
            <View style={styles.trustItem}>
              <FontAwesome
                name='shield'
                size={16}
                color={Colors.primary[500]}
              />
              <Text style={styles.trustText}>Secure</Text>
            </View>
            <View style={styles.trustItem}>
              <FontAwesome
                name='users'
                size={16}
                color={Colors.primary[500]}
              />
              <Text style={styles.trustText}>1M+ Creators</Text>
            </View>
            <View style={styles.trustItem}>
              <FontAwesome
                name='trophy'
                size={16}
                color={Colors.primary[500]}
              />
              <Text style={styles.trustText}>Revolutionary</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    width: 80,
    height: 80,
    top: 100,
    right: 20,
  },
  element2: {
    width: 50,
    height: 50,
    bottom: 250,
    left: 30,
  },
  element3: {
    width: 30,
    height: 30,
    top: 200,
    left: 50,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[5],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing[8],
    paddingHorizontal: Spacing[4],
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primary[500],
    textAlign: 'center',
    marginBottom: Spacing[3],
    letterSpacing: 0.8,
    textShadowColor: Colors.overlay.dark30,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 34,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing[2],
    fontWeight: '400',
    opacity: 0.9,
  },
  marketingCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 28,
    padding: Spacing[7],
    marginBottom: Spacing[8],
    marginHorizontal: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.border.primary,
    ...Shadows.xl,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: Spacing[6],
    position: 'relative',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  valueBadge: {
    position: 'absolute',
    top: -Spacing[2],
    right: width / 2 - 90,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: 16,
    ...Shadows.md,
  },
  valueText: {
    color: Colors.text.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardContent: {
    alignItems: 'center',
  },
  typeIndicator: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: 16,
    marginBottom: Spacing[5],
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing[3],
    letterSpacing: 0.3,
    lineHeight: 28,
  },
  cardSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing[4],
    fontWeight: '600',
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing[7],
    paddingHorizontal: Spacing[3],
    fontWeight: '400',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[7],
    borderRadius: 24,
    ...Shadows.md,
  },
  ctaButtonText: {
    color: Colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
    marginRight: Spacing[3],
    letterSpacing: 0.3,
    lineHeight: 18,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[6],
    marginBottom: Spacing[5],
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: Spacing[2],
    ...Shadows.sm,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  benefitsList: {
    marginBottom: Spacing[5],
    paddingHorizontal: Spacing[2],
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary[500],
    textAlign: 'center',
    marginBottom: Spacing[5],
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    backgroundColor: Colors.overlay.light10,
    borderRadius: 12,
  },
  benefitIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[4],
  },
  benefitText: {
    fontSize: 15,
    color: Colors.text.primary,
    fontWeight: '500',
    flex: 1,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[4],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Shadows.lg,
  },
  buttonContainer: {
    marginBottom: Spacing[3],
  },
  primaryButton: {
    backgroundColor: Colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[4],
    borderRadius: 20,
    marginBottom: Spacing[2],
    ...Shadows.md,
  },
  loadingButton: {
    opacity: 0.8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: Spacing[3],
    letterSpacing: 0.3,
    color: Colors.background.primary,
    lineHeight: 20,
  },
  loadingIndicator: {
    // Additional styles for loading state if needed
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[3],
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border.secondary,
    backgroundColor: Colors.overlay.light10,
    ...Shadows.sm,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
    marginLeft: Spacing[2],
    letterSpacing: 0.2,
    lineHeight: 18,
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    backgroundColor: Colors.overlay.light10,
    borderRadius: 12,
    marginTop: Spacing[1],
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  trustText: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginLeft: Spacing[1],
    fontWeight: '500',
    lineHeight: 14,
  },
})

export default MarketingScreen
