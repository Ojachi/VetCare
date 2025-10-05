import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LogoutButton from '../../components/ui/LogoutButton';

const buttons = [
  { label: 'Mis Mascotas', path: '/(owner)/view-pets', color: '#27ae60', icon: require('../../assets/images/admin_pet.png') },
  { label: 'Agendar Cita', path: '/(owner)/schedule-appointment', color: '#1abc9c', icon: require('../../assets/images/admin_appointments.png') },
  { label: 'Mis Citas', path: '/(owner)/view-appointments', color: '#3498db', icon: require('../../assets/images/admin_appointments.png') },
  { label: 'Diagnósticos', path: '/(owner)/view-diagnostics', color: '#9b59b6', icon: require('../../assets/images/admin_medical_records.png') },
  { label: 'Perfil', path: '/(owner)/profile', color: '#e67e22', icon: require('../../assets/images/admin_users.png') },
];

export default function OwnerHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {buttons.map((b) => (
          <TouchableOpacity key={b.label} style={[styles.button, { backgroundColor: b.color }]} onPress={() => router.push(b.path as any)}>
            <Image source={b.icon} style={styles.icon} />
            <Text style={styles.buttonText}>{b.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <LogoutButton style={styles.logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 30, alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  button: { width: 158, height: 130, margin: 8, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  icon: { width: 40, height: 40, marginBottom: 8 },
  logout: { marginTop: 20, width: 340 },
});
