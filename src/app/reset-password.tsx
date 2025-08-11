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
import { useAuthStore } from '../store/authStore'

const ResetPassword = () => {
  const { token } = useLocalSearchParams<{ token?: string }>()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { resetPassword, isLoading, authError, clearError } = useAuthStore()

  useEffect(() => {
    if (!token) {
      Alert.alert(
        'Invalid Link',
        'This password reset link is invalid or has expired. Please request a new one.',
        [
          {
            text: 'Request New Link',
            onPress: () => router.replace('/forgot-password'),
          },
        ]
      )
    }
  }, [token])

  const validatePasswords = () => {
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password')
      return false
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long')
      return false
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validatePasswords()) return
    if (!token) return

    const success = await resetPassword(token, newPassword)

    if (success) {
      Alert.alert(
        'Password Reset Successful',
        'Your password has been successfully reset. You can now sign in with your new password.',
        [
          {
            text: 'Sign In',
            onPress: () => router.replace('/auth'),
          },
        ]
      )
    } else if (authError) {
      Alert.alert('Error', authError)
      clearError()
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '#ddd' }
    if (password.length < 6)
      return { strength: 1, text: 'Weak', color: '#ff4757' }
    if (password.length < 8)
      return { strength: 2, text: 'Fair', color: '#ffa502' }
    if (
      password.length >= 8 &&
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
    ) {
      return { strength: 4, text: 'Strong', color: '#2ed573' }
    }
    return { strength: 3, text: 'Good', color: '#5352ed' }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  if (!token) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <FontAwesome name='exclamation-triangle' size={60} color='#ff4757' />
        <Text style={styles.errorTitle}>Invalid Reset Link</Text>
        <Text style={styles.errorSubtitle}>
          This password reset link is invalid or has expired.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <FontAwesome name='key' size={60} color='#2E8C83' />
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Please enter your new password below. Make sure it's strong and
            unique.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <FontAwesome
              name='lock'
              size={20}
              color='#666'
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='New Password'
              value={newPassword}
              onChangeText={setNewPassword}
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

          {newPassword.length > 0 && (
            <View style={styles.passwordStrengthContainer}>
              <View style={styles.passwordStrengthBar}>
                <View
                  style={[
                    styles.passwordStrengthFill,
                    {
                      width: `${(passwordStrength.strength / 4) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.passwordStrengthText,
                  { color: passwordStrength.color },
                ]}
              >
                {passwordStrength.text}
              </Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <FontAwesome
              name='lock'
              size={20}
              color='#666'
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='Confirm New Password'
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

          {confirmPassword.length > 0 && (
            <View style={styles.matchIndicator}>
              {newPassword === confirmPassword ? (
                <View style={styles.matchSuccess}>
                  <FontAwesome name='check' size={12} color='#2ed573' />
                  <Text style={styles.matchSuccessText}>Passwords match</Text>
                </View>
              ) : (
                <View style={styles.matchError}>
                  <FontAwesome name='times' size={12} color='#ff4757' />
                  <Text style={styles.matchErrorText}>
                    Passwords don't match
                  </Text>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading || !token}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color='#fff' size='small' />
                <Text style={styles.submitButtonText}>Resetting...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Reset Password</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/auth')}
          >
            <FontAwesome name='arrow-left' size={16} color='#2E8C83' />
            <Text style={styles.backButtonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Password Tips:</Text>
          <View style={styles.tip}>
            <FontAwesome name='circle' size={6} color='#666' />
            <Text style={styles.tipText}>Use at least 8 characters</Text>
          </View>
          <View style={styles.tip}>
            <FontAwesome name='circle' size={6} color='#666' />
            <Text style={styles.tipText}>
              Include uppercase and lowercase letters
            </Text>
          </View>
          <View style={styles.tip}>
            <FontAwesome name='circle' size={6} color='#666' />
            <Text style={styles.tipText}>
              Add numbers and special characters
            </Text>
          </View>
          <View style={styles.tip}>
            <FontAwesome name='circle' size={6} color='#666' />
            <Text style={styles.tipText}>
              Avoid common words or personal information
            </Text>
          </View>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8C83',
    marginTop: 20,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4757',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    width: '100%',
    marginBottom: 30,
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
  passwordStrengthContainer: {
    marginBottom: 15,
  },
  passwordStrengthBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginBottom: 5,
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  matchIndicator: {
    marginBottom: 15,
  },
  matchSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  matchSuccessText: {
    color: '#2ed573',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  matchError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  matchErrorText: {
    color: '#ff4757',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  submitButton: {
    backgroundColor: '#2E8C83',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  backButtonText: {
    color: '#2E8C83',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
})

export default ResetPassword
