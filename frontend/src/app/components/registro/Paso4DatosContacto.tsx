'use client';

import { useState } from 'react';
import { 
  PhoneIcon, MapPinIcon, BuildingOfficeIcon, IdentificationIcon,
  DocumentArrowUpIcon, ArrowPathIcon 
} from '@heroicons/react/24/outline';

interface Props {
  telefono: string;
  direccion: string;
  nit: string;
  nombreNegocio: string;
  provincia: string;
  municipio: string;
  rol: 'cliente' | 'comercial' | null;
  documento: File | null;                          // <-- nuevo
  onChange: (campo: 'telefono' | 'direccion' | 'nit' | 'nombreNegocio' | 'provincia' | 'municipio', valor: string) => void;
  onDocumentoChange: (file: File | null) => void;  // <-- nuevo
  onAnterior: () => void;
  onSiguiente: () => void;
}

export default function Paso4DatosContacto({
  telefono,
  direccion,
  nit,
  nombreNegocio,
  provincia,
  municipio,
  rol,
  documento,
  onChange,
  onDocumentoChange,
  onAnterior,
  onSiguiente,
}: Props) {
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [tocado, setTocado] = useState<Record<string, boolean>>({});
  const [extrayendo, setExtrayendo] = useState(false);
  const [errorPdf, setErrorPdf] = useState('');
  const [errorDocumento, setErrorDocumento] = useState('');

  const esCliente = rol === 'cliente';

  const valores = {
    telefono,
    direccion,
    nit,
    nombreNegocio,
    provincia,
    municipio,
  };

  const validarCampo = (campo: keyof typeof valores, valor: string): string => {
    // Provincia es requerida para ambos roles
    if (campo === 'provincia' && !valor.trim()) return 'La provincia es obligatoria';
    
    // Para clientes: nit, nombreNegocio son obligatorios
    if (esCliente) {
      if (campo === 'nit' && !valor.trim()) return 'El NIT es obligatorio para clientes';
      if (campo === 'nombreNegocio' && !valor.trim()) return 'El nombre del negocio es obligatorio';
    }
    if (campo === 'nit' && valor && !/^\d{10,}$/.test(valor.replace(/\D/g, ''))) {
      return 'El NIT debe tener al menos 10 dígitos';
    }
    return '';
  };

  const handleChange = (campo: keyof typeof valores, valor: string) => {
    onChange(campo, valor);
    if (tocado[campo]) {
      setErrores(prev => ({ ...prev, [campo]: validarCampo(campo, valor) }));
    }
  };

  const handleBlur = (campo: keyof typeof valores) => {
    setTocado(prev => ({ ...prev, [campo]: true }));
    setErrores(prev => ({ ...prev, [campo]: validarCampo(campo, valores[campo]) }));
  };

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo y tamaño
    if (file.type !== 'application/pdf') {
      setErrorPdf('Solo se permiten archivos PDF');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorPdf('El PDF no debe superar 5MB');
      return;
    }

    // Guardar el archivo en el estado padre
    onDocumentoChange(file);
    setErrorPdf('');
    setErrorDocumento('');

    // Extraer datos automáticamente
    setExtrayendo(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const res = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al extraer datos');
      }

      const data = await res.json();
      // Autocompletar los campos
      if (data.nit) onChange('nit', data.nit);
      if (data.nombreNegocio) onChange('nombreNegocio', data.nombreNegocio);
      if (data.provincia) onChange('provincia', data.provincia);
      if (data.municipio) onChange('municipio', data.municipio);
    } catch (err: any) {
      setErrorPdf(err.message);
    } finally {
      setExtrayendo(false);
    }
  };

  const handleSiguiente = () => {
    const nuevosErrores: Record<string, string> = {};

    // Provincia es requerida para ambos roles
    if (!provincia.trim()) nuevosErrores.provincia = 'La provincia es obligatoria';

    // Para clientes: nit, nombreNegocio, documento son obligatorios
    if (esCliente) {
      if (!nit.trim()) nuevosErrores.nit = 'El NIT es obligatorio';
      if (!nombreNegocio.trim()) nuevosErrores.nombreNegocio = 'El nombre del negocio es obligatorio';
      if (!documento) nuevosErrores.documento = 'Es obligatorio subir el RC-05';
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      onSiguiente();
    } else {
      const touched: Record<string, boolean> = {};
      Object.keys(nuevosErrores).forEach(k => touched[k] = true);
      setTocado(touched);
    }
  };

  return (
    <div className="space-y-8">
      {/* Cabecera igual... */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-pucara-primary/10 text-pucara-primary">
          <BuildingOfficeIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl md:text-3xl font-light text-pucara-black">
          Datos de contacto y negocio
        </h2>
        <p className="text-gray-500 text-sm">
          {esCliente ? 'Información fiscal y de contacto para tu negocio' : 'Información de contacto'}
        </p>
      </div>

      {/* Sección para subir PDF (solo para clientes) */}
      {esCliente && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          <div className="flex flex-col items-center text-center">
            <DocumentArrowUpIcon className="w-12 h-12 text-pucara-primary mb-2" />
            <h3 className="text-lg font-medium text-pucara-black mb-1">
              Sube tu RC-05 (PDF)
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Si subes el documento, los campos se llenarán automáticamente
            </p>
            <label className="cursor-pointer bg-pucara-primary text-white px-6 py-2 rounded-full hover:bg-pucara-accent transition-all">
              {extrayendo ? (
                <span className="flex items-center gap-2">
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  Extrayendo...
                </span>
              ) : (
                'Seleccionar archivo'
              )}
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handlePdfChange}
                disabled={extrayendo}
              />
            </label>
            {documento && !errorPdf && (
              <p className="text-sm text-gray-600 mt-2">
                {documento.name} ({(documento.size / 1024).toFixed(2)} KB)
              </p>
            )}
            {errorPdf && <p className="text-sm text-red-500 mt-2">{errorPdf}</p>}
            {errores.documento && (
              <p className="text-sm text-red-500 mt-2">{errores.documento}</p>
            )}
          </div>
        </div>
      )}

      {/* Grid de campos (igual que antes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teléfono */}
        <div className="space-y-1">
          <div className="relative">
            <PhoneIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              onBlur={() => handleBlur('telefono')}
              placeholder=" "
              className="w-full pl-8 pt-6 pb-2 text-lg border-b-2 border-gray-300 focus:border-pucara-primary outline-none"
            />
            <label className={`absolute left-8 transition-all pointer-events-none ${telefono ? 'text-xs top-1 text-pucara-primary' : 'text-gray-400 top-4 text-base'}`}>
              Teléfono
            </label>
          </div>
        </div>

        {/* NIT (solo si es cliente) */}
        {esCliente && (
          <div className="space-y-1">
            <div className="relative">
              <IdentificationIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={nit}
                onChange={(e) => handleChange('nit', e.target.value)}
                onBlur={() => handleBlur('nit')}
                placeholder=" "
                className={`w-full pl-8 pt-6 pb-2 text-lg border-b-2 outline-none ${
                  errores.nit && tocado.nit ? 'border-red-400' : 'border-gray-300 focus:border-pucara-primary'
                }`}
              />
              <label className={`absolute left-8 transition-all pointer-events-none ${nit ? 'text-xs top-1 text-pucara-primary' : 'text-gray-400 top-4 text-base'}`}>
                NIT *
              </label>
            </div>
            {errores.nit && tocado.nit && <p className="text-red-500 text-sm">{errores.nit}</p>}
          </div>
        )}

        {/* Nombre del negocio (solo cliente) */}
        {esCliente && (
          <div className="space-y-1">
            <div className="relative">
              <BuildingOfficeIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={nombreNegocio}
                onChange={(e) => handleChange('nombreNegocio', e.target.value)}
                onBlur={() => handleBlur('nombreNegocio')}
                placeholder=" "
                className={`w-full pl-8 pt-6 pb-2 text-lg border-b-2 outline-none ${
                  errores.nombreNegocio && tocado.nombreNegocio ? 'border-red-400' : 'border-gray-300 focus:border-pucara-primary'
                }`}
              />
              <label className={`absolute left-8 transition-all pointer-events-none ${nombreNegocio ? 'text-xs top-1 text-pucara-primary' : 'text-gray-400 top-4 text-base'}`}>
                Nombre del negocio *
              </label>
            </div>
            {errores.nombreNegocio && tocado.nombreNegocio && <p className="text-red-500 text-sm">{errores.nombreNegocio}</p>}
          </div>
        )}

        {/* Provincia */}
        <div className="space-y-1">
          <div className="relative">
            <MapPinIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={provincia}
              onChange={(e) => handleChange('provincia', e.target.value)}
              onBlur={() => handleBlur('provincia')}
              placeholder=" "
              className={`w-full pl-8 pt-6 pb-2 text-lg border-b-2 outline-none ${
                errores.provincia && tocado.provincia ? 'border-red-400' : 'border-gray-300 focus:border-pucara-primary'
              }`}
            />
            <label className={`absolute left-8 transition-all pointer-events-none ${provincia ? 'text-xs top-1 text-pucara-primary' : 'text-gray-400 top-4 text-base'}`}>
              Provincia *
            </label>
          </div>
          {errores.provincia && tocado.provincia && <p className="text-red-500 text-sm">{errores.provincia}</p>}
        </div>

        {/* Municipio */}
        <div className="space-y-1">
          <div className="relative">
            <MapPinIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={municipio}
              onChange={(e) => handleChange('municipio', e.target.value)}
              onBlur={() => handleBlur('municipio')}
              placeholder=" "
              className={`w-full pl-8 pt-6 pb-2 text-lg border-b-2 outline-none ${
                errores.municipio && tocado.municipio ? 'border-red-400' : 'border-gray-300 focus:border-pucara-primary'
              }`}
            />
            <label className={`absolute left-8 transition-all pointer-events-none ${municipio ? 'text-xs top-1 text-pucara-primary' : 'text-gray-400 top-4 text-base'}`}>
              Municipio
            </label>
          </div>
          {errores.municipio && tocado.municipio && <p className="text-red-500 text-sm">{errores.municipio}</p>}
        </div>

        {/* Dirección (opcional) */}
        <div className="col-span-1 md:col-span-2 space-y-1">
          <div className="relative">
            <MapPinIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              placeholder=" "
              className="w-full pl-8 pt-6 pb-2 text-lg border-b-2 border-gray-300 focus:border-pucara-primary outline-none"
            />
            <label className={`absolute left-8 transition-all pointer-events-none ${direccion ? 'text-xs top-1 text-pucara-primary' : 'text-gray-400 top-4 text-base'}`}>
              Dirección
            </label>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="pt-4 flex justify-between gap-3">
        <button
          onClick={onAnterior}
          className="px-6 py-3 rounded-full border border-pucara-primary text-pucara-primary font-medium hover:bg-pucara-primary/10 transition-all duration-300 flex items-center justify-center gap-2 flex-1 sm:flex-none"
        >
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span>Anterior</span>
        </button>
        <button
          onClick={handleSiguiente}
          className="px-6 py-3 rounded-full bg-pucara-primary text-pucara-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:bg-pucara-accent hover:-translate-y-1 flex items-center justify-center gap-2 flex-1 sm:flex-none"
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