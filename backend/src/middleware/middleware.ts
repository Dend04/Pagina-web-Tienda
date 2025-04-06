import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  // Verificar formato del header
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Formato de autorización inválido',
      detalles: 'Usa: Bearer <token>'
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_ACCESS_SECRET as jwt.Secret
    ) as { sub: string }; // Usar 'sub' en vez de 'id'

    // Convertir y validar el ID
    if (!decoded.sub) {
      throw new Error('Token mal formado');
    }
    
    req.userId = BigInt(decoded.sub);
    next();

  } catch (error) {
    // Manejar diferentes tipos de errores
    const errorMessage = error instanceof jwt.TokenExpiredError 
      ? 'Token expirado' 
      : error instanceof jwt.JsonWebTokenError
      ? 'Token inválido'
      : 'Error de autenticación';

    res.status(401).json({ 
      error: errorMessage,
      code: error instanceof jwt.TokenExpiredError ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
    });
  }
};