"use client";

import { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";

interface Props {
  valor: string;
  onChange: (valor: string) => void;
  onSiguiente: () => void;
}

export default function Paso1Nombre({ valor, onChange, onSiguiente }: Props) {
  const [error, setError] = useState("");
  const [tocado, setTocado] = useState(false);

  const validar = (value: string) => {
    if (!value.trim()) return "El nombre de usuario es obligatorio";
    if (value.length < 3) return "Debe tener al menos 3 caracteres";
    if (!/^[a-zA-Z0-9_]+$/.test(value))
      return "Solo letras, números y guión bajo";
    return "";
  };

  const handleBlur = () => {
    setTocado(true);
    setError(validar(valor));
  };

  const handleSiguiente = () => {
    const errorMsg = validar(valor);
    if (errorMsg) {
      setError(errorMsg);
      setTocado(true);
      return;
    }
    onSiguiente();
  };

  return (
    <div className="space-y-8">
      {/* Cabecera con ícono y título */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-pucara-primary/10 text-pucara-primary">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl md:text-3xl font-light text-pucara-black">
          ¿Cómo te llamas?
        </h2>
        <p className="text-gray-500 text-sm">
          Este será tu identificador único en Pucara
        </p>
      </div>

      {/* Campo de entrada con diseño moderno */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={valor}
            onChange={(e) => {
              onChange(e.target.value);
              if (tocado) setError(validar(e.target.value));
            }}
            onBlur={handleBlur}
            placeholder=" "
            autoFocus
            className={`
              w-full px-4 pt-6 pb-2 text-lg
              border-b-2 bg-transparent
              transition-all duration-200 ease-out
              outline-none
              ${
                error && tocado
                  ? "border-red-400 focus:border-red-600"
                  : "border-gray-300 focus:border-pucara-primary"
              }
            `}
          />
          <label
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${
                valor
                  ? "text-xs top-1 text-pucara-primary"
                  : "text-gray-400 top-4 text-base"
              }
            `}
          >
            Nombre de usuario
          </label>
        </div>

        {/* Mensajes de ayuda/error */}
        {error && tocado ? (
          <p className="text-red-500 text-sm flex items-center gap-1 animate-fadeIn">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
            {error}
          </p>
        ) : (
          <p className="text-gray-400 text-xs flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-gray-400" />
            Mínimo 3 caracteres (letras, números, _)
          </p>
        )}
      </div>

      {/* Botón de acción */}
      <div className="pt-4">
        <button
          onClick={handleSiguiente}
          disabled={!!error || !valor.trim()}
          className="
            w-full sm:w-auto px-8 py-3 rounded-full
            bg-pucara-primary text-pucara-white
            font-medium tracking-wide
            shadow-md hover:shadow-lg
            transition-all duration-300 ease-out
            hover:bg-pucara-accent hover:-translate-y-1
            disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none
            flex items-center justify-center gap-2
            mx-auto sm:mx-0 sm:ml-auto
          "
        >
          <span>Continuar</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}