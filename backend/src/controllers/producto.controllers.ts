import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type ProductoDetallado = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  costo: number;
  foto_url: string | null;
  uso: string | null;
  veces_comprado: number;
  es_favorito: boolean;
};

export const getProductos = async (req: Request, res: Response) => {
  try {
    const productos = await prisma.producto.findMany();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const createProducto = async (req: Request, res: Response) => {
  const { nombre, descripcion, precio, costo, foto_url, uso } = req.body;
  try {
    const producto = await prisma.producto.create({
      data: { nombre, descripcion, precio, costo, foto_url, uso },
    });
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: "Error al crear producto" });
  }
};

export const updateProducto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, costo, foto_url, uso } = req.body;

  try {
    const producto = await prisma.producto.update({
      where: { id: BigInt(id) },
      data: {
        nombre,
        descripcion,
        precio: Number(precio),
        costo: Number(costo),
        foto_url,
        uso,
      },
    });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: "Error actualizando producto" });
  }
};

export const deleteProducto = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.producto.delete({
      where: { id: BigInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Error eliminando producto" });
  }
};

export const getProductoById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    try {
      const producto = await prisma.producto.findUnique({
        where: { id: BigInt(id) },
        include: {
          favoritos: true,
          detalle_pedidos: true,
          notificaciones: true
        }
      });
  
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      const vecesComprado = producto.detalle_pedidos.reduce(
        (total, detalle) => total + detalle.cantidad, 0
      );
  
      const response = {
        ...producto,
        id: producto.id.toString(),
        precio: Number(producto.precio),
        costo: Number(producto.costo),
        veces_comprado: vecesComprado,
        es_favorito: producto.favoritos.length > 0
      };
  
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener producto' });
    }
  };
// Resto de operaciones CRUD...
