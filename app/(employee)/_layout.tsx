import { MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AdminHeader from '../../components/ui/AdminHeader';
import ScreenBackground from '../../components/ui/ScreenBackground';
import { SessionContext } from '../../context/SessionContext';

export default function EmployeeLayout() {
	const { user, isLoading } = useContext(SessionContext);
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (!user) {
				router.replace('/(auth)/login' as any);
				return;
			}
			if (user.role !== 'EMPLOYEE') {
				if (user.role === 'ADMIN') router.replace('/(admin)' as any);
				else if (user.role === 'OWNER') router.replace('/(owner)' as any);
				else if (user.role === 'VETERINARIAN' || user.role === 'VET') router.replace('/(veterinarian)' as any);
				else router.replace('/(auth)/login' as any);
			}
		}
	}, [user, isLoading, router]);

	if (isLoading) return (
		<ScreenBackground>
			<View style={styles.center}><Text>Cargando...</Text></View>
		</ScreenBackground>
	);

	return (
		<ScreenBackground>
			<AdminHeader title="Empleado" />
			<Tabs
				screenOptions={({ route }) => ({
					headerShown: false,
					tabBarActiveTintColor: '#2E8B57',
					tabBarInactiveTintColor: '#6B7280',
					tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#EEF2F3', height: 60, paddingBottom: 6 },
					tabBarLabelStyle: { fontWeight: '600', fontSize: 10 },
					tabBarIcon: ({ color, size }) => {
						switch (route.name) {
							case 'index': return <MaterialIcons name="home" color={color} size={size} />;
							case 'employee-appointments': return <MaterialIcons name="event-available" color={color} size={size} />;
							case 'mascotas': return <MaterialIcons name="pets" color={color} size={size} />;
							case 'register-pet': return <MaterialIcons name="add-circle" color={color} size={size} />;
							case 'perfil': return <MaterialIcons name="person" color={color} size={size} />;
							default: return null;
						}
					}
				})}
			>
				<Tabs.Screen name="index" options={{ title: 'Inicio' }} />
				<Tabs.Screen name="employee-appointments" options={{ title: 'Citas' }} />
				<Tabs.Screen name="mascotas" options={{ title: 'Mascotas' }} />
				<Tabs.Screen name="register-pet" options={{ title: 'Registrar' }} />
				<Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
			</Tabs>
		</ScreenBackground>
	);
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
