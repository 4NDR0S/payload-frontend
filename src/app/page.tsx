"use client";

import PrivateRoute from "../components/PrivateRoute";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../lib/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser()
      .then((u) => {
        console.log("Usuario obtenido en Dashboard:", u); // 🔍 Log dashboard
        setUser(u);
      })
      .catch((err) => {
        console.log("Error al obtener usuario en Dashboard:", err); // 🔍 Log error
        setUser(null);
      });
  }, []);

  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <PrivateRoute allowedRoles={["admin", "user"]}>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">Bienvenido, {user.email}</h1>
        <p className="text-lg text-zinc-700 dark:text-zinc-300">Rol: {user.role}</p>
      </div>
    </PrivateRoute>
  );
}
