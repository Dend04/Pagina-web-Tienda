"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MainHeader } from "@/app/components/HeadersComponents";
import { Footer } from "@/app/components/Footer";
import { RatingStars } from "@/app/components/RatingStars";
import { QuantitySelector } from "@/app/components/QuantitySelector";
import { ShoppingCartIcon, ChatBubbleOvalLeftEllipsisIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Product } from "@/app/types/product";

// 📦 Datos de ejemplo (después conectarás a Supabase)
const products: Product[] = [
  {
    id: 1,
    name: "Zapatillas Deportivas",
    price: 89.99,
    category: "Calzado",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Zapatillas de última generación con amortiguación avanzada y diseño ergonómico. Ideales para correr, entrenar o uso diario. Suela antideslizante y materiales transpirables.",
    rating: 4.5,
    stock: 25,
    minQuantity: 1,
    maxQuantity: 5,
  },
  {
    id: 2,
    name: "Reloj Inteligente",
    price: 199.99,
    category: "Tecnología",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Reloj inteligente con monitor de frecuencia cardíaca, GPS, resistencia al agua y batería de larga duración. Compatible con iOS y Android.",
    rating: 4.2,
    stock: 12,
    minQuantity: 1,
    maxQuantity: 3,
  },
  {
    id: 3,
    name: "Audífonos Inalámbricos",
    price: 149.99,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Audífonos con cancelación de ruido activa, sonido de alta fidelidad y 30 horas de autonomía. Incluye estuche de carga inalámbrica.",
    rating: 4.8,
    stock: 30,
    minQuantity: 1,
    maxQuantity: 10,
  },
  {
    id: 4,
    name: "Mochila Ejecutiva",
    price: 79.99,
    category: "Accesorios",
    image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Mochila ejecutiva con compartimento acolchado para laptop de hasta 17 pulgadas, puerto USB integrado y materiales resistentes al agua.",
    rating: 4.3,
    stock: 18,
    minQuantity: 1,
    maxQuantity: 4,
  },
  {
    id: 5,
    name: "Laptop Ultradelgada",
    price: 1299.99,
    category: "Tecnología",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Laptop ultraligera con procesador Intel Core i7, 16GB RAM, SSD 512GB y pantalla 4K. Ideal para profesionales creativos.",
    rating: 4.7,
    stock: 8,
    minQuantity: 1,
    maxQuantity: 2,
  },
  {
    id: 6,
    name: "Smart TV 50\"",
    price: 499.99,
    category: "Electrónica",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Smart TV 4K Ultra HD con HDR, asistentes de voz integrados y plataforma inteligente. Diseño sin bordes.",
    rating: 4.4,
    stock: 15,
    minQuantity: 1,
    maxQuantity: 3,
  },
  {
    id: 7,
    name: "Auriculares Gaming",
    price: 89.99,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Auriculares gaming con sonido envolvente 7.1, micrófono retráctil y diadema acolchada. Compatible con PC, PlayStation y Xbox.",
    rating: 4.6,
    stock: 22,
    minQuantity: 1,
    maxQuantity: 5,
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(product?.minQuantity || 1);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    console.log(`Agregado al carrito: ${quantity} x ${product.name}`);
    // Aquí irá la lógica real del carrito
  };

  return (
    <div className="min-h-screen bg-pucara-white flex flex-col">
      <MainHeader />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Botón volver */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-pucara-primary transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Seguir comprando</span>
          </Link>
        </div>

        {/* Contenedor responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Columna izquierda: imagen */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
            <div className="relative h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Columna derecha: información */}
          <div className="flex flex-col">
            {/* Categoría */}
            <span className="inline-block bg-pucara-primary/10 text-pucara-primary px-4 py-1.5 rounded-full text-sm font-medium w-fit mb-4">
              {product.category}
            </span>

            {/* Nombre */}
            <h1 className="text-3xl md:text-4xl font-bold text-pucara-black mb-3">
              {product.name}
            </h1>

            {/* Precio y valoración */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="text-4xl font-bold text-pucara-primary">
                ${product.price.toFixed(2)}
              </div>
              <div className="flex items-center gap-3">
                <RatingStars rating={product.rating || 0} size={22} />
                <span className="text-sm text-gray-600">
                  ({product.rating?.toFixed(1) || "0.0"})
                </span>
              </div>
            </div>

            {/* Stock disponible */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock && product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm text-gray-700">
                {product.stock && product.stock > 0
                  ? `${product.stock} unidades disponibles`
                  : "Producto agotado"}
              </span>
            </div>

            {/* Descripción */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-pucara-black mb-2">
                Descripción
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || "Descripción no disponible."}
              </p>
            </div>

            {/* Selector de cantidad y límites */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                <QuantitySelector
                  min={product.minQuantity || 1}
                  max={product.maxQuantity || 99}
                  initial={quantity}
                  onChange={setQuantity}
                />
              </div>
              <div className="text-xs text-gray-500">
                {product.minQuantity && `Mín: ${product.minQuantity}`}
                {product.maxQuantity && product.minQuantity && " • "}
                {product.maxQuantity && `Máx: ${product.maxQuantity}`}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-3 bg-pucara-primary text-pucara-white py-4 px-6 rounded-xl hover:bg-pucara-accent transition-all duration-300 font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Agregar al carrito
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="block text-gray-500">Envío</span>
                  <span className="font-medium text-pucara-black">Gratis +$100</span>
                </div>
                <div>
                  <span className="block text-gray-500">Devolución</span>
                  <span className="font-medium text-pucara-black">30 días</span>
                </div>
                <div>
                  <span className="block text-gray-500">Garantía</span>
                  <span className="font-medium text-pucara-black">12 meses</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-pucara-black mb-6">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.filter(p => p.id !== product.id).slice(0, 4).map((p) => (
              <Link key={p.id} href={`/producto/${p.id}`} className="block">
                <div className="bg-white rounded-xl p-3 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="relative h-40 w-full rounded-lg overflow-hidden mb-3">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <h3 className="font-medium text-pucara-black line-clamp-1">{p.name}</h3>
                  <span className="text-pucara-primary font-bold">${p.price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}