import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axiosClient from "../../api/axiosClient";
import PetFormOwner from "../../components/owner/PetFormOwner";
import Button from "../../components/ui/Button";
import DetailModal from "../../components/ui/DetailModal";
import colors from "../../styles/colors";
import typography from "../../styles/typography";
import { alertApiError } from "../../utils/apiError";

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  sex: string;
};

export default function MascotasOwner() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const router = useRouter();

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const response = await axiosClient.get<Pet[]>("/api/pets");
      setPets(response.data || []);
    } catch {
      Alert.alert("Error", "No se pudieron cargar las mascotas");
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (pet: Pet) => {
    setSelectedPet(pet);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setSelectedPet(null);
    setDetailModalVisible(false);
  };

  const openFormModal = (mode: "create" | "edit", pet?: Pet) => {
    setFormMode(mode);
    if (mode === "edit" && pet) {
      setSelectedPet(pet);
    } else {
      setSelectedPet(null);
    }
    setFormModalVisible(true);
  };

  const closeFormModal = () => {
    setSelectedPet(null);
    setFormModalVisible(false);
  };

  const handlePetSaved = (petId: string) => {
    closeFormModal();
    loadPets();
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
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text
            style={[typography.h2, { color: colors.darkGray, marginBottom: 4 }]}
          >
            🐾 Mis Mascotas
          </Text>
          <Text style={[typography.body, { color: colors.muted }]}>
            Gestiona la información de tus mascotas
          </Text>
        </View>
        <Button
          title="+ Agregar"
          onPress={() => openFormModal("create")}
          style={styles.addButton}
          textStyle={styles.addButtonText}
        />
      </View>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[typography.body, { fontSize: 16, marginBottom: 8 }]}>
              🐕 No hay mascotas registradas
            </Text>
            <Text
              style={[
                typography.body,
                { color: colors.muted, textAlign: "center" },
              ]}
            >
              Presiona el botón &quot;Agregar&quot; para registrar tu primera
              mascota
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => openDetailModal(item)}
          >
            <View style={styles.petCard}>
              <View style={styles.petIconContainer}>
                <Text style={styles.petIcon}>
                  {item.species.toLowerCase().includes("perro") ||
                  item.species.toLowerCase().includes("dog")
                    ? "🐕"
                    : "🐱"}
                </Text>
              </View>
              <View style={styles.petInfo}>
                <Text style={[typography.h3, { color: colors.primary }]}>
                  {item.name}
                </Text>
                <Text
                  style={[
                    typography.body,
                    { marginTop: 4, color: colors.muted },
                  ]}
                >
                  {item.species} • {item.breed}
                </Text>
                <View style={styles.petDetails}>
                  <Text
                    style={[
                      typography.body,
                      { fontSize: 12, color: colors.darkGray },
                    ]}
                  >
                    📅 {item.age} años
                  </Text>
                  <Text
                    style={[
                      typography.body,
                      { fontSize: 12, color: colors.darkGray, marginLeft: 12 },
                    ]}
                  >
                    ⚖️ {item.weight} kg
                  </Text>
                </View>
              </View>
              <Text style={styles.petGender}>
                {item.sex === "M" || item.sex === "Macho" ? "♂️" : "♀️"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Detail Modal */}
      <DetailModal
        visible={detailModalVisible}
        onClose={closeDetailModal}
      >
        {selectedPet && (
          <>
            {/* Header con Nombre y Emoji */}
            <View style={styles.detailHeader}>
              <View style={styles.detailAvatarContainer}>
                <Text style={styles.detailAvatar}>
                  {selectedPet.species.toLowerCase().includes("perro") ||
                  selectedPet.species.toLowerCase().includes("dog")
                    ? "🐕"
                    : "🐱"}
                </Text>
              </View>
              <View style={styles.detailHeaderText}>
                <Text
                  style={[
                    typography.h2,
                    { color: colors.primary, marginBottom: 4 },
                  ]}
                >
                  {selectedPet.name}
                </Text>
                <Text style={[typography.body, { color: colors.muted }]}>
                  {selectedPet.species} • {selectedPet.breed}
                </Text>
              </View>
              <Text style={styles.detailGenderBadge}>
                {selectedPet.sex === "M" || selectedPet.sex === "Macho"
                  ? "♂️"
                  : "♀️"}
              </Text>
            </View>

            {/* Information Grid */}
            <View style={styles.detailInfoGrid}>
              {/* Especie */}
              <View style={styles.detailInfoCard}>
                <Text style={styles.detailInfoIcon}>🦴</Text>
                <Text style={styles.detailInfoLabel}>Especie</Text>
                <Text style={styles.detailInfoValue}>
                  {selectedPet.species}
                </Text>
              </View>

              {/* Raza */}
              <View style={styles.detailInfoCard}>
                <Text style={styles.detailInfoIcon}>🏷️</Text>
                <Text style={styles.detailInfoLabel}>Raza</Text>
                <Text style={styles.detailInfoValue}>{selectedPet.breed}</Text>
              </View>

              {/* Edad */}
              <View style={styles.detailInfoCard}>
                <Text style={styles.detailInfoIcon}>📅</Text>
                <Text style={styles.detailInfoLabel}>Edad</Text>
                <Text style={styles.detailInfoValue}>
                  {selectedPet.age} años
                </Text>
              </View>

              {/* Peso */}
              <View style={styles.detailInfoCard}>
                <Text style={styles.detailInfoIcon}>⚖️</Text>
                <Text style={styles.detailInfoLabel}>Peso</Text>
                <Text style={styles.detailInfoValue}>
                  {selectedPet.weight} kg
                </Text>
              </View>
            </View>

            {/* Delete Button */}
            <View style={styles.actionButtonsContainer}>
              <View style={styles.actionButtonsRow}>
                <Button
                  title="✏️ Editar"
                  onPress={() => {
                    closeDetailModal();
                    openFormModal("edit", selectedPet);
                  }}
                  style={styles.editButton}
                />
                <Button
                  title="🗑️ Eliminar"
                  onPress={async () => {
                    Alert.alert(
                      "Confirmar eliminación",
                      `¿Eliminar a ${selectedPet.name} de tus mascotas?`,
                      [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: "Eliminar",
                          onPress: async () => {
                            try {
                              await axiosClient.delete(
                                `/api/pets/${selectedPet.id}`
                              );
                              Alert.alert(
                                "Éxito",
                                `${selectedPet.name} ha sido eliminado`
                              );
                              closeDetailModal();
                              loadPets();
                            } catch (err) {
                              alertApiError(
                                err,
                                "No se pudo eliminar la mascota"
                              );
                            }
                          },
                          style: "destructive",
                        },
                      ]
                    );
                  }}
                  style={styles.deleteButton}
                />
              </View>
            </View>
          </>
        )}
      </DetailModal>

      {/* Form Modal */}
      <DetailModal
        visible={formModalVisible}
        onClose={closeFormModal}
        showClose={false}
      >
        <PetFormOwner
          mode={formMode}
          petId={formMode === "edit" ? selectedPet?.id : undefined}
          onSaved={handlePetSaved}
          onCancel={closeFormModal}
        />
      </DetailModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContent: {
    flex: 1,
  },
  addButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginVertical: 0,
    backgroundColor: colors.primary,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },

  list: { padding: 16, paddingTop: 12 },

  emptyContainer: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  petCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  petIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  petIcon: {
    fontSize: 28,
  },
  petInfo: {
    flex: 1,
  },
  petDetails: {
    flexDirection: "row",
    marginTop: 6,
  },
  petGender: {
    fontSize: 24,
    marginLeft: 8,
  },

  // Detail Modal Styles
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.lightGray,
  },
  detailAvatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailAvatar: {
    fontSize: 36,
  },
  detailHeaderText: {
    flex: 1,
  },
  detailGenderBadge: {
    fontSize: 32,
    marginLeft: 8,
  },
  detailInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  detailInfoCard: {
    width: "48%",
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  detailInfoIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  detailInfoLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    marginBottom: 4,
  },
  detailInfoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: colors.danger,
    flex: 1,
    marginVertical: 0,
    paddingVertical: 10,
  },
  editButton: {
    backgroundColor: colors.primary,
    flex: 1,
    marginVertical: 0,
    paddingVertical: 10,
  },
  actionButtonsContainer: {
    flex: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
});
