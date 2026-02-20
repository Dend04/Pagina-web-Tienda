"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Footer } from "@/app/components/Footer";
import { 
  PencilIcon, 
  KeyIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  UserIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";
import { MainHeader } from "@/app/components/header";

interface UserData {
  id: number;
  nombre_usuario: string;
  correo: string;
  rol: string;
  telefono?: string;
  direccion?: string;
  imagen?: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      router.push("/login");
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("Error parsing user", e);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pucara-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-pucara-primary/20 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-pucara-white flex flex-col">
      <MainHeader />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Tarjeta principal del perfil */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Cabecera con avatar y datos básicos */}
          <div className="relative h-32 bg-linear-to-r from-pucara-primary/20 to-pucara-blue/20">
            <div className="absolute -bottom-12 left-8 flex items-end gap-6">
              <div className="relative w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                {user.imagen ? (
                  <Image
                    src={user.imagen}
                    alt={user.nombre_usuario}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-pucara-primary/10 flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-pucara-primary/40" />
                  </div>
                )}
              </div>
              <div className="mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-pucara-black">
                  {user.nombre_usuario}
                </h1>
                <p className="text-gray-500 flex items-center gap-1">
                  <BriefcaseIcon className="w-4 h-4" />
                  {user.rol === "comercial" ? "Comercial" : "Cliente"}
                </p>
              </div>
            </div>
          </div>

          {/* Contenido en dos columnas */}
          <div className="pt-16 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Columna izquierda: Información de contacto */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-pucara-black flex items-center gap-2">
                  <EnvelopeIcon className="w-5 h-5 text-pucara-primary" />
                  Información de contacto
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Correo electrónico</p>
                      <p className="text-pucara-black">{user.correo}</p>
                    </div>
                  </div>
                  {user.telefono && (
                    <div className="flex items-start gap-3">
                      <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p className="text-pucara-black">{user.telefono}</p>
                      </div>
                    </div>
                  )}
                  {user.direccion && (
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Dirección</p>
                        <p className="text-pucara-black">{user.direccion}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna derecha: Actividad / Acciones */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-pucara-black flex items-center gap-2">
                  <KeyIcon className="w-5 h-5 text-pucara-primary" />
                  Acciones de cuenta
                </h2>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                    <span className="flex items-center gap-3">
                      <PencilIcon className="w-5 h-5 text-gray-500 group-hover:text-pucara-primary" />
                      <span className="font-medium text-gray-700 group-hover:text-pucara-primary">Editar perfil</span>
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-pucara-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                    <span className="flex items-center gap-3">
                      <KeyIcon className="w-5 h-5 text-gray-500 group-hover:text-pucara-primary" />
                      <span className="font-medium text-gray-700 group-hover:text-pucara-primary">Cambiar contraseña</span>
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-pucara-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Estadísticas rápidas (ejemplo) */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Actividad reciente</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <p className="text-2xl font-bold text-pucara-primary">0</p>
                      <p className="text-xs text-gray-500">Compras</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <p className="text-2xl font-bold text-pucara-primary">0</p>
                      <p className="text-xs text-gray-500">Ventas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}