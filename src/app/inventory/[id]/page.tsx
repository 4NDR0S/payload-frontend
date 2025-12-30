"use client";

import PrivateRoute from "../../../components/PrivateRoute";
import { useState, useEffect } from "react";
import api from "../../../lib/api";
import { useRouter, useParams } from "next/navigation";

export default function EditInventoryItem() {
  const router = useRouter();
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/inventory-items/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await api.patch(`/inventory-items/${id}`, item);
      router.push("/inventory");
    } catch (err) {
      console.error(err);
      setError("Error al actualizar el ítem");
    }
  };

  const handleChange = (field: string, value: any) => {
    setItem({ ...item, [field]: value });
  };

  if (!item) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <PrivateRoute allowedRoles={["admin", "user"]}>
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Editar Ítem de Inventario</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Nombre"
            value={item.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="SKU"
            value={item.sku}
            onChange={(e) => handleChange("sku", e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Precio"
            value={item.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Stock"
            value={item.stock}
            onChange={(e) => handleChange("stock", Number(e.target.value))}
            required
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-2">
            Guardar Cambios
          </button>
        </form>
      </div>
    </PrivateRoute>
  );
}
