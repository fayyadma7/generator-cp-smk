import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 120;

// ── Polyfill DOMMatrix ──
if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = class DOMMatrix {
    constructor() {
      this.a=1;this.b=0;this.c=0;this.d=1;this.e=0;this.f=0;
      this.m11=1;this.m12=0;this.m13=0;this.m14=0;
      this.m21=0;this.m22=1;this.m23=0;this.m24=0;
      this.m31=0;this.m32=0;this.m33=1;this.m34=0;
      this.m41=0;this.m42=0;this.m43=0;this.m44=1;
      this.is2D=true;this.isIdentity=true;
    }
    multiply(){return this;}translate(){return this;}
    scale(){return this;}rotate(){return this;}
    inverse(){return this;}transformPoint(p){return p||{x:0,y:0};}
  };
}
if (typeof globalThis.DOMPoint === 'undefined') {
  globalThis.DOMPoint = class DOMPoint {
    constructor(x=0,y=0,z=0,w=1){this.x=x;this.y=y;this.z=z;this.w=w;}
  };
}
if (typeof globalThis.Path2D === 'undefined') {
  globalThis.Path2D = class Path2D {
    constructor(){}addPath(){}closePath(){}moveTo(){}lineTo(){}bezierCurveTo(){}arc(){}rect(){}
  };
}

// ── Ekstrak teks via Gemini OCR (untuk PDF scan) ──
async function extractTextViaGemini(buffer) {
  const apiKeys = [
    process.env.GEMINI_API_KEY_1, process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3, process.env.GEMINI_API_KEY
  ].filter(Boolean);
  if (apiKeys.length === 0) return null;
  const key = apiKeys[Math.floor(Math.random() * apiKeys.length)];
  try {
    const base64 = buffer.toString('base64');
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: 'Ekstrak semua teks dari dokumen PDF ini. Kembalikan seluruh teks apa adanya tanpa modifikasi, tanpa ringkasan, tanpa komentar tambahan. Jika ada tabel, tuliskan konten tabelnya dalam format teks biasa.' },
              { inlineData: { mimeType: 'application/pdf', data: base64 } }
            ]
          }]
        })
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') || '';
    return text.trim() || null;
  } catch (err) {
    console.error('Gemini OCR error:', err);
    return null;
  }
}

// ── Parse struktur modul ajar dari teks mentah via Gemini ──
async function extractModulWithGemini(rawText) {
  const apiKeys = [
    process.env.GEMINI_API_KEY_1, process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3, process.env.GEMINI_API_KEY
  ].filter(Boolean);
  if (apiKeys.length === 0) return null;

  // Coba dengan konteks lebih kecil dulu agar tidak timeout, lalu retry jika gagal
  const contextSizes = [20000, 10000, 5000];

  for (let attempt = 0; attempt < contextSizes.length; attempt++) {
    const key = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    const contextSize = contextSizes[attempt];
    const snippet = rawText.substring(0, contextSize);

    const prompt = `Kamu adalah asisten AI yang membantu mengekstrak informasi dari dokumen Modul Ajar SMK/SMA Kurikulum Merdeka.

Berikut adalah teks yang diekstrak dari dokumen modul ajar:
---
${snippet}
---

Ekstrak informasi berikut dan kembalikan sebagai JSON murni. Jika tidak ditemukan, isi dengan string kosong "".

{"namaSekolah":"","taglineSekolah":"","mataPelajaran":"","judulModul":"","kodeModul":"","faseKelas":"","semester":"","tahunPelajaran":"","kurikulum":"","tujuanPembelajaran":"","iktp":"","topikPertemuan1":"","metodePertemuan1":"","topikPertemuan2":"","dimensiKeterkaitan":"","konteksLokal":"","nilaiSekolah":"","jenisProdukSumatif":"","aspekPenilaianSumatif":"","kktp":"","jumlahSiswa":"","daftarLampiranYangDiminta":""}

PENTING: Kembalikan JSON murni saja, tanpa markdown, tanpa backtick, tanpa penjelasan apapun.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json',
              maxOutputTokens: 1024
            }
          })
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.error(`Gemini parse-modul attempt ${attempt + 1} error:`, res.status, errText.slice(0, 200));
        // Jika rate limit, tunggu sebentar sebelum retry
        if (res.status === 429) await new Promise(r => setTimeout(r, 3000));
        continue; // coba ukuran konteks lebih kecil
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) { console.warn(`Attempt ${attempt + 1}: Gemini returned empty text`); continue; }

      // Bersihkan markdown jika ada
      const cleaned = text.replace(/```(?:json)?\s*/g, '').replace(/\s*```/g, '').trim();
      try {
        const parsed = JSON.parse(cleaned);
        console.log(`Parse-modul berhasil pada attempt ${attempt + 1} (ctx ${contextSize} chars)`);
        return parsed;
      } catch {
        console.warn(`Attempt ${attempt + 1}: JSON parse failed, preview: ${cleaned.slice(0, 100)}`);
        continue;
      }
    } catch (err) {
      console.error(`Gemini modul extract attempt ${attempt + 1} error:`, err.message);
    }
  }

  return null;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('modul');

    if (!file) {
      return NextResponse.json({ error: 'File modul tidak ditemukan' }, { status: 400 });
    }
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file maksimal 15 MB' }, { status: 400 });
    }

    const name = file.name || '';
    const isDocx = name.toLowerCase().endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ── Langkah 1: Ekstrak teks dari dokumen ──
    let rawText = '';

    if (isDocx) {
      try {
        const mammoth = (await import('mammoth')).default;
        const result = await mammoth.extractRawText({ buffer });
        rawText = result.value || '';
      } catch (parseErr) {
        console.warn('Mammoth parse error:', parseErr.message);
        return NextResponse.json(
          { error: 'Gagal membaca isi DOCX. Pastikan file valid.' },
          { status: 400 }
        );
      }
    } else {
      try {
        const pdfParse = (await import('pdf-parse')).default;
        const pdfData = await pdfParse(buffer);
        rawText = pdfData.text || '';
      } catch (parseErr) {
        console.warn('pdf-parse gagal, fallback ke Gemini OCR:', parseErr.message);
      }

      // Jika teks terlalu sedikit, fallback ke Gemini OCR
      if (!rawText || rawText.trim().length < 100) {
        console.log('Teks sedikit, fallback ke Gemini OCR...');
        const geminiText = await extractTextViaGemini(buffer);
        if (geminiText && geminiText.length >= 100) {
          rawText = geminiText;
        } else {
          return NextResponse.json(
            { error: 'Gagal membaca isi PDF. Pastikan PDF berbasis teks, bukan hasil scan gambar.' },
            { status: 400 }
          );
        }
      }
    }

    if (!rawText || rawText.trim().length < 20) {
      return NextResponse.json(
        { error: 'Teks di dalam dokumen terlalu sedikit atau kosong.' },
        { status: 400 }
      );
    }

    // ── Langkah 2: Ekstrak struktur modul dengan Gemini ──
    const extracted = await extractModulWithGemini(rawText);

    if (!extracted) {
      return NextResponse.json(
        { error: 'Gagal menganalisis isi modul. Coba lagi atau isi form secara manual.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: extracted });

  } catch (error) {
    console.error('Server Error /api/parse-modul:', error);
    return NextResponse.json(
      { error: 'Gagal memproses file: ' + (error.message || 'Kesalahan tidak terduga') },
      { status: 500 }
    );
  }
}
