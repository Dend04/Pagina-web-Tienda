import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún PDF' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'El archivo debe ser un PDF' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fullText = await new Promise<string>((resolve, reject) => {
      // ✅ Quitamos el segundo argumento numérico (o lo cambiamos por undefined)
      const pdfParser = new PDFParser(null); 

      pdfParser.on('pdfParser_dataError', (errData: any) => {
        reject(errData.parserError);
      });

      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        let text = '';
        pdfData.Pages.forEach((page) => {
          page.Texts.forEach((textItem) => {
            textItem.R.forEach((r) => {
              text += decodeURIComponent(r.T) + ' ';
            });
          });
          text += '\n';
        });
        resolve(text);
      });

      pdfParser.parseBuffer(buffer);
    });

    const nitMatch = fullText.match(/NIT:\s*(\d+)/);
    const nombreMatch = fullText.match(/Nombre:\s*(.+)/);
    const provinciaMatch = fullText.match(/Provincia:\s*(.+)/);
    const municipioMatch = fullText.match(/Municipio:\s*(.+)/);

    return NextResponse.json({
      nit: nitMatch ? nitMatch[1].trim() : '',
      nombreNegocio: nombreMatch ? nombreMatch[1].trim() : '',
      provincia: provinciaMatch ? provinciaMatch[1].trim() : '',
      municipio: municipioMatch ? municipioMatch[1].trim() : '',
    });
  } catch (error) {
    console.error('Error extracting PDF:', error);
    return NextResponse.json({ error: 'Error al procesar el PDF' }, { status: 500 });
  }
}