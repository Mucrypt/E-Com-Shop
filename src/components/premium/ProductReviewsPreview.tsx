// components/premium/ProductReviewsPreview.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GOLD = "#D4AF37";

type ReviewsProps = {
  rating: number;
  reviewsCount: number;
  tags: string[];
};

export default function ProductReviewsPreview({
  rating,
  reviewsCount,
  tags,
}: ReviewsProps) {
  const fullStars = Math.floor(rating);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: "#e5e5e5",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "700" }}>Reviews</Text>
        <TouchableOpacity>
          <Text style={{ color: GOLD, fontWeight: "600", fontSize: 13 }}>View all</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#111" }}>
          {rating.toFixed(1)}
        </Text>
        <View style={{ marginLeft: 10 }}>
          <View style={{ flexDirection: "row" }}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Ionicons
                key={idx}
                name={idx < fullStars ? "star" : "star-outline"}
                size={16}
                color={GOLD}
              />
            ))}
          </View>
          <Text style={{ marginTop: 4, fontSize: 12, color: "#666" }}>
            {reviewsCount} reviews
          </Text>
        </View>
      </View>

      {/* Tags */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 12,
        }}
      >
        {tags.map((tag) => (
          <View
            key={tag}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 16,
              backgroundColor: "#f3f3f3",
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: "#444" }}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
