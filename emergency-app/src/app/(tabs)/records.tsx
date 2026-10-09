import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import {
  getEvidenceRecords,
  deleteEvidence,
  type EvidenceRecord,
} from "../../services/emergencyStorage";

function formatDate(timestamp: string | null) {
  if (!timestamp) return "Capture time unavailable";

  const date = new Date(timestamp);

  return Number.isNaN(date.getTime())
    ? "Capture time unavailable"
    : date.toLocaleString();
}

export default function RecordsScreen() {
  const router = useRouter();

  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<EvidenceRecord | null>(null);

  const activeRef = useRef(false);
  const operationRef = useRef(false);
  const loadIdRef = useRef(0);

  useFocusEffect(
    useCallback(() => {
      activeRef.current = true;
      const loadId = ++loadIdRef.current;

      async function loadRecords() {
        setLoading(true);
        setError("");

        try {
          const savedRecords = await getEvidenceRecords();

          if (
            activeRef.current &&
            loadIdRef.current === loadId
          ) {
            setRecords(savedRecords);
          }
        } catch {
          if (
            activeRef.current &&
            loadIdRef.current === loadId
          ) {
            setError(
              "Unable to load saved evidence. Please try again."
            );
          }
        } finally {
          if (
            activeRef.current &&
            loadIdRef.current === loadId
          ) {
            setLoading(false);
          }
        }
      }

      void loadRecords();

      return () => {
        activeRef.current = false;
        loadIdRef.current += 1;
      };
    }, [])
  );

  const refreshRecords = async () => {
    if (operationRef.current || loading) return;

    operationRef.current = true;
    const loadId = ++loadIdRef.current;

    setRefreshing(true);
    setError("");

    try {
      const savedRecords = await getEvidenceRecords();

      if (
        activeRef.current &&
        loadIdRef.current === loadId
      ) {
        setRecords(savedRecords);
      }
    } catch {
      if (
        activeRef.current &&
        loadIdRef.current === loadId
      ) {
        setError(
          "Unable to refresh saved evidence. Please try again."
        );
      }
    } finally {
      operationRef.current = false;

      if (activeRef.current) {
        setRefreshing(false);
      }
    }
  };

  const removeEvidence = async (record: EvidenceRecord) => {
    if (operationRef.current || !activeRef.current) return;

    operationRef.current = true;
    loadIdRef.current += 1;

    setDeletingId(record.id);
    setError("");

    try {
      await deleteEvidence(record.id);

      if (activeRef.current) {
        setRecords((current) =>
          current.filter((item) => item.id !== record.id)
        );

        setSelected((current) =>
          current?.id === record.id ? null : current
        );
      }
    } catch {
      if (activeRef.current) {
        setError("Unable to delete evidence. Please try again.");
      }
    } finally {
      operationRef.current = false;

      if (activeRef.current) {
        setDeletingId(null);
      }
    }
  };

  const confirmDelete = (record: EvidenceRecord) => {
    if (operationRef.current || loading) return;

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Delete this evidence? This cannot be undone."
      );

      if (confirmed) {
        void removeEvidence(record);
      }

      return;
    }

    Alert.alert(
      "Delete Evidence",
      "Delete this evidence? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => void removeEvidence(record),
        },
      ]
    );
  };

  const busy = refreshing || deletingId !== null;

  const handleBack = () => {
    if (operationRef.current) return;

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/dashboard");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
            busy && styles.disabledButton,
          ]}
          onPress={handleBack}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.heading}>
        <Text style={styles.title}>📁 Incident Records</Text>

        <Text style={styles.subtitle}>
          Review your saved emergency evidence
        </Text>

        {!loading && (
          <Text style={styles.countText}>
            {records.length} saved{" "}
            {records.length === 1 ? "photo" : "photos"}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.refreshButton,
            (loading || busy) && styles.disabledButton,
          ]}
          onPress={refreshRecords}
          disabled={loading || busy}
          accessibilityRole="button"
          accessibilityState={{
            disabled: loading || busy,
            busy: refreshing,
          }}
        >
          <Text style={styles.buttonText}>
            {refreshing ? "Refreshing..." : "↻ Refresh Records"}
          </Text>
        </TouchableOpacity>

        {!!error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B91C1C" />

          <Text style={styles.subtitle}>
            Loading saved evidence...
          </Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshRecords}
              enabled={!busy}
              tintColor="#B91C1C"
              colors={["#B91C1C"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                {error
                  ? "Records unavailable"
                  : "No saved evidence yet"}
              </Text>

              <Text style={styles.subtitle}>
                {error
                  ? "Tap Refresh Records to try again."
                  : "Capture a photo on the Camera page. Successfully saved photos will appear here."}
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.recordTitle}>
                Evidence #
                {String(records.length - index).padStart(3, "0")}
              </Text>

              <Text style={styles.recordId}>
                ID: {item.id}
              </Text>

              <Image
                source={{ uri: item.uri }}
                style={styles.thumbnail}
                resizeMode="contain"
                accessibilityLabel="Saved emergency evidence"
              />

              <Text style={styles.label}>CAPTURE TIME</Text>

              <Text style={styles.date}>
                {formatDate(item.capturedAt)}
              </Text>

              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => setSelected(item)}
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>
                  View Evidence
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  busy && styles.disabledButton,
                ]}
                onPress={() => confirmDelete(item)}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel="Delete this evidence"
                accessibilityState={{ disabled: busy }}
              >
                <Text style={styles.deleteButtonText}>
                  {deletingId === item.id
                    ? "Deleting..."
                    : "Delete Evidence"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Modal
        visible={selected !== null}
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelected(null)}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>
              ← Close Preview
            </Text>
          </TouchableOpacity>

          {selected && (
            <>
              <Image
                source={{ uri: selected.uri }}
                style={styles.fullImage}
                resizeMode="contain"
                accessibilityLabel="Full saved evidence preview"
              />

              <Text style={styles.previewDate}>
                {formatDate(selected.capturedAt)}
              </Text>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: "flex-start",
  },

  backButton: {
    backgroundColor: "#FFE2E2",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 12,
  },

  backButtonText: {
    color: "#C5161D",
    fontSize: 14,
    fontWeight: "bold",
  },

  heading: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    alignItems: "center",
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
  },

  countText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 10,
  },

  refreshButton: {
    backgroundColor: "#B91C1C",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 15,
    marginBottom: 18,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },

  recordTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  recordId: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 5,
    marginBottom: 12,
  },

  thumbnail: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },

  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6B7280",
    marginTop: 15,
  },

  date: {
    color: "#111827",
    fontSize: 14,
    marginTop: 5,
  },

  viewButton: {
    backgroundColor: "#B91C1C",
    padding: 14,
    borderRadius: 10,
    marginTop: 18,
  },

  deleteButton: {
    backgroundColor: "#FEE2E2",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },

  deleteButtonText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 15,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    marginTop: 20,
  },

  emptyTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  errorText: {
    color: "#DC2626",
    textAlign: "center",
    marginTop: 12,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 20,
    paddingTop: 50,
  },

  closeButton: {
    backgroundColor: "#B91C1C",
    padding: 14,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  fullImage: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },

  previewDate: {
    color: "#FFFFFF",
    textAlign: "center",
    paddingVertical: 20,
  },
});