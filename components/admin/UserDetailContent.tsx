import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,  } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
  onUpdateUser: (id: number, data: Partial<User>) => void;
}

export default function UserDetailContent({ user, onChangeRole, onUpdateUser }: UserDetailContentProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, address: user.address, phone: user.phone });

  const handleSave = () => {
    onUpdateUser(user.id, form);
    setEditing(false);
  };

  if (!user) return null;
  return (
    <View style={styles.userCard}>
      <Text style={styles.title}>Usuario: {user.name}</Text>
      <Text style={styles.items}>Correo: {user.email}</Text>
      {editing ? (
        <>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={text => setForm(f => ({ ...f, name: text }))}
            placeholder="Nombre"
          />
          <TextInput
            style={styles.input}
            value={form.address}
            onChangeText={text => setForm(f => ({ ...f, address: text }))}
            placeholder="Dirección"
          />
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={text => setForm(f => ({ ...f, phone: text }))}
            placeholder="Teléfono"
            keyboardType="numeric"
          />
          <Button title="Guardar" onPress={handleSave} />
          <Button title="Cancelar" color="red" onPress={() => setEditing(false)} />
        </>
      ) : (
        <>
          <Text style={styles.items}>Dirección: {user.address}</Text>
          <Text style={styles.items}>Teléfono: {user.phone}</Text>
          <Button title="Editar usuario" onPress={() => setEditing(true)} />
        </>
      )}
      <Picker
        selectedValue={user.role}
        style={styles.picker}
        onValueChange={(value) => onChangeRole(user.id, value)}
      >
        <Picker.Item label="Dueño de mascota" value="OWNER" />
        <Picker.Item label="Veterinario" value="VETERINARIAN" />
        <Picker.Item label="Administrador" value="ADMIN" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  picker: { height: 50, width: '100%', marginLeft: -9, marginTop: -15 },
  items: { marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#999', padding: 6, marginVertical: 8, borderRadius: 5 },
  userCard: {
    marginBottom: 15, padding: 15, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, backgroundColor: '#f9f9f9', marginTop: 35,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 4, elevation: 2,
  },
});
