import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: Request) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const usuarioId = user.id;

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