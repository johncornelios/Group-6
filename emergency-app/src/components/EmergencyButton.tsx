import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";

type Props = {
  onPress: () => void;
  active?: boolean;
};

export default function EmergencyButton({
  onPress,
  active = false,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        active && styles.activeButton,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.circle}>
        <Text style={styles.icon}>🚨</Text>
      </View>

      <Text style={styles.title}>
        {active ? "HELP REQUESTED" : "I'M IN AN EMERGENCY"}
      </Text>

      <Text style={styles.subtitle}>
        {active
          ? "Tap again when you are safe"
          : "Tap here if you need help"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#B91C1C",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
  },

  activeButton: {
    backgroundColor: "#7F1D1D",
  },

  circle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  icon: {
    fontSize: 34,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#FECACA",
    marginTop: 6,
    textAlign: "center",
  },
});