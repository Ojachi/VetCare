import DateTimePickerInput from '@/components/ui/DateTimePickerInput';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import axiosClient, { formatLocalDateTime } from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
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
  const [vets, setVets] = useState<{ id: number; name: string }[]>([]);
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
        const onlyVets = res.data.filter((u: any) => u.role === 'VETERINARIAN');
        setVets(onlyVets);
        setAssignedToId(onlyVets.length ? onlyVets[0].id : null);
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
      <Card style={{ padding: 16 }}>
        <Text style={[typography.h2, { textAlign: 'center' }]}>Agendar Cita</Text>
        <Text style={[typography.caption, { textAlign: 'center', color: colors.darkGray, marginBottom: 12 }]}>Completa los datos para tu próxima visita</Text>

        <Text style={styles.label}>Mascota</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={selectedPetId} onValueChange={(value) => setSelectedPetId(value)}>
            <Picker.Item label="Selecciona una mascota" value={null} />
            {pets.map((pet) => (
              <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Servicio</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={serviceId} onValueChange={(value) => setServiceId(value)}>
            <Picker.Item label="Selecciona un servicio" value={null} />
            {services.map((service) => (
              <Picker.Item key={service.id} label={service.name} value={service.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Veterinario</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={assignedToId} onValueChange={(value) => setAssignedToId(value)}>
            {vets.length === 0 && <Picker.Item label="Sin veterinarios disponibles" value={null} />}
            {vets.map((v) => (
              <Picker.Item key={v.id} label={v.name} value={v.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Fecha y hora</Text>
        <DateTimePickerInput date={dateTime} onChange={setDateTime} />

        <Text style={styles.label}>Observaciones</Text>
        <Input placeholder="Ej. síntomas, preferencias, etc." value={note} onChangeText={setNote} multiline />

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
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
  },
  label: { ...typography.caption, marginTop: 6 },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#EEF2F3',
    borderRadius: 12,
    backgroundColor: colors.white,
    marginTop: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
});
