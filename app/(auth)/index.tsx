import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';

export default function AuthIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if someone navigates to /(auth)
    router.replace('/(auth)/login');
  }, [router]);

  return <View style={{ flex: 1 }} />;
}
