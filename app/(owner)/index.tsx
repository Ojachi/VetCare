import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LogoutButton from '../../components/ui/LogoutButton';
import { useSession } from '../../context/SessionContext';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

const menuItems = [
  { 
    id: 'mascotas',
    label: 'Mis Mascotas', 
    path: '/(owner)/mascotas', 
    icon: '🐾',
    color: '#27ae60',
    description: 'Gestiona tus mascotas'
  },
  { 
    id: 'citas',
    label: 'Mis Citas', 
    path: '/(owner)/citas', 
    icon: '📅',
    color: '#1abc9c',
    description: 'Agenda y ve tus citas'
  },
  { 
    id: 'diagnosticos',
    label: 'Diagnósticos', 
    path: '/(owner)/diagnosticos', 
    icon: '🏥',
    color: '#9b59b6',
    description: 'Historial médico'
  },
  { 
    id: 'productos',
    label: 'Productos', 
    path: '/(owner)/productos', 
    icon: '🛍️',
    color: '#f39c12',
    description: 'Compra productos'
  },
  { 
    id: 'chat-ia',
    label: 'Chat IA', 
    path: '/(owner)/chat-ia', 
    icon: '🤖',
    color: '#3498db',
    description: 'Asistente inteligente'
  },
  { 
    id: 'compras',
    label: 'Mis Compras', 
    path: '/(owner)/compras', 
    icon: '🛒',
    color: '#e74c3c',
    description: 'Historial de compras'
  },
  { 
    id: 'perfil',
    label: 'Mi Perfil', 
    path: '/(owner)/perfil', 
    color: '#e67e22',
    icon: '👤',
    description: 'Tu información'
  },
];

export default function OwnerHome() {
  const router = useRouter();
  const { user } = useSession();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>🐾</Text>
        </View>
        <Text style={[typography.h2, { color: colors.darkGray, marginBottom: 8 }]}>
          ¡Bienvenido, {user?.name?.split(' ')[0]}!
        </Text>
        <Text style={[typography.body, { color: colors.muted, textAlign: 'center' }]}>
          Gestiona la salud y el bienestar de tus mascotas
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🐕</Text>
          <Text style={styles.statLabel}>Mascotas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📅</Text>
          <Text style={styles.statLabel}>Citas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🏥</Text>
          <Text style={styles.statLabel}>Historial</Text>
        </View>
      </View>

      {/* Menu Grid */}
      <View style={styles.menuContainer}>
        <Text style={[typography.h3, { color: colors.darkGray, marginBottom: 16 }]}>Mi Centro de Control</Text>
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuCard, { borderTopColor: item.color }]}
              onPress={() => router.push(item.path as any)}
              activeOpacity={0.85}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: item.color }]}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <Text style={[typography.h3, { fontSize: 14, color: colors.darkGray, marginTop: 12 }]}>
                {item.label}
              </Text>
              <Text style={[typography.body, { fontSize: 11, color: colors.muted, marginTop: 4, textAlign: 'center' }]}>
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout Button */}
      <LogoutButton style={styles.logout} />
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: colors.background,
  },
  
  // Welcome Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarEmoji: {
    fontSize: 44,
  },
  
  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.darkGray,
    textAlign: 'center',
  },
  
  // Menu Container
  menuContainer: {
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  menuCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    borderTopWidth: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 32,
  },
  
  // Logout Button
  logout: {
    marginBottom: 16,
  },
});
