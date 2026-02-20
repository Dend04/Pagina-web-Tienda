"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { ProductListItem } from "../types/product";
import { useCartStore } from "../store/cartStore";
import { useFavoritosStore } from "../store/favoritosStore";

interface ProductCardProps {
  product: ProductListItem;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { favoritos, toggleFavorito } = useFavoritosStore();
  const isFavorito = favoritos.includes(product.id);

  const handleToggleFavorito = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoadingFav(true);
    try {
      const res = await fetch("/api/favoritos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ producto_id: product.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toggleFavorito(product.id); // Actualiza el store local
      } else {
        console.error("Error al cambiar favorito", data.error);
      }
    } catch (error) {
      console.error("Error al cambiar favorito", error);
    } finally {
      setLoadingFav(false);
    }
  };

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

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    addItem({
      etiqueta: product.category,
      producto_id: product.id,
      nombre: product.name,
      precio_unitario: product.price,
      cantidad: 1,
      imagen: product.image,
    });
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
        {/* Imagen con corazón */}
        <div className="relative h-40 sm:h-64 w-full bg-gray-100/30 overflow-hidden">
          <button
            onClick={handleToggleFavorito}
            disabled={loadingFav}
            className="absolute top-2 right-2 z-20 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors disabled:opacity-50"
            aria-label={isFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            {isFavorito ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>

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
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transform-gpu"
            />
            <div
              className={`absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
        </div>

        {/* Información */}
        <div className="flex flex-col p-3 sm:p-5 transition-all duration-300 group-hover:-translate-y-0.5">
          <div className="flex items-center justify-between gap-2 mb-1 sm:mb-2">
            <h3 className="text-sm sm:text-lg font-semibold text-pucara-black line-clamp-1">
              {product.name}
            </h3>
            <span className="text-xs bg-pucara-primary/10 text-pucara-primary px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
              {product.category}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xl sm:text-2xl font-bold text-pucara-primary">
              ${product.price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              className="inline-flex items-center gap-1 sm:gap-2 bg-pucara-primary text-pucara-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full hover:bg-pucara-accent transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
            >
              <ShoppingCartIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Agregar</span>
            </button>
          </div>
        </div>

        {/* Brillo animado */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-50 animate-shine" />
          </div>
        )}
      </div>
    </Link>
  );
};