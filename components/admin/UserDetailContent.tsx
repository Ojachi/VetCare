import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

export default function UserDetailContent({ user, onChangeRole, onEditRequest }: UserDetailContentProps) {

  if (!user) return null;
  return (
    <View>
      <Text style={styles.title}>Usuario: {user.name}</Text>
      <Text style={styles.items}>Correo: {user.email}</Text>
      <Text style={styles.items}>Dirección: {user.address || '—'}</Text>
      <Text style={styles.items}>Teléfono: {user.phone || '—'}</Text>
      <Text style={[styles.items, { marginTop: 10, fontWeight: '600' }]}>Rol</Text>
      <Picker
        selectedValue={user.role}
        style={styles.picker}
        onValueChange={(value) => onChangeRole(user.id, value)}
      >
        <Picker.Item label="Dueño de mascota" value="OWNER" />
        <Picker.Item label="Veterinario" value="VETERINARIAN" />
        <Picker.Item label="Administrador" value="ADMIN" />
        <Picker.Item label="Empleado" value="EMPLOYEE" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  picker: { height: 50, width: '100%', marginLeft: -9, marginTop: -15 },
  items: { marginBottom: 5 },
  // Removed inner card container to present content at same level as modal
});
