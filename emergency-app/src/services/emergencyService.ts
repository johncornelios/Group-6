import AsyncStorage from "@react-native-async-storage/async-storage";

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
}

export interface EmergencyData {
  contacts?: EmergencyContact[];
  status?: string;
  location?: any;
  notes?: string;
}

const STORAGE_KEY = "@emergency_contacts";

export async function getEmergencyData(): Promise<EmergencyData | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error reading emergency data", e);
    return null;
  }
}

export async function saveEmergencyData(data: EmergencyData): Promise<void> {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving emergency data", e);
  }
}

export async function updateEmergencyStatus(status: string): Promise<void> {
  try {
    const existing = await getEmergencyData();
    const updated = { ...existing, status };
    await saveEmergencyData(updated);
  } catch (e) {
    console.error("Error updating emergency status", e);
  }
}