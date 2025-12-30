import { useState, useEffect } from "react";
import api from "./api";

export type User = {
  id: string;
  email: string;
  role: "admin" | "user";
  permissions?: {
    inventory?: { canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean };
    ventas?: { canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean };
    cobranzas?: { canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean };
  };
};

// Login
export const login = async (email: string, password: string): Promise<User> => {
  await api.post("/users/login", { email, password });
  return getCurrentUser();
};

// Logout
export const logout = async (): Promise<void> => {
  await api.post("/users/logout");
};

// Obtener usuario actual
export const getCurrentUser = async (): Promise<User> => {
  const res = await api.get("/users/me");
  const u = res.data.user;

  // Extraemos permisos si existen
  const permissions = u.permissions || {};
  return { ...u, permissions };
};

// -----------------------------
// Hook para React
export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading };
};
