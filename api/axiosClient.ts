import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const extra = Constants.expoConfig?.extra || {} as any;

function resolveApiBaseUrl() {
  const {
    apiUrlWeb,
    apiUrlAndroid,
    apiUrlIos,
    apiUrlDevice,
  } = extra as { apiUrlWeb?: string; apiUrlAndroid?: string; apiUrlIos?: string; apiUrlDevice?: string };

  if (Platform.OS === 'web') {
    return apiUrlWeb || apiUrlDevice || apiUrlAndroid || apiUrlIos || apiUrlWeb;
  }
  // Prefer a device-wide URL if provided (works for Android/iOS in same LAN)
  if (apiUrlWeb) return apiUrlWeb;
  if (Platform.OS === 'android') return  apiUrlWeb|| apiUrlAndroid || apiUrlIos || apiUrlDevice;
  if (Platform.OS === 'ios') return  apiUrlWeb || apiUrlIos || apiUrlAndroid || apiUrlDevice;
  // Fallback
  return apiUrlWeb || apiUrlAndroid || apiUrlIos || apiUrlDevice;
}

export const apiBaseUrlResolved = resolveApiBaseUrl();

const axiosClient = axios.create({
  baseURL: apiBaseUrlResolved,
  withCredentials: true,
});

// Helpers to format dates the backend expects
export function formatLocalDateTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    d.getFullYear() +
    '-' + pad(d.getMonth() + 1) +
    '-' + pad(d.getDate()) +
    'T' + pad(d.getHours()) +
    ':' + pad(d.getMinutes()) +
    ':' + pad(d.getSeconds())
  );
}

export function formatLocalDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

export default axiosClient;
