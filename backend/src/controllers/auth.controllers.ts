import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquema de validación
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// Función para generar JWT
const generateToken = (userId: bigint): string => {
    return jwt.sign(
      { id: userId.toString() }, // Payload
      process.env.JWT_SECRET as jwt.Secret, // Secreto
      {
        expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as string, // Forzar tipo string
        algorithm: 'HS256' as jwt.Algorithm // Tipo específico para algoritmo
      } as jwt.SignOptions // Asegurar el tipo de las opciones
    );
  };

export const login = async (req: Request, res: Response) => {
  try {
    // Validar datos de entrada
    const result = loginSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: result.error.flatten()
      });
    }

    const { email, password } = result.data;

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken(usuario.id);

    // Excluir contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = usuario;

    res.json({
      ...userWithoutPassword,
      id: userWithoutPassword.id.toString(),
      token
    });

  } catch (error: any) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      detalles: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

