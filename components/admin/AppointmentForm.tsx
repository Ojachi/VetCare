import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import axiosClient, { formatLocalDateTime } from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DateTimePickerInput from '../../components/ui/DateTimePickerInput';
import Input from '../../components/ui/Input';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
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
    <Card style={{ padding: 16 }}>
      <Text style={typography.h3}>{appointment?.id ? 'Editar cita' : 'Nueva cita'}</Text>
      <Text style={[typography.caption, { marginBottom: 8, color: colors.darkGray }]}>Completa los campos para gestionar la cita</Text>

      <Text style={styles.label}>Mascota</Text>
      <View style={styles.pickerBox}>
        <Picker selectedValue={petId} onValueChange={(v) => setPetId(v)}>
          <Picker.Item label="Selecciona mascota" value={null} />
          {pets.map((p) => (
            <Picker.Item key={p.id} label={p.name} value={p.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Servicio</Text>
      <View style={styles.pickerBox}>
        <Picker selectedValue={serviceId} onValueChange={(v) => setServiceId(v)}>
          <Picker.Item label="Selecciona servicio" value={null} />
          {services.map((s) => (
            <Picker.Item key={s.id} label={s.name} value={s.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Veterinario (opcional)</Text>
      <View style={styles.pickerBox}>
        <Picker selectedValue={assignedToId} onValueChange={(v) => setAssignedToId(v)}>
          <Picker.Item label="Sin asignar" value={null} />
          {vets.map((v) => (
            <Picker.Item key={v.id} label={v.name} value={v.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Fecha y hora</Text>
      <DateTimePickerInput date={dateTime} onChange={setDateTime} />

      <Text style={styles.label}>Nota/observaciones</Text>
      <Input value={note} onChangeText={setNote} placeholder="Ej. Síntomas, solicitudes, etc." multiline />

      <View style={styles.actions}>
        <Button
          title={appointment?.id ? 'Guardar cambios' : 'Crear cita'}
          onPress={handleSave}
          disabled={loading}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title="Cancelar"
          onPress={onCancel}
          style={{ flex: 1, backgroundColor: colors.secondary }}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.caption, marginTop: 10 },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#EEF2F3',
    borderRadius: 12,
    backgroundColor: colors.white,
    marginTop: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
});
