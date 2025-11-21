import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import DetailModal from '../ui/DetailModal';

type PurchaseItem = {
  id: number;
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
  notes?: string;
};

export default function PurchasesList() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPurchases = async (pageNum: number = 0) => {
    try {
      const response = await axiosClient.get(`/api/purchases/all?page=${pageNum}&size=20`);
      const newPurchases = response.data.content || [];
      
      if (pageNum === 0) {
        setPurchases(newPurchases);
      } else {
        setPurchases([...purchases, ...newPurchases]);
      }
      
      setHasMore(newPurchases.length === 20);
      setPage(pageNum);
    } catch (error) {
      alertApiError(error, 'No se pudieron cargar las compras');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadPurchases(page + 1);
    }
  };

  const openPurchaseDetail = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setModalVisible(true);
  };

  const closePurchaseDetail = () => {
    setSelectedPurchase(null);
    setModalVisible(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return colors.success;
      case 'PENDING': return colors.warning;
      case 'CANCELLED': return colors.danger;
      default: return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '✅ Completada';
      case 'PENDING': return '⏳ Pendiente';
      case 'CANCELLED': return '❌ Cancelada';
      default: return status;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CO');
  };

  if (loading && purchases.length === 0) {
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
          <Text style={[typography.h2, { color: colors.darkGray, marginBottom: 4 }]}>
            📦 Compras del Sistema
          </Text>
          <Text style={[typography.body, { color: colors.muted }]}>
            Total de compras registradas: {purchases.length}
          </Text>
        </View>
      </View>

      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[typography.body, { fontSize: 16, marginBottom: 8 }]}>
              📦 No hay compras registradas
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openPurchaseDetail(item)}>
            <View style={styles.purchaseCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[typography.h3, { color: colors.primary, marginBottom: 4 }]}>
                    Compra #{item.id}
                  </Text>
                  <Text style={styles.userEmail}>{item.userEmail}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>📅 Fecha</Text>
                  <Text style={styles.value}>{formatDate(item.purchaseDate)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>🛒 Artículos</Text>
                  <Text style={styles.value}>{item.items.length}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>💰 Total</Text>
                  <Text style={[styles.value, { fontWeight: '700', color: colors.primary }]}>
                    ${item.totalAmount}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color={colors.primary} /> : null
        }
      />

      {/* Detail Modal */}
      <DetailModal visible={modalVisible} onClose={closePurchaseDetail}>
        {selectedPurchase && (
          <ScrollView style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderEmoji}>📦</Text>
              <Text style={[typography.h2, styles.modalHeaderTitle]}>
                Detalle de Compra
              </Text>
              <Text style={styles.modalHeaderSubtitle}>
                Compra #{selectedPurchase.id}
              </Text>
            </View>

            {/* Purchase Info */}
            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>👤 Cliente</Text>
                <Text style={styles.detailValue}>{selectedPurchase.userEmail}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📅 Fecha</Text>
                <Text style={styles.detailValue}>
                  {formatDate(selectedPurchase.purchaseDate)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📊 Estado</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: getStatusColor(selectedPurchase.status) },
                  ]}
                >
                  {getStatusLabel(selectedPurchase.status)}
                </Text>
              </View>
            </View>

            {/* Items */}
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>🛍️ Artículos Comprados</Text>
              {selectedPurchase.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.productName}</Text>
                    <Text style={styles.itemQuantity}>
                      Cantidad: {item.quantity} x ${item.unitPrice}
                    </Text>
                  </View>
                  <Text style={styles.itemSubtotal}>${item.subtotal}</Text>
                </View>
              ))}
            </View>

            {/* Total */}
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total a Pagar</Text>
              <Text style={styles.totalAmount}>${selectedPurchase.totalAmount}</Text>
            </View>

            {/* Notes */}
            {selectedPurchase.notes && (
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>📝 Notas</Text>
                <Text style={styles.notesText}>{selectedPurchase.notes}</Text>
              </View>
            )}
          </ScrollView>
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
  headerContent: { flex: 1 },

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

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },

  userEmail: {
    fontSize: 12,
    color: colors.muted,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  cardContent: {
    gap: 8,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
  },

  value: {
    fontSize: 12,
    color: colors.darkGray,
    fontWeight: '500',
  },

  // Modal Styles
  modalContent: {
    paddingVertical: 20,
    paddingHorizontal: 4,
    flexGrow: 1,
  },

  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.lightGray,
  },

  modalHeaderEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },

  modalHeaderTitle: {
    color: colors.darkGray,
    marginBottom: 4,
  },

  modalHeaderSubtitle: {
    fontSize: 14,
    color: colors.muted,
  },

  detailCard: {
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },

  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },

  detailValue: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 2,
  },

  itemQuantity: {
    fontSize: 11,
    color: colors.muted,
  },

  itemSubtotal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },

  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },

  totalAmount: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },

  notesText: {
    fontSize: 13,
    color: colors.darkGray,
    lineHeight: 18,
    marginTop: 8,
  },
});
