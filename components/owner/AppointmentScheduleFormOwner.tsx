import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import axiosClient, { formatLocalDateTime } from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import Button from '../ui/Button';
import DateTimePickerInput from '../ui/DateTimePickerInput';
import Input from '../ui/Input';

type Pet = { id: number; name: string };
type Service = { id: number; name: string; price: number; requiresVet?: boolean };
type AvailableProfessional = { professional: { id: number; name: string }; available: boolean; nextAvailableSlot: string };

export default function AppointmentScheduleFormOwner({
  petId: propPetId,
  onSaved,
  onCancel,
}: {
  petId?: string;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(propPetId ? Number(propPetId) : null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [assignedToId, setAssignedToId] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<{ id: number; name: string }[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const router = useRouter();
  const { petId: qPetId } = useLocalSearchParams<{ petId?: string }>();
  const fallbackPetId = qPetId || propPetId;

  useEffect(() => { if (fallbackPetId) setSelectedPetId(Number(fallbackPetId)); }, [fallbackPetId]);
  
  useEffect(() => {
    const fetchPets = async () => { try { const response = await axiosClient.get<Pet[]>('/api/pets'); setPets(response.data); } catch (err) { alertApiError(err, 'No se pudieron cargar las mascotas'); } };
    const fetchServices = async () => { try { const response = await axiosClient.get<Service[]>('/api/services'); setServices(response.data); } catch (err) { alertApiError(err, 'No se pudieron cargar los servicios'); } };
    fetchPets(); fetchServices();
  }, []);

  // Cargar profesionales disponibles cuando cambia el servicio o la fecha/hora
  useEffect(() => {
    if (serviceId && dateTime) {
      const loadAvailableProfessionals = async () => {
        setLoadingStaff(true);
        try {
          const dateTimeIso = formatLocalDateTime(dateTime);
          const response = await axiosClient.get<AvailableProfessional[]>(
            `/api/appointments/available-professionals?serviceId=${serviceId}&dateTime=${dateTimeIso}`
          );
          const professionals = response.data.map(ap => ap.professional);
          setFilteredStaff(professionals);
          setAssignedToId(professionals.length ? professionals[0].id : null);
        } catch (err) {
          alertApiError(err, 'No se pudieron cargar los profesionales disponibles');
          setFilteredStaff([]);
          setAssignedToId(null);
        } finally {
          setLoadingStaff(false);
        }
      };
      loadAvailableProfessionals();
    } else {
      setFilteredStaff([]);
      setAssignedToId(null);
    }
  }, [serviceId, dateTime]);

  const handleSubmit = async () => {
    if (!selectedPetId || !serviceId || !assignedToId || !note) { Alert.alert('Por favor completa todos los campos.'); return; }
    setLoading(true);
    const appointment = { petId: selectedPetId, serviceId, assignedToId, startDateTime: formatLocalDateTime(dateTime), note };
    try {
      await axiosClient.post('/api/appointments', appointment);
      Alert.alert('Éxito', 'Cita agendada correctamente');
      if (onSaved) {
        onSaved();
      } else {
        router.push('/(owner)/view-appointments' as any);
      }
    } catch (err) {
      alertApiError(err, 'No se pudo agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerIcon}>📅</Text>
        <Text style={[typography.h2, { color: colors.darkGray, marginBottom: 4 }]}>Agendar Cita</Text>
        <Text style={[typography.body, { color: colors.muted, textAlign: 'center' }]}>
          Completa los datos para tu próxima visita veterinaria
        </Text>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        {/* Mascota */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>🐾 Mascota</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={selectedPetId} onValueChange={(value) => setSelectedPetId(value)}>
              <Picker.Item label="Selecciona una mascota" value={null} />
              {pets.map((pet) => <Picker.Item key={pet.id} label={pet.name} value={pet.id} />)}
            </Picker>
          </View>
        </View>

        {/* Servicio */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>🔧 Servicio</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={serviceId} onValueChange={(value) => setServiceId(value)}>
              <Picker.Item label="Selecciona un servicio" value={null} />
              {services.map((s) => <Picker.Item key={s.id} label={s.name} value={s.id} />)}
            </Picker>
          </View>
        </View>

        {/* Profesional */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>👨‍⚕️ Profesional</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={assignedToId} onValueChange={(value) => setAssignedToId(value)}>
              {filteredStaff.length === 0 && <Picker.Item label="Sin profesionales disponibles" value={null} />}
              {filteredStaff.map((staff: any) => <Picker.Item key={staff.id} label={staff.name} value={staff.id} />)}
            </Picker>
          </View>
        </View>

        {/* Fecha y Hora */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>⏰ Fecha y Hora</Text>
          <DateTimePickerInput date={dateTime} onChange={setDateTime} />
        </View>

        {/* Observaciones */}
        <View style={[styles.fieldGroup, { marginBottom: 0 }]}>
          <Text style={styles.fieldLabel}>📝 Observaciones</Text>
          <Input
            placeholder="Síntomas, preferencias, alergias conocidas, etc..."
            value={note}
            onChangeText={setNote}
            multiline
            style={styles.textAreaInput}
          />
        </View>
      </View>

      {/* Button Group */}
      <View style={styles.buttonGroup}>
        <Button
          title={loading ? 'Agendando...' : '✓ Agendar Cita'}
          onPress={handleSubmit}
          disabled={loading}
          style={styles.primaryButton}
        />
        {!onCancel ? (
          <Button
            title="📅 Ver mis citas"
            onPress={() => router.push('/(owner)/view-appointments' as any)}
            style={styles.secondaryButton}
          />
        ) : (
          <Button
            title="✕ Cancelar"
            onPress={onCancel}
            style={styles.secondaryButton}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 32,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  headerIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 8,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 10,
    backgroundColor: colors.white,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  textAreaInput: {
    marginBottom: 0,
  },
  buttonGroup: {
    gap: 10,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
});
