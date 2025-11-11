import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Input from '../../components/ui/Input';
import { useSession } from '../../context/SessionContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { getApiErrorMessage } from '../../utils/apiError';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useSession();
  const router = useRouter();

  const onLogin = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await axiosClient.post('/api/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Esperamos a que el contexto verifique la cookie y actualice el estado
      await login({ email, ...response.data });
      // Aquí la navegación la maneja automáticamente el SessionContext
    } catch (err) {
      Alert.alert('Error', getApiErrorMessage(err, 'Credenciales inválidas'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🔐</Text>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>Bienvenido de nuevo a VetCare</Text>
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
            <Text style={styles.label}>🔒 Contraseña</Text>
            <Input 
              placeholder="•••••••••" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry
              showPasswordToggle
              style={styles.input}
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.disabledButton]} 
            onPress={onLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Verificando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.linksContainer}>
            <TouchableOpacity 
              style={styles.link}
              onPress={() => router.push('/(auth)/register')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>
                ¿No tienes cuenta? <Text style={styles.linkBold}>Regístrate aquí</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.link}
              onPress={() => router.push('/(auth)/forgot-password' as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>
                ¿Olvidaste tu contraseña? <Text style={styles.linkBold}>Recupérala</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.homeSection}>
            <TouchableOpacity 
              style={styles.homeButton}
              onPress={() => router.push('/' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.homeButtonText}>← Volver al Inicio</Text>
            </TouchableOpacity>
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
  loginButton: {
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
  loginButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: colors.muted,
    fontWeight: '600',
  },
  linksContainer: {
    gap: 12,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(46, 139, 87, 0.05)',
  },
  linkText: {
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  linkBold: {
    color: colors.primary,
    fontWeight: '700',
  },
  homeSection: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  homeButton: {
    backgroundColor: '#f0f4f1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(46, 139, 87, 0.2)',
  },
  homeButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
