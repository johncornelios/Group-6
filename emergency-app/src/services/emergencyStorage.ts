
type StorageAdapter = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

const memoryStorage = new Map<string, string>();
const localStorage = (
  globalThis as typeof globalThis & {
    localStorage?: {
      getItem(key: string): string | null;
      setItem(key: string, value: string): void;
      removeItem(key: string): void;
    };
  }
).localStorage;

const AsyncStorage: StorageAdapter = {
  async getItem(key) {
    return localStorage ? localStorage.getItem(key) : memoryStorage.get(key) ?? null;
  },
  async setItem(key, value) {
    if (localStorage) localStorage.setItem(key, value);
    else memoryStorage.set(key, value);
  },
  async removeItem(key) {
    if (localStorage) localStorage.removeItem(key);
    else memoryStorage.delete(key);
  },
};

const USER_KEY = "communityResponseUser";
const EMERGENCY_KEY = "emergencyInformation";
const PHOTO_KEY = "emergencyEvidence";
const STATUS_KEY = "emergencyStatus";

// Save user information
export async function saveUser(data: { name: string }) {
  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify(data)
  );
}

// Get saved user information
export async function getUser(): Promise<{ name: string } | null> {
  const data = await AsyncStorage.getItem(USER_KEY);

  return data ? JSON.parse(data) : null;
}

// Save emergency information
export async function saveEmergencyInformation(data: any) {
  await AsyncStorage.setItem(
    EMERGENCY_KEY,
    JSON.stringify(data)
  );
}

// Get emergency information
export async function getEmergencyInformation() {
  const data = await AsyncStorage.getItem(EMERGENCY_KEY);

  return data ? JSON.parse(data) : null;
}

// Save evidence
export async function saveEvidence(uri: string) {
  await AsyncStorage.setItem(PHOTO_KEY, uri);
}

// Get evidence
export async function getEvidence() {
  return await AsyncStorage.getItem(PHOTO_KEY);
}

// Delete evidence
export async function deleteEvidence() {
  await AsyncStorage.removeItem(PHOTO_KEY);
}

// Save emergency status
export async function saveEmergencyStatus(status: string) {
  await AsyncStorage.setItem(STATUS_KEY, status);
}

// Get emergency status
export async function getEmergencyStatus() {
  return await AsyncStorage.getItem(STATUS_KEY);
}
