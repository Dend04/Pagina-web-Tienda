import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    // 1. Obtener todos los productos
    const { data: productos, error } = await supabaseAdmin
      .from('productos')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 2. Para cada producto, obtener su primera imagen
    const productosConImagen = await Promise.all(
      productos.map(async (producto: any) => {
        const { data: imagenes } = await supabaseAdmin
          .from('producto_imagenes')
          .select('url')
          .eq('producto_id', producto.id)
          .order('orden', { ascending: true })
          .limit(1)

        return {
          id: producto.id,
          name: producto.nombre,
          price: producto.precio,
          category: producto.etiqueta,
          stock: producto.stock,
          description: producto.descripcion,
          image: imagenes && imagenes.length > 0 ? imagenes[0].url : null,
        }
      })
    )

    return NextResponse.json(productosConImagen)
  } catch (error) {
    console.error('Error en GET:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, category, stock, description, images } = await request.json()

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Insertar producto
    const { data: product, error: productError } = await supabaseAdmin
      .from('productos')
      .insert({
        nombre: name,
        precio: price,
        stock: stock ?? 5,
        etiqueta: category,
        descripcion: description || null,
      })
      .select()
      .single()

    if (productError) {
      console.error('Error insertando producto:', productError)
      return NextResponse.json(
        { success: false, error: 'Error al crear el producto' },
        { status: 500 }
      )
    }

    const productId = product.id

    // Insertar imágenes
    if (images && images.length > 0) {
      const imagesToInsert = images.map((url: string, index: number) => ({
        producto_id: productId,
        url,
        orden: index,
      }))

      const { error: imagesError } = await supabaseAdmin
        .from('producto_imagenes')
        .insert(imagesToInsert)

      if (imagesError) {
        console.error('Error insertando imágenes:', imagesError)
        return NextResponse.json(
          { success: false, error: 'Error al guardar las imágenes' },
          { status: 500 }
        )
      }
    }

    // Devolver el producto mapeado
    const productMapeado = {
      id: product.id,
      name: product.nombre,
      price: product.precio,
      category: product.etiqueta,
      stock: product.stock,
      description: product.descripcion,
    }

    return NextResponse.json({
      success: true,
      message: 'Producto creado correctamente',
      product: productMapeado,
    })
  } catch (error) {
    console.error('Error en POST /api/products:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}