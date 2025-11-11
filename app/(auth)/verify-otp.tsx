import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>✉️</Text>
          <Text style={styles.title}>Verificar Código</Text>
          <Text style={styles.subtitle}>Revisa tu correo e ingresa el código de 6 dígitos</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>📧 Correo electrónico</Text>
            <Input 
              placeholder="tu@email.com" 
              value={email} 
              onChangeText={setEmail}
              style={styles.input}
              editable={!loading}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>🔐 Código de 6 dígitos</Text>
            <Input 
              placeholder="000000" 
              value={otp} 
              onChangeText={setOtp} 
              keyboardType="number-pad" 
              maxLength={6}
              style={[styles.input, styles.codeInput]}
              editable={!loading}
            />
            <Text style={styles.codeHint}>Revisar spam si no lo encuentras</Text>
          </View>

          <TouchableOpacity 
            style={[styles.verifyButton, loading && styles.disabledButton]} 
            onPress={onVerify}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? 'Verificando...' : 'Verificar código'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backLink}
            onPress={() => router.push('/(auth)/forgot-password' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.backLinkText}>← Solicitar nuevo código</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    ...typography.h1,
    color: colors.darkGray,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.caption,
    color: colors.muted,
    fontSize: 14,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    ...typography.caption,
    color: colors.darkGray,
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 13,
  },
  input: {
    marginBottom: 0,
  },
  codeInput: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 4,
  },
  codeHint: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 6,
    fontStyle: 'italic',
  },
  verifyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  backLink: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  backLinkText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
