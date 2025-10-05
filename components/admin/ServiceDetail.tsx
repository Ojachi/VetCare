import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function ServiceDetail({ service }: { service: any }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{service?.name ?? '—'}</Text>
      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.text}>{service?.description ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Precio</Text>
      <Text style={styles.text}>${service?.price ?? '—'} COP</Text>

      <Text style={styles.sectionTitle}>Duración</Text>
      <Text style={styles.text}>{service?.durationMinutes ?? '—'} minutos</Text>

      <Text style={styles.sectionTitle}>Requiere Veterinario</Text>
      <Text style={styles.text}>{service?.requiresVeterinarian ? 'Sí' : 'No'}</Text>

      <Text style={styles.sectionTitle}>Estado</Text>
      <Text style={styles.text}>{service?.active ? 'Activo' : 'Inactivo'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginTop: 12 },
  text: { fontSize: 14, color: '#333', marginTop: 6 },
});
