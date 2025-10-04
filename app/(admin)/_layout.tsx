import React, { useContext, useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { View, Alert, StyleSheet, Text } from "react-native";
import { SessionContext } from "../../context/SessionContext";
import AdminHeader from "../../components/ui/AdminHeader";
import {
  MaterialIcons,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";

export default function AdminLayout() {
  const { user, isLoading } = useContext(SessionContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/(auth)/login");
      } else if (user.role !== "ADMIN") {
        Alert.alert("Acceso denegado", "No tienes permisos para esta sección");
        router.replace("/(tabs)"); // O ruta común para otros usuarios
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
      <AdminHeader />
      <Tabs>
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
          name="registrar-service"
          options={{
            title: "Registrar Servicio",
            tabBarIcon: ({ color, size }) => (
              <Entypo name="plus" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="view-services"
          options={{
            title: "Ver Servicios",
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
