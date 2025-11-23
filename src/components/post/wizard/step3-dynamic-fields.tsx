import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useWizardStore } from "../../../utils/wizardStore";
import { formSchemas } from "../../../utils/formSchemas";
import StepHeader from "../../../components/post/StepHeader";
import FormTextInput from "../../../components/post/FormTextInput";
import FormSelect from "../../../components/post/FormSelect";
import FormSwitch from "../../../components/post/FormSwitch";
import { useRouter } from "expo-router";

export default function Step3() {
  const router = useRouter();
  const { category, formData, updateData } = useWizardStore();

  const fields =
    category && (category in formSchemas)
      ? formSchemas[category as keyof typeof formSchemas] || []
      : [];

  const renderField = (f: { id: string; label: string; type: string; options?: any[] }) => {
    switch (f.type) {
      case "text":
      case "number":
        return (
          <FormTextInput
            label={f.label}
            value={formData[f.id] || ""}
            onChange={(v) => updateData(f.id, v)}
          />
        );

      case "select":
        return (
          <FormSelect
            label={f.label}
            value={formData[f.id]}
            options={f.options ?? []}
            onSelect={(v) => updateData(f.id, v)}
          />
        );

      case "boolean":
        return (
          <FormSwitch
            label={f.label}
            value={formData[f.id] || false}
            onChange={(v) => updateData(f.id, v)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StepHeader step={3} title="More Details" />

      {fields.map((field) => (
        <View key={field.id}>{renderField(field)}</View>
      ))}

      <TouchableOpacity
        style={styles.nextBtn}
        onPress={() => router.push("/(post)/wizard/step4-pricing")}
      >
        <Text style={styles.nextTxt}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0B0B0B" },
  nextBtn: { marginTop: 30, backgroundColor: "#00FFAA", padding: 15, borderRadius: 10 },
  nextTxt: { textAlign: "center", fontWeight: "700", color: "#000" }
});
