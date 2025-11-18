// app/_layout.tsx
import { Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={24} {...props} style={{ color: '#2E8C83' }} />
}

const TabsLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView
        edges={['top', 'left', 'right', 'bottom']}
        style={styles.safeArea}
      >
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#bf0e40ff',
            tabBarInactiveTintColor: '#1c1317ff',
            tabBarLabelStyle: { fontSize: 14 },
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
          <Tabs.Screen
            name='index'
            options={{
              title: 'Home',
              tabBarIcon: (props) => <TabBarIcon {...props} name='home' />,
            }}
          />
          <Tabs.Screen
            name='shop'
            options={{
              title: 'Shop',
              tabBarIcon: (props) => (
                <TabBarIcon {...props} name='shopping-bag' />
              ),
            }}
          />
          <Tabs.Screen
            name='cart'
            options={{
              title: 'Cart',
              tabBarIcon: (props) => (
                <TabBarIcon {...props} name='shopping-cart' />
              ),
            }}
          />
          <Tabs.Screen
            name='orders'
            options={{
              title: 'Orders',
              tabBarIcon: (props) => <TabBarIcon {...props} name='book' />,
            }}
          />
          <Tabs.Screen
            name='profile'
            options={{
              title: 'Profile',
              tabBarIcon: (props) => <TabBarIcon {...props} name='user' />,
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
})
