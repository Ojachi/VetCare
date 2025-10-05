import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import MedicalRecordDetail from '../../components/admin/MedicalRecordDetail';
import MedicalRecordList from '../../components/admin/MedicalRecordList';
import DetailModal from '../../components/ui/DetailModal';

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
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los historiales médicos');
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
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <>
      <MedicalRecordList records={records} onPress={openDetail} />
      <DetailModal visible={modalVisible} onClose={closeDetail}>
        {selected ? <MedicalRecordDetail record={selected} /> : null}
      </DetailModal>
    </>
  );
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
