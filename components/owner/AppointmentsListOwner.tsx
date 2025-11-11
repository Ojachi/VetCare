import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import { formatDisplayDateTime } from '../../utils/date';
import Button from '../ui/Button';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';

type Appointment = { id: number; petName: string; serviceName: string; assignedToName: string; startDateTime: string; note?: string; };

export default function AppointmentsListOwner() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const response = await axiosClient.get<Appointment[]>('/api/appointments'); setAppointments(response.data); } catch (err) { alertApiError(err, 'No se pudo cargar tus citas'); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (!loading && appointments.length === 0) return <View style={[styles.center, { backgroundColor: colors.background }]}><EmptyState title="Sin citas" message="No tienes citas agendadas por ahora." /></View>;

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <Card>
      <Text style={typography.h3}>{item.petName}</Text>
      <Text style={typography.subtitle}>Servicio: {item.serviceName}</Text>
      <Text style={typography.body}>Veterinario: {item.assignedToName}</Text>
      <Text style={typography.body}>Fecha y hora: {formatDisplayDateTime(item.startDateTime)}</Text>
      {item.note ? <Text style={[typography.caption, { marginTop: 4 }]}>Nota: {item.note}</Text> : null}
      <View style={{ marginTop: 10 }}>
        <Button title="Cancelar" onPress={async () => { try { await axiosClient.put(`/api/appointments/${item.id}/cancel`); Alert.alert('Éxito', 'Cita cancelada'); load(); } catch (err) { alertApiError(err, 'No se pudo cancelar la cita'); } }} style={{ backgroundColor: colors.danger }} />
      </View>
    </Card>
  );

  return <View style={{ flex: 1, backgroundColor: colors.background }}><FlatList data={appointments} keyExtractor={(i) => i.id.toString()} renderItem={renderAppointment} contentContainerStyle={styles.list} /></View>;
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' }, list: { padding: 16 } });
