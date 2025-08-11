import { Stack } from 'expo-router'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { AppProviders } from '../providers'

// Custom header component for Mukulah logo
const MukulahHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <FontAwesome name='shopping-bag' size={24} color='#fff' />
        </View>
        <Text style={styles.logoText}>Mukulah</Text>
      </View>
    </View>
  )
}

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack>
        <Stack.Screen name='splash' options={{ headerShown: false }} />
        <Stack.Screen name='start' options={{ headerShown: false }} />
        <Stack.Screen
          name='language-country'
          options={{ headerShown: false }}
        />
        <Stack.Screen name='privacy-policy' options={{ headerShown: false }} />
        <Stack.Screen name='inspiration' options={{ headerShown: false }} />

        <Stack.Screen
          name='(shop)'
          options={{
            headerShown: true,
            headerTitle: () => <MukulahHeader />,
            headerStyle: {
              backgroundColor: '#2E8C83',
            },
            headerTitleAlign: 'center',
            headerShadowVisible: true,
          }}
        />

        <Stack.Screen
          name='auth'
          options={{ title: 'Authentication', headerShown: true }}
        />
        <Stack.Screen
          name='categories'
          options={{ title: 'Categories', headerShown: false }}
        />
        <Stack.Screen
          name='product'
          options={{ title: 'Product Details', headerShown: false }}
        />
        <Stack.Screen
          name='+not-found'
          options={{
            title: 'Not Found',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#2E8C83',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack>
    </AppProviders>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#ff4444',
    borderRadius: 4,
  },
})
