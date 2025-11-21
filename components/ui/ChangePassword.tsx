import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import { alertApiError } from '../../utils/apiError';
import Button from './Button';
import Input from './Input';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await axiosClient.put('/api/users/change-password', { currentPassword, newPassword, confirmPassword });
      Alert.alert('Éxito', 'Contraseña actualizada');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      alertApiError(err, 'No se pudo actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input placeholder="Contraseña actual" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry style={styles.field} />
      <Input placeholder="Nueva contraseña" value={newPassword} onChangeText={setNewPassword} secureTextEntry style={styles.field} />
      <Input placeholder="Confirmar nueva contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.field} />
  <Button title={loading ? 'Guardando...' : 'Cambiar contraseña'} onPress={onSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginTop: 16 },
  field: { marginBottom: 12 },
});
