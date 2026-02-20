"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { ProductCarousel } from "@/app/components/ProductCarousel";
import { ProductCard } from "@/app/components/ProductCard";
import { Footer } from "@/app/components/Footer";
import { ProductListItem } from "./types/product";
import { MainHeader } from "./components/header";

// Datos de ejemplo para los carruseles (podrían venir también de la API)
const featuredProducts: ProductListItem[] = [
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
  {
    id: 4,
    name: "Mochila Ejecutiva",
    price: 79.99,
    category: "Accesorios",
    image:
      "https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Laptop Ultradelgada",
    price: 1299.99,
    category: "Tecnología",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

const offerProducts: ProductListItem[] = [
  {
    id: 6,
    name: "Smart TV 50\"",
    price: 499.99,
    category: "Electrónica",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    name: "Auriculares Gaming",
    price: 89.99,
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1599669454699-248893623440?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

// Función para obtener productos (usada por React Query)
const fetchProducts = async ({ pageParam = 1 }) => {
  const res = await fetch(`/api/products?page=${pageParam}&limit=12`);
  if (!res.ok) {
    throw new Error('Error al cargar productos');
  }
  return res.json();
};

export default function Dashboard() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Suponiendo que la API devuelve un objeto con { products, nextPage } o similar
      // Ajusta según la estructura de tu API
      return lastPage.nextPage ?? undefined;
    },
  });

  // Referencia para el último elemento (intersection observer)
  const { ref, inView } = useInView();

  // Cargar más productos cuando el último elemento entra en vista
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Aplanar los productos de todas las páginas
  const allProducts = data?.pages.flatMap(page => page.products) ?? [];

  return (
    <div className="min-h-screen bg-pucara-white flex flex-col">
      <MainHeader />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Título principal */}
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
            Mostrando {allProducts.length} productos
          </span>
        </div>

        {/* Carrusel de productos destacados */}
        <section className="mb-16">
          <ProductCarousel products={featuredProducts} title="Lo más vendido" />
        </section>

        {/* Carrusel de ofertas */}
        <section className="mb-16">
          <ProductCarousel products={offerProducts} title="Ofertas especiales" />
        </section>

        {/* Grid de todos los productos */}
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-pucara-black mb-6">
            Todos los productos
          </h2>

          {status === 'pending' ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pucara-primary"></div>
            </div>
          ) : status === 'error' ? (
            <p className="text-center text-red-500 py-12">Error: {error.message}</p>
          ) : allProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No hay productos disponibles</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {allProducts.map((product, index) => {
                  // Agregar ref al último producto para observar
                  if (index === allProducts.length - 1) {
                    return (
                      <div ref={ref} key={product.id}>
                        <ProductCard product={product} />
                      </div>
                    );
                  } else {
                    return <ProductCard key={product.id} product={product} />;
                  }
                })}
              </div>

              {isFetchingNextPage && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pucara-primary"></div>
                </div>
              )}

              {!hasNextPage && allProducts.length > 0 && (
                <p className="text-center text-gray-500 py-8">No hay más productos</p>
              )}
            </>
          )}
        </section>

        {/* Banner promocional */}
        <section className="mt-16">
          <div className="bg-linear-to-br from-pucara-primary/10 to-pucara-white rounded-3xl p-10 text-center border border-pucara-primary/20 shadow-inner">
            <h2 className="text-3xl md:text-4xl font-bold text-pucara-black mb-4">
              Envío Gratis en Pedidos Mayores a $100
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              Garantía de devolución de 30 días • Soporte 24/7
            </p>
            <button className="bg-pucara-primary text-pucara-white px-10 py-4 rounded-full hover:bg-pucara-accent transition-all duration-300 text-base font-semibold shadow-md hover:shadow-xl transform hover:scale-105">
              Ver condiciones
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}