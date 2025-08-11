import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useAuth } from '../providers/auth-provider'
import { useSession } from '../providers/session-provider'
import { useAppState } from '../providers/app-state-provider'
import { useProducts } from '../providers/product-provider'

export default function AuthTestScreen() {
  const [testResults, setTestResults] = useState<{
    [key: string]: 'pass' | 'fail' | 'pending'
  }>({})

  const {
    user,
    session,
    isLoading: authLoading,
    isAuthenticated,
    getGreeting,
    getUserInitials,
    isEmailConfirmed,
  } = useAuth()

  const { sessionData, isSessionActive, getSessionDuration } = useSession()

  const { isOnline, appVersion, isFirstLaunch, getAppUptime } = useAppState()

  const {
    products,
    categories,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts()

  useEffect(() => {
    runTests()
  }, [user, session, products, categories])

  const runTests = () => {
    const results: { [key: string]: 'pass' | 'fail' | 'pending' } = {}

    // Auth tests
    results['Auth Provider Loaded'] = user !== undefined ? 'pass' : 'fail'
    results['Session Available'] = session !== undefined ? 'pass' : 'fail'
    results['User Authenticated'] = isAuthenticated ? 'pass' : 'fail'
    results['User Profile Data'] = user?.profile ? 'pass' : 'fail'

    // Session tests
    results['Session Provider Loaded'] = sessionData ? 'pass' : 'fail'
    results['Session Active'] = isSessionActive ? 'pass' : 'fail'

    // App state tests
    results['App State Loaded'] = appVersion ? 'pass' : 'fail'
    results['Network Status'] = isOnline ? 'pass' : 'fail'

    // Product tests
    results['Products Loaded'] = products.length > 0 ? 'pass' : 'fail'
    results['Categories Loaded'] = categories.length > 0 ? 'pass' : 'fail'
    results['No Product Errors'] = !productsError ? 'pass' : 'fail'

    setTestResults(results)
  }

  const getStatusIcon = (status: 'pass' | 'fail' | 'pending') => {
    switch (status) {
      case 'pass':
        return <FontAwesome name='check-circle' size={16} color='#4CAF50' />
      case 'fail':
        return <FontAwesome name='times-circle' size={16} color='#F44336' />
      case 'pending':
        return <FontAwesome name='clock-o' size={16} color='#FF9800' />
    }
  }

  const showUserDetails = () => {
    if (!user) {
      Alert.alert('No User', 'No authenticated user found')
      return
    }

    Alert.alert(
      'User Details',
      `ID: ${user.id}
Email: ${user.email}
Name: ${user.profile?.full_name || 'Not set'}
Confirmed: ${isEmailConfirmed() ? 'Yes' : 'No'}
Greeting: ${getGreeting()}
Initials: ${getUserInitials()}`
    )
  }

  const showSessionDetails = () => {
    Alert.alert(
      'Session Details',
      `Active: ${isSessionActive ? 'Yes' : 'No'}
Duration: ${getSessionDuration()}
Login Count: ${sessionData.loginCount}
Last Login: ${sessionData.lastLoginTime?.toLocaleString() || 'Never'}
Auto Logout: ${sessionData.preferences.autoLogout ? 'Enabled' : 'Disabled'}`
    )
  }

  const showAppDetails = () => {
    Alert.alert(
      'App Details',
      `Version: ${appVersion}
Uptime: ${getAppUptime()}
First Launch: ${isFirstLaunch ? 'Yes' : 'No'}
Online: ${isOnline ? 'Yes' : 'No'}`
    )
  }

  const showProductDetails = () => {
    Alert.alert(
      'Product Details',
      `Products: ${products.length}
Categories: ${categories.length}
Loading: ${productsLoading ? 'Yes' : 'No'}
Error: ${productsError || 'None'}`
    )
  }

  const passedTests = Object.values(testResults).filter(
    (r) => r === 'pass'
  ).length
  const totalTests = Object.keys(testResults).length
  const successRate =
    totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name='flask' size={40} color='#2E8C83' />
        <Text style={styles.title}>Authentication Test</Text>
        <Text style={styles.subtitle}>
          System Status: {passedTests}/{totalTests} tests passed ({successRate}
          %)
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        {Object.entries(testResults).map(([test, status]) => (
          <View key={test} style={styles.testRow}>
            {getStatusIcon(status)}
            <Text
              style={[styles.testName, status === 'fail' && styles.failedTest]}
            >
              {test}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detailed Information</Text>

        <TouchableOpacity style={styles.detailButton} onPress={showUserDetails}>
          <FontAwesome name='user' size={16} color='#2E8C83' />
          <Text style={styles.detailButtonText}>User Details</Text>
          <FontAwesome name='chevron-right' size={12} color='#999' />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detailButton}
          onPress={showSessionDetails}
        >
          <FontAwesome name='clock-o' size={16} color='#2E8C83' />
          <Text style={styles.detailButtonText}>Session Details</Text>
          <FontAwesome name='chevron-right' size={12} color='#999' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.detailButton} onPress={showAppDetails}>
          <FontAwesome name='mobile' size={16} color='#2E8C83' />
          <Text style={styles.detailButtonText}>App Details</Text>
          <FontAwesome name='chevron-right' size={12} color='#999' />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detailButton}
          onPress={showProductDetails}
        >
          <FontAwesome name='shopping-bag' size={16} color='#2E8C83' />
          <Text style={styles.detailButtonText}>Product Details</Text>
          <FontAwesome name='chevron-right' size={12} color='#999' />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={runTests}>
        <FontAwesome name='refresh' size={16} color='#fff' />
        <Text style={styles.refreshButtonText}>Refresh Tests</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8C83',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  testName: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  failedTest: {
    color: '#F44336',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  detailButtonText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E8C83',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
})
