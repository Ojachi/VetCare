import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import { SessionContext } from '../../context/SessionContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import { formatDisplayDateTime } from '../../utils/date';
import Button from '../ui/Button';
import Card from '../ui/Card';
import DetailModal from '../ui/DetailModal';
import EmptyState from '../ui/EmptyState';

type Appointment = {
  id: string;
  status: string;
  pet?: { name: string; owner?: { name: string }; id?: string };
  service?: { name: string; id: string };
  startDateTime?: string;
  scheduledAt?: string;
  assignedTo?: { id: string };
};

export default function VetAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | string>('ALL');
  const [filterServiceId, setFilterServiceId] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentDiagnosis, setAppointmentDiagnosis] = useState<any>(null);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const router = useRouter();
  const { user } = useContext(SessionContext);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const [appsRes, servicesRes, diagnosisRes] = await Promise.all([
        axiosClient.get('/api/appointments'),
        axiosClient.get('/api/services'),
        axiosClient.get('/api/diagnoses/my-diagnoses'),
      ]);
      const all = appsRes.data || [];
      const filteredByVet = (user && (user.role === 'VETERINARIAN' || user.role === 'VET'))
        ? all.filter((a: any) => a.assignedTo?.id === user.id)
        : all;
      setAppointments(filteredByVet);
      setServices(servicesRes.data || []);
      setDiagnoses(diagnosisRes.data || []);
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

  const getStatusColor = (status: string) => {
    const statusNorm = String(status).toUpperCase();
    switch (statusNorm) {
      case 'PENDING':
        return colors.warning;
      case 'ACCEPTED':
        return colors.success;
      case 'CONFIRMED':
        return colors.primary;
      case 'COMPLETED':
        return '#2d9d78';
      case 'CANCELLED':
      case 'CANCELED':
        return colors.danger;
      default:
        return colors.muted;
    }
  };

  const hasDiagnosis = (appointmentId: string): boolean => {
    return diagnoses.some((d: any) => d.appointment?.id === appointmentId);
  };

  const renderItem = ({ item }: { item: Appointment }) => (
    <TouchableOpacity onPress={() => openAppointmentDetail(item)}>
      <Card style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h3, { color: colors.darkGray }]}>
              {item.pet?.name || 'Mascota desconocida'}
            </Text>
            <Text style={[typography.caption, { color: colors.muted, marginTop: 2 }]}>
              Propietario: {item.pet?.owner?.name || '—'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusBadgeText}>
              {String(item.status).charAt(0).toUpperCase() + String(item.status).slice(1)}
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
          {/* Aceptar: Solo si está PENDING */}
          {String(item.status).toUpperCase() === 'PENDING' && (
            <Button
              title="Aceptar"
              onPress={() => handleConfirm(item.id)}
              style={styles.buttonSuccess}
              textStyle={styles.actionButtonText}
            />
          )}
          
          {/* Dx: Solo si está ACCEPTED y NO tiene diagnóstico */}
          {String(item.status).toUpperCase() === 'ACCEPTED' && !hasDiagnosis(item.id) && (
            <Button
              title="Dx"
              onPress={() => handleDiagnose(item)}
              style={styles.buttonWarning}
              textStyle={styles.actionButtonText}
            />
          )}
          
          {/* Completar: Si está ACCEPTED y YA tiene diagnóstico */}
          {String(item.status).toUpperCase() === 'ACCEPTED' && hasDiagnosis(item.id) && (
            <Button
              title="Completar"
              onPress={() => handleMarkDone(item.id)}
              style={styles.buttonPrimary}
              textStyle={styles.actionButtonText}
            />
          )}
          
          {/* Cancelar: Si no está COMPLETED o CANCELLED */}
          {!['COMPLETED', 'CANCELLED', 'CANCELED'].includes(String(item.status).toUpperCase()) && (
            <Button
              title="Cancelar"
              onPress={() => handleCancel(item.id)}
              style={styles.buttonDanger}
              textStyle={styles.actionButtonText}
            />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  const handleMarkDone = async (id: string) => {
    try {
      await axiosClient.put(`/api/appointments/${id}/status`, { status: 'COMPLETED' });
      Alert.alert('Éxito', 'Cita marcada como completada');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alertApiError(err, 'No se pudo actualizar el estado.');
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await axiosClient.put(`/api/appointments/${id}/status`, { status: 'ACCEPTED' });
      Alert.alert('Éxito', 'Cita confirmada. Registra el diagnóstico cuando estés listo.');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alertApiError(err, 'No se pudo confirmar la cita.');
    }
  };

  const handleDiagnose = (appointment: Appointment) => {
    const petId = appointment?.pet?.id;
    const path = `/(veterinarian)/register-diagnosis?petId=${petId}&appointmentId=${appointment.id}`;
    router.push(path as any);
  };

  const handleCancel = (id: string) => {
    Alert.alert('Cancelar cita', '¿Cancelar esta cita?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí',
        style: 'destructive',
        onPress: async () => {
          try {
            await axiosClient.put(`/api/appointments/${id}/cancel`);
            Alert.alert('Éxito', 'Cita cancelada');
            fetchAppointments();
          } catch (err) {
            console.error(err);
            alertApiError(err, 'No se pudo cancelar la cita.');
          }
        },
      },
    ]);
  };

  const openAppointmentDetail = async (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setLoadingDiagnosis(true);
    try {
      // Buscar diagnóstico para esta cita
      const diagnosisRes = await axiosClient.get('/api/diagnoses');
      const allDiagnoses = diagnosisRes.data || [];
      // Buscar por appointment.id en el objeto diagnosis
      const appointmentDiagnosis = allDiagnoses.find((d: any) => d.appointment?.id === appointment.id);
      setAppointmentDiagnosis(appointmentDiagnosis || null);
    } catch (err) {
      console.error(err);
      setAppointmentDiagnosis(null);
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  const closeAppointmentDetail = () => {
    setSelectedAppointment(null);
    setAppointmentDiagnosis(null);
  };

  const filtered = appointments.filter(a => {
    const statusOk = filterStatus === 'ALL' || String(a.status).toUpperCase() === filterStatus;
    const serviceOk = !filterServiceId || String(a.service?.id) === String(filterServiceId);
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
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <Text style={styles.headerEmoji}>📅</Text>
                <Text style={[typography.h2, styles.headerTitle]}>Mis Citas</Text>
                <Text style={styles.headerSubtitle}>Gestiona tus citas asignadas</Text>
              </View>

              <View style={styles.filterButtonContainer}>
                <Button
                  title={showFilters ? '🔽 Ocultar Filtros' : '⚙️ Mostrar Filtros'}
                  onPress={() => setShowFilters(!showFilters)}
                  style={{ backgroundColor: colors.primary }}
                  textStyle={{ fontSize: 14 }}
                />
              </View>

              {showFilters && (
                <Card style={styles.filterCard}>
                  <View style={styles.filterGroup}>
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
                  </View>

                  <View style={styles.filterGroup}>
                    <Text style={styles.filterLabel}>Servicio</Text>
                    <View style={styles.pickerBox}>
                      <Picker selectedValue={filterServiceId} onValueChange={(v) => setFilterServiceId(v)}>
                        <Picker.Item label="Todos" value={null} />
                        {services.map((s: any) => <Picker.Item key={s.id} label={s.name} value={s.id} />)}
                      </Picker>
                    </View>
                  </View>

                  <Button 
                    title="🔄 Limpiar Filtros" 
                    onPress={() => { setFilterStatus('ALL'); setFilterServiceId(null); }} 
                    style={{ backgroundColor: colors.secondary }}
                    textStyle={{ fontSize: 14 }}
                  />
                </Card>
              )}
            </View>
          }
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={fetchAppointments}
          ListEmptyComponent={
            <EmptyState 
              title="Sin citas" 
              message="No hay citas asignadas. Desliza hacia abajo para actualizar."
            />
          }
        />
      )}

      {/* Modal de Detalles de Cita */}
      <DetailModal visible={!!selectedAppointment} onClose={closeAppointmentDetail}>
        <ScrollView style={styles.modalContent}>
          {loadingDiagnosis ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : selectedAppointment ? (
            <>
              <View style={styles.headerSection}>
                <Text style={styles.headerSectionEmoji}>📋</Text>
                <Text style={[typography.h2, styles.headerSectionTitle]}>Detalles de Cita</Text>
                <Text style={styles.headerSectionSubtitle}>{selectedAppointment.pet?.name || 'Mascota'}</Text>
              </View>

              <Card style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>🐾 Mascota:</Text>
                  <Text style={styles.detailValue}>{selectedAppointment.pet?.name || '—'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>👤 Propietario:</Text>
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
                      {String(selectedAppointment.status).charAt(0).toUpperCase() + String(selectedAppointment.status).slice(1)}
                    </Text>
                  </View>
                </View>
              </Card>

              {/* Sección de Diagnóstico */}
              <Card style={styles.detailCard}>
                <Text style={[typography.h3, { color: colors.primary, marginBottom: 14 }]}>📋 Diagnóstico</Text>
                
                {appointmentDiagnosis ? (
                  <>
                    {appointmentDiagnosis.description && (
                      <View style={styles.diagnosisSection}>
                        <Text style={styles.diagnosisTitle}>Diagnóstico</Text>
                        <Text style={styles.diagnosisText}>{appointmentDiagnosis.description}</Text>
                      </View>
                    )}
                    
                    {appointmentDiagnosis.treatment && (
                      <View style={styles.diagnosisSection}>
                        <Text style={styles.diagnosisTitle}>Tratamiento</Text>
                        <Text style={styles.diagnosisText}>{appointmentDiagnosis.treatment}</Text>
                      </View>
                    )}
                    
                    {appointmentDiagnosis.medications && (
                      <View style={styles.diagnosisSection}>
                        <Text style={styles.diagnosisTitle}>Medicamentos</Text>
                        <Text style={styles.diagnosisText}>{appointmentDiagnosis.medications}</Text>
                      </View>
                    )}
                  </>
                ) : (
                  <Text style={[typography.caption, { color: colors.muted, textAlign: 'center', marginVertical: 12 }]}>
                    No hay diagnóstico registrado para esta cita
                  </Text>
                )}
              </Card>
            </>
          ) : null}
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
  center: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
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
  diagnosisSection: {
    marginVertical: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  diagnosisTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 6,
  },
  diagnosisText: {
    fontSize: 13,
    color: colors.darkGray,
    lineHeight: 18,
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

  // Filter Button
  filterButtonContainer: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  // Filter Card
  filterCard: {
    marginHorizontal: 12,
    marginBottom: 16,
  },
  filterGroup: {
    marginBottom: 14,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 8,
  },
  pickerBox: { 
    borderWidth: 1, 
    borderColor: colors.lightGray, 
    borderRadius: 10, 
    backgroundColor: colors.white, 
    overflow: 'hidden' 
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
    gap: 6,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonSuccess: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  buttonPrimary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  buttonWarning: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.warning,
    marginRight: 6,
  },
  buttonDanger: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
