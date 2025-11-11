import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Card from '../ui/Card';
import Input from '../ui/Input';

interface EditPetBreedFormProps {
  petId: number;
  currentBreed: string;
  onCancel: () => void;
  onSaved: (newBreed: string) => void;
}

export default function EditPetBreedForm({ petId, currentBreed, onCancel, onSaved }: EditPetBreedFormProps) {
  const [breed, setBreed] = useState(currentBreed);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!breed.trim()) return;
    setSaving(true);
    try {
      await axiosClient.put(`/api/pets/${petId}`, { breed });
      onSaved(breed);
    } catch (e) {
      console.error('Failed to update breed', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🐾</Text>
        <View>
          <Text style={typography.h2}>Editar raza</Text>
          <Text style={[typography.caption, { color: colors.muted }]}>Actualiza la raza de la mascota</Text>
        </View>
      </View>

      <Card style={styles.formCard}>
        <Text style={[typography.caption, { color: colors.muted, marginBottom: 8 }]}>Raza</Text>
        <Input value={breed} onChangeText={setBreed} placeholder="Raza" autoFocus />
      </Card>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={save}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Guardando...' : 'Guardar'}
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
  container: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  headerEmoji: { fontSize: 40 },
  formCard: { padding: 12, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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
    backgroundColor: colors.secondary,
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
