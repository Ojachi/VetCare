import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Card from '../ui/Card';

const speciesIcon = (species: string): string => {
  const icons: Record<string, string> = {
    PERRO: '🐕',
    GATO: '🐈',
    PAJARO: '🐦',
    CONEJO: '🐰',
    HAMSTER: '🐹',
  };
  return icons[species?.toUpperCase()] || '🐾';
};

export default function PetDetailContent({ pet }: { pet: any }) {
  if (!pet) return null;

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>{speciesIcon(pet.species)}</Text>
          <View style={styles.headerText}>
            <Text style={[typography.h2, styles.name]}>{pet.name}</Text>
            <Text style={styles.species}>{pet.species}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: pet.active ? colors.success : colors.danger }]}>
            <Text style={styles.statusText}>{pet.active ? 'Activo' : 'Inactivo'}</Text>
          </View>
        </View>
      </Card>

      {/* Pet Info Card */}
      <Card style={styles.infoCard}>
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🏷️</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Raza</Text>
              <Text style={styles.infoValue}>{pet.breed}</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Owner Info Card */}
      <Card style={[styles.ownerCard, { borderTopWidth: 4, borderTopColor: colors.secondary }]}>
        <Text style={[typography.h3, styles.ownerTitle]}>👨‍👩‍👧 Información del Dueño</Text>

        <View style={styles.ownerContent}>
          <View style={styles.ownerRow}>
            <Text style={styles.ownerIcon}>👤</Text>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerLabel}>Nombre</Text>
              <Text style={styles.ownerValue}>{pet.owner.name}</Text>
            </View>
          </View>

          <View style={styles.ownerRow}>
            <Text style={styles.ownerIcon}>✉️</Text>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerLabel}>Correo</Text>
              <Text style={styles.ownerValue}>{pet.owner.email}</Text>
            </View>
          </View>

          <View style={styles.ownerRow}>
            <Text style={styles.ownerIcon}>📱</Text>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerLabel}>Teléfono</Text>
              <Text style={styles.ownerValue}>{pet.owner.phone}</Text>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerCard: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderTopWidth: 4,
    borderTopColor: colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    color: colors.darkGray,
    marginBottom: 4,
  },
  species: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '600',
  },
  infoCard: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  infoSection: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 2,
    width: 22,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: '600',
  },
  ownerCard: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  ownerTitle: {
    color: colors.darkGray,
    marginBottom: 14,
  },
  ownerContent: {
    gap: 12,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ownerIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 2,
    width: 22,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
    marginBottom: 2,
  },
  ownerValue: {
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: '600',
  },
});
