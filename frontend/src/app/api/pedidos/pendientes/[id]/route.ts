import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { accion } = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let rol: string;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      rol = decoded.rol;
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (rol !== 'comercial') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    // Obtener el pedido pendiente
    const { data: pendiente, error: findError } = await supabaseAdmin
      .from('pedidos_pendientes')
      .select('*')
      .eq('id', numericId)
      .single();

    if (findError || !pendiente) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    if (pendiente.estado !== 'pendiente') {
      return NextResponse.json({ error: 'El pedido ya fue procesado' }, { status: 400 });
    }

    // Verificar que no haya expirado
    if (new Date(pendiente.expira_en) < new Date()) {
      // Eliminar el expirado
      await supabaseAdmin.from('pedidos_pendientes').delete().eq('id', numericId);
      return NextResponse.json({ error: 'El pedido ha expirado' }, { status: 410 });
    }

    if (accion === 'aceptar') {
      // Mover a historial
      const { error: insertError } = await supabaseAdmin
        .from('historial_compras')
        .insert({
          usuario_id: pendiente.usuario_id,
          items: pendiente.items,
          total: pendiente.total,
          estado: 'entregado',
        });

      if (insertError) throw insertError;

      // Eliminar el pendiente
      await supabaseAdmin
        .from('pedidos_pendientes')
        .delete()
        .eq('id', numericId);

      return NextResponse.json({ success: true, message: 'Pedido aceptado y movido a historial' });
    } 
    else if (accion === 'rechazar') {
      // Simplemente eliminar
      await supabaseAdmin
        .from('pedidos_pendientes')
        .delete()
        .eq('id', numericId);

      return NextResponse.json({ success: true, message: 'Pedido rechazado y eliminado' });
    } 
    else {
      return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error procesando pedido:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}