import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('modul');

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diupload' }, { status: 400 });
    }

    // Validasi ukuran (max 15 MB)
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file maksimal 15 MB' }, { status: 400 });
    }

    const fileName = file.name || '';
    const isPdf = fileName.endsWith('.pdf') || file.type === 'application/pdf';
    const isDocx = fileName.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isPdf && !isDocx) {
      return NextResponse.json({ error: 'File harus berformat PDF atau DOCX' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';

    if (isPdf) {
      text = await parsePdf(buffer);
    } else {
      text = await parseDocx(buffer);
    }

    if (!text || text.trim().length < 20) {
      return NextResponse.json({ error: 'Tidak dapat membaca teks dari file. Pastikan file tidak kosong atau terproteksi.' }, { status: 422 });
    }

    // Trim & limit to avoid token overflow
    const maxChars = 30000;
    const trimmed = text.trim().slice(0, maxChars);

    return NextResponse.json({
      success: true,
      fileName,
      text: trimmed,
      charCount: trimmed.length,
    });

  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json({ error: 'Gagal membaca file: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}

/* ── PDF Parser ── */
async function parsePdf(buffer) {
  // Dynamic import karena pdf-parse punya side effects
  const pdfParse = (await import('pdf-parse')).default;
  const data = await pdfParse(buffer, {
    pagerender: renderPage,
  });
  return data.text || '';
}

function renderPage(pageData) {
  const renderOptions = {
    normalizeWhitespace: true,
    disableCombineTextItems: false,
  };
  return pageData.getTextContent(renderOptions).then(function (textContent) {
    let lastY, text = '';
    for (const item of textContent.items) {
      if (lastY !== item.transform[5] && text.length > 0) text += '\n';
      text += item.str;
      lastY = item.transform[5];
    }
    return text;
  });
}

/* ── DOCX Parser ── */
async function parseDocx(buffer) {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
}
