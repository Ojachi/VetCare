import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

export default function PetDetail() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const [pet, setPet] = useState<any | null>(null);

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

  if (!pet) return <View style={styles.center}><Text>Cargando...</Text></View>;

  return (
    <View style={styles.container}>
      <Card>
        <Text style={[typography.h2, { marginBottom: 8 }]}>{pet.name}</Text>
        <Text style={typography.body}>Especie: {pet.species}</Text>
        {pet.breed && <Text style={typography.body}>Raza: {pet.breed}</Text>}
        {pet.age !== undefined && <Text style={typography.body}>Edad: {pet.age} años</Text>}
        {pet.weight !== undefined && <Text style={typography.body}>Peso: {pet.weight} Kg</Text>}
        {pet.sex && <Text style={typography.body}>Género: {pet.sex}</Text>}

        <View style={{ marginTop: 12 }}>
          <Button title="Editar" onPress={() => router.push({ pathname: '/(owner)/edit-pet', params: { petId } } as any)} />
          <View style={{ height: 8 }} />
          <Button title="Agendar Cita" onPress={() => router.push({ pathname: '/(owner)/schedule-appointment', params: { petId } } as any)} />
          <View style={{ height: 8 }} />
          <Button title="Ver Diagnósticos" onPress={() => router.push({ pathname: '/(owner)/view-diagnostics', params: { petId } } as any)} />
          <View style={{ height: 8 }} />
          <Button title="Eliminar Mascota" onPress={async () => {
            try {
              await axiosClient.delete(`/api/pets/${petId}`);
              Alert.alert('Éxito', 'Mascota eliminada');
              router.replace('/(owner)/view-pets' as any);
            } catch (err) {
              alertApiError(err, 'No se pudo eliminar la mascota');
            }
          }} style={{ backgroundColor: colors.danger }} />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
});
