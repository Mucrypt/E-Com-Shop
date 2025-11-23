import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useWizardStore } from "../../../utils/wizardStore";
import StepHeader from "../../../components/post/StepHeader";
import { useRouter } from "expo-router";

export default function Step4() {
  const router = useRouter();
  const { price, setPrice } = useWizardStore();

  return (
    <View style={styles.container}>
      <StepHeader step={4} title="Price" />

      <Text style={styles.label}>Set Your Price</Text>
      <TextInput
        keyboardType="numeric"
        placeholder="Enter price"
        placeholderTextColor="#777"
        value={price !== null ? String(price) : ""}
        onChangeText={(v) => setPrice(Number(v))}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.nextBtn}
        onPress={() => router.push("/(post)/wizard/step5-location")}
      >
        <Text style={styles.nextTxt}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0B0B0B" },
  label: { color: "#fff", marginBottom: 10, fontSize: 15 },
  input: {
    backgroundColor: "#1A1A1A",
    padding: 14,
    borderRadius: 10,
    color: "#fff",
    fontSize: 15
  },
  nextBtn: { marginTop: 40, backgroundColor: "#00FFAA", padding: 15, borderRadius: 10 },
  nextTxt: { textAlign: "center", fontWeight: "700", color: "#000" }
});
