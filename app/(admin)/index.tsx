import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import LogoutButton from '@/components/ui/LogoutButton';

const adminPaths = [
  '/(admin)/users',
  '/(admin)/all-pets',
  '/(admin)/registrar-service',
  '/(admin)/view-services',
  '/(admin)/admin-appointments',
  '/(admin)/medical-records',

] as const;

type AdminPath = typeof adminPaths[number];

const buttons: {
  label: string;
  color: string;
  icon: any;
  path: AdminPath;
}[] = [
  {
    label: 'Gestión de Usuarios',
    color: '#3498db',
    icon: require('../../assets/images/admin_users.png'),
    path: '/(admin)/users',
  },
  {
    label: 'Gestión de Mascotas',
    color: '#27ae60',
    icon: require('../../assets/images/admin_pet.png'),
    path: '/(admin)/all-pets',
  },
  {
    label: 'Registrar Servicio',
    color: '#e67e22',
    icon: require('../../assets/images/admin_service.png'),
    path: '/(admin)/registrar-service',
  },
  {
    label: 'Ver Servicios',
    color: '#9b59b6',
    icon: require('../../assets/images/admin_list_service.png'),
    path: '/(admin)/view-services',
  },
  {
    label: 'Citas',
    color: '#1abc9c',
    icon: require('../../assets/images/admin_appointments.png'),
    path: '/(admin)/admin-appointments',
  },
  {
    label: 'Historial Médico',
    color: '#e74c3c',
    icon: require('../../assets/images/admin_medical_records.png'),
    path: '/(admin)/medical-records',
  },
];

export default function AdminHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {buttons.map((btn, idx) => (
          <TouchableOpacity
            key={btn.label}
            style={[styles.button, { backgroundColor: btn.color }]}
            onPress={() => router.push(btn.path)}
          >
            <Image source={btn.icon} style={styles.icon} />
            <Text style={styles.buttonText}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <LogoutButton style={styles.logout}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 30 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  button: {
    width: 158,
    height: 130,
    margin: 8,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  icon: { width: 40, height: 40, marginBottom: 8 },
  logout: { backgroundColor: '#e74c3c' , width: 340, alignSelf: 'center', marginTop: 25 },
});
