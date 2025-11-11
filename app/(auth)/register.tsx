import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Input from '../../components/ui/Input';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (!name || !email || !phone || !address) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }
    setLoading(true);

    const data = {
      name,
      email,
      password,
      phone,
      address,
    };

    try {
      await axiosClient.post('/api/users/register', data); // Axios envía como JSON
      Alert.alert('Éxito', 'Cuenta creada, inicia sesión');
      router.replace('/(auth)/login');
    } catch (error: any) {
      console.log('Error registering:', error);
      alertApiError(error, 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📝</Text>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a la comunidad VetCare</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>👤 Nombre completo</Text>
            <Input 
              placeholder="Juan Pérez" 
              value={name} 
              onChangeText={setName}
              style={styles.input}
              editable={!loading}
            />
          </View>

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
            <Text style={styles.label}>📱 Teléfono</Text>
            <Input 
              placeholder="300 1234567" 
              value={phone} 
              onChangeText={setPhone} 
              keyboardType="phone-pad"
              style={styles.input}
              editable={!loading}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>📍 Dirección</Text>
            <Input 
              placeholder="Calle 123, Apto 456" 
              value={address} 
              onChangeText={setAddress}
              style={styles.input}
              editable={!loading}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>🔒 Contraseña</Text>
            <Input 
              placeholder="Mínimo 6 caracteres" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry
              showPasswordToggle
              style={styles.input}
              editable={!loading}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>🔒 Confirmar contraseña</Text>
            <Input 
              placeholder="•••••••••" 
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
              secureTextEntry
              showPasswordToggle
              style={styles.input}
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.disabledButton]} 
            onPress={onRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginLink}>
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta? <Text 
                style={styles.loginLinkText}
                onPress={() => router.push('/(auth)/login')}
              >
                Inicia sesión
              </Text>
            </Text>
          </View>
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
    marginBottom: 18,
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
  registerButton: {
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
  registerButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginLink: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '500',
  },
  loginLinkText: {
    color: colors.primary,
    fontWeight: '700',
  },
});
