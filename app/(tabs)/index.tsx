import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import LogoutButton from '../../components/ui/LogoutButton';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button title="Registrar Mascota" onPress={() => router.push('/(tabs)/register-pet')} />
      <Button title="Agendar Cita" onPress={() => router.push('/(tabs)/schedule-appointment')} />
      <Button title="Ver Diagnósticos" onPress={() => router.push('/(tabs)/view-diagnostics')} />
      <Button title="Ver Mascotas" onPress={() => router.push('/(tabs)/view-pets')} />
      {/* Botones para Admin */}
      <Button title="Usuarios (Admin)" onPress={() => router.push('/(admin)/users')} />
      <Button title="Mascotas (Admin)" onPress={() => router.push('/(admin)/all-pets')} />
  <Button title="Gestión de Servicios (Admin)" onPress={() => router.push('/(admin)/services')} />
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-around', padding: 30 },
});
