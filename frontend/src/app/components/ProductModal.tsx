"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { ProductDetail } from "../types/product";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<ProductDetail>, imageUrls: string[]) => Promise<void>;
  product?: ProductDetail | null;
}

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: undefined as number | undefined,
    category: "",
    stock: undefined as number | undefined,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Resetear formulario cuando se cierra el modal (para evitar datos residuales)
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        price: undefined,
        category: "",
        stock: undefined,
        description: "",
      });
      setExistingImages([]);
      setImageFiles([]);
      setImagePreviews([]);
    }
  }, [isOpen]);

  // Cargar datos cuando se abre el modal para editar
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || "",
        price: product.price,
        category: product.category || "",
        stock: product.stock,
        description: product.description || "",
      });
      setExistingImages(product.images || []);
      setImageFiles([]);
      setImagePreviews([]);
    } else if (!product && isOpen) {
      // Aseguramos valores vacíos para nuevo producto
      setFormData({
        name: "",
        price: undefined,
        category: "",
        stock: undefined,
        description: "",
      });
      setExistingImages([]);
      setImageFiles([]);
      setImagePreviews([]);
    }
  }, [product, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles((prev) => [...prev, ...newFiles]);
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validar que precio y stock no sean undefined ni vacíos (opcional)
      if (formData.price === undefined || formData.price < 0) {
        alert("El precio debe ser un número válido");
        setLoading(false);
        return;
      }
      if (formData.stock === undefined || formData.stock < 0) {
        alert("El stock debe ser un número válido");
        setLoading(false);
        return;
      }

      // Subir nuevas imágenes
      const newUploadedUrls: string[] = [];
      if (imageFiles.length > 0) {
        setUploading(true);
        for (const file of imageFiles) {
          const formDataUpload = new FormData();
          formDataUpload.append("file", file);
          const uploadRes = await fetch("/api/upload-product-image", {
            method: "POST",
            body: formDataUpload,
          });
          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) {
            throw new Error(uploadData.error || "Error al subir imagen");
          }
          newUploadedUrls.push(uploadData.url);
        }
        setUploading(false);
      }

      const allImageUrls = [...existingImages, ...newUploadedUrls];
      await onSave(formData, allImageUrls);
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-pucara-black">
            {product ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-pucara-primary">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pucara-primary/50 focus:border-pucara-primary outline-none"
                placeholder="Ej. Zapatillas deportivas"
              />
            </div>

            {/* Precio y categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price ?? ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? undefined : parseFloat(e.target.value);
                  setFormData({ ...formData, price: val });
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pucara-primary/50 focus:border-pucara-primary outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pucara-primary/50 focus:border-pucara-primary outline-none"
                placeholder="Ej. Calzado"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock ?? ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                  setFormData({ ...formData, stock: val });
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pucara-primary/50 focus:border-pucara-primary outline-none"
                placeholder="0"
              />
            </div>

            {/* Imágenes múltiples */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes del producto</label>
              <div className="flex flex-wrap gap-4 mb-2">
                {/* Imágenes existentes */}
                {existingImages.map((url, index) => (
                  <div key={`existing-${index}`} className="relative w-24 h-24 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 group">
                    <Image
                      src={url}
                      alt={`Imagen existente ${index}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {/* Nuevas imágenes subidas */}
                {imagePreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative w-24 h-24 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 group">
                    <Image
                      src={preview}
                      alt={`Preview ${index}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {/* Botón para agregar */}
                <label className="cursor-pointer w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-pucara-primary flex flex-col items-center justify-center text-gray-400 hover:text-pucara-primary transition-colors">
                  <PlusIcon className="w-8 h-8" />
                  <span className="text-xs mt-1">Agregar</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Puedes seleccionar varias imágenes. El orden final será: imágenes existentes (en el orden mostrado) seguidas de las nuevas.
              </p>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pucara-primary/50 focus:border-pucara-primary outline-none"
                placeholder="Descripción del producto..."
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2 bg-pucara-primary text-white rounded-full hover:bg-pucara-accent transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading || uploading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : product ? (
                "Actualizar"
              ) : (
                "Crear"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}