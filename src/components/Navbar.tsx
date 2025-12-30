"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { logout } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login"); // redirige al login
    } catch (err: any) {
      console.error("Error al cerrar sesión:", err.response?.data || err.message);
      alert("No se pudo cerrar sesión, revisa la consola.");
    }
  };

  return (
    <nav className="navbar flex items-center justify-between p-4 bg-white text-black border-b border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-700">
      <div className="flex space-x-4">
        <Link href="/" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/inventory" className="hover:underline">
          Inventario
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
        >
          Logout ↩
        </button>
      </div>
    </nav>
  );
}
