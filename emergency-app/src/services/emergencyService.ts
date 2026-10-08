import * as Location from 'expo-location';
import { emergencyStorage } from './emergencyStorage';

type EmergencyAlert = {
  id: string;
  timestamp: string;
  status: string;
  location?: { latitude: number; longitude: number };
  [key: string]: any;
};

type EmergencyContact = {
  id: string;
  [key: string]: any;
};

export const emergencyService = {
  async getContacts(): Promise<EmergencyContact[]> {
    try {
      return await emergencyStorage.getContacts();
    } catch (error) {
      console.error('Failed to fetch emergency contacts:', error);
      return [];
    }
  },

  async addContact(contact: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> {
    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString(),
    };
    const contacts = await this.getContacts();
    const updated = [...contacts, newContact];
    await emergencyStorage.saveContacts(updated);
    return newContact;
  },

  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  },

  async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) throw new Error('Location permission not granted');
      return await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  },

  async createEmergency(data?: Partial<EmergencyAlert>): Promise<EmergencyAlert> {
    const newEmergency: EmergencyAlert = {
      id: `emergency-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'active',
      ...data,
    };
    await emergencyStorage.getActiveAlert(newEmergency);
    return newEmergency;
  },

  async triggerAlert(location?: { latitude: number; longitude: number }): Promise<EmergencyAlert> {
    return this.createEmergency({ location });
  },

  async resolveAlert(alertId: string): Promise<void> {
    await emergencyStorage.clearActiveAlert();
  },
};

export const requestLocationPermission = emergencyService.requestLocationPermission.bind(emergencyService);
export const getCurrentLocation = emergencyService.getCurrentLocation.bind(emergencyService);
export const createEmergency = emergencyService.createEmergency.bind(emergencyService);
export const getContacts = emergencyService.getContacts.bind(emergencyService);
export const addContact = emergencyService.addContact.bind(emergencyService);
export const triggerAlert = emergencyService.triggerAlert.bind(emergencyService);
export const resolveAlert = emergencyService.resolveAlert.bind(emergencyService);

export default emergencyService;