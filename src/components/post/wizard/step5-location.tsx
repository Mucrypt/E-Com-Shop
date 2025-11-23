import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useWizardStore } from "../../../utils/wizardStore";
import StepHeader from "../../../components/post/StepHeader";
import { useRouter } from "expo-router";

export default function Step5() {
  const router = useRouter();
  const { location, setLocation } = useWizardStore();

  return (
    <View style={styles.container}>
      <StepHeader step={5} title="Location" />

      <Text style={styles.label}>City</Text>
      <TextInput
        placeholder="Enter city"
        placeholderTextColor="#777"
        value={location?.city}
        onChangeText={(v) => setLocation({ ...location, city: v })}
        style={styles.input}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        placeholder="Enter address"
        placeholderTextColor="#777"
        value={location?.address}
        onChangeText={(v) => setLocation({ ...location, address: v })}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.nextBtn}
        onPress={() => router.push("/(post)/wizard/step6-review")}
      >
        <Text style={styles.nextTxt}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0B0B0B" },
  label: { color: "#fff", marginBottom: 10 },
  input: {
    backgroundColor: "#1A1A1A",
    padding: 14,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 20
  },
  nextBtn: { marginTop: 20, backgroundColor: "#00FFAA", padding: 15, borderRadius: 10 },
  nextTxt: { textAlign: "center", fontWeight: "700", color: "#000" }
});
