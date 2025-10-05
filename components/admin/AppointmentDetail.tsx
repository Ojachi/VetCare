import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function AppointmentDetail({ appointment }: { appointment: any }) {
  const a = appointment ?? {};
  const pet = a.pet;
  const owner = a.owner ?? pet?.owner;
  const service = a.service;
  const vet = a.assignedTo ?? a.vet;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Detalle de la cita</Text>

      <Text style={styles.section}>Estado: {a.status ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Paciente</Text>
      <Text style={styles.text}>Nombre: {pet?.name ?? '—'}</Text>
      <Text style={styles.text}>Especie: {pet?.species ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Propietario</Text>
      <Text style={styles.text}>Nombre: {owner?.name ?? '—'}</Text>
      <Text style={styles.text}>Tel: {owner?.phone ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Servicio</Text>
      <Text style={styles.text}>{service?.name ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Veterinario</Text>
      <Text style={styles.text}>{vet?.name ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Fecha</Text>
      <Text style={styles.text}>{a.startDateTime ?? a.date ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Nota</Text>
      <Text style={styles.text}>{a.note ?? '—'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginTop: 12 },
  text: { fontSize: 14, color: '#333', marginTop: 4 },
  section: { fontSize: 14, marginTop: 6 },
});
