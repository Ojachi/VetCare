import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import axiosClient, { formatLocalDateTime } from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DateTimePickerInput from '../../components/ui/DateTimePickerInput';
import DetailModal from '../../components/ui/DetailModal';
import EmptyState from '../../components/ui/EmptyState';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import { formatDisplayDateTime } from '../../utils/date';

export default function EmployeeAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<Date>(new Date());

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/appointments');
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
      alertApiError(err, 'No se pudieron cargar las citas.');
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
          await axiosClient.put(`/api/appointments/${id}/cancel`);
          fetchAppointments();
        } catch (err) {
          console.error(err);
          alertApiError(err, 'No se pudo cancelar la cita.');
        }
      }}
    ]);
  };

  const openReschedule = (id: string, when?: string) => {
    setSelectedId(id);
    if (when) {
      const d = new Date(when);
      if (!isNaN(d.getTime())) setNewDate(d);
    }
    setRescheduleVisible(true);
  };

  const submitReschedule = async () => {
    if (!selectedId) return;
    try {
      await axiosClient.put(`/api/appointments/${selectedId}`, {
        startDateTime: formatLocalDateTime(newDate),
      });
      setRescheduleVisible(false);
      setSelectedId(null);
      fetchAppointments();
      Alert.alert('Éxito', 'Cita reprogramada');
    } catch (err) {
      console.error(err);
      alertApiError(err, 'No se pudo reprogramar la cita');
    }
  };

  return (
    <View style={styles.container}>
      {loading && appointments.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
          data={appointments}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={typography.h3}>{item.pet?.name}</Text>
                  <Text style={typography.subtitle}>
                    {formatDisplayDateTime(item.startDateTime || item.scheduledAt)}
                  </Text>
                  <Text style={[typography.body, { marginTop: 6 }]}>
                    Cliente: <Text style={{ fontWeight: '600' }}>{item.pet?.owner?.name}</Text>
                  </Text>
                  <Text style={typography.caption}>Estado: {item.status}</Text>
                </View>
                <View style={styles.actions}>
                  <Button
                    title="Cancelar"
                    onPress={() => handleCancel(item.id)}
                    style={{ backgroundColor: colors.danger, marginVertical: 4, paddingVertical: 10 }}
                    textStyle={{ fontSize: 14 }}
                  />
                  <Button
                    title="Reprogramar"
                    onPress={() => openReschedule(item.id, item.startDateTime || item.scheduledAt)}
                    style={{ backgroundColor: colors.secondary, marginVertical: 4, paddingVertical: 10 }}
                    textStyle={{ fontSize: 14 }}
                  />
                </View>
              </View>
            </Card>
          )}
          refreshing={loading}
          onRefresh={fetchAppointments}
          ListEmptyComponent={() => (
            <EmptyState
              title="Sin citas"
              message="No hay citas asignadas por ahora. Desliza hacia abajo para actualizar."
            />
          )}
        />
      )}

      <DetailModal visible={rescheduleVisible} onClose={() => setRescheduleVisible(false)}>
        <View style={{ gap: 12 }}>
          <Text style={typography.h3}>Reprogramar cita</Text>
          <Text style={typography.caption}>Elige la nueva fecha y hora</Text>
          <DateTimePickerInput date={newDate} onChange={setNewDate} />
          <Button
            title="Guardar"
            onPress={submitReschedule}
            style={{ backgroundColor: colors.secondary, marginTop: 4 }}
          />
        </View>
      </DetailModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actions: { justifyContent: 'center', marginLeft: 8, width: 120 },
});
