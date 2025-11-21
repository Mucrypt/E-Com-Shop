import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice: number
  quantity: number
  color: string
  size: string
  image: string
  inStock: boolean
  category: string
  rating: number
  estimatedDelivery: string
}

interface CartState {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  getCartSubtotal: () => number
  getCartSavings: () => number
  // Helper methods
  isItemInCart: (id: string) => boolean
  getItemQuantity: (id: string) => number
  getSelectedItemsTotal: (selectedIds: string[]) => number
  setCartItems: (items: CartItem[]) => void
  replaceFromBackend: (items: { product_id: string; quantity: number; price: number }[]) => void
}

// Initial sample cart items for testing
const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 199.99,
    originalPrice: 249.99,
    quantity: 1,
    color: 'Black',
    size: 'One Size',
    image: 'headphones',
    inStock: true,
    category: 'Electronics',
    rating: 4.5,
    estimatedDelivery: '2-3 days',
  },
  {
    id: '2',
    name: 'Smartphone Pro',
    price: 899.99,
    originalPrice: 999.99,
    quantity: 2,
    color: 'Silver',
    size: '128GB',
    image: 'smartphone',
    inStock: true,
    category: 'Electronics',
    rating: 4.8,
    estimatedDelivery: '1-2 days',
  },
]

export const useCartStore = create<CartState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      cartItems: initialCartItems,

      addToCart: (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
        set(
          (state) => {
            const existingItem = state.cartItems.find(
              (cartItem) => cartItem.id === item.id
            )

            if (existingItem) {
              return {
                cartItems: state.cartItems.map((cartItem) =>
                  cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + quantity }
                    : cartItem
                ),
              }
            }

            return {
              cartItems: [...state.cartItems, { ...item, quantity }],
            }
          },
          false,
          'addToCart'
        )
      },

      removeFromCart: (id: string) => {
        set(
          (state) => ({
            cartItems: state.cartItems.filter((item) => item.id !== id),
          }),
          false,
          'removeFromCart'
        )
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(id)
          return
        }

        set(
          (state) => ({
            cartItems: state.cartItems.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          }),
          false,
          'updateQuantity'
        )
      },

      clearCart: () => {
        set(
          () => ({
            cartItems: [],
          }),
          false,
          'clearCart'
        )
      },

      getCartTotal: () => {
        return get().cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getCartCount: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0)
      },

      getCartSubtotal: () => {
        return get().cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getCartSavings: () => {
        return get().cartItems.reduce(
          (total, item) =>
            total + (item.originalPrice - item.price) * item.quantity,
          0
        )
      },

      isItemInCart: (id: string) => {
        return get().cartItems.some((item) => item.id === id)
      },

      getItemQuantity: (id: string) => {
        const item = get().cartItems.find((item) => item.id === id)
        return item ? item.quantity : 0
      },

      getSelectedItemsTotal: (selectedIds: string[]) => {
        return get()
          .cartItems.filter((item) => selectedIds.includes(item.id))
          .reduce((total, item) => total + item.price * item.quantity, 0)
      },
      setCartItems: (items: CartItem[]) => {
        set(() => ({ cartItems: items }), false, 'setCartItems')
      },
      replaceFromBackend: (items: { product_id: string; quantity: number; price: number }[]) => {
        set(() => ({
          cartItems: items.map((row, idx) => ({
            id: row.product_id, // assuming product_id matches CartItem id
            name: 'Product', // placeholder; should be hydrated separately
            price: Number(row.price),
            originalPrice: Number(row.price),
            quantity: row.quantity,
            color: 'N/A',
            size: 'N/A',
            image: 'placeholder',
            inStock: true,
            category: 'general',
            rating: 0,
            estimatedDelivery: '—',
          })),
        }), false, 'replaceFromBackend')
      },
    })),
    {
      name: 'cart-store', // name for devtools
    }
  )
)
