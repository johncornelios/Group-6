import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

import type {
  EmergencyContact as Contact,
  EmergencyData,
} from "../services/emergencyService";

const STORAGE_KEY = "@emergency_contacts";

async function readData(): Promise<EmergencyData> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) return {};

  const parsed: unknown = JSON.parse(raw);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed)
  ) {
    throw new Error("Unable to read emergency contacts.");
  }

  const data = parsed as EmergencyData;

  if (data.contacts !== undefined && !Array.isArray(data.contacts)) {
    throw new Error("Unable to read emergency contacts.");
  }

  return data;
}

export default function EmergencyContact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const activeRef = useRef(false);
  const writingRef = useRef(false);
  const loadRef = useRef(0);

  const busy = saving || deletingId !== null;

  useFocusEffect(
    useCallback(() => {
      activeRef.current = true;
      const loadId = ++loadRef.current;

      async function loadContacts() {
        setLoading(true);
        setError("");

        try {
          const data = await readData();

          if (
            activeRef.current &&
            loadRef.current === loadId
          ) {
            setContacts(data.contacts ?? []);
          }
        } catch {
          if (
            activeRef.current &&
            loadRef.current === loadId
          ) {
            setError("Unable to load contacts. Please try again.");
          }
        } finally {
          if (
            activeRef.current &&
            loadRef.current === loadId
          ) {
            setLoading(false);
          }
        }
      }

      void loadContacts();

      return () => {
        activeRef.current = false;
        loadRef.current += 1;
      };
    }, [])
  );

  const openForm = (contact?: Contact) => {
    if (loading || writingRef.current) return;

    setEditingId(contact?.id ?? null);
    setName(contact?.name ?? "");
    setPhone(contact?.phone ?? "");
    setRelationship(contact?.relationship ?? "");
    setFormError("");
    setVisible(true);
  };

  const closeForm = () => {
    if (writingRef.current) return;
    setVisible(false);
  };

  const saveContact = async () => {
    if (writingRef.current) return;

    const cleanName = name.trim();
    const cleanPhone = phone.trim().replace(/[\s().-]/g, "");

    if (!cleanName) {
      setFormError("Please enter your contact's name.");
      return;
    }

    if (!/^\+?\d{7,15}$/.test(cleanPhone)) {
      setFormError(
        "Enter a valid phone number, such as 09171234567 or +639171234567."
      );
      return;
    }

    writingRef.current = true;
    loadRef.current += 1;
    setSaving(true);
    setFormError("");

    try {
      const existing = await readData();
      const currentContacts = existing.contacts ?? [];

      if (
        editingId &&
        !currentContacts.some((item) => item.id === editingId)
      ) {
        throw new Error(
          "This contact is no longer available. Close the form and try again."
        );
      }

      const updatedContact: Contact = {
        id:
          editingId ??
          `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        name: cleanName,
        phone: cleanPhone,
        relationship: relationship.trim() || undefined,
      };

      const nextContacts = editingId
        ? currentContacts.map((item) =>
            item.id === editingId ? updatedContact : item
          )
        : [...currentContacts, updatedContact];

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...existing,
          contacts: nextContacts,
        })
      );

      if (activeRef.current) {
        setContacts(nextContacts);
        setError("");
        setVisible(false);
      }
    } catch (err) {
      if (activeRef.current) {
        setFormError(
          err instanceof Error
            ? err.message
            : "Unable to save your contact. Please try again."
        );
      }
    } finally {
      writingRef.current = false;

      if (activeRef.current) {
        setSaving(false);
      }
    }
  };

  const removeContact = async (contact: Contact) => {
    if (writingRef.current || !activeRef.current) return;

    writingRef.current = true;
    loadRef.current += 1;
    setDeletingId(contact.id);
    setError("");

    try {
      const existing = await readData();
      const nextContacts = (existing.contacts ?? []).filter(
        (item) => item.id !== contact.id
      );

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...existing,
          contacts: nextContacts,
        })
      );

      if (activeRef.current) {
        setContacts(nextContacts);
      }
    } catch {
      if (activeRef.current) {
        setError("Unable to delete the contact. Please try again.");
      }
    } finally {
      writingRef.current = false;

      if (activeRef.current) {
        setDeletingId(null);
      }
    }
  };

  const confirmDelete = (contact: Contact) => {
    if (writingRef.current || loading) return;

    const message =
      `Remove ${contact.name} from your emergency contacts?`;

    if (Platform.OS === "web") {
      if (window.confirm(message)) {
        void removeContact(contact);
      }

      return;
    }

    Alert.alert("Delete Contact", message, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => void removeContact(contact),
      },
    ]);
  };

  const callContact = async (contact: Contact) => {
    setError("");

    try {
      await Linking.openURL(`tel:${contact.phone}`);
    } catch {
      if (activeRef.current) {
        setError(
          "Unable to open a calling app. You can dial the displayed number manually."
        );
      }
    }
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>👥</Text>

          <View style={styles.headerInfo}>
            <Text style={styles.label}>EMERGENCY CONTACTS</Text>

            <Text style={styles.title}>
              Trusted People
            </Text>

            <Text style={styles.description}>
              People you can contact during an emergency.
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            color="#B91C1C"
          />
        ) : contacts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {error ? "Contacts unavailable" : "No contact added"}
            </Text>

            <Text style={styles.description}>
              Add a family member, friend, or trusted person.
            </Text>
          </View>
        ) : (
          contacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <Text style={styles.contactName}>
                {contact.name}
              </Text>

              <Text style={styles.phone}>
                {contact.phone}
              </Text>

              {!!contact.relationship && (
                <Text style={styles.description}>
                  {contact.relationship}
                </Text>
              )}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.callButton]}
                  onPress={() => void callContact(contact)}
                  accessibilityRole="button"
                  accessibilityLabel={`Call ${contact.name}`}
                >
                  <Text style={styles.whiteText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.editButton,
                    busy && styles.disabled,
                  ]}
                  onPress={() => openForm(contact)}
                  disabled={busy}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${contact.name}`}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.deleteButton,
                    busy && styles.disabled,
                  ]}
                  onPress={() => confirmDelete(contact)}
                  disabled={busy}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${contact.name}`}
                >
                  <Text style={styles.deleteText}>
                    {deletingId === contact.id
                      ? "Deleting..."
                      : "Delete"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {!!error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <TouchableOpacity
          style={[
            styles.addButton,
            (loading || busy) && styles.disabled,
          ]}
          onPress={() => openForm()}
          disabled={loading || busy}
          accessibilityRole="button"
        >
          <Text style={styles.whiteText}>
            + Add Emergency Contact
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeForm}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.form}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.formTitle}>
                {editingId
                  ? "Edit Emergency Contact"
                  : "Add Emergency Contact"}
              </Text>

              <Text style={styles.formDescription}>
                Enter the details of someone you trust.
              </Text>

              <Text style={styles.fieldLabel}>Full name</Text>

              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Contact's name"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                maxLength={100}
                editable={!saving}
                accessibilityLabel="Contact name"
              />

              <Text style={styles.fieldLabel}>
                Phone number
              </Text>

              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="09171234567"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={25}
                editable={!saving}
                accessibilityLabel="Contact phone number"
              />

              <Text style={styles.fieldLabel}>
                Relationship (optional)
              </Text>

              <TextInput
                style={styles.input}
                value={relationship}
                onChangeText={setRelationship}
                placeholder="Parent, sibling, friend..."
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                maxLength={60}
                editable={!saving}
                accessibilityLabel="Relationship"
              />

              {!!formError && (
                <Text style={styles.errorText}>
                  {formError}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  saving && styles.disabled,
                ]}
                onPress={saveContact}
                disabled={saving}
                accessibilityRole="button"
              >
                <Text style={styles.whiteText}>
                  {saving ? "Saving..." : "Save Contact"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeForm}
                disabled={saving}
                accessibilityRole="button"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 17,
    marginTop: 15,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#9CA3AF",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
    lineHeight: 18,
  },
  loader: {
    marginVertical: 20,
  },
  emptyState: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  contactCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  phone: {
    fontSize: 14,
    color: "#374151",
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 65,
  },
  callButton: {
    backgroundColor: "#B91C1C",
  },
  editButton: {
    backgroundColor: "#DBEAFE",
  },
  deleteButton: {
    backgroundColor: "#FEE2E2",
  },
  editText: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "bold",
  },
  deleteText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#B91C1C",
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
  },
  whiteText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    width: "100%",
    maxWidth: 440,
    maxHeight: "90%",
  },
  formTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#111827",
  },
  formDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginTop: 15,
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 13,
    fontSize: 15,
    color: "#111827",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 12,
    lineHeight: 19,
  },
  saveButton: {
    backgroundColor: "#B91C1C",
    padding: 14,
    borderRadius: 10,
    marginTop: 22,
  },
  cancelButton: {
    padding: 14,
    marginTop: 5,
    alignItems: "center",
  },
  cancelText: {
    color: "#6B7280",
    fontWeight: "600",
  },
});