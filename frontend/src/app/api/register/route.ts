import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { username, email, password, telefono, direccion, rol, imagen } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .or(`nombre_usuario.eq.${username},correo.eq.${email}`)
      .maybeSingle()

    if (checkError) {
      return NextResponse.json(
        { success: false, error: 'Error al verificar usuario' },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'El nombre de usuario o correo ya está registrado' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Insertar nuevo usuario con el rol seleccionado y la imagen
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('usuarios')
      .insert([
        {
          nombre_usuario: username,
          correo: email,
          contrasena: hashedPassword,
          rol: rol || 'cliente',
          telefono: telefono || null,
          direccion: direccion || null,
          imagen: imagen || null,   
        },
      ])
      .select('id, nombre_usuario, correo, rol, imagen')  // incluye imagen en la respuesta
      .single()

    if (insertError) {
      console.error('Error insertando usuario:', insertError)
      return NextResponse.json(
        { success: false, error: 'No se pudo crear el usuario' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario creado correctamente',
      user: newUser,
    })
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}