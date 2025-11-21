import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import DetailModal from '../ui/DetailModal';

type Category = {
  id: number;
  name: string;
  description?: string;
  active: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onCategoryAdded?: () => void;
};

export default function CategoryList({ visible, onClose, onCategoryAdded }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible]);

  const loadCategories = async () => {
    try {
      const response = await axiosClient.get<Category[]>('/api/categories');
      setCategories(response.data || []);
    } catch (error) {
      alertApiError(error, 'No se pudieron cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) {
      alert('El nombre de la categoría es requerido');
      return;
    }

    try {
      if (editingId) {
        await axiosClient.put(`/api/categories/${editingId}`, formData);
      } else {
        await axiosClient.post('/api/categories', formData);
      }
      setFormData({ name: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      await loadCategories();
      onCategoryAdded?.();
    } catch (error) {
      alertApiError(error, 'Error al guardar la categoría');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, description: category.description || '' });
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (!visible) return null;

  if (showForm) {
    return (
      <DetailModal visible={true} onClose={handleCancel}>
        <ScrollView style={styles.formContainer}>
          <Text style={[typography.h2, styles.title]}>
            {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la categoría"
              placeholderTextColor={colors.muted}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción de la categoría"
              placeholderTextColor={colors.muted}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]}
              onPress={handleSaveCategory}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </DetailModal>
    );
  }

  return (
    <DetailModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={[typography.h2, styles.title]}>Gestionar Categorías</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.categoryItem}>
                  <View style={styles.categoryInfo}>
                    <Text style={[typography.h3, styles.categoryName]}>{item.name}</Text>
                    {item.description && (
                      <Text style={styles.categoryDesc}>{item.description}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleEditCategory(item)}
                    style={styles.editBtn}
                  >
                    <Text style={styles.editBtnText}>✏️</Text>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                <Text style={[typography.body, styles.empty]}>
                  No hay categorías registradas
                </Text>
              }
            />

            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={() => setShowForm(true)}
            >
              <Text style={styles.buttonText}>+ Agregar Categoría</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </DetailModal>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 16 },
  center: { justifyContent: 'center', alignItems: 'center', height: 100 },
  title: { marginBottom: 16, textAlign: 'center', color: colors.darkGray },
  
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
  },
  categoryInfo: { flex: 1 },
  categoryName: { color: colors.primary, marginBottom: 2 },
  categoryDesc: { fontSize: 12, color: colors.muted },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  editBtnText: { fontSize: 14 },
  
  // Form styles
  formContainer: { paddingVertical: 16 },
  fieldGroup: { marginHorizontal: 12, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.darkGray, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.white,
    color: colors.darkGray,
    fontSize: 14,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputText: { fontSize: 14, color: colors.darkGray },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 12,
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: { flex: 1, backgroundColor: colors.primary },
  cancelButton: { flex: 1, backgroundColor: colors.muted },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  addButton: { marginTop: 16, marginHorizontal: 12, backgroundColor: colors.primary },

  empty: { textAlign: 'center', color: colors.muted, marginVertical: 20 },
});
