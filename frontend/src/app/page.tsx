"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [skipWelcome, setSkipWelcome] = useState(false);

  // Efecto para redirigir si hay preferencia guardada
  useEffect(() => {
    const savedPreference = localStorage.getItem("skipWelcome");
    if (savedPreference === "true") {
      window.location.href = "/dashboard";
    }
  }, []);

  // Manejar cambio en el checkbox
  const handleSkipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const shouldSkip = e.target.checked;
    setSkipWelcome(shouldSkip);
    localStorage.setItem("skipWelcome", shouldSkip.toString());
  };

  // Optimizar URLs de imágenes
  const optimizeImage = (url: string, width: number) => 
    `${url}?auto=format&fit=crop&w=${width}&q=80&fm=webp`;

  const products = [
    {
      id: 1,
      name: "Electrónicos",
      image: optimizeImage("https://images.unsplash.com/photo-1550009158-9ebf69173e03", 800),
    },
    {
      id: 2,
      name: "Moda",
      image: optimizeImage("https://images.unsplash.com/photo-1489987707025-afc232f7ea0f", 800),
    },
    {
      id: 3,
      name: "Hogar",
      image: optimizeImage("https://images.unsplash.com/photo-1556911220-bff31c812dba", 800),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="space-y-20 pb-20">
        {/* Sección Hero */}
        <section className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            >
              La plataforma más segura para comprar y vender productos
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto"
            >
              <Image
                src={optimizeImage("https://images.unsplash.com/photo-1526948128573-703ee1aeb6fe", 1600)}
                alt="Plataforma segura"
                width={1600}
                height={900}
                className="rounded-2xl shadow-xl"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* Sección de características */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Compra Segura", icon: "🔒", description: "Protegemos todas tus transacciones con encriptación de última generación" },
              { title: "Variedad", icon: "🛍️", description: "Descubre miles de productos en diferentes categorías" },
              { title: "Envíos Rápidos", icon: "🚚", description: "Recibe tus productos en tiempo récord con nuestro servicio premium" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Galería de productos */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Productos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group overflow-hidden rounded-xl"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={800}
                  height={600}
                  className="w-full h-64 object-cover transform transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xl font-medium">{product.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sección de CTA y Términos */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Acepto los{" "}
                  <Link href="/terminos" className="text-indigo-600 hover:underline">
                    Términos y Condiciones
                  </Link>
                </label>
              </div>

              <div className="flex items-center justify-center gap-2">
                <input
                  type="checkbox"
                  id="skipWelcome"
                  checked={skipWelcome}
                  onChange={handleSkipChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                />
                <label htmlFor="skipWelcome" className="text-sm text-gray-600">
                  No mostrar esta página nuevamente
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/dashboard"
                className="inline-block px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
              >
                Ver Productos
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}