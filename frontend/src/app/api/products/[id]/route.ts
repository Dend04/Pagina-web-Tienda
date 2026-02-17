import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    // Primero eliminar imágenes relacionadas (por integridad referencial lógica)
    const { error: imgError } = await supabaseAdmin
      .from('producto_imagenes')
      .delete()
      .eq('producto_id', id)

    if (imgError) {
      console.error('Error eliminando imágenes:', imgError)
      // Continuamos aunque falle, para no dejar el producto huérfano
    }

    const { error } = await supabaseAdmin
      .from('productos')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}