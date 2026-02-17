"use client";

import { useState, useEffect } from "react";
import { MainHeader } from "@/app/components/HeadersComponents";
import { Footer } from "@/app/components/Footer";
import SearchBar from "@/app/components/SearchBar";
import ProductTable from "@/app/components/ProductTable";
import ProductModal from "@/app/components/ProductModal";
import { Product } from "@/app/types/product";
import { PlusIcon } from "@heroicons/react/24/outline";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // Ojo: esto es solo para cargar datos, no para insertar

// Nota: No uses supabaseAdmin en el cliente; mejor crea una API para obtener productos.
// Pero por simplicidad, asumimos que tienes una API GET /api/products.
// Vamos a crear un fetch a /api/products para obtener la lista.

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar productos desde Supabase (usando una API route)
  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products'); // Necesitas crear esta ruta GET
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
        setFilteredProducts(data);
      } else {
        console.error('Error cargando productos:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filtrado en tiempo real
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toString().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSave = async (productData: Partial<Product>, imageUrls: string[]) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productData.name,
          price: productData.price,
          category: productData.category,
          stock: productData.stock ?? 5, // valor por defecto 5
          description: productData.description,
          minQuantity: productData.minQuantity,
          maxQuantity: productData.maxQuantity,
          images: imageUrls,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar');
      }

      // Recargar productos para actualizar la tabla
      await loadProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      try {
        const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
        if (res.ok) {
          await loadProducts();
        } else {
          alert('Error al eliminar');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pucara-white flex flex-col">
        <MainHeader />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">Cargando productos...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pucara-white flex flex-col">
      <MainHeader />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-pucara-black">
              Gestión de Productos
            </h1>
            <p className="text-gray-600">Administra el catálogo de productos</p>
          </div>
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 bg-pucara-primary text-white px-5 py-2.5 rounded-full hover:bg-pucara-accent transition-all shadow-md hover:shadow-lg"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Nuevo producto</span>
          </button>
        </div>

        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, categoría o precio..."
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Mostrando {filteredProducts.length} de {products.length} productos
            </p>
            <ProductTable
              products={filteredProducts}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </main>

      <Footer />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
}