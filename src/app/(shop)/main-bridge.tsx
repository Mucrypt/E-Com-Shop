import { useEffect } from 'react'
import { View } from 'react-native'
import { router } from 'expo-router'

export default function MainBridgeScreen() {
  useEffect(() => {
    router.replace('/(main)')
  }, [])

  return <View />
}
