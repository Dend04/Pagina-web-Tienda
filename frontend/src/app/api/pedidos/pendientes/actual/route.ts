import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: Request) {
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
    .from('pedidos_pendientes')
    .select('*')
    .eq('usuario_id', usuarioId)
    .eq('estado', 'pendiente')
    .gte('expira_en', new Date().toISOString())
    .order('fecha', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error obteniendo pedido actual:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }

  return NextResponse.json({ pedido: data || null });
}