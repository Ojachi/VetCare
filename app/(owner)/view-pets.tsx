import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';

type Pet = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  sex?: string;
};

export default function ViewPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const router = useRouter();

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get<Pet[]>('/api/pets');
      setPets(response.data);
    } catch {
      Alert.alert('Error', 'No se pudo cargar tus mascotas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (pets.length === 0 && !loading) {
    return (
      <View style={styles.center}>
        <Text>No tienes mascotas registradas</Text>
        <Button title="+ Nueva mascota" onPress={() => router.push('/(owner)/register-pet' as any)} />
      </View>
    );
  }

  const renderPet = ({ item }: { item: Pet }) => (
    <View style={styles.petCard}>
      <TouchableOpacity onPress={() => { router.push({ pathname: '/(owner)/pet-detail', params: { petId: item.id } } as any); }}>
        <Text style={styles.petName}>Nombre: {item.name}</Text>
        <Text>Especie: {item.species}</Text>
        {item.breed && <Text>Raza: {item.breed}</Text>}
        {item.age !== undefined && <Text>Edad: {item.age} años</Text>}
        {item.weight !== undefined && <Text>Peso: {item.weight} Kg</Text>}
        {item.sex && <Text>Género: {item.sex}</Text>}
      </TouchableOpacity>
      <View style={styles.actionsRow}>
        <Button title="Editar" onPress={() => { router.push({ pathname: '/(owner)/edit-pet', params: { petId: item.id } } as any); }} />
        <Button title="Eliminar" onPress={async () => {
          Alert.alert('Eliminar', '¿Deseas eliminar esta mascota?', [
            { text: 'No' },
            { text: 'Sí', onPress: async () => {
              try {
                await axiosClient.delete(`/api/pets/${item.id}`);
                Alert.alert('Éxito', 'Mascota eliminada');
                refresh();
              } catch {
                Alert.alert('Error', 'No se pudo eliminar la mascota');
              }
            }}
          ]);
        }} style={{ backgroundColor: '#e74c3c' }} />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Button title="+ Nueva mascota" onPress={() => router.push('/(owner)/register-pet' as any)} />
      </View>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={renderPet}
        contentContainerStyle={styles.list}
      />

      {/* modals handled via dedicated pages (register-pet, edit-pet) */}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  petCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  petName: { fontSize: 16, fontWeight: 'bold' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
});
