import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, Alert, StyleSheet } from 'react-native';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import axiosClient from '../../api/axiosClient';
import { useSession } from '../../context/SessionContext';
import { useRouter } from 'expo-router';

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
    } catch (error: any) {
      Alert.alert('Error', 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Input placeholder="Correo electrónico" value={email} onChangeText={setEmail} style={styles.input} />
      <Input placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title={loading ? 'Cargando...' : 'Entrar'} onPress={onLogin} />
      <Text style={styles.registerText}>
        ¿No tienes cuenta? <Text style={styles.link} onPress={() => router.push('/(auth)/register')}>Regístrate</Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 12 },
  registerText: { marginTop: 15, textAlign: 'center', color: '#666' },
  link: { color: 'blue', textDecorationLine: 'underline' },
});
