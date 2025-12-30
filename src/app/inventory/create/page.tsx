"use client";

import PrivateRoute from "../../../components/PrivateRoute";
import { useState } from "react";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function CreateInventoryItem() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await api.post("/inventory-items", { name, sku, price, stock });
      router.push("/inventory"); // redirige al listado
    } catch (err) {
      console.error(err);
      setError("Error al crear el ítem");
    }
  };

  return (
    <PrivateRoute allowedRoles={["admin", "user"]}>
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Crear Ítem de Inventario</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nombre */}
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 text-black dark:text-white">Nombre</label>
            <input
              id="name"
              type="text"
              placeholder="Nombre del ítem"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border p-2 rounded"
            />
          </div>

          {/* SKU */}
          <div className="flex flex-col">
            <label htmlFor="sku" className="mb-1 text-black dark:text-white">SKU</label>
            <input
              id="sku"
              type="text"
              placeholder="Código SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              className="border p-2 rounded"
            />
          </div>

          {/* Precio */}
          <div className="flex flex-col">
            <label htmlFor="price" className="mb-1 text-black dark:text-white">Precio</label>
            <input
              id="price"
              type="number"
              placeholder="Precio del ítem"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="border p-2 rounded"
            />
          </div>

          {/* Stock */}
          <div className="flex flex-col">
            <label htmlFor="stock" className="mb-1 text-black dark:text-white">Stock</label>
            <input
              id="stock"
              type="number"
              placeholder="Cantidad en inventario"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
              className="border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2"
          >
            Crear Ítem
          </button>
        </form>
      </div>
    </PrivateRoute>
  );
}
