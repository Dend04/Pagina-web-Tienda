"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { Product } from "@/app/types/product";


interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = card.offsetWidth / 2;
    const centerY = card.offsetHeight / 2;

    setRotate({
      x: ((y - centerY) / centerY) * 15,
      y: ((centerX - x) / centerX) * 15,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Agregar al carrito:", product.name);
    // Aquí irá la lógica del carrito
  };

  return (
    <Link href={`/producto/${product.id}`} className="block">
      <div
        className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setRotate({ x: 0, y: 0 });
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Imagen con perspectiva 3D */}
        <div className="relative h-64 w-full bg-gray-100/30 overflow-hidden">
          <div
            className="relative h-full w-full transition-[transform,filter] duration-700 ease-out"
            style={{
              transform: isHovered
                ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.08)`
                : "rotateX(0) rotateY(0) scale(1)",
              filter: isHovered
                ? "drop-shadow(0 20px 20px rgba(0,0,0,0.12))"
                : "none",
            }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transform-gpu"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
          <span className="absolute top-3 right-3 bg-pucara-primary text-pucara-white px-3 py-1 text-xs font-medium rounded-full z-10 shadow-md">
            {product.category}
          </span>
        </div>

        {/* Información del producto */}
        <div className="flex flex-col p-5 transition-all duration-300 group-hover:translate-y-[-2px]">
          <h3 className="text-lg font-semibold text-pucara-black mb-2 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-pucara-primary">
              ${product.price.toFixed(2)}
            </span>

            <div className="flex gap-2" onClick={(e) => e.preventDefault()}>

              <button
                onClick={handleAddToCart}
                className="inline-flex items-center gap-2 bg-pucara-primary text-pucara-white px-5 py-2 rounded-full hover:bg-pucara-accent transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              >
                <ShoppingCartIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Agregar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Brillo animado */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 animate-shine" />
          </div>
        )}
      </div>
    </Link>
  );
};