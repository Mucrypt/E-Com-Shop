// components/premium/ProductTabs.tsx
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

const GOLD = "#D4AF37";

export default function ProductTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (key: string) => void;
}) {
  const tabs = ["Goods", "Reviews", "Recommend"];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#e6e6e6",
      }}
    >
      {tabs.map((t) => {
        const isActive = active === t;

        return (
          <TouchableOpacity
            key={t}
            onPress={() => onChange(t)}
            style={{
              flex: 1,
              alignItems: "center",
              paddingBottom: 6,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: isActive ? "700" : "500",
                color: isActive ? GOLD : "#333",
              }}
            >
              {t}
            </Text>

            {isActive && (
              <View
                style={{
                  width: 40,
                  height: 3,
                  backgroundColor: GOLD,
                  borderRadius: 10,
                  marginTop: 4,
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
