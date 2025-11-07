import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { SessionContext } from '../../context/SessionContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import { formatDisplayDateTime } from '../../utils/date';

export default function VetAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useContext(SessionContext);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/appointments');
      const all = res.data || [];
      // filter by vet if logged user is a veterinarian
      const filtered = (user && (user.role === 'VETERINARIAN' || user.role === 'VET'))
        ? all.filter((a: any) => a.assignedTo?.id === user.id)
        : all;
      setAppointments(filtered);
    } catch (err) {
      console.error(err);
      alertApiError(err, 'No se pudieron cargar las citas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const renderItem = ({ item }: { item: any }) => (
    <Card>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={typography.h3}>{item.pet?.name || 'Mascota desconocida'}</Text>
          <Text style={typography.subtitle}>
            {formatDisplayDateTime(item.startDateTime || item.scheduledAt)}
          </Text>
          <Text style={[typography.body, { marginTop: 6 }]}>Servicio: {item.service?.name}</Text>
          <Text style={typography.caption}>Estado: {item.status}</Text>
        </View>
        <View style={styles.actions}>
          <Button
            title="Confirmar"
            onPress={() => handleConfirm(item.id)}
            style={{ backgroundColor: colors.success, paddingVertical: 10, marginVertical: 4 }}
            textStyle={{ fontSize: 14 }}
          />
          <Button
            title="Completar"
            onPress={() => handleMarkDone(item.id)}
            style={{ backgroundColor: colors.primary, paddingVertical: 10, marginVertical: 4 }}
            textStyle={{ fontSize: 14 }}
          />
          <Button
            title="Diagnosticar"
            onPress={() => handleDiagnose(item)}
            style={{ backgroundColor: colors.warning, paddingVertical: 10, marginVertical: 4 }}
            textStyle={{ fontSize: 14 }}
          />
          <Button
            title="Cancelar"
            onPress={() => handleCancel(item.id)}
            style={{ backgroundColor: colors.danger, paddingVertical: 10, marginVertical: 4 }}
            textStyle={{ fontSize: 14 }}
          />
        </View>
      </View>
    </Card>
  );

  const handleMarkDone = async (id: string) => {
    try {
      await axiosClient.put(`/api/appointments/${id}/status`, { status: 'COMPLETED' });
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alertApiError(err, 'No se pudo actualizar el estado.');
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await axiosClient.put(`/api/appointments/${id}/status`, { status: 'CONFIRMED' });
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alertApiError(err, 'No se pudo confirmar la cita.');
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
            await axiosClient.put(`/api/appointments/${id}/cancel`);
            fetchAppointments();
          } catch (err) {
            console.error(err);
            alertApiError(err, 'No se pudo cancelar la cita.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {loading && appointments.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
          data={appointments}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={fetchAppointments}
          ListEmptyComponent={<EmptyState title="Sin citas" message="No hay citas" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actions: { justifyContent: 'center', width: 140, marginLeft: 8 },
});
