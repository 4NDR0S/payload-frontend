"use client";

import PrivateRoute from "../../components/PrivateRoute";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { getCurrentUser, User } from "../../lib/auth";

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);

        // Validar permiso de lectura
        if (u.role === "user" && !u.permissions?.inventory?.canRead) {
          alert("No tienes permiso para ver el inventario");
          setLoading(false);
          return;
        }

        const res = await api.get("/inventory-items");
        setItems(res.data.docs || []);
      } catch (err) {
        console.error("Error fetching inventory items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Borrar item con validación de permiso
  const handleDelete = async (id: string) => {
    if (!(user?.permissions?.inventory?.canDelete || user?.role === "admin")) {
      alert("No tienes permiso para eliminar este ítem");
      return;
    }

    if (!confirm("¿Seguro que quieres eliminar este ítem?")) return;

    try {
      await api.delete(`/inventory-items/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error al eliminar ítem:", err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <PrivateRoute allowedRoles={["admin", "user"]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Inventario</h1>

        {/* Botón Crear */}
        {(user?.permissions?.inventory?.canCreate || user?.role === "admin") && (
          <a
            href="/inventory/create"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block"
          >
            Crear Ítem
          </a>
        )}

        <table className="w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="table-header">
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">SKU</th>
                <th className="p-2 border">Precio</th>
                <th className="p-2 border">Stock</th>
              {(user?.permissions?.inventory?.canUpdate ||
                user?.permissions?.inventory?.canDelete ||
                user?.role === "admin") && <th className="p-2 border">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-300 dark:border-gray-700">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.sku}</td>
                <td className="p-2">{item.price}</td>
                <td className="p-2">{item.stock}</td>
                {(user?.permissions?.inventory?.canUpdate ||
                  user?.permissions?.inventory?.canDelete ||
                  user?.role === "admin") && (
                  <td className="p-2 flex gap-2">
                    {/* Botón Editar */}
                    {(user?.permissions?.inventory?.canUpdate || user?.role === "admin") && (
                      <a
                        href={`/inventory/${item.id}`}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Editar
                      </a>
                    )}
                    {/* Botón Eliminar */}
                    {(user?.permissions?.inventory?.canDelete || user?.role === "admin") && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PrivateRoute>
  );
}
