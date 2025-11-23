import { View, Text, StyleSheet, Switch } from "react-native";

type FormSwitchProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function FormSwitch({ label, value, onChange }: FormSwitchProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: "#1A1A1A",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  label: { color: "#ccc", fontSize: 15 }
});
