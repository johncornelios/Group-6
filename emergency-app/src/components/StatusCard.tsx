import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function StatusCard() {
  return (
    <View style={styles.card}>
      <View style={styles.dot} />

      <View style={styles.info}>
        <Text style={styles.title}>
          System Ready
        </Text>

        <Text style={styles.text}>
          Community Response is ready for use.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#16A34A",
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
  },

  text: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
  },
});