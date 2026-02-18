import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const { items, total } = await request.json();
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let usuarioId: number;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      usuarioId = decoded.id;
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('historial_compras')
      .insert({
        usuario_id: usuarioId,
        items,
        total,
        estado: 'pendiente',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, pedido: data });
  } catch (error) {
    console.error('Error guardando historial:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}