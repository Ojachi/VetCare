import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { formatDisplayDateTime } from '../../utils/date';
import Card from '../ui/Card';

export default function MedicalRecordCard({ record, onPress }: { record: any; onPress: (r: any) => void }) {
  const appointment = record.appointment;
  const petName = appointment?.pet?.name ?? '—';
  const ownerName = appointment?.owner?.name ?? appointment?.pet?.owner?.name ?? '—';
  const vetName = appointment?.assignedTo?.name ?? record.vet?.name ?? '—';
  const treatment = record.treatment || '—';
  const title = treatment.length > 28 ? treatment.substring(0, 28) + '…' : treatment;
  const date = record.date ?? appointment?.startDateTime ?? '';

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onPress(record)}>
      <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: colors.danger }]}>
        <View style={styles.header}>
          <Text style={styles.icon}>📋</Text>
          <View style={styles.headerContent}>
            <Text style={[typography.h3, styles.title]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.date}>{formatDisplayDateTime(date)}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.danger }]}>
            <Text style={styles.badgeText}>Diagnóstico</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.content}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🐾</Text>
            <Text style={styles.infoLabel}>Mascota:</Text>
            <Text style={styles.infoValue}>{petName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👨‍👩‍👧</Text>
            <Text style={styles.infoLabel}>Dueño:</Text>
            <Text style={styles.infoValue}>{ownerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🏥</Text>
            <Text style={styles.infoLabel}>Veterinario:</Text>
            <Text style={styles.infoValue}>{vetName}</Text>
          </View>
          <View style={[styles.infoRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.lightGray }]}>
            <Text style={styles.infoIcon}>💊</Text>
            <Text style={[styles.infoLabel, { flex: 1 }]}>Tratamiento:</Text>
          </View>
          <Text style={styles.treatmentText}>{treatment}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    color: colors.darkGray,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.muted,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginBottom: 12,
  },
  content: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 18,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: colors.darkGray,
    fontWeight: '600',
  },
  treatmentText: {
    fontSize: 13,
    color: colors.darkGray,
    fontStyle: 'italic',
    marginLeft: 26,
    marginTop: 6,
  },
});
