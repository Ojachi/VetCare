import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { formatDisplayDateTime } from '../../utils/date';

export default function PatientHistory() {
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
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
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
          data={diagnoses}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <Card>
              <Text style={typography.h3}>{item.pet?.name || 'Sin mascota'}</Text>
              <Text style={typography.subtitle}>{formatDisplayDateTime(item.createdAt)}</Text>
              <Text style={[typography.body, { marginTop: 6 }]}>{item.description}</Text>
              <Text style={typography.caption}>Veterinario: {item.veterinarian?.name || 'N/A'}</Text>
            </Card>
          )}
          refreshing={loading}
          onRefresh={fetchDiagnoses}
          ListEmptyComponent={<EmptyState title="Sin diagnósticos" message="No hay diagnósticos" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
