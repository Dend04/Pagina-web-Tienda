import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    if (user.rol !== 'comercial') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('pedidos_pendientes')
      .select('*, usuarios(nombre_usuario, correo)')
      .eq('estado', 'pendiente')
      .gte('expira_en', new Date().toISOString())
      .order('fecha', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ pedidos: data });
  } catch (error) {
    console.error('Error cargando pendientes:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 });
    }

    const { items, total } = body;
    if (!items || !Array.isArray(items) || typeof total !== 'number') {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const usuarioId = user.id;

    const { data: existente } = await supabaseAdmin
      .from('pedidos_pendientes')
      .select('id')
      .eq('usuario_id', usuarioId)
      .eq('estado', 'pendiente')
      .gte('expira_en', new Date().toISOString())
      .maybeSingle();

    if (existente) {
      return NextResponse.json({ error: 'Ya tienes un pedido pendiente' }, { status: 400 });
    }

    const expira_en = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const { data, error } = await supabaseAdmin
      .from('pedidos_pendientes')
      .insert({
        usuario_id: usuarioId,
        items,
        total,
        expira_en,
        estado: 'pendiente',
      })
      .select()
      .single();

    if (error) {
      console.error('Error insertando pedido:', error);
      return NextResponse.json({ error: 'Error al guardar el pedido' }, { status: 500 });
    }

    return NextResponse.json({ success: true, pedido: data });
  } catch (error) {
    console.error('Error inesperado:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}