"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí irá tu lógica de autenticación
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-pucara-white flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-pucara-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
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
                Bienvenido a <span className="text-pucara-primary">Pucara</span>
              </h1>
              <p className="mt-2 text-gray-600">
                Ingresa a tu cuenta para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Usuario o correo electrónico */}
              <div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pucara-primary/50 focus:border-pucara-primary transition-all duration-200 outline-none"
                  placeholder="Usuario o correo electrónico"
                />
              </div>

              {/* Contraseña con botón de mostrar/ocultar */}
              <div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pucara-primary/50 focus:border-pucara-primary transition-all duration-200 outline-none"
                    placeholder="Contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pucara-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Opciones: recordar sesión y olvidé contraseña */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-pucara-primary focus:ring-pucara-primary focus:ring-2 transition"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-pucara-primary transition-colors">
                    Recordar sesión
                  </span>
                </label>
                <Link
                  href="/recuperar-contrasena"
                  className="text-sm font-medium text-pucara-primary hover:text-pucara-accent hover:underline underline-offset-2 transition"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón de inicio de sesión */}
              <button
                type="submit"
                className="w-full bg-pucara-primary text-pucara-white py-3.5 px-4 rounded-xl hover:bg-pucara-accent transition-all duration-300 font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Iniciar sesión
              </button>

              {/* Enlace a registro */}
              <div className="text-center text-sm text-gray-600 pt-2">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/registro"
                  className="font-semibold text-pucara-primary hover:text-pucara-accent hover:underline underline-offset-2 transition"
                >
                  Crear cuenta
                </Link>
              </div>
            </form>

            {/* Términos y condiciones */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-center text-gray-400">
                Al iniciar sesión aceptas nuestros{" "}
                <Link href="/terminos" className="text-pucara-primary hover:underline">
                  Términos y Condiciones
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}