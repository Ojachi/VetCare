import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
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
      <Text style={styles.title}>Registrar Cuenta</Text>
      <Input placeholder="Nombre completo" value={name} onChangeText={setName} style={styles.input} />
      <Input placeholder="Correo electrónico" value={email} onChangeText={setEmail} style={styles.input} />
      <Input placeholder="Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
      <Input placeholder="Dirección" value={address} onChangeText={setAddress} style={styles.input} />
      <Input placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Input placeholder="Confirmar Contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
  <Button title={loading ? 'Cargando...' : 'Registrar'} onPress={onRegister} disabled={loading} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 12 },
});
