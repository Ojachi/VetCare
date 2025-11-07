import React, { useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/ui/Button';
import DateTimePickerInput from '../../components/ui/DateTimePickerInput';
import EmptyState from '../../components/ui/EmptyState';
import { useCart } from '../../context/CartContext';
import colors from '../../styles/colors';

export default function CartPage() {
  const { items, total, updateQty, removeItem, checkout } = useCart();
  const [pickupAt, setPickupAt] = useState<Date>(new Date());
  // En esta primera versión no vinculamos a una cita específica.

  const onConfirm = () => {
  const res = checkout({ pickupDate: pickupAt });
    if (res.ok) {
      Alert.alert('Pedido confirmado', 'Tu pedido fue registrado localmente. Lo prepararemos para tu próxima visita.');
    }
  };

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <EmptyState title="Tu carrito está vacío" message="Agrega productos desde el catálogo para iniciar tu pedido." />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(it) => it.productId}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <View style={styles.row}>
                {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : <View style={[styles.image, styles.placeholder]} />}
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>${item.price} COP</Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.productId, item.quantity - 1)}>
                      <Text style={styles.qtyText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyVal}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.productId, item.quantity + 1)}>
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeItem(item.productId)} style={styles.remove}>
                      <Text style={{ color: colors.danger, fontWeight: '600' }}>Quitar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fecha y hora de recogida</Text>
            <DateTimePickerInput date={pickupAt} onChange={setPickupAt} />
            <Text style={styles.helper}>Opcional: si quieres asociarlo a una cita específica, ingresa su ID aquí.</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.total}>Total: ${total} COP</Text>
            <Button title="Confirmar pedido" onPress={onConfirm} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, padding: 10, elevation: 1 },
  image: { width: 64, height: 64, borderRadius: 8, marginRight: 10, backgroundColor: '#eee' },
  placeholder: { backgroundColor: '#eee' },
  name: { fontSize: 16, fontWeight: '700' },
  price: { color: colors.muted, marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  qtyBtn: { width: 28, height: 28, borderRadius: 6, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  qtyText: { color: '#fff', fontWeight: '800' },
  qtyVal: { marginHorizontal: 10, fontWeight: '700' },
  remove: { marginLeft: 12 },
  section: { marginTop: 8 },
  sectionTitle: { fontWeight: '700', marginBottom: 6 },
  helper: { color: '#666', marginTop: 8 },
  footer: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#ddd', paddingTop: 12, marginTop: 8 },
  total: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
});
