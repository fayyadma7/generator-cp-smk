import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf');

    if (!file) {
      return NextResponse.json({ error: 'File PDF tidak ditemukan' }, { status: 400 });
    }

    // Ambil buffer dari file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF menggunakan pdf-parse
    const pdfParse = (await import('pdf-parse')).default;
    const pdfData = await pdfParse(buffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json({ error: 'Teks dalam PDF tidak dapat dibaca. Pastikan PDF bukan hasil scan/gambar.' }, { status: 400 });
    }

    // Kirim ke Groq AI untuk mengekstrak bagian CP yang relevan
    if (!process.env.GROQ_API_KEY) {
      // Jika tidak ada Groq key, kembalikan teks mentah saja
      return NextResponse.json({ cpText: rawText.trim().substring(0, 3000) });
    }

    const prompt = `Anda adalah asisten yang membantu guru SMK mengekstrak informasi dari dokumen PDF Capaian Pembelajaran (CP) resmi Kepmendikbudristek.

Berikut adalah teks yang diekstrak dari PDF:
---
${rawText.substring(0, 8000)}
---

Tolong ekstrak informasi berikut dari teks di atas dan kembalikan dalam format JSON:
{
  "mataPelajaran": "nama mata pelajaran yang ditemukan (string kosong jika tidak ada)",
  "fase": "fase yang ditemukan, contoh: Fase E atau Fase F (string kosong jika tidak ada)",
  "elemcp": "nama elemen CP utama (string kosong jika tidak ada)",
  "cpText": "teks lengkap deskripsi Capaian Pembelajaran utama / umum (WAJIB diisi, ambil bagian inti CP-nya)",
  "elemen1": "nama elemen pertama jika ada (string kosong jika tidak ada)",
  "capaian1": "deskripsi capaian elemen pertama jika ada (string kosong jika tidak ada)",
  "elemen2": "nama elemen kedua jika ada (string kosong jika tidak ada)",
  "capaian2": "deskripsi capaian elemen kedua jika ada (string kosong jika tidak ada)"
}

Penting: cpText harus diisi dengan teks CP yang lengkap dan substantif dari dokumen tersebut.`;

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

    const aiData = await response.json();

    if (!response.ok) {
      // Kalau AI gagal, kembalikan teks mentah saja
      return NextResponse.json({ cpText: rawText.trim().substring(0, 3000) });
    }

    const extracted = JSON.parse(aiData.choices[0].message.content);
    return NextResponse.json(extracted);

  } catch (error) {
    console.error('PDF Parse Error:', error);
    return NextResponse.json(
      { error: 'Gagal memproses PDF: ' + (error.message || 'Terjadi kesalahan tidak terduga') },
      { status: 500 }
    );
  }
}
