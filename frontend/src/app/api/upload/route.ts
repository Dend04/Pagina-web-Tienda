import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 })
    }
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no debe superar 2MB' }, { status: 400 })
    }

    const extension = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${extension}`
    const buffer = await file.arrayBuffer()

    const { error } = await supabaseAdmin.storage
      .from('perfiles')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
      })

    if (error) {
      console.error('Error al subir imagen:', error)
      return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 })
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('perfiles')
      .getPublicUrl(fileName)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error('Error en upload:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}