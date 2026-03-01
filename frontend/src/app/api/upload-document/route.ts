import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    // Solo permitir PDFs
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Solo se permiten archivos PDF' }, { status: 400 });
    }

    // Límite de 5MB para PDFs
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'El PDF no debe superar 5MB' }, { status: 400 });
    }

    const extension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${extension}`;
    const buffer = await file.arrayBuffer();

    // Usar un bucket específico para documentos (ej. 'documentos')
    const { error } = await supabaseAdmin.storage
      .from('documentos-rc05')  // Asegúrate de tener este bucket creado
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (error) {
      console.error('Error al subir documento:', error);
      return NextResponse.json({ error: 'Error al subir el documento' }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('documentos-rc05')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error('Error en upload-document:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}