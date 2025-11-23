import { View, StyleSheet, Modal } from "react-native";
import { useRouter } from "expo-router";
import PostCenter from "../../components/post/PostCenter";
import { Colors } from "../../constants";

export default function PostCenterModal() {
  const router = useRouter();

  return (
    <Modal animationType="fade" presentationStyle="pageSheet">
      <View style={styles.container}>
        <PostCenter onClose={() => router.back()} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
});
