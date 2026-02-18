"use client";

import { useState } from "react";

interface WhatsAppButtonProps {
  items: { name: string; quantity: number; price: number; category?: string }[];
  total: number;
  className?: string;
  disabled?: boolean;
  onPedidoCreado?: () => void;
}

export const WhatsAppButton = ({ items, total, className, disabled, onPedidoCreado }: WhatsAppButtonProps) => {
  const [enviando, setEnviando] = useState(false);

  const generarMensaje = (): string => {
    const lineas = items.map(i => 
      `• ${i.name} x ${i.quantity} = $${(i.price * i.quantity).toFixed(2)}`
    ).join("\n");
    return `Hola, quiero hacer el siguiente pedido:\n\n${lineas}\n\nTotal: $${total.toFixed(2)}`;
  };

  const handleClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch("/api/pedidos/pendientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({
            nombre: item.name,
            cantidad: item.quantity,
            precio: item.price,
            subtotal: item.price * item.quantity,
          })),
          total,
        }),
      });

      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(responseText || 'Error en el servidor');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar el pedido');
      }

      // ✅ Llamada correcta sin argumentos
      const mensaje = generarMensaje();
      window.open(`https://wa.me/5355220294?text=${encodeURIComponent(mensaje)}`, '_blank');

      if (onPedidoCreado) onPedidoCreado();
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "No se pudo procesar el pedido");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={enviando || disabled}
      className={className}
    >
      {enviando ? "Enviando..." : "Enviar pedido por WhatsApp"}
    </button>
  );
};