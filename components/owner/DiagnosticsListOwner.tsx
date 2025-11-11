import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import { formatDisplayDate } from '../../utils/date';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';

type Diagnostic = { id: number; diagnosis: string; notes?: string; date: string; appointmentId?: number };

export default function DiagnosticsListOwner() {
  const router = useRouter();
  const params: any = (router as any).params || {};
  const petId = params?.petId;
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const url = petId ? `/api/diagnoses?petId=${petId}` : '/api/diagnoses';
        const res = await axiosClient.get<Diagnostic[]>(url);
        setDiagnostics(res.data);
      } catch (err) {
        alertApiError(err, 'No se pudieron cargar los diagnósticos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [petId]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (diagnostics.length === 0) return <View style={[styles.center, { backgroundColor: colors.background }]}><EmptyState title="Sin diagnósticos" message="Aún no hay diagnósticos disponibles." /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList data={diagnostics} keyExtractor={(i) => i.id.toString()} contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card>
            <Text style={typography.h3}>{item.diagnosis}</Text>
            {item.notes && <Text style={[typography.body, { marginTop: 4 }]}>Notas: {item.notes}</Text>}
            <Text style={[typography.caption, { marginTop: 6 }]}>Fecha: {formatDisplayDate(item.date)}</Text>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' }, list: { padding: 16 } });
