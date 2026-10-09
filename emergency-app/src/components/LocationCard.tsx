import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

export default function LocationCard() {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push("/(tabs)/location")}
    >
      <Text style={styles.icon}>📍</Text>

      <View style={styles.info}>
        <Text style={styles.label}>
          LOCATION
        </Text>

        <Text style={styles.title}>
          Location Service
        </Text>
      </View>
    </TouchableOpacity>
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
    marginRight: 13,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 3,
  },

  description: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
  },

  arrow: {
    fontSize: 27,
    color: "#9CA3AF",
  },
});