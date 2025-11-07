import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export type LocalOrder = {
  id: string;
  items: CartItem[];
  total: number;
  appointmentId?: string;
  pickupDate?: string; // ISO string
  createdAt: string; // ISO string
  status: 'pending' | 'placed';
};

type CartContextType = {
  items: CartItem[];
  total: number;
  orders: LocalOrder[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  updateQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  checkout: (payload: { appointmentId?: string; pickupDate?: Date }) => { ok: boolean; order?: LocalOrder };
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<LocalOrder[]>([]);

  const total = useMemo(() => items.reduce((sum, it) => sum + it.price * it.quantity, 0), [items]);

  const addItem: CartContextType['addItem'] = useCallback((item, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.productId === item.productId);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = { ...clone[idx], quantity: clone[idx].quantity + qty };
        return clone;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }, []);

  const updateQty: CartContextType['updateQty'] = useCallback((productId, qty) => {
    if (qty <= 0) return setItems((prev) => prev.filter((p) => p.productId !== productId));
    setItems((prev) => prev.map((p) => (p.productId === productId ? { ...p, quantity: qty } : p)));
  }, []);

  const removeItem: CartContextType['removeItem'] = useCallback((productId) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const checkout: CartContextType['checkout'] = useCallback(({ appointmentId, pickupDate }) => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de confirmar el pedido.');
      return { ok: false };
    }
    const order: LocalOrder = {
      id: `${Date.now()}`,
      items,
      total,
      appointmentId,
      pickupDate: pickupDate ? pickupDate.toISOString() : undefined,
      createdAt: new Date().toISOString(),
      status: 'placed',
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return { ok: true, order };
  }, [items, total, clearCart]);

  const value = useMemo(
    () => ({ items, total, orders, addItem, updateQty, removeItem, clearCart, checkout }),
    [items, total, orders, addItem, updateQty, removeItem, clearCart, checkout]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
