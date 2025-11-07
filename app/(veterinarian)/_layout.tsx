import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VetHeader from '../../components/ui/AdminHeader';
import { SessionContext } from '../../context/SessionContext';

export default function VetLayout() {
	const { user, isLoading } = useContext(SessionContext);
	const router = useRouter();

		useEffect(() => {
			if (!isLoading) {
				if (!user) {
					router.replace('/(auth)/login' as any);
					return;
				}
				if (!(user.role === 'VETERINARIAN' || user.role === 'VET')) {
					if (user.role === 'ADMIN') router.replace('/(admin)' as any);
					else if (user.role === 'OWNER') router.replace('/(owner)' as any);
					else if (user.role === 'EMPLOYEE') router.replace('/(employee)' as any);
					else router.replace('/(auth)/login' as any);
				}
			}
		}, [user, isLoading, router]);

	if (isLoading) return (<View style={styles.center}><Text>Cargando...</Text></View>);

	return (
		<>
			<VetHeader title="Veterinario" />
			<Tabs
				screenOptions={({ route }) => ({
					headerShown: false,
					tabBarActiveTintColor: '#2E8B57',
					tabBarInactiveTintColor: '#6B7280',
					tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#EEF2F3', height: 60, paddingBottom: 6 },
					tabBarLabelStyle: { fontWeight: '600' },
					tabBarIcon: ({ color, size }) => {
						switch (route.name) {
							case 'index': return <MaterialIcons name="home" color={color} size={size} />;
							case 'vet-appointments': return <MaterialIcons name="event-available" color={color} size={size} />;
							case 'patient-history': return <FontAwesome5 name="file-medical-alt" color={color} size={size} />;
							default: return null;
						}
					}
				})}
			>
				<Tabs.Screen name="index" options={{ title: 'Inicio' }} />
				<Tabs.Screen name="vet-appointments" options={{ title: 'Citas' }} />
				<Tabs.Screen name="patient-history" options={{ title: 'Pacientes' }} />
				<Tabs.Screen name="register-diagnosis" options={{ title: 'Registrar Dx' }} />
			</Tabs>
		</>
	);
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });

