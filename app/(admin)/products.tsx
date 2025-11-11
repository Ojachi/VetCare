import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import ProductDetail from '../../components/admin/ProductDetail';
import ProductForm from '../../components/admin/ProductForm';
import Card from '../../components/ui/Card';
import DetailModal from '../../components/ui/DetailModal';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import { ensureDataUri } from '../../utils/image';

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
    <TouchableOpacity onPress={() => openDetail(item)} activeOpacity={0.85}>
      <Card style={styles.productCard}>
        <View style={styles.row}>
          {item.image ? (
            <Image source={{ uri: ensureDataUri(item.image) }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.thumbPlaceholder]} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={typography.h3} numberOfLines={1}>{item.name}</Text>
            <Text style={[typography.caption, { marginTop: 4 }]}>${item.price} COP</Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={() => openForm(item)} style={[styles.smallBtn, { backgroundColor: colors.secondary }]}>
                <Text style={styles.smallBtnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(item.id)} style={[styles.smallBtn, { backgroundColor: colors.danger }]}>
                <Text style={styles.smallBtnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={typography.h2}>Gestión de Productos</Text>
      <TouchableOpacity style={[styles.addButton, { marginVertical: 12 }]} onPress={() => openForm(null)}>
        <Text style={styles.addButtonText}>+ Nuevo Producto</Text>
      </TouchableOpacity>

      <FlatList data={products} keyExtractor={(i) => String(i.id)} renderItem={renderItem} ListEmptyComponent={<Text>No hay productos.</Text>} refreshing={loading} onRefresh={loadProducts} />

      <DetailModal visible={modalVisible} onClose={() => setModalVisible(false)} showClose={modalMode !== 'form'}>
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
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  addButton: { backgroundColor: colors.primary, padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 8 },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  productCard: { padding: 12 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#eee' },
  thumbPlaceholder: { backgroundColor: '#eef2f3' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  smallBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  smallBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
