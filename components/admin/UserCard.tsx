import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
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

export default function UserCard({ user, onShowDetail }: Props) {
  const roleEs: Record<string, string> = {
    ADMIN: 'Administrador',
    OWNER: 'Dueño de mascota',
    VETERINARIAN: 'Veterinario',
    EMPLOYEE: 'Empleado',
  };
  const roleLabel = roleEs[user.role] ?? user.role;
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onShowDetail(user)}>
      <Card>
        <Text style={typography.h3}>{user.name}</Text>
        <Text style={typography.subtitle}>{user.email}</Text>
        {!!user.address && (
          <Text style={[typography.body, { marginTop: 6 }]}>{user.address}</Text>
        )}
        {!!user.phone && <Text style={typography.body}>{user.phone}</Text>}
        <Text style={[typography.caption, { marginTop: 6 }]}>
          Rol: <Text style={{ fontWeight: '700', color: colors.primary }}>{roleLabel}</Text>
        </Text>
      </Card>
    </TouchableOpacity>
  );
}
