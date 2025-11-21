import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import DetailModal from '../../components/ui/DetailModal';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

type PurchaseItem = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
};

type Purchase = {
  id: number;
  userId: number;
  userEmail: string;
  items: PurchaseItem[];
  totalAmount: string;
  purchaseDate: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  notes: string;
};

type DisplayPurchase = {
  id: number;
  date: string;
  time: string;
  totalAmount: number;
  itemsCount: number;
  status: string;
  statusColor: string;
  items: PurchaseItem[];
};

const formatPurchase = (purchase: Purchase): DisplayPurchase => {
  const dateTime = new Date(purchase.purchaseDate);
  const date = dateTime.toLocaleDateString('es-CO');
  const time = dateTime.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  const statusMap: { [key: string]: string } = {
    PENDING: 'Pendiente',
    COMPLETED: 'Completada',
    CANCELLED: 'Cancelada',
  };

  const statusColorMap: { [key: string]: string } = {
    PENDING: colors.warning,
    COMPLETED: colors.success,
    CANCELLED: colors.danger,
  };

  return {
    id: purchase.id,
    date,
    time,
    totalAmount: parseFloat(purchase.totalAmount),
    itemsCount: purchase.items.length,
    status: statusMap[purchase.status] || purchase.status,
    statusColor: statusColorMap[purchase.status] || colors.muted,
    items: purchase.items,
  };
};

export default function ComprasOwner() {
  const [purchases, setPurchases] = useState<DisplayPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState<DisplayPurchase | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      const response = await axiosClient.get<any>('/api/purchases?page=0&size=50');
      const formatted = (response.data?.content || []).map((purchase: Purchase) => formatPurchase(purchase));
      setPurchases(formatted);
    } catch (error) {
      alertApiError(error, 'No se pudieron cargar las compras');
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (purchase: DisplayPurchase) => {
    setSelectedPurchase(purchase);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setSelectedPurchase(null);
    setDetailModalVisible(false);
  };

  const handleCompletePurchase = async (purchaseId: number) => {
    try {
      await axiosClient.put(`/api/purchases/${purchaseId}/complete`);
      Alert.alert('Éxito', 'Compra marcada como completada');
      loadPurchases();
      closeDetailModal();
    } catch (error) {
      alertApiError(error, 'No se pudo actualizar la compra');
    }
  };

  const handleCancelPurchase = async (purchaseId: number) => {
    Alert.alert('Confirmar cancelación', '¿Deseas cancelar esta compra?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí',
        onPress: async () => {
          try {
            await axiosClient.put(`/api/purchases/${purchaseId}/cancel`);
            Alert.alert('Éxito', 'Compra cancelada');
            loadPurchases();
            closeDetailModal();
          } catch (error) {
            alertApiError(error, 'No se pudo cancelar la compra');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={[typography.h2, { color: colors.darkGray, marginBottom: 4 }]}>🛒 Mis Compras</Text>
          <Text style={[typography.body, { color: colors.muted }]}>Historial de compras realizadas</Text>
        </View>
      </View>
      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[typography.body, { fontSize: 16, marginBottom: 8 }]}>📋 No hay compras registradas</Text>
            <Text style={[typography.body, { color: colors.muted, textAlign: 'center' }]}>
              Las compras que realices aparecerán aquí
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.purchaseCard}>
            <View style={styles.purchaseHeader}>
              <View style={styles.purchaseInfo}>
                <Text style={[typography.body, { color: colors.muted, fontSize: 12, marginBottom: 4 }]}>
                  Compra #{item.id}
                </Text>
                <Text style={[typography.h3, { color: colors.darkGray }]}>
                  {item.itemsCount} {item.itemsCount === 1 ? 'producto' : 'productos'}
                </Text>
              </View>
              <View style={styles.purchaseRight}>
                <Text style={[typography.h3, { color: colors.primary, fontWeight: '700', marginBottom: 6 }]}>
                  ${item.totalAmount.toFixed(2)}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: item.statusColor }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.purchaseFooter}>
              <View>
                <Text style={[typography.caption, { color: colors.muted, marginBottom: 3 }]}>
                  📅 {item.date}
                </Text>
                <Text style={[typography.caption, { color: colors.muted }]}>
                  ⏰ {item.time}
                </Text>
              </View>
              <Button
                title="Ver Detalles"
                onPress={() => openDetailModal(item)}
                style={styles.detailButton}
                textStyle={styles.detailButtonText}
              />
            </View>
          </View>
        )}
      />

      {/* Detail Modal */}
      <DetailModal
        visible={detailModalVisible}
        onClose={closeDetailModal}
        extraFooterButton={
          selectedPurchase && selectedPurchase.status === 'Pendiente'
            ? {
                title: '✓ Marcar como Completada',
                onPress: () => handleCompletePurchase(selectedPurchase.id),
                style: { backgroundColor: colors.success },
              }
            : undefined
        }
      >
        {selectedPurchase && (
          <>
            {/* Header */}
            <View style={styles.detailHeader}>
              <Text style={[typography.h2, { color: colors.primary, marginBottom: 4 }]}>
                Compra #{selectedPurchase.id}
              </Text>
              <Text style={[typography.body, { color: colors.muted }]}>
                {selectedPurchase.date} • {selectedPurchase.time}
              </Text>
            </View>

            {/* Status Badge */}
            <View
              style={[
                styles.detailStatusBadge,
                { backgroundColor: selectedPurchase.statusColor + '20', borderColor: selectedPurchase.statusColor },
              ]}
            >
              <Text style={[typography.body, { color: selectedPurchase.statusColor, fontWeight: '600' }]}>
                Estado: {selectedPurchase.status}
              </Text>
            </View>

            {/* Items List */}
            <View style={styles.itemsSection}>
              <Text style={[typography.h3, { marginBottom: 12, color: colors.darkGray }]}>Productos</Text>
              {selectedPurchase.items.map((item, idx) => (
                <View key={item.id}>
                  <View style={styles.itemRow}>
                    <View style={styles.itemLeftSection}>
                      <Text style={[typography.body, { color: colors.darkGray, fontWeight: '600', marginBottom: 4 }]}>
                        {item.productName}
                      </Text>
                      <Text style={[typography.caption, { color: colors.muted }]}>
                        {item.quantity} x ${item.unitPrice}
                      </Text>
                    </View>
                    <Text style={[typography.h3, { color: colors.primary, fontWeight: '700' }]}>
                      ${item.subtotal}
                    </Text>
                  </View>
                  {idx < selectedPurchase.items.length - 1 && <View style={styles.itemDivider} />}
                </View>
              ))}
            </View>

            {/* Summary */}
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={[typography.body, { color: colors.darkGray }]}>Subtotal</Text>
                <Text style={[typography.body, { fontWeight: '600' }]}>
                  ${selectedPurchase.totalAmount.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.summaryRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.lightGray }]}>
                <Text style={[typography.h3, { color: colors.primary, fontWeight: '700' }]}>Total</Text>
                <Text style={[typography.h2, { color: colors.primary, fontWeight: '700' }]}>
                  ${selectedPurchase.totalAmount.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Action Button */}
            {selectedPurchase.status === 'Pendiente' && (
              <Button
                title="🗑️ Cancelar Compra"
                onPress={() => handleCancelPurchase(selectedPurchase.id)}
                style={styles.cancelButton}
              />
            )}
          </>
        )}
      </DetailModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerContent: {
    flex: 1,
  },

  list: { padding: 16, paddingTop: 12 },

  emptyContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  purchaseCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  purchaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  purchaseInfo: {
    flex: 1,
  },
  purchaseRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  purchaseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 0,
    backgroundColor: colors.secondary,
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Detail Modal Styles
  detailHeader: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.lightGray,
  },
  detailStatusBadge: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  itemsSection: {
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemLeftSection: {
    flex: 1,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.white,
  },
  summarySection: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.danger,
  },
});
