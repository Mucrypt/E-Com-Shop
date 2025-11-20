// components/premium/ProductSeller.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GOLD = "#D4AF37";

type SellerProps = {
  name: string;
  logo?: string;
  rating: number;
  followers: number;
};

export default function ProductSeller({ name, logo, rating, followers }: SellerProps) {
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
      <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 10 }}>Seller</Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Logo */}
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: "#111",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {logo ? (
            <Image
              source={{ uri: logo }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              {name?.substring(0, 1).toUpperCase()}
            </Text>
          )}
        </View>

        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#111" }}>{name}</Text>

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Ionicons name="star" size={14} color={GOLD} />
            <Text style={{ marginLeft: 4, fontSize: 13, color: "#444" }}>
              {rating.toFixed(1)} · {followers.toLocaleString()} followers
            </Text>
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: GOLD,
              marginBottom: 6,
            }}
          >
            <Text style={{ color: GOLD, fontWeight: "600", fontSize: 13 }}>Visit Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 18,
              backgroundColor: GOLD,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Follow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
