import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";

type Props = {
  imageUri?: string | null;
};

export default function EvidenceCard({
  imageUri,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        📷 PHOTO EVIDENCE
      </Text>

      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No photo saved yet.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111827",
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },

  empty: {
    height: 100,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#6B7280",
  },
});