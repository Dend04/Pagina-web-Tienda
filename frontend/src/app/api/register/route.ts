// /api/register/route.ts
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rateLimit';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = checkRateLimit(clientIp, RATE_LIMITS.REGISTER);
    
    if (rateLimitResult.isLimited) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Demasiados registros. Intenta de nuevo más tarde',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000))
          }
        }
      );
    }

    const { 
      username, email, password, telefono, direccion, rol, imagen,
      nit, nombre_negocio, provincia, municipio,
      documento_url, tipo_documento // nuevo: tipo_documento para clasificar
    } = await request.json();

    // Validaciones...
    if (!username || !email || !password) {
      return NextResponse.json({ success: false, error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Verificar si ya existe
    const { data: existing } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .or(`nombre_usuario.eq.${username},correo.eq.${email}`)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: false, error: 'Usuario ya existe' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const { data: newUser, error: userError } = await supabaseAdmin
      .from('usuarios')
      .insert([{
        nombre_usuario: username,
        correo: email,
        contrasena: hashedPassword,
        rol: rol || 'cliente',
        telefono: telefono || null,
        direccion: direccion || null,
        imagen: imagen || null,
        nit: nit || null,
        nombre_negocio: nombre_negocio || null,
        provincia: provincia || null,
        municipio: municipio || null,
      }])
      .select('id, nombre_usuario, correo, rol, imagen')
      .single();

    if (userError) {
      console.error('Error insertando usuario:', userError);
      return NextResponse.json({ success: false, error: 'No se pudo crear el usuario' }, { status: 500 });
    }

    // Si hay documento, insertarlo en la tabla documentos
    let documentoGuardado = null;
    if (documento_url && newUser) {
      const { data: docData, error: docError } = await supabaseAdmin
        .from('documentos')
        .insert([{
          usuario_id: newUser.id,
          tipo_documento: tipo_documento || 'rc05',
          nombre_archivo: '',
          url: documento_url,
          mime_type: null,
          tamano: null,
          metadatos: null,
        }])
        .select()
        .single();

      if (docError) {
        console.error('Error insertando documento:', docError);
        // Notificar el error pero no revertir el usuario
        return NextResponse.json({
          success: true,
          message: 'Usuario creado correctamente, pero hubo un error al guardar el documento',
          user: newUser,
          documento_error: 'Error al guardar el documento: ' + docError.message,
        });
      }
      documentoGuardado = docData;
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario creado correctamente',
      user: newUser,
      documento: documentoGuardado,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}