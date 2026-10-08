import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function EmergencyContact() {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>👤</Text>

      <View style={styles.info}>
        <Text style={styles.label}>
          TRUSTED CONTACT
        </Text>

        <Text style={styles.title}>
          No contact added
        </Text>

        <Text style={styles.description}>
          Add a trusted person for emergencies.
        </Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          Add
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 17,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  icon: {
    fontSize: 28,
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#9CA3AF",
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 3,
  },

  description: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 3,
  },

  button: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  buttonText: {
    color: "#B91C1C",
    fontWeight: "bold",
  },
});