"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { CameraIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";

interface Props {
  foto: File | null;
  onChange: (file: File | null) => void;
  onAnterior: () => void;
  onFinalizar: (imagen?: string) => Promise<void>;
}

export default function Paso5Foto({ foto, onChange, onAnterior, onFinalizar }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropCancel = () => {
    setShowCropper(false);
    setPreview(null);
    setOriginalFile(null);
    setCroppedAreaPixels(null);
  };

  const handleCropSave = async () => {
    if (!preview || !croppedAreaPixels || !originalFile) return;

    try {
      const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
      const croppedFile = new File([croppedImage], originalFile.name, {
        type: originalFile.type,
      });
      onChange(croppedFile);
      // Actualizar preview con la imagen recortada
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(croppedFile);
      setShowCropper(false);
      setCroppedAreaPixels(null);
    } catch (e) {
      console.error(e);
      setError("Error al recortar la imagen");
    }
  };

const handleFinalizar = async () => {
  setSubiendo(true);
  setError("");

  try {
    let imagenUrl = "";
    if (foto) {
      const formData = new FormData();
      formData.append("file", foto);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Error al subir la imagen");
      }
      imagenUrl = uploadData.url;
      console.log("URL de imagen obtenida:", imagenUrl); // 👈 Verificar en consola
    }

    await onFinalizar(imagenUrl);
  } catch (err: any) {
    setError(err.message || "Error al procesar el registro");
    console.error("Error en handleFinalizar:", err);
  } finally {
    setSubiendo(false);
  }
};

  return (
    <>
      <div className="space-y-8">
        {/* Cabecera con ícono */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-pucara-primary/10 text-pucara-primary">
            <CameraIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-pucara-black">
            Foto de perfil
          </h2>
          <p className="text-gray-500 text-sm">
            Opcional. Puedes añadir una foto para personalizar tu cuenta
          </p>
        </div>

        {/* Área de la foto */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full bg-linear-to-br from-pucara-primary/20 to-pucara-accent/20 overflow-hidden mb-4 ring-4 ring-pucara-primary/10">
            {preview ? (
              <Image
                src={preview}
                alt="Vista previa"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-pucara-primary/40">
                <PhotoIcon className="w-12 h-12" />
              </div>
            )}
          </div>

          <label className="cursor-pointer bg-pucara-primary text-pucara-white px-6 py-3 rounded-full hover:bg-pucara-accent transition-all shadow-md hover:shadow-lg font-medium">
            {preview ? "Cambiar imagen" : "Seleccionar imagen"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {foto && (
            <p className="text-sm text-gray-500 mt-3">
              {foto.name} ({(foto.size / 1024).toFixed(2)} KB)
            </p>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
            onClick={handleFinalizar}
            disabled={subiendo}
            className="
              px-6 py-3 rounded-full
              bg-pucara-primary text-pucara-white
              font-medium
              shadow-md hover:shadow-lg
              transition-all duration-300
              hover:bg-pucara-accent hover:-translate-y-1
              disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none
              flex items-center justify-center gap-2
              flex-1 sm:flex-none
            "
          >
            {subiendo ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Subiendo...</span>
              </>
            ) : (
              <>
                <span>Finalizar registro</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de recorte */}
      {showCropper && preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
            <h3 className="text-xl font-semibold text-pucara-black mb-4 text-center">
              Ajusta tu foto de perfil
            </h3>
            <div className="relative w-full h-64 mb-4 bg-gray-100 rounded-lg overflow-hidden">
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Zoom</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCropCancel}
                className="flex-1 border border-pucara-primary text-pucara-primary py-2 rounded-full hover:bg-pucara-primary/10 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleCropSave}
                className="flex-1 bg-pucara-primary text-white py-2 rounded-full hover:bg-pucara-accent transition-all"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}