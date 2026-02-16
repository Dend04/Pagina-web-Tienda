"use client";

import { useState, useEffect } from "react";
import { MainHeader } from "@/app/components/HeadersComponents";
import { Footer } from "@/app/components/Footer";
import SearchBar from "@/app/components/SearchBar";
import ProductTable from "@/app/components/ProductTable";
import ProductModal from "@/app/components/ProductModal";
import { Product } from "@/app/types/product";
import { PlusIcon } from "@heroicons/react/24/outline";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // Asegúrate de tener este cliente

// Datos de ejemplo iniciales (después vendrán de Supabase)
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Zapatillas Deportivas",
    price: 89.99,
    category: "Calzado",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stock: 25,
    rating: 4.5,
    minQuantity: 1,
    maxQuantity: 5,
  },
  {
    id: 2,
    name: "Reloj Inteligente",
    price: 199.99,
    category: "Tecnología",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stock: 12,
    rating: 4.2,
    minQuantity: 1,
    maxQuantity: 3,
  },
  // ... más productos (puedes copiar los que ya tienes en el dashboard)
];

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  // Función para cargar productos desde Supabase (cuando esté listo)
  const loadProducts = async () => {
    // const { data, error } = await supabaseAdmin.from('productos').select('*');
    // if (data) setProducts(data);
  };

  useEffect(() => {
    // loadProducts();
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

  const handleSave = async (productData: Partial<Product>) => {
    setLoading(true);
    try {
      if (editingProduct) {
        // Editar producto existente
        // const { error } = await supabaseAdmin
        //   .from('productos')
        //   .update(productData)
        //   .eq('id', editingProduct.id);
        // if (!error) {
        //   setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
        // }
        // Simulación:
        setProducts(products.map(p =>
          p.id === editingProduct.id ? { ...p, ...productData, id: p.id } : p
        ));
      } else {
        // Crear nuevo producto
        // const { data, error } = await supabaseAdmin
        //   .from('productos')
        //   .insert([productData])
        //   .select();
        // if (data) setProducts([...products, data[0]]);
        // Simulación:
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        setProducts([...products, { ...productData, id: newId } as Product]);
      }
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      // const { error } = await supabaseAdmin.from('productos').delete().eq('id', product.id);
      // if (!error) setProducts(products.filter(p => p.id !== product.id));
      setProducts(products.filter(p => p.id !== product.id));
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

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, categoría o precio..."
          />
        </div>

        {/* Resultados */}
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

      {/* Modal para crear/editar */}
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