import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import axiosClient from '../api/axiosClient';

export type CartItem = {
  id?: number; // ID del item en el carrito del backend
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
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => Promise<void>;
  updateQty: (productId: string, qty: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (payload: { appointmentId?: string; pickupDate?: Date }) => Promise<{ ok: boolean; order?: LocalOrder }>;
  loadCart: () => Promise<void>;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const total = useMemo(() => items.reduce((sum, it) => sum + it.price * it.quantity, 0), [items]);

  // Cargar carrito del backend al inicializar
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosClient.get<any>('/api/cart');
      if (response.data && response.data.items) {
        const formattedItems: CartItem[] = response.data.items.map((item: any) => ({
          id: item.id,
          productId: String(item.productId),
          name: item.productName,
          price: parseFloat(item.unitPrice),
          image: item.productImage,
          quantity: item.quantity,
        }));
        setItems(formattedItems);
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
      // No mostrar alerta si es un error normal (carrito vacío)
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addItem: CartContextType['addItem'] = useCallback(async (item, qty = 1) => {
    try {
      const response = await axiosClient.post<any>('/api/cart/add', {
        productId: item.productId,
        quantity: qty,
      });
      if (response.data && response.data.items) {
        const formattedItems: CartItem[] = response.data.items.map((cartItem: any) => ({
          id: cartItem.id,
          productId: String(cartItem.productId),
          name: cartItem.productName,
          price: parseFloat(cartItem.unitPrice),
          image: cartItem.productImage,
          quantity: cartItem.quantity,
        }));
        setItems(formattedItems);
      }
      Alert.alert('Éxito', `${qty} ${qty === 1 ? 'producto agregado' : 'productos agregados'} al carrito`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el producto al carrito');
      console.error('Error agregando item:', error);
    }
  }, []);

  const updateQty: CartContextType['updateQty'] = useCallback(async (productId, qty) => {
    try {
      const item = items.find(i => i.productId === productId);
      if (!item || !item.id) {
        Alert.alert('Error', 'No se puede actualizar el producto');
        return;
      }

      if (qty <= 0) {
        // Eliminar item
        await axiosClient.delete(`/api/cart/item/${item.id}`);
        setItems(prev => prev.filter(p => p.productId !== productId));
      } else {
        // Actualizar cantidad
        const response = await axiosClient.put<any>(`/api/cart/item/${item.id}`, {
          quantity: qty,
        });
        if (response.data && response.data.items) {
          const formattedItems: CartItem[] = response.data.items.map((cartItem: any) => ({
            id: cartItem.id,
            productId: String(cartItem.productId),
            name: cartItem.productName,
            price: parseFloat(cartItem.unitPrice),
            image: cartItem.productImage,
            quantity: cartItem.quantity,
          }));
          setItems(formattedItems);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la cantidad');
      console.error('Error actualizando cantidad:', error);
    }
  }, [items]);

  const removeItem: CartContextType['removeItem'] = useCallback(async (productId) => {
    try {
      const item = items.find(i => i.productId === productId);
      if (!item || !item.id) {
        Alert.alert('Error', 'No se puede eliminar el producto');
        return;
      }
      await axiosClient.delete(`/api/cart/item/${item.id}`);
      setItems(prev => prev.filter(p => p.productId !== productId));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el producto');
      console.error('Error eliminando item:', error);
    }
  }, [items]);

  const clearCart = useCallback(async () => {
    try {
      await axiosClient.delete('/api/cart/clear');
      setItems([]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo vaciar el carrito');
      console.error('Error vaciando carrito:', error);
    }
  }, []);

  const checkout: CartContextType['checkout'] = useCallback(async ({ appointmentId, pickupDate }) => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de confirmar el pedido.');
      return { ok: false };
    }
    
    try {
      // Realizar compra del carrito
      const response = await axiosClient.post<any>('/api/purchases/from-cart', {});
      
      if (response.data) {
        const order: LocalOrder = {
          id: String(response.data.id),
          items: response.data.items.map((item: any) => ({
            productId: String(item.productId),
            name: item.productName,
            price: parseFloat(item.unitPrice),
            quantity: item.quantity,
          })),
          total: parseFloat(response.data.totalAmount),
          appointmentId,
          pickupDate: pickupDate ? pickupDate.toISOString() : undefined,
          createdAt: response.data.purchaseDate,
          status: 'placed',
        };
        setOrders((prev) => [order, ...prev]);
        setItems([]); // Limpiar carrito local después de compra exitosa
        return { ok: true, order };
      }
      return { ok: false };
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar la compra');
      console.error('Error en checkout:', error);
      return { ok: false };
    }
  }, [items]);

  const value = useMemo(
    () => ({ items, total, orders, addItem, updateQty, removeItem, clearCart, checkout, loadCart, isLoading }),
    [items, total, orders, addItem, updateQty, removeItem, clearCart, checkout, loadCart, isLoading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
