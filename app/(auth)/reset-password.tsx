import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

export default function ResetPassword() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    if (!token) {
      Alert.alert('Error', 'Token inválido');
      return;
    }
    if (!password || !confirm) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await axiosClient.post('/api/auth/reset-password', { token, newPassword: password });
      Alert.alert('Éxito', 'Contraseña restablecida, inicia sesión');
      router.push('/(auth)/login');
    } catch (err) {
      alertApiError(err, 'No se pudo restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Card>
        <Text style={typography.h3}>Restablecer contraseña</Text>
        <Input placeholder="Nueva contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <Input placeholder="Confirmar contraseña" value={confirm} onChangeText={setConfirm} secureTextEntry style={styles.input} />
        <Button title={loading ? 'Guardando...' : 'Restablecer'} onPress={onSubmit} disabled={loading} />
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.background },
  input: { marginTop: 12 },
});
