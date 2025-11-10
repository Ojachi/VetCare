import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Button from '../ui/Button';
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
    if (!breed.trim()) return; // ignore empty
    setSaving(true);
    try {
      await axiosClient.put(`/api/pets/${petId}`, { breed });
      onSaved(breed);
    } catch (e) {
      // swallow error; upstream alert logic can be added later if desired
      console.error('Failed to update breed', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View>
      <Text style={[typography.h3, { textAlign: 'center' }]}>Editar raza</Text>
      <Text style={[typography.caption, { textAlign: 'center', color: colors.darkGray, marginBottom: 12 }]}>Actualiza la raza de la mascota</Text>
      <Input value={breed} onChangeText={setBreed} placeholder="Raza" autoFocus />
      <View style={styles.row}>
        <Button title={saving ? 'Guardando...' : 'Guardar'} onPress={save} disabled={saving} style={{ flex: 1, marginRight: 8 }} />
        <Button title="Cancelar" onPress={onCancel} style={{ flex: 1, backgroundColor: colors.secondary }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
});
