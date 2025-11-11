import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient, { formatLocalDateTime } from '../../api/axiosClient';
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
  const [employees, setEmployees] = useState<any[]>([]);

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
  const allUsers = usersRes.data || [];
  const vetsOnly = allUsers.filter((u: any) => u.role === 'VETERINARIAN');
  const employeesOnly = allUsers.filter((u: any) => u.role === 'EMPLOYEE');
  setVets(vetsOnly);
  setEmployees(employeesOnly);
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
      console.log('Appointment saved:', res);
    } catch (err) {
      alertApiError(err, 'No se pudo guardar la cita');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === serviceId);
  const requiresVet = !!selectedService?.requiresVeterinarian;

  return (
    <View style={styles.formContainer}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📅</Text>
        <View>
          <Text style={typography.h2}>{appointment?.id ? 'Editar cita' : 'Nueva cita'}</Text>
          <Text style={[typography.caption, { marginBottom: 8, color: colors.muted }]}>Completa los campos para gestionar la cita</Text>
        </View>
      </View>

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

      {requiresVet ? (
        <>
          <Text style={styles.label}>Veterinario</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={assignedToId} onValueChange={(v) => setAssignedToId(v)}>
              <Picker.Item label="Selecciona veterinario" value={null} />
              {vets.map((v) => (
                <Picker.Item key={v.id} label={v.name} value={v.id} />
              ))}
            </Picker>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.label}>Empleado</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={assignedToId} onValueChange={(v) => setAssignedToId(v)}>
              <Picker.Item label="Selecciona empleado" value={null} />
              {employees.map((e) => (
                <Picker.Item key={e.id} label={e.name} value={e.id} />
              ))}
            </Picker>
          </View>
        </>
      )}

      <Text style={styles.label}>Fecha y hora </Text>
      <Text style={styles.label}>Elige una fecha y hora 24 horas despues de la hora actual </Text>
  <DateTimePickerInput date={dateTime} onChange={setDateTime} />

      <Text style={styles.label}>Nota/observaciones</Text>
  <Input value={note} onChangeText={setNote} placeholder="Ej. Síntomas, solicitudes, etc." multiline textAlignVertical="top" style={{ minHeight: 90 }} />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {appointment?.id ? 'Guardar cambios' : 'Crear cita'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { padding: 16, paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  headerEmoji: { fontSize: 40, marginRight: 8 },
  label: { ...typography.caption, marginTop: 12, color: colors.darkGray, fontWeight: '600' },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#EEF2F3',
    borderRadius: 12,
    backgroundColor: colors.white,
    marginTop: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
