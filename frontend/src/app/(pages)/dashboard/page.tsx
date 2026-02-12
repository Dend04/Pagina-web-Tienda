"use client";

import { MainHeader } from "@/app/components/HeadersComponents";
import { ProductCarousel } from "@/app/components/ProductCarousel";
import { Footer } from "@/app/components/Footer";
import { Product } from "@/app/types/product";

// Datos de ejemplo (después vendrán de una API o base de datos)
const featuredProducts: Product[] = [
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

const offerProducts: Product[] = [
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
  // ... más productos
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-pucara-beige flex flex-col">
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
            Mostrando {featuredProducts.length + offerProducts.length} de 36 productos
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

        {/* Banner promocional */}
        <section className="mt-16">
          <div className="bg-gradient-to-br from-pucara-red/10 to-pucara-beige rounded-3xl p-10 text-center border border-pucara-red/20 shadow-inner">
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
        </section>
      </main>

      <Footer />
    </div>
  );
}