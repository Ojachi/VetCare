import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import ServiceDetail from '../../components/admin/ServiceDetail';
import ServiceForm from '../../components/admin/ServiceForm';
import DetailModal from '../../components/ui/DetailModal';

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
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los servicios');
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
        } catch {
          Alert.alert('Error', 'No se pudo eliminar el servicio');
        }
      }}
    ]);
  };

  if (loading) return (<View style={styles.center}><ActivityIndicator size="large" color="#333" /></View>);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gestión de Servicios</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => openForm(null)}>
        <Text style={styles.addButtonText}>+ Nuevo Servicio</Text>
      </TouchableOpacity>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openDetail(item)} style={styles.serviceCard}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.items}>Precio: ${item.price} COP</Text>
            <Text style={styles.items}>Duración: {item.durationMinutes} min</Text>
            <Text style={styles.items}>Requiere Vet: {item.requiresVeterinarian ? 'Sí' : 'No'}</Text>
            <View style={styles.actionsRow}>
              <Button title="Editar" onPress={() => openForm(item)} />
              <Button title="Eliminar" color="red" onPress={() => onDelete(item.id)} />
            </View>
          </TouchableOpacity>
        )}
      />

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
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  list: { paddingBottom: 24 },
  serviceCard: { marginBottom: 15, padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#f9f9f9' },
  items: { marginBottom: 5 },
  name: { fontWeight: 'bold', fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#999', padding: 6, marginVertical: 8, borderRadius: 5 },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  addButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 8 }
});
