import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function CameraScreen() {
  const [photo, setPhoto] = useState<string | null>(null);

  const openCamera = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow camera access."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert(
          "Unable to open camera. Check browser permissions or try Expo Go on your phone."
        );
      } else {
        Alert.alert("Error", "Unable to open camera.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera Screen</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={openCamera}
      >
        <Text style={styles.buttonText}>
          Capture Evidence
        </Text>
      </TouchableOpacity>

      {photo && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>
            Captured Evidence
          </Text>

          <Image
            source={{ uri: photo }}
            style={styles.image}
          />

          <Text style={styles.successText}>
            Photo captured successfully!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  previewContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  image: {
    width: 280,
    height: 250,
    borderRadius: 10,
  },
  successText: {
    marginTop: 10,
    color: "green",
    fontSize: 14,
  },
});
