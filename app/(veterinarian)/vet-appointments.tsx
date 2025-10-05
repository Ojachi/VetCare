import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';

export default function VetAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/appointments');
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron cargar las citas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.pet?.name || 'Mascota desconocida'}</Text>
        <Text>{new Date(item.scheduledAt).toLocaleString()}</Text>
        <Text>Servicio: {item.service?.name}</Text>
        <Text>Estado: {item.status}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#27ae60' }]} onPress={() => handleConfirm(item.id)}>
          <Text style={styles.actionText}>Confirmar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2ecc71' }]} onPress={() => handleMarkDone(item.id)}>
          <Text style={styles.actionText}>Completar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f39c12' }]} onPress={() => handleDiagnose(item)}>
          <Text style={styles.actionText}>Diagnosticar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e74c3c' }]} onPress={() => handleCancel(item.id)}>
          <Text style={styles.actionText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleMarkDone = async (id: string) => {
    try {
      await axiosClient.put(`/api/appointments/${id}/status`, { status: 'COMPLETED' });
      fetchAppointments();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo actualizar el estado.');
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await axiosClient.put(`/api/appointments/${id}/status`, { status: 'CONFIRMED' });
      fetchAppointments();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo confirmar la cita.');
    }
  };

  const handleDiagnose = (appointment: any) => {
    const petId = appointment?.pet?.id;
    // navigate to diagnosis screen with petId and appointmentId
    const path = `/(veterinarian)/register-diagnosis?petId=${petId}&appointmentId=${appointment.id}`;
    router.push(path as any);
  };

  const handleCancel = (id: string) => {
    Alert.alert('Confirmar', '¿Cancelar esta cita?', [
      { text: 'No' },
      {
        text: 'Sí',
        onPress: async () => {
          try {
            await axiosClient.post(`/api/appointments/${id}/cancel`);
            fetchAppointments();
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'No se pudo cancelar la cita.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList data={appointments} keyExtractor={(i) => i.id} renderItem={renderItem} refreshing={loading} onRefresh={fetchAppointments} ListEmptyComponent={() => <Text style={{ padding: 20 }}>No hay citas</Text>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { flexDirection: 'row', padding: 12, margin: 8, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center' },
  title: { fontWeight: 'bold', fontSize: 16 },
  actions: { justifyContent: 'center' },
  actionBtn: { padding: 8, borderRadius: 8, marginVertical: 4, minWidth: 90, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold' },
});
