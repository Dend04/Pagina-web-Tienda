"use client";

import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

interface WhatsAppButtonProps {
  items: { name: string; quantity: number; price: number }[];
  total: number;
  className?: string;
}

// Número de WhatsApp de Pucara (cambia por el tuyo)
const WHATSAPP_NUMBER = "5355220294";

export const WhatsAppButton = ({ items, total, className = "" }: WhatsAppButtonProps) => {
  const handleClick = () => {
    const itemsList = items
      .map(
        (item) =>
          `🛍️ *${item.name}* - Cantidad: ${item.quantity} - Precio: $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const message = `
¡Hola! Quiero realizar el siguiente pedido:

${itemsList}

💵 *Total: $${total.toFixed(2)}*

¿Pueden confirmar disponibilidad y el costo de envío? Gracias.
    `.trim();

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-3 bg-green-600 text-white py-3 px-6 rounded-full hover:bg-green-700 transition-all duration-300 font-medium shadow-md hover:shadow-xl transform hover:-translate-y-0.5 ${className}`}
    >
      <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
      Comprar por WhatsApp
    </button>
  );
};