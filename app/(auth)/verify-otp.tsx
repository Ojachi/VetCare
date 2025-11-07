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

export default function VerifyOtp() {
  const { email: qEmail } = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState<string>(qEmail ? String(qEmail) : '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onVerify = async () => {
    if (!email || !otp) {
      Alert.alert('Error', 'Ingresa tu correo y el código recibido');
      return;
    }
    if (otp.length < 4) {
      Alert.alert('Código inválido', 'Verifica el código de 6 dígitos');
      return;
    }
    setLoading(true);
    try {
      await axiosClient.post('/api/auth/verify-otp', { email, otp });
      Alert.alert('Código verificado', 'Ahora define tu nueva contraseña');
      router.push({ pathname: '/(auth)/set-new-password', params: { email, otp } } as any);
    } catch (err) {
      alertApiError(err, 'No se pudo verificar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Card>
        <Text style={typography.h3}>Verificar código</Text>
        <Text style={[typography.subtitle, { marginTop: 4 }]}>Revisa tu correo e ingresa el código de 6 dígitos.</Text>
        <Input placeholder="Correo electrónico" value={email} onChangeText={setEmail} style={styles.input} />
        <Input placeholder="Código" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} style={styles.input} />
        <Button title={loading ? 'Verificando...' : 'Verificar código'} onPress={onVerify} disabled={loading} />
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.background },
  input: { marginTop: 12 },
});
