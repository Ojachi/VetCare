import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import ServiceDetail from '../../components/admin/ServiceDetail';
import ServiceForm from '../../components/admin/ServiceForm';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
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
      <Text style={[typography.h2, { paddingHorizontal: 16, marginBottom: 8 }]}>Gestión de Servicios</Text>
      <View style={{ paddingHorizontal: 16 }}>
        <Button title="+ Nuevo Servicio" onPress={() => openForm(null)} />
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
              <Card>
                <Text style={typography.h3}>{item.name}</Text>
                <Text style={typography.subtitle}>Precio: ${item.price} COP</Text>
                <Text style={[typography.body, { marginTop: 4 }]}>Duración: {item.durationMinutes} min</Text>
                <Text style={typography.caption}>
                  Requiere Vet: {item.requiresVeterinarian ? 'Sí' : 'No'}
                </Text>
                <View style={styles.actionsRow}>
                  <Button
                    title="Editar"
                    onPress={() => openForm(item)}
                    style={{ backgroundColor: colors.secondary, flex: 1, marginRight: 8 }}
                  />
                  <Button
                    title="Eliminar"
                    onPress={() => onDelete(item.id)}
                    style={{ backgroundColor: colors.danger, flex: 1, marginLeft: 8 }}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}

      <DetailModal visible={modalVisible} onClose={() => setModalVisible(false)}>
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
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 }
});
