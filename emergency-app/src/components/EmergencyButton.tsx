import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { createEmergency } from "../services/emergencyService";

export default function EmergencyButton() {
  async function handleEmergency() {
    Alert.alert(
      "Emergency Alert",
      "Are you sure you want to send an emergency alert?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Send Alert",
          style: "destructive",
          onPress: async () => {
            await createEmergency({ type: "general" });

            Alert.alert(
              "Alert Recorded",
              "Your emergency information has been saved."
            );
          },
        },
      ]
    );
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleEmergency}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>🚨</Text>

      <Text style={styles.title}>
        EMERGENCY
      </Text>

      <Text style={styles.subtitle}>
        Tap to request help
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#B91C1C",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    marginTop: 20,
    elevation: 5,
  },

  icon: {
    fontSize: 40,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 5,
  },

  subtitle: {
    color: "#FECACA",
    fontSize: 13,
    marginTop: 4,
  },
});