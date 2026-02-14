"use client";

import { useState } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

interface Props {
  valor: string;
  onChange: (valor: string) => void;
  onAnterior: () => void;
  onSiguiente: () => void;
}

export default function Paso2Email({ valor, onChange, onAnterior, onSiguiente }: Props) {
  const [error, setError] = useState("");
  const [tocado, setTocado] = useState(false);

  const validarEmail = (email: string) => {
    if (!email.trim()) return "El correo es obligatorio";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Ingresa un correo válido (ejemplo@dominio.com)";
    return "";
  };

  const handleBlur = () => {
    setTocado(true);
    setError(validarEmail(valor));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    onChange(newVal);
    if (tocado) setError(validarEmail(newVal));
  };

  const handleSiguiente = () => {
    setTocado(true);
    const errorMsg = validarEmail(valor);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    onSiguiente();
  };

  const isEmailValid = valor && !error && tocado;

  return (
    <div className="space-y-8">
      {/* Cabecera con ícono y título */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-pucara-primary/10 text-pucara-primary">
          <EnvelopeIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl md:text-3xl font-light text-pucara-black">
          ¿Cuál es tu correo?
        </h2>
        <p className="text-gray-500 text-sm">
          Te enviaremos la confirmación de tu cuenta
        </p>
      </div>

      {/* Campo de entrada con label flotante */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="email"
            value={valor}
            onChange={handleChange}
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
                  : isEmailValid
                  ? "border-green-400 focus:border-green-600"
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
            Correo electrónico
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
            Ejemplo: nombre@dominio.com
          </p>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
        <button
          onClick={onAnterior}
          className="
            order-2 sm:order-1
            px-8 py-3 rounded-full
            border border-pucara-primary text-pucara-primary
            font-medium tracking-wide
            hover:bg-pucara-primary/10
            transition-all duration-300 ease-out
            flex items-center justify-center gap-2
          "
        >
          <svg
            className="w-4 h-4 rotate-180"
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
          <span>Anterior</span>
        </button>

        <button
          onClick={handleSiguiente}
          disabled={!!error || !valor.trim()}
          className="
            order-1 sm:order-2
            px-8 py-3 rounded-full
            bg-pucara-primary text-pucara-white
            font-medium tracking-wide
            shadow-md hover:shadow-lg
            transition-all duration-300 ease-out
            hover:bg-pucara-accent hover:-translate-y-1
            disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none
            flex items-center justify-center gap-2
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