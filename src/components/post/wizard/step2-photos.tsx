import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useWizardStore } from "../../../utils/wizardStore";
import MultiImagePicker from "../../../components/post/MultiImagePicker";
import StepHeader from "../../../components/post/StepHeader";
import { useRouter } from "expo-router";

export default function Step2() {
  const router = useRouter();
  const { images, setImages } = useWizardStore();

  return (
    <View style={styles.container}>
      <StepHeader step={2} title="Add Photos" />

      <MultiImagePicker images={images} setImages={setImages} />

      <TouchableOpacity
        style={styles.nextBtn}
        onPress={() => router.push("/(post)/wizard/step3-dynamic-fields")}
      >
        <Text style={styles.nextTxt}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0B0B0B" },
  nextBtn: {
    marginTop: 30,
    backgroundColor: "#00FFAA",
    padding: 15,
    borderRadius: 10
  },
  nextTxt: { textAlign: "center", fontWeight: "700", color: "#000" }
});
