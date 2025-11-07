import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { SessionContext } from '../../context/SessionContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

export default function RegisterDiagnosis() {
  const [pets, setPets] = useState<any[]>([]);
  const [petId, setPetId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [treatment, setTreatment] = useState('');
  const [medications, setMedications] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string>('');
  const router = useRouter();
  useContext(SessionContext); // keep session bound for auth; no direct usage here
  const { petId: qPetId, appointmentId: qAppointmentId } = useLocalSearchParams<{ petId?: string; appointmentId?: string }>();

  useEffect(() => {
    fetchPets();
    if (qPetId) setPetId(String(qPetId));
    if (qAppointmentId) setAppointmentId(String(qAppointmentId));
  }, [qPetId, qAppointmentId]);

  const fetchPets = async () => {
    try {
      const res = await axiosClient.get('/api/pets');
      setPets(res.data || []);
    } catch (err) {
      console.error(err);
      alertApiError(err, 'No se pudieron cargar las mascotas');
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
      const today = new Date();
      const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
      const payload: any = {
        appointmentId: appointmentId ? Number(appointmentId) : undefined,
        description,
        date,
      };
      if (treatment.trim()) payload.treatment = treatment.trim();
      if (medications.trim()) payload.medications = medications.trim();
      // Optional fields (treatment/medications) can be wired to inputs later
      await axiosClient.post('/api/diagnoses', payload);
      Alert.alert('Registrado', 'Diagnóstico registrado correctamente');
  setDescription('');
  setTreatment('');
  setMedications('');
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
      alertApiError(err, 'No se pudo registrar el diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={typography.h3}>Registrar diagnóstico</Text>

        <Text style={styles.label}>Mascota</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={petId} onValueChange={(v: string) => setPetId(v)}>
            <Picker.Item label="-- Seleccione --" value={''} />
            {pets.map((p) => (
              <Picker.Item key={p.id} label={`${p.name} (${p.owner?.name || 'Propietario'})`} value={String(p.id)} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Descripción</Text>
        <Input value={description} onChangeText={setDescription} multiline numberOfLines={4} placeholder="Detalles del diagnóstico" />

        <Text style={styles.label}>Tratamiento (opcional)</Text>
        <Input value={treatment} onChangeText={setTreatment} multiline numberOfLines={3} placeholder="Indicaciones de tratamiento" />

        <Text style={styles.label}>Medicamentos (opcional)</Text>
        <Input value={medications} onChangeText={setMedications} multiline numberOfLines={2} placeholder="Lista de medicamentos" />

        <Button title={loading ? 'Guardando...' : 'Registrar Diagnóstico'} onPress={submit} disabled={loading} style={{ marginTop: 8 }} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  label: { ...typography.subtitle, marginTop: 12 } as any,
  pickerWrap: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, marginTop: 8, overflow: 'hidden' },
});
