import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function ExploreScreen() {
  const { username } = useLocalSearchParams<{ username?: string }>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Welcome, {username || "User"}!
      </Text>

      <Text style={styles.subtitle}>
        Community Response
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/location" as any)}
        >
          <Text style={styles.buttonText}>
            📍 Location
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/camera" as any)}
        >
          <Text style={styles.buttonText}>
            📷 Evidence
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/sensor" as any)}
        >
          <Text style={styles.buttonText}>
            📱 Sensors
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/dashboard" as any)}
        >
          <Text style={styles.buttonText}>
            🏠 Dashboard
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F3F4F6",
    padding: 25,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  buttons: {
    gap: 15,
  },

  button: {
    backgroundColor: "#B91C1C",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});