import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = getUserFromToken(request)
    
    if (!user) {
      return NextResponse.json(
        { authenticated: false, error: 'No auth token' },
        { status: 401 }
      )
    }

    // Return user data (not including sensitive info)
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id || user.userId,
        nombre_usuario: user.nombre_usuario,
        rol: user.rol
      }
    })

  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json(
      { authenticated: false, error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
}
