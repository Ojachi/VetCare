import { Stack } from 'expo-router';
import React from 'react';
import ScreenBackground from '../../components/ui/ScreenBackground';

export default function AuthLayout() {
  return (
    <ScreenBackground>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
      </Stack>
    </ScreenBackground>
  );
}
