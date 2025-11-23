// app/sports-live/_layout.tsx
import React, { useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
} from 'react-native'
import { Tabs, router } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  SportsSidebarProvider,
  useSportsSidebar,
} from '../../lib/sports/SportsSidebarContext'
import { Colors, Spacing, Typography } from '../../constants'

function SportsSidebarOverlay() {
  const { isOpen, closeSidebar } = useSportsSidebar()
  const translateX = useRef(new Animated.Value(-260)).current

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -260,
      duration: 220,
      useNativeDriver: true,
    }).start()
  }, [isOpen, translateX])

  return (
    <View
      pointerEvents={isOpen ? 'auto' : 'none'}
      style={StyleSheet.absoluteFill}
    >
      {/* Dark backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={closeSidebar}
        style={styles.sidebarBackdrop}
      />

      {/* Sliding panel */}
      <Animated.View
        style={[
          styles.sidebarPanel,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.sidebarHeader}>
          <MaterialCommunityIcons
            name='soccer'
            size={24}
            color={Colors.primary[500]}
          />
          <Text style={styles.sidebarTitle}>Sports Center</Text>
        </View>

        <Text style={styles.sidebarSubtitle}>
          Tune your live experience across football, basketball, F1 and
          more.
        </Text>

        <View style={styles.sidebarMenu}>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              closeSidebar()
              router.push('/sports-live')
            }}
          >
            <MaterialCommunityIcons
              name='broadcast'
              size={20}
              color={Colors.text.secondary}
            />
            <Text style={styles.sidebarItemText}>Live matches</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              closeSidebar()
              router.push('/sports-live/favorites')
            }}
          >
            <MaterialCommunityIcons
              name='star-outline'
              size={20}
              color={Colors.text.secondary}
            />
            <Text style={styles.sidebarItemText}>My favourites</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              closeSidebar()
              router.push('/sports-live/events')
            }}
          >
            <MaterialCommunityIcons
              name='calendar-star'
              size={20}
              color={Colors.text.secondary}
            />
            <Text style={styles.sidebarItemText}>Events & watch parties</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              closeSidebar()
              router.push('/sports-live/for-you')
            }}
          >
            <MaterialCommunityIcons
              name='account-heart-outline'
              size={20}
              color={Colors.text.secondary}
            />
            <Text style={styles.sidebarItemText}>For you</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sidebarFooter}>
          <TouchableOpacity
            style={styles.sidebarFooterBtn}
            onPress={() => {
              closeSidebar()
              router.push('/core') // back to main universe home
            }}
          >
            <MaterialCommunityIcons
              name='home-outline'
              size={18}
              color={Colors.background.primary}
            />
            <Text style={styles.sidebarFooterText}>
              Back to Mukulah Universe
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

function SportsLiveTabs() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.background.secondary, // Brighter tab bar
            borderTopColor: Colors.border.secondary, // Brighter border
            height: 60,
            paddingBottom: 6,
          },
          tabBarActiveTintColor: Colors.primary[500],
          tabBarInactiveTintColor: Colors.text.muted,
          tabBarLabelStyle: {
            fontSize: Typography.sizes.xs,
            fontWeight: Typography.weights.semiBold,
          },
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Live',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name='scoreboard-outline'
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name='favorites'
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name='star-circle-outline'
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name='for-you'
          options={{
            title: 'For You',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name='account-heart-outline'
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name='events'
          options={{
            title: 'Events',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name='calendar-star'
                size={size}
                color={color}
              />
            ),
          }}
        />
        
        {/* Hidden route - dynamic league pages should not appear in tab navigation */}
        <Tabs.Screen
          name='league/[leagueId]'
          options={{
            href: null,
          }}
        />
      </Tabs>

      {/* Local sidebar overlay for sports-live only */}
      <SportsSidebarOverlay />
    </View>
  )
}

export default function SportsLiveLayout() {
  return (
    <SportsSidebarProvider>
      <SportsLiveTabs />
    </SportsSidebarProvider>
  )
}

const styles = StyleSheet.create({
  sidebarBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sidebarPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 260,
    backgroundColor: Colors.background.secondary, // Brighter sidebar
    paddingHorizontal: Spacing[4], // 16px
    paddingTop: 40,
    paddingBottom: Spacing[6], // 24px
    borderRightWidth: 1,
    borderRightColor: Colors.border.secondary, // Brighter border
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2], // 8px
  },
  sidebarTitle: {
    marginLeft: Spacing[2], // 8px
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  sidebarSubtitle: {
    color: Colors.text.muted,
    fontSize: Typography.sizes.xs,
    marginBottom: Spacing[4], // 16px
  },
  sidebarMenu: {
    marginTop: Spacing[2], // 8px
    gap: Spacing[3], // 12px
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[2], // 8px
  },
  sidebarItemText: {
    marginLeft: Spacing[3], // 12px
    color: Colors.text.secondary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
  },
  sidebarFooter: {
    marginTop: 'auto',
  },
  sidebarFooterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
    borderRadius: 999,
    paddingVertical: Spacing[3], // 12px
  },
  sidebarFooterText: {
    marginLeft: Spacing[2], // 8px
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.background.primary,
  },
})
