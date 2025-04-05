// src/controllers/favorito.controllers.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const addToFavorites = async (req: Request, res: Response) => {
  const { usuarioId, productoId } = req.params;

  try {
    // Verificar existencia de usuario y producto
    const [usuario, producto] = await Promise.all([
      prisma.usuario.findUnique({ where: { id: BigInt(usuarioId) } }),
      prisma.producto.findUnique({ where: { id: BigInt(productoId) } })
    ]);

    if (!usuario || !producto) {
      return res.status(404).json({ error: "Usuario o producto no encontrado" });
    }

    const favorito = await prisma.favorito.create({
      data: {
        usuario_id: BigInt(usuarioId),
        producto_id: BigInt(productoId)
      }
    });

    res.status(201).json({
      ...favorito,
      id: favorito.id.toString(),
      usuario_id: favorito.usuario_id.toString(),
      producto_id: favorito.producto_id.toString()
    });

  } catch (error: any) {
    console.error("Error en addToFavorites:", error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({ error: "El producto ya está en favoritos" });
    }
    
    res.status(500).json({ 
      error: "Error al agregar a favoritos",
      detalles: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};

export const removeFromFavorites = async (req: Request, res: Response) => {
  const { usuarioId, productoId } = req.params;

  try {
    await prisma.favorito.deleteMany({
      where: {
        usuario_id: BigInt(usuarioId),
        producto_id: BigInt(productoId)
      }
    });

    res.status(204).send();

  } catch (error) {
    console.error("Error en removeFromFavorites:", error);
    res.status(500).json({ 
      error: "Error al eliminar de favoritos",
      detalles: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};

export const getFavoritosByUsuario = async (req: Request, res: Response) => {
  const { usuarioId } = req.params;

  try {
    const favoritos = await prisma.favorito.findMany({
      where: { usuario_id: BigInt(usuarioId) },
      include: { producto: true }
    });

    const response = favoritos.map(f => ({
      ...f,
      id: f.id.toString(),
      usuario_id: f.usuario_id.toString(),
      producto_id: f.producto_id.toString(),
      producto: {
        ...f.producto,
        id: f.producto.id.toString(),
        precio: Number(f.producto.precio),
        costo: Number(f.producto.costo)
      }
    }));

    res.json(response);

  } catch (error) {
    console.error("Error en getFavoritosByUsuario:", error);
    res.status(500).json({ 
      error: "Error al obtener favoritos",
      detalles: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};