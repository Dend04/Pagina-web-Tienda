import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Faltan credenciales' },
        { status: 400 }
      )
    }

    // Buscar usuario por username o email
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('*')
      .or(`nombre_usuario.eq.${username},correo.eq.${username}`)
      .maybeSingle()

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Comparar contraseña
    const valid = await bcrypt.compare(password, user.contraseña)
    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Aquí podrías generar un token de sesión (JWT) o usar next-auth.
    // Por simplicidad, devolvemos los datos del usuario (sin contraseña)
    const { contraseña: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno' },
      { status: 500 }
    )
  }
}