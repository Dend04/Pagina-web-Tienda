"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/app/store/cartStore";


export const CartIcon = () => {
  const totalItems = useCartStore((state) =>
    state.carrito.bolsas.reduce(
      (acc, bolsa) =>
        acc + bolsa.items.reduce((sum, item) => sum + item.cantidad, 0),
      0
    )
  );

  return (
    <Link
      href="/carrito"
      className="group relative p-2 text-gray-600 hover:text-pucara-primary transition-colors"
    >
      <ShoppingCartIcon className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-pucara-white bg-pucara-primary rounded-full min-w-5 h-5">
          {totalItems}
        </span>
      )}
      <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Ver carrito
      </span>
      <span className="sr-only">Carrito de compras</span>
    </Link>
  );
};