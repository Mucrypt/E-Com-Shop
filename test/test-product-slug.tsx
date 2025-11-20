


// app/(shop)/product/[slug].tsx
import React, { useState } from "react";
import { View, ScrollView, Text, StatusBar } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

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
  returns: "30-day easy return policy. Return via pickup points or direct courier pickup.",
  security:
    "Secure checkout powered by leading payment providers. Encrypted transactions and buyer protection.",
  seller: {
    name: "Mukulah Official Store",
    logo: "",
    rating: 4.8,
    followers: 23560,
  },
  reviewTags: ["Good quality", "True to size", "Comfortable", "Stylish", "Worth the price"],
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

export default function ProductSlugScreen() {
  const { slug } = useLocalSearchParams();
  const [tab, setTab] = useState("Goods");
  const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState(mockProduct.sizes[2]);

  const handleAddToCart = () => {
    // integrate with your cart later
    console.log("Add to cart:", mockProduct.id, selectedColor, selectedSize);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
      <StatusBar barStyle="light-content" />

      {/* Floating header */}
      <ProductHeader />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* HERO CAROUSEL */}
        <ProductCarousel images={mockProduct.images} />

        {/* TABS */}
        <ProductTabs active={tab} onChange={setTab} />

        {/* PRICE + NAME + RATING */}
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

        {/* VARIANTS */}
        <ProductVariants
          colors={mockProduct.colors}
          sizes={mockProduct.sizes}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onSelectColor={setSelectedColor}
          onSelectSize={setSelectedSize}
        />

        {/* ACCORDIONS */}
        <ProductAccordion title="Description">
          <Text style={{ fontSize: 14, color: "#444", lineHeight: 20 }}>
            {mockProduct.description}
          </Text>
        </ProductAccordion>

        <ProductAccordion title="Shipping">
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

        {/* SELLER */}
        <ProductSeller
          name={mockProduct.seller.name}
          logo={mockProduct.seller.logo}
          rating={mockProduct.seller.rating}
          followers={mockProduct.seller.followers}
        />

        {/* REVIEWS PREVIEW */}
        <ProductReviewsPreview
          rating={mockProduct.rating}
          reviewsCount={mockProduct.reviewsCount}
          tags={mockProduct.reviewTags}
        />

        {/* RECOMMENDATIONS */}
        <ProductRecommendations
          products={mockRecommendations}
          onPressProduct={(id) => {
            // navigate to another product by id/slug later
            console.log("Open recommended product", id);
          }}
        />
      </ScrollView>

      {/* BOTTOM BAR */}
      <ProductBottomBar price={mockProduct.price} onAddToCart={handleAddToCart} />
    </View>
  );
}
