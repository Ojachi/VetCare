import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import AppointmentScheduleFormOwner from '../../components/owner/AppointmentScheduleFormOwner';
import Button from '../../components/ui/Button';
import DetailModal from '../../components/ui/DetailModal';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

type ApiAppointment = {
  id: number;
  pet: { id: number; name: string };
  service: { id: number; name: string };
  startDateTime: string;
  status: string;
};

type Appointment = {
  id: string;
  petId: string;
  petName: string;
  date: string;
  time: string;
  service: string;
  status: string;
};

const formatApiAppointment = (apt: ApiAppointment): Appointment => {
  const dateTime = new Date(apt.startDateTime);
  const date = dateTime.toLocaleDateString('es-CO');
  const time = dateTime.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  return {
    id: String(apt.id),
    petId: String(apt.pet.id),
    petName: apt.pet.name,
    date,
    time,
    service: apt.service.name,
    status: apt.status,
  };
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pendiente':
      return colors.warning;
    case 'confirmada':
      return colors.success;
    case 'completada':
      return colors.primary;
    case 'cancelada':
      return colors.danger;
    default:
      return colors.muted;
  }
};

export default function CitasOwner() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await axiosClient.get<ApiAppointment[]>('/api/appointments');
      const formatted = (response.data || []).map(formatApiAppointment);
      setAppointments(formatted);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const openScheduleModal = (petId?: string) => {
    if (petId) {
      setSelectedPetId(petId);
    }
    setScheduleModalVisible(true);
  };

  const closeScheduleModal = () => {
    setSelectedPetId(null);
    setScheduleModalVisible(false);
  };

  const handleAppointmentScheduled = () => {
    closeScheduleModal();
    loadAppointments();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={[typography.h2, { color: colors.darkGray, marginBottom: 4 }]}>📅 Mis Citas</Text>
          <Text style={[typography.body, { color: colors.muted }]}>Gestiona tus citas veterinarias</Text>
        </View>
        <Button
          title="+ Agendar"
          onPress={() => openScheduleModal()}
          style={styles.addButton}
          textStyle={styles.addButtonText}
        />
      </View>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[typography.body, { fontSize: 16, marginBottom: 8 }]}>📋 No hay citas agendadas</Text>
            <Text style={[typography.body, { color: colors.muted, textAlign: 'center' }]}>
              Presiona el botón &quot;Agendar&quot; para programar una cita
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <Text style={[typography.h3, { color: colors.primary, flex: 1 }]}>{item.petName}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            
            <View style={styles.appointmentRow}>
              <View style={styles.appointmentField}>
                <Text style={styles.appointmentLabel}>🔧 Servicio</Text>
                <Text style={styles.appointmentValue}>{item.service}</Text>
              </View>
            </View>
            
            <View style={styles.appointmentRow}>
              <View style={styles.appointmentField}>
                <Text style={styles.appointmentLabel}>📅 Fecha</Text>
                <Text style={styles.appointmentValue}>{item.date}</Text>
              </View>
              <View style={[styles.appointmentField, { marginLeft: 16 }]}>
                <Text style={styles.appointmentLabel}>⏰ Hora</Text>
                <Text style={styles.appointmentValue}>{item.time}</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Schedule Appointment Modal */}
      <DetailModal visible={scheduleModalVisible} onClose={closeScheduleModal} showClose={false}>
        <AppointmentScheduleFormOwner
          petId={selectedPetId || undefined}
          onSaved={handleAppointmentScheduled}
          onCancel={closeScheduleModal}
        />
      </DetailModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
  },
  addButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginVertical: 0,
    backgroundColor: colors.primary,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  
  list: { padding: 16, paddingTop: 12 },
  
  emptyContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  appointmentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  appointmentRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  appointmentField: {
    flex: 1,
  },
  appointmentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: 4,
  },
  appointmentValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.darkGray,
  },
});
