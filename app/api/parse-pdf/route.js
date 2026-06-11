import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

// ── Polyfill untuk DOMMatrix yang tidak tersedia di Node.js ──
if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = class DOMMatrix {
    constructor() {
      this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
      this.m11 = 1; this.m12 = 0; this.m13 = 0; this.m14 = 0;
      this.m21 = 0; this.m22 = 1; this.m23 = 0; this.m24 = 0;
      this.m31 = 0; this.m32 = 0; this.m33 = 1; this.m34 = 0;
      this.m41 = 0; this.m42 = 0; this.m43 = 0; this.m44 = 1;
      this.is2D = true; this.isIdentity = true;
    }
    multiply() { return this; }
    translate() { return this; }
    scale() { return this; }
    rotate() { return this; }
    inverse() { return this; }
    transformPoint(p) { return p || { x: 0, y: 0 }; }
  };
}

if (typeof globalThis.DOMPoint === 'undefined') {
  globalThis.DOMPoint = class DOMPoint {
    constructor(x = 0, y = 0, z = 0, w = 1) {
      this.x = x; this.y = y; this.z = z; this.w = w;
    }
  };
}

if (typeof globalThis.Path2D === 'undefined') {
  globalThis.Path2D = class Path2D {
    constructor() {}
    addPath() {}
    closePath() {}
    moveTo() {}
    lineTo() {}
    bezierCurveTo() {}
    arc() {}
    rect() {}
  };
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf');

    if (!file) {
      return NextResponse.json({ error: 'File PDF tidak ditemukan' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    let rawText = '';
    try {
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(buffer, {
        // Opsi minimal agar tidak error di server
        pagerender: null,
        max: 0,
      });
      rawText = pdfData.text;
    } catch (parseErr) {
      console.error('PDF parse error:', parseErr);
      return NextResponse.json(
        { error: 'Gagal membaca PDF. Pastikan file PDF bukan hasil scan/foto dan tidak terproteksi password.' },
        { status: 400 }
      );
    }

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Teks dalam PDF tidak dapat diekstrak. Pastikan PDF bukan hasil scan/gambar.' },
        { status: 400 }
      );
    }

    // Kirim ke Groq AI untuk mengekstrak bagian CP
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ cpText: rawText.trim().substring(0, 3000) });
    }

    const prompt = `Anda adalah asisten yang membantu guru SMK mengekstrak informasi dari dokumen PDF Capaian Pembelajaran (CP) resmi Kepmendikbudristek.

Berikut adalah teks yang diekstrak dari PDF:
---
${rawText.substring(0, 8000)}
---

Tolong ekstrak informasi berikut dari teks di atas dan kembalikan dalam format JSON:
{
  "mataPelajaran": "nama mata pelajaran yang ditemukan, string kosong jika tidak ada",
  "fase": "fase yang ditemukan contoh Fase E atau Fase F, string kosong jika tidak ada",
  "elemcp": "nama elemen CP utama, string kosong jika tidak ada",
  "cpText": "teks lengkap deskripsi Capaian Pembelajaran utama WAJIB DIISI ambil bagian inti CP yang substantif",
  "elemen1": "nama elemen pertama jika ada, string kosong jika tidak ada",
  "capaian1": "deskripsi capaian elemen pertama jika ada, string kosong jika tidak ada",
  "elemen2": "nama elemen kedua jika ada, string kosong jika tidak ada",
  "capaian2": "deskripsi capaian elemen kedua jika ada, string kosong jika tidak ada"
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'Anda adalah asisten ekstraksi data. Keluarkan HANYA JSON murni tanpa markdown.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      // Kalau AI gagal, kembalikan teks mentah saja
      return NextResponse.json({ cpText: rawText.trim().substring(0, 3000) });
    }

    const aiData = await response.json();
    const extracted = JSON.parse(aiData.choices[0].message.content);
    return NextResponse.json(extracted);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Gagal memproses PDF: ' + (error.message || 'Terjadi kesalahan tidak terduga') },
      { status: 500 }
    );
  }
}
