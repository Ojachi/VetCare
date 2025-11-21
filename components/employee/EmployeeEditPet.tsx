import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

type EmployeeEditPetProps = {
  pet?: any;
  onSaved?: () => void;
  onCancel?: () => void;
};

export default function EmployeeEditPet({ pet: initialPet, onSaved, onCancel }: EmployeeEditPetProps = {}) {
  const router = useRouter();
  const params = useLocalSearchParams<{ petId?: string }>();
  const petId = params?.petId || (initialPet?.id ? String(initialPet.id) : null);
  
  const [loading, setLoading] = useState(false);
  const [loadingPet, setLoadingPet] = useState(!initialPet);
  const [pet, setPet] = useState<any>(initialPet || null);
  const [owners, setOwners] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!petId) {
        setLoadingPet(false);
        return;
      }
      try {
        const res = await axiosClient.get(`/api/pets/${petId}`);
        setPet(res.data);
      } catch {
        Alert.alert('Error', 'No se pudo cargar la mascota');
      } finally {
        setLoadingPet(false);
      }
    };
    const fetchOwners = async () => {
      try {
        const res = await axiosClient.get('/api/users');
        setOwners((res.data || []).filter((u: any) => u.role === 'OWNER'));
      } catch {
        // ignore
      }
    };
    load(); 
    fetchOwners();
  }, [petId]);

  const onSave = async () => {
    if (!pet) return;
    setLoading(true);
    try {
      await axiosClient.put(`/api/pets/${petId}`, pet);
      Alert.alert('Éxito', 'Mascota actualizada correctamente');
      if (onSaved) {
        onSaved();
      } else {
        router.back();
      }
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la mascota');
    } finally {
      setLoading(false);
    }
  };

  if (loadingPet) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.center}>
        <Text style={[typography.h3, { color: colors.muted }]}>No se encontró mascota</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerEmoji}>✏️</Text>
          <Text style={[typography.h2, styles.headerTitle]}>Editar Mascota</Text>
          <Text style={styles.headerSubtitle}>{pet.name}</Text>
        </View>

        {/* Form Card */}
        <Card style={styles.formCard}>
          {/* Name Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>🐾 Nombre de la Mascota</Text>
            <Input 
              placeholder="Nombre" 
              value={pet.name} 
              onChangeText={(v) => setPet({ ...pet, name: v })}
              style={styles.input}
            />
          </View>

          {/* Species & Breed Row */}
          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>🦴 Especie</Text>
              <Input 
                placeholder="Especie" 
                value={pet.species} 
                onChangeText={(v) => setPet({ ...pet, species: v })}
                style={styles.input}
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>🏷️ Raza</Text>
              <Input 
                placeholder="Raza" 
                value={pet.breed} 
                onChangeText={(v) => setPet({ ...pet, breed: v })}
                style={styles.input}
              />
            </View>
          </View>

          {/* Sex & Age Row */}
          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>♂️ Género</Text>
              <Input 
                placeholder="Género" 
                value={pet.sex} 
                onChangeText={(v) => setPet({ ...pet, sex: v })}
                style={styles.input}
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>📅 Edad</Text>
              <Input 
                placeholder="Edad" 
                value={pet.age ? String(pet.age) : ''} 
                onChangeText={(v) => setPet({ ...pet, age: Number(v) })}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>

          {/* Weight Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>⚖️ Peso (kg)</Text>
            <Input 
              placeholder="Peso" 
              value={pet.weight ? String(pet.weight) : ''} 
              onChangeText={(v) => setPet({ ...pet, weight: Number(v) })}
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </View>

          {/* Owner Picker */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>👤 Propietario</Text>
            <View style={styles.pickerWrap}>
              <Picker 
                selectedValue={String(pet.ownerId || pet.owner?.id || '')} 
                onValueChange={(v) => setPet({ ...pet, ownerId: Number(v) })}
              >
                <Picker.Item label="Selecciona propietario" value={''} />
                {owners.map((o) => <Picker.Item key={o.id} label={o.name} value={String(o.id)} />)}
              </Picker>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonGroup}>
            <Button 
              title={loading ? 'Guardando...' : '✓ Guardar Cambios'} 
              onPress={onSave}
              disabled={loading}
              style={styles.submitButton}
            />
            <Button 
              title="✕ Cancelar" 
              onPress={onCancel ? onCancel : () => router.back()}
              disabled={loading}
              style={styles.cancelButton}
            />
          </View>
        </Card>

        <View style={{ height: 20 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.lightGray,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  headerTitle: {
    color: colors.darkGray,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },

  // Form Card
  formCard: {
    paddingVertical: 20,
  },

  // Fields
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
  },

  // Row Fields
  rowFields: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  // Picker
  pickerWrap: { 
    borderWidth: 1, 
    borderColor: colors.lightGray, 
    borderRadius: 10, 
    overflow: 'hidden',
    backgroundColor: colors.white,
  },

  // Buttons
  buttonGroup: {
    marginTop: 24,
    gap: 10,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.secondary,
  },
});
