import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import Button from '../ui/Button';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';

type Pet = {
  id: string;
  name: string;
  speciesId?: number;
  speciesName?: string;
  customSpecies?: string;
  breedId?: number;
  breedName?: string;
  customBreed?: string;
  age?: number;
  weight?: number;
  sex?: string;
};

const getSpecies = (pet: Pet): string => pet.speciesName || pet.customSpecies || 'Desconocida';
const getBreed = (pet: Pet): string => pet.breedName || pet.customBreed || 'Desconocida';

export default function PetListOwner({
  onCreate,
  onOpenDetail,
  onEdit,
}: {
  onCreate?: () => void;
  onOpenDetail?: (petId: string) => void;
  onEdit?: (petId: string) => void;
}) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get<Pet[]>('/api/pets');
      setPets(response.data);
    } catch (err) {
      alertApiError(err, 'No se pudo cargar tus mascotas');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { refresh(); }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  if (pets.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}> 
        <EmptyState title="Sin mascotas" message="Aún no has registrado mascotas." />
        <View style={{ width: '80%', marginTop: 12 }}>
          <Button title="+ Nueva mascota" onPress={() => (onCreate ? onCreate() : router.push('/(owner)/register-pet' as any))} />
        </View>
      </View>
    );
  }

  const renderPet = ({ item }: { item: Pet }) => (
    <Card>
      <TouchableOpacity onPress={() => (onOpenDetail ? onOpenDetail(item.id) : router.push({ pathname: '/(owner)/pet-detail', params: { petId: item.id } } as any))}>
        <Text style={typography.h3}>{item.name}</Text>
        <Text style={typography.body}>Especie: {getSpecies(item)}</Text>
        {getBreed(item) && <Text style={typography.body}>Raza: {getBreed(item)}</Text>}
        {item.age !== undefined && <Text style={typography.body}>Edad: {item.age} años</Text>}
        {item.weight !== undefined && <Text style={typography.body}>Peso: {item.weight} Kg</Text>}
        {item.sex && <Text style={typography.body}>Género: {item.sex}</Text>}
      </TouchableOpacity>
      <View style={styles.actionsRow}>
        <Button title="Editar" onPress={() => (onEdit ? onEdit(item.id) : router.push({ pathname: '/(owner)/edit-pet', params: { petId: item.id } } as any))} />
        <Button title="Eliminar" onPress={() => Alert.alert('Eliminar', '¿Deseas eliminar esta mascota?', [
          { text: 'No' },
          { text: 'Sí', onPress: async () => { try { await axiosClient.delete(`/api/pets/${item.id}`); Alert.alert('Éxito', 'Mascota eliminada'); refresh(); } catch (err) { alertApiError(err, 'No se pudo eliminar la mascota'); } } }
        ])} style={{ backgroundColor: colors.danger }} />
      </View>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16 }}>
        <Button title="+ Nueva mascota" onPress={() => router.push('/(owner)/register-pet' as any)} />
      </View>
      <FlatList data={pets} keyExtractor={(item) => item.id} renderItem={renderPet} contentContainerStyle={styles.list} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
});
