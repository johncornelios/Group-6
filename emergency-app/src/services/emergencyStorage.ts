
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "communityResponseUser";
const EMERGENCY_KEY = "emergencyInformation";
const PHOTO_KEY = "emergencyEvidence";
const STATUS_KEY = "emergencyStatus";

export async function saveUser(data: { name: string }) {
  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify(data)
  );
}

export async function getUser(): Promise<{ name: string } | null> {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function saveEmergencyInformation(data: any) {
  await AsyncStorage.setItem(
    EMERGENCY_KEY,
    JSON.stringify(data)
  );
}

export async function getEmergencyInformation() {
  const data = await AsyncStorage.getItem(EMERGENCY_KEY);
  return data ? JSON.parse(data) : null;
}

export async function saveEvidence(uri: string) {
  await AsyncStorage.setItem(PHOTO_KEY, uri);
}

export async function getEvidence() {
  return await AsyncStorage.getItem(PHOTO_KEY);
}

export async function deleteEvidence() {
  await AsyncStorage.removeItem(PHOTO_KEY);
}

export async function saveEmergencyStatus(status: string) {
  await AsyncStorage.setItem(STATUS_KEY, status);
}

export async function getEmergencyStatus() {
  return await AsyncStorage.getItem(STATUS_KEY);
}
