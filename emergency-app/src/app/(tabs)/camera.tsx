import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { saveEvidence } from "../../services/emergencyStorage";

export default function CameraScreen() {
  const router = useRouter();

  const [photo, setPhoto] = useState<string | null>(null);
  const [capturedAt, setCapturedAt] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const mountedRef = useRef(false);
  const openingRef = useRef(false);
  const savingRef = useRef(false);
  const requestRef = useRef(0);

  const stopCamera = () => {
    requestRef.current += 1;

    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    openingRef.current = false;
    setOpening(false);
    setCameraOpen(false);
  };

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestRef.current += 1;

      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (
      Platform.OS === "web" &&
      cameraOpen &&
      videoRef.current &&
      streamRef.current
    ) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;

      video.play().catch(() => {
        if (
          mountedRef.current &&
          videoRef.current === video &&
          video.srcObject
        ) {
          setError(
            "Unable to start the camera preview. Cancel and try again."
          );
        }
      });
    }
  }, [cameraOpen]);

  const persistPhoto = async (uri: string, timestamp: string) => {
    if (savingRef.current) return;

    savingRef.current = true;
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      await saveEvidence(uri, timestamp);

      if (mountedRef.current) {
        setSaved(true);
      }
    } catch {
      if (mountedRef.current) {
        setError(
          "The photo could not be saved. Check available storage, then tap Save Again."
        );
      }
    } finally {
      savingRef.current = false;

      if (mountedRef.current) {
        setSaving(false);
      }
    }
  };

  const saveCapturedPhoto = async (uri: string) => {
    const timestamp = new Date().toISOString();

    setPhoto(uri);
    setCapturedAt(timestamp);

    await persistPhoto(uri, timestamp);
  };

  const openCamera = async () => {
    if (
      openingRef.current ||
      savingRef.current ||
      cameraOpen
    ) {
      return;
    }

    openingRef.current = true;
    const requestId = ++requestRef.current;

    const isCurrentRequest = () =>
      mountedRef.current && requestRef.current === requestId;

    setOpening(true);
    setError("");

    try {
      if (Platform.OS === "web") {
        if (
          typeof navigator === "undefined" ||
          !navigator.mediaDevices?.getUserMedia
        ) {
          throw new Error(
            "Camera is unavailable. Open the app on localhost or HTTPS using a supported browser."
          );
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
          audio: false,
        });

        if (!isCurrentRequest()) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setCameraOpen(true);
      } else {
        const permission =
          await ImagePicker.requestCameraPermissionsAsync();

        if (!isCurrentRequest()) return;

        if (!permission.granted) {
          throw new Error(
            permission.canAskAgain
              ? "Please allow camera access to capture evidence."
              : "Enable camera access for this app in your phone's settings."
          );
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          quality: 0.8,
          allowsEditing: false,
        });

        if (!isCurrentRequest()) return;

        if (!result.canceled && result.assets.length > 0) {
          await saveCapturedPhoto(result.assets[0].uri);
        }
      }
    } catch (err) {
      if (isCurrentRequest()) {
        const errorName = err instanceof Error ? err.name : "";

        setError(
          errorName === "NotAllowedError"
            ? "Camera access was denied. Allow camera access in your browser's site settings."
            : errorName === "NotFoundError"
              ? "No camera was found on this device."
              : errorName === "NotReadableError"
                ? "The camera is unavailable. Close other apps using it and try again."
                : err instanceof Error
                  ? err.message
                  : "Unable to open the camera. Please try again."
        );
      }
    } finally {
      if (isCurrentRequest()) {
        openingRef.current = false;
        setOpening(false);
      }
    }
  };

  const takePhoto = () => {
    if (savingRef.current) return;

    const video = videoRef.current;

    if (!video || Platform.OS !== "web") return;

    setError("");

    if (
      video.readyState < 2 ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      setError("Camera is still loading. Please try again.");
      return;
    }

    try {
      const canvas = document.createElement("canvas");

      // Limit browser image size to reduce local storage usage.
      const scale = Math.min(
        1,
        1280 / Math.max(video.videoWidth, video.videoHeight)
      );

      canvas.width = Math.max(
        1,
        Math.round(video.videoWidth * scale)
      );

      canvas.height = Math.max(
        1,
        Math.round(video.videoHeight * scale)
      );

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error(
          "Unable to capture the photo. Please try again."
        );
      }

      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const image = canvas.toDataURL("image/jpeg", 0.8);

      stopCamera();
      void saveCapturedPhoto(image);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to capture the photo. Please try again."
      );
    }
  };

  const handleBack = () => {
    // Let the current save finish before leaving.
    if (savingRef.current) return;

    stopCamera();
    router.back();
  };

  const openSavedEvidence = () => {
    if (openingRef.current || savingRef.current) return;

    stopCamera();
    router.push("/(tabs)/records");
  };

  const busy = opening || saving;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleBack}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Camera Screen</Text>

        <Text style={styles.subtitle}>
          Captured photos are automatically saved to Incident Records.
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            styles.recordsButton,
            busy && styles.disabledButton,
          ]}
          onPress={openSavedEvidence}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel="View saved evidence"
          accessibilityState={{ disabled: busy }}
        >
          <Text style={styles.buttonText}>
            📁 View Saved Evidence
          </Text>
        </TouchableOpacity>

        {!cameraOpen && (
          <TouchableOpacity
            style={[
              styles.button,
              busy && styles.disabledButton,
            ]}
            onPress={openCamera}
            disabled={busy}
            accessibilityRole="button"
            accessibilityState={{
              disabled: busy,
              busy,
            }}
          >
            {busy ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#FFFFFF" />

                <Text style={styles.loadingText}>
                  {saving ? "Saving Evidence..." : "Opening Camera..."}
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>
                {photo ? "Retake Evidence" : "Capture Evidence"}
              </Text>
            )}
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
                width: "100%",
                maxWidth: 420,
                borderRadius: 10,
                backgroundColor: "#000000",
              },
            })}

            <TouchableOpacity
              style={[styles.button, styles.takePhotoButton]}
              onPress={takePhoto}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                stopCamera();
                setError("");
              }}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Cancel</Text>
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
              resizeMode="contain"
              accessibilityLabel="Captured evidence preview"
            />

            <Text
              style={[
                styles.successText,
                !saved && !saving && styles.unsavedText,
              ]}
            >
              {saving
                ? "Saving evidence..."
                : saved
                  ? "✓ Evidence saved to Incident Records"
                  : "Photo captured — not saved yet"}
            </Text>

            {capturedAt && (
              <>
                <Text style={styles.timestampLabel}>
                  CAPTURE TIME
                </Text>

                <Text style={styles.timestamp}>
                  {new Date(capturedAt).toLocaleString()}
                </Text>
              </>
            )}

            {!saved && !saving && capturedAt && (
              <TouchableOpacity
                style={[styles.button, styles.retryButton]}
                onPress={() =>
                  void persistPhoto(photo, capturedAt)
                }
                disabled={opening}
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>Save Again</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.note}>
              Each new capture saves a separate record. Retaking does
              not delete previously saved evidence. Canceling a retake
              keeps your current preview.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    width: "100%",
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
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

  scrollView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 35,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    maxWidth: 420,
  },

  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    justifyContent: "center",
  },

  recordsButton: {
    backgroundColor: "#374151",
    marginBottom: 15,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },

  cameraContainer: {
    marginTop: 20,
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
  },

  takePhotoButton: {
    marginTop: 15,
  },

  cancelButton: {
    backgroundColor: "#6B7280",
    marginTop: 10,
  },

  previewContainer: {
    marginTop: 25,
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
  },

  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },

  image: {
    width: "100%",
    height: 260,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },

  successText: {
    marginTop: 12,
    color: "#15803D",
    fontSize: 14,
    textAlign: "center",
  },

  unsavedText: {
    color: "#92400E",
  },

  timestampLabel: {
    marginTop: 18,
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "bold",
  },

  timestamp: {
    marginTop: 5,
    color: "#111827",
    fontSize: 14,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 15,
  },

  note: {
    marginTop: 15,
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },

  errorText: {
    marginTop: 15,
    color: "#DC2626",
    textAlign: "center",
    maxWidth: 420,
  },
});