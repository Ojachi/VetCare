import DateTimePickerInput from '@/components/ui/DateTimePickerInput';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import axiosClient, { formatLocalDateTime } from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';


type Pet = {
  id: number;
  name: string;
};

type Service = {
  id: number;
  name: string;
  price: number;
};

export default function ScheduleAppointment() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null); // podrías tener un picker para servicios también
  const [assignedToId, setAssignedToId] = useState<number | null>(null); // idem para veterinarios
  const [services, setServices] = useState<Service[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [dateTime, setDateTime] = useState(new Date());
  const { petId } = useLocalSearchParams<{ petId?: string }>();

  useEffect(() => {
    if (petId) {
      setSelectedPetId(Number(petId));
    }
  }, [petId]);

  useEffect(() => {
    // Cargar mascotas del usuario
    const fetchPets = async () => {
      try {
        const response = await axiosClient.get<Pet[]>('/api/pets');
        setPets(response.data);
      } catch (err) {
        alertApiError(err, 'No se pudieron cargar las mascotas');
      }
    };
    fetchPets();
    const fetchService = async () => {
      try {
        const response = await axiosClient.get<Service[]>('/api/services');
        setServices(response.data);
      } catch (err) {
        alertApiError(err, 'No se pudieron cargar los servicios');
      }
    };
    fetchService();
    const fetchUsers = async () => {
      try {
        const res = await axiosClient.get<any[]>('/api/users');
        const vets = res.data.filter((u: any) => u.role === 'VETERINARIAN');
        setAssignedToId(vets.length ? vets[0].id : null);
      } catch {
        // ignore
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!selectedPetId || !serviceId || !assignedToId ||  !note) {
      Alert.alert('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);

    // Formato esperado por el backend (ver imagen)
    const appointment = {
      petId: selectedPetId,
      serviceId,
      assignedToId,
  startDateTime: formatLocalDateTime(dateTime),
      note,
    };

    try {
      await axiosClient.post('/api/appointments', appointment);
      Alert.alert('Éxito', 'Cita agendada correctamente');
      setSelectedPetId(null);
      setServiceId(null);
      setAssignedToId(null);
      setNote('');
  router.push('/(owner)/view-appointments' as any);
    } catch (err) {
      alertApiError(err, 'No se pudo agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <View style={{ marginBottom: 12 }}>
          <TextInput editable={false} style={[styles.title, { color: colors.darkGray }]} value={"Agendar Cita"} />
        </View>
      <Picker
        selectedValue={selectedPetId}
        onValueChange={(value) => setSelectedPetId(value)}
        style={styles.input}
      >
        <Picker.Item label="Selecciona una mascota" value={null} />
        {pets.map((pet) => (
          <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
        ))}
      </Picker>
      
      <Picker
        selectedValue={serviceId}
        onValueChange={(value) => setServiceId(value)}
        style={styles.input}
      >
        <Picker.Item label="Selecciona un servicio" value={null} />
        {services.map((service) => (
          <Picker.Item key={service.id} label={service.name} value={service.id} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="ID Veterinario asignado (ej: 2)"
        value={assignedToId ? String(assignedToId) : ''}
        onChangeText={(value) => setAssignedToId(Number(value) || null)}
        keyboardType="numeric"
      />
      <DateTimePickerInput date={dateTime} onChange={setDateTime} />
      <TextInput
        style={styles.input}
        placeholder="Observaciones"
        value={note}
        onChangeText={setNote}
      />
  <Button title={loading ? 'Agendando...' : 'Agendar'} onPress={handleSubmit} disabled={loading} />

      <Button
        title="Ver mis citas"
        onPress={() => router.push('/(owner)/view-appointments' as any)}
        style={{ backgroundColor: colors.secondary }}
      />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#EEF2F3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: colors.white,
  },
});
