// src/controllers/notificacion.controllers.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";

const prisma = new PrismaClient();

const notificacionSchema = z.object({
  tipo: z.enum(["STOCK_BAJO", "FAVORITO_DISPONIBLE", "PROMOCION"]),
  usuarioId: z.string().min(1),
  productoId: z.string().min(1),
  mensaje: z.string().optional()
});

export const createNotificacion = async (req: Request, res: Response) => {
  try {
    const result = notificacionSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: "Datos inválidos",
        detalles: result.error.flatten()
      });
    }

    const { tipo, usuarioId, productoId, mensaje } = result.data;

    const notificacion = await prisma.notificacion.create({
      data: {
        tipo,
        usuario_id: BigInt(usuarioId),
        producto_id: BigInt(productoId),
        mensaje
      }
    });

    res.status(201).json({
      ...notificacion,
      id: notificacion.id.toString(),
      usuario_id: notificacion.usuario_id.toString(),
      producto_id: notificacion.producto_id.toString()
    });

  } catch (error) {
    console.error("Error en createNotificacion:", error);
    res.status(500).json({ 
      error: "Error al crear notificación",
      detalles: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};

export const getNotificacionesByUsuario = async (req: Request, res: Response) => {
  const { usuarioId } = req.params;

  try {
    const notificaciones = await prisma.notificacion.findMany({
      where: { usuario_id: BigInt(usuarioId) },
      orderBy: { fecha_envio: "desc" },
      include: { producto: true }
    });

    const response = notificaciones.map(n => ({
      ...n,
      id: n.id.toString(),
      usuario_id: n.usuario_id.toString(),
      producto_id: n.producto_id.toString(),
      producto: n.producto ? {
        ...n.producto,
        id: n.producto.id.toString(),
        precio: Number(n.producto.precio),
        costo: Number(n.producto.costo)
      } : null
    }));

    res.json(response);

  } catch (error) {
    console.error("Error en getNotificacionesByUsuario:", error);
    res.status(500).json({ 
      error: "Error al obtener notificaciones",
      detalles: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};

export const deleteNotificacion = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.notificacion.delete({
      where: { id: BigInt(id) }
    });

    res.status(204).send();

  } catch (error: any) {
    console.error("Error en deleteNotificacion:", error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }
    
    res.status(500).json({ 
      error: "Error al eliminar notificación",
      detalles: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};