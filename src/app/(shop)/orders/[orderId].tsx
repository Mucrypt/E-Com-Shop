import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'

// Mock detailed order data
const getOrderDetails = (orderId: string) => {
  const orders: { [key: string]: any } = {
    'ORD-2025-001': {
      id: '#ORD-2025-001',
      date: '2025-07-25',
      status: 'delivered',
      total: 459.97,
      subtotal: 459.97,
      shipping: 0,
      tax: 36.8,
      items: 2,
      deliveryDate: '2025-07-27',
      trackingNumber: 'TRK123456789',
      carrier: 'FedEx',
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567',
      },
      billingAddress: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      paymentMethod: {
        type: 'Credit Card',
        last4: '4242',
        brand: 'Visa',
      },
      products: [
        {
          id: '1',
          name: 'Wireless Bluetooth Headphones Pro',
          price: 199.99,
          originalPrice: 249.99,
          quantity: 1,
          image: 'headphones',
          sku: 'WBH-PRO-001',
          variant: 'Black, Wireless',
        },
        {
          id: '2',
          name: 'Smart Fitness Watch Series 7',
          price: 299.99,
          originalPrice: 399.99,
          quantity: 1,
          image: 'watch',
          sku: 'SFW-S7-002',
          variant: 'Silver, 42mm',
        },
      ],
      timeline: [
        {
          status: 'Order Placed',
          date: '2025-07-25 10:30 AM',
          description: 'Your order has been received and is being processed.',
          completed: true,
        },
        {
          status: 'Payment Confirmed',
          date: '2025-07-25 10:35 AM',
          description: 'Payment has been successfully processed.',
          completed: true,
        },
        {
          status: 'Order Shipped',
          date: '2025-07-26 2:15 PM',
          description: 'Your order has been shipped via FedEx.',
          completed: true,
        },
        {
          status: 'Out for Delivery',
          date: '2025-07-27 8:00 AM',
          description: 'Your package is out for delivery.',
          completed: true,
        },
        {
          status: 'Delivered',
          date: '2025-07-27 3:45 PM',
          description: 'Package delivered to your address.',
          completed: true,
        },
      ],
    },
    'ORD-2025-002': {
      id: '#ORD-2025-002',
      date: '2025-07-24',
      status: 'shipped',
      total: 149.99,
      subtotal: 149.99,
      shipping: 0,
      tax: 12.0,
      items: 1,
      estimatedDelivery: '2025-07-28',
      trackingNumber: 'TRK987654321',
      carrier: 'UPS',
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567',
      },
      billingAddress: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      paymentMethod: {
        type: 'Credit Card',
        last4: '8888',
        brand: 'MasterCard',
      },
      products: [
        {
          id: '3',
          name: 'Premium Gaming Mechanical Keyboard',
          price: 149.99,
          originalPrice: 199.99,
          quantity: 1,
          image: 'keyboard',
          sku: 'PGK-MECH-003',
          variant: 'RGB, Cherry MX Blue',
        },
      ],
      timeline: [
        {
          status: 'Order Placed',
          date: '2025-07-24 2:15 PM',
          description: 'Your order has been received and is being processed.',
          completed: true,
        },
        {
          status: 'Payment Confirmed',
          date: '2025-07-24 2:20 PM',
          description: 'Payment has been successfully processed.',
          completed: true,
        },
        {
          status: 'Order Shipped',
          date: '2025-07-25 11:30 AM',
          description: 'Your order has been shipped via UPS.',
          completed: true,
        },
        {
          status: 'In Transit',
          date: '2025-07-26 6:00 AM',
          description: 'Your package is on its way to you.',
          completed: true,
        },
        {
          status: 'Out for Delivery',
          date: '',
          description: 'Your package will be out for delivery soon.',
          completed: false,
        },
      ],
    },
  }

  return orders[orderId] || null
}

const OrderDetails = () => {
  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const [expandedSections, setExpandedSections] = useState({
    products: true,
    timeline: false,
    addresses: false,
    payment: false,
  })

  const order = getOrderDetails(orderId || '')

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <FontAwesome name='exclamation-triangle' size={60} color='#ff4444' />
          <Text style={styles.errorTitle}>Order Not Found</Text>
          <Text style={styles.errorText}>
            The order you're looking for doesn't exist or has been removed.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style='auto' />
      </View>
    )
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: '#FF9500', icon: 'clock-o' as const, text: 'Pending' }
      case 'processing':
        return { color: '#007AFF', icon: 'cog' as const, text: 'Processing' }
      case 'shipped':
        return { color: '#34C759', icon: 'truck' as const, text: 'Shipped' }
      case 'delivered':
        return {
          color: '#2E8C83',
          icon: 'check-circle' as const,
          text: 'Delivered',
        }
      default:
        return { color: '#666', icon: 'question' as const, text: 'Unknown' }
    }
  }

  const statusInfo = getStatusInfo(order.status)

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleTrackOrder = () => {
    if (order.trackingNumber) {
      Alert.alert(
        'Track Package',
        `Tracking Number: ${order.trackingNumber}\nCarrier: ${order.carrier}\n\nThis would open the carrier's tracking page.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Tracker',
            onPress: () => {
              // In a real app, you would open the carrier's tracking URL
              console.log('Opening tracking for:', order.trackingNumber)
            },
          },
        ]
      )
    }
  }

  const handleReorder = () => {
    Alert.alert(
      'Reorder Items',
      `Add all items from ${order.id} to your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add to Cart',
          onPress: () => {
            Alert.alert('Success', 'Items added to cart!')
            router.push('/(shop)/cart')
          },
        },
      ]
    )
  }

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'How would you like to contact us?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => {
          Linking.openURL('tel:+1-555-SUPPORT')
        },
      },
      {
        text: 'Email',
        onPress: () => {
          Linking.openURL(
            'mailto:support@ecomshop.com?subject=Order%20' + order.id
          )
        },
      },
    ])
  }

  const renderProduct = (product: any) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productItem}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View style={styles.productImage}>
        <FontAwesome name='image' size={40} color='#ccc' />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productVariant}>{product.variant}</Text>
        <Text style={styles.productSku}>SKU: {product.sku}</Text>
        <View style={styles.productPricing}>
          <Text style={styles.productPrice}>${product.price}</Text>
          {product.originalPrice !== product.price && (
            <Text style={styles.productOriginalPrice}>
              ${product.originalPrice}
            </Text>
          )}
          <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
        </View>
      </View>
      <FontAwesome name='chevron-right' size={16} color='#ccc' />
    </TouchableOpacity>
  )

  const renderTimelineItem = (item: any, index: number) => (
    <View key={index} style={styles.timelineItem}>
      <View style={styles.timelineDot}>
        <View
          style={[
            styles.dot,
            item.completed ? styles.completedDot : styles.pendingDot,
          ]}
        />
        {index < order.timeline.length - 1 && (
          <View
            style={[
              styles.timelineLine,
              item.completed ? styles.completedLine : styles.pendingLine,
            ]}
          />
        )}
      </View>
      <View style={styles.timelineContent}>
        <Text
          style={[
            styles.timelineStatus,
            item.completed ? styles.completedStatus : styles.pendingStatus,
          ]}
        >
          {item.status}
        </Text>
        {item.date && <Text style={styles.timelineDate}>{item.date}</Text>}
        <Text style={styles.timelineDescription}>{item.description}</Text>
      </View>
    </View>
  )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Order Header */}
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderDate}>
            Placed on{' '}
            {new Date(order.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <View
          style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}
        >
          <FontAwesome name={statusInfo.icon} size={14} color='#fff' />
          <Text style={styles.statusText}>{statusInfo.text}</Text>
        </View>
      </View>

      {/* Delivery Information */}
      {order.status === 'delivered' && order.deliveryDate && (
        <View style={styles.deliveryCard}>
          <FontAwesome name='check-circle' size={20} color='#2E8C83' />
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryTitle}>Package Delivered</Text>
            <Text style={styles.deliveryDate}>
              {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
      )}

      {order.status === 'shipped' && order.estimatedDelivery && (
        <View style={styles.deliveryCard}>
          <FontAwesome name='truck' size={20} color='#34C759' />
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryTitle}>Package in Transit</Text>
            <Text style={styles.deliveryDate}>
              Estimated delivery:{' '}
              {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        {order.trackingNumber && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleTrackOrder}
          >
            <FontAwesome name='map-marker' size={16} color='#2E8C83' />
            <Text style={styles.actionButtonText}>Track Package</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionButton} onPress={handleReorder}>
          <FontAwesome name='refresh' size={16} color='#2E8C83' />
          <Text style={styles.actionButtonText}>Reorder</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleContactSupport}
        >
          <FontAwesome name='headphones' size={16} color='#2E8C83' />
          <Text style={styles.actionButtonText}>Support</Text>
        </TouchableOpacity>
      </View>

      {/* Products Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('products')}
        >
          <Text style={styles.sectionTitle}>Items ({order.items})</Text>
          <FontAwesome
            name={expandedSections.products ? 'chevron-up' : 'chevron-down'}
            size={16}
            color='#666'
          />
        </TouchableOpacity>
        {expandedSections.products && (
          <View style={styles.sectionContent}>
            {order.products.map(renderProduct)}
          </View>
        )}
      </View>

      {/* Order Timeline */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('timeline')}
        >
          <Text style={styles.sectionTitle}>Order Timeline</Text>
          <FontAwesome
            name={expandedSections.timeline ? 'chevron-up' : 'chevron-down'}
            size={16}
            color='#666'
          />
        </TouchableOpacity>
        {expandedSections.timeline && (
          <View style={styles.sectionContent}>
            <View style={styles.timeline}>
              {order.timeline.map(renderTimelineItem)}
            </View>
          </View>
        )}
      </View>

      {/* Shipping & Billing Addresses */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('addresses')}
        >
          <Text style={styles.sectionTitle}>Addresses</Text>
          <FontAwesome
            name={expandedSections.addresses ? 'chevron-up' : 'chevron-down'}
            size={16}
            color='#666'
          />
        </TouchableOpacity>
        {expandedSections.addresses && (
          <View style={styles.sectionContent}>
            <View style={styles.addressContainer}>
              <Text style={styles.addressTitle}>Shipping Address</Text>
              <Text style={styles.addressName}>
                {order.shippingAddress.name}
              </Text>
              <Text style={styles.addressText}>
                {order.shippingAddress.street}
              </Text>
              <Text style={styles.addressText}>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </Text>
              <Text style={styles.addressText}>
                {order.shippingAddress.country}
              </Text>
              <Text style={styles.addressPhone}>
                {order.shippingAddress.phone}
              </Text>
            </View>
            <View style={styles.addressContainer}>
              <Text style={styles.addressTitle}>Billing Address</Text>
              <Text style={styles.addressName}>
                {order.billingAddress.name}
              </Text>
              <Text style={styles.addressText}>
                {order.billingAddress.street}
              </Text>
              <Text style={styles.addressText}>
                {order.billingAddress.city}, {order.billingAddress.state}{' '}
                {order.billingAddress.zipCode}
              </Text>
              <Text style={styles.addressText}>
                {order.billingAddress.country}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Payment Information */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('payment')}
        >
          <Text style={styles.sectionTitle}>Payment & Summary</Text>
          <FontAwesome
            name={expandedSections.payment ? 'chevron-up' : 'chevron-down'}
            size={16}
            color='#666'
          />
        </TouchableOpacity>
        {expandedSections.payment && (
          <View style={styles.sectionContent}>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentTitle}>Payment Method</Text>
              <View style={styles.paymentInfo}>
                <FontAwesome name='credit-card' size={16} color='#666' />
                <Text style={styles.paymentText}>
                  {order.paymentMethod.brand} ending in{' '}
                  {order.paymentMethod.last4}
                </Text>
              </View>
            </View>

            <View style={styles.orderSummary}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${order.subtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>
                  {order.shipping === 0 ? 'FREE' : `$${order.shipping}`}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>${order.tax}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${order.total}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <StatusBar style='auto' />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  deliveryCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryInfo: {
    marginLeft: 12,
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  deliveryDate: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E8C83',
    marginLeft: 6,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContent: {
    padding: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  productImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productVariant: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  productSku: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  productPricing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8C83',
    marginRight: 8,
  },
  productOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
  },
  timeline: {
    paddingVertical: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDot: {
    alignItems: 'center',
    marginRight: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  completedDot: {
    backgroundColor: '#2E8C83',
  },
  pendingDot: {
    backgroundColor: '#e0e0e0',
  },
  timelineLine: {
    width: 2,
    height: 40,
  },
  completedLine: {
    backgroundColor: '#2E8C83',
  },
  pendingLine: {
    backgroundColor: '#e0e0e0',
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  completedStatus: {
    color: '#333',
  },
  pendingStatus: {
    color: '#999',
  },
  timelineDate: {
    fontSize: 14,
    color: '#2E8C83',
    fontWeight: '500',
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  addressContainer: {
    marginBottom: 20,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 14,
    color: '#2E8C83',
    fontWeight: '500',
    marginTop: 4,
  },
  paymentMethod: {
    marginBottom: 20,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  orderSummary: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#2E8C83',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default OrderDetails
