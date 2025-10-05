import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';

type Diagnostic = { id: number; diagnosis: string; notes?: string; date: string; appointmentId?: number };

export default function ViewDiagnosticsOwner() {
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
      } catch {
        Alert.alert('Error', 'No se pudieron cargar los diagnósticos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [petId]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#007bff" /></View>;

  if (diagnostics.length === 0) return <View style={styles.center}><Text>No hay diagnósticos</Text></View>;

  return (
    <FlatList
      data={diagnostics}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.bold}>{item.diagnosis}</Text>
          {item.notes && <Text>Notas: {item.notes}</Text>}
          <Text>Fecha: {item.date.replace('T', ' ')}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 10, backgroundColor: '#fff' },
  bold: { fontWeight: 'bold' },
});
