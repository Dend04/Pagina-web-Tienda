import { Request } from 'express';
import { ApiResponse } from '../types/express';
import { PrismaClient, Producto } from '@prisma/client';
import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

// Esquemas de validación
const productoCreateSchema = z.object({
  nombre: z.string().min(3),
  descripcion: z.string().optional(),
  precio: z.number().positive(),
  costo: z.number().positive(),
  foto_url: z.string().url().optional(),
  uso: z.string().optional()
})

const productoUpdateSchema = productoCreateSchema.partial();

export const getProductos = async (
  req: Request,
  res: ApiResponse
): Promise<ApiResponse> => {
  try {
    const productos = await prisma.producto.findMany({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio: true,
        costo: true,
        foto_url: true,
        uso: true
      }
    });

    const response = productos.map(p => ({
      ...p,
      id: p.id.toString(),
      precio: Number(p.precio),
      costo: Number(p.costo)
    }));

    return res.json(response);

  } catch (error : any) {
    console.error('Error en getProductos:', error);
    return res.status(500).json({ 
      error: 'Error al obtener productos',
      detalles: process.env.NODE_ENV === "development" ? error.message : null
    });
  }
};

export const createProducto = async (
  req: Request,
  res: ApiResponse
): Promise<ApiResponse> => {
  try {
    // Validación de datos
    const result = productoCreateSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: result.error.flatten()
      });
    }

    const productoData = result.data;

    // Crear producto
    const nuevoProducto = await prisma.producto.create({
      data: {
        ...productoData,
        precio: productoData.precio,
        costo: productoData.costo
      }
    });

    return res.status(201).json({
      ...nuevoProducto,
      id: nuevoProducto.id.toString(),
      precio: Number(nuevoProducto.precio),
      costo: Number(nuevoProducto.costo)
    });

  } catch (error: any) {
    console.error('Error en createProducto:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Conflicto de datos',
        detalles: 'El producto ya existe'
      });
    }
    
    return res.status(500).json({
      error: 'Error interno del servidor',
      detalles: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

export const updateProducto = async (
  req: Request,
  res: ApiResponse
): Promise<ApiResponse> => {
  try {
    const { id } = req.params;
    
    // Validar ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }

    // Validar datos
    const result = productoUpdateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: result.error.flatten()
      });
    }

    // Verificar existencia
    const productoExistente = await prisma.producto.findUnique({
      where: { id: BigInt(id) }
    });

    if (!productoExistente) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar
    const productoActualizado = await prisma.producto.update({
      where: { id: BigInt(id) },
      data: result.data
    });

    return res.json({
      ...productoActualizado,
      id: productoActualizado.id.toString(),
      precio: Number(productoActualizado.precio),
      costo: Number(productoActualizado.costo)
    });

  } catch (error: any) {
    console.error('Error en updateProducto:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    return res.status(500).json({
      error: 'Error interno del servidor',
      detalles: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

export const deleteProducto = async (
  req: Request,
  res: ApiResponse
): Promise<ApiResponse> => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }

    // Verificar existencia
    const productoExistente = await prisma.producto.findUnique({
      where: { id: BigInt(id) }
    });

    if (!productoExistente) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Eliminar
    await prisma.producto.delete({
      where: { id: BigInt(id) }
    });

    return res.status(204).send();

  } catch (error: any) {
    console.error('Error en deleteProducto:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    if (error.code === 'P2003') {
      return res.status(409).json({
        error: 'No se puede eliminar el producto',
        detalles: 'Existen pedidos asociados a este producto'
      });
    }
    
    return res.status(500).json({
      error: 'Error interno del servidor',
      detalles: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

export const getProductoById = async (
  req: Request,
  res: ApiResponse
): Promise<ApiResponse> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }

    const producto = await prisma.producto.findUnique({
      where: { id: BigInt(id) },
      include: {
        favoritos: true,
        pedidos: true,
        notificaciones: true
      }
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const vecesComprado = producto.pedidos.reduce(
      (total, detalle) => total + detalle.cantidad, 0
    );

    const response: Producto = {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Decimal(producto.precio),
      costo: Decimal(producto.costo),
      foto_url: producto.foto_url,
      uso: producto.uso,
      veces_comprado: producto.veces_comprado,
      veces_comprado_usuario: producto.veces_comprado_usuario
    };

    return res.json(response);

  } catch (error: any) {
    console.error('Error en getProductoById:', error);
    return res.status(500).json({ 
      error: 'Error al obtener producto',
      detalles: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};