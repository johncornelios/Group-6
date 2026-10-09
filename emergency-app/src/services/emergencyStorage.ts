import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";

const USER_KEY = "communityResponseUser";
const EMERGENCY_KEY = "emergencyInformation";
const PHOTO_KEY = "emergencyEvidence";
const STATUS_KEY = "emergencyStatus";
const RECORDS_KEY = "emergencyEvidenceRecords";

export type EvidenceRecord = {
  id: string;
  uri: string;
  capturedAt: string | null;
};

// Queue writes so simultaneous saves don't overwrite each other.
let evidenceQueue: Promise<unknown> = Promise.resolve();

function queueEvidenceWrite<T>(operation: () => Promise<T>): Promise<T> {
  const result = evidenceQueue.then(operation);
  evidenceQueue = result.catch(() => undefined);
  return result;
}

export async function saveUser(data: { name: string }) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));
}

export async function getUser(): Promise<{ name: string } | null> {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function saveEmergencyInformation(data: any) {
  await AsyncStorage.setItem(EMERGENCY_KEY, JSON.stringify(data));
}

export async function getEmergencyInformation() {
  const data = await AsyncStorage.getItem(EMERGENCY_KEY);
  return data ? JSON.parse(data) : null;
}

async function readEvidenceRecords(): Promise<EvidenceRecord[]> {
  const data = await AsyncStorage.getItem(RECORDS_KEY);

  if (data !== null) {
    const records: unknown = JSON.parse(data);

    if (!Array.isArray(records)) {
      throw new Error("Unable to read saved evidence records.");
    }

    return records as EvidenceRecord[];
  }

  // Keep the existing single photo visible, without inventing its date.
  const oldPhoto = await AsyncStorage.getItem(PHOTO_KEY);

  return oldPhoto
    ? [{
        id: "previous-evidence",
        uri: oldPhoto,
        capturedAt: null,
      }]
    : [];
}

export async function getEvidenceRecords(): Promise<EvidenceRecord[]> {
  await evidenceQueue;
  return readEvidenceRecords();
}

export function saveEvidence(
  uri: string,
  capturedAt: string = new Date().toISOString()
): Promise<EvidenceRecord> {
  return queueEvidenceWrite(async () => {
    const records = await readEvidenceRecords();

    const id =
      `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    let storedUri = uri;
    let copiedUri: string | null = null;

    try {
      if (Platform.OS !== "web") {
        if (!FileSystem.documentDirectory) {
          throw new Error("Photo storage is unavailable on this device.");
        }

        const folder =
          `${FileSystem.documentDirectory}emergency-evidence/`;

        await FileSystem.makeDirectoryAsync(folder, {
          intermediates: true,
        });

        const extension =
          uri.split("?")[0].match(/\.([a-zA-Z0-9]+)$/)?.[1] || "jpg";

        storedUri = `${folder}${id}.${extension}`;

        await FileSystem.copyAsync({
          from: uri,
          to: storedUri,
        });

        copiedUri = storedUri;
      } else if (!uri.startsWith("data:image/")) {
        throw new Error(
          "The browser photo must be captured as image data before saving."
        );
      }

      const record: EvidenceRecord = {
        id,
        uri: storedUri,
        capturedAt,
      };

      await AsyncStorage.setItem(
        RECORDS_KEY,
        JSON.stringify([record, ...records])
      );

      return record;
    } catch (error) {
      if (copiedUri) {
        await FileSystem.deleteAsync(copiedUri, {
          idempotent: true,
        }).catch(() => undefined);
      }

      throw error;
    }
  });
}

// Existing callers can still get the latest saved photo.
export async function getEvidence(): Promise<string | null> {
  const records = await getEvidenceRecords();
  return records[0]?.uri ?? null;
}

// Removes the latest record, or a specific record when an ID is supplied.
export function deleteEvidence(id?: string): Promise<void> {
  return queueEvidenceWrite(async () => {
    const records = await readEvidenceRecords();
    const targetId = id ?? records[0]?.id;

    if (!targetId) return;

    const record = records.find((item) => item.id === targetId);
    const remaining = records.filter((item) => item.id !== targetId);

    await AsyncStorage.setItem(
      RECORDS_KEY,
      JSON.stringify(remaining)
    );

    // Clear the old single-photo key when its imported record is removed.
    if (targetId === "previous-evidence") {
      await AsyncStorage.removeItem(PHOTO_KEY);
    }

    if (
      Platform.OS !== "web" &&
      record &&
      FileSystem.documentDirectory &&
      record.uri.startsWith(
        `${FileSystem.documentDirectory}emergency-evidence/`
      )
    ) {
      await FileSystem.deleteAsync(record.uri, {
        idempotent: true,
      }).catch(() => undefined);
    }
  });
}

export async function saveEmergencyStatus(status: string) {
  await AsyncStorage.setItem(STATUS_KEY, status);
}

export async function getEmergencyStatus() {
  return AsyncStorage.getItem(STATUS_KEY);
}