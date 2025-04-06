import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

interface CartItem {
  id: string;
  producto: {
    id: string;
    nombre: string;
    precio: Decimal;
    foto_url?: string;
  };
  cantidad: number;
  precioUnitario: Decimal;
}

// Función de mapeo como función independiente
const mapCartItem = (item: any): CartItem => {
  return {
    id: item.id.toString(),
    producto: {
      id: item.producto.id.toString(),
      nombre: item.producto.nombre,
      precio: item.producto.precio,
      foto_url: item.producto.foto_url || undefined,
    },
    cantidad: item.cantidad,
    precioUnitario: item.precioUnitario,
  };
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { productoId } = req.body;

    const producto = await prisma.producto.findUnique({
      where: { id: BigInt(productoId) },
    });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const carrito = await prisma.carrito.upsert({
      where: { usuarioId: userId },
      create: {
        usuarioId: userId,
        items: {
          create: {
            productoId: BigInt(productoId),
            cantidad: 1,
            precioUnitario: producto.precio,
          },
        },
      },
      update: {},
      include: { items: true },
    });

    const item = await prisma.carritoItem.upsert({
      where: {
        carritoId_productoId: {
          carritoId: carrito.id,
          productoId: BigInt(productoId),
        },
      },
      create: {
        carritoId: carrito.id,
        productoId: BigInt(productoId),
        cantidad: 1,
        precioUnitario: producto.precio,
      },
      update: {
        cantidad: { increment: 1 },
      },
      include: { producto: true },
    });

    res.json(mapCartItem(item)); // Usar función directamente
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Resto de funciones actualizadas usando mapCartItem sin 'this'
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { itemId } = req.params;
    const { operation } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const item = await prisma.carritoItem.findFirst({
      where: {
        id: BigInt(itemId),
        carrito: { usuarioId: userId },
      },
    });

    if (!item) {
      return res.status(404).json({ error: "Ítem no encontrado" });
    }

    const updatedItem = await prisma.carritoItem.update({
      where: { id: BigInt(itemId) },
      data: {
        cantidad:
          operation === "increment" ? { increment: 1 } : { decrement: 1 },
      },
      include: { producto: true },
    });

    res.json(mapCartItem(updatedItem)); // Corregido
  } catch (error) {
    console.error("Error al actualizar ítem:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getUserCart = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const carrito = await prisma.carrito.findUnique({
      where: { usuarioId: userId },
      include: {
        items: {
          include: { producto: true },
          orderBy: { creadoEn: "desc" },
        },
      },
    });

    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json({
      ...carrito,
      id: carrito.id.toString(),
      items: carrito.items.map((item) => mapCartItem(item)), // Corregido
    });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const { itemId } = req.params;
  
      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }
  
      // Verificar existencia y propiedad del ítem
      const item = await prisma.carritoItem.findFirst({
        where: {
          id: BigInt(itemId),
          carrito: { usuarioId: userId }
        },
        include: { producto: true }
      });
  
      if (!item) {
        return res.status(404).json({ error: 'Ítem no encontrado en el carrito' });
      }
  
      // Eliminar el ítem
      await prisma.carritoItem.delete({
        where: { id: BigInt(itemId) }
      });
  
      // Devolver el ítem eliminado para feedback
      res.json({
        message: 'Producto eliminado del carrito',
        deletedItem: mapCartItem(item)
      });
  
    } catch (error: any) {
      console.error('Error al eliminar del carrito:', error);
      
      // Manejar error específico de Prisma
      if (error instanceof Error && error.message.includes('RecordNotFound')) {
        return res.status(404).json({ error: 'El ítem ya no existe' });
      }
      
      res.status(500).json({ 
        error: 'Error al eliminar del carrito',
        detalles: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  };