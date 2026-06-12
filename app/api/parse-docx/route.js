import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 120;

// ── Minta Groq AI mengekstrak struktur CP dari teks docx ──
async function extractCPWithGroq(rawText) {
  const prompt = `Anda adalah asisten yang membantu guru SMK mengekstrak informasi dari dokumen Format Capaian Pembelajaran (CP) yang diunggah.

Berikut adalah teks yang diekstrak dari dokumen DOCX:
---
${rawText.substring(0, 10000)}
---

Tolong ekstrak informasi berikut dari teks di atas dan kembalikan dalam format JSON:
{
  "mataPelajaran": "nama mata pelajaran yang ditemukan, string kosong jika tidak ada",
  "fase": "fase yang ditemukan contoh Fase E atau Fase F, string kosong jika tidak ada",
  "cpText": "Ekstrak SEMUA teks Capaian Pembelajaran secara lengkap (biasanya ada di bagian B. CAPAIAN PEMBELAJARAN, termasuk B.1 dan B.2 elemen-elemennya jika ada). Susun menjadi satu kesatuan teks yang rapi."
}

Keluarkan HANYA JSON murni tanpa markdown, tanpa penjelasan tambahan.`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Groq API Error:', errorText);
    return null;
  }

  const aiData = await res.json();
  return JSON.parse(aiData.choices[0].message.content);
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('docx');

    if (!file) {
      return NextResponse.json({ error: 'File DOCX tidak ditemukan' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let rawText = '';
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

    if (!rawText || rawText.trim().length < 20) {
      return NextResponse.json(
        { error: 'Teks di dalam DOCX terlalu sedikit atau kosong.' },
        { status: 400 }
      );
    }

    if (process.env.GROQ_API_KEY) {
      try {
        const extracted = await extractCPWithGroq(rawText);
        if (extracted && extracted.cpText) {
          return NextResponse.json(extracted);
        }
      } catch (aiErr) {
        console.warn('Groq extraction gagal, fallback ke teks mentah:', aiErr.message);
      }
    }

    // Fallback: kirim teks mentah jika AI gagal
    return NextResponse.json({
      cpText: rawText.trim().substring(0, 5000),
      _note: 'Ekstraksi AI tidak tersedia, teks dikirim mentah'
    });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Gagal memproses DOCX: ' + (error.message || 'Terjadi kesalahan tidak terduga') },
      { status: 500 }
    );
  }
}
