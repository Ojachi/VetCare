import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Card from '../ui/Card';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  phone: string;
}

interface UserDetailContentProps {
  user: User | null;
  onChangeRole: (id: number, role: string) => void;
  onEditRequest: (user: User) => void;
}

const getRoleIcon = (role: string): string => {
  const icons: Record<string, string> = {
    ADMIN: '⚙️',
    OWNER: '👨‍👩‍👧',
    VETERINARIAN: '🏥',
    EMPLOYEE: '👤',
  };
  return icons[role] || '👤';
};

export default function UserDetailContent({ user, onChangeRole, onEditRequest }: UserDetailContentProps) {
  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>{getRoleIcon(user.role)}</Text>
          <View style={styles.headerText}>
            <Text style={[typography.h2, styles.name]}>{user.name}</Text>
            <Text style={styles.role}>
              {user.role === 'OWNER' ? 'Dueño de mascota' : user.role === 'VETERINARIAN' ? 'Veterinario' : user.role === 'ADMIN' ? 'Administrador' : 'Empleado'}
            </Text>
          </View>
        </View>
      </Card>

      {/* Info Card */}
      <Card style={styles.infoCard}>
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>✉️</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Correo Electrónico</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>

          {user.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📱</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            </View>
          )}

          {user.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Dirección</Text>
                <Text style={styles.infoValue}>{user.address}</Text>
              </View>
            </View>
          )}
        </View>
      </Card>

      {/* Role Selector Card */}
      <Card style={styles.roleCard}>
        <Text style={[typography.h3, styles.roleTitle]}>👤 Asignar Rol</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={user.role}
            style={styles.picker}
            onValueChange={(value) => onChangeRole(user.id, value)}
            dropdownIconColor={colors.primary}
          >
            <Picker.Item label="Dueño de mascota" value="OWNER" />
            <Picker.Item label="Veterinario" value="VETERINARIAN" />
            <Picker.Item label="Administrador" value="ADMIN" />
            <Picker.Item label="Empleado" value="EMPLOYEE" />
          </Picker>
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
  role: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
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
  roleCard: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderTopWidth: 4,
    borderTopColor: colors.secondary,
  },
  roleTitle: {
    color: colors.darkGray,
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
