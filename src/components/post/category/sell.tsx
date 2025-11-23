import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useWizardStore } from "../../../utils/wizardStore";
import { useRouter } from "expo-router";

export default function SellCategory() {
  const router = useRouter();
  const { setCategory } = useWizardStore();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sell Product</Text>

      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => {
          setCategory("sell");
          router.push("/(post)/wizard/step1-basic");
        }}
      >
        <Text style={styles.txt}>Start Selling</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0B0B", padding: 20 },
  header: { color: "#fff", fontSize: 26, fontWeight: "700" },
  startBtn: {
    marginTop: 40,
    backgroundColor: "#00FFAA",
    padding: 18,
    borderRadius: 12
  },
  txt: {
    color: "#000",
    textAlign: "center",
    fontWeight: "700"
  }
});
