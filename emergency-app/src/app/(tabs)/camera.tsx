
import React, { useEffect, useRef, useState } from "react";
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
import { useRouter } from "expo-router";

export default function CameraScreen() {
  const router = useRouter();

  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState("");

  const videoRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
    streamRef.current = null;
    setCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  useEffect(() => {
    if (
      Platform.OS === "web" &&
      cameraOpen &&
      videoRef.current &&
      streamRef.current
    ) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraOpen]);

  const openCamera = async () => {
    setError("");

    if (Platform.OS === "web") {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError(
            "Camera is unavailable. Use Chrome on localhost or HTTPS."
          );
          return;
        }

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });

        streamRef.current = stream;
        setCameraOpen(true);
      } catch (err) {
        setError(
          "Cannot access camera. Check Chrome camera permissions."
        );
      }
    } else {
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

        const result =
          await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.8,
          });

        if (!result.canceled && result.assets.length > 0) {
          setPhoto(result.assets[0].uri);
        }
      } catch {
        Alert.alert("Error", "Unable to open camera.");
      }
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (!canvas.width || !canvas.height) {
      setError("Camera is still loading. Please try again.");
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const image = canvas.toDataURL("image/jpeg", 0.8);
    setPhoto(image);
    stopCamera();
  };

  // Back button: stop camera before returning
  const handleBack = () => {
    stopCamera();
    router.back();
  };

  return (
    <View style={styles.screen}>

      {/* BACK BUTTON HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>
            ← Back
          </Text>
        </TouchableOpacity>
      </View>

      {/* ORIGINAL CAMERA CONTENT */}
      <View style={styles.container}>
        <Text style={styles.title}>Camera Screen</Text>

        {!cameraOpen && (
          <TouchableOpacity
            style={styles.button}
            onPress={openCamera}
          >
            <Text style={styles.buttonText}>
              Capture Evidence
            </Text>
          </TouchableOpacity>
        )}

        {Platform.OS === "web" && cameraOpen && (
          <View style={styles.cameraContainer}>
            {React.createElement("video", {
              ref: videoRef,
              autoPlay: true,
              playsInline: true,
              muted: true,
              style: {
                width: 320,
                maxWidth: "100%",
                borderRadius: 10,
                backgroundColor: "#000",
              },
            })}

            <TouchableOpacity
              style={[styles.button, { marginTop: 15 }]}
              onPress={takePhoto}
            >
              <Text style={styles.buttonText}>
                Take Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={stopCamera}
            >
              <Text style={styles.buttonText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!!error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {photo && !cameraOpen && (
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // BACK BUTTON HEADER
  header: {
    width: "100%",
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    alignItems: "flex-start",
  },

  backButton: {
    backgroundColor: "#FFE2E2",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    color: "#C5161D",
    fontSize: 14,
    fontWeight: "bold",
  },

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
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  cameraContainer: {
    marginTop: 20,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#6B7280",
    marginTop: 10,
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
    height: 220,
    borderRadius: 10,
  },

  successText: {
    marginTop: 10,
    color: "green",
    fontSize: 14,
  },

  errorText: {
    marginTop: 15,
    color: "red",
    textAlign: "center",
  },
});
