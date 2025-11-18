import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCartStore } from '../../store'
import { useAppToast } from '../../components/toast'

// Mock cart data

/**
 * Cart component for displaying and managing the user's shopping cart.
 *
 * Features:
 * - Displays cart items with selection, quantity adjustment, and removal options.
 * - Allows selecting individual or all in-stock items for checkout.
 * - Calculates and displays order summary including subtotal, savings, shipping, tax, and total.
 * - Handles empty cart state with a prompt to shop.
 * - Provides checkout functionality for selected items.
 * - Integrates toast notifications for cart actions (item removed, cart cleared, etc.).
 *
 * State Management:
 * - Uses `useCartStore` for cart item state and actions.
 * - Uses `useAppToast` for toast notifications.
 * - Maintains `selectedItems` state for item selection.
 *
 * UI:
 * - Renders cart items in a FlatList.
 * - Shows order summary and checkout button when items are selected.
 * - Displays appropriate UI for out-of-stock items.
 *
 * @returns {JSX.Element} The rendered cart screen.
 */
const Cart = () => {
  const cartItems = useCartStore((state) => state.cartItems)
  const updateCartQuantity = useCartStore((state) => state.updateQuantity)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const clearCart = useCartStore((state) => state.clearCart)
  const { toast } = useAppToast()
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Update selected items when cart items change
  useEffect(() => {
    setSelectedItems(
      cartItems.filter((item) => item.inStock).map((item) => item.id)
    )
  }, [cartItems])

  // Calculate totals
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  )
  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const originalTotal = selectedCartItems.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  )
  const savings = originalTotal - subtotal
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  const updateQuantity = (id: string, change: number) => {
    const currentItem = cartItems.find((item) => item.id === id)
    if (currentItem) {
      const newQuantity = Math.max(1, currentItem.quantity + change)
      updateCartQuantity(id, newQuantity)
      if (change > 0) {
        toast.show(`${currentItem.name} added to cart!`, { type: 'success' })
      }
    }
  }

  const removeItem = (id: string) => {
    const itemToRemove = cartItems.find((item) => item.id === id)
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeFromCart(id)
            setSelectedItems((selected) =>
              selected.filter((itemId) => itemId !== id)
            )

            // Show toast notification
            if (itemToRemove) {
              toast.show(`${itemToRemove.name} removed from cart.`, {
                type: 'danger',
              })
            }
          },
        },
      ]
    )
  }

  const toggleItemSelection = (id: string) => {
    const item = cartItems.find((item) => item.id === id)
    if (!item?.inStock) return

    setSelectedItems((selected) =>
      selected.includes(id)
        ? selected.filter((itemId) => itemId !== id)
        : [...selected, id]
    )
  }

  const selectAll = () => {
    const inStockItems = cartItems
      .filter((item) => item.inStock)
      .map((item) => item.id)
    setSelectedItems(
      selectedItems.length === inStockItems.length ? [] : inStockItems
    )
  }

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select items to checkout.')
      return
    }

    Alert.alert(
      'Proceed to Checkout',
      `Total: $${total.toFixed(2)}\nItems: ${selectedItems.length}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Checkout',
          onPress: () => {
            router.push('/(shop)/orders')
          },
        },
      ]
    )
  }

  /**
   * Renders a single cart item component for the shopping cart.
   *
   * @param item - An object representing a cart item, including its id, name, price, original price, color, size, quantity, and stock status.
   * @returns A React element displaying the cart item's details, including selection checkbox, product image, name, variant, price, discount, quantity controls, and remove button.
   *
   * - The selection checkbox is disabled if the item is out of stock.
   * - Displays a discount badge calculated from the original and current price.
   * - Quantity controls allow incrementing or decrementing the item's quantity, disabled if out of stock.
   * - Shows an "Out of Stock" label if the item is not available.
   * - Provides a button to remove the item from the cart.
   */
  const renderCartItem = ({ item }: { item: (typeof cartItems)[0] }) => {
    const isSelected = selectedItems.includes(item.id)
    const discount = (
      ((item.originalPrice - item.price) / item.originalPrice) *
      100
    ).toFixed(0)

    return (
      <View style={[styles.cartItem, !item.inStock && styles.outOfStockItem]}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => toggleItemSelection(item.id)}
          disabled={!item.inStock}
        >
          <FontAwesome
            name={isSelected ? 'check-square' : 'square-o'}
            size={20}
            color={item.inStock ? (isSelected ? '#2E8C83' : '#ccc') : '#ccc'}
          />
        </TouchableOpacity>

        <View style={styles.productImage}>
          <FontAwesome name='image' size={40} color='#ccc' />
        </View>

        <View style={styles.productDetails}>
          <Text
            style={[styles.productName, !item.inStock && styles.outOfStockText]}
          >
            {item.name}
          </Text>
          <Text style={styles.productVariant}>
            {item.color} • {item.size}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          </View>

          {!item.inStock && (
            <Text style={styles.outOfStockLabel}>Out of Stock</Text>
          )}

          <View style={styles.itemActions}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, -1)}
                disabled={!item.inStock}
              >
                <FontAwesome
                  name='minus'
                  size={12}
                  color={item.inStock ? '#666' : '#ccc'}
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, 1)}
                disabled={!item.inStock}
              >
                <FontAwesome
                  name='plus'
                  size={12}
                  color={item.inStock ? '#666' : '#ccc'}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}
            >
              <FontAwesome name='trash' size={16} color='#ff4444' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyCart}>
          <FontAwesome name='shopping-cart' size={80} color='#ccc' />
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartText}>
            Add some products to get started!
          </Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => router.push('/(shop)/shop')}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style='auto' />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.selectAllButton} onPress={selectAll}>
          <FontAwesome
            name={
              selectedItems.length ===
              cartItems.filter((item) => item.inStock).length
                ? 'check-square'
                : 'square-o'
            }
            size={20}
            color='#2E8C83'
          />
          <Text style={styles.selectAllText}>Select All</Text>
        </TouchableOpacity>
        <Text style={styles.cartCount}>{cartItems.length} items</Text>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cartList}
      />

      {/* Order Summary */}
      {selectedItems.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal ({selectedItems.length} items)
            </Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>

          {savings > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.savingsLabel]}>
                Savings
              </Text>
              <Text style={[styles.summaryValue, styles.savingsValue]}>
                -${savings.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>

          {shipping > 0 && (
            <Text style={styles.freeShippingNote}>
              Add ${(100 - subtotal).toFixed(2)} more for free shipping!
            </Text>
          )}
        </View>
      )}

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            selectedItems.length === 0 && styles.disabledButton,
          ]}
          onPress={handleCheckout}
          disabled={selectedItems.length === 0}
        >
          <Text
            style={[
              styles.checkoutText,
              selectedItems.length === 0 && styles.disabledText,
            ]}
          >
            Checkout ({selectedItems.length})
          </Text>
          {selectedItems.length > 0 && (
            <Text style={styles.checkoutTotal}>${total.toFixed(2)}</Text>
          )}
        </TouchableOpacity>
      </View>

      <StatusBar style='auto' />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2E8C83',
    fontWeight: '500',
  },
  cartCount: {
    fontSize: 16,
    color: '#666',
  },
  cartList: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'flex-start',
  },
  outOfStockItem: {
    opacity: 0.6,
  },
  checkbox: {
    marginRight: 15,
    marginTop: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  outOfStockText: {
    color: '#999',
  },
  productVariant: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8C83',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  outOfStockLabel: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
  },
  removeButton: {
    padding: 8,
  },
  summaryContainer: {
    padding: 5,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginHorizontal: 10,
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  savingsLabel: {
    color: '#2E8C83',
  },
  savingsValue: {
    color: '#2E8C83',
    fontWeight: 'bold',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E8C83',
  },
  freeShippingNote: {
    fontSize: 12,
    color: '#2E8C83',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  checkoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  checkoutButton: {
    backgroundColor: '#2E8C83',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  disabledText: {
    color: '#999',
  },
  checkoutTotal: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopNowButton: {
    backgroundColor: '#2E8C83',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  shopNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default Cart
