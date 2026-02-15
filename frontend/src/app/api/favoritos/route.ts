import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

// Obtener el usuario desde el token
function getUserFromToken(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch {
    return null
  }
}

// GET: obtener todos los favoritos del usuario
export async function GET(request: Request) {
  const user = getUserFromToken(request)
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('favoritos')
    .select('producto_id')
    .eq('usuario_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const favoritos = data.map(f => f.producto_id)
  return NextResponse.json({ favoritos })
}

// POST: toggle favorito (agrega si no existe, elimina si existe)
export async function POST(request: Request) {
  const user = getUserFromToken(request)
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { producto_id } = await request.json()
  if (!producto_id) {
    return NextResponse.json({ error: 'Falta producto_id' }, { status: 400 })
  }

  // Verificar si ya existe
  const { data: existing } = await supabaseAdmin
    .from('favoritos')
    .select('id')
    .eq('usuario_id', user.id)
    .eq('producto_id', producto_id)
    .maybeSingle()

  if (existing) {
    // Eliminar
    const { error } = await supabaseAdmin
      .from('favoritos')
      .delete()
      .eq('id', existing.id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ favorito: false })
  } else {
    // Insertar
    const { error } = await supabaseAdmin
      .from('favoritos')
      .insert({ usuario_id: user.id, producto_id })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ favorito: true })
  }
}