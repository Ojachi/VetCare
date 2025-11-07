import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useCart } from '../../context/CartContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

export default function ProductDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const router = useRouter();
  const { addItem } = useCart();

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

  if (loading) return (<View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>);
  if (!product) return (<View style={styles.center}><Text>Producto no encontrado</Text></View>);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {product.image ? <Image source={{ uri: product.image }} style={styles.image} /> : null}
      <Card>
        <Text style={[typography.h2, { marginBottom: 4 }]}>{product.name}</Text>
        <Text style={styles.price}>${Number(product.price).toLocaleString('es-CO')} COP</Text>
        {product.description ? <Text style={[typography.body, { marginTop: 10 }]}>{product.description}</Text> : null}
      </Card>
      <View style={styles.qtyRow}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty((q) => Math.max(1, q - 1))}>
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyVal}>{qty}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty((q) => q + 1)}>
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>
      <Button
        title="Agregar al carrito"
        onPress={() => {
          addItem({ productId: String(product.id ?? product.productId ?? ''), name: product.name, price: Number(product.price), image: product.image }, qty);
        }}
      />
      <View style={{ height: 8 }} />
      <Button title="Volver" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 16, backgroundColor: colors.background },
  image: { width: '100%', height: 220, borderRadius: 12, marginBottom: 12, backgroundColor: '#eee' },
  price: { marginTop: 4, color: colors.muted, fontWeight: '700' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  qtyBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  qtyText: { color: '#fff', fontWeight: '800' },
  qtyVal: { marginHorizontal: 12, fontSize: 16, fontWeight: '700' },
});
