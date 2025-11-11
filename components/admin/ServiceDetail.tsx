import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Card from '../ui/Card';

export default function ServiceDetail({ service }: { service: any }) {
  const getStatusColor = (active: boolean) => active ? colors.primary : colors.danger;
  const getStatusText = (active: boolean) => active ? 'Activo' : 'Inactivo';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🏥</Text>
        <View>
          <Text style={typography.h2}>{service?.name ?? '—'}</Text>
          <Text style={[typography.caption, { color: colors.muted }]}>Detalles del servicio</Text>
        </View>
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={[typography.caption, { color: colors.muted }]}>📝 Descripción</Text>
          <Text style={[typography.body, { marginTop: 6 }]}>{service?.description ?? '—'}</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={[typography.caption, { color: colors.muted }]}>💰 Precio</Text>
            <Text style={[typography.body, { marginTop: 6, fontSize: 16, fontWeight: '700', color: colors.primary }]}>${service?.price ?? '—'} COP</Text>
          </View>
          <View style={styles.column}>
            <Text style={[typography.caption, { color: colors.muted }]}>⏱️ Duración</Text>
            <Text style={[typography.body, { marginTop: 6, fontSize: 16, fontWeight: '700' }]}>{service?.durationMinutes ?? '—'} min</Text>
          </View>
        </View>
        <View style={styles.divider} />

        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={[typography.caption, { color: colors.muted }]}>🏥 Requiere Vet</Text>
            <Text style={[typography.body, { marginTop: 6 }]}>{service?.requiresVeterinarian ? 'Sí' : 'No'}</Text>
          </View>
          <View style={styles.column}>
            <Text style={[typography.caption, { color: colors.muted }]}>Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(service?.active) }]}>
              <Text style={styles.statusText}>{getStatusText(service?.active)}</Text>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  headerEmoji: { fontSize: 40, marginRight: 8 },
  infoCard: { padding: 12 },
  infoRow: { marginBottom: 8 },
  twoColumn: { flexDirection: 'row', gap: 16 },
  column: { flex: 1 },
  divider: { height: 1, backgroundColor: '#EEF2F3', marginVertical: 12 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, alignSelf: 'flex-start', marginTop: 6 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
