// app/(shop)/product/[slug].tsx
import React from "react";
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

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Tables } from "../../types/database.types";


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



type ProductRow = Tables<"products">;

export default function ProductSlugScreen() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const [tab, setTab] = useState<"Goods" | "Reviews" | "Recommend">("Goods");
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [activeRecommendCategory, setActiveRecommendCategory] = useState("For You");

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!slug) {
        setError("Missing product id");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", slug)
          .maybeSingle<ProductRow>();
        if (!isMounted) return;
        if (error || !data) {
          setError(error?.message || "Product not found");
        } else {
          setProduct(data);
        }
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || "Failed to load product");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const productName = product?.name ?? mockProduct.name;
  const productPrice = product?.price ?? mockProduct.price;
  const productOldPrice = product?.original_price ?? mockProduct.oldPrice;
  /**
   * Memoized computation of product images array.
   * 
   * This hook attempts to extract an array of image URLs from the `product` object using the following logic:
   * - If `product.images` exists and is an array, it returns it as a string array.
   * - If `product.images` is an object, it tries to access the `urls` property and returns it if it's a non-empty string array.
   * - If `product.image_url` exists, it returns an array containing that single URL.
   * - If none of the above, it falls back to `mockProduct.images`.
   * 
   * @param product - The product object which may contain images in various formats.
   * @returns An array of image URLs for the product.
   */
  const productImages = useMemo(() => {
    if (product?.images && Array.isArray(product.images)) {
      return product.images as string[];
    }
    if (typeof product?.images === "object" && product?.images !== null) {
      const maybe = (product.images as any).urls as string[] | undefined;
      if (maybe?.length) return maybe;
    }
    if (product?.image_url) return [product.image_url];
    return mockProduct.images;
  }, [product]);

  const handleAddToCart = () => {
    const id = product?.id ?? mockProduct.id;
    console.log("Add to cart:", id, selectedColor, selectedSize);
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
        <ProductCarousel images={productImages} />

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
            price={productPrice}
            oldPrice={productOldPrice}
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
              {productName}
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
        price={productPrice}
        onAddToCart={handleAddToCart}
        onGoShop={() => console.log("Go to shop")}
        onToggleFavorite={() => console.log("Toggle favorite")}
      />
    </View>
  );
}
