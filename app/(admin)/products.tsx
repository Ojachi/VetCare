import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import ProductDetail from '../../components/admin/ProductDetail';
import ProductForm from '../../components/admin/ProductForm';
import DetailModal from '../../components/ui/DetailModal';
import colors from '../../styles/colors';
import { alertApiError } from '../../utils/apiError';

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'form'|'detail'>('detail');
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get<any[]>('/api/products');
      setProducts(res.data || []);
    } catch (err) {
      alertApiError(err, 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (p: any) => { setSelected(p); setModalMode('detail'); setModalVisible(true); };
  const openForm = (p?: any | null) => { setSelected(p ?? null); setModalMode('form'); setModalVisible(true); };

  const onSaved = () => { setModalVisible(false); loadProducts(); };

  const onDelete = (id: number) => {
    Alert.alert('Eliminar producto', '¿Estás seguro?', [
      { text: 'No' },
      { text: 'Sí', onPress: async () => {
        try {
          await axiosClient.delete(`/api/products/${id}`);
          loadProducts();
          Alert.alert('Éxito', 'Producto eliminado');
        } catch (err) {
          alertApiError(err, 'No se pudo eliminar el producto');
        }
      }}
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => openDetail(item)}>
      {item.image ? <Image source={{ uri: item.image }} style={styles.thumb} /> : <View style={[styles.thumb, styles.thumbPlaceholder]} />}
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price} COP</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
          <TouchableOpacity onPress={() => openForm(item)} style={[styles.btn, { backgroundColor: colors.secondary }]}><Text style={styles.btnText}>Editar</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)} style={[styles.btn, { backgroundColor: colors.danger }]}><Text style={styles.btnText}>Eliminar</Text></TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gestión de Productos</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => openForm(null)}>
        <Text style={styles.addButtonText}>+ Nuevo Producto</Text>
      </TouchableOpacity>

      <FlatList data={products} keyExtractor={(i) => String(i.id)} renderItem={renderItem} ListEmptyComponent={<Text>No hay productos.</Text>} refreshing={loading} onRefresh={loadProducts} />

      <DetailModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        {modalMode === 'form' ? (
          <ProductForm product={selected} onSaved={onSaved} onCancel={() => setModalVisible(false)} />
        ) : (
          <ProductDetail product={selected} />
        )}
      </DetailModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  addButton: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  card: { flexDirection: 'row', gap: 12, padding: 12, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10, elevation: 1 },
  thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#eee' },
  thumbPlaceholder: { backgroundColor: '#eef2f3' },
  name: { fontWeight: '700' },
  price: { marginTop: 4, color: '#444' },
  btn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '600' },
});
