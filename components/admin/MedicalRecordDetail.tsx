import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { formatDisplayDateTime } from '../../utils/date';

export default function MedicalRecordDetail({ record }: { record: any }) {
  const appointment = record.appointment;
  const pet = appointment?.pet;
  const owner = appointment?.owner ?? pet?.owner;
  const service = appointment?.service;
  const vet = appointment?.assignedTo ?? record.vet;
  const status = String(appointment?.status ?? '').toUpperCase();

  return (
    <ScrollView style={styles.container}>
      <Text style={typography.h3}>Historial Médico</Text>
      {!!status && (
        <View style={styles.badgeRow}>
          <View style={[styles.badge, badgeColor(status)]}><Text style={styles.badgeText}>{mapStatusToSpanish(status)}</Text></View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Resumen</Text>
      <Text style={styles.text}>{record.description ?? record.treatment ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Tratamiento</Text>
      <Text style={styles.text}>{record.treatment ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Medicamentos</Text>
      <Text style={styles.text}>{record.medications ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Cita</Text>
      <Text style={styles.text}>Servicio: {service?.name ?? '—'}</Text>
      <Text style={styles.text}>Fecha cita: {formatDisplayDateTime(appointment?.startDateTime ?? record.date ?? '')}</Text>
      <Text style={styles.text}>Estado: {mapStatusToSpanish(status) || '—'}</Text>
      <Text style={styles.text}>Nota: {appointment?.note ?? '—'}</Text>
      <Text style={styles.text}>Agendada por: {appointment?.scheduleBy?.name ?? '—'}</Text>
      <Text style={styles.text}>Asignado a: {appointment?.assignedTo?.name ?? vet?.name ?? '—'}</Text>
      {service ? (
        <View style={{ marginTop: 6 }}>
          <Text style={styles.text}>Precio: {service.price != null ? `$${service.price}` : '—'}</Text>
          <Text style={styles.text}>Duración: {service.durationMinutes != null ? `${service.durationMinutes} min` : '—'}</Text>
          <Text style={styles.text}>Requiere veterinario: {service.requiresVeterinarian ? 'Sí' : 'No'}</Text>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Paciente</Text>
      <Text style={styles.text}>Nombre: {pet?.name ?? '—'}</Text>
      <Text style={styles.text}>Especie: {pet?.species ?? '—'}</Text>
      <Text style={styles.text}>Raza: {pet?.breed ?? '—'}</Text>
      <Text style={styles.text}>Sexo: {pet?.sex ?? '—'}</Text>
      <Text style={styles.text}>Edad: {pet?.age ?? '—'}</Text>
      <Text style={styles.text}>Peso: {pet?.weight != null ? `${pet.weight} kg` : '—'}</Text>

      <Text style={styles.sectionTitle}>Propietario</Text>
      <Text style={styles.text}>Nombre: {owner?.name ?? '—'}</Text>
      <Text style={styles.text}>Teléfono: {owner?.phone ?? '—'}</Text>
      <Text style={styles.text}>Email: {owner?.email ?? '—'}</Text>
      <Text style={styles.text}>Dirección: {owner?.address ?? '—'}</Text>

      <Text style={styles.sectionTitle}>Veterinario</Text>
      <Text style={styles.text}>Nombre: {vet?.name ?? '—'}</Text>
      <Text style={styles.text}>Email: {vet?.email ?? '—'}</Text>
      <Text style={styles.text}>Teléfono: {vet?.phone ?? '—'}</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.white },
  sectionTitle: { ...typography.subtitle, marginTop: 12 } as any,
  text: { ...typography.body, marginTop: 4 } as any,
  badgeRow: { flexDirection: 'row', marginTop: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, alignSelf: 'flex-start', marginBottom: 6 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});

function mapStatusToSpanish(status: string): string {
  switch (status) {
    case 'PENDING': return 'Pendiente';
    case 'ACCEPTED': return 'Aceptada';
    case 'CONFIRMED': return 'Confirmada';
    case 'COMPLETED': return 'Completada';
    case 'CANCELLED':
    case 'CANCELED': return 'Cancelada';
    default: return status;
  }
}

function badgeColor(status: string) {
  switch (status) {
    case 'PENDING': return { backgroundColor: colors.secondary };
    case 'ACCEPTED': return { backgroundColor: colors.success };
    case 'CONFIRMED': return { backgroundColor: colors.primary };
    case 'COMPLETED': return { backgroundColor: '#2d9d78' };
    case 'CANCELLED':
    case 'CANCELED': return { backgroundColor: colors.danger };
    default: return { backgroundColor: colors.darkGray };
  }
}
