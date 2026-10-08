import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {
  Accelerometer,
} from "expo-sensors";

export default function SensorScreen() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [movement, setMovement] =
    useState("Normal");

  const [monitoring, setMonitoring] =
    useState(false);

  useEffect(() => {
    if (!monitoring) {
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