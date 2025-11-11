import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Input from '../../components/ui/Input';
import YesNoCheckbox from '../../components/ui/YesNoCheckbox';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import Card from '../ui/Card';

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
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🏥</Text>
        <Text style={[typography.h2, styles.headerTitle]}>
          {service?.id ? 'Editar Servicio' : 'Registrar Servicio'}
        </Text>
      </View>

      <Card style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldIcon}>📝</Text>
          <View style={styles.fieldContent}>
            <Text style={styles.label}>Nombre del Servicio *</Text>
            <Input 
              placeholder="Nombre" 
              value={name} 
              onChangeText={setName}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldIcon}>📋</Text>
          <View style={styles.fieldContent}>
            <Text style={styles.label}>Descripción</Text>
            <Input
              placeholder="Descripción del servicio"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.textarea]}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldIcon}>💰</Text>
          <View style={styles.fieldContent}>
            <Text style={styles.label}>Precio (COP) *</Text>
            <Input 
              placeholder="0" 
              value={price} 
              onChangeText={setPrice} 
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldIcon}>⏱️</Text>
          <View style={styles.fieldContent}>
            <Text style={styles.label}>Duración (minutos) *</Text>
            <Input 
              placeholder="30" 
              value={durationMinutes} 
              onChangeText={setDurationMinutes} 
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldIcon}>🏥</Text>
          <View style={styles.fieldContent}>
            <Text style={styles.label}>¿Requiere Veterinario?</Text>
            <YesNoCheckbox value={requiresVeterinarian} onChange={setRequiresVeterinarian} />
          </View>
        </View>
      </Card>

      <View style={styles.actionsRow}>
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.disabledButton]} 
          onPress={onSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Guardando...' : (service?.id ? 'Guardar Cambios' : 'Registrar Servicio')}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    color: colors.darkGray,
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
  textarea: {
    minHeight: 80,
    paddingTop: 8,
    paddingBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
  },
  actionsRow: {
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
