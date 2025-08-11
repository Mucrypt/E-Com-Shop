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
  title = 'Join Mukulah',
  subtitle = 'Unlock exclusive benefits and personalized shopping',
  data,
  primaryButtonText = 'Login',
  secondaryButtonText = 'Create Account',
  onPrimaryPress,
  onSecondaryPress,
  backgroundColor = '#2E8C83',
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
                  color='#fff'
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
                <FontAwesome name='arrow-right' size={14} color='#fff' />
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
                          : 'rgba(0, 0, 0, 0.2)',
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
            <Text style={styles.benefitsTitle}>Why Join Us?</Text>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <FontAwesome
                  name='star'
                  size={18}
                  color='rgba(255, 255, 255, 0.9)'
                />
              </View>
              <Text style={styles.benefitText}>Exclusive member deals</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <FontAwesome
                  name='heart'
                  size={18}
                  color='rgba(255, 255, 255, 0.9)'
                />
              </View>
              <Text style={styles.benefitText}>
                Personalized recommendations
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <FontAwesome
                  name='gift'
                  size={18}
                  color='rgba(255, 255, 255, 0.9)'
                />
              </View>
              <Text style={styles.benefitText}>
                Birthday rewards & surprises
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <FontAwesome
                  name='truck'
                  size={18}
                  color='rgba(255, 255, 255, 0.9)'
                />
              </View>
              <Text style={styles.benefitText}>Free shipping on orders</Text>
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
                    color={backgroundColor}
                  />
                </Animated.View>
              ) : (
                <>
                  <FontAwesome
                    name='sign-in'
                    size={18}
                    color={backgroundColor}
                  />
                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: backgroundColor },
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
                  color='rgba(255, 255, 255, 0.9)'
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
                color='rgba(255, 255, 255, 0.7)'
              />
              <Text style={styles.trustText}>Secure</Text>
            </View>
            <View style={styles.trustItem}>
              <FontAwesome
                name='users'
                size={16}
                color='rgba(255, 255, 255, 0.7)'
              />
              <Text style={styles.trustText}>10K+ Members</Text>
            </View>
            <View style={styles.trustItem}>
              <FontAwesome
                name='star'
                size={16}
                color='rgba(255, 255, 255, 0.7)'
              />
              <Text style={styles.trustText}>4.8 Rating</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20, // Add some bottom padding for spacing
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
    fontWeight: '500',
  },
  marketingCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    marginBottom: 32,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  valueBadge: {
    position: 'absolute',
    top: -8,
    right: width / 2 - 90,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  valueText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cardContent: {
    alignItems: 'center',
  },
  typeIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 18,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  cardSubtitle: {
    fontSize: 19,
    color: '#555',
    textAlign: 'center',
    marginBottom: 14,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 12,
    fontWeight: '400',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    letterSpacing: 0.3,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 18,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  benefitsList: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  benefitIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    flex: 1,
    letterSpacing: 0.2,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 16, // Reduced top padding
    borderTopLeftRadius: 20, // Reduced radius
    borderTopRightRadius: 20, // Reduced radius
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonContainer: {
    marginBottom: 10, // Reduced margin
  },
  primaryButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14, // Reduced from 18
    borderRadius: 20, // Reduced from 24
    marginBottom: 8, // Reduced from 12
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4, // Reduced shadow
    },
    shadowOpacity: 0.2, // Reduced shadow opacity
    shadowRadius: 8, // Reduced shadow radius
    elevation: 6,
  },
  loadingButton: {
    opacity: 0.8,
  },
  primaryButtonText: {
    fontSize: 16, // Reduced from 18
    fontWeight: 'bold',
    marginLeft: 10, // Reduced from 12
    letterSpacing: 0.3, // Reduced letter spacing
  },
  loadingIndicator: {
    // Additional styles for loading state if needed
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12, // Reduced from 16
    borderRadius: 20, // Reduced from 24
    borderWidth: 1.5, // Reduced border width
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Slightly more transparent
  },
  secondaryButtonText: {
    fontSize: 14, // Reduced from 16
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginLeft: 8, // Reduced from 10
    letterSpacing: 0.2, // Reduced letter spacing
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8, // Reduced from 12
    paddingHorizontal: 12, // Reduced from 16
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12, // Reduced from 16
    marginTop: 4, // Reduced from 8
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  trustText: {
    fontSize: 11, // Reduced from 13
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 4, // Reduced from 6
    fontWeight: '500',
  },
})

export default MarketingScreen
