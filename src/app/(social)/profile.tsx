import React, { useEffect } from 'react'
import { router } from 'expo-router'

const ProfileScreen: React.FC = () => {
  useEffect(() => {
    // Redirect to main profile when user taps profile in Pulse/social tabs
    router.replace('/(profile)')
  }, [])

  // This component just redirects, so return null
  return null
}

export default ProfileScreen