import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../context/CartContext';
import colors from '../../styles/colors';

type Props = {
  title?: string;
  showCart?: boolean;
};

export default function AdminHeader({ title = 'Panel Administrativo', showCart }: Props) {
  const router = useRouter();
  const { items } = useCart();
  const count = items.reduce((s, it) => s + it.quantity, 0);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {showCart ? (
        <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/(owner)/cart' as any)}>
          <MaterialIcons name="shopping-cart" size={24} color="#fff" />
          {count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginTop: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cartBtn: {
    position: 'relative',
    padding: 6,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 18,
    paddingHorizontal: 4,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
