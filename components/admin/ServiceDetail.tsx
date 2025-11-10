import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ServiceDetail({ service }: { service: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{service?.name ?? '—'}</Text>
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.text}>{service?.description ?? '—'}</Text>
      </View>
      <View style={styles.inlineGroup}>
        <View style={styles.inlineItem}>
          <Text style={styles.sectionTitle}>Precio</Text>
          <Text style={styles.text}>${service?.price ?? '—'} COP</Text>
        </View>
        <View style={styles.inlineItem}>
          <Text style={styles.sectionTitle}>Duración</Text>
          <Text style={styles.text}>{service?.durationMinutes ?? '—'} min</Text>
        </View>
      </View>
      <View style={styles.inlineGroup}>
        <View style={styles.inlineItem}>
          <Text style={styles.sectionTitle}>Requiere Vet</Text>
          <Text style={styles.text}>{service?.requiresVeterinarian ? 'Sí' : 'No'}</Text>
        </View>
        <View style={styles.inlineItem}>
          <Text style={styles.sectionTitle}>Estado</Text>
          <Text style={styles.text}>{service?.active ? 'Activo' : 'Inactivo'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8, width: '100%' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  sectionBlock: { marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginTop: 12 },
  text: { fontSize: 14, color: '#333', marginTop: 4 },
  inlineGroup: { flexDirection: 'row', marginTop: 8 },
  inlineItem: { flex: 1, paddingRight: 8 },
});
