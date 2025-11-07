import {
    FontAwesome5,
    MaterialIcons,
} from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import AdminHeader from "../../components/ui/AdminHeader";
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
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <>
      <AdminHeader title="Administración" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2E8B57',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#EEF2F3', height: 60, paddingBottom: 6 },
          tabBarLabelStyle: { fontWeight: '600' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: "Gestión de Usuarios",
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
            title: "Gestión de Servicios",
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
            title: "Historial Médico",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="file-medical-alt" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
