import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

export default function EvidenceCard() {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push("/camera" as any)}
    >
      <Text style={styles.icon}>📷</Text>

      <Text style={styles.title}>
        Emergency Evidence
      </Text>

      <Text style={styles.description}>
        Capture photos or videos that may help document
        an emergency.
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 18,
    marginTop: 15,
    elevation: 2,
  },

  icon: {
    fontSize: 30,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 7,
  },

  description: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    lineHeight: 18,
  },
});