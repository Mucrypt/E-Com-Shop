// src//app//cart/index.tsx
import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';

import { useCartStore } from '../../store';
import { useAuth } from '../../providers/auth-provider';

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  color?: string;
  size?: string;
  quantity: number;
  inStock: boolean;
  seller?: string;
};

type RecommendItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
};

const mockRecommendations: RecommendItem[] = [
  {
    id: 'r1',
    name: '3pcs Seamless Basic Bra Set',
    image:
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
    price: 7.66,
    originalPrice: 11.99,
  },
  {
    id: 'r2',
    name: 'Warm Winter Hat & Gloves Set',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
    price: 5.99,
    originalPrice: 9.99,
  },
  {
    id: 'r3',
    name: 'Casual Cargo Pants Mukulah Fit',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    price: 13.44,
    originalPrice: 19.48,
  },
  {
    id: 'r4',
    name: 'Everyday Cotton Tee 2-Pack',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    price: 9.99,
    originalPrice: 14.99,
  },
];

const CartScreen: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getSelectedItemsTotal,
  } = useCartStore();

  const [selectedIds, setSelectedIds] = useState<string[]>(
    cartItems.map((i) => i.id),
  );

  const scrollRef = useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const hasItems = cartItems.length > 0;

  const allSelected =
    hasItems &&
    selectedIds.length > 0 &&
    selectedIds.length === cartItems.length;

  const toggleSelectAll = () => {
    if (!hasItems) return;
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((i) => i.id));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Animated quantity control
  const useBouncyScale = () => {
    const scale = useRef(new Animated.Value(1)).current;

    const bounce = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return { scale, bounce };
  };

  const handleQuantityChange = (id: string, delta: 1 | -1) => {
    updateQuantity(id, Math.max(1, (useCartStore.getState().getItemQuantity(id) || 1) + delta));
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const selectedCount = selectedIds.length;

  // Simple tiered coupon system (example)
  const { total, afterCoupon, couponAmount } = useMemo(() => {
    const total = getSelectedItemsTotal(selectedIds);

    let couponAmount = 0;
    if (total >= 60) couponAmount = 10;
    else if (total >= 30) couponAmount = 5;
    else if (total >= 20) couponAmount = 3;

    return {
      total,
      afterCoupon: Math.max(0, total - couponAmount),
      couponAmount,
    };
  }, [getSelectedItemsTotal, selectedIds]);

  const remainingForFreePickup =
    total > 0 && total < 15 ? (15 - total).toFixed(2) : null;

  const handleCheckout = () => {
    if (!selectedCount) {
      console.log('Please select at least one item');
      return;
    }
    console.log('Proceeding to checkout…');
    // router.push('/checkout')
  };

  // ---------- RECOMMENDATION CARD ----------

  const renderRecommendation = ({ item }: { item: RecommendItem }) => {
    const hasDiscount =
      item.originalPrice && item.originalPrice > item.price;
    const discountPct = hasDiscount
      ? Math.round(
          ((item.originalPrice! - item.price) / item.originalPrice!) * 100,
        )
      : 0;

    return (
      <TouchableOpacity
        style={styles.recoCard}
        activeOpacity={0.9}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <Image source={{ uri: item.image }} style={styles.recoImage} />
        <Text style={styles.recoName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.recoPriceRow}>
          <Text style={styles.recoPrice}>€{item.price.toFixed(2)}</Text>
          {hasDiscount && (
            <Text style={styles.recoOriginal}>
              €{item.originalPrice!.toFixed(2)}
            </Text>
          )}
        </View>
        {hasDiscount && (
          <View style={styles.recoDiscountTag}>
            <Text style={styles.recoDiscountText}>-{discountPct}%</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // ---------- CART ITEM WITH SWIPE + BOUNCY QTY ----------

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const isSelected = selectedIds.includes(item.id);
    const hasDiscount =
      item.originalPrice && item.originalPrice > item.price;
    const discountPct = hasDiscount
      ? Math.round(
          ((item.originalPrice! - item.price) / item.originalPrice!) * 100,
        )
      : 0;

    const minusAnim = useBouncyScale();
    const plusAnim = useBouncyScale();

    const renderRightActions = () => (
      <TouchableOpacity
        style={styles.swipeDelete}
        onPress={() => handleRemoveItem(item.id)}
        activeOpacity={0.85}
      >
        <FontAwesome name="trash-o" size={18} color="#fff" />
        <Text style={styles.swipeDeleteText}>Delete</Text>
      </TouchableOpacity>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.cartCard}>
          {/* LEFT COLUMN: check + image */}
          <View style={styles.cartLeft}>
            <TouchableOpacity
              onPress={() => toggleItem(item.id)}
              style={[
                styles.checkbox,
                isSelected && styles.checkboxSelected,
              ]}
            >
              {isSelected && (
                <FontAwesome name="check" size={12} color="#fff" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push(`/product/${item.id}`)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.cartImage}
                resizeMode="cover"
              />
              {item.inStock === false && (
                <View style={styles.cartBadgeOverlay}>
                  <Text style={styles.cartBadgeText}>Sold out</Text>
                </View>
              )}
              {hasDiscount && (
                <View style={styles.cartBadgeDiscount}>
                  <Text style={styles.cartBadgeDiscountText}>
                    -{discountPct}%
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* RIGHT COLUMN: info */}
          <View style={styles.cartRight}>
            <View style={styles.cartTitleRow}>
              <Text style={styles.cartTitle} numberOfLines={2}>
                {item.name}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.id)}
                style={styles.trashButton}
              >
                <FontAwesome name="trash-o" size={15} color="#666" />
              </TouchableOpacity>
            </View>

            {item.seller && (
              <Text style={styles.cartSeller} numberOfLines={1}>
                Sold by {item.seller}
              </Text>
            )}

            {(item.color || item.size) && (
              <View style={styles.variantRow}>
                {item.color && (
                  <View style={styles.variantTag}>
                    <Text style={styles.variantText}>{item.color}</Text>
                  </View>
                )}
                {item.size && (
                  <View style={styles.variantTag}>
                    <Text style={styles.variantText}>{item.size}</Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.cartBottomRow}>
              <View>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Text style={styles.cartPrice}>
                    €{item.price.toFixed(2)}
                  </Text>
                  {hasDiscount && (
                    <Text style={styles.cartOriginalPrice}>
                      €{item.originalPrice!.toFixed(2)}
                    </Text>
                  )}
                </View>
                {hasDiscount && (
                  <Text style={styles.cartAfterCoupon}>
                    €{(item.price - 3).toFixed(2)} After coupon
                  </Text>
                )}
              </View>

              <View style={styles.cartActionsRight}>
                <Animated.View
                  style={{ transform: [{ scale: minusAnim.scale }] }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      minusAnim.bounce();
                      handleQuantityChange(item.id, -1);
                    }}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>
                </Animated.View>

                <Text style={styles.qtyValue}>{item.quantity}</Text>

                <Animated.View
                  style={{ transform: [{ scale: plusAnim.scale }] }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      plusAnim.bounce();
                      handleQuantityChange(item.id, +1);
                    }}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity style={styles.heartBtn}>
                  <FontAwesome name="heart-o" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  // ---------- EMPTY / GUEST CART ----------

  if (!isAuthenticated || !hasItems) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        <ScrollView
          ref={scrollRef}
          onScroll={({ nativeEvent }) =>
            setShowScrollTop(nativeEvent.contentOffset.y > 220)
          }
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Cart</Text>
            <View style={styles.headerShipTag}>
              <Ionicons
                name="location-outline"
                size={14}
                color="#111"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.headerShipText}>Ship to Italy</Text>
            </View>
          </View>

          {/* EMPTY STATE */}
          <View style={styles.emptyBox}>
            <FontAwesome
              name="shopping-cart"
              size={36}
              color="#c4c4c4"
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Log in to see your shopping cart and saved items.
            </Text>

            <View style={styles.emptyButtonsRow}>
              <TouchableOpacity
                style={styles.emptyOutlineBtn}
                onPress={() => router.push('/(shop)')}
              >
                <Text style={styles.emptyOutlineText}>
                  Shop by Category
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.emptyPrimaryBtn}
                onPress={() => router.push('/auth')}
              >
                <Text style={styles.emptyPrimaryText}>
                  Sign in / Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* PROMO BANNER */}
          <View style={styles.promoBanner}>
            <Image
              source={{
                uri:
                  'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1000&q=80',
              }}
              style={styles.promoImage}
            />
            <View style={styles.promoOverlay}>
              <Text style={styles.promoTitle}>Mukulah Winter Sale</Text>
              <Text style={styles.promoSubtitle}>
                Up to 40% OFF on selected items • Fast EU shipping.
              </Text>
            </View>
          </View>

          {/* DEAR USER CARD */}
          <View style={styles.dearCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dearTitle}>Dear Mukulah User</Text>
              <Text style={styles.dearText}>
                Log in to unlock coupons, saved carts, wishlists and
                exclusive deals.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.dearBtn}
              onPress={() => router.push('/auth')}
            >
              <Text style={styles.dearBtnText}>Enjoy It</Text>
            </TouchableOpacity>
          </View>

          {/* YOU MIGHT LIKE SECTION */}
          <View style={styles.fillSection}>
            <Text style={styles.fillTitle}>
              You Might Like to Fill it With
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.fillTabsRow}
            >
              <View style={[styles.fillTab, styles.fillTabActive]}>
                <Text
                  style={[styles.fillTabText, styles.fillTabTextActive]}
                >
                  All
                </Text>
              </View>
              <View style={styles.fillTab}>
                <Text style={styles.fillTabText}>🔥 Hot Deals</Text>
              </View>
              <View style={styles.fillTab}>
                <Text style={styles.fillTabText}>
                  🛒 Frequent Favorites
                </Text>
              </View>
              <View style={styles.fillTab}>
                <Text style={styles.fillTabText}>⚡ QuickShip</Text>
              </View>
            </ScrollView>

            <FlatList
              data={mockRecommendations}
              keyExtractor={(item) => item.id}
              horizontal
              renderItem={renderRecommendation}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </ScrollView>

        {/* Scroll-to-top FAB */}
        {showScrollTop && (
          <TouchableOpacity
            style={styles.scrollTopBtn}
            onPress={() =>
              scrollRef.current?.scrollTo({ y: 0, animated: true })
            }
          >
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  // ---------- AUTHENTICATED CART WITH ITEMS ----------

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* TOP BAR */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Cart{' '}
          <Text style={{ fontSize: 14, color: '#666' }}>
            ({cartItems.length})
          </Text>
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ marginRight: 20 }}>
            <Ionicons name="share-outline" size={22} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="heart-o" size={20} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      {/* TAGS (All / Almost out of stock) */}
      <View style={styles.cartFilterRow}>
        <View style={[styles.cartFilterTag, styles.cartFilterTagActive]}>
          <Text
            style={[
              styles.cartFilterText,
              styles.cartFilterTextActive,
            ]}
          >
            All
          </Text>
        </View>
        <View style={styles.cartFilterTag}>
          <Text style={styles.cartFilterText}>🔥 Almost out of stock</Text>
        </View>
      </View>

      {/* SHIPPING PROMO */}
      {remainingForFreePickup && (
        <View style={styles.shippingPromoBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="cube-outline"
              size={18}
              color="#2E8C83"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.shippingPromoText}>
              Buy {remainingForFreePickup}€ more to enjoy free pickup at
              convenience store!
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.shippingPromoAction}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CART ITEMS LIST + RECO SECTION */}
      <ScrollView
        ref={scrollRef}
        onScroll={({ nativeEvent }) =>
          setShowScrollTop(nativeEvent.contentOffset.y > 220)
        }
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Seller group (simple for now) */}
        <View style={styles.sellerHeaderRow}>
          <TouchableOpacity
            onPress={toggleSelectAll}
            style={[
              styles.checkbox,
              allSelected && styles.checkboxSelected,
            ]}
          >
            {allSelected && (
              <FontAwesome name="check" size={12} color="#fff" />
            )}
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="storefront-outline"
              size={16}
              color="#111"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.sellerName}>Mukulah Shop</Text>
          </View>
        </View>

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={renderCartItem}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        />

        {/* "You might like to fill it with" */}
        <View style={styles.fillSectionLogged}>
          <Text style={styles.fillTitle}>
            You Might Like to Fill it With
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fillTabsRow}
          >
            <View style={[styles.fillTab, styles.fillTabActive]}>
              <Text
                style={[
                  styles.fillTabText,
                  styles.fillTabTextActive,
                ]}
              >
                All
              </Text>
            </View>
            <View style={styles.fillTab}>
              <Text style={styles.fillTabText}>🔥 Hot Deals</Text>
            </View>
            <View style={styles.fillTab}>
              <Text style={styles.fillTabText}>
                🛒 Frequent Favorites
              </Text>
            </View>
            <View style={styles.fillTab}>
              <Text style={styles.fillTabText}>⚡ QuickShip</Text>
            </View>
          </ScrollView>

          <FlatList
            data={mockRecommendations}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={renderRecommendation}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Scroll-to-top FAB */}
      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopBtn}
          onPress={() =>
            scrollRef.current?.scrollTo({ y: 0, animated: true })
          }
        >
          <Ionicons name="arrow-up" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {/* BOTTOM CHECKOUT BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomLeft}
          onPress={toggleSelectAll}
        >
          <View
            style={[
              styles.checkbox,
              allSelected && styles.checkboxSelected,
            ]}
          >
            {allSelected && (
              <FontAwesome name="check" size={12} color="#fff" />
            )}
          </View>
          <Text style={styles.bottomAllText}>All</Text>
        </TouchableOpacity>

        <View style={styles.bottomCenter}>
          <Text style={styles.bottomTotalText}>
            €{total.toFixed(2)}
          </Text>
          <Text style={styles.bottomAfterCouponText}>
            {couponAmount > 0
              ? `After coupon €${afterCoupon.toFixed(2)} (-€${couponAmount.toFixed(
                  2,
                )})`
              : 'Apply coupons at checkout'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.bottomCheckoutBtn}
          onPress={handleCheckout}
        >
          <Text style={styles.bottomCheckoutText}>
            Checkout ({selectedCount || cartItems.length})
          </Text>
          <Text style={styles.bottomCheckoutSub}>
            {selectedCount ? 'Almost sold out!' : 'Select items'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

// ---------- STYLES ----------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6fb',
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ececf2',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  headerShipTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  headerShipText: {
    fontSize: 11,
    color: '#111',
    fontWeight: '500',
  },

  // EMPTY STATE
  emptyBox: {
    backgroundColor: '#fff',
    marginTop: 14,
    marginHorizontal: 12,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginBottom: 18,
  },
  emptyButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  emptyOutlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#111',
    borderRadius: 8,
    paddingVertical: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  emptyOutlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  emptyPrimaryBtn: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 10,
    marginLeft: 8,
    alignItems: 'center',
  },
  emptyPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },

  // PROMO
  promoBanner: {
    marginTop: 14,
    marginHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  promoImage: {
    width: '100%',
    height: 140,
  },
  promoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'flex-end',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#f5f5f5',
  },

  // DEAR USER
  dearCard: {
    marginTop: 14,
    marginHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#fff4e6',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dearTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  dearText: {
    fontSize: 13,
    color: '#555',
  },
  dearBtn: {
    marginLeft: 12,
    backgroundColor: '#111',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  dearBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },

  // FILL SECTION
  fillSection: {
    marginTop: 18,
    paddingBottom: 18,
  },
  fillSectionLogged: {
    marginTop: 24,
    paddingBottom: 40,
  },
  fillTitle: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    marginBottom: 10,
  },
  fillTabsRow: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  fillTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8fb',
    marginRight: 8,
  },
  fillTabActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  fillTabText: {
    fontSize: 13,
    color: '#444',
  },
  fillTabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  // RECOMMENDATION CARD
  recoCard: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginLeft: 12,
    paddingBottom: 10,
    overflow: 'hidden',
  },
  recoImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f2f2f2',
  },
  recoName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    marginTop: 6,
    paddingHorizontal: 8,
  },
  recoPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  recoPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e0004d',
  },
  recoOriginal: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  recoDiscountTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#000000c0',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  recoDiscountText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },

  // CART FILTER ROW
  cartFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  cartFilterTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  cartFilterTagActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  cartFilterText: {
    fontSize: 13,
    color: '#444',
  },
  cartFilterTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  // SHIPPING PROMO
  shippingPromoBox: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f1fffb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shippingPromoText: {
    flex: 1,
    fontSize: 12,
    color: '#1c4d4b',
  },
  shippingPromoAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E8C83',
  },

  sellerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  sellerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },

  // CART CARD
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginTop: 6,
  },
  cartLeft: {
    marginRight: 8,
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  cartImage: {
    width: 92,
    height: 92,
    borderRadius: 8,
    backgroundColor: '#f1f1f4',
  },
  cartBadgeOverlay: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: '#000000a0',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cartBadgeText: {
    fontSize: 10,
    color: '#fff',
  },
  cartBadgeDiscount: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#e0004d',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cartBadgeDiscountText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },

  cartRight: {
    flex: 1,
  },
  cartTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cartTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    marginRight: 8,
  },
  trashButton: {
    paddingHorizontal: 4,
  },
  cartSeller: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  variantRow: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 4,
  },
  variantTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#f3f3f7',
    marginRight: 6,
  },
  variantText: {
    fontSize: 11,
    color: '#444',
  },
  cartBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 6,
  },
  cartPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
  },
  cartOriginalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  cartAfterCoupon: {
    fontSize: 11,
    color: '#e0004d',
    marginTop: 2,
  },
  cartActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  qtyValue: {
    fontSize: 13,
    marginHorizontal: 8,
  },
  heartBtn: {
    marginLeft: 10,
  },

  // BOTTOM BAR
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomAllText: {
    fontSize: 13,
    marginLeft: 6,
    color: '#111',
  },
  bottomCenter: {
    flex: 1,
    marginLeft: 12,
  },
  bottomTotalText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
  },
  bottomAfterCouponText: {
    fontSize: 11,
    color: '#e0004d',
  },
  bottomCheckoutBtn: {
    backgroundColor: '#111',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bottomCheckoutText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  bottomCheckoutSub: {
    fontSize: 11,
    color: '#ffdada',
  },

  // SCROLL TO TOP
  scrollTopBtn: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  swipeDelete: {
    flex: 1,
    backgroundColor: '#e0004d',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 12,
    marginVertical: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  swipeDeleteText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700',
    marginLeft: 6,
  },
});
