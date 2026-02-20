"use client";

import Link from "next/link";
import { ClockIcon } from "@heroicons/react/24/outline";

interface PendingOrdersIconProps {
  count: number;
}

export const PendingOrdersIcon = ({ count }: PendingOrdersIconProps) => {
  return (
    <Link
      href="/admin/pedidos"
      className="group relative p-2 text-gray-600 hover:text-pucara-primary transition-colors"
    >
      <ClockIcon className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-pucara-white bg-red-500 rounded-full min-w-5 h-5">
          {count}
        </span>
      )}
      <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Pedidos pendientes
      </span>
    </Link>
  );
};