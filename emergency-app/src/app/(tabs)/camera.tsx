import AsyncStorage from "@react-native-async-storage/async-storage";

const STATUS_KEY = "@community_response_status";
const LOCATION_KEY = "@community_response_location";
const EVIDENCE_KEY = "@community_response_evidence";

export type EmergencyStatus =
  | "SAFE"
  | "HELP NEEDED";

export interface SavedLocation {
  text: string;
  latitude: number;
  longitude: number;
  updatedAt: string;
}

export async function saveStatus(
  status: EmergencyStatus
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STATUS_KEY,
      status
    );
  } catch (error) {
    console.log(
      "Save status error:",
      error
    );
  }
}

export async function getStatus(): Promise<
  EmergencyStatus | null >
{

  try {
    const status =
      await AsyncStorage.getItem(
        STATUS_KEY
      );

    if (
      status === "SAFE" ||
      status === "HELP NEEDED"
    ) {
      return status;
    }

    return null;
  } catch (error) {
    console.log(
      "Get status error:",
      error
    );

    return null;
  }
}

export async function saveLocation(
  location: SavedLocation
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      LOCATION_KEY,
      JSON.stringify(location)
    );
  } catch (error) {
    console.log(
      "Save location error:",
      error
    );
  }
}

export async function getLocation(): Promise<
  SavedLocation | null
> {

  try {
    const savedLocation =
      await AsyncStorage.getItem(
        LOCATION_KEY
      );

    if (!savedLocation) {
      return null;
    }

    return JSON.parse(
      savedLocation
    ) as SavedLocation;
  } catch (error) {
    console.log(
      "Get location error:",
      error
    );

    return null;
  }
}

export async function saveEvidence(
  imageUri: string
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      EVIDENCE_KEY,
      imageUri
    );
  } catch (error) {
    console.log(
      "Save evidence error:",
      error
    );
  }
}

export async function getEvidence(): Promise<
  string | null >
{

  try {
    return await AsyncStorage.getItem(
      EVIDENCE_KEY
    );
  } catch (error) {
    console.log(
      "Get evidence error:",
      error
    );

    return null;
  }
}

export async function clearEmergencyData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STATUS_KEY,
      LOCATION_KEY,
      EVIDENCE_KEY,
    ]);
  } catch (error) {
    console.log(
      "Clear emergency data error:",
      error
    );
  }
}