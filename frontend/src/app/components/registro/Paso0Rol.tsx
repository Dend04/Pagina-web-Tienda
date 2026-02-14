"use client";

import { useState } from "react";
import { UserIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

interface Props {
  valor: "cliente" | "comercial" | null;
  onChange: (rol: "cliente" | "comercial") => void;
  onSiguiente: () => void;
}

export default function Paso0Rol({ valor, onChange, onSiguiente }: Props) {
  const [error, setError] = useState("");

  const handleSeleccion = (rol: "cliente" | "comercial") => {
    onChange(rol);
    setError("");
  };

  const handleSiguiente = () => {
    if (!valor) {
      setError("Por favor selecciona un tipo de cuenta");
      return;
    }
    onSiguiente();
  };

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-light text-pucara-black">
          ¿Qué tipo de cuenta deseas crear?
        </h2>
        <p className="text-gray-500 text-sm">
          Selecciona el tipo de usuario que serás en Pucara
        </p>
      </div>

      {/* Opciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cliente */}
        <button
          onClick={() => handleSeleccion("cliente")}
          className={`
            p-6 rounded-2xl border-2 transition-all duration-300 text-left
            ${valor === "cliente"
              ? "border-pucara-primary bg-pucara-primary/5 ring-2 ring-pucara-primary/20"
              : "border-gray-200 hover:border-pucara-primary/50 hover:bg-gray-50"
            }
          `}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${valor === "cliente" ? "bg-pucara-primary text-white" : "bg-gray-100 text-gray-600"}`}>
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-pucara-black">Cliente</h3>
              <p className="text-sm text-gray-500">Compra productos y disfruta de nuestras ofertas</p>
            </div>
          </div>
        </button>

        {/* Comercial */}
        <button
          onClick={() => handleSeleccion("comercial")}
          className={`
            p-6 rounded-2xl border-2 transition-all duration-300 text-left
            ${valor === "comercial"
              ? "border-pucara-primary bg-pucara-primary/5 ring-2 ring-pucara-primary/20"
              : "border-gray-200 hover:border-pucara-primary/50 hover:bg-gray-50"
            }
          `}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${valor === "comercial" ? "bg-pucara-primary text-white" : "bg-gray-100 text-gray-600"}`}>
              <ShoppingBagIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-pucara-black">Comercial</h3>
              <p className="text-sm text-gray-500">Vende tus productos y expande tu negocio</p>
            </div>
          </div>
        </button>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Botón siguiente */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={handleSiguiente}
          disabled={!valor}
          className="
            px-8 py-3 rounded-full
            bg-pucara-primary text-pucara-white
            font-medium
            shadow-md hover:shadow-lg
            transition-all duration-300
            hover:bg-pucara-accent hover:-translate-y-1
            disabled:opacity-40 disabled:pointer-events-none
            flex items-center justify-center gap-2
          "
        >
          <span>Continuar</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}