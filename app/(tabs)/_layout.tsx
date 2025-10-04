import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="register-pet" options={{ title: 'Registrar Mascota' }} />
      <Tabs.Screen name="schedule-appointment" options={{ title: 'Agendar Cita' }} />
      <Tabs.Screen name="view-diagnostics" options={{ title: 'Diagnósticos' }} />
      <Tabs.Screen name="view-pets" options={{ title: 'Mis Mascotas' }} />
    </Tabs>
  );
}
