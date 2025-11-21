import React from 'react'
import useCartSync from '../hooks/useCartSync'

export const CartSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useCartSync()
  return <>{children}</>
}

export default CartSyncProvider