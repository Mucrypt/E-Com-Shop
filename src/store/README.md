# Store Directory

This directory contains all Zustand stores for global state management.

## Cart Store

The cart store manages shopping cart state using Zustand.

### Usage

```typescript
import { useCartStore } from '../store'

// In your component
const MyComponent = () => {
  // Get cart items
  const cartItems = useCartStore((state) => state.cartItems)

  // Get cart count
  const cartCount = useCartStore((state) => state.getCartCount())

  // Get functions
  const addToCart = useCartStore((state) => state.addToCart)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)

  // Add item to cart
  const handleAddToCart = () => {
    const item = {
      id: '1',
      name: 'Product Name',
      price: 19.99,
      originalPrice: 24.99,
      color: 'Red',
      size: 'M',
      image: 'product.jpg',
      inStock: true,
      category: 'Fashion',
      rating: 4.5,
      estimatedDelivery: '2-3 days',
    }
    addToCart(item, 1)
  }

  return (
    // Your component JSX
  )
}
```

### Available Methods

- `addToCart(item, quantity)` - Add item to cart
- `removeFromCart(id)` - Remove item from cart
- `updateQuantity(id, quantity)` - Update item quantity
- `clearCart()` - Clear all items from cart
- `getCartTotal()` - Get total cart value
- `getCartCount()` - Get total item count
- `getCartSubtotal()` - Get subtotal (without tax/shipping)
- `getCartSavings()` - Get total savings
- `isItemInCart(id)` - Check if item is in cart
- `getItemQuantity(id)` - Get quantity of specific item
- `getSelectedItemsTotal(selectedIds)` - Get total for selected items

### Store Features

- **Persistence**: Cart data persists across app sessions
- **DevTools**: Integration with Redux DevTools for debugging
- **TypeScript**: Fully typed for better development experience
- **Performance**: Optimized selectors to prevent unnecessary re-renders

### Adding New Stores

1. Create a new store file in this directory (e.g., `userStore.ts`)
2. Export it from the `index.ts` file
3. Use the same pattern as the cart store

Example:

```typescript
// userStore.ts
import { create } from 'zustand'

interface UserState {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```

Then add to `index.ts`:

```typescript
export { useUserStore } from './userStore'
```
