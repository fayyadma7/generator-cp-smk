import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 120;

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

    // AI extraction of header fields from the modul text
    let header = null;
    try {
      header = await extractHeaderWithAI(trimmed);
    } catch (aiErr) {
      console.error('AI header extraction failed (non-fatal):', aiErr.message);
      // Non-fatal — return text even if AI extraction fails
    }

    return NextResponse.json({
      success: true,
      fileName,
      text: trimmed,
      charCount: trimmed.length,
      header, // null if extraction failed
    });

  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json({ error: 'Gagal membaca file: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}

/* ═══════════════════════════════════════════════
   AI HEADER EXTRACTION
   ═══════════════════════════════════════════════ */

async function extractHeaderWithAI(modulText) {
  const apiKeys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY
  ].filter(Boolean);

  if (apiKeys.length === 0) return null;

  const systemPrompt = `Anda adalah asisten yang mengekstrak informasi dari dokumen Modul Ajar.
Gunakan bahasa Indonesia. Output HANYA JSON valid tanpa markdown atau teks lain.
Jika suatu field tidak ditemukan di dokumen, isi dengan string kosong "".`;

  const userPrompt = `Ekstrak informasi berikut dari teks modul ajar di bawah. Untuk setiap field, cari nilai yang paling sesuai:

- namaSekolah: Nama sekolah/madrasah
- mataPelajaran: Mata pelajaran
- kodeModul: Kode modul (jika ada)
- judulModul: Judul modul / tema
- nomorTP: Nomor Tujuan Pembelajaran (jika ada)
- faseKelas: Fase dan kelas (contoh: Fase E / Kelas X)
- semester: Semester (Ganjil/Genap)
- tahunPelajaran: Tahun pelajaran (contoh: 2025/2026)
- namaGuru: Nama guru pengampu

Output JSON:
{
  "namaSekolah": "",
  "mataPelajaran": "",
  "kodeModul": "",
  "judulModul": "",
  "nomorTP": "",
  "faseKelas": "",
  "semester": "",
  "tahunPelajaran": "",
  "namaGuru": ""
}

=== TEKS MODUL ===
${modulText.slice(0, 15000)}
=== AKHIR TEKS ===`;

  let lastError = '';
  for (let attempt = 0; attempt < 3; attempt++) {
    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.1 }
          })
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        lastError = `HTTP ${response.status}: ${errText.slice(0, 80)}`;
        if (response.status === 429 || response.status >= 500) {
          await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
          continue;
        }
        return null;
      }

      const aiData = await response.json();
      const output = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!output || output.trim().length < 10) {
        lastError = 'Empty response';
        continue;
      }

      const parsed = JSON.parse(output);
      // Validate — must have at least a few expected keys
      const expected = ['namaSekolah', 'mataPelajaran', 'judulModul'];
      if (expected.some(k => k in parsed)) {
        return parsed;
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  console.error('AI header extraction failed after retries:', lastError);
  return null;
}

/* ═══════════════════════════════════════════════
   PDF PARSER
   ═══════════════════════════════════════════════ */

async function parsePdf(buffer) {
  const pdfParse = (await import('pdf-parse')).default;
  const data = await pdfParse(buffer, { pagerender: renderPage });
  return data.text || '';
}

function renderPage(pageData) {
  const renderOptions = { normalizeWhitespace: true, disableCombineTextItems: false };
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

/* ═══════════════════════════════════════════════
   DOCX PARSER
   ═══════════════════════════════════════════════ */

async function parseDocx(buffer) {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
}
