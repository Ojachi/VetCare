import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Card from '../ui/Card';

export default function AppointmentDetail({ appointment }: { appointment: any }) {
  const a = appointment ?? {};
  const pet = a.pet;
  const owner = a.owner ?? pet?.owner;
  const service = a.service;
  const vet = a.assignedTo ?? a.vet;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Card style={{ padding: 18 }}>
        <Text style={typography.h3}>Detalle de la cita</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, badgeColor(a.status)]}>
            <Text style={styles.badgeText}>{a.status ?? '—'}</Text>
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Paciente</Text>
          <Text style={styles.valueLine}><Text style={styles.label}>Nombre:</Text> {pet?.name ?? '—'}</Text>
          <Text style={styles.valueLine}><Text style={styles.label}>Especie:</Text> {pet?.species ?? '—'}</Text>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Propietario</Text>
          <Text style={styles.valueLine}><Text style={styles.label}>Nombre:</Text> {owner?.name ?? '—'}</Text>
          <Text style={styles.valueLine}><Text style={styles.label}>Tel:</Text> {owner?.phone ?? '—'}</Text>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Servicio</Text>
          <Text style={styles.valueLine}>{service?.name ?? '—'}</Text>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Veterinario</Text>
          <Text style={styles.valueLine}>{vet?.name ?? '—'}</Text>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Fecha</Text>
          <Text style={styles.valueLine}>{a.startDateTime ?? a.date ?? '—'}</Text>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Nota</Text>
          <Text style={styles.valueLine}>{a.note ?? '—'}</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 12 },
  sectionBlock: { marginTop: 14 },
  sectionTitle: { ...typography.subtitle, fontSize: 15 },
  valueLine: { ...typography.body, marginTop: 4 },
  label: { fontWeight: '600' },
  badgeRow: { flexDirection: 'row', marginTop: 8 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, alignSelf: 'flex-start', marginTop: 6 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
});

function badgeColor(status?: string) {
  switch (status) {
    case 'PENDING': return { backgroundColor: colors.secondary };
    case 'ACCEPTED': return { backgroundColor: colors.primary };
    case 'COMPLETED': return { backgroundColor: '#2d9d78' };
    case 'CANCELED': return { backgroundColor: colors.danger };
    default: return { backgroundColor: colors.darkGray };
  }
}
