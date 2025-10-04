import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import CookieManager from '@react-native-cookies/cookies';
import Constants from 'expo-constants';
import axiosClient from '@/api/axiosClient';
import { Alert } from 'react-native';

const apiBaseUrl = Constants.expoConfig?.extra?.apiUrlAndroid;


type UserType = { email: string; [key: string]: any } | null;

type SessionContextType = {
  user: UserType;
  login: (user: UserType) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

export const SessionContext = createContext<SessionContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const segments = useSegments();

  // Revisar si la cookie de sesión existe
  const checkSessionCookie = async (): Promise<boolean> => {
    const cookies = await CookieManager.get(apiBaseUrl); // Poner url de backend real
    // Aquí el nombre correcto de la cookie que usa backend para sesión
    return cookies && cookies['JSESSIONID'] !== undefined;
  };

  useEffect(() => {
  const initializeSession = async () => {
    const hasSession = await checkSessionCookie();
      console.log('Session cookie exists:', hasSession);
      if (hasSession) {
        try {
          const response = await axiosClient.get('/api/users/me');
          console.log('User profile response:', response.data);
          setUser(response.data); // Guarda los datos reales recibidos
        } catch (error) {
          console.log('Error fetching user profile:', error);
          setUser(null); // Si falla, asume no autenticado
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    initializeSession();
  }, []);


  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
    if (user && inAuthGroup) {
      if (user.role === 'ADMIN') {
        router.replace('/(admin)');
        return;
      }
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading, router]);

  const login = async (userData: UserType) => {
    await checkSessionCookie(); // espera cookie del backend tras login
    const response = await axiosClient.get('/api/users/me');
    console.log('User profile response:', response.data);
    setUser(response.data);
  };

  const logout = async () => {
    try {
      await axiosClient.post('/api/auth/logout');
      await CookieManager.clearAll();
    } catch (error) {
      console.error('Logout error', error);
      Alert.alert('Error', 'Error al cerrar sesión');
    }
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};
