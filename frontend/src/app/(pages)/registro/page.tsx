"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Paso0Rol from "@/app/components/registro/Paso0Rol";
import Paso1Nombre from "@/app/components/registro/Paso1Nombre";
import Paso2Email from "@/app/components/registro/Paso2Email";
import Paso3Password from "@/app/components/registro/Paso3Password";
import Paso4TelefonoDireccion from "@/app/components/registro/Paso4TelefonoDireccion";
import Paso5Foto from "@/app/components/registro/Paso5Foto";

// Nombres descriptivos de cada paso (ahora 6 pasos)
const stepNames = [
  "Tipo de cuenta",
  "Nombre de usuario",
  "Correo electrónico",
  "Contraseña",
  "Teléfono y dirección",
  "Foto de perfil",
];

export default function RegistroPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [formData, setFormData] = useState({
    rol: null as "cliente" | "comercial" | null,
    username: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
    foto: null as File | null,
  });

  const actualizarDatos = (nuevosDatos: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...nuevosDatos }));
  };

  const pasoSiguiente = () => {
    if (paso < 6) setPaso(paso + 1);
  };

  const pasoAnterior = () => {
    if (paso > 1) setPaso(paso - 1);
  };

  const irAPaso = (numPaso: number) => {
    if (numPaso < paso) {
      setPaso(numPaso);
    }
  };

  const handleSubmit = async (imagenUrl?: string) => {
    console.log("Enviando imagenUrl:", imagenUrl);
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rol: formData.rol,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono || null,
        direccion: formData.direccion || null,
        imagen: imagenUrl || null,
      }),
    });

    const data = await response.json();
    if (data.success) {
      setRegistroExitoso(true);
    } else {
      alert("Error: " + data.error);
    }
  };

  const renderPaso = () => {
    if (registroExitoso) {
      return (
        <div className="text-center space-y-6 py-8">
          <div className="inline-flex p-4 rounded-full bg-green-100 text-green-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-pucara-black">
            ¡Usuario creado exitosamente!
          </h2>
          <p className="text-gray-500">
            Tu cuenta ha sido registrada. Ahora puedes iniciar sesión.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 bg-pucara-primary text-pucara-white px-8 py-3 rounded-full hover:bg-pucara-accent transition-all shadow-md hover:shadow-lg font-medium"
          >
            Ir a iniciar sesión
          </button>
        </div>
      );
    }

    switch (paso) {
      case 1:
        return (
          <Paso0Rol
            valor={formData.rol}
            onChange={(rol) => actualizarDatos({ rol })}
            onSiguiente={pasoSiguiente}
          />
        );
      case 2:
        return (
          <Paso1Nombre
            valor={formData.username}
            onChange={(val) => actualizarDatos({ username: val })}
            onSiguiente={pasoSiguiente}
          />
        );
      case 3:
        return (
          <Paso2Email
            valor={formData.email}
            onChange={(val) => actualizarDatos({ email: val })}
            onAnterior={pasoAnterior}
            onSiguiente={pasoSiguiente}
          />
        );
      case 4:
        return (
          <Paso3Password
            valor={formData.password}
            onChange={(val) => actualizarDatos({ password: val })}
            onAnterior={pasoAnterior}
            onSiguiente={pasoSiguiente}
          />
        );
      case 5:
        return (
          <Paso4TelefonoDireccion
            telefono={formData.telefono}
            direccion={formData.direccion}
            onChange={(campo, val) => actualizarDatos({ [campo]: val })}
            onAnterior={pasoAnterior}
            onSiguiente={pasoSiguiente}
          />
        );
      case 6:
        return (
          <Paso5Foto
            foto={formData.foto}
            onChange={(file) => actualizarDatos({ foto: file })}
            onAnterior={pasoAnterior}
            onFinalizar={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-pucara-white flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {!registroExitoso && (
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const isActive = num === paso;
                  const isCompleted = num < paso;
                  const isClickable = num < paso;
                  const stepName = stepNames[num - 1];

                  return (
                    <div key={num} className="flex flex-col items-center flex-1">
                      <button
                        onClick={() => isClickable && irAPaso(num)}
                        disabled={!isClickable}
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                          ${isActive
                            ? "bg-pucara-primary text-pucara-white ring-4 ring-pucara-primary/20"
                            : isCompleted
                            ? "bg-pucara-primary/20 text-pucara-primary hover:bg-pucara-primary/30 cursor-pointer"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }
                          ${isClickable ? "hover:scale-105" : ""}
                        `}
                      >
                        {num}
                      </button>
                      {isActive && (
                        <span className="text-xs mt-2 text-pucara-primary font-medium text-center">
                          {stepName}
                        </span>
                      )}
                      {isCompleted && !isActive && (
                        <span className="text-xs mt-2 text-pucara-primary/60">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="relative mt-2">
                <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded"></div>
                <div
                  className="absolute top-0 left-0 h-1 bg-pucara-primary rounded transition-all duration-300"
                  style={{ width: `${((paso - 1) / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {renderPaso()}
        </div>
      </main>
    </div>
  );
}