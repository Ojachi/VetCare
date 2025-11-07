import { isAxiosError } from 'axios';
import { Alert } from 'react-native';

function mapStatusToMessage(status?: number, fallback?: string) {
  switch (status) {
    case 400:
    case 422:
      return 'Datos inválidos. Revisa la información ingresada.';
    case 401:
      return 'Credenciales inválidas o sesión expirada.';
    case 403:
      return 'No tienes permisos para realizar esta acción.';
    case 404:
      return 'Recurso no encontrado.';
    case 409:
      return 'Conflicto con el estado actual. Intenta de nuevo.';
    case 500:
      return 'Error del servidor. Intenta más tarde.';
    default:
      return fallback || 'Ocurrió un error. Intenta de nuevo.';
  }
}

export function getApiErrorMessage(err: unknown, fallback?: string): string {
  if (isAxiosError(err)) {
    const status = err.response?.status;
    const backendMessage = (err.response?.data as any)?.message as string | undefined;
    if (backendMessage) return backendMessage;
    return mapStatusToMessage(status, fallback);
  }
  return fallback || 'Ocurrió un error. Intenta de nuevo.';
}

export function alertApiError(err: unknown, fallback?: string) {
  const msg = getApiErrorMessage(err, fallback);
  Alert.alert('Error', msg);
}
