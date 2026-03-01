import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rateLimit'

// Validación de la variable de entorno JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no está definida')
}
const jwtSecret: string = JWT_SECRET

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = checkRateLimit(clientIp, RATE_LIMITS.LOGIN);
    
    if (rateLimitResult.isLimited) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Demasiados intentos. Intenta de nuevo más tarde',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000))
          }
        }
      )
    }

    const { nombre_usuario, contrasena } = await request.json()

    if (!nombre_usuario || !contrasena) {
      return NextResponse.json(
        { success: false, error: 'Faltan credenciales' },
        { status: 400 }
      )
    }

    // 1. Buscar por nombre_usuario exacto
    let { data: user, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('nombre_usuario', nombre_usuario)
      .maybeSingle()

    // 2. Si no se encuentra, buscar por correo exacto
    if (!user && !error) {
      const result = await supabaseAdmin
        .from('usuarios')
        .select('*')
        .eq('correo', nombre_usuario)
        .maybeSingle()
      user = result.data
      error = result.error
    }

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // 3. Comparar contraseña (hasheada)
    const valid = await bcrypt.compare(contrasena, user.contrasena)
    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // 4. Datos para el token JWT
    const tokenData = {
      id: user.id,
      nombre_usuario: user.nombre_usuario,
      correo: user.correo,
      rol: user.rol,
      telefono: user.telefono,
      tipo_usuario: user.tipo_usuario,
      imagen: user.imagen,
    }

    const token = jwt.sign(tokenData, jwtSecret, { expiresIn: '7d' })

    // 5. Respuesta sin la contraseña, con cookie httpOnly
    const { contrasena: _, ...userWithoutContrasena } = user

    const response = NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: userWithoutContrasena,
    })

    // Set the httpOnly cookie
    response.cookies.set('auth_token', token, COOKIE_OPTIONS)

    return response
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno' },
      { status: 500 }
    )
  }
}