import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import DetailModal from '../../components/ui/DetailModal'; // Importar componente modal modular

type Service = {
  id: number;
  name: string;
  description: string;
  price: string;
    durationMinutes: string;
    requiresVeterinarian: boolean;
  active: boolean 
};

export default function AllPets() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
//   const [editingPetId, setEditingPetId] = useState<number | null>(null);
//   const [editedBreed, setEditedBreed] = useState('');

  // Estado para modal detalle
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await axiosClient.get<Service[]>('/api/services');
      setServices(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los servicios');
    } finally {
      setLoading(false);
    }
  };

//   const saveBreed = async (petId: number) => {
//     try {
//       await axiosClient.put(`/api/pets/${petId}`, { breed: editedBreed });
//       const updatedPets = pets.map((p) =>
//         p.id === petId ? { ...p, breed: editedBreed } : p
//       );
//       setPets(updatedPets);
//       setEditingPetId(null);
//       Alert.alert('Éxito', 'Raza actualizada');
//     } catch (error) {
//       Alert.alert('Error', 'No se pudo actualizar la raza');
//     }
//   };

  const openModal = (service: Service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedService(null);
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
        data={services}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.serviceCard}>
              <Text style={styles.name}> {item.name}</Text>
              <Text style={styles.items}>Descripcion: {item.description}</Text>

              <Text style={styles.items}>Precio: ${item.price} COP</Text>
              {/* {editingPetId === item.id ? (
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
                <> */}
                  <Text style={styles.items}>Necesita Veterinario: {item.requiresVeterinarian ? 'Si' : 'No'}</Text>
                  <Text style={styles.items}>Estado: {item.active ? 'Activo' : 'Inactivo'}</Text>
                  {/* <Button
                    title="Editar Raza"
                    onPress={() => {
                      setEditingPetId(item.id);
                      setEditedBreed(item.breed);
                    }}
                  /> */}
                {/* </>
              )} */}
            </View>
          </TouchableOpacity>
        )}
      />
      {selectedService && (
        <DetailModal
          visible={modalVisible}
          onClose={closeModal}
          title={selectedService.name}
          data={selectedService}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  serviceCard: {
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
