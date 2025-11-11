import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { formatDisplayDateTime } from '../../utils/date';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';

type Diagnosis = {
  id: string;
  appointment?: {
    pet?: { name: string };
    owner?: { name: string };
    startDateTime?: string;
  };
  pet?: { name: string; owner?: { name: string } };
  vet?: { name: string };
  description?: string;
  treatment?: string;
  medications?: string;
  date?: string;
  active?: boolean;
};

export default function PatientHistory() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDiagnoses = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/diagnoses');
      setDiagnoses(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  return (
    <View style={styles.container}>
      {loading && diagnoses.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerEmoji}>🏥</Text>
              <Text style={[typography.h2, styles.headerTitle]}>Mis Pacientes</Text>
              <Text style={styles.headerSubtitle}>Historial de diagnósticos registrados</Text>
            </View>
          }
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
          data={diagnoses}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <Card style={styles.diagnosisCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[typography.h3, { color: colors.darkGray }]}>
                    🐾 {item.appointment?.pet?.name || item.pet?.name || 'Paciente desconocido'}
                  </Text>
                  <Text style={[typography.caption, { color: colors.muted, marginTop: 4 }]}>
                    Propietario: {item.appointment?.owner?.name || item.pet?.owner?.name || 'N/A'}
                  </Text>
                </View>
              </View>

              {item.description && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>📋 Diagnóstico</Text>
                  <Text style={styles.sectionContent}>{item.description}</Text>
                </View>
              )}

              {item.treatment && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>💊 Tratamiento</Text>
                  <Text style={styles.sectionContent}>{item.treatment}</Text>
                </View>
              )}

              {item.medications && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🧬 Medicamentos</Text>
                  <Text style={styles.sectionContent}>{item.medications}</Text>
                </View>
              )}

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  📅 {item.date || formatDisplayDateTime(item.appointment?.startDateTime)}
                </Text>
                <Text style={[styles.footerText, { marginLeft: 12 }]}>
                  👨‍⚕️ {item.vet?.name || 'Veterinario'}
                </Text>
              </View>
            </Card>
          )}
          refreshing={loading}
          onRefresh={fetchDiagnoses}
          ListEmptyComponent={
            <EmptyState 
              title="Sin diagnósticos" 
              message="No hay diagnósticos registrados. Desliza hacia abajo para actualizar."
            />
          }
        />
      )}
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

  // Diagnosis Card
  diagnosisCard: {
    marginVertical: 8,
  },
  cardHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },

  // Sections
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  sectionContent: {
    fontSize: 14,
    color: colors.darkGray,
    lineHeight: 20,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  footerText: {
    fontSize: 12,
    color: colors.muted,
  },
});
