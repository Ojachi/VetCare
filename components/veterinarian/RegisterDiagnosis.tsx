import { alertApiError } from '@/utils/apiError';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import { SessionContext } from '../../context/SessionContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

export default function RegisterDiagnosis() {
  const [pets, setPets] = useState<any[]>([]);
  const [petId, setPetId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [treatment, setTreatment] = useState('');
  const [medications, setMedications] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  useContext(SessionContext); // maintain session context
  const router = useRouter();
  const { petId: qPetId, appointmentId: qAppointmentId } = useLocalSearchParams<{ petId?: string; appointmentId?: string }>();

  useEffect(() => {
    fetchPets();
    if (qPetId) setPetId(String(qPetId));
    if (qAppointmentId) setAppointmentId(String(qAppointmentId));
  }, [qPetId, qAppointmentId]);

  const fetchPets = async () => {
    try {
      const res = await axiosClient.get('/api/pets');
      setPets(res.data || []);
    } catch (err) {
      console.error(err);
      alertApiError(err, 'No se pudieron cargar las mascotas');
    }
  };

  const submit = async () => {
    if (!petId) {
      Alert.alert('Error', 'Selecciona una mascota');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Ingresa la descripción del diagnóstico');
      return;
    }
    setLoading(true);
    try {
      const today = new Date();
      const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
      const payload: any = {
        appointmentId: appointmentId ? Number(appointmentId) : undefined,
        description,
        date,
        active: isActive,
      };
      if (treatment.trim()) payload.treatment = treatment.trim();
      if (medications.trim()) payload.medications = medications.trim();
      await axiosClient.post('/api/diagnoses', payload);
      Alert.alert('Éxito', 'Diagnóstico registrado correctamente');
      setDescription('');
      setTreatment('');
      setMedications('');
      setPetId('');
      if (appointmentId) {
        try {
          await axiosClient.put(`/api/appointments/${appointmentId}/status`, { status: 'COMPLETED' });
        } catch (err) {
          console.error('Failed to mark appointment complete', err);
        }
      }
      router.back();
    } catch (err) {
      console.error(err);
      alertApiError(err, 'No se pudo registrar el diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerEmoji}>📋</Text>
          <Text style={[typography.h2, styles.headerTitle]}>Registrar Diagnóstico</Text>
          <Text style={styles.headerSubtitle}>Documenta el diagnóstico del paciente</Text>
        </View>

        {/* Form Card */}
        <Card style={styles.formCard}>
          {/* Pet Picker */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>🐾 Mascota</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={petId} onValueChange={(v: string) => setPetId(v)}>
                <Picker.Item label="-- Selecciona mascota --" value={''} />
                {pets.map((p) => (
                  <Picker.Item 
                    key={p.id} 
                    label={`${p.name} (${p.owner?.name || 'Propietario'})`} 
                    value={String(p.id)} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Description */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>📝 Descripción del Diagnóstico</Text>
            <Input 
              value={description} 
              onChangeText={setDescription} 
              multiline 
              numberOfLines={4} 
              placeholder="Detalles del diagnóstico y hallazgos clínicos"
              style={styles.input}
            />
          </View>

          {/* Treatment */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>💊 Tratamiento Recomendado (Opcional)</Text>
            <Input 
              value={treatment} 
              onChangeText={setTreatment} 
              multiline 
              numberOfLines={3} 
              placeholder="Indicaciones de tratamiento y cuidados"
              style={styles.input}
            />
          </View>

          {/* Medications */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>🧬 Medicamentos (Opcional)</Text>
            <Input 
              value={medications} 
              onChangeText={setMedications} 
              multiline 
              numberOfLines={2} 
              placeholder="Lista de medicamentos prescritos"
              style={styles.input}
            />
          </View>

          {/* Active Status Toggle */}
          <View style={styles.fieldGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.fieldLabel}>✓ Diagnóstico Activo</Text>
              <Switch 
                value={isActive} 
                onValueChange={setIsActive}
                trackColor={{ false: colors.lightGray, true: colors.primary }}
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonGroup}>
            <View style={styles.buttonRow}>
              <Button 
                title={loading ? 'Guardando...' : '✓ Registrar'} 
                onPress={submit} 
                disabled={loading}
                style={styles.submitButton}
              />
              <Button 
                title="✕ Cancelar" 
                onPress={() => router.back()}
                disabled={loading}
                style={styles.cancelButton}
              />
            </View>
          </View>
        </Card>

        <View style={{ height: 20 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.lightGray,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  headerTitle: {
    color: colors.darkGray,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },

  // Form Card
  formCard: {
    paddingVertical: 18,
    paddingHorizontal: 18,
  },

  // Fields
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    marginBottom: 50,
    minHeight: 100,
  },

  // Picker
  pickerWrap: { 
    borderWidth: 1, 
    borderColor: colors.lightGray, 
    borderRadius: 10, 
    overflow: 'hidden',
    backgroundColor: colors.white,
  },

  // Buttons
  buttonGroup: {
    marginTop: 24,
    gap: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  submitButton: {
    backgroundColor: colors.primary,
    flex: 1,
    marginVertical: 0,
    paddingVertical: 10,
  },
  cancelButton: {
    backgroundColor: colors.secondary,
    flex: 1,
    marginVertical: 0,
    paddingVertical: 10,
  },
});
