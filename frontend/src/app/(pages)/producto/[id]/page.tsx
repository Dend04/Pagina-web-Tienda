"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MainHeader } from "@/app/components/HeadersComponents";
import { Footer } from "@/app/components/Footer";
import { RatingStars } from "@/app/components/RatingStars";
import { QuantitySelector } from "@/app/components/QuantitySelector";
import {
  ShoppingCartIcon,
  ArrowLeftIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { ProductListItem } from "@/app/types/product";
import { useCartStore } from "../../../store/cartStore";

// Datos de ejemplo (después conectarás a Supabase)
const products: ProductListItem[] = [
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
  // ... otros productos
];

export default function ProductDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(product?.minQuantity || 1);
  const [isFavorito, setIsFavorito] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  // Obtener función addItem del store (una sola vez)
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    if (!product) return;
    const checkFavorito = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("/api/favoritos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.favoritos) {
          setIsFavorito(data.favoritos.includes(product.id));
        }
      } catch (error) {
        console.error("Error al verificar favoritos", error);
      }
    };
    checkFavorito();
  }, [product]);

  if (!product) {
    notFound();
  }

  const toggleFavorito = async () => {
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
        setIsFavorito(data.favorito);
      }
    } catch (error) {
      console.error("Error al cambiar favorito", error);
    } finally {
      setLoadingFav(false);
    }
  };

  const handleAddToCart = () => {
    // Verificar autenticación
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    addItem({
      producto_id: product.id,
      nombre: product.name,
      precio_unitario: product.price,
      cantidad: quantity,
      imagen: product.image,
      etiqueta: product.category, // ← importante para agrupar por categoría
    });

    // Opcional: mostrar notificación (puedes agregar Sonner después)
    console.log(`Agregado al carrito: ${quantity} x ${product.name}`);
  };

  return (
    <div className="min-h-screen bg-pucara-white flex flex-col">
      <MainHeader />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Botón volver */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-pucara-primary transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Seguir comprando</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Columna izquierda: imagen */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
            <div className="relative h-100 lg:h-125 w-full rounded-2xl overflow-hidden">
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
            {/* Categoría y favorito */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block bg-pucara-primary/10 text-pucara-primary px-4 py-1.5 rounded-full text-sm font-medium">
                {product.category}
              </span>
              <button
                onClick={toggleFavorito}
                disabled={loadingFav}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                aria-label={isFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                {isFavorito ? (
                  <HeartSolidIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6" />
                )}
              </button>
            </div>

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