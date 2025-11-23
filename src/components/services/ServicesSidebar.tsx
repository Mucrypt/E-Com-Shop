// components/services/ServicesSidebar.tsx
import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  PanResponder,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Colors, Spacing, Typography } from '../../constants'

const { width, height } = Dimensions.get('window')
const SIDEBAR_WIDTH = width * 0.8

interface ServicesSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const SERVICE_CATEGORIES = [
  { id: 'development', label: 'Development & Tech', icon: 'code', route: '/(services)/index?category=development' },
  { id: 'design', label: 'Design & Creative', icon: 'paint-brush', route: '/(services)/index?category=design' },
  { id: 'writing', label: 'Writing & Translation', icon: 'pencil', route: '/(services)/index?category=writing' },
  { id: 'marketing', label: 'Digital Marketing', icon: 'bullhorn', route: '/(services)/index?category=marketing' },
  { id: 'business', label: 'Business & Finance', icon: 'briefcase', route: '/(services)/index?category=business' },
  { id: 'music', label: 'Music & Audio', icon: 'music', route: '/(services)/index?category=music' },
  { id: 'video', label: 'Video & Animation', icon: 'video-camera', route: '/(services)/index?category=video' },
  { id: 'lifestyle', label: 'Lifestyle & Wellness', icon: 'heart', route: '/(services)/index?category=lifestyle' },
]

const QUICK_ACTIONS = [
  { id: 'post', label: 'Post a Service', icon: 'plus-circle', route: '/(services)/post', color: Colors.primary[500] },
  { id: 'saved', label: 'My Saved Services', icon: 'bookmark', route: '/(services)/saved', color: Colors.status.info },
  { id: 'messages', label: 'Service Messages', icon: 'comments', route: '/(services)/messages', color: Colors.status.success },
  { id: 'courses', label: 'Courses & Skills', icon: 'graduation-cap', route: '/(services)/courses', color: Colors.special.featured },
]

const POPULAR_SERVICES = [
  { id: 'web-dev', label: 'Website Development', price: 'From $299' },
  { id: 'logo-design', label: 'Logo Design', price: 'From $49' },
  { id: 'content-writing', label: 'Content Writing', price: 'From $25' },
  { id: 'seo', label: 'SEO Optimization', price: 'From $99' },
]

const ServicesSidebar: React.FC<ServicesSidebarProps> = ({ isOpen, onClose }) => {
  const [visible, setVisible] = useState(false)
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const insets = useSafeAreaInsets()

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          slideAnim.setValue(Math.max(-SIDEBAR_WIDTH, gestureState.dx - SIDEBAR_WIDTH))
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50 || gestureState.vx < -0.5) {
          onClose()
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false)
      })
    }
  }, [isOpen, slideAnim, fadeAnim])

  const handleNavigation = (route: string) => {
    onClose()
    setTimeout(() => {
      router.push(route as any)
    }, 100)
  }

  if (!visible) return null

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[styles.backdrop, { opacity: fadeAnim }]}
      >
        <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sidebar,
          { 
            transform: [{ translateX: slideAnim }],
            top: insets.top,
            height: height - insets.top
          }
        ]}
        {...panResponder.panHandlers}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.logoContainer}>
                <FontAwesome name="cogs" size={24} color={Colors.primary[500]} />
                <Text style={styles.logoText}>Mukulah Services</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <FontAwesome name="times" size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.headerSubtitle}>Find & offer professional services</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionItem}
                onPress={() => handleNavigation(action.route)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
                  <FontAwesome name={action.icon} size={18} color={action.color} />
                </View>
                <Text style={styles.quickActionText}>{action.label}</Text>
                <FontAwesome name="chevron-right" size={12} color={Colors.text.muted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Service Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            {SERVICE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => handleNavigation(category.route)}
              >
                <View style={styles.categoryIcon}>
                  <FontAwesome name={category.icon} size={16} color={Colors.text.secondary} />
                </View>
                <Text style={styles.categoryText}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Popular Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            {POPULAR_SERVICES.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.popularServiceItem}
                onPress={() => handleNavigation(`/(services)/index?search=${service.label}`)}
              >
                <View>
                  <Text style={styles.popularServiceName}>{service.label}</Text>
                  <Text style={styles.popularServicePrice}>{service.price}</Text>
                </View>
                <FontAwesome name="chevron-right" size={12} color={Colors.text.muted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => handleNavigation('/(main)')}
            >
              <FontAwesome name="home" size={18} color={Colors.background.primary} />
              <Text style={styles.footerButtonText}>Back to Main App</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: height,
    backgroundColor: Colors.background.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  logoText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Spacing[2],
  },
  headerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
  },
  section: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing[3],
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[3],
    gap: Spacing[3],
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.text.primary,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[2],
    gap: Spacing[3],
  },
  categoryIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
  popularServiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing[2],
  },
  popularServiceName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.text.primary,
  },
  popularServicePrice: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary[500],
    fontWeight: Typography.weights.semiBold,
    marginTop: Spacing[1],
  },
  footer: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[6],
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: 8,
    gap: Spacing[2],
  },
  footerButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.background.primary,
  },
})

export default ServicesSidebar