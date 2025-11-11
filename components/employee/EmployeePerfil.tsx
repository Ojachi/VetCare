import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import { useSession } from '../../context/SessionContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export default function EmployeePerfil() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { logout } = useSession();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await axiosClient.get<UserProfile>('/api/users/me');
      setProfile(response.data);
      setForm({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
      });
    } catch (err) {
      alertApiError(err, 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosClient.put('/api/users/me', form);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      setEditing(false);
      loadProfile();
    } catch (err) {
      alertApiError(err, 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
      {
        text: 'Cerrar sesión',
        onPress: () => logout(),
        style: 'destructive',
      },
    ]);
  };

  if (loading && !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con Avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {profile?.name?.charAt(0).toUpperCase() || 'E'}
          </Text>
        </View>
        <Text style={[typography.h2, styles.nameTitle]}>{profile?.name}</Text>
        <Text style={styles.roleSubtitle}>Empleado de VetCare</Text>
      </View>

      {!editing ? (
        <>
          {/* Tarjeta de Información */}
          <Card>
            <View style={styles.sectionHeader}>
              <Text style={[typography.h3, { color: colors.primary }]}>Información Personal</Text>
            </View>

            {/* Nombre */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>👤</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nombre</Text>
                <Text style={styles.infoValue}>{profile?.name}</Text>
              </View>
            </View>

            {/* Email */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>✉️</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profile?.email}</Text>
              </View>
            </View>

            {/* Teléfono */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📱</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={[styles.infoValue, !profile?.phone && styles.notRegistered]}>
                  {profile?.phone || 'No registrado'}
                </Text>
              </View>
            </View>

            {/* Dirección */}
            <View style={[styles.infoCard, { marginBottom: 0 }]}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📍</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Dirección</Text>
                <Text style={[styles.infoValue, !profile?.address && styles.notRegistered]}>
                  {profile?.address || 'No registrada'}
                </Text>
              </View>
            </View>
          </Card>

          {/* Botones de Acción */}
          <View style={styles.buttonContainer}>
            <Button 
              title="✏️ Editar Perfil" 
              onPress={() => setEditing(true)} 
              style={styles.editButton}
            />
          </View>
        </>
      ) : (
        <>
          {/* Modo Edición */}
          <Card>
            <Text style={[typography.h3, { marginBottom: 16, color: colors.primary }]}>Editar Información</Text>
            
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <Input
                placeholder="Tu nombre completo"
                value={form.name}
                onChangeText={(v) => setForm({ ...form, name: v })}
                style={styles.input}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Email</Text>
              <Input
                placeholder="tu@email.com"
                value={form.email}
                onChangeText={(v) => setForm({ ...form, email: v })}
                editable={false}
                style={[styles.input, styles.disabledInput]}
              />
              <Text style={styles.helperText}>El email no se puede cambiar</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <Input
                placeholder="+34 123 456 789"
                value={form.phone}
                onChangeText={(v) => setForm({ ...form, phone: v })}
                style={styles.input}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Dirección</Text>
              <Input
                placeholder="Calle, número, ciudad"
                value={form.address}
                onChangeText={(v) => setForm({ ...form, address: v })}
                style={styles.input}
              />
            </View>

            <View style={styles.editButtonGroup}>
              <Button 
                title={saving ? 'Guardando...' : '✓ Guardar Cambios'} 
                onPress={handleSave} 
                disabled={saving}
                style={styles.saveButton}
              />
              <Button
                title="✕ Cancelar"
                onPress={() => setEditing(false)}
                disabled={saving}
                style={styles.cancelButton}
              />
            </View>
          </Card>
        </>
      )}

      {/* Footer con Logout */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 16,
    paddingTop: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  
  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
  },
  nameTitle: {
    color: colors.darkGray,
    marginBottom: 4,
    textAlign: 'center',
  },
  roleSubtitle: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },

  // Section Header
  sectionHeader: {
    paddingBottom: 16,
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.lightGray,
  },

  // Info Card Styles
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.darkGray,
  },
  notRegistered: {
    color: colors.muted,
    fontStyle: 'italic',
  },

  // Button Group
  buttonContainer: {
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  editButton: {
    backgroundColor: colors.primary,
  },

  // Form Styles
  formSection: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
  },
  disabledInput: {
    backgroundColor: colors.lightGray,
    opacity: 0.7,
  },
  helperText: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 6,
    fontStyle: 'italic',
  },

  // Edit Button Group
  editButtonGroup: {
    marginTop: 24,
    gap: 10,
  },
  saveButton: {
    backgroundColor: colors.success,
  },
  cancelButton: {
    backgroundColor: colors.secondary,
  },

  // Logout Button
  logoutButton: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.danger,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
