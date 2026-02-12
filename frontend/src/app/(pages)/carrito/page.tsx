"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

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
      name: "Producto 1",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03",
      price: 29.99,
      quantity: 2,
    },
    {
      id: 2,
      name: "Producto 2",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f",
      price: 19.99,
      quantity: 1,
    },
  ]);

  const calculateTotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8 space-x-2">
          <ShoppingCartIcon className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Tu Carrito</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
            <Link href="/productos" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Explorar productos →
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between pb-8 border-b">
                  <div className="flex space-x-6">
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-500">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-3 space-x-4">
                        <div className="flex items-center bg-gray-50 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg"
                          >
                            <MinusIcon className="h-4 w-4 text-gray-600" />
                          </button>
                          <span className="px-4 min-w-[40px] text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 rounded-r-lg"
                          >
                            <PlusIcon className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-6">
              <div className="flex justify-between text-xl font-medium text-gray-900">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              <div className="flex flex-col space-y-4">
                <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                  Finalizar Compra
                </button>
                <Link
                  href="/productos"
                  className="w-full text-center text-indigo-600 py-3 px-6 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}