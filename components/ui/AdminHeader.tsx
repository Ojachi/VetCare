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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.icon}>⚙️</Text>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>Gestión y control total</Text>
          </View>
        </View>
        {showCart ? (
          <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/(owner)/cart' as any)} activeOpacity={0.8}>
            <View style={styles.cartIconContainer}>
              <MaterialIcons name="shopping-cart" size={22} color="#fff" />
              {count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{count}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: 40,
  },
  header: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  cartIconContainer: {
    position: 'relative',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  cartBtn: {
    paddingLeft: 4,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
    borderRadius: 12,
    minWidth: 20,
    paddingHorizontal: 5,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: { 
    color: '#fff', 
    fontSize: 11, 
    fontWeight: '800',
  },
});
