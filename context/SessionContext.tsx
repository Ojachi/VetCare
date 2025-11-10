import axiosClient, { apiBaseUrlResolved } from "@/api/axiosClient";
import CookieManager from "@react-native-cookies/cookies";
// no Constants needed here
import { useRouter, useSegments } from "expo-router";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Alert } from "react-native";

const apiBaseUrl = apiBaseUrlResolved;

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
    const base = apiBaseUrl || '';
    if (!base) return false;
    const cookies = await CookieManager.get(base); // URL base del backend
    // Aquí el nombre correcto de la cookie que usa backend para sesión
    return cookies && cookies["JSESSIONID"] !== undefined;
  };

  useEffect(() => {
    const initializeSession = async () => {
      const hasSession = await checkSessionCookie();
      console.log("Session cookie exists:", hasSession);
      if (hasSession) {
        try {
          const response = await axiosClient.get("/api/users/me");
          console.log("User profile response:", response.data);
          setUser(response.data); // Guarda los datos reales recibidos
        } catch (error) {
          console.log("Error fetching user profile:", error);
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

    const inAuthGroup = segments[0] === "(auth)";
    const inAdminGroup = segments[0] === "(admin)";
    const inOwnerGroup = segments[0] === "(owner)";
    const inVetGroup = segments[0] === "(veterinarian)";
    const inEmployeeGroup = segments[0] === "(employee)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    if (user && inAuthGroup) {
      // send user to the group matching their role
      if (user.role === "ADMIN" && !inAdminGroup) {
        router.replace("/(admin)" as any);
        return;
      }
      if (user.role === "OWNER" && !inOwnerGroup) {
        router.replace("/(owner)" as any);
        return;
      }
      if (user.role === "EMPLOYEE" && !inEmployeeGroup) {
        router.replace("/(employee)" as any);
        return;
      }
      if ((user.role === "VETERINARIAN" || user.role === "VET") && !inVetGroup) {
        router.replace("/(veterinarian)" as any);
        return;
      }
      
      // fallback no-op
    }
  }, [user, segments, isLoading, router]);

  const login = async (userData: UserType) => {
    await checkSessionCookie(); // espera cookie del backend tras login
    const response = await axiosClient.get("/api/users/me");
    console.log("User profile response:", response.data);
    setUser(response.data);
  };

  const logout = async () => {
    try {
      await axiosClient.post("/api/auth/logout");
      await CookieManager.clearAll();
    } catch (error) {
      console.error("Logout error", error);
      Alert.alert("Error", "Error al cerrar sesión");
    }
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};
