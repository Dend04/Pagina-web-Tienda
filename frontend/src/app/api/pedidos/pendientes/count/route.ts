import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Solo comercial puede ver el contador
    if (decoded.rol !== 'comercial') {
      return NextResponse.json({ count: 0 });
    }

    const { count, error } = await supabaseAdmin
      .from('pedidos_pendientes')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'pendiente')
      .gte('expira_en', new Date().toISOString());

    if (error) throw error;

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error obteniendo conteo de pendientes:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}