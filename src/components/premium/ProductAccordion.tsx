import React, { useState } from "react";
import { View, Text, TouchableOpacity, LayoutAnimation } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GOLD = "#D4AF37";

export default function ProductAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#e5e5e5",
      }}
    >
      <TouchableOpacity
        onPress={toggle}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#222" }}>
          {title}
        </Text>

        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={22}
          color={GOLD}
        />
      </TouchableOpacity>

      {open && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 18 }}>
          {children}
        </View>
      )}
    </View>
  );
}
