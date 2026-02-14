"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const nombre_usuario = formData.get("nombre_usuario") as string;
    const contrasena = formData.get("contrasena") as string;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_usuario, contrasena }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.error || "Credenciales inválidas");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <div className="min-h-screen bg-pucara-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Columna izquierda - Branding (solo en pantallas grandes) */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pucara-primary/5 to-pucara-blue/5 p-12 flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src="/descarga (1).jpg"
                  alt="Pucara Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-4xl md:text-4xl font-extrabold">
                <span className="bg-gradient-to-r from-pucara-primary to-pucara-blue bg-clip-text text-transparent">
                  IPSA Pucara SA
                </span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-4">
              Nuestra tienda online para compra de productos
            </p>
            <div className="w-full max-w-md h-1 bg-gradient-to-r from-pucara-primary to-pucara-blue rounded-full"></div>
          </div>

          {/* Columna derecha - Formulario */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12">
            <div className="max-w-md mx-auto">
              {/* Versión móvil del branding */}
              <div className="lg:hidden text-center mb-8">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image
                    src="/descarga (1).jpg"
                    alt="Pucara Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <h2 className="text-3xl font-bold text-pucara-black">
                  <span className="bg-gradient-to-r from-pucara-primary to-pucara-blue bg-clip-text text-transparent">
                    IPSA Pucara SA
                  </span>
                </h2>
                <p className="mt-2 text-gray-600">
                  Nuestra tienda online para compra de productos
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    id="nombre_usuario"
                    name="nombre_usuario"
                    type="text"
                    autoComplete="username"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pucara-primary/50 focus:border-pucara-primary transition-all duration-200 outline-none"
                    placeholder="Usuario o correo electrónico"
                  />
                </div>

                <div className="relative">
                  <input
                    id="contrasena"
                    name="contrasena"
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
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

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-pucara-primary text-pucara-white py-3.5 px-4 rounded-xl hover:bg-pucara-accent transition-all duration-300 font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Iniciar sesión
                </button>

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
        </div>
      </div>
    </div>
  );
}