import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import DetailModal from '../../components/ui/DetailModal';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

type ApiDiagnosis = {
  id: number;
  appointment: {
    id: number;
    pet: { id: number; name: string };
    assignedTo: { name: string };
    startDateTime: string;
  };
  description?: string;
  treatment?: string;
  medications?: string;
};

type Diagnostic = {
  id: string;
  petId: string;
  petName: string;
  diagnosis: string;
  date: string;
  veterinarian: string;
  treatment?: string;
  medications?: string;
};

const formatApiDiagnosis = (diag: ApiDiagnosis): Diagnostic => {
  const dateTime = new Date(diag.appointment.startDateTime);
  const date = dateTime.toLocaleDateString('es-CO');
  return {
    id: String(diag.id),
    petId: String(diag.appointment.pet.id),
    petName: diag.appointment.pet.name,
    diagnosis: diag.description || diag.treatment || 'Sin descripción',
    date,
    veterinarian: diag.appointment.assignedTo.name,
    treatment: diag.treatment,
    medications: diag.medications,
  };
};

export default function DiagnosticosOwner() {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<Diagnostic | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { petId } = useLocalSearchParams<{ petId?: string }>();

  useEffect(() => {
    loadDiagnostics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const loadDiagnostics = async () => {
    try {
      // Si hay petId, cargar diagnósticos específicos de esa mascota
      // Si no hay petId, cargar todos los diagnósticos del owner
      const endpoint = petId ? `/api/diagnoses/pet/${petId}` : '/api/diagnoses';
      const response = await axiosClient.get<ApiDiagnosis[]>(endpoint);
      const formatted = (response.data || []).map(formatApiDiagnosis);
      setDiagnostics(formatted);
    } catch (error) {
      alertApiError(error, 'No se pudieron cargar los diagnósticos');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (diagnostic: Diagnostic) => {
    setSelectedDiagnostic(diagnostic);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedDiagnostic(null);
    setModalVisible(false);
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
          <Text style={[typography.h2, { color: colors.darkGray, marginBottom: 4 }]}>🏥 {petId ? 'Diagnósticos de Mascota' : 'Mis Diagnósticos'}</Text>
          <Text style={[typography.body, { color: colors.muted }]}>{petId ? 'Historial médico de la mascota' : 'Historial médico de tus mascotas'}</Text>
        </View>
      </View>
      <FlatList
        data={diagnostics}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[typography.body, { fontSize: 16, marginBottom: 8 }]}>📋 No hay diagnósticos registrados</Text>
            <Text style={[typography.body, { color: colors.muted, textAlign: 'center' }]}>
              Los diagnósticos se mostrarán aquí una vez que se registren
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.diagnosticCard}>
              <View style={styles.diagnosticHeader}>
                <Text style={[typography.h3, { color: colors.primary, flex: 1 }]}>{item.petName}</Text>
                <Text style={styles.dateTag}>{item.date}</Text>
              </View>
              
              <View style={styles.diagnosticContent}>
                <Text style={styles.diagnosisLabel}>📝 Diagnóstico</Text>
                <Text style={styles.diagnosisText}>{item.diagnosis}</Text>
              </View>
              
              <View style={styles.veterinarianSection}>
                <Text style={styles.vetLabel}>👨‍⚕️ Veterinario</Text>
                <Text style={styles.vetName}>{item.veterinarian}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal de Detalle */}
      <DetailModal visible={modalVisible} onClose={closeModal}>
        {selectedDiagnostic && (
          <ScrollView 
            style={styles.modalContent}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderEmoji}>🏥</Text>
              <Text style={[typography.h2, styles.modalHeaderTitle]}>Detalles del Diagnóstico</Text>
              <Text style={styles.modalHeaderSubtitle}>{selectedDiagnostic.petName}</Text>
            </View>

            {/* Pet Info */}
            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>🐾 Mascota</Text>
                <Text style={styles.detailValue}>{selectedDiagnostic.petName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📅 Fecha</Text>
                <Text style={styles.detailValue}>{selectedDiagnostic.date}</Text>
              </View>
            </View>

            {/* Diagnosis */}
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>📝 Diagnóstico</Text>
              <Text style={styles.detailTextContent}>{selectedDiagnostic.diagnosis}</Text>
            </View>

            {/* Treatment */}
            {selectedDiagnostic.treatment && (
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>💊 Tratamiento</Text>
                <Text style={styles.detailTextContent}>{selectedDiagnostic.treatment}</Text>
              </View>
            )}

            {/* Medications */}
            {selectedDiagnostic.medications && (
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>🧬 Medicamentos</Text>
                <Text style={styles.detailTextContent}>{selectedDiagnostic.medications}</Text>
              </View>
            )}

            {/* Veterinarian */}
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>👨‍⚕️ Veterinario</Text>
              <Text style={styles.detailValue}>{selectedDiagnostic.veterinarian}</Text>
            </View>
          </ScrollView>
        )}
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
  },
  headerContent: {
    flex: 1,
  },
  
  list: { padding: 16, paddingTop: 12 },
  
  emptyContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  diagnosticCard: {
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
  diagnosticHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  dateTag: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    backgroundColor: colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  diagnosticContent: {
    marginBottom: 12,
  },
  diagnosisLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: 4,
  },
  diagnosisText: {
    fontSize: 14,
    color: colors.darkGray,
    lineHeight: 20,
  },
  veterinarianSection: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  vetLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: 3,
  },
  vetName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },

  // Modal Styles
  modalContent: {
    paddingVertical: 20,
    paddingHorizontal: 4,
    flexGrow: 1,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.lightGray,
  },
  modalHeaderEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  modalHeaderTitle: {
    color: colors.darkGray,
    marginBottom: 4,
  },
  modalHeaderSubtitle: {
    fontSize: 14,
    color: colors.muted,
  },
  detailCard: {
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  detailValue: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  detailTextContent: {
    fontSize: 13,
    color: colors.darkGray,
    lineHeight: 18,
    marginTop: 8,
  },
});
