import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/ui/EmptyState';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import { ensureDataUri } from '../../utils/image';

export default function ProductsCatalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/products');
      setProducts(res.data || []);
    } catch (err) {
      alertApiError(err, 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (<View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>);

  if (!loading && products.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}> 
        <EmptyState title="Sin productos" message="Pronto encontrarás aquí artículos para tus mascotas." />
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/(owner)/product-detail', params: { id: String(item.id) } } as any)}>
  {item.image ? <Image source={{ uri: ensureDataUri(item.image) }} style={styles.thumb} /> : <View style={[styles.thumb, styles.thumbPlaceholder]} />}
  <Text style={[typography.body, styles.name]} numberOfLines={1}>{item.name}</Text>
  <Text style={styles.price}>${Number(item.price).toLocaleString('es-CO')} COP</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={products}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  thumb: { width: '100%', height: 100, borderRadius: 8, backgroundColor: '#eee', marginBottom: 8 },
  thumbPlaceholder: { backgroundColor: '#eef2f3' },
  name: { fontWeight: '700', textAlign: 'center' },
  price: { marginTop: 4, color: colors.muted },
});
