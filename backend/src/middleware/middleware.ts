import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (
    req: Request, 
    res: Response, 
    next: NextFunction
  ) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }
  
    try {
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET as jwt.Secret
      ) as { id: string };
      
      req.userId = BigInt(decoded.id);
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  };