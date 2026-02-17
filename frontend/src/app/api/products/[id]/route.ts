import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 👈 Importante: params es una Promise
) {
  // Desempaquetar params con await
  const { id } = await params
  const numericId = parseInt(id)

  if (isNaN(numericId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    // Primero eliminar imágenes relacionadas
    const { error: imgError } = await supabaseAdmin
      .from('producto_imagenes')
      .delete()
      .eq('producto_id', numericId)

    if (imgError) {
      console.error('Error eliminando imágenes:', imgError)
    }

    const { error } = await supabaseAdmin
      .from('productos')
      .delete()
      .eq('id', numericId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}