import React, { useEffect, useState } from "react";

<<<<<<< Updated upstream
=======
import React, { useEffect, useRef, useState } from "react";

>>>>>>> Stashed changes
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
<<<<<<< Updated upstream
=======

import { Accelerometer } from "expo-sensors";
import { useRouter } from "expo-router";
>>>>>>> Stashed changes

import {
  Accelerometer,
} from "expo-sensors";

export default function SensorScreen() {
<<<<<<< Updated upstream
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
=======
  const router = useRouter();

  const [data, setData] = useState<SensorData>(EMPTY_DATA);
  const [movement, setMovement] = useState("Not Monitoring");
  const [monitoring, setMonitoring] = useState(false);
  const [sensorAvailable, setSensorAvailable] = useState(true);
  const [impactCount, setImpactCount] = useState(0);
  const [lastImpact, setLastImpact] = useState("None");
  const [acceleration, setAcceleration] = useState(0);
>>>>>>> Stashed changes

  const [movement, setMovement] =
    useState("Normal");

  const [monitoring, setMonitoring] =
    useState(false);

  useEffect(() => {
<<<<<<< Updated upstream
    if (!monitoring) {
=======
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

  // Remove the sensor listener
  function removeSubscription() {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
  }

  // Stop monitoring completely
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

  // BACK BUTTON FUNCTION
  function handleBack() {
    stopMonitoring();
    router.back();
  }

  // Start monitoring
  async function startMonitoring() {
    if (monitoringRef.current || startingRef.current) {
>>>>>>> Stashed changes
      return;
    }

    Accelerometer.setUpdateInterval(500);

    const subscription =
      Accelerometer.addListener((value) => {
        setData(value);

        const totalMovement =
          Math.abs(value.x) +
          Math.abs(value.y) +
          Math.abs(value.z);

        if (totalMovement > 3.5) {
          setMovement("High Movement");
        } else if (totalMovement > 2) {
          setMovement("Movement Detected");
        } else {
          setMovement("Normal");
        }
      });

    return () => {
      subscription.remove();
    };
  }, [monitoring]);

  return (
<<<<<<< Updated upstream
    <View style={styles.container}>
      <Text style={styles.title}>
        📳 Motion Monitor
      </Text>

      <Text style={styles.description}>
        The motion sensor monitors movement of the
        device and can provide additional information
        during an emergency.
      </Text>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>
          CURRENT MOVEMENT
        </Text>

        <Text style={styles.status}>
          {movement}
        </Text>
      </View>

      <View style={styles.sensorCard}>
        <SensorValue
          label="X AXIS"
          value={data.x}
        />

        <SensorValue
          label="Y AXIS"
          value={data.y}
        />

        <SensorValue
          label="Z AXIS"
          value={data.z}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          monitoring && styles.stopButton,
        ]}
        onPress={() => setMonitoring(!monitoring)}
      >
        <Text style={styles.buttonText}>
          {monitoring
            ? "Stop Monitoring"
            : "Start Motion Monitoring"}
        </Text>
      </TouchableOpacity>
=======
    <View style={styles.screen}>

      {/* BACK BUTTON HEADER */}
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

      {/* ORIGINAL MOTION MONITOR CONTENT */}
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
>>>>>>> Stashed changes
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

  // BACK BUTTON HEADER
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
    padding: 20,
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
    color: "#16A34A",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 8,
  },

  sensorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 15,
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
});