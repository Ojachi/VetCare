import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useImagePicker } from '../../hooks/useImagePicker';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

type Category = {
  id: number;
  name: string;
};

type ImageAsset = {
  uri: string;
  type: string;
  name: string;
};

export default function ProductForm({ product, onSaved, onCancel }: { product?: any | null; onSaved: (p: any) => void; onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price ? String(product.price) : '');
  const [stock, setStock] = useState(product?.stock ? String(product.stock) : '');
  const [imageAsset, setImageAsset] = useState<ImageAsset | null>(null);
  const [previewUri, setPreviewUri] = useState<string | undefined>(undefined);
  const [descHeight, setDescHeight] = useState(100);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(product?.categoryId ?? null);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    setName(product?.name ?? '');
    setDescription(product?.description ?? '');
    setPrice(product?.price ? String(product.price) : '');
    setStock(product?.stock ? String(product.stock) : '');
    setImageAsset(null);
    setSelectedCategoryId(product?.categoryId ?? null);
    if (product?.image) {
      // Mostrar imagen de URL de Cloudinary
      if (product.image.startsWith('http')) {
        setPreviewUri(product.image);
      } else {
        setPreviewUri(undefined);
      }
    } else {
      setPreviewUri(undefined);
    }
    loadCategories();
  }, [product]);

  const loadCategories = async () => {
    try {
      const res = await axiosClient.get<Category[]>('/api/categories');
      setCategories(res.data || []);
    } catch (error) {
      alertApiError(error, 'No se pudieron cargar las categorías');
    }
  };

  const { pickImage } = useImagePicker();

  const handlePickImage = async () => {
    const res = await pickImage({ base64: false, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (res.canceled) {
      if (res.error) console.warn('Picker cancel/error:', res.error);
      return;
    }
    const asset = res.assets?.[0];
    if (!asset?.uri) return;
    
    const fileName = asset.uri.split('/').pop() || 'image.jpg';
    const mimeType = asset.mimeType || 'image/jpeg';
    
    setImageAsset({
      uri: asset.uri,
      type: mimeType,
      name: fileName,
    });
    setPreviewUri(asset.uri);
  };

  const onSubmit = async () => {
    if (!name || !price || !stock) {
      Alert.alert('Error', 'Por favor completa nombre, precio y stock');
      return;
    }
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Construir JSON del producto
      const productData = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        ...(selectedCategoryId && { categoryId: selectedCategoryId }),
      };
      
      formData.append('product', JSON.stringify(productData));
      
      // Agregar imagen si hay una nueva
      if (imageAsset) {
        formData.append('image', {
          uri: imageAsset.uri,
          type: imageAsset.type,
          name: imageAsset.name,
        } as any);
      }
      
      let res;
      if (product?.id) {
        res = await axiosClient.put(`/api/products/${product.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await axiosClient.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      Alert.alert('Éxito', 'Producto guardado correctamente');
      onSaved(res.data);
    } catch (err) {
      alertApiError(err, 'No se pudo guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🛍️</Text>
        <View>
          <Text style={typography.h2}>{product?.id ? 'Editar producto' : 'Nuevo producto'}</Text>
          <Text style={[typography.caption, { color: colors.muted }]}>Completa los datos del producto</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.formCard}>
          <Text style={[typography.caption, { color: colors.muted, marginBottom: 8 }]}>📝 Nombre</Text>
          <Input placeholder="Nombre del producto" value={name} onChangeText={setName} style={{ marginBottom: 12 }} />
          
          <Text style={[typography.caption, { color: colors.muted, marginBottom: 8 }]}>📄 Descripción</Text>
          <Input
            placeholder="Descripción del producto"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            onContentSizeChange={(e) => setDescHeight(e.nativeEvent.contentSize.height)}
            style={[styles.textarea, { height: Math.max(100, descHeight), marginBottom: 12 }]}
          />
          
          <Text style={[typography.caption, { color: colors.muted, marginBottom: 8 }]}>💰 Precio</Text>
          <Input placeholder="0.00" value={price} onChangeText={setPrice} keyboardType="numeric" style={{ marginBottom: 12 }} />
          
          <Text style={[typography.caption, { color: colors.muted, marginBottom: 8 }]}>📦 Stock</Text>
          <Input placeholder="0" value={stock} onChangeText={setStock} keyboardType="numeric" style={{ marginBottom: 12 }} />

          <Text style={[typography.caption, { color: colors.muted, marginBottom: 8 }]}>📂 Categoría</Text>
          <TouchableOpacity 
            style={[styles.categoryButton, showCategories && { backgroundColor: colors.secondary }]}
            onPress={() => setShowCategories(!showCategories)}
          >
            <Text style={styles.categoryButtonText}>
              {selectedCategory ? selectedCategory.name : 'Seleccionar categoría'}
            </Text>
          </TouchableOpacity>
          
          {showCategories && (
            <View style={styles.categoryDropdown}>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.categoryOption,
                      selectedCategoryId === item.id && styles.categoryOptionSelected
                    ]}
                    onPress={() => {
                      setSelectedCategoryId(item.id);
                      setShowCategories(false);
                    }}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      selectedCategoryId === item.id && styles.categoryOptionTextSelected
                    ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.noCategoriesText}>No hay categorías</Text>
                }
              />
            </View>
          )}
          
          {previewUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: previewUri }} style={styles.preview} />
            </View>
          ) : null}

          <TouchableOpacity 
            style={styles.pickImageButton}
            onPress={handlePickImage}
            activeOpacity={0.8}
          >
            <Text style={styles.pickImageButtonText}>📷 Seleccionar imagen</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={onSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Guardando...' : (product?.id ? 'Guardar' : 'Registrar')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  headerEmoji: { fontSize: 40 },
  form: { paddingBottom: 16, gap: 0 },
  formCard: { padding: 12, marginBottom: 16 },
  
  categoryButton: {
    backgroundColor: colors.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryButtonText: {
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: '500',
  },
  categoryDropdown: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    marginBottom: 12,
    maxHeight: 200,
  },
  categoryOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  categoryOptionSelected: {
    backgroundColor: colors.secondary,
  },
  categoryOptionText: {
    fontSize: 14,
    color: colors.darkGray,
  },
  categoryOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  noCategoriesText: {
    padding: 12,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 13,
  },
  
  previewContainer: { marginBottom: 12, borderRadius: 12, overflow: 'hidden' },
  preview: { width: '100%', height: 180, borderRadius: 12, backgroundColor: '#eee' },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  pickImageButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickImageButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
