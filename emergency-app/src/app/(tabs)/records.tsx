
import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import {
  type Incident,
  getIncidents,
  deleteIncident,
} from "../../services/IncidentStorage";

export default function RecordsScreen() {
  const [records, setRecords] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getIncidents();
      setRecords(data);
    } catch (error) {
      console.error("Unable to load records:", error);

      if (Platform.OS === "web") {
        window.alert("Unable to load incident records.");
      } else {
        Alert.alert("Error", "Unable to load incident records.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords])
  );

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatTime(date: string) {
    return new Date(date).toLocaleTimeString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  async function removeRecord(id: string) {
    if (deleting) return;

    try {
      setDeleting(true);

      await deleteIncident(id);
      setSelected(null);
      await loadRecords();

      if (Platform.OS === "web") {
        window.alert("Incident record deleted successfully.");
      } else {
        Alert.alert(
          "Deleted",
          "Incident record deleted successfully."
        );
      }
    } catch (error) {
      console.error("Delete error:", error);

      if (Platform.OS === "web") {
        window.alert("Unable to delete the record.");
      } else {
        Alert.alert("Error", "Unable to delete the record.");
      }
    } finally {
      setDeleting(false);
    }
  }

  function confirmDelete(id: string) {
    if (Platform.OS === "web") {
      if (window.confirm("Delete this incident record?")) {
        removeRecord(id);
      }
      return;
    }

    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this incident?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeRecord(id),
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)/dashboard")}
        >
          <Text style={styles.backText}>
            ← Back to Dashboard
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.smallTitle}>
          COMMUNITY RESPONSE
        </Text>

        <Text style={styles.title}>
          📁 Incident Records
        </Text>

        <Text style={styles.subtitle}>
          Review your saved emergency evidence
        </Text>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {records.length}
          </Text>

          <View>
            <Text style={styles.summaryTitle}>
              Saved Incidents
            </Text>

            <Text style={styles.summaryDescription}>
              Stored on this device
            </Text>
          </View>
        </View>

        {/* Records */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#B91C1C"
            style={styles.loader}
          />
        ) : records.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📂</Text>

            <Text style={styles.emptyTitle}>
              No Incident Records Yet
            </Text>

            <Text style={styles.emptyDescription}>
              Capture emergency evidence to create
              your first incident record.
            </Text>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => router.push("/(tabs)/camera")}
            >
              <Text style={styles.captureText}>
                📷 Capture Evidence
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          records.map((incident, index) => (
            <View
              key={incident.id}
              style={styles.recordCard}
            >
              {/* Record Header */}
              <View style={styles.recordHeader}>
                <Text style={styles.recordTitle}>
                  Incident #
                  {String(
                    records.length - index
                  ).padStart(3, "0")}
                </Text>

                <View style={styles.savedBadge}>
                  <Text style={styles.savedText}>
                    SAVED
                  </Text>
                </View>
              </View>

              {/* Evidence Photo */}
              <Image
                source={{ uri: incident.photoUri }}
                style={styles.recordImage}
                resizeMode="cover"
              />

              {/* Date */}
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📅</Text>

                <Text style={styles.detailText}>
                  {formatDate(incident.date)}
                </Text>
              </View>

              {/* Time */}
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>🕒</Text>

                <Text style={styles.detailText}>
                  {formatTime(incident.date)}
                </Text>
              </View>

              {/* Location */}
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📍</Text>

                <Text style={styles.detailText}>
                  {incident.locationName ||
                    "Location unavailable"}
                </Text>
              </View>

              {/* Description */}
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📝</Text>

                <Text style={styles.detailText}>
                  {incident.description}
                </Text>
              </View>

              {/* View Evidence */}
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => setSelected(incident)}
              >
                <Text style={styles.viewText}>
                  👁️ View Evidence
                </Text>
              </TouchableOpacity>

              {/* Delete Record */}
              <TouchableOpacity
                style={styles.deleteButton}
                disabled={deleting}
                onPress={() => confirmDelete(incident.id)}
              >
                <Text style={styles.deleteText}>
                  🗑️ Delete Record
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Full Evidence Preview */}
      <Modal
        visible={selected !== null}
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <ScrollView
          style={styles.modalContainer}
          contentContainerStyle={styles.modalContent}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelected(null)}
          >
            <Text style={styles.backText}>
              ← Back to Records
            </Text>
          </TouchableOpacity>

          {selected && (
            <>
              <Text style={styles.modalTitle}>
                Incident Evidence
              </Text>

              <Image
                source={{ uri: selected.photoUri }}
                style={styles.fullImage}
                resizeMode="contain"
              />

              <View style={styles.modalDetails}>
                <Text style={styles.modalLabel}>
                  DATE
                </Text>

                <Text style={styles.modalValue}>
                  {formatDate(selected.date)}
                </Text>

                <Text style={styles.modalLabel}>
                  TIME
                </Text>

                <Text style={styles.modalValue}>
                  {formatTime(selected.date)}
                </Text>

                <Text style={styles.modalLabel}>
                  LOCATION
                </Text>

                <Text style={styles.modalValue}>
                  {selected.locationName ||
                    "Location unavailable"}
                </Text>

                {selected.latitude != null &&
                  selected.longitude != null && (
                    <Text style={styles.coordinates}>
                      GPS: {selected.latitude.toFixed(6)},{" "}
                      {selected.longitude.toFixed(6)}
                    </Text>
                  )}

                <Text style={styles.modalLabel}>
                  INCIDENT DESCRIPTION
                </Text>

                <Text style={styles.modalValue}>
                  {selected.description}
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 50,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },

  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 22,
  },

  backText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "bold",
  },

  smallTitle: {
    color: "#B91C1C",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 10,
  },

  subtitle: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 8,
    marginBottom: 24,
  },

  summaryCard: {
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  summaryNumber: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#B91C1C",
    marginRight: 18,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#991B1B",
  },

  summaryDescription: {
    fontSize: 12,
    color: "#7F1D1D",
    marginTop: 4,
  },

  loader: {
    marginTop: 40,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  emptyEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
    textAlign: "center",
  },

  emptyDescription: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 20,
  },

  captureButton: {
    backgroundColor: "#B91C1C",
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderRadius: 12,
  },

  captureText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  recordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },

  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  recordTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
  },

  savedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },

  savedText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#15803D",
  },

  recordImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    marginBottom: 18,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  detailIcon: {
    fontSize: 17,
    marginRight: 12,
  },

  detailText: {
    flex: 1,
    color: "#334155",
    fontSize: 13,
    lineHeight: 20,
  },

  viewButton: {
    backgroundColor: "#B91C1C",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },

  viewText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  deleteButton: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },

  deleteText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  modalContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 50,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 20,
  },

  fullImage: {
    width: "100%",
    height: 350,
    backgroundColor: "#0F172A",
    borderRadius: 14,
  },

  modalDetails: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },

  modalLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#B91C1C",
    letterSpacing: 1,
    marginTop: 15,
    marginBottom: 7,
  },

  modalValue: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
  },

  coordinates: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 7,
  },
});
