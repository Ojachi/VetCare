import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { ensureDataUri } from '../../utils/image';
import Card from '../ui/Card';

export default function ProductDetail({ product }: { product: any }) {
  if (!product) return null;
  const img = product.image ? { uri: ensureDataUri(product.image) } : undefined;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🛍️</Text>
        <View>
          <Text style={typography.h2}>{product.name}</Text>
          <Text style={[typography.caption, { color: colors.muted }]}>Detalles del producto</Text>
        </View>
      </View>
      
      {img ? (
        <Card style={{ marginBottom: 12, overflow: 'hidden' }}>
          <Image source={img} style={styles.image} resizeMode="cover" />
        </Card>
      ) : null}
      
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={[typography.caption, { color: colors.muted }]}>Descripción</Text>
          <Text style={[typography.body, { marginTop: 6 }]}>{product.description || 'Sin descripción'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={[typography.caption, { color: colors.muted }]}>Precio</Text>
          <Text style={[typography.body, { marginTop: 6, fontSize: 18, fontWeight: '700', color: colors.primary }]}>${product.price} COP</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={[typography.caption, { color: colors.muted }]}>Stock</Text>
          <Text style={[typography.body, { marginTop: 6, fontSize: 16, fontWeight: '600', color: product.stock > 0 ? colors.primary : colors.danger }]}>📦 {product.stock ?? 0} unidades</Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  headerEmoji: { fontSize: 40, marginRight: 8 },
  image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 },
  infoCard: { padding: 12 },
  infoRow: { marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#EEF2F3', marginVertical: 12 },
});
