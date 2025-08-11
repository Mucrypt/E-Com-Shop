import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabase'

/**
 * Emergency function to completely clear all cached session data
 * Use this when you need to force a fresh start
 */
export const clearAllSessionData = async (): Promise<void> => {
  try {
    console.log('🧹 Clearing all session data...')

    // 1. Sign out from Supabase (this should clear server-side session)
    await supabase.auth.signOut({ scope: 'global' })

    // 2. Clear all AsyncStorage data
    const keys = await AsyncStorage.getAllKeys()
    const supabaseKeys = keys.filter(
      (key) =>
        key.includes('supabase') ||
        key.includes('sb-') ||
        key.includes('auth') ||
        key.includes('session')
    )

    if (supabaseKeys.length > 0) {
      await AsyncStorage.multiRemove(supabaseKeys)
      console.log('🗑️ Cleared AsyncStorage keys:', supabaseKeys)
    }

    // 3. Clear specific known keys
    const knownKeys = [
      'supabase.auth.token',
      'sb-fanfpoarmlkrwugzbrhl-auth-token', // Your project specific key
      '@supabase/auth-js',
      'supabase.session',
    ]

    for (const key of knownKeys) {
      try {
        await AsyncStorage.removeItem(key)
      } catch (error) {
        // Key might not exist, ignore
      }
    }

    // 4. Force clear all possible auth-related keys
    await AsyncStorage.clear() // Nuclear option - clears everything

    console.log('✅ All session data cleared successfully')
  } catch (error) {
    console.error('❌ Error clearing session data:', error)
  }
}

/**
 * Check what session data exists
 */
export const debugSessionData = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys()
    console.log('📋 All AsyncStorage keys:', keys)

    const authKeys = keys.filter(
      (key) =>
        key.includes('supabase') || key.includes('sb-') || key.includes('auth')
    )

    console.log('🔑 Auth-related keys:', authKeys)

    for (const key of authKeys) {
      const value = await AsyncStorage.getItem(key)
      console.log(`   ${key}:`, value ? 'Has data' : 'Empty')
    }

    // Check current Supabase session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    console.log('🔒 Current Supabase session:', session ? 'Active' : 'None')
  } catch (error) {
    console.error('Error debugging session data:', error)
  }
}
