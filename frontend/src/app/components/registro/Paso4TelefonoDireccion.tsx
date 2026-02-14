"use client";

import { useState } from "react";
import { PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

interface Props {
  telefono: string;
  direccion: string;
  onChange: (campo: "telefono" | "direccion", valor: string) => void;
  onAnterior: () => void;
  onSiguiente: () => void;
}

export default function Paso4TelefonoDireccion({
  telefono,
  direccion,
  onChange,
  onAnterior,
  onSiguiente,
}: Props) {
  const [tocadoTelefono, setTocadoTelefono] = useState(false);
  const [errorTelefono, setErrorTelefono] = useState("");

  // Función para limpiar el teléfono (quitar todo excepto dígitos)
  const limpiarTelefono = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  // Validar que solo se ingresen dígitos y los caracteres especiales permitidos
  const validarFormato = (value: string): boolean => {
    // Permite dígitos, guiones, paréntesis, más y espacios
    return /^[\d\-+()\s]*$/.test(value);
  };

  const validarTelefonoCompleto = (value: string): string => {
    if (!value) return ""; // opcional
    const soloDigitos = limpiarTelefono(value);
    if (soloDigitos.length < 7) return "El teléfono debe tener al menos 7 dígitos";
    if (soloDigitos.length > 15) return "El teléfono no puede tener más de 15 dígitos";
    return "";
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!validarFormato(val)) return; // ignora caracteres no permitidos
    onChange("telefono", val);
    if (tocadoTelefono) {
      setErrorTelefono(validarTelefonoCompleto(val));
    }
  };

  const handleTelefonoBlur = () => {
    setTocadoTelefono(true);
    setErrorTelefono(validarTelefonoCompleto(telefono));
  };

  const handleDireccionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("direccion", e.target.value);
  };

  const handleSiguiente = () => {
    const error = validarTelefonoCompleto(telefono);
    if (error) {
      setErrorTelefono(error);
      setTocadoTelefono(true);
      return;
    }
    onSiguiente();
  };

  return (
    <div className="space-y-8">
      {/* Cabecera con ícono */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-pucara-primary/10 text-pucara-primary">
          <MapPinIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl md:text-3xl font-light text-pucara-black">
          Información de contacto
        </h2>
        <p className="text-gray-500 text-sm">
          Para que podamos comunicarnos contigo
        </p>
      </div>

      <div className="space-y-6">
        {/* Teléfono */}
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400">
              <PhoneIcon className="w-5 h-5" />
            </div>
            <input
              type="tel"
              id="telefono"
              value={telefono}
              onChange={handleTelefonoChange}
              onBlur={handleTelefonoBlur}
              placeholder=" "
              className={`
                w-full pl-8 pt-6 pb-2 text-lg
                border-b-2 bg-transparent
                transition-all duration-200 ease-out
                outline-none
                ${
                  errorTelefono && tocadoTelefono
                    ? "border-red-400 focus:border-red-600"
                    : telefono && !errorTelefono
                    ? "border-green-500 focus:border-pucara-primary"
                    : "border-gray-300 focus:border-pucara-primary"
                }
              `}
            />
            <label
              htmlFor="telefono"
              className={`
                absolute left-8 transition-all duration-200 pointer-events-none
                ${
                  telefono
                    ? "text-xs top-1 text-pucara-primary"
                    : "text-gray-400 top-4 text-base"
                }
              `}
            >
              Teléfono
            </label>
          </div>
          {errorTelefono && tocadoTelefono && (
            <p className="text-red-500 text-sm flex items-center gap-1 animate-fadeIn">
              <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
              {errorTelefono}
            </p>
          )}
          {!errorTelefono && telefono && !tocadoTelefono && (
            <p className="text-gray-400 text-xs flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-gray-400" />
              Puedes usar dígitos, guiones, paréntesis, + y espacios
            </p>
          )}
        </div>

        {/* Dirección */}
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400">
              <MapPinIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="direccion"
              value={direccion}
              onChange={handleDireccionChange}
              placeholder=" "
              className="
                w-full pl-8 pt-6 pb-2 text-lg
                border-b-2 border-gray-300 bg-transparent
                transition-all duration-200 ease-out
                focus:border-pucara-primary outline-none
              "
            />
            <label
              htmlFor="direccion"
              className={`
                absolute left-8 transition-all duration-200 pointer-events-none
                ${
                  direccion
                    ? "text-xs top-1 text-pucara-primary"
                    : "text-gray-400 top-4 text-base"
                }
              `}
            >
              Dirección
            </label>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="pt-4 flex justify-between gap-3">
        <button
          onClick={onAnterior}
          className="
            px-6 py-3 rounded-full
            border border-pucara-primary text-pucara-primary
            font-medium
            hover:bg-pucara-primary/10
            transition-all duration-300
            flex items-center justify-center gap-2
            flex-1 sm:flex-none
          "
        >
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span>Anterior</span>
        </button>
        <button
          onClick={handleSiguiente}
          className="
            px-6 py-3 rounded-full
            bg-pucara-primary text-pucara-white
            font-medium
            shadow-md hover:shadow-lg
            transition-all duration-300
            hover:bg-pucara-accent hover:-translate-y-1
            flex items-center justify-center gap-2
            flex-1 sm:flex-none
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