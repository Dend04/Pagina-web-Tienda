"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

interface ItemPedido {
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

interface PedidoPendiente {
  id: number;
  usuario_id: number;
  fecha: string;
  expira_en: string;
  items: ItemPedido[];
  total: number;
  estado: string;
  usuarios: { nombre_usuario: string; correo: string };
}

export default function AdminPedidosPage() {
  const [pendientes, setPendientes] = useState<PedidoPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    cargarPendientes();
  }, []);

  const cargarPendientes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch('/api/pedidos/pendientes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPendientes(data.pedidos || []);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const procesarPedido = async (id: number, accion: 'aceptar' | 'rechazar') => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/pedidos/pendientes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accion }),
      });

      if (res.ok) {
        cargarPendientes();
      } else {
        alert('Error al procesar el pedido');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pucara-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pucara-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pucara-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pucara-black">Pedidos pendientes</h1>
          <p className="text-gray-600 mt-2">Gestiona los pedidos que esperan confirmación</p>
        </div>

        {pendientes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay pedidos pendientes</p>
            <p className="text-gray-400 text-sm mt-1">Los pedidos aparecerán aquí cuando los clientes los envíen</p>
          </div>
        ) : (
          <>
            {/* Vista de escritorio: tabla */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expira</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendientes.map((p) => (
                    <React.Fragment key={p.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-pucara-black">{p.usuarios?.nombre_usuario || 'Usuario'}</div>
                          <div className="text-xs text-gray-500">{p.usuarios?.correo || ''}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{formatDateTime(p.fecha)}</td>
                        <td className="px-6 py-4 font-semibold text-pucara-primary">${p.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pendiente
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {new Date(p.expira_en).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleExpand(p.id)}
                            className="inline-flex items-center gap-1 text-pucara-primary hover:text-pucara-accent transition-colors text-sm font-medium"
                          >
                            {expandedRows.has(p.id) ? (
                              <>Ocultar <ChevronUpIcon className="w-4 h-4" /></>
                            ) : (
                              <>Ver {p.items.length} producto(s) <ChevronDownIcon className="w-4 h-4" /></>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => procesarPedido(p.id, 'aceptar')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                              title="Aceptar pedido"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                              <span>Aceptar</span>
                            </button>
                            <button
                              onClick={() => procesarPedido(p.id, 'rechazar')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                              title="Rechazar pedido"
                            >
                              <XCircleIcon className="w-4 h-4" />
                              <span>Rechazar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows.has(p.id) && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="text-sm">
                              <h4 className="font-medium text-pucara-black mb-2">Productos:</h4>
                              <ul className="space-y-1">
                                {p.items.map((item, i) => (
                                  <li key={i} className="flex justify-between text-gray-700">
                                    <span>{item.nombre} x {item.cantidad}</span>
                                    <span className="font-mono">${item.subtotal.toFixed(2)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista móvil/tablet: tarjetas */}
            <div className="lg:hidden space-y-4">
              {pendientes.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  {/* Cabecera con usuario y estado */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-pucara-black">{p.usuarios?.nombre_usuario || 'Usuario'}</p>
                      <p className="text-xs text-gray-500">{p.usuarios?.correo || ''}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pendiente
                    </span>
                  </div>

                  {/* Fila de fecha y expiración */}
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{formatDateTime(p.fecha)}</span>
                    <span className="text-gray-500">Expira: {new Date(p.expira_en).toLocaleTimeString()}</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700">Total:</span>
                    <span className="text-xl font-bold text-pucara-primary">${p.total.toFixed(2)}</span>
                  </div>

                  {/* Productos (expandibles) */}
                  <div className="mb-4">
                    <button
                      onClick={() => toggleExpand(p.id)}
                      className="inline-flex items-center gap-1 text-pucara-primary hover:text-pucara-accent transition-colors text-sm font-medium"
                    >
                      {expandedRows.has(p.id) ? (
                        <>Ocultar productos <ChevronUpIcon className="w-4 h-4" /></>
                      ) : (
                        <>Ver {p.items.length} producto(s) <ChevronDownIcon className="w-4 h-4" /></>
                      )}
                    </button>
                    {expandedRows.has(p.id) && (
                      <div className="mt-2 pl-2 border-l-2 border-pucara-primary/30">
                        <ul className="space-y-1 text-sm">
                          {p.items.map((item, i) => (
                            <li key={i} className="flex justify-between">
                              <span>{item.nombre} x {item.cantidad}</span>
                              <span className="font-mono">${item.subtotal.toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => procesarPedido(p.id, 'aceptar')}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      Aceptar
                    </button>
                    <button
                      onClick={() => procesarPedido(p.id, 'rechazar')}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      <XCircleIcon className="w-4 h-4" />
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}