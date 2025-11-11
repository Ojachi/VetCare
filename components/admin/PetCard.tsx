import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Card from '../ui/Card';

type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string;
  owner?: { id?: number; name: string; email?: string; role?: string; address?: string; phone?: string };
  active?: boolean;
};

type Props = {
  pet: Pet;
  onOpenDetail: (pet: Pet) => void;
};

export default function PetCard({ pet, onOpenDetail }: Props) {
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

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onOpenDetail(pet)}>
      <Card style={[styles.card, { borderTopWidth: 4, borderTopColor: colors.primary }]}>
        <View style={styles.header}>
          <Text style={styles.speciesIcon}>{speciesIcon(pet.species)}</Text>
          <View style={styles.headerContent}>
            <Text style={[typography.h3, styles.name]}>{pet.name}</Text>
            <Text style={styles.species}>{pet.species}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.content}>
          {pet.owner && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>👨‍👩‍👧</Text>
              <Text style={styles.infoText}>{pet.owner.name}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🏷️</Text>
            <Text style={styles.infoText}>{pet.breed}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  speciesIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerContent: {
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
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginBottom: 12,
  },
  content: {
    gap: 8,
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
  infoText: {
    fontSize: 13,
    color: colors.muted,
  },
});
