import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/ui/EmptyState';
import { useSession } from '../../context/SessionContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import { ensureDataUri } from '../../utils/image';

// Catálogo público: ver productos sin autenticación; acciones avanzadas requieren login.
export default function PublicProductsCatalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useSession();

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

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  if (!loading && products.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}> 
        <EmptyState title="Sin productos" message="Pronto encontrarás aquí artículos para tus mascotas." />
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push({ pathname: '/(auth)/product-detail', params: { id: String(item.id) } } as any)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: ensureDataUri(item.image) }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]}>
            <Ionicons name="image-outline" size={32} color={colors.muted} />
          </View>
        )}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NUEVO</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={[typography.body, styles.name]} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price}>${Number(item.price).toLocaleString('es-CO')}</Text>
        {!user && (
          <View style={styles.loginHintBox}>
            <Ionicons name="lock-closed" size={14} color={colors.secondary} style={{ marginRight: 4 }} />
            <Text style={styles.loginHint}>Login para comprar</Text>
          </View>
        )}
        {user && (
          <TouchableOpacity style={styles.cartBtn} activeOpacity={0.7}>
            <Ionicons name="bag-add" size={16} color="#fff" />
            <Text style={styles.cartBtnText}>Al carrito</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🛍️ Tienda</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSubtitle}>Productos para tu mascota</Text>
      </View>

      {/* FILTER BAR */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
          <Ionicons name="filter" size={18} color={colors.primary} />
          <Text style={styles.filterBtnText}>Filtrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
          <Ionicons name="swap-vertical" size={18} color={colors.primary} />
          <Text style={styles.filterBtnText}>Ordenar</Text>
        </TouchableOpacity>
        <View style={styles.productsCountBadge}>
          <Text style={styles.productsCountText}>{products.length}</Text>
        </View>
      </View>

      {/* PRODUCTS GRID */}
      <FlatList
        data={products}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
        contentContainerStyle={{ gap: 12, paddingVertical: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h2,
    fontSize: 22,
    fontWeight: '800',
    color: colors.darkGray,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.muted,
    fontSize: 13,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: 'rgba(46, 139, 87, 0.05)',
    gap: 6,
  },
  filterBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  productsCountBadge: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  productsCountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  card: { 
    flex: 1, 
    backgroundColor: '#fff', 
    borderRadius: 14, 
    overflow: 'hidden',
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: '#f3f4f6',
  },
  thumb: { 
    width: '100%', 
    height: '100%',
    resizeMode: 'cover',
  },
  thumbPlaceholder: { 
    backgroundColor: '#eef2f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  badge: {
    backgroundColor: colors.secondary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 12,
  },
  name: { 
    fontWeight: '700', 
    color: colors.darkGray,
    fontSize: 13,
    lineHeight: 18,
  },
  price: { 
    marginTop: 6, 
    color: colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  loginHintBox: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 6,
  },
  loginHint: { 
    fontSize: 11, 
    color: colors.secondary, 
    fontWeight: '600',
  },
  cartBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    gap: 4,
  },
  cartBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});
