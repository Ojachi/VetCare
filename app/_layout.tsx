import { Slot } from 'expo-router';
import React from 'react';
import { CartProvider } from '../context/CartContext';
import { SessionProvider } from '../context/SessionContext';

export default function RootLayout() {
  return (
    <SessionProvider>
      <CartProvider>
        <Slot/>
      </CartProvider>
    </SessionProvider>
  );
}
