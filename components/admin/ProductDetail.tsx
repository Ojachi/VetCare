import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function ProductDetail({ product }: { product: any }) {
  if (!product) return null;
  const img = product.image ? { uri: product.image } : undefined;
  return (
    <View style={styles.container}>
      {img ? <Image source={img} style={styles.image} resizeMode="cover" /> : null}
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.desc}>{product.description || 'Sin descripción'}</Text>
      <Text style={styles.price}>${product.price} COP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  image: { width: '100%', height: 180, borderRadius: 10, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  desc: { marginTop: 8, color: '#555' },
  price: { marginTop: 10, fontWeight: 'bold' },
});
