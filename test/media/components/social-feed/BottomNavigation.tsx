import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useNavigation } from 'expo-router'
import AnimatedButton from '../ui/AnimatedButton'
import { styles } from '../../../../src/styles/BottomNavigation.styles'

const BottomNavigation: React.FC = () => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = React.useState('home')

  const tabs = [
    {
      id: 'home',
      icon: 'home',
      label: 'Home',
      screen: 'Home',
    },
    {
      id: 'discover',
      icon: 'search',
      label: 'Discover',
      screen: 'Discover',
    },
    {
      id: 'create',
      icon: 'add',
      label: 'Create',
      screen: 'Create',
      isSpecial: true,
    },
    {
      id: 'cart',
      icon: 'cart',
      label: 'Cart',
      screen: 'Cart',
    },
    {
      id: 'profile',
      icon: 'person',
      label: 'Profile',
      screen: 'Profile',
    },
  ]

  const handleTabPress = (tab: (typeof tabs)[0]) => {
    if (tab.id === 'create') {
      router.push('/media/create')
    } else {
      setActiveTab(tab.id)
      // navigation.navigate(tab.screen)
    }
  }

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <AnimatedButton
          key={tab.id}
          onPress={() => handleTabPress(tab)}
          style={styles.tabButton}
          scaleTo={0.9}
          withHapticFeedback
        >
          {tab.isSpecial ? (
            <View style={styles.specialTab}>
              <Ionicons name={tab.icon as any} size={24} color='#fff' />
            </View>
          ) : (
            <>
              <Ionicons
                name={
                  activeTab === tab.id
                    ? (tab.icon as any)
                    : (`${tab.icon}-outline` as any)
                }
                size={24}
                color={activeTab === tab.id ? '#2E8C83' : '#666'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.id && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </>
          )}
        </AnimatedButton>
      ))}
    </View>
  )
}

export default BottomNavigation
