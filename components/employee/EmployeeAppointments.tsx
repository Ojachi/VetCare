import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient, { formatLocalDateTime } from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import { formatDisplayDateTime } from '../../utils/date';
import Button from '../ui/Button';
import Card from '../ui/Card';
import DateTimePickerInput from '../ui/DateTimePickerInput';
import DetailModal from '../ui/DetailModal';
import EmptyState from '../ui/EmptyState';

type Appointment = {
  id: string;
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  startDateTime?: string;
  scheduledAt?: string;
  pet?: { name: string; owner?: { name: string } };
  service?: { name: string };
};

export default function EmployeeAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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

  const handleCancel = (id: string, petName: string) => {
    Alert.alert('Cancelar cita', `¿Cancelar la cita de ${petName}?`, [
      { text: 'No', style: 'cancel' },
      { 
        text: 'Sí', 
        style: 'destructive',
        onPress: async () => {
          try {
            await axiosClient.put(`/api/appointments/${id}/cancel`);
            fetchAppointments();
            Alert.alert('Éxito', 'Cita cancelada correctamente');
          } catch (err) {
            console.error(err);
            alertApiError(err, 'No se pudo cancelar la cita.');
          }
        }
      }
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
      Alert.alert('Éxito', 'Cita reprogramada correctamente');
    } catch (err) {
      console.error(err);
      alertApiError(err, 'No se pudo reprogramar la cita');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return '#F59E0B';
      case 'confirmada':
        return colors.secondary;
      case 'completada':
        return colors.primary;
      case 'cancelada':
        return colors.danger;
      default:
        return colors.muted;
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
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerEmoji}>📅</Text>
              <Text style={[typography.h2, styles.headerTitle]}>Mis Citas</Text>
              <Text style={styles.headerSubtitle}>Gestiona todas tus citas agendadas</Text>
            </View>
          }
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
          data={appointments}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedAppointment(item)}>
              <Card style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[typography.h3, { color: colors.darkGray }]}>{item.pet?.name}</Text>
                    <Text style={[typography.caption, { color: colors.muted, marginTop: 2 }]}>
                      Cliente: {item.pet?.owner?.name}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusBadgeText}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.appointmentContent}>
                  <Text style={styles.appointmentField}>
                    📅 <Text style={styles.appointmentFieldValue}>
                      {formatDisplayDateTime(item.startDateTime || item.scheduledAt)}
                    </Text>
                  </Text>
                  {item.service && (
                    <Text style={styles.appointmentField}>
                      🏥 <Text style={styles.appointmentFieldValue}>{item.service.name}</Text>
                    </Text>
                  )}
                </View>

                <View style={styles.appointmentActions}>
                  {/* Reprogramar: Si no está COMPLETED o CANCELLED */}
                  {!['COMPLETED', 'CANCELLED', 'CANCELED'].includes(String(item.status).toUpperCase()) && (
                    <Button
                      title="Reprogramar"
                      onPress={() => openReschedule(item.id, item.startDateTime || item.scheduledAt)}
                      style={styles.actionButtonSecondary}
                      textStyle={styles.actionButtonText}
                    />
                  )}
                  
                  {/* Cancelar: Si no está COMPLETED o CANCELLED */}
                  {!['COMPLETED', 'CANCELLED', 'CANCELED'].includes(String(item.status).toUpperCase()) && (
                    <Button
                      title="Cancelar"
                      onPress={() => handleCancel(item.id, item.pet?.name || 'cita')}
                      style={styles.actionButtonDanger}
                      textStyle={styles.actionButtonText}
                    />
                  )}
                </View>
              </Card>
            </TouchableOpacity>
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
        <ScrollView style={styles.modalContent}>
          <View style={styles.headerSection}>
            <Text style={styles.headerSectionEmoji}>📅</Text>
            <Text style={[typography.h2, styles.headerSectionTitle]}>Reprogramar Cita</Text>
            <Text style={styles.headerSectionSubtitle}>Elige la nueva fecha y hora</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>Fecha y Hora</Text>
            <DateTimePickerInput date={newDate} onChange={setNewDate} />

            <View style={styles.buttonGroup}>
              <Button
                title="Guardar Cambios"
                onPress={submitReschedule}
                style={{ backgroundColor: colors.primary }}
              />
              <Button
                title="Cancelar"
                onPress={() => setRescheduleVisible(false)}
                style={{ backgroundColor: colors.secondary }}
              />
            </View>
          </View>
        </ScrollView>
      </DetailModal>

      {/* Modal de Detalles de Cita */}
      <DetailModal visible={!!selectedAppointment} onClose={() => setSelectedAppointment(null)}>
        <ScrollView style={styles.detailModalContent}>
          {selectedAppointment && (
            <>
              <View style={styles.detailHeaderSection}>
                <Text style={styles.detailHeaderEmoji}>📋</Text>
                <Text style={[typography.h2, styles.detailHeaderTitle]}>Detalles de Cita</Text>
                <Text style={styles.detailHeaderSubtitle}>{selectedAppointment.pet?.name}</Text>
              </View>

              <Card style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>🐾 Mascota:</Text>
                  <Text style={styles.detailValue}>{selectedAppointment.pet?.name || '—'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>👤 Cliente:</Text>
                  <Text style={styles.detailValue}>{selectedAppointment.pet?.owner?.name || '—'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>📅 Fecha/Hora:</Text>
                  <Text style={styles.detailValue}>
                    {formatDisplayDateTime(selectedAppointment.startDateTime || selectedAppointment.scheduledAt)}
                  </Text>
                </View>
                
                {selectedAppointment.service && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>🏥 Servicio:</Text>
                    <Text style={styles.detailValue}>{selectedAppointment.service.name}</Text>
                  </View>
                )}
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>📊 Estado:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedAppointment.status) }]}>
                    <Text style={styles.statusBadgeText}>
                      {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </Card>

              <View style={styles.detailActions}>
                {!['COMPLETED', 'CANCELLED', 'CANCELED'].includes(String(selectedAppointment.status).toUpperCase()) && (
                  <Button
                    title="📅 Reprogramar"
                    onPress={() => {
                      openReschedule(selectedAppointment.id, selectedAppointment.startDateTime || selectedAppointment.scheduledAt);
                      setSelectedAppointment(null);
                    }}
                    style={{ backgroundColor: colors.secondary, marginBottom: 10 }}
                  />
                )}
              </View>

        
            </>
          )}
        </ScrollView>
      </DetailModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  loaderContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  // Header
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    color: colors.darkGray,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },

  // Appointment Card
  appointmentCard: {
    marginVertical: 8,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  appointmentContent: {
    marginBottom: 14,
  },
  appointmentField: {
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: '500',
    marginBottom: 6,
  },
  appointmentFieldValue: {
    color: colors.primary,
    fontWeight: '600',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonSecondary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.secondary,
  },
  actionButtonDanger: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Modal de Detalles
  detailModalContent: {
    paddingVertical: 20,
  },
  detailHeaderSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.lightGray,
  },
  detailHeaderEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  detailHeaderTitle: {
    color: colors.darkGray,
    marginBottom: 4,
  },
  detailHeaderSubtitle: {
    fontSize: 14,
    color: colors.muted,
  },
  detailCard: {
    marginHorizontal: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkGray,
  },
  detailValue: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  detailActions: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  // Modal
  modalContent: {
    paddingVertical: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.lightGray,
  },
  headerSectionEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  headerSectionTitle: {
    color: colors.darkGray,
    marginBottom: 4,
  },
  headerSectionSubtitle: {
    fontSize: 14,
    color: colors.muted,
  },
  formCard: {
    paddingHorizontal: 0,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 8,
  },
  buttonGroup: {
    marginTop: 16,
    gap: 10,
  },
});
