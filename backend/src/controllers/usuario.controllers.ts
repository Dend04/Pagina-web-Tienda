import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const getUsuarioById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: BigInt(id) },
      include: { pedidos: true, notificaciones: true }
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Usuario no encontrado' });
  }
};

export const createUsuario = async (req: Request, res: Response) => {
  const { nombre, username, email, direccion, rol, telefono } = req.body;
  try {
    const usuario = await prisma.usuario.create({
      data: { nombre, username, email, direccion, rol, telefono }
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear usuario' });
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

// Actualizar y eliminar similares...