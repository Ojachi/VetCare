import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function MedicalRecordDetail({ record }: { record: any }) {
  const appointment = record.appointment;
  const pet = appointment?.pet;
  const owner = appointment?.owner ?? pet?.owner;
  const service = appointment?.service;
  const vet = appointment?.assignedTo ?? record.vet;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Historial Médico</Text>

      <Text style={styles.sectionTitle}>Resumen</Text>
      <Text style={styles.text}>{record.description ?? record.treatment ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Tratamiento</Text>
      <Text style={styles.text}>{record.treatment ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Medicamentos</Text>
      <Text style={styles.text}>{record.medications ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Cita</Text>
      <Text style={styles.text}>Servicio: {service?.name ?? '—'}</Text>
      <Text style={styles.text}>Fecha: {appointment?.startDateTime ?? record.date ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Paciente</Text>
      <Text style={styles.text}>Nombre: {pet?.name ?? '—'}</Text>
      <Text style={styles.text}>Especie: {pet?.species ?? '—'}</Text>
      <Text style={styles.text}>Raza: {pet?.breed ?? '—'}</Text>
      <Text style={styles.text}>Edad: {pet?.age ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Propietario</Text>
      <Text style={styles.text}>Nombre: {owner?.name ?? '—'}</Text>
      <Text style={styles.text}>Teléfono: {owner?.phone ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Veterinario</Text>
      <Text style={styles.text}>Nombre: {vet?.name ?? '—'}</Text>
      <Text style={styles.text}>Email: {vet?.email ?? '—'}</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginTop: 12 },
  text: { fontSize: 14, color: '#333', marginTop: 4 },
});
