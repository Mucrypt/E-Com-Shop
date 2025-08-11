import { useToast } from 'react-native-toast-notifications'
import { router } from 'expo-router'
import React, { useRef, useCallback } from 'react'
import {
  CartSuccessToast,
  ErrorToast,
  InfoToast,
  LoadingToast,
} from './CustomToasts'

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

  const showLoadingToast = (message: string = 'Processing...') => {
    // Hide previous loading toast if exists
    if (loadingToastIdRef.current) {
      toast.hide(loadingToastIdRef.current)
    }

    const toastId = toast.show(
      <LoadingToast message={message} onClose={() => hideLoadingToast()} />,
      {
        type: 'custom',
        placement: 'top',
        duration: 0, // Persistent until manually hidden
        animationType: 'slide-in',
        swipeEnabled: false, // Prevent accidental dismissal
      }
    )

    loadingToastIdRef.current = toastId
    return toastId
  }

  const hideLoadingToast = () => {
    if (loadingToastIdRef.current) {
      toast.hide(loadingToastIdRef.current)
      loadingToastIdRef.current = null
    }
  }

  const showCartSuccessToast = (data: CartToastData) => {
    const toastId = toast.show(
      <CartSuccessToast
        productName={data.productName}
        productPrice={data.productPrice}
        quantity={data.quantity}
        productImage={data.productImage}
        onViewCart={() => {
          toast.hide(toastId)
          router.push('/(shop)/cart')
        }}
        onClose={() => toast.hide(toastId)}
      />,
      {
        type: 'custom',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
        swipeEnabled: true,
      }
    )
    return toastId
  }

  const showErrorToast = (data: ErrorToastData) => {
    const toastId = toast.show(
      <ErrorToast
        title={data.title}
        message={data.message}
        onClose={() => toast.hide(toastId)}
      />,
      {
        type: 'custom',
        placement: 'top',
        duration: 3000,
        animationType: 'slide-in',
        swipeEnabled: true,
      }
    )
    return toastId
  }

  const showInfoToast = (data: InfoToastData) => {
    const toastId = toast.show(
      <InfoToast
        title={data.title}
        message={data.message}
        icon={data.icon}
        onClose={() => toast.hide(toastId)}
      />,
      {
        type: 'custom',
        placement: 'top',
        duration: 3000,
        animationType: 'slide-in',
        swipeEnabled: true,
      }
    )
    return toastId
  }

  const showSuccessToast = (title: string, message: string) => {
    showInfoToast({
      title,
      message,
      icon: 'check-circle',
    })
  }

  const showWarningToast = (title: string, message: string) => {
    showInfoToast({
      title,
      message,
      icon: 'exclamation-triangle',
    })
  }

  // Quick methods for common scenarios with enhanced loading
  const showProductAddedToCart = (
    productName: string,
    price: number,
    quantity = 1,
    productImage?: string
  ) => {
    // Show loading first
    const loadingId = showLoadingToast('Adding to cart...')

    // Simulate processing time for better UX
    setTimeout(() => {
      hideLoadingToast()
      showCartSuccessToast({
        productName,
        productPrice: price,
        quantity,
        productImage,
      })
    }, 800) // Short delay for smooth transition
  }

  const showProductRemovedFromCart = (productName: string) => {
    showInfoToast({
      title: 'Removed from Cart',
      message: `${productName} has been removed from your cart`,
      icon: 'trash',
    })
  }

  const showCartCleared = () => {
    showInfoToast({
      title: 'Cart Cleared',
      message: 'All items have been removed from your cart',
      icon: 'trash',
    })
  }

  const showNetworkError = () => {
    showErrorToast({
      title: 'Network Error',
      message: 'Please check your internet connection and try again',
    })
  }

  const showOutOfStock = (productName: string) => {
    showWarningToast('Out of Stock', `${productName} is currently out of stock`)
  }

  return {
    // Core methods
    showLoadingToast,
    hideLoadingToast,
    showCartSuccessToast,
    showErrorToast,
    showInfoToast,
    showSuccessToast,
    showWarningToast,

    // Convenience methods
    showProductAddedToCart,
    showProductRemovedFromCart,
    showCartCleared,
    showNetworkError,
    showOutOfStock,

    // Direct toast access
    toast,
  }
}

export default useAppToast
