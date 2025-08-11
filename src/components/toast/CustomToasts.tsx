import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
  Easing,
  StatusBar,
  Platform,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')
const SCREEN_PADDING = 16
const TOAST_WIDTH = width - SCREEN_PADDING * 2

interface LoadingToastProps {
  message?: string
  onClose?: () => void
}

export const LoadingToast: React.FC<LoadingToastProps> = ({
  message = 'Processing your request...',
  onClose,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current
  const scaleValue = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(-100)).current
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Entry animation - slide from top
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 120,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start()

    // Continuous spinning animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    )

    // Progress bar animation
    const progressAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    )

    spinAnimation.start()
    progressAnimation.start()

    return () => {
      spinAnimation.stop()
      progressAnimation.stop()
    }
  }, [])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <Animated.View
      style={[
        styles.modernToastContainer,
        styles.loadingToast,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleValue }],
        },
      ]}
    >
      {/* Gradient background overlay */}
      <View style={styles.gradientOverlay} />

      <View style={styles.modernToastContent}>
        {/* Loading spinner */}
        <View style={styles.modernSpinnerContainer}>
          <Animated.View
            style={[styles.modernSpinner, { transform: [{ rotate: spin }] }]}
          >
            <View style={styles.spinnerRing1} />
            <View style={styles.spinnerRing2} />
            <View style={styles.spinnerCore} />
          </Animated.View>
        </View>

        {/* Content */}
        <View style={styles.modernToastText}>
          <Text style={styles.modernLoadingTitle}>Processing</Text>
          <Text style={styles.modernLoadingMessage}>{message}</Text>
        </View>

        {/* Close button */}
        {onClose && (
          <TouchableOpacity style={styles.modernCloseButton} onPress={onClose}>
            <FontAwesome name='times' size={16} color='#8E8E93' />
          </TouchableOpacity>
        )}
      </View>

      {/* Animated progress bar */}
      <View style={styles.modernProgressBar}>
        <Animated.View
          style={[styles.modernProgressFill, { width: progressWidth }]}
        />
      </View>
    </Animated.View>
  )
}

interface CartToastProps {
  productName: string
  productPrice: number
  quantity: number
  productImage?: string
  onViewCart?: () => void
  onClose?: () => void
}

export const CartSuccessToast: React.FC<CartToastProps> = ({
  productName,
  productPrice,
  quantity,
  productImage,
  onViewCart,
  onClose,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(-100)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const checkAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Entry animation sequence
    Animated.sequence([
      // Slide in from top
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
      // Success check animation
      Animated.spring(checkAnim, {
        toValue: 1,
        tension: 200,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start()

    // Continuous pulse effect
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )

    // Auto-dismiss progress
    const progressAnimation = Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    })

    pulseAnimation.start()
    progressAnimation.start()

    return () => {
      pulseAnimation.stop()
      progressAnimation.stop()
    }
  }, [])

  const totalPrice = productPrice * quantity

  const checkScale = checkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 1],
  })

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <Animated.View
      style={[
        styles.modernToastContainer,
        styles.successToast,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      {/* Success gradient overlay */}
      <View style={styles.successGradientOverlay} />

      <View style={styles.modernToastContent}>
        {/* Product image with success badge */}
        <View style={styles.modernProductImageContainer}>
          {productImage ? (
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Image
                source={{ uri: productImage }}
                style={styles.modernProductImage}
              />
            </Animated.View>
          ) : (
            <Animated.View
              style={[
                styles.modernPlaceholderImage,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <FontAwesome name='shopping-bag' size={24} color='#34C759' />
            </Animated.View>
          )}

          {/* Animated success checkmark */}
          <Animated.View
            style={[
              styles.modernSuccessBadge,
              { transform: [{ scale: checkScale }] },
            ]}
          >
            <FontAwesome name='check' size={12} color='#fff' />
          </Animated.View>

          {/* Success ring effect */}
          <Animated.View
            style={[
              styles.modernSuccessRing,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
        </View>

        {/* Product details */}
        <View style={styles.modernToastText}>
          <View style={styles.modernSuccessHeader}>
            <FontAwesome name='check-circle' size={16} color='#34C759' />
            <Text style={styles.modernSuccessTitle}>Added to Cart</Text>
          </View>

          <Text style={styles.modernProductName} numberOfLines={1}>
            {productName}
          </Text>

          <View style={styles.modernProductMeta}>
            <View style={styles.modernQuantityContainer}>
              <Text style={styles.modernQuantityLabel}>Qty:</Text>
              <View style={styles.modernQuantityBadge}>
                <Text style={styles.modernQuantityText}>{quantity}</Text>
              </View>
            </View>
            <Text style={styles.modernPriceText}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.modernActionButtons}>
          <TouchableOpacity
            style={styles.modernViewCartButton}
            onPress={onViewCart}
          >
            <FontAwesome name='shopping-cart' size={18} color='#fff' />
          </TouchableOpacity>

          <TouchableOpacity style={styles.modernCloseButton} onPress={onClose}>
            <FontAwesome name='times' size={16} color='#8E8E93' />
          </TouchableOpacity>
        </View>
      </View>

      {/* Auto-dismiss progress bar */}
      <View style={styles.modernProgressBar}>
        <Animated.View
          style={[styles.modernSuccessProgressFill, { width: progressWidth }]}
        />
      </View>
    </Animated.View>
  )
}

interface ErrorToastProps {
  title: string
  message: string
  onClose?: () => void
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  title,
  message,
  onClose,
}) => {
  return (
    <View style={[styles.toastContainer, styles.errorContainer]}>
      <View style={styles.toastContent}>
        <View style={styles.iconContainer}>
          <View style={styles.errorIcon}>
            <FontAwesome name='exclamation' size={16} color='#fff' />
          </View>
        </View>

        <View style={styles.messageInfo}>
          <Text style={styles.errorTitle}>{title}</Text>
          <Text style={styles.errorMessage} numberOfLines={2}>
            {message}
          </Text>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome name='times' size={12} color='#999' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

interface InfoToastProps {
  title: string
  message: string
  icon?: string
  onClose?: () => void
}

export const InfoToast: React.FC<InfoToastProps> = ({
  title,
  message,
  icon = 'info-circle',
  onClose,
}) => {
  return (
    <View style={[styles.toastContainer, styles.infoContainer]}>
      <View style={styles.toastContent}>
        <View style={styles.iconContainer}>
          <View style={styles.infoIcon}>
            <FontAwesome name={icon as any} size={16} color='#fff' />
          </View>
        </View>

        <View style={styles.messageInfo}>
          <Text style={styles.infoTitle}>{title}</Text>
          <Text style={styles.infoMessage} numberOfLines={2}>
            {message}
          </Text>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome name='times' size={12} color='#999' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  // Modern Toast Container - Base
  modernToastContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: SCREEN_PADDING,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.15)',
      },
      android: {
        elevation: 12,
      },
    }),
  },

  // Loading Toast Specific
  loadingToast: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },

  // Success Toast Specific
  successToast: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },

  // Gradient Overlays
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 122, 255, 0.02)',
    borderRadius: 16,
  },

  successGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(52, 199, 89, 0.02)',
    borderRadius: 16,
  },

  // Modern Toast Content
  modernToastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 18,
    minHeight: 76,
    position: 'relative',
    zIndex: 1,
  },

  // Loading Spinner Components
  modernSpinnerContainer: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  modernSpinner: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  spinnerRing1: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E5E5EA',
    borderTopColor: '#007AFF',
    borderRightColor: '#007AFF',
  },

  spinnerRing2: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    borderBottomColor: '#007AFF',
    borderLeftColor: '#007AFF',
  },

  spinnerCore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  // Text Sections
  modernToastText: {
    flex: 1,
    marginRight: 12,
  },

  modernLoadingTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
    letterSpacing: -0.24,
  },

  modernLoadingMessage: {
    fontSize: 15,
    color: '#86868B',
    lineHeight: 20,
    fontWeight: '400',
  },

  // Success Header
  modernSuccessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  modernSuccessTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    marginLeft: 6,
    letterSpacing: -0.24,
  },

  // Product Components
  modernProductImageContainer: {
    position: 'relative',
    marginRight: 16,
  },

  modernProductImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    resizeMode: 'cover',
  } as any,

  modernPlaceholderImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },

  modernSuccessBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 2,
  },

  modernSuccessRing: {
    position: 'absolute',
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#34C759',
    opacity: 0.2,
  },

  modernProductName: {
    fontSize: 15,
    color: '#1D1D1F',
    fontWeight: '500',
    marginBottom: 6,
    letterSpacing: -0.16,
  },

  modernProductMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modernQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  modernQuantityLabel: {
    fontSize: 13,
    color: '#86868B',
    fontWeight: '500',
    marginRight: 6,
  },

  modernQuantityBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },

  modernQuantityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  modernPriceText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1D1D1F',
    letterSpacing: -0.24,
  },

  // Action Buttons
  modernActionButtons: {
    alignItems: 'center',
    gap: 12,
  },

  modernViewCartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  modernCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Progress Bars
  modernProgressBar: {
    height: 3,
    backgroundColor: '#F2F2F7',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  modernProgressFill: {
    height: 3,
    backgroundColor: '#007AFF',
    borderRadius: 1.5,
  },

  modernSuccessProgressFill: {
    height: 3,
    backgroundColor: '#34C759',
    borderRadius: 1.5,
  },

  // Legacy styles for ErrorToast and InfoToast (keeping for compatibility)
  toastContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#2E8C83',
    overflow: 'hidden',
    position: 'relative',
  },

  errorContainer: {
    borderLeftColor: '#ff4757',
  },

  infoContainer: {
    borderLeftColor: '#3742fa',
  },

  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
    zIndex: 1,
  },

  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },

  errorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3742fa',
    justifyContent: 'center',
    alignItems: 'center',
  },

  messageInfo: {
    flex: 1,
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4757',
    marginBottom: 4,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3742fa',
    marginBottom: 4,
  },

  errorMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },

  infoMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },

  // Unused legacy styles (keeping for safety)
  loadingContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#4A90E2',
    overflow: 'hidden',
  },

  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },

  loadingIconContainer: {
    position: 'relative',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingSpinner: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  spinnerOuter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#E8F4FD',
    borderTopColor: '#4A90E2',
    borderRightColor: '#4A90E2',
  },

  spinnerInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F8FF',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  loadingDots: {
    position: 'absolute',
    bottom: -8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A90E2',
    marginHorizontal: 2,
  },

  dot1: {},
  dot2: {},
  dot3: {},

  loadingInfo: {
    flex: 1,
  },

  loadingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },

  loadingMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },

  loadingProgressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  loadingProgressFill: {
    height: 4,
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },

  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(46, 140, 131, 0.05)',
    borderRadius: 20,
  },

  productImageContainer: {
    position: 'relative',
    marginRight: 12,
  },

  productImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    resizeMode: 'cover',
  } as any,

  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f0f8f7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8f5f3',
  },

  successBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2E8C83',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#2E8C83',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 2,
  },

  pulseRing: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2E8C83',
    opacity: 0.3,
  },

  successIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2E8C83',
    justifyContent: 'center',
    alignItems: 'center',
  },

  productInfo: {
    flex: 1,
  },

  successTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8C83',
    marginBottom: 4,
  },

  productName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
    lineHeight: 18,
  },

  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  quantityBadge: {
    backgroundColor: '#2E8C83',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    shadowColor: '#2E8C83',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },

  quantityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },

  quantity: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },

  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8C83',
  },

  actions: {
    alignItems: 'center',
    marginLeft: 12,
    gap: 8,
  },

  viewCartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E8C83',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E8C83',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  viewCartText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E8C83',
    marginLeft: 4,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  progressFill: {
    height: 4,
    backgroundColor: '#2E8C83',
    borderRadius: 2,
  },
})

export default {
  LoadingToast,
  CartSuccessToast,
  ErrorToast,
  InfoToast,
}
