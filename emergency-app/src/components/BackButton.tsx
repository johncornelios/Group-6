
import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

type BackButtonProps = {
  toWelcome?: boolean;
};

export default function BackButton({
  toWelcome = false,
}: BackButtonProps) {
  function handleBack() {
    if (toWelcome) {
      router.replace("/");
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/dashboard");
    }
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleBack}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Text style={styles.arrow}>←</Text>
      <Text style={styles.text}>Back</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 12,
    marginBottom: 18,
  },

  arrow: {
    fontSize: 22,
    color: "#B91C1C",
    marginRight: 8,
  },

  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#B91C1C",
  },
});
