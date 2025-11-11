import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useImagePicker } from '../../hooks/useImagePicker';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

export default function ProductForm({ product, onSaved, onCancel }: { product?: any | null; onSaved: (p: any) => void; onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price ? String(product.price) : '');
  const [image, setImage] = useState<string>(product?.image ?? '');
  const [previewUri, setPreviewUri] = useState<string | undefined>(undefined);
  const [descHeight, setDescHeight] = useState(100);

  useEffect(() => {
    setName(product?.name ?? '');
    setDescription(product?.description ?? '');
    setPrice(product?.price ? String(product.price) : '');
    setImage(product?.image ?? '');
    if (product?.image) {
      if (product.image.startsWith('data:') || product.image.startsWith('http')) setPreviewUri(product.image);
      else setPreviewUri(`data:image/jpeg;base64,${product.image}`);
    } else {
      setPreviewUri(undefined);
    }
  }, [product]);

  const { pickImage } = useImagePicker();

  const handlePickImage = async () => {
    const res = await pickImage({ base64: true, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (res.canceled) {
      if (res.error) console.warn('Picker cancel/error:', res.error);
      return;
    }
    const asset = res.assets?.[0];
    if (!asset) return;
    if (asset.base64) {
      setImage(asset.base64);
      setPreviewUri(`data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`);
    } else if (asset.uri) {
      try {
        const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' as any });
        setImage(base64);
        setPreviewUri(`data:${asset.mimeType ?? 'image/jpeg'};base64,${base64}`);
      } catch (e) {
        console.error('readAsStringAsync error', e);
        Alert.alert('Error', 'No se pudo leer la imagen seleccionada');
      }
    }
  };

  const onSubmit = async () => {
    if (!name || !price) {
      Alert.alert('Error', 'Por favor completa nombre y precio');
      return;
    }
    setLoading(true);
    const payload: any = { name, description, price: Number(price), image: image || null };
    
    try {
      let res;
      if (product?.id) {
        res = await axiosClient.put(`/api/products/${product.id}`, payload);
      } else {
        res = await axiosClient.post('/api/products', payload);
      }
      Alert.alert('Éxito', 'Producto guardado correctamente');
      onSaved(res.data);
    } catch (err) {
      alertApiError(err, 'No se pudo guardar el producto');
    } finally {
      setLoading(false);
    }
  };

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
