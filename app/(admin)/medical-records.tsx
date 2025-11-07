import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import MedicalRecordDetail from '../../components/admin/MedicalRecordDetail';
import MedicalRecordList from '../../components/admin/MedicalRecordList';
import DetailModal from '../../components/ui/DetailModal';
import EmptyState from '../../components/ui/EmptyState';
import colors from '../../styles/colors';
import { alertApiError } from '../../utils/apiError';

export default function MedicalRecordsAdmin() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      // Endpoint para administradores (ajusta si tu backend usa otro path)
      const response = await axiosClient.get<any[]>('/api/diagnoses');
      setRecords(response.data);
    } catch (err) {
      alertApiError(err, 'No se pudieron cargar los historiales médicos');
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (record: any) => {
    setSelected(record);
    setModalVisible(true);
  };

  const closeDetail = () => {
    setSelected(null);
    setModalVisible(false);
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
      {records.length === 0 ? (
        <EmptyState title="Sin historiales" message="No hay registros médicos para mostrar." />
      ) : (
        <MedicalRecordList records={records} onPress={openDetail} />
      )}
      <DetailModal visible={modalVisible} onClose={closeDetail}>
        {selected ? <MedicalRecordDetail record={selected} /> : null}
      </DetailModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
