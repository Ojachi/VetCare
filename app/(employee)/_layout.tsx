import { Stack, useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AdminHeader from '../../components/ui/AdminHeader';
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

	if (isLoading) return (<View style={styles.center}><Text>Cargando...</Text></View>);

	return (
		<>
			<AdminHeader title="Empleado" />
			<Stack screenOptions={{ headerShown: false }} />
		</>
	);
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
