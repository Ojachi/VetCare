import DateTimePickerInput from '@/components/ui/DateTimePickerInput';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import axiosClient from '../../api/axiosClient';


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

  useEffect(() => {
    // Cargar mascotas del usuario
    const fetchPets = async () => {
      try {
        const response = await axiosClient.get<Pet[]>('/api/pets');
        setPets(response.data);
      } catch {
        Alert.alert('Error', 'No se pudieron cargar las mascotas');
      }
    };
    fetchPets();
    const fetchService = async () => {
      try {
        const response = await axiosClient.get<Service[]>('/api/services');
        setServices(response.data);
      } catch {
        Alert.alert('Error', 'No se pudieron cargar los servicios');
      }
    };
    fetchService();
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
      startDateTime: dateTime, // ejemplo: '2025-09-26T14:30:00'
      note,
    };

    try {
      await axiosClient.post('/api/appointments', appointment);
      Alert.alert('Éxito', 'Cita agendada correctamente');
      setSelectedPetId(null);
      setServiceId(null);
      setAssignedToId(null);
      setNote('');
      router.push('/(tabs)/view-appointments');
    } catch {
      Alert.alert('Error', 'No se pudo agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
        onPress={() => router.push('/(tabs)/view-appointments')}
        color="#007bff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});
