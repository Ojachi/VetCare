import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import OwnerHeader from '../../components/ui/OwnerHeader';
import ScreenBackground from '../../components/ui/ScreenBackground';
import { SessionContext } from '../../context/SessionContext';

export default function OwnerLayout() {
	const { user, isLoading } = useContext(SessionContext);
	const router = useRouter();

		useEffect(() => {
			if (!isLoading) {
				if (!user) {
					router.replace('/(auth)/login' as any);
					return;
				}
				if (user.role !== 'OWNER') {
					// Deny access and redirect according to role
					if (user.role === 'ADMIN') router.replace('/(admin)' as any);
					else if (user.role === 'EMPLOYEE') router.replace('/(employee)' as any);
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

	const visibleTabs = ['index', 'mascotas', 'citas', 'diagnosticos', 'perfil', 'productos'];

		const iconFor = (name: string, color: string, size: number) => {
			switch (name) {
				case 'index': return <MaterialIcons name="home" color={color} size={size} />;
				case 'mascotas': return <FontAwesome5 name="paw" color={color} size={size} />;
				case 'citas': return <MaterialIcons name="event-available" color={color} size={size} />;
				case 'diagnosticos': return <FontAwesome5 name="file-medical-alt" color={color} size={size} />;
				case 'perfil': return <MaterialIcons name="person" color={color} size={size} />;
				case 'productos': return <FontAwesome5 name="shopping-bag" color={color} size={size} />;
				default: return null;
			}
		};

		return (
			<ScreenBackground>
				<OwnerHeader title="VetCare" showCart />
				<Tabs
					screenOptions={({ route }) => ({
						headerShown: false,
						tabBarButton: visibleTabs.includes(route.name) ? undefined : () => null,
						tabBarIcon: ({ color, size }) => iconFor(route.name, color, size),
						tabBarActiveTintColor: '#2E8B57',
						tabBarInactiveTintColor: '#6B7280',
						tabBarLabelStyle: { fontWeight: '600', fontSize: 11, flexWrap: 'nowrap' },
						// custom width distribution
						tabBar: (props: any) => <EqualWidthTabBar {...props} visibleTabs={visibleTabs} />,
					})}
				>
					<Tabs.Screen name="index" options={{ title: 'Inicio' }} />
					<Tabs.Screen name="mascotas" options={{ title: 'Mascotas' }} />
					<Tabs.Screen name="citas" options={{ title: 'Citas' }} />
					<Tabs.Screen name="diagnosticos" options={{ title: 'Diagnósticos' }} />
					<Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
					<Tabs.Screen name="productos" options={{ title: 'Productos' }} />
				</Tabs>
			</ScreenBackground>
		);
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });

// Custom tab bar retained from previous implementation
function EqualWidthTabBar({ state, descriptors, navigation, visibleTabs }: any) {
	const focusedOptions = descriptors[state.routes[state.index].key].options;
	if (focusedOptions.tabBarVisible === false) return null;

	const shown = state.routes.filter((r: any) => visibleTabs.includes(r.name));
	const itemWidthPercent = 100 / shown.length;

	return (
		<View style={tabStyles.container}>
			{shown.map((route: any) => {
				const { options } = descriptors[route.key];
				const label = options.title !== undefined ? options.title : route.name;
				const isFocused = state.index === state.routes.indexOf(route);

				const onPress = () => {
					const event = navigation.emit({ type: 'tabPress', target: route.key });
					if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
				};

				const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });
				const color = isFocused ? '#2E8B57' : '#6B7280';
				const icon = options.tabBarIcon ? options.tabBarIcon({ color, size: 22, focused: isFocused }) : null;

				return (
					<View key={route.key} style={[tabStyles.item, { flexBasis: `${itemWidthPercent}%` }]}> 
						<Text accessibilityRole="button" accessibilityState={isFocused ? { selected: true } : {}}
							accessibilityLabel={options.tabBarAccessibilityLabel} testID={options.tabBarTestID}
							onPress={onPress} onLongPress={onLongPress} style={tabStyles.pressable}>
							{icon}
							<Text style={[tabStyles.label, { color }]} numberOfLines={1}>{label}</Text>
						</Text>
					</View>
				);
			})}
		</View>
	);
}

const tabStyles = StyleSheet.create({
	container: { flexDirection: 'row', backgroundColor: '#fff', borderTopColor: '#EEF2F3', borderTopWidth: StyleSheet.hairlineWidth, height: 62 },
	item: { justifyContent: 'center', alignItems: 'center' },
	pressable: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 6, width: '100%' },
	label: { fontWeight: '600', fontSize: 11, marginTop: 2 },
});

