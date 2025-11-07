import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import axiosClient, { formatLocalDateTime } from '../../api/axiosClient';
import DateTimePickerInput from '../../components/ui/DateTimePickerInput';
import { alertApiError } from '../../utils/apiError';

export default function AppointmentForm({
  appointment,
  onSaved,
  onCancel,
}: {
  appointment?: any | null;
  onSaved: (saved: any) => void;
  onCancel: () => void;
}) {
  const [pets, setPets] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [vets, setVets] = useState<any[]>([]);

  const [petId, setPetId] = useState<number | null>(appointment?.appointment?.pet?.id ?? null);
  const [serviceId, setServiceId] = useState<number | null>(appointment?.appointment?.service?.id ?? null);
  const [assignedToId, setAssignedToId] = useState<number | null>(appointment?.appointment?.assignedTo?.id ?? null);
  const [dateTime, setDateTime] = useState<Date>(appointment?.appointment?.startDateTime ? new Date(appointment.appointment.startDateTime) : new Date());
  const [note, setNote] = useState<string>(appointment?.appointment?.note ?? '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [petsRes, servicesRes, usersRes] = await Promise.all([
          axiosClient.get<any[]>('/api/pets'),
          axiosClient.get<any[]>('/api/services'),
          axiosClient.get<any[]>('/api/admin/users'),
        ]);
        setPets(petsRes.data);
        setServices(servicesRes.data);
        const vetsOnly = (usersRes.data || []).filter((u: any) => u.role === 'VETERINARIAN');
        setVets(vetsOnly);
      } catch (err) {
        alertApiError(err, 'No se pudieron cargar opciones para la cita');
      }
    };
    fetchOptions();
  }, []);

  const handleSave = async () => {
    if (!petId || !serviceId) {
      Alert.alert('Por favor selecciona la mascota y el servicio');
      return;
    }

    setLoading(true);
    const payload = {
      petId,
      serviceId,
      assignedToId,
      startDateTime: formatLocalDateTime(dateTime),
      note,
    };

    try {
      let res;
      if (appointment?.id) {
        res = await axiosClient.put(`/api/appointments/${appointment.id}`, payload);
      } else {
        res = await axiosClient.post('/api/appointments', payload);
      }
      onSaved(res.data);
    } catch (err) {
      alertApiError(err, 'No se pudo guardar la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mascota</Text>
      <Picker selectedValue={petId} onValueChange={(v) => setPetId(v)}>
        <Picker.Item label="Selecciona mascota" value={null} />
        {pets.map((p) => (
          <Picker.Item key={p.id} label={p.name} value={p.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Servicio</Text>
      <Picker selectedValue={serviceId} onValueChange={(v) => setServiceId(v)}>
        <Picker.Item label="Selecciona servicio" value={null} />
        {services.map((s) => (
          <Picker.Item key={s.id} label={s.name} value={s.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Veterinario (opcional)</Text>
      <Picker selectedValue={assignedToId} onValueChange={(v) => setAssignedToId(v)}>
        <Picker.Item label="Sin asignar" value={null} />
        {vets.map((v) => (
          <Picker.Item key={v.id} label={v.name} value={v.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Fecha y hora</Text>
      <DateTimePickerInput date={dateTime} onChange={setDateTime} />

      <Text style={styles.label}>Nota/observaciones</Text>
      <TextInput style={styles.input} value={note} onChangeText={setNote} />

      <View style={styles.actions}>
        <Button title={appointment?.id ? 'Guardar cambios' : 'Crear cita'} onPress={handleSave} disabled={loading} />
        <Button title="Cancelar" color="gray" onPress={onCancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 6 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
});
