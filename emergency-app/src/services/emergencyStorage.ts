import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmergencyAlert, EmergencyContact } from '../types/emergency';

const STORAGE_KEYS = {
  CONTACTS: '@community_contacts',
  ACTIVE_ALERT: '@community_active_alert',
  STATUS: '@community_status',
  LOCATION: '@community_location',
  EVIDENCE: '@community_evidence',
};

export const emergencyStorage = {
  async getContacts(): Promise<EmergencyContact[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CONTACTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  },

  async saveContacts(contacts: EmergencyContact[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving contacts:', error);
    }
  },

  async getActiveAlert(): Promise<EmergencyAlert | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_ALERT);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error fetching active alert:', error);
      return null;
    }
  },

  async setActiveAlert(alert: EmergencyAlert): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_ALERT, JSON.stringify(alert));
    } catch (error) {
      console.error('Error saving active alert:', error);
    }
  },

  async clearActiveAlert(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_ALERT);
    } catch (error) {
      console.error('Error clearing active alert:', error);
    }
  },
};

export default emergencyStorage;