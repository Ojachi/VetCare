import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

export default function EmployeeEditPet() {
  const router = useRouter();
  const params: any = (router as any).params || {};
  const petId = params?.petId;
  const [loading, setLoading] = useState(false);
  const [pet, setPet] = useState<any>(null);
  const [owners, setOwners] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!petId) return;
      try {
        const res = await axiosClient.get(`/api/pets/${petId}`);
        setPet(res.data);
      } catch {
        Alert.alert('Error', 'No se pudo cargar la mascota');
      }
    };
    const fetchOwners = async () => {
      try {
        const res = await axiosClient.get('/api/users');
        setOwners((res.data || []).filter((u: any) => u.role === 'OWNER'));
      } catch {
        // ignore
      }
    };
    load(); fetchOwners();
  }, [petId]);

  const onSave = async () => {
    if (!pet) return;
    setLoading(true);
    try {
      await axiosClient.put(`/api/pets/${petId}`, pet);
      Alert.alert('Éxito', 'Mascota actualizada');
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la mascota');
    } finally {
      setLoading(false);
    }
  };

  if (!pet) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <Card>
        <Text style={typography.h3}>Editar Mascota (Empleado)</Text>
        <Input placeholder="Nombre" value={pet.name} onChangeText={(v) => setPet({ ...pet, name: v })} />
        <Input placeholder="Especie" value={pet.species} onChangeText={(v) => setPet({ ...pet, species: v })} />
        <Input placeholder="Raza" value={pet.breed} onChangeText={(v) => setPet({ ...pet, breed: v })} />
        <Input placeholder="Género" value={pet.sex} onChangeText={(v) => setPet({ ...pet, sex: v })} />
        <Input placeholder="Peso" value={pet.weight ? String(pet.weight) : ''} onChangeText={(v) => setPet({ ...pet, weight: Number(v) })} keyboardType="numeric" />
        <Input placeholder="Edad" value={pet.age ? String(pet.age) : ''} onChangeText={(v) => setPet({ ...pet, age: Number(v) })} keyboardType="numeric" />

        <Text style={[typography.subtitle, { marginTop: 12 }]}>Propietario</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={String(pet.ownerId || pet.owner?.id || '')} onValueChange={(v) => setPet({ ...pet, ownerId: Number(v) })}>
            <Picker.Item label="Selecciona propietario" value={''} />
            {owners.map((o) => <Picker.Item key={o.id} label={o.name} value={String(o.id)} />)}
          </Picker>
        </View>

        <Button title={loading ? 'Guardando...' : 'Guardar'} onPress={onSave} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pickerWrap: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, marginTop: 8, overflow: 'hidden' },
});
