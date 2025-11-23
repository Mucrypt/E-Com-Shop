import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type PostCategoryCardProps = {
  icon: React.ReactNode;
  title: string;
  color: string;
  onPress: () => void;
};

export default function PostCategoryCard({ icon, title, color, onPress }: PostCategoryCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        {icon}
        <View style={styles.plusBadge}>
          <Ionicons name="add" size={16} color="#000" />
        </View>
      </View>
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    marginBottom: 26,
    alignItems: "center"
  },
  iconBox: {
    width: 85,
    height: 85,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  plusBadge: {
    position: "absolute",
    bottom: -8,
    right: -8,
    backgroundColor: "#00FFAA",
    width: 28,
    height: 28,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    marginTop: 8,
    color: "#ddd",
    fontWeight: "600",
    textAlign: "center"
  }
});
