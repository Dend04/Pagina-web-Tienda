import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: Request) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (user.rol !== 'comercial') {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from('historial_compras')
    .select('*, usuarios(nombre_usuario, correo)')
    .order('fecha', { ascending: false });

  if (error) throw error;
  return NextResponse.json(data);
}