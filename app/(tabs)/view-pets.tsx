import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';

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

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axiosClient.get<Pet[]>('/api/pets');
        setPets(response.data);
      } catch {
        Alert.alert('Error', 'No se pudo cargar tus mascotas');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (pets.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No tienes mascotas registradas</Text>
      </View>
    );
  }

  const renderPet = ({ item }: { item: Pet }) => (
    <View style={styles.petCard}>
      <Text style={styles.petName}>Nombre: {item.name}</Text>
      <Text>Especie: {item.species}</Text>
      {item.breed && <Text>Raza: {item.breed}</Text>}
      {item.age !== undefined && <Text>Edad: {item.age} años</Text>}
      {item.weight !== undefined && <Text>Peso: {item.weight} Kg</Text>}
      {item.sex && <Text>Género: {item.sex}</Text>}
    </View>
  );

  return (
    <FlatList
      data={pets}
      keyExtractor={(item) => item.id}
      renderItem={renderPet}
      contentContainerStyle={styles.list}
    />
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
});
