import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import ServiceDetail from '../../components/admin/ServiceDetail';
import ServiceForm from '../../components/admin/ServiceForm';
import DetailModal from '../../components/ui/DetailModal';
import EmptyState from '../../components/ui/EmptyState';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

export default function ServicesAdmin() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'form'|'detail'>('detail');
  const [selectedService, setSelectedService] = useState<any | null>(null);

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get<any[]>('/api/services');
      setServices(res.data);
    } catch (err) {
      alertApiError(err, 'No se pudieron cargar los servicios');
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (service: any) => {
    setSelectedService(service);
    setModalMode('detail');
    setModalVisible(true);
  };

  const openForm = (service?: any | null) => {
    setSelectedService(service ?? null);
    setModalMode('form');
    setModalVisible(true);
  };

  const onSaved = (s: any) => {
    setModalVisible(false);
    loadServices();
  };

  const onDelete = (id: number) => {
    Alert.alert('Eliminar servicio', '¿Estás seguro?', [
      { text: 'No' },
      { text: 'Sí', onPress: async () => {
        try {
          await axiosClient.delete(`/api/admin/services/${id}`);
          loadServices();
          Alert.alert('Éxito', 'Servicio eliminado');
        } catch (err) {
          alertApiError(err, 'No se pudo eliminar el servicio');
        }
      }}
    ]);
  };

  if (loading) return (<View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🏥</Text>
        <Text style={[typography.h2, styles.headerTitle]}>Gestión de Servicios</Text>
        <Text style={styles.headerSubtitle}>Crea y administra servicios veterinarios</Text>
      </View>
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => openForm(null)}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ Nuevo Servicio</Text>
        </TouchableOpacity>
      </View>

      {services.length === 0 ? (
        <EmptyState title="Sin servicios" message="Aún no hay servicios registrados." />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85} onPress={() => openDetail(item)}>
              <View style={[styles.serviceCard, { borderLeftWidth: 4, borderLeftColor: colors.secondary }]}>
                <View style={styles.serviceHeader}>
                  <Text style={[typography.h3, { marginBottom: 4 }]}>🏥 {item.name}</Text>
                  <View style={[styles.badge, { backgroundColor: item.active ? colors.primary : colors.danger }]}>
                    <Text style={styles.badgeText}>{item.active ? 'Activo' : 'Inactivo'}</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoCol}>
                  <Text style={[typography.caption, { color: colors.muted }]}>💰 Precio</Text>
                  <Text style={[typography.body, { marginTop: 4 }]}>${item.price} COP</Text>
                  <Text style={[typography.caption, { color: colors.muted, marginTop: 8 }]}>⏱️ Duración</Text>
                  <Text style={[typography.body, { marginTop: 4 }]}>{item.durationMinutes} min</Text>
                  <Text style={[typography.caption, { color: colors.muted, marginTop: 8 }]}>🏥 Requiere Vet</Text>
                  <Text style={[typography.body, { marginTop: 4 }]}>{item.requiresVeterinarian ? 'Sí' : 'No'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.buttonCol}>
                  <TouchableOpacity 
                    onPress={() => openForm(item)} 
                    style={[styles.smallBtn, { backgroundColor: colors.secondary }]}
                  >
                    <Text style={styles.smallBtnText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => onDelete(item.id)} 
                    style={[styles.smallBtn, { backgroundColor: colors.danger, marginTop: 8 }]}
                  >
                    <Text style={styles.smallBtnText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <DetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        wide
        showClose={modalMode !== 'form'}
      >
        {modalMode === 'form' ? (
          <ServiceForm service={selectedService} onSaved={onSaved} onCancel={() => setModalVisible(false)} />
        ) : (
          <ServiceDetail service={selectedService} />
        )}
      </DetailModal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 24, gap: 12 },
  topButtonsContainer: { paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row', gap: 8 },
  addButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  serviceCard: { backgroundColor: colors.white, borderRadius: 12, padding: 12 },
  serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, alignSelf: 'flex-start' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#EEF2F3', marginVertical: 12 },
  infoCol: { marginBottom: 8 },
  buttonCol: { width: '100%' },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center' },
  smallBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    color: colors.darkGray,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.muted,
  },
});
