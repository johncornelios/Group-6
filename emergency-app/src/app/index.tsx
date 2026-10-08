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


export default function HomeScreen() {
  const [name, setName] = useState("");

  async function continueToApp() {
    const cleanName = name.trim();

    if (!cleanName) {
      Alert.alert(
        "Name Required",
        "Please enter your name before continuing."
      );

      return;
    }

    await saveUser({
      name: cleanName,
    });

    router.replace({
      pathname: "/explore",
      params: { username: cleanName },
    });
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
          <Text style={styles.icon}>
            🚨
          </Text>
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
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={continueToApp}
          >
            <Text style={styles.buttonText}>
              Continue
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

  disclaimer: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 25,
  },
});

async function saveUser(arg0: { name: string }) {
  console.log("User saved:", arg0.name);
}