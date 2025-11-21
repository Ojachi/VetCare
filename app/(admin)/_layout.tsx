import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import AdminHeader from "../../components/ui/AdminHeader";
import ScreenBackground from "../../components/ui/ScreenBackground";
import { SessionContext } from "../../context/SessionContext";

export default function AdminLayout() {
  const { user, isLoading } = useContext(SessionContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/(auth)/login");
      } else if (user.role !== "ADMIN") {
        Alert.alert("Acceso denegado", "No tienes permisos para esta sección");
        // Redirect to their role-based home
        if (user.role === "OWNER") router.replace("/(owner)" as any);
        else if (user.role === "VETERINARIAN" || user.role === "VET") router.replace("/(veterinarian)" as any);
        else if (user.role === "EMPLOYEE") router.replace("/(employee)" as any);
        else router.replace("/(auth)/login");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <ScreenBackground>
        <View style={styles.center}>
          <Text>Cargando...</Text>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <AdminHeader title="Administración" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2E8B57',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: { 
            backgroundColor: '#fff', 
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            height: 64, 
            paddingBottom: 8,
            paddingTop: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 8,
          },
          tabBarLabelStyle: { 
            fontWeight: '600',
            fontSize: 10,
            marginTop: 2,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: "Usuarios",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="users-cog" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="all-pets"
          options={{
            title: "Mascotas",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="paw" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="services"
          options={{
            title: "Servicios",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="list" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="admin-appointments"
          options={{
            title: "Citas",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="event-available" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="medical-records"
          options={{
            title: "Historial",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="file-medical-alt" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            title: "Productos",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="shopping-cart" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="purchases"
          options={{
            title: "Compras",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="cash-register" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
      </Tabs>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
