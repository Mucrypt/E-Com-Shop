import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useWizardStore } from "../../../utils/wizardStore";
import { useRouter } from "expo-router";
import StepHeader from "../../../components/post/StepHeader";

export default function Step1() {
  const { updateData } = useWizardStore();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StepHeader step={1} title="Basic Details" />

      <Text style={styles.label}>Title</Text>
      <TextInput
        placeholder="Enter a catchy title"
        placeholderTextColor="#777"
        onChangeText={(t) => updateData("title", t)}
        style={styles.input}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        multiline
        placeholder="Write a description..."
        placeholderTextColor="#777"
        onChangeText={(t) => updateData("description", t)}
        style={[styles.input, { height: 120 }]}
      />

      <TouchableOpacity style={styles.nextBtn} onPress={() => router.push("/(post)/wizard/step2-photos")}>
        <Text style={styles.nextTxt}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0B0B0B" },
  label: { color: "#fff", marginTop: 20, marginBottom: 6, fontSize: 15 },
  input: { backgroundColor: "#1A1A1A", padding: 14, borderRadius: 10, color: "#fff", fontSize: 15 },
  nextBtn: { marginTop: 40, backgroundColor: "#00FFAA", padding: 15, borderRadius: 10 },
  nextTxt: { textAlign: "center", fontWeight: "700", color: "#000" },
});
