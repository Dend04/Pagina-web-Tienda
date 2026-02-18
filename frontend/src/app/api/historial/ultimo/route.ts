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

  const { data } = await supabaseAdmin
    .from('historial_compras')
    .select('*')
    .eq('usuario_id', usuarioId)
    .eq('estado', 'pendiente')
    .order('fecha', { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({ pedido: data });
}