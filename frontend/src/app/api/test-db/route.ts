import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  // ⏱️ Controlador de timeout: 5 segundos máximo
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    )

    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .limit(1)
      .abortSignal(controller.signal) // Vincula el timeout

    clearTimeout(timeoutId)

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        hint: 'Revisa tabla productos y RLS'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data,
      message: '✅ Conexión exitosa (rápida)'
    })

  } catch (error: any) {
    clearTimeout(timeoutId)
    
    // 🚨 Error específico de timeout
    if (error.name === 'AbortError') {
      return NextResponse.json({
        success: false,
        error: '⏰ Timeout: No se pudo conectar a Supabase en 5 segundos. Verifica tu conexión a internet o usa una VPN.',
        hint: 'Desde Cuba es recomendable usar VPN o probar directamente en Render.'
      }, { status: 504 })
    }

    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error desconocido'
    }, { status: 500 })
  }
}