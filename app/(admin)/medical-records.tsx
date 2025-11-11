import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import MedicalRecordDetail from '../../components/admin/MedicalRecordDetail';
import MedicalRecordList from '../../components/admin/MedicalRecordList';
import Card from '../../components/ui/Card';
import DateTimePickerInput from '../../components/ui/DateTimePickerInput';
import DetailModal from '../../components/ui/DetailModal';
import EmptyState from '../../components/ui/EmptyState';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

export default function MedicalRecordsAdmin() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Filtros
  const [filterUserId, setFilterUserId] = useState<number | null>(null);
  const [filterPetId, setFilterPetId] = useState<number | null>(null);
  const [filterVetId, setFilterVetId] = useState<number | null>(null);
  const [filterStartDate, setFilterStartDate] = useState<string | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [startDateObj, setStartDateObj] = useState<Date>(new Date());
  const [endDateObj, setEndDateObj] = useState<Date>(new Date());
  // Catálogos
  const [users, setUsers] = useState<any[]>([]); // dueños
  const [vets, setVets] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterPetId) params.petId = filterPetId;
      if (filterVetId) params.vetId = filterVetId;
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
  const response = await axiosClient.get<any[]>('/api/diagnoses/admin', { params });
      setRecords(response.data);
    } catch (err) {
      alertApiError(err, 'No se pudieron cargar los historiales médicos');
    } finally {
      setLoading(false);
    }
  }, [filterPetId, filterVetId, filterStartDate, filterEndDate]);

  useEffect(() => {
    loadRecords();
    loadCatalogs();
  }, [loadRecords]);

  // (moved implementation of loadRecords above with useCallback)

  const loadCatalogs = async () => {
    try {
      const [usersRes, petsRes] = await Promise.all([
        axiosClient.get<any[]>('/api/admin/users'),
        axiosClient.get<any[]>('/api/pets'),
      ]);
      const allUsers = usersRes.data || [];
      // Filtramos roles manualmente (el backend no soporta filtros por rol en la query)
      const ownerUsers = allUsers.filter((u: any) => String(u.role).toUpperCase() === 'OWNER');
      const vetUsers = allUsers.filter((u: any) => String(u.role).toUpperCase() === 'VETERINARIAN');
      setUsers(ownerUsers); // dueños
      setVets(vetUsers);    // veterinarios
      setPets(petsRes.data || []);
    } catch (err) {
      console.warn('Fallo al cargar catálogos', err);
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

  // Pets filtrados por usuario seleccionado
  const petsFiltered = useMemo(() => {
    if (!filterUserId) return pets;
    return pets.filter(p => p.owner?.id === filterUserId);
  }, [pets, filterUserId]);

  // Filtrado adicional por usuario en front (porque backend no lo soporta)
  const finalRecords = useMemo(() => {
    let list = records;
    if (filterUserId) {
      list = list.filter(r => {
        const owner = r.appointment?.owner || r.appointment?.pet?.owner;
        return owner?.id === filterUserId;
      });
    }
    if (filterPetId) {
      list = list.filter(r => r.appointment?.pet?.id === filterPetId);
    }
    if (filterVetId) {
      list = list.filter(r => {
        const vet = r.appointment?.assignedTo || r.vet;
        return vet?.id === filterVetId;
      });
    }
    return list;
  }, [records, filterUserId, filterPetId, filterVetId]);

  const handleApplyFilters = () => {
    loadRecords();
  };

  const handleClearFilters = () => {
    setFilterUserId(null);
    setFilterPetId(null);
    setFilterVetId(null);
    setFilterStartDate(null);
    setFilterEndDate(null);
    setStartDateObj(new Date());
    setEndDateObj(new Date());
    loadRecords();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📋</Text>
        <Text style={[typography.h2, styles.headerTitle]}>Historial Médico</Text>
        <Text style={styles.headerSubtitle}>Registros y diagnósticos de mascotas</Text>
      </View>
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity style={[styles.filterButton, { flex: 1 }]} onPress={() => setShowFilters(f => !f)} activeOpacity={0.8}>
          <Text style={styles.filterButtonText}>{showFilters ? 'Ocultar filtros' : 'Filtros'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, { flex: 1 }]} onPress={loadRecords} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>Recargar</Text>
        </TouchableOpacity>
      </View>

      {showFilters ? (
        <Card style={{ margin: 16, padding: 16 }}>
          <Text style={typography.h3}>Filtros</Text>
          <Text style={[typography.caption, { color: colors.darkGray, marginBottom: 8 }]}>Refina la lista de diagnósticos</Text>

          <Text style={styles.filterLabel}>Usuario (Dueño)</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={filterUserId} onValueChange={(v) => { setFilterUserId(v); setFilterPetId(null); }}>
              <Picker.Item label="Todos" value={null} />
              {users.map(u => <Picker.Item key={u.id} label={u.name} value={u.id} />)}
            </Picker>
          </View>

          <Text style={styles.filterLabel}>Mascota</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={filterPetId} onValueChange={(v) => setFilterPetId(v)}>
              <Picker.Item label="Todas" value={null} />
              {petsFiltered.map(p => <Picker.Item key={p.id} label={p.name} value={p.id} />)}
            </Picker>
          </View>

          <Text style={styles.filterLabel}>Veterinario</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={filterVetId} onValueChange={(v) => setFilterVetId(v)}>
              <Picker.Item label="Todos" value={null} />
              {vets.map(v => <Picker.Item key={v.id} label={v.name} value={v.id} />)}
            </Picker>
          </View>

          <Text style={styles.filterLabel}>Fecha inicio</Text>
          <DateTimePickerInput
            date={startDateObj}
            onChange={(d) => { setStartDateObj(d); setFilterStartDate(d.toISOString().slice(0,10)); }}
            onlyDate
          />
          <Text style={styles.filterLabel}>Fecha fin</Text>
          <DateTimePickerInput
            date={endDateObj}
            onChange={(d) => { setEndDateObj(d); setFilterEndDate(d.toISOString().slice(0,10)); }}
            onlyDate
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={[styles.addButton, { flex: 1 }]} onPress={handleApplyFilters} activeOpacity={0.8}>
              <Text style={styles.addButtonText}>Aplicar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, { flex: 1 }]} onPress={handleClearFilters} activeOpacity={0.8}>
              <Text style={styles.filterButtonText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ) : null}

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : finalRecords.length === 0 ? (
        <EmptyState title="Sin diagnósticos" message="No hay registros médicos para mostrar." />
      ) : (
        <MedicalRecordList records={finalRecords} onPress={openDetail} />
      )}

      <DetailModal visible={modalVisible} onClose={closeDetail} showClose>
        {selected ? <MedicalRecordDetail record={selected} /> : null}
      </DetailModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 12 },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pickerBox: { borderWidth: 1, borderColor: '#EEF2F3', borderRadius: 12, backgroundColor: colors.white, marginTop: 6, marginBottom: 12, overflow: 'hidden' },
  filterLabel: { ...typography.caption, marginTop: 4 },
  topButtonsContainer: { paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row', gap: 8 },
  addButton: { backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  addButtonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  filterButton: { backgroundColor: colors.secondary, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  filterButtonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
