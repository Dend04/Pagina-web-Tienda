"use client";
import { useState } from "react";
import {
  AppLogo,
  HeaderMenu,
  headerNavigationItems,
  MainHeader,
} from "@/app/components/HeadersComponents";
import { ShoppingCartIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const ProductCard = ({ product }: { product: any }) => {
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
      x: ((y - centerY) / centerY) * 15, // Aumentamos la intensidad de rotación
      y: ((centerX - x) / centerX) * 15,
    });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotate({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      <div className="relative h-64 perspective-1000 overflow-hidden">
        <div
          className="relative h-full w-full transition-[transform,filter] duration-500 ease-out"
          style={{
            transform: isHovered
              ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.2)`
              : "rotateX(0) rotateY(0) scale(1)",
            filter: isHovered
              ? "drop-shadow(0 25px 25px rgba(0,0,0,0.3))"
              : "none",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform-gpu"
          />
          {/* Overlay de fondo que se desvanece */}
          <div
            className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>

        <span className="absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 text-xs rounded-full z-10 transition-opacity duration-300 hover:opacity-80">
          {product.category}
        </span>
      </div>

      <div className="p-4 transition-transform duration-300 group-hover:translate-y-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-indigo-600">
            ${product.price}
          </span>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-all duration-200 hover:scale-105">
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* Efecto de brillo al hacer hover */}
      {isHovered && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-8 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 animate-shine" />
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const products = [
    {
      id: 1,
      name: "Zapatillas Deportivas",
      price: 89.99,
      category: "Calzado",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "Reloj Inteligente",
      price: 199.99,
      category: "Tecnología",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Audífonos Inalámbricos",
      price: 149.99,
      category: "Audio",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Productos Destacados
          </h1>
          <span className="text-sm text-gray-500">
            Mostrando 12 de 36 productos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 bg-indigo-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Envío Gratis en Pedidos Mayores a $100
          </h2>
          <p className="text-gray-600">
            Garantía de devolución de 30 días • Soporte 24/7
          </p>
        </div>
      </main>
    </div>
  );
}
