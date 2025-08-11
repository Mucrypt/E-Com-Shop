import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useDarkMode } from '../contexts/DarkModeContext'
import { useAuth } from '../providers'
import { clearAllSessionData, debugSessionData } from '../lib/session-utils'

const DebugScreen = () => {
  const { isDarkMode, colors } = useDarkMode()
  const { user, isAuthenticated, getUserRole, hasRole } = useAuth()
  const [devMode, setDevMode] = useState(false)
  const [showSensitive, setShowSensitive] = useState(false)
  const [appInfo, setAppInfo] = useState({
    version: '1.0.0',
    buildNumber: '1',
    environment: 'development',
  })

  useEffect(() => {
    // Load app info - you can replace with actual values
    setAppInfo({
      version: '1.0.0',
      buildNumber: Date.now().toString().slice(-4),
      environment: __DEV__ ? 'development' : 'production',
    })
  }, [])

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
            await clearAllSessionData()
            Alert.alert(
              'Success',
              'All session data cleared! Please restart the app for changes to take effect.',
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/(shop)/profile'),
                },
              ]
            )
          },
        },
      ]
    )
  }

  const handleDebugSession = async () => {
    await debugSessionData()
    Alert.alert(
      'Debug Complete',
      'Session data has been logged to console. Check your development console for details.'
    )
  }

  const handleClearCache = () => {
    Alert.alert(
      'Clear App Cache',
      'This will clear all app cache including images and temporary data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // In a real app, you would implement cache clearing here
            Alert.alert('Success', 'App cache cleared!')
          },
        },
      ]
    )
  }

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will clear ALL app data and reset to factory settings. This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearAllSessionData()
            // Additional reset logic would go here
            Alert.alert(
              'App Reset',
              'App has been reset. Please restart the app.',
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/auth'),
                },
              ]
            )
          },
        },
      ]
    )
  }

  const handleExportLogs = () => {
    Alert.alert(
      'Export Debug Logs',
      'This would export debug logs and user data for troubleshooting.'
    )
  }

  const debugActions = [
    {
      id: 'clear-session',
      title: 'Clear Session Data',
      subtitle: 'Clear cached authentication data',
      icon: 'trash',
      color: '#ff6b6b',
      action: handleClearSession,
    },
    {
      id: 'debug-session',
      title: 'Debug Session Info',
      subtitle: 'Log current session data to console',
      icon: 'bug',
      color: '#4ECDC4',
      action: handleDebugSession,
    },
    {
      id: 'clear-cache',
      title: 'Clear App Cache',
      subtitle: 'Clear images and temporary data',
      icon: 'eraser',
      color: '#45B7D1',
      action: handleClearCache,
    },
    {
      id: 'export-logs',
      title: 'Export Debug Logs',
      subtitle: 'Export logs for troubleshooting',
      icon: 'download',
      color: '#FFA726',
      action: handleExportLogs,
    },
    {
      id: 'reset-app',
      title: 'Reset App',
      subtitle: 'Factory reset (dangerous)',
      icon: 'exclamation-triangle',
      color: '#dc3545',
      action: handleResetApp,
    },
  ]

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name='arrow-left' size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Debug & Tools
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* App Info */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            App Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Version:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {appInfo.version}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Build:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {appInfo.buildNumber}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Environment:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {appInfo.environment}
            </Text>
          </View>
        </View>

        {/* User Info */}
        {isAuthenticated && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              User Information
            </Text>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Status:
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Email:
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {showSensitive ? user?.email : '*****@*****.***'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Role:
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {getUserRole()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                User ID:
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {showSensitive ? user?.id : '***hidden***'}
              </Text>
            </View>
          </View>
        )}

        {/* Debug Settings */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Debug Settings
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Developer Mode
              </Text>
              <Text
                style={[
                  styles.settingSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Enable advanced debugging features
              </Text>
            </View>
            <Switch
              value={devMode}
              onValueChange={setDevMode}
              trackColor={{ false: '#e0e0e0', true: '#2E8C83' }}
              thumbColor={devMode ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Show Sensitive Data
              </Text>
              <Text
                style={[
                  styles.settingSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Display user IDs and email addresses
              </Text>
            </View>
            <Switch
              value={showSensitive}
              onValueChange={setShowSensitive}
              trackColor={{ false: '#e0e0e0', true: '#2E8C83' }}
              thumbColor={showSensitive ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Debug Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Debug Actions
          </Text>
          {debugActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionItem, { backgroundColor: colors.surface }]}
              onPress={action.action}
            >
              <View
                style={[styles.actionIcon, { backgroundColor: action.color }]}
              >
                <FontAwesome name={action.icon as any} size={20} color='#fff' />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>
                  {action.title}
                </Text>
                <Text
                  style={[
                    styles.actionSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  {action.subtitle}
                </Text>
              </View>
              <FontAwesome name='chevron-right' size={16} color='#ccc' />
            </TouchableOpacity>
          ))}
        </View>

        {/* Warning */}
        <View style={styles.warningSection}>
          <FontAwesome name='exclamation-triangle' size={20} color='#FFA726' />
          <Text style={styles.warningText}>
            This screen contains powerful debugging tools. Use with caution in
            production.
          </Text>
        </View>
      </View>

      <StatusBar style='auto' />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  warningSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  warningText: {
    fontSize: 14,
    color: '#F57C00',
    marginLeft: 10,
    flex: 1,
  },
})

export default DebugScreen
