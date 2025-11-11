import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import CartOwner from '../../components/owner/CartOwner';
import Button from '../../components/ui/Button';
import DetailModal from '../../components/ui/DetailModal';
import { useCart } from '../../context/CartContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

export default function ProductosOwner() {
  const { cart } = useLocalSearchParams<{ cart?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartViewVisible, setCartViewVisible] = useState(cart === '1');
  const { addItem, items } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axiosClient.get<Product[]>('/api/products');
      setProducts(response.data || []);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setSelectedProduct(null);
    setDetailModalVisible(false);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addItem({
        productId: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image,
      }, quantity);
      Alert.alert('Éxito', `${quantity} ${quantity === 1 ? 'producto agregado' : 'productos agregados'} al carrito`);
      closeDetailModal();
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (cartViewVisible) {
    return (
      <>
        <CartOwner />
        {detailModalVisible && (
          <DetailModal
            visible={detailModalVisible}
            onClose={closeDetailModal}
            extraFooterButton={
              selectedProduct
                ? {
                    title: 'Agregar al Carrito',
                    onPress: handleAddToCart,
                    style: { backgroundColor: colors.success },
                  }
                : undefined
            }
          >
            {selectedProduct && (
              <>
                {/* Product Image or Placeholder */}
                <View style={styles.productImageContainer}>
                  {selectedProduct.image ? (
                    <Text style={styles.imagePlaceholder}>📦</Text>
                  ) : (
                    <Text style={styles.imagePlaceholder}>📦</Text>
                  )}
                </View>

                {/* Product Name */}
                <Text style={[typography.h2, { marginBottom: 4, textAlign: 'center', color: colors.primary }]}>
                  {selectedProduct.name}
                </Text>

                {/* Price Badge */}
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>${selectedProduct.price.toFixed(2)}</Text>
                </View>

                {/* Description */}
                <View style={styles.descriptionContainer}>
                  <Text style={[typography.caption, { color: colors.darkGray, marginBottom: 8 }]}>
                    DESCRIPCIÓN
                  </Text>
                  <Text style={[typography.body, { lineHeight: 20, color: colors.darkGray }]}>
                    {selectedProduct.description}
                  </Text>
                </View>

                {/* Quantity Selector */}
                <View style={styles.quantitySelectorContainer}>
                  <Text style={[typography.caption, { color: colors.darkGray, marginBottom: 12 }]}>
                    CANTIDAD
                  </Text>
                  <View style={styles.quantitySelector}>
                    <TouchableOpacity
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                    >
                      <Text style={[styles.qtyBtnText, quantity <= 1 && styles.qtyBtnTextDisabled]}>−</Text>
                    </TouchableOpacity>
                    <View style={styles.qtyDisplay}>
                      <Text style={[typography.h3, { fontWeight: '700' }]}>
                        {quantity}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setQuantity(quantity + 1)}
                      style={styles.qtyBtn}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Quick Info */}
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>✓ Disponible</Text>
                    <Text style={styles.infoLabel}>⚡ Envío rápido</Text>
                  </View>
                </View>
              </>
            )}
          </DetailModal>
        )}
        <View style={styles.backButton}>
          <Button
            title="← Volver a Productos"
            onPress={() => setCartViewVisible(false)}
            style={{ backgroundColor: colors.secondary }}
          />
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={[typography.h2, { color: colors.darkGray, marginBottom: 4 }]}>🛍️ Productos</Text>
          <Text style={[typography.body, { color: colors.muted }]}>Explora nuestro catálogo</Text>
        </View>
        {items.length > 0 && (
          <View style={styles.cartBadgeContainer}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{items.length}</Text>
            </View>
            <Button
              title="🛒"
              onPress={() => setCartViewVisible(true)}
              style={styles.cartButton}
              textStyle={styles.cartButtonText}
            />
          </View>
        )}
      </View>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[typography.body, { fontSize: 16, marginBottom: 8 }]}>📦 No hay productos disponibles</Text>
            <Text style={[typography.body, { color: colors.muted, textAlign: 'center' }]}>
              Vuelve más tarde para ver nuestro catálogo actualizado
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => openDetailModal(item)}
            style={styles.productItem}
          >
            <View style={styles.productCard}>
              <View style={styles.productImageSmall}>
                <Text style={styles.productImageIcon}>📦</Text>
              </View>
              <Text style={[typography.h3, { fontSize: 15, marginTop: 12, marginBottom: 6, color: colors.darkGray }]}>
                {item.name}
              </Text>
              <Text style={[typography.body, { fontSize: 12, color: colors.muted, marginBottom: 10, height: 30 }]}>
                {item.description.length > 35 ? item.description.substring(0, 35) + '...' : item.description}
              </Text>
              <View style={styles.productPrice}>
                <Text style={styles.priceValue}>${item.price.toFixed(2)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Product Detail Modal */}
      <DetailModal
        visible={detailModalVisible}
        onClose={closeDetailModal}
        extraFooterButton={
          selectedProduct
            ? {
                title: 'Agregar',
                onPress: handleAddToCart,
                style: { backgroundColor: colors.success },
              }
            : undefined
        }
      >
        {selectedProduct && (
          <>
            {/* Product Image or Placeholder */}
            <View style={styles.productImageContainer}>
              {selectedProduct.image ? (
                <Text style={styles.imagePlaceholder}>📦</Text>
              ) : (
                <Text style={styles.imagePlaceholder}>📦</Text>
              )}
            </View>

            {/* Product Name */}
            <Text style={[typography.h2, { marginBottom: 4, textAlign: 'center', color: colors.primary }]}>
              {selectedProduct.name}
            </Text>

            {/* Price Badge */}
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>${selectedProduct.price.toFixed(2)}</Text>
            </View>

            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Text style={[typography.caption, { color: colors.darkGray, marginBottom: 8 }]}>
                DESCRIPCIÓN
              </Text>
              <Text style={[typography.body, { lineHeight: 20, color: colors.darkGray }]}>
                {selectedProduct.description}
              </Text>
            </View>

            {/* Quantity Selector */}
            <View style={styles.quantitySelectorContainer}>
              <Text style={[typography.caption, { color: colors.darkGray, marginBottom: 12 }]}>
                CANTIDAD
              </Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                >
                  <Text style={[styles.qtyBtnText, quantity <= 1 && styles.qtyBtnTextDisabled]}>−</Text>
                </TouchableOpacity>
                <View style={styles.qtyDisplay}>
                  <Text style={[typography.h3, { fontWeight: '700' }]}>
                    {quantity}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setQuantity(quantity + 1)}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Info */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>✓ Disponible</Text>
                <Text style={styles.infoLabel}>⚡ Envío rápido</Text>
              </View>
            </View>
          </>
        )}
      </DetailModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
  },
  cartBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartBadge: {
    backgroundColor: colors.danger,
    borderRadius: 20,
    minWidth: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  cartButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 0,
    backgroundColor: colors.success,
  },
  cartButtonText: {
    fontSize: 18,
  },
  
  list: { padding: 12, paddingTop: 8 },
  columnWrapper: {
    gap: 12,
  },
  
  emptyContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  productItem: {
    flex: 1,
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    height: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  productImageSmall: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageIcon: {
    fontSize: 40,
  },
  productPrice: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  priceValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  
  backButton: {
    padding: 16,
    paddingBottom: 8,
  },
  
  // Product Detail Modal Styles
  productImageContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePlaceholder: {
    fontSize: 48,
  },
  priceBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: 16,
  },
  priceText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  descriptionContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  quantitySelectorContainer: {
    marginBottom: 16,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 10,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnDisabled: {
    opacity: 0.5,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  qtyBtnTextDisabled: {
    color: colors.darkGray,
  },
  qtyDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.lightGray,
    paddingVertical: 8,
  },
  infoCard: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkGray,
  },
});
