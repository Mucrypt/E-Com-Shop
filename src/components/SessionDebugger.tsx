import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native'
import { clearAllSessionData, debugSessionData } from '../lib/session-utils'
import { FontAwesome } from '@expo/vector-icons'
import { useAuth } from '../providers'
import { useDarkMode } from '../contexts/DarkModeContext'

interface SessionDebuggerProps {
  showTitle?: boolean
  compact?: boolean
}

/**
 * Enhanced Debug Component
 * Provides debugging tools for session management and authentication
 */
export const SessionDebugger: React.FC<SessionDebuggerProps> = ({
  showTitle = true,
  compact = false,
}) => {
  const { user, isAuthenticated, getUserRole, hasRole } = useAuth()
  const { colors } = useDarkMode()
  const [loading, setLoading] = useState(false)

  const handleClearSession = async () => {
    Alert.alert(
      'Clear All Session Data',
      'This will clear all cached authentication data and force a fresh start. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setLoading(true)
            try {
              await clearAllSessionData()
              Alert.alert(
                'Success',
                'All session data cleared! Please restart the app for changes to take effect.'
              )
            } catch (error) {
              Alert.alert('Error', 'Failed to clear session data')
            } finally {
              setLoading(false)
            }
          },
        },
      ]
    )
  }

  const handleDebugSession = async () => {
    setLoading(true)
    try {
      await debugSessionData()
      Alert.alert(
        'Debug Complete',
        `Session data logged to console.\n\nQuick Info:\n• User: ${
          user?.email || 'Not authenticated'
        }\n• Role: ${getUserRole()}\n• Auth Status: ${
          isAuthenticated ? 'Authenticated' : 'Not authenticated'
        }`
      )
    } catch (error) {
      Alert.alert('Error', 'Failed to debug session data')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleCheck = () => {
    const roleInfo = [
      `Current Role: ${getUserRole()}`,
      `Is Admin: ${hasRole('ADMIN')}`,
      `Is SuperAdmin: ${hasRole('SUPERADMIN')}`,
      `User ID: ${user?.id || 'N/A'}`,
      `Email: ${user?.email || 'N/A'}`,
    ].join('\n')

    Alert.alert('Role Information', roleInfo)
  }

  const handleForceReauth = () => {
    Alert.alert(
      'Force Re-authentication',
      'This will clear session and redirect to login screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Force Reauth',
          style: 'destructive',
          onPress: async () => {
            await clearAllSessionData()
            // In a real app, you would navigate to auth screen here
            Alert.alert('Success', 'Please restart the app to re-authenticate')
          },
        },
      ]
    )
  }

  if (compact) {
    return (
      <View
        style={[styles.compactContainer, { backgroundColor: colors.surface }]}
      >
        <TouchableOpacity
          style={styles.compactButton}
          onPress={handleClearSession}
        >
          <FontAwesome name='trash' size={14} color='#ff6b6b' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.compactButton}
          onPress={handleDebugSession}
        >
          <FontAwesome name='bug' size={14} color='#4ECDC4' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.compactButton}
          onPress={handleRoleCheck}
        >
          <FontAwesome name='user' size={14} color='#45B7D1' />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.surface }]}>
      {showTitle && (
        <Text style={[styles.title, { color: colors.text }]}>
          🛠️ Session Debugger
        </Text>
      )}

      {/* Status Info */}
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
            Status:
          </Text>
          <Text
            style={[
              styles.statusValue,
              {
                color: isAuthenticated ? '#4CAF50' : '#F44336',
              },
            ]}
          >
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
            Role:
          </Text>
          <Text style={[styles.statusValue, { color: colors.text }]}>
            {getUserRole()}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClearSession}
          disabled={loading}
        >
          <FontAwesome name='trash' size={16} color='#fff' />
          <Text style={styles.buttonText}>Clear Session</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.debugButton]}
          onPress={handleDebugSession}
          disabled={loading}
        >
          <FontAwesome name='bug' size={16} color='#fff' />
          <Text style={styles.buttonText}>Debug Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.roleButton]}
          onPress={handleRoleCheck}
          disabled={loading}
        >
          <FontAwesome name='user' size={16} color='#fff' />
          <Text style={styles.buttonText}>Check Roles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.reauthButton]}
          onPress={handleForceReauth}
          disabled={loading}
        >
          <FontAwesome name='refresh' size={16} color='#fff' />
          <Text style={styles.buttonText}>Force Reauth</Text>
        </TouchableOpacity>
      </View>

      {/* Warning */}
      <View style={styles.warningContainer}>
        <FontAwesome name='exclamation-triangle' size={16} color='#FFA726' />
        <Text style={styles.warningText}>
          Debug tool - Use with caution in production
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    margin: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff6b6b',
    maxHeight: 400,
  },
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  compactButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 15,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: '48%',
    marginVertical: 4,
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
  },
  debugButton: {
    backgroundColor: '#4ECDC4',
  },
  roleButton: {
    backgroundColor: '#45B7D1',
  },
  reauthButton: {
    backgroundColor: '#FFA726',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 12,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 167, 38, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  warningText: {
    fontSize: 12,
    color: '#F57C00',
    marginLeft: 8,
    flex: 1,
  },
})

export default SessionDebugger
