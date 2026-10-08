import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type Props = {
  name: string;
  phone: string;
  relationship: string;
  onCall: () => void;
};

export default function EmergencyContact({
  name,
  phone,
  relationship,
  onCall,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👤</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>

        <Text style={styles.relationship}>
          {relationship}
        </Text>

        <Text style={styles.phone}>
          {phone}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.callButton}
        onPress={onCall}
      >
        <Text style={styles.callText}>
          CALL
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    fontSize: 22,
  },

  name: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "bold",
  },

  relationship: {
    color: "#6B7280",
    marginTop: 2,
  },

  phone: {
    color: "#374151",
    marginTop: 3,
  },

  callButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  callText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});