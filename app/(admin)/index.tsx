import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Card from '../../components/ui/Card';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

type AdminPath = 
  | '/(admin)/users'
  | '/(admin)/all-pets'
  | '/(admin)/services'
  | '/(admin)/admin-appointments'
  | '/(admin)/medical-records'
  | '/(admin)/products';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: AdminPath;
  description: string;
  borderColor: string;
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    label: 'Gestión de Usuarios',
    icon: '👤',
    path: '/(admin)/users',
    description: 'Crear, editar y gestionar usuarios',
    borderColor: colors.primary,
  },
  {
    id: '2',
    label: 'Gestión de Mascotas',
    icon: '🐾',
    path: '/(admin)/all-pets',
    description: 'Administrar mascotas registradas',
    borderColor: colors.secondary,
  },
  {
    id: '3',
    label: 'Gestión de Servicios',
    icon: '🏥',
    path: '/(admin)/services',
    description: 'Crear y editar servicios',
    borderColor: colors.warning,
  },
  {
    id: '4',
    label: 'Citas',
    icon: '📅',
    path: '/(admin)/admin-appointments',
    description: 'Ver todas las citas',
    borderColor: colors.success,
  },
  {
    id: '5',
    label: 'Historial Médico',
    icon: '📋',
    path: '/(admin)/medical-records',
    description: 'Registros y diagnósticos',
    borderColor: colors.danger,
  },
  {
    id: '6',
    label: 'Productos',
    icon: '🛍️',
    path: '/(admin)/products',
    description: 'Gestionar productos',
    borderColor: colors.primary,
  },
];

export default function AdminHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ users: 0, pets: 0, appointments: 0 });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [usersRes, petsRes, appointmentsRes] = await Promise.all([
        axiosClient.get('/api/users').catch(() => ({ data: [] })),
        axiosClient.get('/api/pets').catch(() => ({ data: [] })),
        axiosClient.get('/api/appointments').catch(() => ({ data: [] })),
      ]);
      
      setStats({
        users: usersRes.data?.length || 0,
        pets: petsRes.data?.length || 0,
        appointments: appointmentsRes.data?.length || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      {loading && !stats.users ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>⚙️</Text>
            <Text style={[typography.h2, styles.headerTitle]}>Bienvenido, Administrador</Text>
            <Text style={styles.headerSubtitle}>Panel de control de VetCare</Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.users}</Text>
              <Text style={styles.statLabel}>Usuarios</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.pets}</Text>
              <Text style={styles.statLabel}>Mascotas</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.appointments}</Text>
              <Text style={styles.statLabel}>Citas</Text>
            </Card>
          </View>

          {/* Menu Grid */}
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <Card
                key={item.id}
                style={[
                  styles.menuItem,
                  { borderTopWidth: 4, borderTopColor: item.borderColor },
                ]}
              >
                <TouchableOpacity
                  onPress={() => router.push(item.path)}
                  style={styles.menuItemTouchable}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    color: colors.darkGray,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 6,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  menuItem: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  menuItemTouchable: {
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 4,
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },
});
