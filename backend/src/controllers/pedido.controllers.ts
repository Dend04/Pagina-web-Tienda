import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPedido = async (req: Request, res: Response) => {
  const { usuario_id, estado, detalles } = req.body;
  
  try {
    const pedido = await prisma.pedido.create({
      data: {
        usuario_id: BigInt(usuario_id),
        estado,
        detalles: {
          create: detalles.map((d: any) => ({
            producto_id: BigInt(d.producto_id),
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario
          }))
        }
      },
      include: { detalles: true }
    });
    
    res.status(201).json(pedido);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear pedido' });
  }
};

export const getPedidosByUsuario = async (req: Request, res: Response) => {
  const { usuarioId } = req.params;
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { usuario_id: BigInt(usuarioId) },
      include: { detalles: true }
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

export const updateEstadoPedido = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { estado } = req.body;
    
    try {
      const pedido = await prisma.pedido.update({
        where: { id: BigInt(id) },
        data: { estado }
      });
      res.json(pedido);
    } catch (error) {
      res.status(400).json({ error: 'Error actualizando estado' });
    }
  };