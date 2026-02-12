"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { MainHeader } from "@/app/components/HeadersComponents"; // Ajusta la ruta

// ------------------------------------------------------------
// Tipo del producto (eliminado any)
// ------------------------------------------------------------
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

// ------------------------------------------------------------
// Componente ProductCard (efecto 3D, tipado, <Image />)
// ------------------------------------------------------------
const ProductCard = ({ product }: { product: Product }) => {
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

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotate({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Imagen con perspectiva 3D */}
      <div className="relative h-64 w-full bg-pucara-beige/30 overflow-hidden">
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
            priority={false}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
        <span className="absolute top-3 right-3 bg-pucara-red text-white px-3 py-1 text-xs font-medium rounded-full z-10 shadow-md">
          {product.category}
        </span>
      </div>

      {/* Información del producto */}
      <div className="flex flex-col p-5 transition-all duration-300 group-hover:translate-y-[-2px]">
        <h3 className="text-lg font-semibold text-pucara-black mb-2 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-pucara-red">
            ${product.price.toFixed(2)}
          </span>
          <button className="inline-flex items-center gap-2 bg-pucara-red text-white px-5 py-2 rounded-full hover:bg-pucara-darkred transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md">
            <ShoppingCartIcon className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </div>

      {/* Brillo animado */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 animate-shine" />
        </div>
      )}
    </div>
  );
};

// ------------------------------------------------------------
// Página Dashboard (solo contenido principal)
// ------------------------------------------------------------
export default function Dashboard() {
  const products: Product[] = [
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
    <div className="min-h-screen bg-pucara-beige">
      {/* Header importado desde el componente separado */}
      <MainHeader />

      {/* Contenido principal */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Título y contador */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-pucara-black mb-2">
              Productos Destacados
            </h1>
            <p className="text-gray-600 text-lg">
              Descubre nuestra colección exclusiva con diseño y tradición
            </p>
          </div>
          <span className="mt-3 sm:mt-0 text-sm text-gray-600 bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
            Mostrando {products.length} de 36 productos
          </span>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Banner promocional */}
        <div className="mt-20 bg-gradient-to-br from-pucara-red/10 to-pucara-beige rounded-3xl p-10 text-center border border-pucara-red/20 shadow-inner">
          <h2 className="text-3xl md:text-4xl font-bold text-pucara-black mb-4">
            Envío Gratis en Pedidos Mayores a $100
          </h2>
          <p className="text-gray-700 text-lg mb-8">
            Garantía de devolución de 30 días • Soporte 24/7
          </p>
          <button className="bg-pucara-red text-white px-10 py-4 rounded-full hover:bg-pucara-darkred transition-all duration-300 text-base font-semibold shadow-md hover:shadow-xl transform hover:scale-105">
            Ver condiciones
          </button>
        </div>
      </main>

      {/* Footer (puedes separarlo después si quieres) */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative w-6 h-6 mr-2">
                <Image
                  src="/descarga (1).jpg"
                  alt="Pucara"
                  fill
                  sizes="24px"
                  className="object-contain"
                />
              </div>
              <span>© 2026 Pucara Store. Todos los derechos reservados.</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-pucara-red transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-pucara-red transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-pucara-red transition-colors">
                Ayuda
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}