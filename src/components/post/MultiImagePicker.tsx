import * as ImagePicker from "expo-image-picker";
import { View, TouchableOpacity, Image, StyleSheet, ScrollView, Text } from "react-native";

type ImageAsset = {
  uri: string;
  // add other properties if needed, e.g. width, height, etc.
};

type MultiImagePickerProps = {
  images: ImageAsset[];
  setImages: (images: ImageAsset[]) => void;
};

export default function MultiImagePicker({ images, setImages }: MultiImagePickerProps) {

  const pickImages = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.8,
    });

    if (!res.canceled) {
      setImages([...images, ...res.assets]);
    }
  };

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity onPress={pickImages} style={styles.pickBox}>
          <Text style={{ color: "#fff" }}>+ Add Images</Text>
        </TouchableOpacity>

        {images.map((img, i) => (
          <Image key={i} source={{ uri: img.uri }} style={styles.preview} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pickBox: {
    width: 90, height: 90, backgroundColor: "#191919",
    borderRadius: 10, alignItems: "center", justifyContent: "center",
    marginRight: 10, borderWidth: 1, borderColor: "#333"
  },
  preview: { width: 90, height: 90, borderRadius: 10, marginRight: 10 },
});
