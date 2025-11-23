import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FormSelectProps = {
  label: string;
  value: string;
  options: string[];
  onSelect: (option: string) => void;
};

export default function FormSelect({ label, value, options, onSelect }: FormSelectProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.selector}>
        <Text style={styles.txt}>{value || "Select..."}</Text>
        <Ionicons name="chevron-down" size={18} color="#aaa" />
      </TouchableOpacity>

      <View style={styles.dropdown}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={styles.opt}
            onPress={() => onSelect(opt)}
          >
            <Text style={styles.optTxt}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginBottom: 18 },
  label: { color: "#ccc", marginBottom: 6, fontSize: 15 },
  selector: {
    backgroundColor: "#1A1A1A",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  txt: { color: "#fff" },
  dropdown: {
    marginTop: 6,
    backgroundColor: "#111",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222"
  },
  opt: { padding: 14 },
  optTxt: { color: "#ccc" }
});
