"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, User } from "../lib/auth";

type PrivateRouteProps = {
  children: ReactNode;
  allowedRoles?: ("admin" | "user")[];
};

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const u = await getCurrentUser();
        console.log("Usuario obtenido en PrivateRoute:", u); // 🔍 Log del usuario
        setUser(u);

        if (allowedRoles && !allowedRoles.includes(u.role)) {
          console.log("Rol no permitido, redirigiendo a /unauthorized"); // 🔍 Log rol
          router.replace("/unauthorized");
        }
      } catch (err) {
        console.log("No hay sesión activa, redirigiendo a /login", err); // 🔍 Log error
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, allowedRoles]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return user ? <>{children}</> : null;
}
