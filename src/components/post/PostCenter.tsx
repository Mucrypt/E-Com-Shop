import React, { useEffect, useRef } from "react";
import { Animated, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons, Feather, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PostCenter({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 8, useNativeDriver: true })
    ]).start();
  }, []);

  const categories = [
    { id: "sell", title: "Sell Product", icon: <MaterialIcons name="sell" size={28} color="#fff" />, color: "#6C63FF" },
    { id: "service", title: "Post a Service", icon: <Feather name="tool" size={28} color="#fff" />, color: "#23C58F" },
    { id: "realestate", title: "Real Estate", icon: <MaterialIcons name="house" size={32} color="#fff" />, color: "#F2994A" },
    { id: "job", title: "Offer a Job", icon: <FontAwesome5 name="briefcase" size={26} color="#fff" />, color: "#2D9CDB" },
    { id: "apply", title: "Apply for Job", icon: <Ionicons name="person" size={32} color="#fff" />, color: "#BB6BD9" },
    { id: "media", title: "Upload Media", icon: <Ionicons name="camera" size={30} color="#fff" />, color: "#FF7A00" },
    { id: "travel", title: "Travel Package", icon: <Ionicons name="airplane" size={30} color="#fff" />, color: "#00BFA6" },
    { id: "course", title: "Create Course", icon: <Ionicons name="school" size={28} color="#fff" />, color: "#56CCF2" },
  ];

  const openCategory = (id: string) => {
    router.push(`/(post)/category/${id}`);
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fade, transform: [{ scale }] }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.header}>What do you want to create?</Text>

        <View style={styles.grid}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} onPress={() => openCategory(cat.id)} style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: cat.color }]}>
                {cat.icon}
                <View style={styles.plusBadge}>
                  <Ionicons name="add" size={16} color="#000" />
                </View>
              </View>
              <Text style={styles.label}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  closeBtn: { alignSelf: "flex-end", marginBottom: 10 },
  header: { fontSize: 26, color: "#fff", fontWeight: "700", marginBottom: 20, textAlign: "center" },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "47%", marginBottom: 26, alignItems: "center" },

  iconBox: {
    width: 85, height: 85, borderRadius: 50,
    justifyContent: "center", alignItems: "center", position: "relative",
  },
  plusBadge: {
    position: "absolute", bottom: -8, right: -8,
    backgroundColor: "#00FFAA", width: 28, height: 28,
    borderRadius: 15, justifyContent: "center", alignItems: "center",
  },

  label: { marginTop: 8, color: "#ddd", fontWeight: "600", textAlign: "center" },
});
