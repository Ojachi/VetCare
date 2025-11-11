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

  const badgeColor = (status?: string) => {
    switch (status) {
      case 'PENDING': return colors.secondary;
      case 'ACCEPTED': return colors.primary;
      case 'COMPLETED': return '#2d9d78';
      case 'CANCELED': return colors.danger;
      default: return colors.darkGray;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📅</Text>
        <View>
          <Text style={typography.h2}>Detalle de la cita</Text>
          <View style={[styles.badge, { backgroundColor: badgeColor(a.status) }]}>
            <Text style={styles.badgeText}>{a.status ?? '—'}</Text>
          </View>
        </View>
      </View>

      <Card style={[styles.sectionCard, { borderTopColor: colors.primary, borderTopWidth: 4 }]}>
        <Text style={[typography.subtitle, { marginBottom: 12 }]}>🐾 Paciente</Text>
        <View style={styles.infoRow}>
          <Text style={[typography.caption, { color: colors.muted }]}>Nombre</Text>
          <Text style={typography.body}>{pet?.name ?? '—'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={[typography.caption, { color: colors.muted }]}>Especie</Text>
          <Text style={typography.body}>{pet?.species ?? '—'}</Text>
        </View>
      </Card>

      <Card style={[styles.sectionCard, { borderTopColor: colors.success, borderTopWidth: 4 }]}>
        <Text style={[typography.subtitle, { marginBottom: 12 }]}>👥 Propietario</Text>
        <View style={styles.infoRow}>
          <Text style={[typography.caption, { color: colors.muted }]}>Nombre</Text>
          <Text style={typography.body}>{owner?.name ?? '—'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={[typography.caption, { color: colors.muted }]}>Teléfono</Text>
          <Text style={typography.body}>{owner?.phone ?? '—'}</Text>
        </View>
      </Card>

      <Card style={[styles.sectionCard, { borderTopColor: colors.secondary, borderTopWidth: 4 }]}>
        <Text style={[typography.subtitle, { marginBottom: 12 }]}>🏥 Servicio</Text>
        <Text style={typography.body}>{service?.name ?? '—'}</Text>
      </Card>

      <Card style={[styles.sectionCard, { borderTopColor: colors.warning, borderTopWidth: 4 }]}>
        <Text style={[typography.subtitle, { marginBottom: 12 }]}>👨‍⚕️ {vet ? 'Veterinario' : 'Asignado a'}</Text>
        <Text style={typography.body}>{vet?.name ?? '—'}</Text>
      </Card>

      <Card style={[styles.sectionCard, { borderTopColor: colors.danger, borderTopWidth: 4 }]}>
        <Text style={[typography.subtitle, { marginBottom: 12 }]}>📍 Fecha</Text>
        <Text style={typography.body}>{a.startDateTime ?? a.date ?? '—'}</Text>
        <View style={styles.divider} />
        <Text style={[typography.caption, { color: colors.muted, marginTop: 12 }]}>Nota</Text>
        <Text style={[typography.body, { marginTop: 6 }]}>{a.note?.length ? a.note : '—'}</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  headerEmoji: { fontSize: 40 },
  sectionCard: { padding: 12, marginBottom: 12 },
  infoRow: { marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#EEF2F3', marginVertical: 12 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, alignSelf: 'flex-start', marginTop: 8 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
