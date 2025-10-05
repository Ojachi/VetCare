import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';

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
      <FlatList
        data={diagnoses}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.pet?.name || 'Sin mascota'}</Text>
            <Text>{new Date(item.createdAt).toLocaleString()}</Text>
            <Text>{item.description}</Text>
            <Text>Veterinario: {item.veterinarian?.name || 'N/A'}</Text>
          </View>
        )}
        refreshing={loading}
        onRefresh={fetchDiagnoses}
        ListEmptyComponent={() => <Text style={{ padding: 20 }}>No hay diagnósticos</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { padding: 12, margin: 8, backgroundColor: '#fff', borderRadius: 10 },
  title: { fontWeight: 'bold' },
});
