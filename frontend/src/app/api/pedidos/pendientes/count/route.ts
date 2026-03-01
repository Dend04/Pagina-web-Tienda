import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ count: 0 });
    }
    
    // Solo comercial puede ver el contador
    if (user.rol !== 'comercial') {
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