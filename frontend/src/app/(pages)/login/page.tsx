"use client";

import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-pucara-beige flex flex-col">
  
      {/* Contenido principal centrado */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
            {/* Logo y título */}
            <div className="text-center mb-8">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image
                  src="/descarga (1).jpg"
                  alt="Pucara Logo"
                  fill
                  sizes="64px"
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-pucara-black">
                Bienvenido a <span className="text-pucara-red">Pucara</span>
              </h1>
              <p className="mt-2 text-gray-600">
                Ingresa a tu cuenta para continuar
              </p>
            </div>

            {/* Formulario */}
            <form className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-pucara-black/80 mb-1.5"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pucara-red/50 focus:border-pucara-red transition-all duration-200 outline-none"
                  placeholder="tu@ejemplo.com"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-pucara-black/80 mb-1.5"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pucara-red/50 focus:border-pucara-red transition-all duration-200 outline-none"
                  placeholder="••••••••"
                />
              </div>

              {/* Opciones extra: recordar y olvido */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-pucara-red focus:ring-pucara-red focus:ring-2 transition"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-pucara-red transition-colors">
                    Recordar sesión
                  </span>
                </label>

                <Link
                  href="/recuperar-contrasena"
                  className="text-sm font-medium text-pucara-red hover:text-pucara-darkred hover:underline underline-offset-2 transition"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón de inicio de sesión */}
              <button
                type="submit"
                className="w-full bg-pucara-red text-white py-3.5 px-4 rounded-xl hover:bg-pucara-darkred transition-all duration-300 font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Iniciar sesión
              </button>

              {/* Enlace a registro */}
              <div className="text-center text-sm text-gray-600 pt-2">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/registro"
                  className="font-semibold text-pucara-red hover:text-pucara-darkred hover:underline underline-offset-2 transition"
                >
                  Crear cuenta
                </Link>
              </div>
            </form>

            {/* Línea decorativa sutil */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-center text-gray-400">
                Al iniciar sesión aceptas nuestros{" "}
                <Link href="/terminos" className="text-pucara-red hover:underline">
                  Términos y Condiciones
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (mismo que en dashboard/landing) */}
      <footer className="bg-white border-t border-gray-200">
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