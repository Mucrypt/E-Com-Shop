import React, { useState } from "react";
import { View, Image, Dimensions, FlatList, TouchableOpacity, Text } from "react-native";

const { width } = Dimensions.get("window");

export default function ProductCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={images}
        scrollEnabled={false}
        onScroll={(e) => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          setIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{
              width,
              height: width * 1.3,
              resizeMode: "cover",
              backgroundColor: "#171717",
            }}
          />
        )}
      />

      {/* Counter */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
          alignSelf: "center",
          backgroundColor: "rgba(0,0,0,0.4)",
          paddingHorizontal: 14,
          paddingVertical: 6,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 13 }}>
          {index + 1} / {images.length}
        </Text>
      </View>
    </View>
  );
}
