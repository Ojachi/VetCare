import React, { useEffect, useState } from 'react';
import { Alert, Button, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import ButtonUI from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { alertApiError } from '../../utils/apiError';

export default function ProductForm({ product, onSaved, onCancel }: { product?: any | null; onSaved: (p: any) => void; onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price ? String(product.price) : '');
  const [image, setImage] = useState(product?.image ?? '');

  useEffect(() => {
    setName(product?.name ?? '');
    setDescription(product?.description ?? '');
    setPrice(product?.price ? String(product.price) : '');
    setImage(product?.image ?? '');
  }, [product]);

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
      onSaved(res.data);
    } catch (err) {
      alertApiError(err, 'No se pudo guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Text style={styles.title}>{product?.id ? 'Editar Producto' : 'Crear Producto'}</Text>
      <Input placeholder="Nombre" value={name} onChangeText={setName} style={styles.input} />
      <Input placeholder="Descripción" value={description} onChangeText={setDescription} style={styles.input} />
      <Input placeholder="Precio" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
      <Input placeholder="Imagen (data URI o URL)" value={image} onChangeText={setImage} style={styles.input} />

      <View style={styles.actions}>
        <ButtonUI title={loading ? 'Guardando...' : (product?.id ? 'Guardar' : 'Registrar')} onPress={onSubmit} disabled={loading} />
        <Button title="Cancelar" color="gray" onPress={onCancel} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 12 },
  actions: { marginTop: 12 },
});
