
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  AppState,
} from "react-native";

import { Accelerometer } from "expo-sensors";
import { useRouter } from "expo-router";

type SensorData = {
  x: number;
  y: number;
  z: number;
};

const EMPTY_DATA: SensorData = {
  x: 0,
  y: 0,
  z: 0,
};

export default function SensorScreen() {
  const router = useRouter();

  const [data, setData] = useState<SensorData>(EMPTY_DATA);
  const [movement, setMovement] = useState("Not Monitoring");
  const [monitoring, setMonitoring] = useState(false);
  const [sensorAvailable, setSensorAvailable] = useState(false);
  const [impactCount, setImpactCount] = useState(0);
  const [lastImpact, setLastImpact] = useState("None");
  const [acceleration, setAcceleration] = useState(0);

  const subscriptionRef = useRef<ReturnType<
    typeof Accelerometer.addListener
  > | null>(null);

  const monitoringRef = useRef(false);
  const previousMagnitude = useRef<number | null>(null);
  const lastImpactTime = useRef(0);
  const movementRef = useRef("Not Monitoring");
  const startingRef = useRef(false);

  // Check if the device supports motion sensors
  useEffect(() => {
    let active = true;

    async function checkSensor() {
      try {
        const available = await Accelerometer.isAvailableAsync();

        if (active) {
          setSensorAvailable(available);
        }
      } catch {
        if (active) {
          setSensorAvailable(false);
        }
      }
    }

    if (Platform.OS !== "web") {
      checkSensor();
    } else {
      setSensorAvailable(false);
    }

    return () => {
      active = false;
    };
  }, []);

  // Remove sensor listener
  function removeSubscription() {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
  }

  // Stop monitoring
  function stopMonitoring() {
    monitoringRef.current = false;
    startingRef.current = false;

    removeSubscription();

    setMonitoring(false);
    setMovement("Not Monitoring");
    setAcceleration(0);
    setData({ x: 0, y: 0, z: 0 });

    previousMagnitude.current = null;
    movementRef.current = "Not Monitoring";
  }

  // Back button from Yamson's enhancement
  function handleBack() {
    stopMonitoring();
    router.back();
  }

  // Start motion monitoring
  async function startMonitoring() {
    if (monitoringRef.current || startingRef.current) {
      return;
    }

    if (Platform.OS === "web") {
      Alert.alert(
        "Sensor Unavailable",
        "Please use Expo Go on your phone."
      );
      return;
    }

    startingRef.current = true;

    try {
      const available = await Accelerometer.isAvailableAsync();

      if (!available) {
        setSensorAvailable(false);
        Alert.alert(
          "Sensor Unavailable",
          "This device does not support the accelerometer."
        );
        return;
      }

      if (!startingRef.current) return;

      removeSubscription();

      previousMagnitude.current = null;
      movementRef.current = "Normal";
      lastImpactTime.current = 0;

      Accelerometer.setUpdateInterval(100);

      monitoringRef.current = true;
      setMonitoring(true);
      setMovement("Normal");
      setSensorAvailable(true);

      const subscription = Accelerometer.addListener((value) => {
        if (!monitoringRef.current) return;

        setData({
          x: value.x,
          y: value.y,
          z: value.z,
        });

        // Calculate acceleration magnitude
        const magnitude = Math.sqrt(
          value.x * value.x +
          value.y * value.y +
          value.z * value.z
        );

        const previous = previousMagnitude.current;

        const change =
          previous === null
            ? 0
            : Math.abs(magnitude - previous);

        previousMagnitude.current = magnitude;
        setAcceleration(change);

        let newMovement = "Normal";

        if (change > 1.5 || magnitude > 3) {
          newMovement = "Sudden Impact";
        } else if (change > 0.5) {
          newMovement = "High Movement";
        } else if (change > 0.15) {
          newMovement = "Movement Detected";
        }

        if (newMovement !== movementRef.current) {
          movementRef.current = newMovement;
          setMovement(newMovement);
        }

        // Count impacts with a 3-second cooldown
        const now = Date.now();

        if (
          newMovement === "Sudden Impact" &&
          now - lastImpactTime.current > 3000
        ) {
          lastImpactTime.current = now;
          setImpactCount((count) => count + 1);
          setLastImpact(new Date().toLocaleTimeString());
        }
      });

      subscriptionRef.current = subscription;
    } catch (error) {
      console.error("Sensor error:", error);
      stopMonitoring();

      Alert.alert(
        "Sensor Error",
        "Unable to start motion monitoring."
      );
    } finally {
      startingRef.current = false;
    }
  }

  // Toggle monitoring
  function toggleMonitoring() {
    if (monitoringRef.current || startingRef.current) {
      stopMonitoring();
    } else {
      startMonitoring();
    }
  }

  // Remove listener when screen unmounts
  useEffect(() => {
    return () => {
      monitoringRef.current = false;
      startingRef.current = false;
      removeSubscription();
    };
  }, []);

  // Stop monitoring when app enters background
  useEffect(() => {
    const listener = AppState.addEventListener(
      "change",
      (state) => {
        if (state !== "active" && monitoringRef.current) {
          stopMonitoring();
        }
      }
    );

    return () => listener.remove();
  }, []);

  // Reset impact records
  function resetRecords() {
    setImpactCount(0);
    setLastImpact("None");
    lastImpactTime.current = 0;

    Alert.alert(
      "Records Reset",
      "Motion impact records have been cleared."
    );
  }

  // Movement status color
  function getStatusColor() {
    if (!monitoring) return "#6B7280";

    if (movement === "Sudden Impact") return "#DC2626";
    if (movement === "High Movement") return "#EA580C";
    if (movement === "Movement Detected") return "#D97706";

    return "#16A34A";
  }

  return (
    <View style={styles.screen}>
      {/* Back Button Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>
            ← Back
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>
          📳 Motion Monitor
        </Text>

        <Text style={styles.description}>
          The motion sensor monitors device movement
          and detects sudden acceleration changes that
          may be useful during an emergency.
        </Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>
            CURRENT MOVEMENT
          </Text>

          <Text
            style={[
              styles.status,
              { color: getStatusColor() },
            ]}
          >
            {movement}
          </Text>

          <Text style={styles.monitoringText}>
            {monitoring
              ? "● Sensor Monitoring Active"
              : "○ Sensor Monitoring Inactive"}
          </Text>
        </View>

        {movement === "Sudden Impact" && monitoring && (
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>
              ⚠️ Sudden Impact Detected
            </Text>

            <Text style={styles.warningText}>
              A sudden acceleration change was detected.
              Please check your surroundings and make
              sure you are safe.
            </Text>
          </View>
        )}

        <View style={styles.sensorCard}>
          <Text style={styles.sectionTitle}>
            Live Sensor Readings
          </Text>

          <SensorValue label="X AXIS" value={data.x} />
          <SensorValue label="Y AXIS" value={data.y} />
          <SensorValue label="Z AXIS" value={data.z} />

          <SensorValue
            label="MOTION CHANGE"
            value={acceleration}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>
            Motion Information
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Sensor Status
            </Text>

            <Text
              style={{
                color: sensorAvailable
                  ? "#16A34A"
                  : "#DC2626",
                fontWeight: "bold",
              }}
            >
              {sensorAvailable ? "Available" : "Unavailable"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Update Interval
            </Text>

            <Text style={styles.infoValue}>
              100 ms
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Impact Count
            </Text>

            <Text style={styles.infoValue}>
              {impactCount}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Last Impact
            </Text>

            <Text style={styles.infoValue}>
              {lastImpact}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            monitoring && styles.stopButton,
          ]}
          onPress={toggleMonitoring}
          disabled={!sensorAvailable && !monitoring}
        >
          <Text style={styles.buttonText}>
            {monitoring
              ? "Stop Monitoring"
              : "Start Motion Monitoring"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetRecords}
        >
          <Text style={styles.resetButtonText}>
            Reset Impact Records
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Motion detection is for additional safety
          information only. It cannot confirm an
          emergency or medical fall.
        </Text>
      </ScrollView>
    </View>
  );
}

function SensorValue({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View style={styles.valueBox}>
      <Text style={styles.valueLabel}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    width: "100%",
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "flex-start",
  },

  backButton: {
    backgroundColor: "#FFE2E2",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    color: "#C5161D",
    fontSize: 14,
    fontWeight: "bold",
  },

  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#111827",
  },

  description: {
    color: "#6B7280",
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 25,
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },

  statusLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "bold",
  },

  status: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 8,
  },

  monitoringText: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 10,
  },

  warningCard: {
    backgroundColor: "#FEE2E2",
    padding: 18,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },

  warningTitle: {
    color: "#B91C1C",
    fontSize: 16,
    fontWeight: "bold",
  },

  warningText: {
    color: "#991B1B",
    marginTop: 8,
    lineHeight: 20,
  },

  sensorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 15,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },

  valueBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  valueLabel: {
    color: "#6B7280",
    fontWeight: "bold",
  },

  value: {
    fontWeight: "bold",
    color: "#111827",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 15,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
  },

  infoLabel: {
    color: "#6B7280",
  },

  infoValue: {
    color: "#111827",
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#B91C1C",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  stopButton: {
    backgroundColor: "#374151",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  resetButton: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  resetButtonText: {
    color: "#374151",
    fontWeight: "bold",
  },

  footer: {
    color: "#9CA3AF",
    textAlign: "center",
    fontSize: 12,
    marginTop: 20,
    lineHeight: 18,
  },
});
