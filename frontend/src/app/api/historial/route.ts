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
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.rol !== 'comercial') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('historial_compras')
      .select('*, usuarios(nombre_usuario, correo)')
      .order('fecha', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en admin/historial:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}