import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';

export default function EmployeeAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => { fetchAppointments(); }, []);

  const handleCancel = (id: string) => {
    Alert.alert('Confirmar', '¿Cancelar esta cita?', [
      { text: 'No' },
      { text: 'Sí', onPress: async () => {
        try {
          await axiosClient.post(`/api/appointments/${id}/cancel`);
          fetchAppointments();
        } catch (err) {
          console.error(err);
          Alert.alert('Error', 'No se pudo cancelar la cita.');
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.pet?.name}</Text>
              <Text>{new Date(item.scheduledAt).toLocaleString()}</Text>
              <Text>Cliente: {item.pet?.owner?.name}</Text>
              <Text>Estado: {item.status}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#e74c3c' }]} onPress={() => handleCancel(item.id)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        refreshing={loading}
        onRefresh={fetchAppointments}
        ListEmptyComponent={() => <Text style={{ padding: 20 }}>No hay citas</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { flexDirection: 'row', padding: 12, margin: 8, backgroundColor: '#fff', borderRadius: 10 },
  title: { fontWeight: 'bold' },
  actions: { justifyContent: 'center' },
  btn: { padding: 8, borderRadius: 8, minWidth: 80, alignItems: 'center' },
  btnText: { color: '#fff' }
});
