// components/premium/ProductRecommendations.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from "react-native";

const { width } = Dimensions.get("window");
const GOLD = "#D4AF37";

export type RecommendProduct = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
};

type Props = {
  products: RecommendProduct[];
  title?: string;
  onPressProduct?: (id: string) => void;
};

export default function ProductRecommendations({
  products,
  title = "You may also like",
  onPressProduct,
}: Props) {
  const itemWidth = (width - 16 * 2 - 10) / 2;

  return (
    <View
      style={{
        backgroundColor: "#fff",
        marginTop: 10,
        paddingBottom: 20,
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#111" }}>
          {title}
        </Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 14,
        }}
        renderItem={({ item }) => {
          const hasDiscount =
            item.oldPrice && item.oldPrice > item.price;

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onPressProduct && onPressProduct(item.id)}
              style={{
                width: itemWidth,
                borderRadius: 14,
                backgroundColor: "#fff",
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: "100%",
                  height: itemWidth * 1.35,
                  backgroundColor: "#f3f3f3",
                }}
                resizeMode="cover"
              />

              <View style={{ paddingHorizontal: 8, paddingVertical: 8 }}>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#111",
                    marginBottom: 4,
                  }}
                >
                  {item.name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "800",
                      color: "#111",
                    }}
                  >
                    ${item.price.toFixed(2)}
                  </Text>
                  {hasDiscount && (
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#777",
                        textDecorationLine: "line-through",
                        marginLeft: 6,
                      }}
                    >
                      ${item.oldPrice!.toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
