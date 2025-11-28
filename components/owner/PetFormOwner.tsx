import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import { BreedSelector } from '../common/BreedSelector';
import Button from '../ui/Button';
import Input from '../ui/Input';

type Mode = 'create' | 'edit';

type Species = {
  id: number;
  name: string;
  active: boolean;
};

export default function PetFormOwner({
  mode: propMode,
  petId: propPetId,
  onSaved,
  onCancel,
}: {
  mode?: Mode; // optional, inferred by presence of petId if not provided
  petId?: string;
  onSaved?: (petId: string) => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const { petId: qPetId } = useLocalSearchParams<{ petId?: string }>();
  const petId = propPetId || qPetId;
  const mode: Mode = propMode || (petId ? 'edit' : 'create');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({ name: '', speciesId: null, customSpecies: '', breedId: null, customBreed: '', age: '', weight: '', sex: '' });
  const [species, setSpecies] = useState<Species[]>([]);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await axiosClient.get('/api/species');
        setSpecies(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error('Error loading species:', err);
      }
    };

    const load = async () => {
      if (mode === 'edit' && petId) {
        try {
          const res = await axiosClient.get(`/api/pets/${petId}`);
          const p = res.data;
          setForm({
            name: p.name || '',
            speciesId: p.speciesId || null,
            customSpecies: p.customSpecies || '',
            breedId: p.breedId || null,
            customBreed: p.customBreed || p.breed || '',
            sex: p.sex || '',
            weight: p.weight ? String(p.weight) : '',
            age: p.age ? String(p.age) : '',
          });
        } catch (err) {
          alertApiError(err, 'No se pudo cargar la mascota');
        }
      }
    };
    
    fetchSpecies();
    load();
  }, [mode, petId]);

  const onSubmit = async () => {
    const { name, speciesId, customSpecies, breedId, customBreed, age, weight, sex } = form;
    if (!name || !age || !sex || !weight) {
      Alert.alert('Error', 'Por favor llena todos los campos requeridos');
      return;
    }

    // Validar que tenga especie O customSpecies
    if (!speciesId && !customSpecies) {
      Alert.alert('Error', 'Por favor selecciona una especie o ingresa una personalizada');
      return;
    }

    // Validar que tenga raza O customBreed
    if (!breedId && !customBreed) {
      Alert.alert('Error', 'Por favor selecciona una raza o ingresa una personalizada');
      return;
    }

    setLoading(true);
    const payload: any = {
      name,
      age: Number(age),
      weight: Number(weight),
      sex,
      ...(speciesId && { speciesId }),
      ...(customSpecies && { customSpecies }),
      ...(breedId && { breedId }),
      ...(customBreed && { customBreed }),
    };
    try {
      if (mode === 'edit' && petId) {
        await axiosClient.put(`/api/pets/${petId}`, payload);
        Alert.alert('Éxito', 'Mascota actualizada');
        if (onSaved) onSaved(petId);
        else router.back();
      } else {
        const res = await axiosClient.post('/api/pets', payload, { headers: { 'Content-Type': 'application/json' } });
        const createdId = res.data?.id || res.data?._id;
        Alert.alert('Éxito', `Mascota ${name} registrada`);
        if (onSaved && createdId) onSaved(String(createdId));
        else router.push('/(owner)/view-pets' as any);
      }
    } catch (error) {
      alertApiError(error, mode === 'edit' ? 'No se pudo actualizar la mascota' : 'No se pudo registrar la mascota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerIcon}>{mode === 'edit' ? '✏️' : '➕'}</Text>
          <Text style={[typography.h2, { marginBottom: 4, color: colors.darkGray }]}>
            {mode === 'edit' ? 'Editar Mascota' : 'Registrar Mascota'}
          </Text>
          <Text style={[typography.body, { color: colors.muted, textAlign: 'center' }]}>
            {mode === 'edit' ? 'Actualiza la información de tu mascota' : 'Completa los datos de tu nuevo amigo'}
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>🐾 Nombre</Text>
            <Input
              placeholder="Ej. Max, Luna, Milo"
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
              style={styles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>🦴 Especie</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={form.speciesId} onValueChange={(v) => { setForm({ ...form, speciesId: v, breedId: null }); }}>
                <Picker.Item label="Selecciona especie" value={null} />
                {species.map((s) => <Picker.Item key={s.id} label={s.name} value={s.id} />)}
              </Picker>
            </View>
            <Text style={styles.orText}>ó</Text>
            <Input 
              placeholder="Ingresa especie personalizada" 
              value={form.customSpecies} 
              onChangeText={(v) => setForm({ ...form, customSpecies: v })}
              style={styles.input}
            />
          </View>

          {/* Breed Selection */}
          {form.speciesId && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>🏷️ Raza</Text>
              <BreedSelector
                speciesId={form.speciesId}
                selectedBreedId={form.breedId}
                onBreedSelect={(id, name) => {
                  setForm({ ...form, breedId: id, customBreed: '' });
                }}
                placeholder="Selecciona raza del catálogo..."
              />
              {!form.breedId && (
                <>
                  <Text style={styles.orText}>ó ingresa una personalizada:</Text>
                  <Input 
                    placeholder="Ej: Labrador, Siamés" 
                    value={form.customBreed} 
                    onChangeText={(v) => setForm({ ...form, customBreed: v })}
                    style={styles.input}
                  />
                </>
              )}
            </View>
          )}
          
          {!form.speciesId && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>🏷️ Raza Personalizada</Text>
              <Input 
                placeholder="Labrador, Siamés, etc" 
                value={form.customBreed} 
                onChangeText={(v) => setForm({ ...form, customBreed: v })}
                style={styles.input}
              />
            </View>
          )}

          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>⚧ Género</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={form.sex} onValueChange={(v) => setForm({ ...form, sex: v })}>
                  <Picker.Item label="Selecciona género" value="" />
                  <Picker.Item label="Macho" value="Macho" />
                  <Picker.Item label="Hembra" value="Hembra" />
                </Picker>
              </View>
            </View>

            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>📅 Edad</Text>
              <Input
                placeholder="Años"
                value={form.age}
                onChangeText={(v) => setForm({ ...form, age: v })}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>⚖️ Peso</Text>
            <Input
              placeholder="Kg"
              value={form.weight}
              onChangeText={(v) => setForm({ ...form, weight: v })}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        {/* Button Group */}
        <View style={styles.buttonGroup}>
          <Button
            title={loading ? (mode === 'edit' ? 'Guardando...' : 'Registrando...') : (mode === 'edit' ? '✓ Guardar Cambios' : '✓ Registrar Mascota')}
            onPress={onSubmit}
            disabled={loading}
            style={styles.primaryButton}
          />
          {onCancel && !loading && (
            <Button
              title="✕ Cancelar"
              onPress={onCancel}
              style={styles.cancelButton}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 32,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 28,
    paddingBottom: 16,
  },
  headerIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  formSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
  },
  pickerWrap: { 
    borderWidth: 1, 
    borderColor: colors.lightGray, 
    borderRadius: 10, 
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  orText: {
    textAlign: 'center',
    color: colors.muted,
    marginVertical: 8,
    fontSize: 12,
  },
  buttonGroup: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.secondary,
  },
});
