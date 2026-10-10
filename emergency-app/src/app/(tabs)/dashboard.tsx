
import React, { useEffect, useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { getUser } from "../../services/emergencyStorage";

import BackButton from "../../components/BackButton";
import EmergencyButton from "../../components/EmergencyButton";
import EmergencyContact from "../../components/EmergencyContact";
import EvidenceCard from "../../components/EvidenceCard";
import LocationCard from "../../components/LocationCard";
import StatusCard from "../../components/StatusCard";

export default function DashboardScreen() {
  const { username } = useLocalSearchParams<{
    username?: string;
  }>();

  const [displayName, setDisplayName] = useState(
    username || "User"
  );

  useEffect(() => {
    async function loadUser() {
      try {
        const savedUser = await getUser();

        if (savedUser?.name) {
          setDisplayName(savedUser.name);
        }
      } catch (error) {
        console.error("Unable to load user:", error);
      }
    }

    loadUser();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <BackButton toWelcome />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.smallTitle}>
              COMMUNITY RESPONSE
            </Text>

            <Text style={styles.greeting}>
              Welcome, {displayName}!
            </Text>

            <Text style={styles.title}>
              Emergency Dashboard
            </Text>

            <Text style={styles.subtitle}>
              Your safety information in one place.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.icon}>🚨</Text>
          </View>
        </View>

        {/* Safety Banner */}
        <View style={styles.safetyBanner}>
          <View style={styles.safetyIcon}>
            <Text style={styles.safetyEmoji}>
              🛡️
            </Text>
          </View>

          <View style={styles.safetyContent}>
            <Text style={styles.safetyTitle}>
              Stay Safe & Prepared
            </Text>

            <Text style={styles.safetyDescription}>
              Your emergency tools and information
              are available below.
            </Text>
          </View>
        </View>

        {/* Quick Access */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Quick Access
          </Text>

          <Text style={styles.sectionSubtitle}>
            Access your emergency tools
          </Text>
        </View>

        <View style={styles.quickAccessGrid}>
          {/* Location */}
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push("/(tabs)/location")
            }
          >
            <View
              style={[
                styles.quickIcon,
                { backgroundColor: "#DBEAFE" },
              ]}
            >
              <Text style={styles.quickEmoji}>
                📍
              </Text>
            </View>

            <Text style={styles.quickTitle}>
              Location
            </Text>

            <Text style={styles.quickDescription}>
              View your current location
            </Text>
          </TouchableOpacity>

          {/* Evidence */}
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push("/(tabs)/camera")
            }
          >
            <View
              style={[
                styles.quickIcon,
                { backgroundColor: "#FCE7F3" },
              ]}
            >
              <Text style={styles.quickEmoji}>
                📷
              </Text>
            </View>

            <Text style={styles.quickTitle}>
              Evidence
            </Text>

            <Text style={styles.quickDescription}>
              Capture emergency evidence
            </Text>
          </TouchableOpacity>

          {/* Sensors */}
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push("/(tabs)/sensor")
            }
          >
            <View
              style={[
                styles.quickIcon,
                { backgroundColor: "#FEF3C7" },
              ]}
            >
              <Text style={styles.quickEmoji}>
                📱
              </Text>
            </View>

            <Text style={styles.quickTitle}>
              Sensors
            </Text>

            <Text style={styles.quickDescription}>
              Monitor device movement
            </Text>
          </TouchableOpacity>

          {/* Incident Records - Updated Explore */}
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.8}
            onPress={(): void =>
              router.push("/(tabs)/records" as any)
            }
          >
            <View
              style={[
                styles.quickIcon,
                { backgroundColor: "#DCFCE7" },
              ]}
            >
              <Text style={styles.quickEmoji}>
                📁
              </Text>
            </View>

            <Text style={styles.quickTitle}>
              Incident Records
            </Text>

            <Text style={styles.quickDescription}>
              View saved evidence and incident details
            </Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Assistance */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Emergency Assistance
          </Text>

          <Text style={styles.sectionSubtitle}>
            Get help quickly when you need it.
          </Text>
        </View>

        {/* Safety Status */}
        <View style={styles.emergencyStatusCard}>
          <View style={styles.emergencyStatusHeader}>
            <Text style={styles.emergencyStatusIcon}>
              🛡️
            </Text>

            <View style={styles.emergencyStatusInfo}>
              <Text style={styles.emergencyStatusTitle}>
                Your Safety Status
              </Text>

              <Text style={styles.emergencyStatusSubtitle}>
                Check your emergency information
              </Text>
            </View>
          </View>

          <StatusCard />
        </View>

        {/* SOS */}
        <View style={styles.sosCard}>
          <Text style={styles.sosTitle}>
            🚨 Need Emergency Help?
          </Text>

          <Text style={styles.sosDescription}>
            Use the emergency button below
            if you need urgent assistance.
          </Text>

          <EmergencyButton />

          <View style={styles.emergencyNotice}>
            <Text style={styles.emergencyNoticeText}>
              For immediate danger, call 911.
            </Text>
          </View>
        </View>

        {/* Your Information */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Your Information
          </Text>

          <Text style={styles.sectionSubtitle}>
            Emergency details and records
          </Text>
        </View>

        <LocationCard />
        <EmergencyContact />
        <EvidenceCard />

        {/* Emergency Reminder */}
        <View style={styles.reminder}>
          <Text style={styles.reminderEmoji}>
            🚨
          </Text>

          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>
              Emergency Reminder
            </Text>

            <Text style={styles.reminderText}>
              If you are in immediate danger,
              contact local emergency services.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          COMMUNITY RESPONSE • SAFETY FIRST
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 45,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  headerText: {
    flex: 1,
    paddingRight: 10,
  },

  smallTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#B91C1C",
    letterSpacing: 1.3,
  },

  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 10,
  },

  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#334155",
    marginTop: 5,
  },

  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6,
  },

  headerIcon: {
    width: 55,
    height: 55,
    borderRadius: 17,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 28,
  },

  safetyBanner: {
    backgroundColor: "#B91C1C",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  safetyIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  safetyEmoji: {
    fontSize: 24,
  },

  safetyContent: {
    flex: 1,
  },

  safetyTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  safetyDescription: {
    color: "#FEE2E2",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },

  sectionHeader: {
    marginTop: 15,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
  },

  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 13,
    marginBottom: 18,
  },

  quickCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 17,
    minHeight: 155,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },

  quickIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  quickEmoji: {
    fontSize: 23,
  },

  quickTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 5,
  },

  quickDescription: {
    fontSize: 11,
    color: "#64748B",
    lineHeight: 17,
  },

  emergencyStatusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  emergencyStatusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  emergencyStatusIcon: {
    fontSize: 27,
    marginRight: 12,
  },

  emergencyStatusInfo: {
    flex: 1,
  },

  emergencyStatusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
  },

  emergencyStatusSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  sosCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 15,
  },

  sosTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#991B1B",
    textAlign: "center",
    marginBottom: 10,
  },

  sosDescription: {
    fontSize: 13,
    color: "#7F1D1D",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 18,
  },

  emergencyNotice: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginTop: 15,
  },

  emergencyNoticeText: {
    fontSize: 12,
    color: "#991B1B",
    fontWeight: "600",
    textAlign: "center",
  },

  reminder: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 17,
    flexDirection: "row",
    marginTop: 25,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  reminderEmoji: {
    fontSize: 22,
    marginRight: 12,
  },

  reminderContent: {
    flex: 1,
  },

  reminderTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#991B1B",
    marginBottom: 6,
  },

  reminderText: {
    fontSize: 12,
    color: "#7F1D1D",
    lineHeight: 19,
  },

  footer: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 10,
    letterSpacing: 1.3,
    marginTop: 28,
  },
});
