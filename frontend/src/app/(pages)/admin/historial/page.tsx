"use client";

import { useEffect, useState } from "react";
import { HistorialPedido } from "@/app/types/historial";

export default function HistorialAdmin() {
  const [pedidos, setPedidos] = useState<HistorialPedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");

      const res = await fetch("/api/admin/historial", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cargar");
      setPedidos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/historial/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (res.ok) {
        cargarPedidos();
      } else {
        alert("Error al actualizar");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Historial de pedidos</h1>
      <div className="space-y-4">
        {pedidos.map((p) => (
          <div key={p.id} className="border p-4 rounded">
            <p><strong>Usuario:</strong> {p.usuarios?.nombre_usuario} ({p.usuarios?.correo})</p>
            <p><strong>Fecha:</strong> {new Date(p.fecha).toLocaleString()}</p>
            <p><strong>Total:</strong> ${p.total}</p>
            <p><strong>Estado:</strong> {p.estado}</p>
            <details>
              <summary>Ver productos</summary>
              <ul>
                {p.items.map((item, i) => (
                  <li key={i}>
                    {item.nombre} - {item.cantidad} x ${item.precio} = ${item.subtotal}
                  </li>
                ))}
              </ul>
            </details>
            {p.estado === 'pendiente' && (
              <button
                onClick={() => cambiarEstado(p.id, 'aceptado')}
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
              >
                Aceptar pedido
              </button>
            )}
            {p.estado === 'aceptado' && (
              <button
                onClick={() => cambiarEstado(p.id, 'entregado')}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Marcar como entregado
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}