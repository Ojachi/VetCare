import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

export default function EditPet() {
  const router = useRouter();
  const petId = useLocalSearchParams<{ petId: string }>();
  const [loading, setLoading] = useState(false);
  const [pet, setPet] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!petId) return;
      try {
        const res = await axiosClient.get(`/api/pets/${petId}`);
        setPet(res.data);
      } catch (err) {
        alertApiError(err, 'No se pudo cargar la mascota');
      }
    };
    load();
  }, [petId]);

  const onSave = async () => {
    if (!pet) return;
    setLoading(true);
    try {
      await axiosClient.put(`/api/pets/${petId}`, pet);
      Alert.alert('Éxito', 'Mascota actualizada');
      router.back();
    } catch (err) {
      alertApiError(err, 'No se pudo actualizar la mascota');
    } finally {
      setLoading(false);
    }
  };

  if (!pet) return <View style={styles.center}><Text>Cargando...</Text></View>;

  return (
    <View style={styles.container}>
      <Card>
        <Text style={[typography.h2, { textAlign: 'center', marginBottom: 12 }]}>Editar Mascota</Text>
        <Input placeholder="Nombre" value={pet.name} onChangeText={(v) => setPet({ ...pet, name: v })} />
        <Input placeholder="Especie" value={pet.species} onChangeText={(v) => setPet({ ...pet, species: v })} />
        <Input placeholder="Raza" value={pet.breed} onChangeText={(v) => setPet({ ...pet, breed: v })} />
        <Input placeholder="Género" value={pet.sex} onChangeText={(v) => setPet({ ...pet, sex: v })} />
        <Input placeholder="Peso" value={pet.weight ? String(pet.weight) : ''} onChangeText={(v) => setPet({ ...pet, weight: Number(v) })} keyboardType="numeric" />
        <Input placeholder="Edad" value={pet.age ? String(pet.age) : ''} onChangeText={(v) => setPet({ ...pet, age: Number(v) })} keyboardType="numeric" />
        <Button title={loading ? 'Guardando...' : 'Guardar'} onPress={onSave} disabled={loading} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
});
