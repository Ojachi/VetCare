import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Input from '../../components/ui/Input';
import YesNoCheckbox from '../../components/ui/YesNoCheckbox';
import { alertApiError } from '../../utils/apiError';
import ButtonUI from '../ui/Button';

export default function ServiceForm({ service, onSaved, onCancel }: { service?: any | null; onSaved: (s: any) => void; onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(service?.description ?? '');
  const [price, setPrice] = useState(service?.price ? String(service.price) : '');
  const [durationMinutes, setDurationMinutes] = useState(service?.durationMinutes ? String(service.durationMinutes) : '');
  const [requiresVeterinarian, setRequiresVeterinarian] = useState(!!service?.requiresVeterinarian);
  const [name, setName] = useState(service?.name ?? '');

  useEffect(() => {
    setDescription(service?.description ?? '');
    setPrice(service?.price ? String(service.price) : '');
    setDurationMinutes(service?.durationMinutes ? String(service.durationMinutes) : '');
    setRequiresVeterinarian(!!service?.requiresVeterinarian);
    setName(service?.name ?? '');
  }, [service]);

  const onSubmit = async () => {
    if (!name || !price || !durationMinutes) {
      Alert.alert('Error', 'Por favor llena todos los campos obligatorios');
      return;
    }
    setLoading(true);
    const payload = { name, description, price, durationMinutes, requiresVeterinarian };
    try {
      let res;
      if (service?.id) {
        res = await axiosClient.put(`/api/admin/services/${service.id}`, payload);
      } else {
        res = await axiosClient.post('/api/admin/services', payload);
      }
      onSaved(res.data);
    } catch (err) {
      alertApiError(err, 'No se pudo guardar el servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Text style={styles.title}>{service?.id ? 'Editar Servicio' : 'Registrar Servicio'}</Text>
      <Input placeholder="Nombre del servicio" value={name} onChangeText={setName} />
      <Input placeholder="Descripción" value={description} onChangeText={setDescription} />
      <Input placeholder="Precio (COP)" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <Input placeholder="Duración (minutos)" value={durationMinutes} onChangeText={setDurationMinutes} keyboardType="numeric" />

      <Text style={styles.question}>¿Necesita Veterinario?</Text>
      <YesNoCheckbox value={requiresVeterinarian} onChange={setRequiresVeterinarian} />

      <View style={styles.actionsRow}>
        <ButtonUI
          title={loading ? 'Guardando...' : (service?.id ? 'Guardar' : 'Registrar')}
          onPress={onSubmit}
          disabled={loading}
          style={{ flex: 1, marginRight: 8 }}
        />
        <ButtonUI
          title="Cancelar"
          onPress={onCancel}
          style={{ flex: 1, backgroundColor: '#e74c3c' }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 4 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  question: { fontSize: 15, marginTop: 8, marginBottom: 4 },
  actionsRow: { flexDirection: 'row', marginTop: 12 },
});
