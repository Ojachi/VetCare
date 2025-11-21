import React from 'react';
import { View } from 'react-native';
import PurchasesList from '../../components/admin/PurchasesList';

export default function AdminPurchases() {
  return (
    <View style={{ flex: 1 }}>
      <PurchasesList />
    </View>
  );
}
