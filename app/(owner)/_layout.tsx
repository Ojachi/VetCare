import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import OwnerHeader from '../../components/ui/AdminHeader';
import { SessionContext } from '../../context/SessionContext';

export default function OwnerLayout() {
	const { user, isLoading } = useContext(SessionContext);
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (!user) {
				router.replace('/(auth)/login' as any);
			}
			// If user exists but not owner, we don't force navigation here; SessionContext handles role routing
		}
	}, [user, isLoading, router]);

	if (isLoading) return (<View style={styles.center}><Text>Cargando...</Text></View>);

		const visibleTabs = ['index', 'view-pets', 'schedule-appointment', 'view-appointments', 'view-diagnostics', 'profile'];

		const iconFor = (name: string, color: string, size: number) => {
			switch (name) {
				case 'index': return <MaterialIcons name="home" color={color} size={size} />;
				case 'view-pets': return <FontAwesome5 name="paw" color={color} size={size} />;
				case 'schedule-appointment': return <MaterialIcons name="event" color={color} size={size} />;
				case 'view-appointments': return <MaterialIcons name="event-available" color={color} size={size} />;
				case 'view-diagnostics': return <FontAwesome5 name="file-medical-alt" color={color} size={size} />;
				case 'profile': return <MaterialIcons name="person" color={color} size={size} />;
				default: return null;
			}
		};

		return (
			<>
				<OwnerHeader />
				<Tabs
					screenOptions={({ route }) => ({
						headerShown: false,
						// hide tab button for routes not in the visible list
						tabBarButton: visibleTabs.includes(route.name) ? undefined : () => null,
						tabBarIcon: ({ color, size }) => iconFor(route.name, color, size),
					})}
				>
					<Tabs.Screen name="index" options={{ title: 'Inicio' }} />
					<Tabs.Screen name="view-pets" options={{ title: 'Mis mascotas' }} />
					<Tabs.Screen name="schedule-appointment" options={{ title: 'Agendar' }} />
					<Tabs.Screen name="view-appointments" options={{ title: 'Citas' }} />
					<Tabs.Screen name="view-diagnostics" options={{ title: 'Diagnósticos' }} />
					<Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
				</Tabs>
			</>
		);
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
