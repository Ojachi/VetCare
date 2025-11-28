import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import { useImagePicker } from '../../hooks/useImagePicker';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { BreedSelector } from '../common/BreedSelector';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

type ImageAsset = {
  uri: string;
  type: string;
  name: string;
};

type Species = {
  id: number;
  name: string;
  active: boolean;
};

export default function EmployeeRegisterPet() {
  const [name, setName] = useState('');
  const [speciesId, setSpeciesId] = useState<number | null>(null);
  const [customSpecies, setCustomSpecies] = useState('');
  const [breedId, setBreedId] = useState<number | null>(null);
  const [customBreed, setCustomBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState('');
  const [ownerId, setOwnerId] = useState<string>('');
  const [owners, setOwners] = useState<any[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState<ImageAsset | null>(null);
  const [previewUri, setPreviewUri] = useState<string | undefined>(undefined);
  const { pickImage } = useImagePicker();

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await axiosClient.get('/api/users');
        setOwners((res.data || []).filter((u: any) => u.role === 'OWNER'));
      } catch (err) {
        console.error(err);
      }
    };
    const fetchSpecies = async () => {
      try {
        const res = await axiosClient.get('/api/species');
        setSpecies(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error('Error loading species:', err);
      }
    };
    fetchOwners();
    fetchSpecies();
  }, []);

  const handlePickImage = async () => {
    const res = await pickImage({ base64: false, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (res.canceled) {
      if (res.error) console.warn('Picker error:', res.error);
      return;
    }
    const asset = res.assets?.[0];
    if (!asset?.uri) return;
    
    const fileName = asset.uri.split('/').pop() || 'image.jpg';
    const mimeType = asset.mimeType || 'image/jpeg';
    
    setImageAsset({
      uri: asset.uri,
      type: mimeType,
      name: fileName,
    });
    setPreviewUri(asset.uri);
  };

  const onRegisterPet = async () => {
    if (!name || !age || !sex || !ownerId) {
      Alert.alert('Error', 'Por favor llena los campos requeridos');
      return;
    }

    // Validar que tenga especie O customSpecies
    if (!speciesId && !customSpecies) {
      Alert.alert('Error', 'Por favor selecciona una especie o ingresa una personalizada');
      return;
    }

    // Validar que tenga raza O customBreed
    if (!breedId && !customBreed) {
      Alert.alert('Error', 'Por favor selecciona una raza o ingresa una personalizada');
      return;
    }

    setLoading(true);
    try {
      const petData: any = {
        name,
        age: Number(age),
        weight: weight ? Number(weight) : undefined,
        sex,
        ownerId: Number(ownerId),
        ...(speciesId && { speciesId }),
        ...(customSpecies && { customSpecies }),
        ...(breedId && { breedId }),
        ...(customBreed && { customBreed }),
      };

      await axiosClient.post('/api/pets', petData);
      Alert.alert('Éxito', `Mascota ${name} registrada correctamente`);
      setName('');
      setSpeciesId(null);
      setCustomSpecies('');
      setBreedId(null);
      setCustomBreed('');
      setAge('');
      setWeight('');
      setSex('');
      setOwnerId('');
      setImageAsset(null);
      setPreviewUri(undefined);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'No se pudo registrar la mascota');
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

          {/* Species Selection */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>🦴 Especie</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={speciesId} onValueChange={(v) => { setSpeciesId(v); setBreedId(null); }}>
                <Picker.Item label="Selecciona especie" value={null} />
                {species.map((s) => <Picker.Item key={s.id} label={s.name} value={s.id} />)}
              </Picker>
            </View>
            <Text style={styles.orText}>ó</Text>
            <Input 
              placeholder="Ingresa especie personalizada" 
              value={customSpecies} 
              onChangeText={setCustomSpecies}
              style={styles.input}
            />
          </View>

          {/* Breed Selection */}
          {speciesId && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>🏷️ Raza</Text>
              <BreedSelector
                speciesId={speciesId}
                selectedBreedId={breedId}
                onBreedSelect={(id, name) => {
                  setBreedId(id);
                  setCustomBreed(''); // Limpiar raza personalizada al seleccionar una del catálogo
                }}
                placeholder="Selecciona raza del catálogo..."
              />
              {!breedId && (
                <>
                  <Text style={styles.orText}>ó ingresa una personalizada:</Text>
                  <Input 
                    placeholder="Ej: Labrador, Siamés" 
                    value={customBreed} 
                    onChangeText={setCustomBreed}
                    style={styles.input}
                  />
                </>
              )}
            </View>
          )}
          
          {!speciesId && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>🏷️ Raza Personalizada</Text>
              <Input 
                placeholder="Labrador, Siamés, etc" 
                value={customBreed} 
                onChangeText={setCustomBreed}
                style={styles.input}
                editable={!speciesId}
              />
            </View>
          )}

          {/* Sex & Age Row */}
          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>♂️ Género</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={sex} onValueChange={setSex}>
                  <Picker.Item label="Selecciona género" value="" />
                  <Picker.Item label="Macho" value="Macho" />
                  <Picker.Item label="Hembra" value="Hembra" />
                </Picker>
              </View>
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>📅 Edad</Text>
              <Input 
                placeholder="Años" 
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

          {/* Image Preview */}
          {previewUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: previewUri }} style={styles.preview} />
            </View>
          ) : null}

          {/* Image Picker Button */}
          <TouchableOpacity 
            style={styles.pickImageButton}
            onPress={handlePickImage}
            activeOpacity={0.8}
          >
            <Text style={styles.pickImageButtonText}>📷 Seleccionar imagen</Text>
          </TouchableOpacity>

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

  orText: {
    textAlign: 'center',
    color: colors.muted,
    marginVertical: 8,
    fontSize: 12,
  },

  previewContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  pickImageButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickImageButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
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
