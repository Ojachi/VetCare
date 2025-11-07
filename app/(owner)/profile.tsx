import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import ChangePassword from '../../components/ui/ChangePassword';
import Input from '../../components/ui/Input';
import { useSession } from '../../context/SessionContext';

const defaultAvatar = require('../../assets/images/icon.png');

export default function Profile() {
  const { user, login } = useSession();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  const save = async () => {
    try {
      const res = await axiosClient.put('/api/users/me', form);
      login(res.data);
      Alert.alert('Éxito', 'Perfil actualizado');
      setEditing(false);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  if (!form) return <View style={styles.center}><Text>Cargando...</Text></View>;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarWrap} onPress={() => Alert.alert('Avatar', 'Implementar selector de avatar si se desea')}>
        <Image source={defaultAvatar} style={styles.avatar} />
      </TouchableOpacity>

      {editing ? (
        <>
          <Input placeholder="Nombre" value={form.name || ''} onChangeText={(v) => setForm({ ...form, name: v })} />
          <Input placeholder="Email" value={form.email || ''} onChangeText={(v) => setForm({ ...form, email: v })} keyboardType="email-address" />
          <Button title="Guardar" onPress={save} />
          <Button title="Cancelar" onPress={() => setEditing(false)} style={{ backgroundColor: '#999' }} />
          <View style={{ height: 1, backgroundColor: '#eee', width: '100%', marginVertical: 16 }} />
          <ChangePassword />
        </>
      ) : (
        <>
          <Text style={styles.name}>{form.name}</Text>
          <Text style={styles.email}>{form.email}</Text>
          <Button title="Editar perfil" onPress={() => setEditing(true)} />
          <View style={{ height: 1, backgroundColor: '#eee', width: '100%', marginVertical: 16 }} />
          <ChangePassword />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#fff' },
  avatarWrap: { marginBottom: 12 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  email: { color: '#666', marginBottom: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
