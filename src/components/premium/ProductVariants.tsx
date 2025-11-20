import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GOLD = "#D4AF37";

export default function ProductVariants({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onSelectColor,
  onSelectSize,
}: {
  colors: string[];
  sizes: string[];
  selectedColor: string;
  selectedSize: string;
  onSelectColor: (c: string) => void;
  onSelectSize: (s: string) => void;
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: "#e5e5e5",
      }}
    >
      {/* Colors */}
      <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 8 }}>
        Color
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {colors.map((color) => {
          const isActive = selectedColor === color;
          return (
            <TouchableOpacity
              key={color}
              onPress={() => onSelectColor(color)}
              style={{
                marginRight: 12,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: isActive ? 2 : 1,
                borderColor: isActive ? GOLD : "#ccc",
                backgroundColor: isActive ? "rgba(212,175,55,0.10)" : "#f3f3f3",
              }}
            >
              <Text
                style={{
                  color: isActive ? GOLD : "#333",
                  fontWeight: isActive ? "700" : "500",
                }}
              >
                {color}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sizes */}
      <Text
        style={{ marginTop: 20, fontSize: 15, fontWeight: "700", marginBottom: 8 }}
      >
        Size
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {sizes.map((size) => {
          const isActive = selectedSize === size;
          return (
            <TouchableOpacity
              key={size}
              onPress={() => onSelectSize(size)}
              style={{
                width: "22%",
                margin: "1.5%",
                paddingVertical: 12,
                borderRadius: 10,
                borderWidth: isActive ? 2 : 1,
                borderColor: isActive ? GOLD : "#ccc",
                alignItems: "center",
                backgroundColor: isActive ? "rgba(212,175,55,0.09)" : "#f3f3f3",
              }}
            >
              <Text
                style={{
                  fontWeight: isActive ? "700" : "500",
                  color: isActive ? GOLD : "#444",
                }}
              >
                {size}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Size Guide */}
      <TouchableOpacity
        style={{
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="information-circle-outline" size={20} color={GOLD} />
        <Text style={{ marginLeft: 6, color: GOLD, fontWeight: "600" }}>
          Size Guide
        </Text>
      </TouchableOpacity>
    </View>
  );
}
