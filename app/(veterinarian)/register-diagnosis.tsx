import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import { SessionContext } from '../../context/SessionContext';

export default function RegisterDiagnosis() {
  const [pets, setPets] = useState<any[]>([]);
  const [petId, setPetId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string>('');
  const router = useRouter();
  const { user } = useContext(SessionContext);

  useEffect(() => {
    fetchPets();
    const params: any = (router as any).params || {};
    if (params?.petId) setPetId(String(params.petId));
    if (params?.appointmentId) setAppointmentId(String(params.appointmentId));
  }, [router]);

  const fetchPets = async () => {
    try {
      const res = await axiosClient.get('/api/pets');
      setPets(res.data || []);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron cargar las mascotas');
    }
  };

  const submit = async () => {
    if (!petId) {
      Alert.alert('Seleccione una mascota');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Ingrese la descripcion');
      return;
    }
    setLoading(true);
    try {
      const payload: any = { petId, description };
      // include veterinarian id if available from session
      if (user && (user.role === 'VETERINARIAN' || user.role === 'VET')) {
        payload.veterinarianId = (user as any).id;
      }
  await axiosClient.post('/api/diagnoses', payload);
      Alert.alert('Registrado', 'Diagnóstico registrado correctamente');
      setDescription('');
      setPetId('');

      // if this was created from an appointment, mark appointment completed
      if (appointmentId) {
        try {
          await axiosClient.put(`/api/appointments/${appointmentId}/status`, { status: 'COMPLETED' });
        } catch (err) {
          // non-blocking
          console.error('Failed to mark appointment complete', err);
        }
      }
      // optionally navigate back
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo registrar el diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mascota</Text>
      {/* Using Picker from react-native (deprecated in some versions) but fine for now */}
      <View style={styles.pickerWrap}>
        <Picker selectedValue={petId} onValueChange={(v: string) => setPetId(v)}>
          <Picker.Item label="-- Seleccione --" value={''} />
          {pets.map((p) => (
            <Picker.Item key={p.id} label={`${p.name} (${p.owner?.name || 'Propietario'})`} value={String(p.id)} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Descripción</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline numberOfLines={4} placeholder="Detalles del diagnóstico" />

      <TouchableOpacity style={styles.submit} onPress={submit} disabled={loading}>
        <Text style={styles.submitText}>{loading ? 'Guardando...' : 'Registrar Diagnóstico'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  label: { marginTop: 12, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginTop: 8 },
  submit: { marginTop: 18, backgroundColor: '#2ecc71', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold' },
  pickerWrap: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginTop: 8 },
});
