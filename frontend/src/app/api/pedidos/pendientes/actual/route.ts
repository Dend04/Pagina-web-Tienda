import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: Request) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const usuarioId = user.id;

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