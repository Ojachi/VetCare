import { Alert, Platform } from 'react-native';

export type PickImageOptions = {
  multiple?: boolean;
  base64?: boolean;
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number; // 0..1
};

export type PickedAsset = {
  uri?: string;
  base64?: string;
  width?: number;
  height?: number;
  mimeType?: string;
};

export type PickImageResult = {
  canceled: boolean;
  assets?: PickedAsset[];
  error?: string;
};

/**
 * Pluggable image picker that prefers react-native-image-picker if available,
 * and falls back to expo-image-picker in managed workflow.
 */
export function useImagePicker() {
  const pickImage = async (options: PickImageOptions = {}): Promise<PickImageResult> => {
    // Expo managed flow: use expo-image-picker
    try {
      const mod: any = await import('expo-image-picker');
      const EP = mod?.default ?? mod;
      if (!EP?.launchImageLibraryAsync) {
        return { canceled: true, error: 'expo-image-picker no disponible' };
      }

      // Request permission on native platforms
      if (Platform.OS !== 'web' && EP.requestMediaLibraryPermissionsAsync) {
        const perm = await EP.requestMediaLibraryPermissionsAsync();
        if (perm?.status !== 'granted') {
          Alert.alert('Permiso requerido', 'Necesitas permitir acceso a tus fotos.');
          return { canceled: true, error: 'permission-denied' };
        }
      }

      const res = await EP.launchImageLibraryAsync({
        mediaTypes: EP.MediaTypeOptions.Images,
        allowsEditing: !!options.allowsEditing,
        aspect: options.aspect,
        quality: options.quality ?? 0.8,
        base64: !!options.base64,
        allowsMultipleSelection: !!options.multiple,
      });

      if (res.canceled || !res.assets?.length) return { canceled: true };
      const mapped: PickedAsset[] = res.assets.map((a: any) => ({
        uri: a?.uri,
        base64: a?.base64,
        width: a?.width,
        height: a?.height,
        mimeType: a?.mimeType,
      }));
      return { canceled: false, assets: mapped };
    } catch (e: any) {
      const msg = e?.message || '';
      // Detect missing native module scenario and guide user.
      if (msg.includes('ExponentImagePicker')) {
        Alert.alert(
          'Módulo nativo faltante',
          'El cliente actual no incluye expo-image-picker. Ejecuta:\n\n1. npx expo install expo-image-picker\n2. npm run android (reconstruir dev client)\n\nSi ya estaba instalado: limpia caché con "expo start -c" y, si persiste, corre "cd android && ./gradlew clean" antes de reconstruir.'
        );
      }
      console.error('expo-image-picker error', e);
      return { canceled: true, error: msg || 'picker-error' };
    }
  };

  return { pickImage };
}
