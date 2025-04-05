import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const createPedido = async (req: Request, res: Response) => {
  const { usuario_id, producto_id, cantidad, precio_unitario, estado } = req.body;

  // Validar campos requeridos
  if (!usuario_id || !producto_id || !cantidad || !precio_unitario || !estado) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const pedido = await prisma.pedido.create({
      data: {
        usuario_id: BigInt(usuario_id),
        producto_id: BigInt(producto_id),
        cantidad: Number(cantidad),
        precio_unitario: new Decimal(Number(precio_unitario)),
        estado,
      },
    });

    // Convertir BigInt a string para respuesta JSON
    res.status(201).json({
      ...pedido,
      id: pedido.id.toString(),
      usuario_id: pedido.usuario_id.toString(),
      producto_id: pedido.producto_id.toString(),
      precio_unitario: pedido.precio_unitario.toNumber()
    });
    
  } catch (error) {
    console.error("Error en createPedido:", error);
    res.status(500).json({ 
      error: "Error al crear pedido",
      detalles: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};

export const getPedidosByUsuario = async (req: Request, res: Response) => {
  const { usuarioId } = req.params;
  
  // Validar ID
  if (!usuarioId || isNaN(Number(usuarioId))) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    // Verificar existencia del usuario primero
    const usuario = await prisma.usuario.findUnique({
      where: { id: BigInt(usuarioId) }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const pedidos = await prisma.pedido.findMany({
      where: { usuario_id: BigInt(usuarioId) },
    });

    if (pedidos.length === 0) {
      return res.status(200).json({
        message: "El usuario no tiene pedidos registrados",
        pedidos: []
      });
    }

    const response = pedidos.map(pedido => ({
      ...pedido,
      id: pedido.id.toString(),
      usuario_id: pedido.usuario_id.toString(),
      producto_id: pedido.producto_id.toString(),
      precio_unitario: pedido.precio_unitario.toNumber()
    }));

    res.json(response);
    
  } catch (error) {
    console.error("Error en getPedidosByUsuario:", error);
    res.status(500).json({ 
      error: "Error al obtener pedidos",
      detalles: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};

export const updateEstadoPedido = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { estado } = req.body;

  // Validar ID
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "ID de pedido inválido" });
  }

  try {
    const pedido = await prisma.pedido.update({
      where: { id: BigInt(id) },
      data: { estado },
    });

    res.json({
      ...pedido,
      id: pedido.id.toString(),
      usuario_id: pedido.usuario_id.toString(),
      producto_id: pedido.producto_id.toString(),
      precio_unitario: pedido.precio_unitario.toNumber()
    });
  } catch (error) {
    console.error("Error en updateEstadoPedido:", error);
    
    // Manejar error de registro no encontrado
    if (error instanceof Error && error.message.includes("RecordNotFound")) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    
    res.status(500).json({ 
      error: "Error actualizando estado",
      detalles: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};
