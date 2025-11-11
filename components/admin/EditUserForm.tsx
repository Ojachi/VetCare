import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Card from '../ui/Card';
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>✏️</Text>
        <Text style={[typography.h2, styles.headerTitle]}>Editar Usuario</Text>
      </View>
      <Text style={styles.headerSubtitle}>Actualiza los datos del usuario</Text>

      <Card style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldIcon}>👤</Text>
          <View style={styles.fieldContent}>
            <Text style={styles.label}>Nombre</Text>
            <Input 
              placeholder="Nombre del usuario" 
              value={name} 
              onChangeText={setName}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldIcon}>📍</Text>
          <View style={styles.fieldContent}>
            <Text style={styles.label}>Dirección</Text>
            <Input 
              placeholder="Dirección del usuario" 
              value={address} 
              onChangeText={setAddress}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldIcon}>📱</Text>
          <View style={styles.fieldContent}>
            <Text style={styles.label}>Teléfono</Text>
            <Input 
              placeholder="Número de teléfono" 
              value={phone} 
              onChangeText={setPhone} 
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>
        </View>
      </Card>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={submit}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    color: colors.darkGray,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  form: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  fieldGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  fieldIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
    width: 24,
  },
  fieldContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.darkGray,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
