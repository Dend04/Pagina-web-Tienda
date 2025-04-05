import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types/express';
import { z } from 'zod';

const prisma = new PrismaClient();


const usuarioSchema = z.object({
  nombre: z.string().min(3),
  username: z.string().min(3).regex(/^[a-z0-9_]+$/i),
  email: z.string().email(),
  direccion: z.string().min(5),
  rol: z.enum(['admin', 'usuario']),
  telefono: z.string().regex(/^\d+$/).optional()
});

export const getUsuarios = async (
  req: Request,
  res: ApiResponse
): Promise<ApiResponse> => {
  try {
    const usuarios = await prisma.usuario.findMany();
    const response = usuarios.map(usuario => ({
      ...usuario,
      id: usuario.id.toString()
    }));
    return res.json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};


export const getUsuarioById = async (req: Request, res: Response) => {
  try {
  const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({
      where: { id: BigInt(id) },
      include: { pedidos: true, notificaciones: true }
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Usuario no encontrado' });
  }
};

export const createUsuario = async (
  req: Request,
  res: ApiResponse
): Promise<ApiResponse> => {
  try {
    // 1. Validar el cuerpo de la solicitud
    const result = usuarioSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: result.error.flatten()
      });
    }

    const { nombre, username, email, direccion, rol, telefono } = result.data;

    // 2. Verificar unicidad antes de crear
    const existeUsuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existeUsuario) {
      return res.status(409).json({
        error: 'El usuario ya existe',
        campoConflictivo: existeUsuario.username === username ? 'username' : 'email'
      });
    }

    // 3. Crear el usuario
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        username,
        email,
        direccion,
        rol,
        telefono: telefono || null
      }
    });

    // 4. Responder con formato consistente
    return res.status(201).json({
      ...usuario,
      id: usuario.id.toString()
    });

  } catch (error: any) {
    console.error('Error en createUsuario:', error);

    // Manejo específico de errores de Prisma
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Conflicto de datos',
        detalles: `El ${error.meta?.target?.[0]} ya está en uso`
      });
    }

    // Error general del servidor
    return res.status(500).json({
      error: 'Error interno del servidor',
      detalles: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

export const updateUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, username, email, direccion, rol, telefono } = req.body;
    
    try {
      const usuario = await prisma.usuario.update({
        where: { id: BigInt(id) },
        data: { nombre, username, email, direccion, rol, telefono }
      });
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ error: 'Error actualizando usuario' });
    }
  };
  
  export const deleteUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.usuario.delete({
        where: { id: BigInt(id) }
      });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Error eliminando usuario' });
    }
  };


