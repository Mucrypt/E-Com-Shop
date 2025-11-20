//src/app/(shop)/orders/index.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'

// Mock order data
const orderStatuses = [
  { id: 'all', name: 'All Orders', count: 12, color: '#666' },
  { id: 'pending', name: 'Pending', count: 3, color: '#FF9500' },
  { id: 'processing', name: 'Processing', count: 2, color: '#007AFF' },
  { id: 'shipped', name: 'Shipped', count: 4, color: '#34C759' },
  { id: 'delivered', name: 'Delivered', count: 3, color: '#2E8C83' },
]

const orders = [
  {
    id: '#ORD-2025-001',
    date: '2025-07-25',
    status: 'delivered',
    total: 459.97,
    items: 3,
    deliveryDate: '2025-07-27',
    trackingNumber: 'TRK123456789',
    products: [
      {
        id: '1',
        name: 'Wireless Bluetooth Headphones Pro',
        price: 199.99,
        quantity: 1,
        image: 'headphones',
      },
      {
        id: '2',
        name: 'Smart Fitness Watch Series 7',
        price: 299.99,
        quantity: 1,
        image: 'watch',
      },
    ],
  },
  {
    id: '#ORD-2025-002',
    date: '2025-07-24',
    status: 'shipped',
    total: 149.99,
    items: 1,
    estimatedDelivery: '2025-07-28',
    trackingNumber: 'TRK987654321',
    products: [
      {
        id: '3',
        name: 'Premium Gaming Mechanical Keyboard',
        price: 149.99,
        quantity: 1,
        image: 'keyboard',
      },
    ],
  },
  {
    id: '#ORD-2025-003',
    date: '2025-07-23',
    status: 'processing',
    total: 89.99,
    items: 1,
    estimatedDelivery: '2025-07-30',
    products: [
      {
        id: '4',
        name: 'Ultra HD 4K Webcam',
        price: 89.99,
        quantity: 1,
        image: 'webcam',
      },
    ],
  },
  {
    id: '#ORD-2025-004',
    date: '2025-07-22',
    status: 'pending',
    total: 229.98,
    items: 2,
    estimatedDelivery: '2025-08-01',
    products: [
      {
        id: '5',
        name: 'Designer Cotton T-Shirt',
        price: 29.99,
        quantity: 1,
        image: 'tshirt',
      },
      {
        id: '6',
        name: 'Luxury Leather Handbag',
        price: 199.99,
        quantity: 1,
        image: 'handbag',
      },
    ],
  },
  {
    id: '#ORD-2025-005',
    date: '2025-07-20',
    status: 'delivered',
    total: 79.99,
    items: 1,
    deliveryDate: '2025-07-22',
    trackingNumber: 'TRK456789123',
    products: [
      {
        id: '7',
        name: 'Smart Home Security Camera',
        price: 79.99,
        quantity: 1,
        image: 'camera',
      },
    ],
  },
]

const Orders = () => {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const filteredOrders = orders.filter((order) =>
    selectedStatus === 'all' ? true : order.status === selectedStatus
  )

  const onRefresh = () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
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

  const handleTrackOrder = (order: any) => {
    if (order.trackingNumber) {
      Alert.alert(
        'Track Order',
        `Tracking Number: ${order.trackingNumber}\n\nThis would open your shipping provider's tracking page.`,
        [{ text: 'OK' }]
      )
    } else {
      Alert.alert(
        'Tracking Unavailable',
        'Tracking information is not yet available for this order.',
        [{ text: 'OK' }]
      )
    }
  }

  const handleReorder = (order: any) => {
    Alert.alert(
      'Reorder Items',
      `Add all items from order ${order.id} to your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add to Cart',
          onPress: () => {
            Alert.alert('Success', 'Items added to cart!')
          },
        },
      ]
    )
  }

  const handleCancelOrder = (order: any) => {
    if (order.status === 'pending' || order.status === 'processing') {
      Alert.alert(
        'Cancel Order',
        `Are you sure you want to cancel order ${order.id}?`,
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: () => {
              Alert.alert('Order Cancelled', 'Your order has been cancelled.')
            },
          },
        ]
      )
    }
  }

  const renderStatusFilter = ({ item }: { item: any }) => {
    const isSelected = selectedStatus === item.id
    return (
      <TouchableOpacity
        style={[styles.statusChip, isSelected && styles.selectedStatusChip]}
        onPress={() => setSelectedStatus(item.id)}
      >
        <Text
          style={[
            styles.statusChipText,
            isSelected && styles.selectedStatusChipText,
          ]}
        >
          {item.name}
        </Text>
        <View
          style={[styles.statusCount, isSelected && styles.selectedStatusCount]}
        >
          <Text
            style={[
              styles.statusCountText,
              isSelected && styles.selectedStatusCountText,
            ]}
          >
            {item.count}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderOrder = ({ item }: { item: any }) => {
    const statusInfo = getStatusInfo(item.status)
    const orderDate = new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    return (
      <View style={styles.orderCard}>
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderDate}>{orderDate}</Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}
          >
            <FontAwesome name={statusInfo.icon} size={12} color='#fff' />
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          </View>
        </View>

        {/* Order Items Preview */}
        <View style={styles.orderItems}>
          <Text style={styles.itemsLabel}>
            {item.items} item{item.items > 1 ? 's' : ''}
          </Text>
          <View style={styles.productPreview}>
            {item.products.slice(0, 3).map((product: any, index: number) => (
              <View key={product.id} style={styles.productItem}>
                <View style={styles.productImage}>
                  <FontAwesome name='image' size={20} color='#ccc' />
                </View>
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>
              </View>
            ))}
            {item.products.length > 3 && (
              <Text style={styles.moreItems}>
                +{item.products.length - 3} more
              </Text>
            )}
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.orderDetails}>
          <View style={styles.orderInfo}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${item.total}</Text>
          </View>

          {item.status === 'delivered' && item.deliveryDate && (
            <View style={styles.deliveryInfo}>
              <FontAwesome name='check-circle' size={14} color='#2E8C83' />
              <Text style={styles.deliveryText}>
                Delivered on{' '}
                {new Date(item.deliveryDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          )}

          {(item.status === 'shipped' || item.status === 'processing') &&
            item.estimatedDelivery && (
              <View style={styles.deliveryInfo}>
                <FontAwesome name='truck' size={14} color='#34C759' />
                <Text style={styles.deliveryText}>
                  Estimated delivery:{' '}
                  {new Date(item.estimatedDelivery).toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      day: 'numeric',
                    }
                  )}
                </Text>
              </View>
            )}

          {item.status === 'pending' && item.estimatedDelivery && (
            <View style={styles.deliveryInfo}>
              <FontAwesome name='clock-o' size={14} color='#FF9500' />
              <Text style={styles.deliveryText}>
                Processing - Est. delivery:{' '}
                {new Date(item.estimatedDelivery).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          )}
        </View>

        {/* Order Actions */}
        <View style={styles.orderActions}>
          {(item.status === 'shipped' || item.status === 'delivered') &&
            item.trackingNumber && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleTrackOrder(item)}
              >
                <FontAwesome name='map-marker' size={14} color='#2E8C83' />
                <Text style={styles.actionButtonText}>Track</Text>
              </TouchableOpacity>
            )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleReorder(item)}
          >
            <FontAwesome name='refresh' size={14} color='#2E8C83' />
            <Text style={styles.actionButtonText}>Reorder</Text>
          </TouchableOpacity>

          {(item.status === 'pending' || item.status === 'processing') && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelOrder(item)}
            >
              <FontAwesome name='times' size={14} color='#ff4444' />
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => router.push(`/orders/${item.id.replace('#', '')}`)}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
            <FontAwesome name='chevron-right' size={12} color='#2E8C83' />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <FontAwesome name='shopping-bag' size={80} color='#ccc' />
          <Text style={styles.emptyStateTitle}>No Orders Yet</Text>
          <Text style={styles.emptyStateText}>
            When you place an order, it will appear here
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push('/(shop)/shop')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
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
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>
          {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}{' '}
          found
        </Text>
      </View>

      {/* Status Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={orderStatuses}
          renderItem={renderStatusFilter}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ordersList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <StatusBar style='auto' />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1317ff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filtersList: {
    paddingHorizontal: 15,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  selectedStatusChip: {
    backgroundColor: '#2E8C83',
  },
  statusChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginRight: 6,
  },
  selectedStatusChipText: {
    color: '#fff',
  },
  statusCount: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  selectedStatusCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusCountText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
  },
  selectedStatusCountText: {
    color: '#fff',
  },
  ordersList: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderIdContainer: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  orderItems: {
    marginBottom: 15,
  },
  itemsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  productPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 5,
    maxWidth: '45%',
  },
  productImage: {
    width: 24,
    height: 24,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  productName: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  moreItems: {
    fontSize: 12,
    color: '#2E8C83',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    marginBottom: 15,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8C83',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: '#fff0f0',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E8C83',
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#ff4444',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E8C83',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 5,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#2E8C83',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default Orders
