"use client";

import { Product } from "@/app/types/product";
import Image from "next/image";
import Link from "next/link";
import { PencilIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <>
      {/* Vista de escritorio: tabla */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Valoración</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/producto/${product.id}`}
                    className="flex items-center gap-3"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PhotoIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-pucara-black">
                      {product.name}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-pucara-primary/10 text-pucara-primary rounded-full text-xs">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-pucara-primary">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.stock && product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock ?? 0} uds
                  </span>
                </td>
                <td className="px-4 py-3">
                  {product.rating ? `${product.rating.toFixed(1)} ★` : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 text-gray-500 hover:text-pucara-primary transition-colors"
                      title="Editar"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil: tarjetas */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-start gap-3">
              <Link
                href={`/producto/${product.id}`}
                className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/producto/${product.id}`}
                  className="font-semibold text-pucara-black hover:underline"
                >
                  {product.name}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-pucara-primary/10 text-pucara-primary px-2 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.rating ? `${product.rating} ★` : "Sin valorar"}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-bold text-pucara-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      product.stock && product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    Stock: {product.stock ?? 0}
                  </span>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 text-gray-500 hover:text-pucara-primary transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
