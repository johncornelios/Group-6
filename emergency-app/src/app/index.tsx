
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
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";

import { router } from "expo-router";
import { saveUser } from "../services/emergencyStorage";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function continueToApp() {
    const cleanName = name.trim();

    if (!cleanName) {
      Alert.alert(
        "Name Required",
        "Please enter your name before continuing."
      );
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      await saveUser({ name: cleanName });

      router.replace({
        pathname: "/(tabs)/dashboard",
        params: { username: cleanName },
      });
    } catch (error) {
      console.error("Error saving user:", error);

      Alert.alert(
        "Something Went Wrong",
        "Unable to save your information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>🚨</Text>
            </View>

            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>
                COMMUNITY SAFETY
              </Text>
            </View>
          </View>

          <Text style={styles.welcome}>WELCOME TO</Text>

          <Text style={styles.title}>
            Community{"\n"}
            <Text style={styles.titleRed}>Response</Text>
          </Text>

          <Text style={styles.subtitle}>
            Stay prepared, stay connected, and keep your
            emergency information ready when you need it most.
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoEmoji}>🛡️</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Your Safety Matters
              </Text>
              <Text style={styles.infoDescription}>
                Keep your emergency details and trusted
                contacts organized in one place.
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>
              Let's get started
            </Text>

            <Text style={styles.formSubtitle}>
              What should we call you?
            </Text>

            <Text style={styles.label}>FULL NAME</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={60}
                returnKeyType="done"
                onSubmitEditing={continueToApp}
                editable={!loading}
                accessibilityLabel="Full name"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.buttonDisabled,
              ]}
              onPress={continueToApp}
              activeOpacity={0.8}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Get Started"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>
                    Get Started
                  </Text>
                  <Text style={styles.arrow}>→</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.privacyContainer}>
            <Text style={styles.privacyIcon}>🔒</Text>
            <Text style={styles.disclaimer}>
              Your saved information is stored
              locally on your device.
            </Text>
          </View>

          <Text style={styles.footer}>
            COMMUNITY RESPONSE • SAFETY FIRST
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 16,
  },
  icon: {
    fontSize: 43,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 7,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#047857",
    letterSpacing: 1,
  },
  welcome: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748B",
    letterSpacing: 3,
    marginBottom: 8,
  },
  title: {
    fontSize: 43,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    lineHeight: 49,
  },
  titleRed: {
    color: "#B91C1C",
  },
  subtitle: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 26,
    paddingHorizontal: 8,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 30,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },
  infoEmoji: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
  },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#0F172A",
  },
  formSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 5,
    marginBottom: 23,
  },
  label: {
    color: "#334155",
    fontWeight: "bold",
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 9,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 14,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    color: "#0F172A",
    minWidth: 0,
  },
  button: {
    backgroundColor: "#B91C1C",
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    minHeight: 55,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 23,
    marginLeft: 12,
  },
  privacyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    paddingHorizontal: 15,
  },
  privacyIcon: {
    fontSize: 13,
    marginRight: 7,
  },
  disclaimer: {
    flex: 1,
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    color: "#CBD5E1",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginTop: 25,
  },
});
