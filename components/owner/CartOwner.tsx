import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../context/CartContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Button from '../ui/Button';

export default function CartOwner({ onCheckout }: { onCheckout?: () => void }) {
  const { items, total, updateQty, removeItem, checkout, isLoading } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const result = await checkout({});
      if (result.ok) {
        Alert.alert('Éxito', 'Pedido registrado correctamente');
        onCheckout?.();
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyCartContainer}>
        <Text style={[typography.h3, { marginBottom: 8 }]}>🛒 Carrito Vacío</Text>
        <Text style={[typography.body, { color: colors.darkGray, textAlign: 'center' }]}>
          Agrega productos para comenzar
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cartHeader}>
        <Text style={[typography.h2, { flex: 1 }]}>Mi Carrito</Text>
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{items.length}</Text>
        </View>
      </View>

      <View style={styles.cartItems}>
        {items.map((item, idx) => (
          <View key={item.productId}>
            <View style={styles.cartItemRow}>
              <View style={styles.itemDetails}>
                <Text style={[typography.h3, { fontSize: 15, marginBottom: 4 }]}>{item.name}</Text>
                <Text style={[typography.caption, { color: colors.secondary, fontWeight: '600' }]}>
                  ${item.price.toFixed(2)} c/u
                </Text>
              </View>
              <View style={styles.itemRightSection}>
                <Text style={[typography.h3, { color: colors.primary, fontWeight: '700', marginBottom: 8 }]}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    onPress={() => updateQty(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    style={[styles.qtyBtn, item.quantity <= 1 && styles.qtyBtnDisabled]}
                  >
                    <Text style={[styles.qtyBtnText, item.quantity <= 1 && styles.qtyBtnTextDisabled]}>−</Text>
                  </TouchableOpacity>
                  <View style={styles.qtyDisplay}>
                    <Text style={[typography.body, { fontWeight: '600' }]}>{item.quantity}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => updateQty(item.productId, item.quantity + 1)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => removeItem(item.productId)}
                style={styles.removeBtn}
              >
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            {idx < items.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      <View style={styles.cartSummary}>
        <View style={styles.summaryRow}>
          <Text style={[typography.body, { color: colors.darkGray }]}>Subtotal</Text>
          <Text style={[typography.body, { fontWeight: '600' }]}>${total.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.lightGray }]}>
          <Text style={[typography.h3, { color: colors.primary, fontWeight: '700' }]}>Total</Text>
          <Text style={[typography.h2, { color: colors.primary, fontWeight: '700' }]}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <Button
        title={`Finalizar Compra - $${total.toFixed(2)}`}
        onPress={handleCheckout}
        disabled={checkoutLoading}
        style={{ backgroundColor: colors.success }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  emptyCartContainer: {
    flex: 1,
    paddingVertical: 32,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  cartBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cartItems: {
    marginBottom: 16,
    flex: 1,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 8,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemRightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 6,
    backgroundColor: colors.white,
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnDisabled: {
    opacity: 0.5,
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  qtyBtnTextDisabled: {
    color: colors.darkGray,
  },
  qtyDisplay: {
    paddingHorizontal: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.lightGray,
    minWidth: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtn: {
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  removeBtnText: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginHorizontal: 8,
  },
  cartSummary: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
