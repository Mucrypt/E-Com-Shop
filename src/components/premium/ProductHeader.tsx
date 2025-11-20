import React from "react";
import { View, TextInput, TouchableOpacity, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProductHeader({ onSearchPress }: { onSearchPress?: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      intensity={40}
      tint="dark"
      style={{
        position: "absolute",
        top: insets.top + 8,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 1,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          backgroundColor: "rgba(255,255,255,0.15)",
          padding: 8,
          borderRadius: 50,
        }}
      >
        <Ionicons name="chevron-back" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Search Bar */}
      <TouchableOpacity
        onPress={onSearchPress}
        style={{
          flex: 1,
          marginLeft: 12,
          marginRight: 12,
          height: 40,
          borderRadius: 20,
          backgroundColor: "rgba(255,255,255,0.10)",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
        }}
      >
        <Ionicons name="search" size={18} color="#ccc" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#aaa"
          editable={false}
          style={{
            flex: 1,
            marginLeft: 8,
            color: "#fff",
            fontSize: 14,
          }}
        />
      </TouchableOpacity>

      {/* Cart */}
      <TouchableOpacity
        style={{
          padding: 8,
        }}
      >
        <Ionicons name="cart-outline" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Share */}
      <TouchableOpacity
        style={{
          padding: 8,
          marginLeft: 4,
        }}
      >
        <Ionicons name="share-social-outline" size={22} color="#fff" />
      </TouchableOpacity>
    </BlurView>
  );
}
