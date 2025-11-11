import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { formatDisplayDateTime } from '../../utils/date';
import Card from '../ui/Card';

export default function MedicalRecordDetail({ record }: { record: any }) {
  const appointment = record.appointment;
  const pet = appointment?.pet;
  const owner = appointment?.owner ?? pet?.owner;
  const service = appointment?.service;
  const vet = appointment?.assignedTo ?? record.vet;
  const status = String(appointment?.status ?? '').toUpperCase();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📋</Text>
        <Text style={[typography.h2, styles.headerTitle]}>Historial Médico</Text>
        {!!status && (
          <View style={[styles.badge, badgeColor(status)]}>
            <Text style={styles.badgeText}>{mapStatusToSpanish(status)}</Text>
          </View>
        )}
      </View>

      {/* Medical Info */}
      <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: colors.danger }]}>
        <Text style={[typography.h3, styles.cardTitle]}>💊 Información Médica</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Resumen</Text>
          <Text style={styles.value}>{record.description ?? record.treatment ?? '—'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Tratamiento</Text>
          <Text style={styles.value}>{record.treatment ?? '—'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Medicamentos</Text>
          <Text style={styles.value}>{record.medications ?? '—'}</Text>
        </View>
      </Card>

      {/* Appointment Info */}
      <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: colors.secondary }]}>
        <Text style={[typography.h3, styles.cardTitle]}>📅 Información de la Cita</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Servicio</Text>
          <Text style={styles.value}>{service?.name ?? '—'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Fecha y Hora</Text>
          <Text style={styles.value}>{formatDisplayDateTime(appointment?.startDateTime ?? record.date ?? '')}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Nota</Text>
          <Text style={styles.value}>{appointment?.note ?? '—'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Agendada por</Text>
          <Text style={styles.value}>{appointment?.scheduleBy?.name ?? '—'}</Text>
        </View>
        {service && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Precio del Servicio</Text>
              <Text style={styles.value}>{service.price != null ? `$${service.price}` : '—'}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Duración</Text>
              <Text style={styles.value}>{service.durationMinutes != null ? `${service.durationMinutes} minutos` : '—'}</Text>
            </View>
          </>
        )}
      </Card>

      {/* Pet Info */}
      <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: colors.primary }]}>
        <Text style={[typography.h3, styles.cardTitle]}>🐾 Paciente (Mascota)</Text>
        <View style={styles.twoColumnRow}>
          <View style={styles.section}>
            <Text style={styles.label}>Nombre</Text>
            <Text style={styles.value}>{pet?.name ?? '—'}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Especie</Text>
            <Text style={styles.value}>{pet?.species ?? '—'}</Text>
          </View>
        </View>
        <View style={styles.twoColumnRow}>
          <View style={styles.section}>
            <Text style={styles.label}>Raza</Text>
            <Text style={styles.value}>{pet?.breed ?? '—'}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Sexo</Text>
            <Text style={styles.value}>{pet?.sex ?? '—'}</Text>
          </View>
        </View>
        <View style={styles.twoColumnRow}>
          <View style={styles.section}>
            <Text style={styles.label}>Edad</Text>
            <Text style={styles.value}>{pet?.age ?? '—'}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Peso</Text>
            <Text style={styles.value}>{pet?.weight != null ? `${pet.weight} kg` : '—'}</Text>
          </View>
        </View>
      </Card>

      {/* Owner Info */}
      <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: colors.success }]}>
        <Text style={[typography.h3, styles.cardTitle]}>👨‍👩‍👧 Propietario</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{owner?.name ?? '—'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Teléfono</Text>
          <Text style={styles.value}>{owner?.phone ?? '—'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{owner?.email ?? '—'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Dirección</Text>
          <Text style={styles.value}>{owner?.address ?? '—'}</Text>
        </View>
      </Card>

      {/* Veterinarian Info */}
      <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: colors.warning }]}>
        <Text style={[typography.h3, styles.cardTitle]}>🏥 Veterinario Asignado</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{vet?.name ?? '—'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{vet?.email ?? '—'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Teléfono</Text>
          <Text style={styles.value}>{vet?.phone ?? '—'}</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    color: colors.darkGray,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  cardTitle: {
    color: colors.darkGray,
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: '500',
  },
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
