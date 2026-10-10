
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";

const INCIDENT_KEY = "communityResponseIncidents";

// Information saved for every incident
export type Incident = {
  id: string;
  photoUri: string;
  description: string;
  date: string;
  latitude: number | null;
  longitude: number | null;
  locationName: string;
};

// Get all saved incident records
export async function getIncidents(): Promise<Incident[]> {
  const data = await AsyncStorage.getItem(INCIDENT_KEY);

  if (!data) {
    return [];
  }

  const incidents = JSON.parse(data) as Incident[];

  return Array.isArray(incidents) ? incidents : [];
}

// Save a new incident
export async function saveIncident(
  photoUri: string,
  description: string,
  latitude: number | null,
  longitude: number | null,
  locationName: string
): Promise<Incident> {
  const id =
    Date.now().toString() +
    "-" +
    Math.random().toString(36).slice(2, 9);

  let savedPhotoUri = photoUri;

  // On Android and iOS, keep a permanent copy
  // of the photo in the app's document folder.
  if (Platform.OS !== "web") {
    const directory = FileSystem.documentDirectory;

    if (!directory) {
      throw new Error("App document storage is unavailable.");
    }

    const folder = directory + "incident-records/";

    await FileSystem.makeDirectoryAsync(folder, {
      intermediates: true,
    });

    const extension = photoUri
      .split("?")[0]
      .split(".")
      .pop()
      ?.toLowerCase();

    const safeExtension =
      extension === "png" ||
      extension === "heic" ||
      extension === "webp"
        ? extension
        : "jpg";

    savedPhotoUri = folder + id + "." + safeExtension;

    await FileSystem.copyAsync({
      from: photoUri,
      to: savedPhotoUri,
    });
  } else {
    // Browser storage requires a different approach.
    // Convert the image to a data URL for small test photos.
    const response = await fetch(photoUri);

    if (!response.ok) {
      throw new Error("Unable to read selected photo.");
    }

    const blob = await response.blob();

    savedPhotoUri = await new Promise<string>(
      (resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Unable to read photo."));
          }
        };

        reader.onerror = () => {
          reject(new Error("Unable to read photo."));
        };

        reader.readAsDataURL(blob);
      }
    );
  }

  const incident: Incident = {
    id,
    photoUri: savedPhotoUri,
    description,
    date: new Date().toISOString(),
    latitude,
    longitude,
    locationName: locationName || "Location unavailable",
  };

  try {
    const incidents = await getIncidents();

    // Newest incident appears first
    incidents.unshift(incident);

    await AsyncStorage.setItem(
      INCIDENT_KEY,
      JSON.stringify(incidents)
    );

    return incident;
  } catch (error) {
    // Remove copied photo if saving the record fails
    if (Platform.OS !== "web") {
      await FileSystem.deleteAsync(savedPhotoUri, {
        idempotent: true,
      }).catch(() => {});
    }

    throw error;
  }
}

// Delete one incident record
export async function deleteIncident(
  id: string
): Promise<void> {
  const incidents = await getIncidents();

  const selected = incidents.find(
    (incident) => incident.id === id
  );

  const updated = incidents.filter(
    (incident) => incident.id !== id
  );

  await AsyncStorage.setItem(
    INCIDENT_KEY,
    JSON.stringify(updated)
  );

  // Delete the saved image on Android/iOS
  if (selected && Platform.OS !== "web") {
    await FileSystem.deleteAsync(selected.photoUri, {
      idempotent: true,
    }).catch((error) => {
      console.warn("Unable to delete photo:", error);
    });
  }
}
