import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// GET: Obtener producto por ID con todas sus imágenes
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    // Obtener producto
    const { data: producto, error } = await supabaseAdmin
      .from("productos")
      .select("*")
      .eq("id", numericId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // Obtener todas las imágenes ordenadas
    const { data: imagenes } = await supabaseAdmin
      .from("producto_imagenes")
      .select("url")
      .eq("producto_id", numericId)
      .order("orden", { ascending: true });

    const productoConImagenes = {
      id: producto.id,
      name: producto.nombre,
      price: producto.precio,
      category: producto.etiqueta,
      stock: producto.stock,
      description: producto.descripcion,
      images: imagenes?.map((img) => img.url) || [],
    };

    return NextResponse.json(productoConImagenes);
  } catch (error) {
    console.error("Error en GET /api/products/[id]:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// PUT: Actualizar producto y sus imágenes
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const { name, price, category, stock, description, images } =
      await request.json();

    // Validar campos obligatorios
    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Actualizar producto
    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from("productos")
      .update({
        nombre: name,
        precio: price,
        stock: stock ?? 5,
        etiqueta: category,
        descripcion: description || null,
      })
      .eq("id", numericId)
      .select()
      .single();

    if (updateError) {
      console.error("Error actualizando producto:", updateError);
      return NextResponse.json(
        { success: false, error: "Error al actualizar el producto" },
        { status: 500 }
      );
    }

    // Si se proporcionaron imágenes, reemplazar todas
    if (images && Array.isArray(images)) {
      // Primero eliminar imágenes existentes
      const { error: deleteImgError } = await supabaseAdmin
        .from("producto_imagenes")
        .delete()
        .eq("producto_id", numericId);

      if (deleteImgError) {
        console.error("Error eliminando imágenes antiguas:", deleteImgError);
        // Continuamos, no interrumpimos la actualización del producto
      }

      // Insertar nuevas imágenes
      if (images.length > 0) {
        const imagesToInsert = images.map((url: string, index: number) => ({
          producto_id: numericId,
          url,
          orden: index,
        }));

        const { error: insertImgError } = await supabaseAdmin
          .from("producto_imagenes")
          .insert(imagesToInsert);

        if (insertImgError) {
          console.error("Error insertando nuevas imágenes:", insertImgError);
          return NextResponse.json(
            { success: false, error: "Error al guardar las imágenes" },
            { status: 500 }
          );
        }
      }
    }

    // Devolver el producto actualizado (sin imágenes para no sobrecargar)
    const productMapeado = {
      id: updatedProduct.id,
      name: updatedProduct.nombre,
      price: updatedProduct.precio,
      category: updatedProduct.etiqueta,
      stock: updatedProduct.stock,
      description: updatedProduct.descripcion,
    };

    return NextResponse.json({
      success: true,
      message: "Producto actualizado correctamente",
      product: productMapeado,
    });
  } catch (error) {
    console.error("Error en PUT /api/products/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar producto y sus imágenes
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    // Primero eliminar imágenes relacionadas
    const { error: imgError } = await supabaseAdmin
      .from("producto_imagenes")
      .delete()
      .eq("producto_id", numericId);

    if (imgError) {
      console.error("Error eliminando imágenes:", imgError);
    }

    const { error } = await supabaseAdmin
      .from("productos")
      .delete()
      .eq("id", numericId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en DELETE /api/products/[id]:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
