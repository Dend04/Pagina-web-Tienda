// app/carrito/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MainHeader } from "@/app/components/HeadersComponents";
import { Footer } from "@/app/components/Footer";
import { WhatsAppButton } from "@/app/components/WhatsAppButton";
import { TrashIcon, MinusIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "../../store/cartStore";

export default function CartPage() {
  const { carrito, removeItem, updateItemQuantity, removeBolsa } = useCartStore();
  const [expandedBags, setExpandedBags] = useState<Set<string>>(new Set());

  // Inicializar: expandir la última bolsa (si existe)
  useEffect(() => {
    if (carrito.bolsas.length > 0) {
      const lastBag = carrito.bolsas[carrito.bolsas.length - 1];
      setExpandedBags(new Set([lastBag.etiqueta]));
    } else {
      setExpandedBags(new Set());
    }
  }, [carrito.bolsas]); // Se actualiza si cambian las bolsas

  const toggleBag = (etiqueta: string) => {
    setExpandedBags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(etiqueta)) {
        newSet.delete(etiqueta);
      } else {
        newSet.add(etiqueta);
      }
      return newSet;
    });
  };

  if (carrito.bolsas.length === 0) {
    return (
      <div className="min-h-screen bg-pucara-white flex flex-col">
        <MainHeader />
        <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 text-center">
          <p className="text-gray-500">Tu carrito está vacío</p>
          <Link href="/" className="text-pucara-primary hover:underline">
            Explorar productos
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Preparar items para WhatsAppButton (aplanar todos los items de todas las bolsas)
  const allItems = carrito.bolsas.flatMap(bolsa =>
    bolsa.items.map(item => ({
      name: item.nombre,
      quantity: item.cantidad,
      price: item.precio_unitario,
      category: bolsa.etiqueta, // opcional
    }))
  );

  return (
    <div className="min-h-screen bg-pucara-white flex flex-col">
      <MainHeader />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>

        <div className="space-y-4">
          {carrito.bolsas.map((bolsa, index) => {
            const isExpanded = expandedBags.has(bolsa.etiqueta);
            const isLast = index === carrito.bolsas.length - 1;

            return (
              <div
                key={bolsa.etiqueta}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all"
              >
                {/* Encabezado de la bolsa - clickeable para expandir/colapsar */}
                <div
                  className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleBag(bolsa.etiqueta)}
                >
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-pucara-primary">
                      {bolsa.etiqueta}
                    </h2>
                    <span className="text-sm text-gray-500">
                      ({bolsa.items.length} {bolsa.items.length === 1 ? 'producto' : 'productos'})
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      Total: <span className="text-pucara-primary">${bolsa.total.toFixed(2)}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBolsa(bolsa.etiqueta);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Eliminar bolsa"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    {isExpanded ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Contenido de la bolsa - con animación de altura */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <div className="p-6 pt-0 border-t border-gray-100">
                    {bolsa.items.map((item) => (
                      <div
                        key={item.producto_id}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-b border-gray-100 last:border-0"
                      >
                        {/* Imagen */}
                        <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.imagen || '/placeholder.jpg'}
                            alt={item.nombre}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {/* Info */}
                        <div className="flex-1">
                          <h3 className="font-medium text-pucara-black">{item.nombre}</h3>
                          <p className="text-pucara-primary font-semibold">${item.precio_unitario.toFixed(2)} c/u</p>
                        </div>
                        {/* Cantidad */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateItemQuantity(bolsa.etiqueta, item.producto_id, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                            className="p-1 text-gray-500 hover:text-pucara-primary disabled:opacity-40 border rounded-full"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.cantidad}</span>
                          <button
                            onClick={() => updateItemQuantity(bolsa.etiqueta, item.producto_id, item.cantidad + 1)}
                            className="p-1 text-gray-500 hover:text-pucara-primary border rounded-full"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Subtotal */}
                        <div className="text-right font-semibold min-w-20">
                          <span className="text-sm text-gray-500">Subtotal: </span>
                          <span className="text-pucara-primary">${item.subtotal.toFixed(2)}</span>
                        </div>
                        {/* Eliminar item */}
                        <button
                          onClick={() => removeItem(bolsa.etiqueta, item.producto_id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Eliminar producto"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen general */}
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold">
              Total general: <span className="text-pucara-primary">${carrito.total_general.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-6 py-3 border border-pucara-primary text-pucara-primary rounded-full hover:bg-pucara-primary/10 transition-colors font-medium"
              >
                Seguir comprando
              </Link>
              <WhatsAppButton
                items={allItems}
                total={carrito.total_general}
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}