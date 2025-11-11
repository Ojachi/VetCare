import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import { useSession } from '../../context/SessionContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

export default function PublicProductDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const { user } = useSession();

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const res = await axiosClient.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        alertApiError(err, 'No se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  if (!product) return (
    <View style={styles.center}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.muted} style={{ marginBottom: 12 }} />
      <Text style={typography.h2}>Producto no encontrado</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles</Text>
        <TouchableOpacity 
          onPress={() => setIsFavorite(!isFavorite)} 
          style={styles.headerBtn}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? colors.secondary : colors.darkGray} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* IMAGE */}
        <View style={styles.imageContainer}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="image-outline" size={64} color={colors.muted} />
            </View>
          )}
          <View style={styles.imageBadge}>
            <Text style={styles.imageBadgeText}>DISPONIBLE</Text>
          </View>
        </View>

        {/* PRODUCT INFO */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name}</Text>
          </View>
          
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons 
                  key={i} 
                  name={i < 4 ? "star" : "star-outline"} 
                  size={16} 
                  color={colors.primary} 
                />
              ))}
            </View>
            <Text style={styles.ratingText}>(128 reseñas)</Text>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>${Number(product.price).toLocaleString('es-CO')}</Text>
            <View style={styles.priceTagline}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <Text style={styles.priceTaglineText}>Precio garantizado</Text>
            </View>
          </View>

          {product.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>Descripción</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          )}

          {/* FEATURES */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Características</Text>
            <View style={styles.featureRow}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-outline" size={20} color={colors.primary} />
                <Text style={styles.featureText}>Alta calidad</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="star-outline" size={20} color={colors.primary} />
                <Text style={styles.featureText}>Recomendado</Text>
              </View>
            </View>
          </View>

          {/* QUANTITY SELECTOR */}
          <View style={styles.qtySection}>
            <Text style={styles.sectionTitle}>Cantidad</Text>
            <View style={styles.qtyContainer}>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => setQty((q) => q + 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM ACTIONS */}
      <View style={styles.actionBar}>
        {user ? (
          <>
            <TouchableOpacity 
              style={styles.primaryBtn}
              activeOpacity={0.8}
              onPress={() => router.replace({ pathname: '/(owner)/product-detail', params: { id: String(product.id) } } as any)}
            >
              <Ionicons name="bag" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Agregar al Carrito</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="share-social-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={styles.primaryBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/(auth)/login' as any)}
          >
            <Ionicons name="log-in" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>Inicia Sesión para Comprar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    fontSize: 18,
    fontWeight: '800',
    color: colors.darkGray,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 280,
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2f3',
  },
  imageBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  imageBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  titleRow: {
    marginBottom: 12,
  },
  productName: {
    ...typography.h2,
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGray,
    lineHeight: 32,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  priceSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  price: {
    color: colors.primary,
    fontWeight: '900',
    fontSize: 28,
    marginBottom: 8,
  },
  priceTagline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceTaglineText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 8,
  },
  descriptionText: {
    ...typography.body,
    color: colors.muted,
    lineHeight: 20,
    fontSize: 13,
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 12,
    fontSize: 14,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featureItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  featureText: {
    color: colors.darkGray,
    fontWeight: '600',
    fontSize: 12,
  },
  qtySection: {
    marginBottom: 12,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkGray,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  secondaryBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});
