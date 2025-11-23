import { TextInput, View, Text, StyleSheet } from "react-native";

type FormTextInputProps = {
  label: string;
  value: string;
  onChange: (text: string) => void;
};

export default function FormTextInput({ label, value, onChange }: FormTextInputProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#777"
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginBottom: 18 },
  label: { color: "#ccc", marginBottom: 6, fontSize: 15 },
  input: {
    backgroundColor: "#1A1A1A",
    padding: 14,
    borderRadius: 10,
    color: "#fff",
    fontSize: 15
  }
});
