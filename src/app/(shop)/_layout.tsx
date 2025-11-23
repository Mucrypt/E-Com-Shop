// app/(shop)/_layout.tsx
import React, { useRef } from 'react'
import { Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  StyleSheet,
  View,
  PanResponder,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SheinSidebar from '../../components/SheinSidebar'
import { useSidebar } from '../../contexts/SidebarContext'

const queryClient = new QueryClient()

type TabBarIconProps = {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}

function TabBarIcon({ name }: TabBarIconProps) {
  // Brand color for normal tabs
  return <FontAwesome name={name} size={24} color='#2E8C83' />
}

const EdgeSwipeOpener: React.FC = () => {
  const { toggle, open } = useSidebar()

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        !open && gestureState.moveX < 20 && gestureState.dx > 10,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 25) {
          toggle()
        }
      },
    })
  ).current

  return (
    <View style={styles.edgeSwipeZone} {...panResponder.panHandlers} />
  )
}

const TabsLayout: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
        {/* Edge swipe to open sidebar */}
        <EdgeSwipeOpener />

        {/* Global SHEIN-style sidebar */}
        <SheinSidebar />

        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#bf0e40ff',
            tabBarInactiveTintColor: '#1c1317ff',
            tabBarLabelStyle: { fontSize: 12 },
            tabBarStyle: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: '#bed8d4',
              borderTopColor: '#041213ff',
              paddingTop: 10,
              paddingBottom: 25,
              height: 90,
            },
            headerShown: false,
          }}
        >
          {/* Hidden routes */}
          <Tabs.Screen
            name='favorites'
            options={{
              href: null,
            }}
          />

          {/* LEFT – Home */}


          {/* LEFT – Shop Home */}
          <Tabs.Screen
            name='index'
            options={{
              title: 'Home',
              tabBarIcon: (props) => (
                <TabBarIcon name='home' color={props.color} />
              ),
            }}
          />

          {/* SECOND – Categories (like SHEIN) */}
          <Tabs.Screen
            name='categories'
            options={{
              title: 'Categories',
              tabBarIcon: (props) => (
                <TabBarIcon name='list' color={props.color} />
              ),
            }}
          />

          {/* CENTER – ROUND BUTTON: Trends Home */}
          <Tabs.Screen
            name='trends'
            options={{
              title: 'Trends',
              tabBarIcon: () => (
                <View style={{ alignItems: 'center' }}>
                  <FontAwesome name='line-chart' size={24} color='#000' />
                </View>
              ),
            }}
          />

          {/* RIGHT SIDE – Shop & Media */}
          <Tabs.Screen
            name='shop'
            options={{
              title: 'Shop',
              tabBarIcon: (props) => (
                <TabBarIcon name='shopping-bag' color={props.color} />
              ),
            }}
          />

          <Tabs.Screen
            name='main-bridge'
            options={{
              title: 'Main',
              tabBarIcon: (props) => (
                <TabBarIcon name='th-large' color={props.color} />
              ),
            }}
            listeners={{
              tabPress: (e) => {
                e.preventDefault();
                // Navigate to main app
                require('expo-router').router.push('/(main)');
              },
            }}
          />
        </Tabs>
      </SafeAreaView>
    </QueryClientProvider>
  )
}

export default TabsLayout

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  edgeSwipeZone: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 20,
    zIndex: 5,
  },
})
