import { useEffect } from 'react'
import { View } from 'react-native'
import { router } from 'expo-router'

export default function MediaBridgeScreen() {
  useEffect(() => {
    router.replace('/(media)')
  }, [])

  return <View />
}
