import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, Alert, StyleSheet } from 'react-native';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import axiosClient from '../../api/axiosClient';
import YesNoCheckbox from '../../components/ui/YesNoCheckbox';

export default function RegisterService() {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [requiresVeterinarian, setRequiresVeterinarian] = useState(false);
  const [name, setName] = useState('');

  const onRegisterService = async () => {
    if (!name || !price || !durationMinutes) {
      Alert.alert('Error', 'Por favor llena todos los campos obligatorios');
      return;
    }
    setLoading(true);

    const data = {
      name,
      description,
      price,
      durationMinutes,
      requiresVeterinarian // Descripción vacía por defecto
    }
    try {
      await axiosClient.post('/api/admin/services', data);
      Alert.alert('Éxito', 'Servicio registrado');
      setName('');
      setDescription('');
      setPrice('');
      setDurationMinutes('');
      setRequiresVeterinarian(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Registrar Servicio</Text>
      <Input
        placeholder="Nombre del servicio"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Input
        placeholder="Descripcion"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Input
        placeholder="Precio (COP)"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
      />
      <Input
        placeholder="Duracion (minutos)"
        value={durationMinutes}
        onChangeText={setDurationMinutes}
        style={styles.input}
      />

      <Text style={styles.question} >¿Necesita Veterinario?</Text>
      <YesNoCheckbox value={requiresVeterinarian} onChange={setRequiresVeterinarian} />
      <Button title={loading ? 'Registrando...' : 'Registrar'} onPress={onRegisterService} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 12 },
  question: { fontSize: 16, marginBottom: 8}
});
