import React from "react";
import { View, Text } from "react-native";

const GOLD = "#D4AF37";

export default function ProductPriceBlock({
  price,
  oldPrice,
  discount,
}: {
  price: number;
  oldPrice?: number;
  discount?: number;
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderColor: "#e5e5e5",
      }}
    >
      {/* Price Row */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: "#0D0D0D",
          }}
        >
          ${price.toFixed(2)}
        </Text>

        {oldPrice && (
          <Text
            style={{
              marginLeft: 10,
              fontSize: 16,
              color: "#777",
              textDecorationLine: "line-through",
            }}
          >
            ${oldPrice.toFixed(2)}
          </Text>
        )}

        {discount && (
          <View
            style={{
              backgroundColor: GOLD,
              marginLeft: 10,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: 13,
              }}
            >
              -{discount}%
            </Text>
          </View>
        )}
      </View>

      {/* Promo Text */}
      <Text
        style={{
          marginTop: 10,
          fontSize: 14,
          color: "#444",
          lineHeight: 18,
        }}
      >
        Join <Text style={{ color: GOLD, fontWeight: "700" }}>Mukulah Club</Text>{" "}
        for exclusive rewards and discounts.
      </Text>
    </View>
  );
}
