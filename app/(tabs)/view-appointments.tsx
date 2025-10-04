import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axiosClient from '../../api/axiosClient';

type Appointment = {
  id: number;
  petName: string;
  serviceName: string;
  assignedToName: string;
  startDateTime: string;
  note?: string;
};

export default function ViewAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosClient.get<Appointment[]>('/api/appointments');
        setAppointments(response.data);
        console.log(response.data);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar tus citas');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (appointments.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No tienes citas agendadas</Text>
      </View>
    );
  }

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <View style={styles.card}>
      <Text style={styles.bold}>{item.petName}</Text>
      <Text>Servicio: {item.serviceName}</Text>
      <Text>Veterinario: {item.assignedToName}</Text>
      <Text>Fecha y hora: {item.startDateTime.replace('T', ' ')}</Text>
      {item.note ? <Text>Nota: {item.note}</Text> : null}
    </View>
  );

  return (
    <FlatList
      data={appointments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderAppointment}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f7f7fa',
  },
  bold: { fontWeight: 'bold', fontSize: 16 },
});
