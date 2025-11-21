import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import Card from '../ui/Card';
import DetailModal from '../ui/DetailModal';
import EmployeeEditPet from './EmployeeEditPet';

type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string;
  sex: string;
  age: number;
  weight: number;
  ownerId: number;
  owner?: { id: number; name: string };
};

export default function EmployeePetsList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const res = await axiosClient.get<Pet[]>('/api/pets');
      setPets(res.data || []);
    } catch (error) {
      alertApiError(error, 'No se pudieron cargar las mascotas');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedPet(null);
    setModalVisible(false);
  };

  const handlePetSaved = () => {
    handleCloseModal();
    loadPets();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderPetCard = ({ item }: { item: Pet }) => (
    <Card style={[styles.petCard, { borderLeftWidth: 4, borderLeftColor: colors.primary }]}>
      <View style={styles.petContent}>
        <View style={styles.petInfo}>
          <Text style={[typography.h3, styles.petName]}>🐾 {item.name}</Text>
          <Text style={[typography.caption, { color: colors.muted, marginBottom: 4 }]}>
            {item.species} • {item.breed}
          </Text>
          <View style={styles.petDetails}>
            <Text style={styles.petDetail}>♂️ {item.sex}</Text>
            <Text style={styles.petDetail}>📅 {item.age} años</Text>
            <Text style={styles.petDetail}>⚖️ {item.weight} kg</Text>
          </View>
          {item.owner && (
            <Text style={[typography.caption, { color: colors.primary, marginTop: 6, fontWeight: '600' }]}>
              👤 {item.owner.name}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleEditPet(item)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Editar ✏️</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerEmoji}>🐾</Text>
        <Text style={[typography.h2, styles.headerTitle]}>Mascotas del Sistema</Text>
        <Text style={styles.headerSubtitle}>Total de mascotas registradas: {pets.length}</Text>
      </View>

      <FlatList
        data={pets}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderPetCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[typography.h3, { color: colors.muted, marginBottom: 8 }]}>
              🐾 No hay mascotas registradas
            </Text>
            <Text style={[typography.caption, { color: colors.muted, textAlign: 'center' }]}>
              Las mascotas aparecerán aquí una vez sean registradas
            </Text>
          </View>
        }
        onRefresh={loadPets}
        refreshing={false}
      />

      {/* Edit Pet Modal */}
      <DetailModal visible={modalVisible} onClose={handleCloseModal}>
        {selectedPet && (
          <EmployeeEditPet 
            pet={selectedPet} 
            onSaved={handlePetSaved}
            onCancel={handleCloseModal}
          />
        )}
      </DetailModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 12,
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
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
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
    fontSize: 13,
    color: colors.muted,
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  petCard: {
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  petContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    color: colors.darkGray,
    marginBottom: 6,
  },
  petDetails: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  petDetail: {
    fontSize: 12,
    color: colors.muted,
    backgroundColor: colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },

  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
