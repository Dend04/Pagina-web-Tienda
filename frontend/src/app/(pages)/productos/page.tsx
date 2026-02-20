"use client";

import { useState, useEffect } from "react";

import { Footer } from "@/app/components/Footer";
import SearchBar from "@/app/components/SearchBar";
import ProductTable from "@/app/components/ProductTable";
import ProductModal from "@/app/components/ProductModal";
import DeleteProductModal from "@/app/components/DeleteProductModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ProductListItem, ProductDetail } from "@/app/types/product";
import { MainHeader } from "@/app/components/header";

export default function ProductosPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para el modal de eliminar
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductListItem | null>(null);

  // Cargar productos (lista resumida) usando la API paginada
  const loadProducts = async () => {
    setLoading(true);
    try {
      // Usamos un límite alto (ej. 100) para cargar todos los productos en admin
      const res = await fetch('/api/products?page=1&limit=100');
      const data = await res.json();
      if (res.ok && data.products) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      } else {
        console.error('Error cargando productos:', data.error);
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filtrado
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toString().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Guardar producto (crear o actualizar)
  const handleSave = async (productData: Partial<ProductDetail>, imageUrls: string[]) => {
    try {
      const isEditing = !!editingProduct?.id;
      const url = isEditing ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productData.name,
          price: productData.price,
          category: productData.category,
          stock: productData.stock ?? 5,
          description: productData.description,
          images: imageUrls,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar');
      }

      await loadProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    }
  };

  // Abre el modal de confirmación para eliminar
  const handleDeleteClick = (product: ProductListItem) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Ejecuta la eliminación real
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await loadProducts();
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el producto');
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Editar: cargar producto completo con imágenes
  const handleEdit = async (product: ProductListItem) => {
    try {
      const res = await fetch(`/api/products/${product.id}`);
      if (res.ok) {
        const fullProduct = await res.json();
        setEditingProduct(fullProduct);
        setIsModalOpen(true);
      } else {
        console.error('Error al cargar el producto completo');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pucara-white flex flex-col">
        <MainHeader />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pucara-primary"></div>
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
              onDelete={handleDeleteClick}
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

      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        productName={productToDelete?.name || ""}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}