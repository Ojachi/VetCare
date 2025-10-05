import LogoutButton from '@/components/ui/LogoutButton';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const adminPaths = [
  '/(admin)/users',
  '/(admin)/all-pets',
  '/(admin)/services',
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
    label: 'Gestión de Servicios',
    color: '#9b59b6',
    icon: require('../../assets/images/admin_list_service.png'),
    path: '/(admin)/services',
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
