import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function continueToApp() {
    const cleanName = name.trim();

    if (!cleanName) {
      const message =
        "Please enter your name before continuing.";

      setError(message);

      if (Platform.OS !== "web") {
        Alert.alert("Name Required", message);
      }

      return;
    }

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await AsyncStorage.setItem(
        "community_user",
        JSON.stringify({ name: cleanName })
      );

      // Continue to Explore Screen
      router.replace({
        pathname: "/explore",
        params: { username: cleanName },
      });
    } catch (err) {
      const message =
        "Unable to save your name. Please try again.";

      setError(message);

      if (Platform.OS !== "web") {
        Alert.alert("Error", message);
      }

      console.error("Save user error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>🚨</Text>
        </View>

        <Text style={styles.title}>
          Community{"\n"}Response
        </Text>

        <Text style={styles.subtitle}>
          Your emergency information,
          location, and trusted contacts
          in one place.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>
            YOUR NAME
          </Text>

          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError("");
            }}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            autoCapitalize="words"
          />

          {!!error && (
            <Text style={styles.errorText}>
              {error}
            </Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={continueToApp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Please wait..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          This app stores emergency information
          locally on your device.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    padding: 28,
  },

  iconCircle: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  icon: {
    fontSize: 42,
  },

  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    color: "#6B7280",
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 12,
  },

  form: {
    marginTop: 40,
  },

  label: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 7,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  button: {
    backgroundColor: "#B91C1C",
    borderRadius: 12,
    padding: 17,
    alignItems: "center",
    marginTop: 15,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 8,
  },

  disclaimer: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 25,
  },
});

function saveUser(user: { name: string }) {
  console.log("User:", user.name);
}