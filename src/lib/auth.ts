// import { useState, useEffect } from "react";

// export type User = {
//   id: string;
//   email: string;
//   role: "admin" | "user";
//   permissions?: {
//     inventory?: { canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean };
//     ventas?: { canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean };
//     cobranzas?: { canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean };
//   };
// };

// // -----------------------------
// // Login usando fetch directo
// export const login = async (email: string, password: string): Promise<User> => {
//   const res = await fetch("https://payload-backend-z890.onrender.com/api/users/login", {
//     method: "POST",
//     credentials: "include", // envía cookies de sesión
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email, password }),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.message || "Error en login");
//   }

//   // Obtener usuario autenticado
//   const user = await getCurrentUser();
//   if (!user) throw new Error("No se pudo obtener el usuario después del login");

//   return user;
// };

// // -----------------------------
// // Logout usando fetch
// export const logout = async (): Promise<void> => {
//   const res = await fetch("https://payload-backend-z890.onrender.com/api/users/logout", {
//     method: "POST",
//     credentials: "include", // envía cookies
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.message || "Error al cerrar sesión");
//   }
// };

// // -----------------------------
// // Obtener usuario actual
// export const getCurrentUser = async (): Promise<User | null> => {
//   try {
//     const res = await fetch("https://payload-backend-z890.onrender.com/api/users/me", {
//       method: "GET",
//       credentials: "include",
//     });

//     if (!res.ok) return null;

//     const data = await res.json();
//     const u = data.user;

//     if (!u) return null;

//     const permissions = u.permissions || {};
//     return { ...u, permissions };
//   } catch (err) {
//     // No hay sesión activa o hubo error
//     return null;
//   }
// };

// // -----------------------------
// // Hook para React
// export const useUser = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const currentUser = await getCurrentUser();
//         setUser(currentUser);
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   return { user, loading };
// };

// --------A PARTIR DE AQUI SE ESTA HACIENDO CON JWT-----------------
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

// -----------------------------
// LOGIN (JWT)
export const login = async (email: string, password: string): Promise<User> => {
  const res = await api.post("/users/login", { email, password });

  const { token, user } = res.data;

  if (!token || !user) {
    throw new Error("Login inválido");
  }

  // Guardamos JWT
  localStorage.setItem("payload-token", token);

  return {
    ...user,
    permissions: user.permissions || {},
  };
};

// -----------------------------
// LOGOUT
export const logout = async () => {
  localStorage.removeItem("payload-token");
};

// -----------------------------
// USUARIO ACTUAL (JWT)
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await api.get("/users/me");
    const u = res.data.user;

    if (!u) return null;

    return {
      ...u,
      permissions: u.permissions || {},
    };
  } catch {
    return null;
  }
};

// -----------------------------
// HOOK
export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const u = await getCurrentUser();
      setUser(u);
      setLoading(false);
    };
    init();
  }, []);

  return { user, loading };
};
