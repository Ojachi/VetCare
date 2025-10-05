import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MedicalRecordCard({ record, onPress }: { record: any; onPress: (r: any) => void }) {
  const appointment = record.appointment;
  const petName = appointment?.pet?.name ?? 'N/A';
  const ownerName = appointment?.owner?.name ?? appointment?.pet?.owner?.name ?? 'N/A';
  const serviceName = appointment?.service?.name ?? 'N/A';
  const vetName = appointment?.assignedTo?.name ?? record.vet?.name ?? 'N/A';
  const title = record.treatment || record.description || 'Sin resumen';
  const date = record.date ?? appointment?.startDateTime ?? 'N/A';

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(record)}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{petName} — {serviceName}</Text>
        <Text style={styles.meta}>Dueño: {ownerName} • Veterinario: {vetName}</Text>
        <Text style={styles.date}>Fecha: {date}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#444', marginBottom: 6 },
  meta: { fontSize: 13, color: '#666', marginBottom: 6 },
  date: { fontSize: 13, color: '#666' },
});
