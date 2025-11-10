import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Button from '../ui/Button';
import Input from '../ui/Input';

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  phone: string;
};

interface EditUserFormProps {
  user: AdminUser;
  onSave: (data: Partial<AdminUser>) => void;
  onCancel: () => void;
}

export default function EditUserForm({ user, onSave, onCancel }: EditUserFormProps) {
  const [name, setName] = useState(user?.name ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setAddress(user?.address ?? '');
    setPhone(user?.phone ?? '');
  }, [user]);

  const submit = async () => {
    setSaving(true);
    try {
      await onSave({ name, address, phone });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View>
      <Text style={[typography.h3, { textAlign: 'center' }]}>Editar usuario</Text>
      <Text style={[typography.caption, { textAlign: 'center', color: colors.darkGray, marginBottom: 12 }]}>Actualiza los datos del usuario</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <Input placeholder="Nombre" value={name} onChangeText={setName} />
        <Text style={styles.label}>Dirección</Text>
        <Input placeholder="Dirección" value={address} onChangeText={setAddress} />
        <Text style={styles.label}>Celular</Text>
        <Input placeholder="Celular" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <View style={styles.row}>
          <Button title={saving ? 'Guardando...' : 'Guardar'} onPress={submit} style={{ flex: 1, marginRight: 8 }} disabled={saving} />
          <Button title="Cancelar" onPress={onCancel} style={{ flex: 1, backgroundColor: colors.secondary }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 0 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  label: { fontSize: 13, fontWeight: '600', marginTop: 4, marginLeft: 4, color: colors.darkGray },
});
