// components/premium/ProductBottomBar.tsx
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GOLD = "#D4AF37";

type Props = {
  price: number;
  onAddToCart: () => void;
  onGoShop?: () => void;
  onToggleFavorite?: () => void;
};

export default function ProductBottomBar({
  price,
  onAddToCart,
  onGoShop,
  onToggleFavorite,
}: Props) {
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "rgba(10,10,10,0.96)",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Shop */}
      <TouchableOpacity
        onPress={onGoShop}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#1f1f1f",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8,
        }}
      >
        <Ionicons name="storefront-outline" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Favorite */}
      <TouchableOpacity
        onPress={onToggleFavorite}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#1f1f1f",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name="heart-outline" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Add to Cart */}
      <TouchableOpacity
        onPress={onAddToCart}
        style={{
          flex: 1,
          backgroundColor: "#000",
          borderRadius: 24,
          paddingVertical: 10,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
            fontSize: 15,
            marginRight: 6,
          }}
        >
          Add to cart
        </Text>
        <Text style={{ color: GOLD, fontWeight: "700", fontSize: 14 }}>
          ${price.toFixed(2)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
