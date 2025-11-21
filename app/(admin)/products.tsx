import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import CategoryList from '../../components/admin/CategoryList';
import ProductDetail from '../../components/admin/ProductDetail';
import ProductForm from '../../components/admin/ProductForm';
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
  const [showCategories, setShowCategories] = useState(false);

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
      <View style={[styles.productCard, { borderLeftWidth: 4, borderLeftColor: colors.primary }]}>
        <View style={styles.row}>
          {item.image ? (
            <Image source={{ uri: ensureDataUri(item.image) }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.thumbPlaceholder]} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={[typography.h3, { marginBottom: 4 }]}>🛍️ {item.name}</Text>
            <Text style={[typography.caption, { color: colors.muted, marginBottom: 8 }]}>${item.price} COP</Text>
            <Text style={[typography.caption, { color: colors.muted, marginBottom: 8 }]}>📦 Stock: {item.stock ?? 0}</Text>
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
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🛍️</Text>
        <Text style={[typography.h2, styles.headerTitle]}>Gestión de Productos</Text>
        <Text style={styles.headerSubtitle}>Administra todos los productos disponibles</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.addButton, { flex: 1 }]} onPress={() => openForm(null)}>
          <Text style={styles.addButtonText}>+ Nuevo Producto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, { flex: 1, backgroundColor: colors.secondary }]} onPress={() => setShowCategories(true)}>
          <Text style={styles.addButtonText}>📂 Categorías</Text>
        </TouchableOpacity>
      </View>

      <FlatList data={products} keyExtractor={(i) => String(i.id)} renderItem={renderItem} ListEmptyComponent={<Text>No hay productos.</Text>} refreshing={loading} onRefresh={loadProducts} />

      <DetailModal visible={modalVisible} onClose={() => setModalVisible(false)} showClose={modalMode !== 'form'}>
        {modalMode === 'form' ? (
          <ProductForm product={selected} onSaved={onSaved} onCancel={() => setModalVisible(false)} />
        ) : (
          <ProductDetail product={selected} />
        )}
      </DetailModal>

      <CategoryList 
        visible={showCategories}
        onClose={() => setShowCategories(false)}
        onCategoryAdded={() => loadProducts()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background, paddingTop: 12 },
  header: {
    alignItems: 'center',
    marginBottom: 16,
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
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  addButton: { backgroundColor: colors.primary, padding: 12, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  productCard: { padding: 12 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#eee' },
  thumbPlaceholder: { backgroundColor: '#eef2f3' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  smallBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  smallBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
