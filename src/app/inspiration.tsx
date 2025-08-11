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
    title: 'Summer Sale',
    subtitle: 'Up to 70% Off',
    description: 'Limited time offer on electronics and fashion',
    icon: 'tags',
    color: '#FF6B6B',
    type: 'offer',
    discount: '70%',
  },
  {
    id: '2',
    title: 'Wireless Headphones',
    subtitle: 'Premium Sound Quality',
    description: 'Noise-cancelling wireless headphones',
    icon: 'headphones',
    color: '#4ECDC4',
    type: 'product',
    price: '$89.99',
    originalPrice: '$149.99',
  },
  {
    id: '3',
    title: 'Fashion & Style',
    subtitle: 'Trending Collections',
    description: 'Discover the latest fashion trends',
    icon: 'shopping-bag',
    color: '#45B7D1',
    type: 'category',
  },
  {
    id: '4',
    title: 'Smart Home',
    subtitle: 'Smart Devices',
    description: 'Transform your home with smart technology',
    icon: 'home',
    color: '#FFA726',
    type: 'category',
  },
  {
    id: '5',
    title: 'Express Delivery',
    subtitle: 'Same Day Delivery',
    description: 'Get your orders delivered within hours',
    icon: 'truck',
    color: '#AB47BC',
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
    router.push('/(shop)/home')
  }

  const currentItem = inspirationData[currentIndex]

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor='#2E8C83' />

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
          <Text style={styles.headerTitle}>Get Inspired</Text>
          <Text style={styles.headerSubtitle}>
            Discover what makes shopping with Mukulah special
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
                color='#fff'
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
                  ? 'Shop Now'
                  : currentItem.type === 'product'
                  ? 'View Product'
                  : currentItem.type === 'category'
                  ? 'Browse Category'
                  : 'Learn More'}
              </Text>
              <FontAwesome name='arrow-right' size={14} color='#fff' />
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
                        : 'rgba(0, 0, 0, 0.2)',
                  },
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
              color='rgba(255, 255, 255, 0.9)'
            />
            <Text style={styles.featureText}>Personalized recommendations</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome
              name='check-circle'
              size={20}
              color='rgba(255, 255, 255, 0.9)'
            />
            <Text style={styles.featureText}>Exclusive member offers</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome
              name='check-circle'
              size={20}
              color='rgba(255, 255, 255, 0.9)'
            />
            <Text style={styles.featureText}>Priority customer support</Text>
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
              <FontAwesome name='spinner' size={20} color='#2E8C83' />
            </Animated.View>
          ) : (
            <>
              <Text style={styles.loginButtonText}>Login</Text>
              <FontAwesome name='sign-in' size={18} color='#2E8C83' />
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
            color='rgba(255, 255, 255, 0.9)'
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E8C83',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E8C83',
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
    paddingHorizontal: 30,
    paddingTop: 80,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  inspirationCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  discountBadge: {
    position: 'absolute',
    top: -10,
    right: width / 2 - 80,
    backgroundColor: '#FF4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    alignItems: 'center',
  },
  typeIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 15,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8C83',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2E8C83',
    borderRadius: 1.5,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 12,
    fontWeight: '500',
  },
  bottomContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    paddingTop: 20,
  },
  loginButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingButton: {
    opacity: 0.8,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    letterSpacing: 0.5,
    color: '#2E8C83',
  },
  loadingIndicator: {
    // Additional styles for loading state if needed
  },
  laterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  laterButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.3,
  },
})

export default InspirationScreen
