import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useAuth } from '../providers/auth-provider'

const Auth = () => {
  const { mode } = useLocalSearchParams<{ mode?: string }>()
  const [isLogin, setIsLogin] = useState(mode === 'register' ? false : true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const { signIn, signUp, isLoading } = useAuth()

  // Update login mode based on URL parameter
  useEffect(() => {
    if (mode === 'register') {
      setIsLogin(false)
    } else {
      setIsLogin(true)
    }
  }, [mode])

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email')
      return false
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password')
      return false
    }
    if (!isLogin) {
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter your full name')
        return false
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match')
        return false
      }
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters')
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setAuthError(null)
    let result

    if (isLogin) {
      result = await signIn(email, password)
      if (!result.error) {
        router.replace('/(main)/')
      } else {
        setAuthError(result.error.message)
      }
    } else {
      result = await signUp(email, password, name)
      if (!result.error) {
        Alert.alert(
          'Account Created!',
          'Please check your email to verify your account before signing in.',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsLogin(true)
                setEmail('')
                setPassword('')
                setName('')
                setConfirmPassword('')
              },
            },
          ]
        )
      } else {
        setAuthError(result.error.message)
      }
    }

    if (authError) {
      Alert.alert('Error', authError)
    }
  }

  const handleForgotPassword = () => {
    router.push('/forgot-password')
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setAuthError(null)
    // Update URL to reflect the mode change
    router.setParams({ mode: isLogin ? 'register' : 'login' })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <FontAwesome name='shopping-bag' size={60} color='#2E8C83' />
          <Text style={styles.title}>E-Com Shop</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <FontAwesome
                name='user'
                size={20}
                color='#666'
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Full Name'
                value={name}
                onChangeText={setName}
                autoCapitalize='words'
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <FontAwesome
              name='envelope'
              size={20}
              color='#666'
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='Email'
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome
              name='lock'
              size={20}
              color='#666'
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize='none'
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome
                name={showPassword ? 'eye-slash' : 'eye'}
                size={16}
                color='#999'
              />
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <FontAwesome
                name='lock'
                size={20}
                color='#666'
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Confirm Password'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize='none'
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesome
                  name={showConfirmPassword ? 'eye-slash' : 'eye'}
                  size={16}
                  color='#999'
                />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color='#fff' size='small' />
                <Text style={styles.submitButtonText}>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchButton} onPress={switchMode}>
            <Text style={styles.switchButtonText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </Text>
          </TouchableOpacity>

          {isLogin && (
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}
        </View>

        <StatusBar style='auto' />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E8C83',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  submitButton: {
    backgroundColor: '#2E8C83',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  switchButton: {
    alignItems: 'center',
    marginBottom: 15,
  },
  switchButtonText: {
    color: '#2E8C83',
    fontSize: 16,
  },
  forgotButton: {
    alignItems: 'center',
  },
  forgotButtonText: {
    color: '#999',
    fontSize: 14,
  },
})

export default Auth
