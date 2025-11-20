// app/(shop)/product/[slug].tsx
import React, { useState } from "react";
import { View, ScrollView, Text, StatusBar, ScrollView as RNScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

import ProductHeader from "../../components/premium/ProductHeader";
import ProductCarousel from "../../components/premium/ProductCarousel";
import ProductTabs from "../../components/premium/ProductTabs";
import ProductPriceBlock from "../../components/premium/ProductPriceBlock";
import ProductVariants from "../../components/premium/ProductVariants";
import ProductAccordion from "../../components/premium/ProductAccordion";
import ProductSeller from "../../components/premium/ProductSeller";
import ProductReviewsPreview from "../../components/premium/ProductReviewsPreview";
import ProductRecommendations, {
  RecommendProduct,
} from "../../components/premium/ProductRecommendations";
import ProductBottomBar from "../../components/premium/ProductBottomBar";

const GOLD = "#D4AF37";

// MOCK PRODUCT
const mockProduct = {
  id: "1",
  name: "Premium Denim Jacket Mukulah Edition",
  price: 29.99,
  oldPrice: 49.99,
  discount: 40,
  rating: 4.6,
  reviewsCount: 237,
  images: [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  ],
  colors: ["Light Blue", "Black", "Washed Grey"],
  sizes: ["XS", "S", "M", "L", "XL"],
  description:
    "A Mukulah premium denim jacket inspired by street fashion and luxury minimalism. Soft-touch cotton blend, tailored fit, and subtle gold accent stitching.",
  shipping:
    "Ships in 2–5 business days. Free shipping over $49. Delivered by Mukulah Logistics partners.",
  returns:
    "30-day easy return policy. Return via pickup points or direct courier pickup.",
  security:
    "Secure checkout powered by leading payment providers. Encrypted transactions and buyer protection.",
  seller: {
    name: "Mukulah Official Store",
    logo: "",
    rating: 4.8,
    followers: 23560,
  },
  reviewTags: [
    "Good quality",
    "True to size",
    "Comfortable",
    "Stylish",
    "Worth the price",
  ],
};

const mockRecommendations: RecommendProduct[] = [
  {
    id: "r1",
    name: "Mukulah Slim Fit Jeans",
    price: 19.99,
    oldPrice: 39.99,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "r2",
    name: "Oversized Hoodie Mukulah Street",
    price: 24.99,
    oldPrice: 34.99,
    image:
      "https://images.unsplash.com/photo-1617957743091-4bfb6e57da5e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "r3",
    name: "Premium Basic T-Shirt",
    price: 11.99,
    oldPrice: 19.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "r4",
    name: "Mukulah Cargo Pants",
    price: 27.49,
    oldPrice: 44.99,
    image:
      "https://images.unsplash.com/photo-1520467795206-62e3235a2533?auto=format&fit=crop&w=900&q=80",
  },
];

const RECOMMEND_CATEGORIES = [
  "For You",
  "Similar Style",
  "From This Seller",
  "Best Rated",
  "More Jackets",
];

export default function ProductSlugScreen() {
  const { slug } = useLocalSearchParams();
  const [tab, setTab] = useState<"Goods" | "Reviews" | "Recommend">("Goods");
  const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState(mockProduct.sizes[2]);
  const [activeRecommendCategory, setActiveRecommendCategory] = useState("For You");

  const handleAddToCart = () => {
    // integrate with your cart later
    console.log("Add to cart:", mockProduct.id, selectedColor, selectedSize);
  };

  const [hasAutoOpenedRecommend, setHasAutoOpenedRecommend] = useState(false);

  const handleScrollEnd = (e: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const paddingToBottom = 80;

    if (
      !hasAutoOpenedRecommend &&
      layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    ) {
      setTab("Recommend");
      setHasAutoOpenedRecommend(true);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
      <StatusBar barStyle="light-content" />

      {/* Floating Shein-style header with search bar + cart + share */}
      <ProductHeader />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {/* HERO CAROUSEL */}
        <ProductCarousel images={mockProduct.images} />

        {/* TABS (Goods | Reviews | Recommend) */}
        <ProductTabs active={tab} onChange={(key) => setTab(key as any)} />

        {/* PRICE + NAME + BASIC RATING --- always visible on all tabs */}
        <View
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor: "#e5e5e5",
          }}
        >
          <ProductPriceBlock
            price={mockProduct.price}
            oldPrice={mockProduct.oldPrice}
            discount={mockProduct.discount}
          />

          <View style={{ marginTop: 12 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#111",
                marginBottom: 6,
              }}
            >
              {mockProduct.name}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 13, color: "#444" }}>
                {mockProduct.rating.toFixed(1)} · {mockProduct.reviewsCount} reviews
              </Text>
            </View>
          </View>
        </View>

        {/* ------------- GOODS TAB CONTENT (like your screenshot) ------------- */}
        {tab === "Goods" && (
          <>
            {/* VARIANTS */}
            <ProductVariants
              colors={mockProduct.colors}
              sizes={mockProduct.sizes}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onSelectColor={setSelectedColor}
              onSelectSize={setSelectedSize}
            />

            {/* ACCORDIONS / SECTIONS */}
            <ProductAccordion title="Description">
              <Text style={{ fontSize: 14, color: "#444", lineHeight: 20 }}>
                {mockProduct.description}
              </Text>
            </ProductAccordion>

            <ProductAccordion title="Shipping to Italy">
              <Text style={{ fontSize: 14, color: "#444", lineHeight: 20 }}>
                {mockProduct.shipping}
              </Text>
            </ProductAccordion>

            <ProductAccordion title="Return Policy">
              <Text style={{ fontSize: 14, color: "#444", lineHeight: 20 }}>
                {mockProduct.returns}
              </Text>
            </ProductAccordion>

            <ProductAccordion title="Shopping Security">
              <Text style={{ fontSize: 14, color: "#444", lineHeight: 20 }}>
                {mockProduct.security}
              </Text>
            </ProductAccordion>

            {/* SELLER CARD */}
            <ProductSeller
              name={mockProduct.seller.name}
              logo={mockProduct.seller.logo}
              rating={mockProduct.seller.rating}
              followers={mockProduct.seller.followers}
            />

            {/* REVIEWS PREVIEW (small block like “Reviews (1000+) 4.82 True to Size”) */}
            <ProductReviewsPreview
              rating={mockProduct.rating}
              reviewsCount={mockProduct.reviewsCount}
              tags={mockProduct.reviewTags}
            />

            {/* RECOMMENDED PRODUCTS also visible at bottom of Goods tab */}
            <ProductRecommendations
              title="Recommended for you"
              products={mockRecommendations}
              onPressProduct={(id) => {
                console.log("Open recommended product", id);
              }}
            />
          </>
        )}

        {/* ------------- REVIEWS TAB CONTENT ------------- */}
        {tab === "Reviews" && (
          <View style={{ backgroundColor: "#fff", marginTop: 8 }}>
            <ProductReviewsPreview
              rating={mockProduct.rating}
              reviewsCount={mockProduct.reviewsCount}
              tags={mockProduct.reviewTags}
            />
            <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
              <Text style={{ fontSize: 13, color: "#666", lineHeight: 20 }}>
                Detailed review list will go here later – photos, size feedback,
                filters, etc. For now this shows the main rating summary like on
                Shein.
              </Text>
            </View>
          </View>
        )}

        {/* ------------- RECOMMEND TAB CONTENT (full-screen recommendations) ------------- */}
        {tab === "Recommend" && (
          <>
            {/* Category chips above Recommend list */}
            <View
              style={{
                backgroundColor: "#fff",
                paddingTop: 12,
                paddingBottom: 4,
              }}
            >
              <RNScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                {RECOMMEND_CATEGORIES.map((cat) => {
                  const active = activeRecommendCategory === cat;
                  return (
                    <View
                      key={cat}
                      style={{ marginRight: 10, marginBottom: 4 }}
                    >
                      <Text
                        onPress={() => setActiveRecommendCategory(cat)}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 6,
                          borderRadius: 20,
                          borderWidth: active ? 0 : 1,
                          borderColor: "#ddd",
                          backgroundColor: active ? "#111" : "#f4f4f4",
                          color: active ? "#fff" : "#333",
                          fontSize: 13,
                          fontWeight: active ? "700" : "500",
                        }}
                      >
                        {cat}
                      </Text>
                    </View>
                  );
                })}
              </RNScrollView>
            </View>

            <ProductRecommendations
              title={activeRecommendCategory}
              products={mockRecommendations}
              onPressProduct={(id) => {
                console.log("Open recommended product", id);
              }}
            />
          </>
        )}
      </ScrollView>

      {/* BOTTOM BAR (shop + heart + big Add to Cart) */}
      <ProductBottomBar
        price={mockProduct.price}
        onAddToCart={handleAddToCart}
        onGoShop={() => console.log("Go to shop")}
        onToggleFavorite={() => console.log("Toggle favorite")}
      />
    </View>
  );
}
