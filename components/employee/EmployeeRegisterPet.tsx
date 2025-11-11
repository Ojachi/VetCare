import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

export default function EmployeeRegisterPet() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState('');
  const [ownerId, setOwnerId] = useState<string>('');
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await axiosClient.get('/api/users');
        setOwners((res.data || []).filter((u: any) => u.role === 'OWNER'));
      } catch (err) {
        console.error(err);
      }
    };
    fetchOwners();
  }, []);

  const onRegisterPet = async () => {
    if (!name || !species || !age || !breed || !weight || !sex || !ownerId) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }

    setLoading(true);
    try {
      const petData = { name, species, breed, age, weight, sex, ownerId } as any;
      await axiosClient.post('/api/pets', petData);
      Alert.alert('Éxito', `Mascota ${name} registrada correctamente`);
      setName(''); setSpecies(''); setAge(''); setBreed(''); setWeight(''); setSex(''); setOwnerId('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la mascota');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerEmoji}>➕</Text>
          <Text style={[typography.h2, styles.headerTitle]}>Registrar Mascota</Text>
          <Text style={styles.headerSubtitle}>Agrega una nueva mascota al sistema</Text>
        </View>

        {/* Form Card */}
        <Card style={styles.formCard}>
          {/* Name Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>🐾 Nombre de la Mascota</Text>
            <Input 
              placeholder="Ej: Luna, Max, Bella" 
              value={name} 
              onChangeText={setName}
              style={styles.input}
            />
          </View>

          {/* Species & Breed Row */}
          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>🦴 Especie</Text>
              <Input 
                placeholder="Perro / Gato" 
                value={species} 
                onChangeText={setSpecies}
                style={styles.input}
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>🏷️ Raza</Text>
              <Input 
                placeholder="Labrador, Siamés" 
                value={breed} 
                onChangeText={setBreed}
                style={styles.input}
              />
            </View>
          </View>

          {/* Sex & Age Row */}
          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>♂️ Género</Text>
              <Input 
                placeholder="Macho / Hembra" 
                value={sex} 
                onChangeText={setSex}
                style={styles.input}
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>📅 Edad</Text>
              <Input 
                placeholder="Años o meses" 
                value={age} 
                onChangeText={setAge}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>

          {/* Weight Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>⚖️ Peso (kg)</Text>
            <Input 
              placeholder="Ej: 25.5" 
              value={weight} 
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </View>

          {/* Owner Picker */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>👤 Propietario</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={ownerId} onValueChange={(v) => setOwnerId(String(v))}>
                <Picker.Item label="Selecciona propietario" value={''} />
                {owners.map((o) => <Picker.Item key={o.id} label={o.name} value={String(o.id)} />)}
              </Picker>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonGroup}>
            <Button 
              title={loading ? 'Registrando...' : '✓ Registrar Mascota'} 
              onPress={onRegisterPet} 
              disabled={loading}
              style={styles.submitButton}
            />
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
    paddingVertical: 20,
  },

  // Fields
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
  },

  // Row Fields
  rowFields: {
    flexDirection: 'row',
    marginBottom: 12,
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
  submitButton: {
    backgroundColor: colors.primary,
  },
});
