import { useToast } from 'react-native-toast-notifications'
import { router } from 'expo-router'
import React, { useRef, useCallback } from 'react'
// CustomToasts removed

export interface LoadingToastData {
  message?: string
}

export interface CartToastData {
  productName: string
  productPrice: number
  quantity: number
  productImage?: string
}

export interface ErrorToastData {
  title: string
  message: string
}

export interface InfoToastData {
  title: string
  message: string
  icon?: string
}

// Custom hook for toast management
export const useAppToast = () => {
  const toast = useToast()
  const loadingToastIdRef = useRef<string | null>(null)

  // showLoadingToast removed

  // hideLoadingToast removed

  // showCartSuccessToast removed

  // showErrorToast removed

  // showInfoToast removed

  // showSuccessToast removed

  // showWarningToast removed

  // Quick methods for common scenarios with enhanced loading
  // showProductAddedToCart removed

  // showCartCleared removed

  // showNetworkError removed

  // showOutOfStock removed

  return {
    // Direct toast access only
    toast,
  }
}

export default useAppToast
