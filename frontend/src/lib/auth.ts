import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado')
}

/**
 * Extrae el token JWT desde el header Authorization O desde la cookie auth_token
 * Mantiene backward compatibility con ambos métodos
 */
export function getTokenFromRequest(request: Request): string | null {
  // 1. Primero intentar desde header Authorization
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1]
  }

  // 2. Luego intentar desde cookie (para tokens httpOnly)
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim())
    const authCookie = cookies.find(c => c.startsWith('auth_token='))
    if (authCookie) {
      return authCookie.split('=')[1]
    }
  }

  return null
}

/**
 * Verifica el token y retorna los datos del usuario decodificados
 */
export function getUserFromToken(request: Request): {
  userId?: number
  id?: number
  nombre_usuario?: string
  rol?: string
} | null {
  const token = getTokenFromRequest(request)
  
  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch {
    return null
  }
}
