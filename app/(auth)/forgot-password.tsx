import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Ingresa tu correo');
      return;
    }
    setLoading(true);
    try {
      await axiosClient.post('/api/auth/forgot-password', { email });
      Alert.alert('Código enviado', 'Si el correo existe, te enviamos un código de 6 dígitos.');
      router.push({ pathname: '/(auth)/verify-otp', params: { email } } as any);
    } catch (err) {
      alertApiError(err, 'No se pudo procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Card>
        <Text style={typography.h3}>¿Olvidaste tu contraseña?</Text>
        <Text style={[typography.subtitle, { marginTop: 4 }]}>Te enviaremos un código de 6 dígitos a tu correo.</Text>
        <Input placeholder="Correo electrónico" value={email} onChangeText={setEmail} style={styles.input} />
        <Button title={loading ? 'Enviando...' : 'Enviar código'} onPress={onSubmit} disabled={loading} />
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.background },
  input: { marginTop: 12 },
});
