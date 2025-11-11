import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import { useSession } from '../../context/SessionContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import Card from '../ui/Card';

type Stats = {
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
};

export default function EmployeeHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
  });
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const appointmentsRes = await axiosClient.get('/api/appointments');
      const appointments = appointmentsRes.data || [];

      setStats({
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter((a: any) => a.status === 'pendiente').length,
        completedAppointments: appointments.filter((a: any) => a.status === 'completada').length,
      });
    } catch (err) {
      alertApiError(err, 'Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Welcome */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>👨‍⚕️</Text>
        </View>
        <Text style={[typography.h2, styles.greeting]}>Bienvenido, {user?.name}</Text>
        <Text style={styles.role}>Empleado de VetCare</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalAppointments}</Text>
          <Text style={styles.statLabel}>📅 Total de Citas</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.pendingAppointments}</Text>
          <Text style={styles.statLabel}>⏳ Pendientes</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completedAppointments}</Text>
          <Text style={styles.statLabel}>✓ Completadas</Text>
        </Card>
      </View>

      {/* Menu Grid */}
      <View style={styles.menuContainer}>
        <Text style={[typography.h3, styles.menuTitle]}>Acciones Rápidas</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { borderTopColor: item.color }]}
              onPress={() => router.push(item.path as any)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const menuItems = [
  {
    id: 1,
    icon: '🐾',
    label: 'Registrar Mascota',
    description: 'Agregar nueva mascota',
    path: '/(employee)/register-pet',
    color: colors.primary,
  },
  {
    id: 2,
    icon: '📅',
    label: 'Mis Citas',
    description: 'Ver y gestionar citas',
    path: '/(employee)/employee-appointments',
    color: colors.secondary,
  },
  {
    id: 3,
    icon: '✏️',
    label: 'Editar Mascota',
    description: 'Modificar datos',
    path: '/(employee)/edit-pet',
    color: colors.warning,
  },
  {
    id: 5,
    icon: '👤',
    label: 'Mi Perfil',
    description: 'Información personal',
    path: '/(employee)/perfil',
    color: '#FF6B6B',
  },
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 16,
    paddingTop: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  greeting: {
    color: colors.darkGray,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '500',
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 10,
  },
  statCard: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },

  // Menu
  menuContainer: {
    marginBottom: 32,
  },
  menuTitle: {
    marginBottom: 16,
    color: colors.darkGray,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderTopWidth: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
  },
});
