"use client";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-indigo-600 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Bienvenido a StockPro</h1>
              <p className="mt-2 text-gray-600">Ingresa a tu cuenta</p>
            </div>

            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                    Recordar sesión
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/recuperar-contrasena"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
              >
                Iniciar sesión
              </button>

              <div className="mt-6 text-center text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/registro"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Crear cuenta
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}