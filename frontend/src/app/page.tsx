"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MainHeader } from "@/app/components/HeadersComponents"; // Ajusta la ruta si es necesario

export default function LandingPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [skipWelcome, setSkipWelcome] = useState(false);

  // Redirigir si el usuario ya marcó "no mostrar"
  useEffect(() => {
    const savedPreference = localStorage.getItem("skipWelcome");
    if (savedPreference === "true") {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleSkipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const shouldSkip = e.target.checked;
    setSkipWelcome(shouldSkip);
    localStorage.setItem("skipWelcome", shouldSkip.toString());
  };

  // Optimización de imágenes Unsplash (webp, tamaño dinámico)
  const optimizeImage = (url: string, width: number) =>
    `${url}?auto=format&fit=crop&w=${width}&q=80&fm=webp`;

  const products = [
    {
      id: 1,
      name: "Electrónicos",
      image: optimizeImage(
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03",
        800
      ),
    },
    {
      id: 2,
      name: "Moda",
      image: optimizeImage(
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f",
        800
      ),
    },
    {
      id: 3,
      name: "Hogar",
      image: optimizeImage(
        "https://images.unsplash.com/photo-1556911220-bff31c812dba",
        800
      ),
    },
  ];

  const features = [
    {
      title: "Compra Segura",
      icon: "🔒",
      description:
        "Protegemos todas tus transacciones con encriptación de última generación",
    },
    {
      title: "Variedad",
      icon: "🛍️",
      description:
        "Descubre miles de productos en diferentes categorías",
    },
    {
      title: "Envíos Rápidos",
      icon: "🚚",
      description:
        "Recibe tus productos en tiempo récord con nuestro servicio premium",
    },
  ];

  return (
    <div className="min-h-screen bg-pucara-beige">
      {/* Header con logo Pucara */}
      <MainHeader />

      <main className="space-y-24 pb-20">
        {/* ---------- HERO ---------- */}
        <section className="pt-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-pucara-black mb-6 leading-tight"
            >
              La plataforma más segura para{" "}
              <span className="text-pucara-red">comprar y vender</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
            >
              Descubre una experiencia de compra única, respaldada por la calidad y tradición de Pucara.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src={optimizeImage(
                  "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fe",
                  1600
                )}
                alt="Plataforma segura Pucara"
                width={1600}
                height={900}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-pucara-red/20 via-transparent to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* ---------- CARACTERÍSTICAS ---------- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-pucara-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 w-12 h-0.5 bg-pucara-red/30 group-hover:w-20 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------- GALERÍA DE PRODUCTOS ---------- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-pucara-black mb-4">
              Productos Destacados
            </h2>
            <div className="w-24 h-1 bg-pucara-red mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transform transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pucara-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-block px-4 py-2 bg-white/90 backdrop-blur-sm text-pucara-red font-semibold rounded-full shadow-lg">
                    {product.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------- CTA Y TÉRMINOS ---------- */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-pucara-black mb-6">
              ¿Listo para empezar?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Únete a miles de compradores y vendedores que confían en Pucara.
            </p>

            <div className="space-y-6">
              {/* Checkbox de términos */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-pucara-red focus:ring-pucara-red focus:ring-2 transition"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-pucara-red transition-colors">
                    Acepto los{" "}
                    <Link
                      href="/terminos"
                      className="font-medium text-pucara-red hover:underline underline-offset-2"
                    >
                      Términos y Condiciones
                    </Link>
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    id="skipWelcome"
                    checked={skipWelcome}
                    onChange={handleSkipChange}
                    className="w-5 h-5 rounded border-gray-300 text-pucara-red focus:ring-pucara-red focus:ring-2 transition"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-pucara-red transition-colors">
                    No mostrar esta página nuevamente
                  </span>
                </label>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/login"
                  className="px-8 py-3.5 bg-pucara-red text-white rounded-full hover:bg-pucara-darkred transition-all duration-300 font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-1"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/dashboard"
                  className="px-8 py-3.5 border-2 border-pucara-red text-pucara-red rounded-full hover:bg-pucara-red/10 transition-all duration-300 font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-1"
                >
                  Ver Productos
                </Link>
              </div>
            </div>

            {/* Línea decorativa */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Al continuar, aceptas nuestras políticas de privacidad y uso.
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer minimalista (opcional, puedes moverlo a un componente aparte) */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
              <Link href="#" className="hover:text-pucara-red transition-colors">
                Privacidad
              </Link>
              <Link href="#" className="hover:text-pucara-red transition-colors">
                Términos
              </Link>
              <Link href="#" className="hover:text-pucara-red transition-colors">
                Ayuda
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}