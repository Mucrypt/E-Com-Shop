// components/SheinSidebar.tsx
import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  PanResponder,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useSidebar } from '../contexts/SidebarContext'
import { useCategories } from '../api/server/api'

const { width } = Dimensions.get('window')
const SIDEBAR_WIDTH = width * 0.8

const TOP_TABS = [
  { id: 'all', label: 'All' },
  { id: 'women', label: 'Women' },
  { id: 'curvy', label: 'Curvy' },
  { id: 'kids', label: 'Kids' },
  { id: 'men', label: 'Men' },
  { id: 'home', label: 'Home & Living' },
]

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=200'

const BOTTOM_TABS = [
  { label: 'Home', icon: 'home' as const, route: '/(shop)/index' },
  { label: 'Media', icon: 'play-circle' as const, route: '/(media)' },
  { label: 'Cart', icon: 'shopping-cart' as const, route: '/(tabs)/cart' },
  { label: 'Me', icon: 'user' as const, route: '/(shop)/profile' },
]

const SheinSidebar: React.FC = () => {
  const { open, close } = useSidebar()
  const { data: categories } = useCategories()

  const [visible, setVisible] = useState(false)
  const [activeTopTabId, setActiveTopTabId] = useState('all')

  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          const translateX = Math.max(gestureState.dx, -SIDEBAR_WIDTH)
          slideAnim.setValue(translateX)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -40) {
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: -SIDEBAR_WIDTH,
              duration: 180,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setVisible(false)
            close()
          })
        } else {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current

  // open/close animation
  useEffect(() => {
    if (open) {
      setVisible(true)
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start()
    } else if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false))
    }
  }, [open])

  if (!visible) return null

  const backendCategories =
    (categories as any[])?.map((c, index) => ({
      id: c.id ?? index,
      name: c.name ?? c.title ?? 'Category',
      imageUrl:
        c.imageUrl || c.thumbnail || c.iconUrl || c.image || FALLBACK_IMAGE,
      slug: c.slug ?? c.id ?? `${index}`,
    })) ?? []

  const uiCategories =
    backendCategories.length > 0
      ? backendCategories
      : [
          { id: 1, name: 'New In', imageUrl: FALLBACK_IMAGE, slug: 'new-in' },
          {
            id: 2,
            name: 'Flash Sale',
            imageUrl: FALLBACK_IMAGE,
            slug: 'flash-sale',
          },
          { id: 3, name: 'Women', imageUrl: FALLBACK_IMAGE, slug: 'women' },
          { id: 4, name: 'Men', imageUrl: FALLBACK_IMAGE, slug: 'men' },
          { id: 5, name: 'Kids', imageUrl: FALLBACK_IMAGE, slug: 'kids' },
          {
            id: 6,
            name: 'Home & Living',
            imageUrl: FALLBACK_IMAGE,
            slug: 'home-living',
          },
        ]

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      {/* drawer on the LEFT */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* close button */}
        <TouchableOpacity style={styles.closeButton} onPress={close}>
          <FontAwesome name='close' size={22} color='#fff' />
        </TouchableOpacity>

        {/* top tabs */}
        <View style={styles.topTabs}>
          {TOP_TABS.map((tab) => {
            const active = tab.id === activeTopTabId
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.topTabItem, active && styles.topTabItemActive]}
                onPress={() => setActiveTopTabId(tab.id)}
              >
                <Text
                  style={[
                    styles.topTabText,
                    active && styles.topTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* categories list */}
        <View style={styles.categoryList}>
          {uiCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryRow}
              onPress={() => {
                router.push(`/categories/${encodeURIComponent(cat.slug)}`)
                close()
              }}
            >
              <Image
                source={{ uri: cat.imageUrl || FALLBACK_IMAGE }}
                style={styles.categoryImage}
              />
              <Text numberOfLines={1} style={styles.categoryName}>
                {cat.name}
              </Text>
              <FontAwesome name='angle-right' size={18} color='#999' />
            </TouchableOpacity>
          ))}
        </View>

        {/* bottom tabs inside drawer */}
        <View style={styles.bottomTabs}>
          {BOTTOM_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.label}
              style={styles.bottomTab}
              onPress={() => {
                router.push(tab.route as any)
                close()
              }}
            >
              <FontAwesome name={tab.icon} size={22} color='#333' />
              <Text style={styles.bottomTabLabel}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* dimmed area on the RIGHT – tap to close */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={close} />
    </Animated.View>
  )
}

export default SheinSidebar

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    zIndex: 999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    width: SIDEBAR_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.96)',
    paddingTop: 48,
    paddingHorizontal: 12,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  closeButton: {
    position: 'absolute',
    top: 22,
    right: 16,
    backgroundColor: '#000',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTabs: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  topTabItem: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 6,
  },
  topTabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#111',
  },
  topTabText: {
    fontSize: 13,
    color: '#888',
  },
  topTabTextActive: {
    color: '#111',
    fontWeight: '600',
  },
  categoryList: {
    flex: 1,
    paddingTop: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  categoryImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  categoryName: {
    flex: 1,
    fontSize: 15,
    color: '#222',
  },
  bottomTabs: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e3e3e3',
    paddingTop: 8,
    paddingBottom: 2,
    justifyContent: 'space-between',
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
  },
  bottomTabLabel: {
    fontSize: 11,
    marginTop: 2,
    color: '#333',
  },
})
