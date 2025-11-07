import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import typography from '../../styles/typography';
import { formatDisplayDateTime } from '../../utils/date';
import Card from '../ui/Card';

export default function MedicalRecordCard({ record, onPress }: { record: any; onPress: (r: any) => void }) {
  const appointment = record.appointment;
  const petName = appointment?.pet?.name ?? 'N/A';
  const ownerName = appointment?.owner?.name ?? appointment?.pet?.owner?.name ?? 'N/A';
  const serviceName = appointment?.service?.name ?? 'N/A';
  const vetName = appointment?.assignedTo?.name ?? record.vet?.name ?? 'N/A';
  const title = record.treatment || record.description || 'Sin resumen';
  const date = record.date ?? appointment?.startDateTime ?? 'N/A';

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onPress(record)}>
      <Card>
        <View>
          <Text style={typography.h3}>{title}</Text>
          <Text style={typography.subtitle}>{petName} — {serviceName}</Text>
          <Text style={[typography.body, { marginTop: 6 }]}>Dueño: {ownerName} • Veterinario: {vetName}</Text>
          <Text style={typography.caption}>Fecha: {formatDisplayDateTime(date)}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
