"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MainHeader } from "@/app/components/HeadersComponents";
import { Footer } from "@/app/components/Footer";
import { WhatsAppButton } from "@/app/components/WhatsAppButton";
import { ShoppingCartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Zapatillas Deportivas",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 89.99,
      quantity: 1,
    },
    {
      id: 2,
      name: "Reloj Inteligente",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 199.99,
      quantity: 1,
    },
  ]);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-pucara-white flex flex-col">
      <MainHeader />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCartIcon className="h-8 w-8 text-pucara-primary" />
          <h1 className="text-3xl font-bold text-pucara-black">Tu Carrito</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-pucara-primary hover:text-pucara-accent font-medium transition-colors"
            >
              Explorar productos →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            {/* Lista de productos */}
            <div className="space-y-6 divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 first:pt-0"
                >
                  <div className="flex items-center gap-4">
                    {/* Imagen */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                    </div>
                    {/* Info */}
                    <div className="flex flex-col">
                      <h3 className="text-lg font-medium text-pucara-black">
                        {item.name}
                      </h3>
                      <p className="text-pucara-primary font-semibold mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0">
                    {/* Selector de cantidad (estilo Pucara) */}
                    <div className="flex items-center border border-gray-200 rounded-full bg-white overflow-hidden shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-2 text-gray-600 hover:bg-pucara-primary/10 hover:text-pucara-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium text-pucara-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 text-gray-600 hover:bg-pucara-primary/10 hover:text-pucara-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="text-lg font-semibold text-pucara-black min-w-20 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen y acciones */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-xl font-semibold text-pucara-black">
                  Total:{" "}
                  <span className="text-2xl text-pucara-primary">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 border border-pucara-primary text-pucara-primary rounded-full hover:bg-pucara-primary/10 transition-colors font-medium text-center"
                  >
                    Seguir comprando
                  </Link>
                  <WhatsAppButton
                    items={cartItems.map(({ name, quantity, price }) => ({
                      name,
                      quantity,
                      price,
                    }))}
                    total={calculateTotal()}
                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}