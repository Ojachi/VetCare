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
      <Card style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={[typography.h3, styles.title]} numberOfLines={1}>{title}</Text>
            <Text style={[typography.subtitle, styles.line]} numberOfLines={1}>Mascota: <Text style={styles.value}>{petName}</Text></Text>
            <Text style={[typography.subtitle, styles.line]} numberOfLines={1}>Dueño: <Text style={styles.value}>{ownerName}</Text></Text>
            <Text style={[typography.subtitle, styles.line]} numberOfLines={1}>Veterinario: <Text style={styles.value}>{vetName}</Text></Text>
            <Text style={[typography.caption, styles.line]}>Tratamiento: <Text style={styles.value}>{treatment}</Text></Text>
            <Text style={[typography.caption, styles.line]}>Fecha: {formatDisplayDateTime(date)}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>Diagnóstico</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },
  title: { marginBottom: 4 },
  line: { marginTop: 4 },
  value: { fontWeight: '600' },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 16, alignSelf: 'flex-start' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
});
