import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import ButtonUI from '../../components/ui/Button';
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
  const [image, setImage] = useState<string>(product?.image ?? ''); // raw base64 or data uri
  const [previewUri, setPreviewUri] = useState<string | undefined>(undefined);
  const [descHeight, setDescHeight] = useState(100);

  useEffect(() => {
    setName(product?.name ?? '');
    setDescription(product?.description ?? '');
    setPrice(product?.price ? String(product.price) : '');
    setImage(product?.image ?? '');
    // set preview from provided product image
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
    <View style={{}}
    >
      <Text style={[typography.h3, { textAlign: 'center' }]}>{product?.id ? 'Editar Producto' : 'Crear Producto'}</Text>
      <Text style={[typography.caption, { textAlign: 'center', color: colors.darkGray, marginBottom: 12 }]}>Completa los datos del producto</Text>
      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Input placeholder="Nombre" value={name} onChangeText={setName} />
        <Input
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
          onContentSizeChange={(e) => setDescHeight(e.nativeEvent.contentSize.height)}
          style={[styles.textarea, { height: Math.max(100, descHeight) }]}
        />
        <Input placeholder="Precio" value={price} onChangeText={setPrice} keyboardType="numeric" />
        {previewUri ? (
          <Image source={{ uri: previewUri }} style={styles.preview} />
        ) : null}
  <ButtonUI title="Seleccionar imagen" onPress={handlePickImage} />

        <View style={styles.actionsRow}>
          <ButtonUI
            title={loading ? 'Guardando...' : (product?.id ? 'Guardar' : 'Registrar')}
            onPress={onSubmit}
            disabled={loading}
            style={{ flex: 1, marginRight: 8, backgroundColor: colors.secondary }}
            textStyle={{ fontSize: 16 }}
          />
          <ButtonUI
            title="Cancelar"
            onPress={onCancel}
            style={{ flex: 1, backgroundColor: colors.danger }}
            textStyle={{ fontSize: 16 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { paddingBottom: 8, gap: 8 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  preview: { width: '100%', height: 160, borderRadius: 10, backgroundColor: '#eee' },
  textarea: { minHeight: 100 },
});
