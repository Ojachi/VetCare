import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import { SessionContext } from '../../context/SessionContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import { formatDisplayDateTime } from '../../utils/date';
import Button from '../ui/Button';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';

export default function VetAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | string>('ALL');
  const [filterServiceId, setFilterServiceId] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useContext(SessionContext);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const [appsRes, servicesRes] = await Promise.all([
        axiosClient.get('/api/appointments'),
        axiosClient.get('/api/services'),
      ]);
      const all = appsRes.data || [];
      const filteredByVet = (user && (user.role === 'VETERINARIAN' || user.role === 'VET'))
        ? all.filter((a: any) => a.assignedTo?.id === user.id)
        : all;
      setAppointments(filteredByVet);
      setServices(servicesRes.data || []);
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

  const renderItem = ({ item }: { item: any }) => {
    const statusNorm = String(item.status).toUpperCase();
    return (
      <Card style={{ padding: 16 }}>
        <View style={styles.headerRow}>
          <Text style={[typography.h3, { flex: 1 }]} numberOfLines={1}>{item.pet?.name || 'Mascota desconocida'}</Text>
          <View style={[styles.badge, badgeColor(statusNorm)]}><Text style={styles.badgeText}>{statusNorm}</Text></View>
        </View>
        <Text style={typography.subtitle}>{formatDisplayDateTime(item.startDateTime || item.scheduledAt)}</Text>
        <Text style={[typography.caption, { marginTop: 4 }]}>Servicio: {item.service?.name ?? '—'}</Text>
        <Text style={[typography.caption, { marginTop: 2 }]}>Propietario: {item.pet?.owner?.name ?? '—'}</Text>
        <View style={styles.actionsRow}>
          <Button
            title="Confirmar"
            onPress={() => handleConfirm(item.id)}
            style={{ backgroundColor: colors.success, flex: 1, marginRight: 6, paddingVertical: 10 }}
            textStyle={{ fontSize: 14 }}
          />
          <Button
            title="Completar"
            onPress={() => handleMarkDone(item.id)}
            style={{ backgroundColor: colors.primary, flex: 1, marginRight: 6, paddingVertical: 10 }}
            textStyle={{ fontSize: 14 }}
          />
          <Button
            title="Dx"
            onPress={() => handleDiagnose(item)}
            style={{ backgroundColor: colors.warning, flex: 1, marginRight: 6, paddingVertical: 10 }}
            textStyle={{ fontSize: 14 }}
          />
          <Button
            title="Cancelar"
            onPress={() => handleCancel(item.id)}
            style={{ backgroundColor: colors.danger, flex: 1, paddingVertical: 10 }}
            textStyle={{ fontSize: 14 }}
          />
        </View>
      </Card>
    );
  };

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

  const filtered = appointments.filter(a => {
    const statusOk = filterStatus === 'ALL' || String(a.status).toUpperCase() === filterStatus;
    const serviceOk = !filterServiceId || a.service?.id === filterServiceId;
    return statusOk && serviceOk;
  });

  return (
    <View style={styles.container}>
      {loading && appointments.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={(
            <Card style={{ marginHorizontal: 12, padding: 16 }}>
              <Text style={typography.h3}>Filtros</Text>
              <Text style={[typography.caption, { color: colors.darkGray, marginBottom: 8 }]}>Refina tus citas</Text>
              <Text style={styles.filterLabel}>Estado</Text>
              <View style={styles.pickerBox}>
                <Picker selectedValue={filterStatus} onValueChange={(v) => setFilterStatus(v)}>
                  <Picker.Item label="Todos" value="ALL" />
                  <Picker.Item label="Pendiente" value="PENDING" />
                  <Picker.Item label="Aceptada" value="ACCEPTED" />
                  <Picker.Item label="Confirmada" value="CONFIRMED" />
                  <Picker.Item label="Completada" value="COMPLETED" />
                  <Picker.Item label="Cancelada" value="CANCELLED" />
                </Picker>
              </View>
              <Text style={styles.filterLabel}>Servicio</Text>
              <View style={styles.pickerBox}>
                <Picker selectedValue={filterServiceId} onValueChange={(v) => setFilterServiceId(v)}>
                  <Picker.Item label="Todos" value={null} />
                  {services.map((s:any) => <Picker.Item key={s.id} label={s.name} value={s.id} />)}
                </Picker>
              </View>
              <Button title="Limpiar" onPress={() => { setFilterStatus('ALL'); setFilterServiceId(null); }} style={{ backgroundColor: colors.secondary }} textStyle={{ fontSize: 14 }} />
            </Card>
          )}
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
          data={filtered}
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
  actionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  pickerBox: { borderWidth: 1, borderColor: '#EEF2F3', borderRadius: 12, backgroundColor: colors.white, marginTop: 6, marginBottom: 12, overflow: 'hidden' },
  filterLabel: { ...typography.caption, marginTop: 4 },
});

function badgeColor(status: string) {
  switch (status) {
    case 'PENDING': return { backgroundColor: colors.secondary } as const;
    case 'ACCEPTED': return { backgroundColor: colors.success } as const;
    case 'CONFIRMED': return { backgroundColor: colors.primary } as const;
    case 'COMPLETED': return { backgroundColor: '#2d9d78' } as const;
    case 'CANCELLED':
    case 'CANCELED': return { backgroundColor: colors.danger } as const;
    default: return { backgroundColor: colors.darkGray } as const;
  }
}
