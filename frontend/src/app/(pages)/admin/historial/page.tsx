// app/admin/historial/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { HistorialPedido } from "@/app/types/historial";


export default function HistorialAdmin() {
  const [pedidos, setPedidos] = useState<HistorialPedido[]>([]);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    const { data } = await supabaseAdmin
      .from('historial_compras')
      .select('*, usuarios(nombre_usuario, correo)')
      .order('fecha', { ascending: false });
    setPedidos(data || []);
  };

  const cambiarEstado = async (id: number, nuevoEstado: HistorialPedido['estado']) => {
    await supabaseAdmin
      .from('historial_compras')
      .update({ estado: nuevoEstado })
      .eq('id', id);
    cargarPedidos();
  };

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