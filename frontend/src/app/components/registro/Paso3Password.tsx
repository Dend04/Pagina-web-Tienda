"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon, LockClosedIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  valor: string;
  onChange: (valor: string) => void;
  onAnterior: () => void;
  onSiguiente: () => void;
}

export default function Paso3Password({ valor, onChange, onAnterior, onSiguiente }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [tocado, setTocado] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Caracteres especiales (incluye ¿¡ y otros)
  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?¿¡~`]/;

  const requisitos = [
    { texto: "Mínimo 8 caracteres", test: (p: string) => p.length >= 8 },
    { texto: "Al menos una mayúscula", test: (p: string) => /[A-Z]/.test(p) },
    { texto: "Al menos una minúscula", test: (p: string) => /[a-z]/.test(p) },
    { texto: "Al menos un número", test: (p: string) => /\d/.test(p) },
    { texto: "Al menos un carácter especial", test: (p: string) => specialChars.test(p) },
  ];

  const totalRequisitos = requisitos.length;
  const cumplidos = requisitos.filter(r => r.test(valor)).length;
  const puedeAvanzar = cumplidos >= 4;

  // Nivel de fortaleza basado en cantidad de requisitos cumplidos y longitud
  const getFortaleza = () => {
    if (cumplidos <= 2) return { nivel: "débil", color: "bg-red-500", texto: "Débil" };
    if (cumplidos === 3) return { nivel: "media", color: "bg-yellow-500", texto: "Media" };
    if (cumplidos === 4) {
      if (valor.length >= 12) return { nivel: "fuerte", color: "bg-green-500", texto: "Fuerte" };
      return { nivel: "buena", color: "bg-green-400", texto: "Buena" };
    }
    if (cumplidos === 5) {
      if (valor.length >= 12) return { nivel: "muy fuerte", color: "bg-green-600", texto: "Muy fuerte" };
      return { nivel: "fuerte", color: "bg-green-500", texto: "Fuerte" };
    }
    return { nivel: "débil", color: "bg-red-500", texto: "Débil" };
  };

  const fortaleza = getFortaleza();

  // Requisitos cumplidos (se muestran dinámicamente)
  const requisitosCumplidos = requisitos.filter(r => r.test(valor));

  const handleBlur = () => {
    setTocado(true);
    if (!puedeAvanzar) {
      setError(`Debes cumplir al menos 4 requisitos de seguridad (actual: ${cumplidos})`);
    } else {
      setError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (tocado) {
      if (!puedeAvanzar) {
        setError(`Debes cumplir al menos 4 requisitos de seguridad (actual: ${cumplidos})`);
      } else {
        setError("");
      }
    }
  };

  const handleSiguiente = () => {
    if (!puedeAvanzar) {
      setShowModal(true);
      setTocado(true);
      return;
    }
    onSiguiente();
  };

  return (
    <>
      <div className="space-y-8">
        {/* Cabecera */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-pucara-primary/10 text-pucara-primary">
            <LockClosedIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-pucara-black">
            Crea una contraseña segura
          </h2>
          <p className="text-gray-500 text-sm">
            Debe cumplir al menos 4 de los 5 requisitos
          </p>
        </div>

        {/* Campo de contraseña */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={valor}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
              autoFocus
              className={`
                w-full px-4 pt-6 pb-2 text-lg
                border-b-2 bg-transparent
                transition-all duration-200 ease-out
                outline-none pr-12
                ${
                  error && tocado
                    ? "border-red-400 focus:border-red-600"
                    : puedeAvanzar && valor
                    ? "border-green-500 focus:border-pucara-primary"
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
              Contraseña
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pucara-primary transition-colors"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          {/* Indicador de fortaleza */}
          {valor && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Fortaleza:</span>
                <span className={`text-xs font-medium text-${fortaleza.nivel === 'débil' ? 'red-500' : fortaleza.nivel === 'media' ? 'yellow-600' : fortaleza.nivel.includes('fuerte') ? 'green-600' : 'green-500'}`}>
                  {fortaleza.texto}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${fortaleza.color}`}
                  style={{ width: `${(cumplidos / totalRequisitos) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {cumplidos} de {totalRequisitos} requisitos cumplidos
              </p>
            </div>
          )}

          {/* Lista de requisitos cumplidos */}
          {requisitosCumplidos.length > 0 && (
            <div className="mt-4 space-y-2">
              {requisitosCumplidos.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-500 text-white text-xs">
                    ✓
                  </span>
                  <span className="text-gray-700">{req.texto}</span>
                </div>
              ))}
            </div>
          )}
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
            disabled={!puedeAvanzar}
            className="
              px-6 py-3 rounded-full
              bg-pucara-primary text-pucara-white
              font-medium
              shadow-md hover:shadow-lg
              transition-all duration-300
              hover:bg-pucara-accent hover:-translate-y-1
              disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none
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

      {/* Modal de requisitos pendientes */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-pucara-primary transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="text-center mb-4">
              <div className="inline-flex p-2 rounded-full bg-red-100 text-red-500 mb-3">
                <LockClosedIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-pucara-black">
                Contraseña no válida
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Para continuar, necesitas cumplir al menos 4 requisitos. Actualmente tienes {cumplidos}.
              </p>
            </div>

            <div className="space-y-3 my-4">
              {requisitos.map((req, idx) => {
                const cumple = req.test(valor);
                return (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      cumple ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {cumple ? '✓' : '○'}
                    </span>
                    <span className={cumple ? 'text-gray-700' : 'text-gray-500'}>
                      {req.texto}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 bg-pucara-primary text-pucara-white py-3 rounded-full hover:bg-pucara-accent transition-all shadow-md hover:shadow-lg"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}