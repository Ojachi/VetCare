import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Card from '../ui/Card';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  phone: string;
};

type Props = {
  user: User;
  onShowDetail: (user: User) => void;
};

const getRoleIcon = (role: string): string => {
  const icons: Record<string, string> = {
    ADMIN: '⚙️',
    OWNER: '👨‍👩‍👧',
    VETERINARIAN: '🏥',
    EMPLOYEE: '👤',
  };
  return icons[role] || '👤';
};

const getRoleColor = (role: string): string => {
  const roleColors: Record<string, string> = {
    ADMIN: colors.warning,
    OWNER: colors.primary,
    VETERINARIAN: colors.secondary,
    EMPLOYEE: colors.success,
  };
  return roleColors[role] || colors.muted;
};

export default function UserCard({ user, onShowDetail }: Props) {
  const roleEs: Record<string, string> = {
    ADMIN: 'Administrador',
    OWNER: 'Dueño de mascota',
    VETERINARIAN: 'Veterinario',
    EMPLOYEE: 'Empleado',
  };
  const roleLabel = roleEs[user.role] ?? user.role;
  const roleIcon = getRoleIcon(user.role);
  const roleColor = getRoleColor(user.role);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onShowDetail(user)}>
      <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: roleColor }]}>
        <View style={styles.header}>
          <Text style={styles.roleIcon}>{roleIcon}</Text>
          <View style={styles.headerContent}>
            <Text style={[typography.h3, styles.name]}>{user.name}</Text>
            <Text style={[styles.roleBadge, { backgroundColor: roleColor }]}>
              {roleLabel}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.content}>
          {user.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>✉️</Text>
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
          )}
          {user.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📱</Text>
              <Text style={styles.infoText}>{user.phone}</Text>
            </View>
          )}
          {user.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={[styles.infoText, { flex: 1 }]} numberOfLines={2}>
                {user.address}
              </Text>
            </View>
          )}
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  roleIcon: {
    fontSize: 32,
    marginRight: 12,
    marginTop: 2,
  },
  headerContent: {
    flex: 1,
  },
  name: {
    marginBottom: 6,
    color: colors.darkGray,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
    overflow: 'hidden',
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
