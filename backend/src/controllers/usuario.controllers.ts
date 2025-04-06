import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../types/express";
import bcrypt from 'bcryptjs';
import { z } from "zod";

const prisma = new PrismaClient();

const usuarioSchema = z.object({
  nombre: z.string().min(3),
  username: z
    .string()
    .min(3)
    .regex(/^[a-z0-9_]+$/i),
  email: z.string().email(),
  password: z.string().min(6),
  direccion: z.string().min(5),
  rol: z.enum(["admin", "usuario"]),
  telefono: z.string().regex(/^\d+$/).optional(),
});

export const getUsuarios = async (
  req: Request,
  res: ApiResponse
): Promise<ApiResponse> => {
  try {
    const usuarios = await prisma.usuario.findMany();
    const response = usuarios.map((usuario) => ({
      ...usuario,
      id: usuario.id.toString(),
    }));
    return res.json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({
      where: { id: BigInt(id) },
      include: { pedidos: true, notificaciones: true },
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Usuario no encontrado" });
  }
};

export const createUsuario = async (
  req: Request,
  res: ApiResponse
): Promise<ApiResponse> => {
  try {
    const result = usuarioSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Datos inválidos",
        detalles: result.error.flatten(),
      });
    }

    const { nombre, username, password, email, direccion, rol, telefono } = result.data;

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    const existeUsuario = await prisma.usuario.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existeUsuario) {
      return res.status(409).json({
        error: "El usuario ya existe",
        campoConflictivo: existeUsuario.username === username ? "username" : "email",
      });
    }

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        username,
        password: hashedPassword, // Usar la contraseña hasheada
        email,
        direccion,
        rol,
        telefono: telefono || null,
        Carrito: {
          create: {} // Crear carrito vacío automáticamente
        }
      },
      include: {
        Carrito: true
      }
    });

    return res.status(201).json({
      ...usuario,
      id: usuario.id.toString(),
    });
    
  } catch (error: any) {
    console.error("Error en createUsuario:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Conflicto de datos",
        detalles: `El ${error.meta?.target?.[0]} ya está en uso`,
      });
    }

    return res.status(500).json({
      error: "Error interno del servidor",
      detalles: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

export const updateUsuario = async (
  req: Request,
  res: ApiResponse
): Promise<ApiResponse> => {
  try {
    const { id } = req.params;

    // 1. Validar ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    // 2. Validar cuerpo de la solicitud
    const result = usuarioSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Datos inválidos",
        detalles: result.error.flatten(),
      });
    }

    const updateData = result.data;

    // 3. Verificar existencia de usuario
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: BigInt(id) },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 4. Verificar unicidad de campos únicos
    if (updateData.username || updateData.email) {
      const conflicto = await prisma.usuario.findFirst({
        where: {
          AND: [
            { id: { not: BigInt(id) } },
            {
              OR: [
                { username: updateData.username },
                { email: updateData.email },
              ],
            },
          ],
        },
      });

      if (conflicto) {
        return res.status(409).json({
          error: "Conflicto de datos",
          campo:
            conflicto.username === updateData.username ? "username" : "email",
        });
      }
    }

    // 5. Actualizar usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    return res.json({
      ...usuarioActualizado,
      id: usuarioActualizado.id.toString(),
    });
  } catch (error: any) {
    console.error("Error en updateUsuario:", error);

    // Manejo de errores específicos de Prisma
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Dato único ya existe",
        campo: error.meta?.target?.[0],
      });
    }

    return res.status(500).json({
      error: "Error interno del servidor",
      detalles: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

export const deleteUsuario = async (
  req: Request,
  res: ApiResponse
): Promise<ApiResponse> => {
  try {
    const { id } = req.params;

    // 1. Validar ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    // 2. Verificar existencia del usuario
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: BigInt(id) },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 3. Eliminar usuario
    await prisma.usuario.delete({
      where: { id: BigInt(id) },
    });

    return res.status(204).send();
  } catch (error: any) {
    console.error("Error en deleteUsuario:", error);

    // Manejo de errores específicos
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (error.code === "P2003") {
      return res.status(409).json({
        error: "No se puede eliminar el usuario",
        detalles: "Existen registros relacionados en el sistema",
      });
    }

    return res.status(500).json({
      error: "Error interno del servidor",
      detalles: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};
