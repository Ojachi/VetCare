import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import EditPetBreedForm from '../../components/admin/EditPetBreedForm';
import PetCard from '../../components/admin/PetCard';
import PetDetailContent from '../../components/admin/PetDetailContent';
import DetailModal from '../../components/ui/DetailModal';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

type PetType = {
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
  const [pets, setPets] = useState<PetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<PetType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [breedModalVisible, setBreedModalVisible] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const response = await axiosClient.get<PetType[]>('/api/pets');
      setPets(response.data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar las mascotas');
    } finally {
      setLoading(false);
    }
  };

  const handleBreedSaved = (petId: number, newBreed: string) => {
    const updatedPets = pets.map((p) => (p.id === petId ? { ...p, breed: newBreed } : p));
    setPets(updatedPets);
    // also reflect in the currently opened detail modal
    setSelectedPet((prev) => (prev && prev.id === petId ? { ...prev, breed: newBreed } as PetType : prev));
    setBreedModalVisible(false);
  };

  const openModal = (pet: PetType) => {
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
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🐾</Text>
        <Text style={[typography.h2, styles.headerTitle]}>Gestión de Mascotas</Text>
        <Text style={styles.headerSubtitle}>Administra todas las mascotas registradas</Text>
      </View>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PetCard pet={item as any} onOpenDetail={openModal as any} />
        )}
      />
      <DetailModal
        visible={modalVisible}
        onClose={closeModal}
        extraFooterButton={selectedPet ? {
          title: 'Editar Raza',
          onPress: () => setBreedModalVisible(true),
          style: { backgroundColor: colors.secondary },
        } : undefined}
      >
        {selectedPet ? <PetDetailContent pet={selectedPet} /> : null}
      </DetailModal>

      {/* Secondary modal just for editing breed */}
      <DetailModal visible={breedModalVisible} onClose={() => setBreedModalVisible(false)} showClose={false}>
        {selectedPet ? (
          <EditPetBreedForm
            petId={selectedPet.id}
            currentBreed={selectedPet.breed}
            onCancel={() => setBreedModalVisible(false)}
            onSaved={(newBreed: string) => handleBreedSaved(selectedPet.id, newBreed)}
          />
        ) : null}
      </DetailModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 12 },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    color: colors.darkGray,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.muted,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
});
