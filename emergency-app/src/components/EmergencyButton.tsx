import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export default function EmergencyButton() {
  const handleEmergency = () => {
    Alert.alert(
      "Emergency Alert",
      "Do you want to activate the emergency alert?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            Alert.alert(
              "Emergency Activated",
              "Your emergency alert has been activated."
            );
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleEmergency}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>
        🚨 EMERGENCY SOS
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#DC2626",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});