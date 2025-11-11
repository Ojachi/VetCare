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
import colors from '../../styles/colors';
import typography from '../../styles/typography';

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
  };
};

export default function DiagnosticosOwner() {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiagnostics();
  }, []);

  const loadDiagnostics = async () => {
    try {
      const response = await axiosClient.get<ApiDiagnosis[]>('/api/diagnoses');
      const formatted = (response.data || []).map(formatApiDiagnosis);
      setDiagnostics(formatted);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los diagnósticos');
    } finally {
      setLoading(false);
    }
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
          <Text style={[typography.h2, { color: colors.darkGray, marginBottom: 4 }]}>🏥 Mis Diagnósticos</Text>
          <Text style={[typography.body, { color: colors.muted }]}>Historial médico de tus mascotas</Text>
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
          <View style={styles.diagnosticCard}>
            <View style={styles.diagnosticHeader}>
              <Text style={[typography.h3, { color: colors.primary, flex: 1 }]}>{item.petName}</Text>
              <Text style={styles.dateTag}>{item.date}</Text>
            </View>
            
            <View style={styles.diagnosticContent}>
              <Text style={styles.diagnosisLabel}>🔍 Diagnóstico</Text>
              <Text style={styles.diagnosisText}>{item.diagnosis}</Text>
            </View>
            
            <View style={styles.veterinarianSection}>
              <Text style={styles.vetLabel}>👨‍⚕️ Veterinario</Text>
              <Text style={styles.vetName}>{item.veterinarian}</Text>
            </View>
          </View>
        )}
      />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
