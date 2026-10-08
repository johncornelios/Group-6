import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import EmergencyButton from "../../components/EmergencyButton";
import EmergencyContact from "../../components/EmergencyContact";
import EvidenceCard from "../../components/EvidenceCard";
import LocationCard from "../../components/LocationCard";
import StatusCard from "../../components/StatusCard";

export default function DashboardScreen() {
  return (
    <ScrollView     
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.smallTitle}>
            COMMUNITY RESPONSE
          </Text>

          <Text style={styles.title}>
            Emergency Dashboard
          </Text>
        </View>

        <Text style={styles.icon}>🚨</Text>
      </View>

      <StatusCard />

      <EmergencyButton />

      <LocationCard />

      <EmergencyContact />

      <EvidenceCard />

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/(tabs)/location" as any)}
        >
          <Text style={styles.secondaryText}>📍 Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/(tabs)/camera" as any)}
        >
          <Text style={styles.secondaryText}>📷 Evidence</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  content: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  smallTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#B91C1C",
    letterSpacing: 1,
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },

  icon: {
    fontSize: 35,
  },

  buttons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    elevation: 2,
  },

  secondaryText: {
    color: "#374151",
    fontWeight: "bold",
  },
});