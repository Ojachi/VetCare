import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Text,
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import DetailModal from '../../components/ui/DetailModal';
import PetDetailContent from '../../components/admin/PetDetailContent';

type Pet = {
  id: number;
  name: string;
  owner: {
    id: number;
    name: string;
    email: string;
    role: string;
    address: string;
    phone: string;
  };
  species: string;
  breed: string;
  active: boolean;
};

export default function AllPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPetId, setEditingPetId] = useState<number | null>(null);
  const [editedBreed, setEditedBreed] = useState('');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const response = await axiosClient.get<Pet[]>('/api/pets');
      setPets(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las mascotas');
    } finally {
      setLoading(false);
    }
  };

  const saveBreed = async (petId: number) => {
    try {
      await axiosClient.put(`/api/pets/${petId}`, { breed: editedBreed });
      const updatedPets = pets.map((p) =>
        p.id === petId ? { ...p, breed: editedBreed } : p
      );
      setPets(updatedPets);
      setEditingPetId(null);
      Alert.alert('Éxito', 'Raza actualizada');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la raza');
    }
  };

  const openModal = (pet: Pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPet(null);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.petCard}>
              <Text style={styles.name}>Nombre: {item.name}</Text>
              <Text style={styles.items}>Dueño: {item.owner.name}</Text>
              <Text style={styles.items}>Especie: {item.species}</Text>
              {editingPetId === item.id ? (
                <>
                  <TextInput
                    style={styles.input}
                    value={editedBreed}
                    onChangeText={setEditedBreed}
                  />
                  <Button title="Guardar" onPress={() => saveBreed(item.id)} />
                  <Button title="Cancelar" color="red" onPress={() => setEditingPetId(null)} />
                </>
              ) : (
                <>
                  <Text style={styles.items}>Raza: {item.breed}</Text>
                  <Button
                    title="Editar Raza"
                    onPress={() => {
                      setEditingPetId(item.id);
                      setEditedBreed(item.breed);
                    }}
                  />
                </>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      <DetailModal visible={modalVisible} onClose={closeModal}>
        {selectedPet ? <PetDetailContent pet={selectedPet} /> : null}
      </DetailModal>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  petCard: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  items: {
    marginBottom: 5,
  },
  name: { fontWeight: 'bold', fontSize: 16, marginLeft: -3 },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 6,
    marginVertical: 8,
    borderRadius: 5,
  },
});
