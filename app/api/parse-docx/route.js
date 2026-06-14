import { NextResponse } from 'next/server';
import { generate, parseAIResult } from '../../../lib/aiClient';

export const runtime = 'nodejs';
export const maxDuration = 120;

// ── Minta Gemini AI mengekstrak struktur CP dari teks docx ──
async function extractCPWithGemini(rawText) {
  const prompt = `Anda adalah asisten yang membantu guru SMK mengekstrak informasi dari dokumen Format Capaian Pembelajaran (CP) yang diunggah.

Berikut adalah teks yang diekstrak dari dokumen DOCX:
---
${rawText}
---

Tolong ekstrak informasi berikut dari teks di atas dan kembalikan dalam format JSON:
{
  "mataPelajaran": "nama mata pelajaran yang ditemukan, string kosong jika tidak ada",
  "program": "program keahlian (contoh: Teknik Komputer Jaringan, Layanan Perbankan Syariah), kosong jika tidak ada",
  "fase": "fase yang ditemukan (contoh: Fase E, Fase F), kosong jika tidak ada",
  "grade": "kelas (contoh: X, XI, XII), kosong jika tidak ada. Jika menyatu dengan fase misal 'Fase F / XI', ambil XI-nya saja",
  "semester": "semester (contoh: Ganjil, Genap, Ganjil dan Genap), kosong jika tidak ada",
  "year": "tahun pelajaran (contoh: 2025/2026), kosong jika tidak ada",
  "timeTotal": "alokasi waktu total dalam bentuk angka (contoh: 144), kosong jika tidak ada. Hanya angkanya saja.",
  "teacher": "nama guru penyusun beserta NIP/NUPTK jika ada, kosong jika tidak ada (biasanya di bagian tanda tangan akhir dokumen)",
  "waka": "nama waka kurikulum, kosong jika tidak ada (biasanya di bagian tanda tangan akhir dokumen)",
  "principal": "nama kepala sekolah, kosong jika tidak ada (biasanya di bagian tanda tangan akhir dokumen)",
  "cpText": "Ekstrak TEKS UTUH Capaian Pembelajaran secara lengkap (Gabungan dari DESKRIPSI CP UMUM dan DESKRIPSI CP PER ELEMEN). JANGAN diringkas. Buang subjudul 'B.1', 'B.2' agar rapi, tetapi pertahankan semua isi teks capaian umum dan elemen-elemennya.",
  "elemenList": [
    { "nama": "Nama Elemen 1", "capaian": "Teks capaian elemen 1" },
    { "nama": "Nama Elemen 2", "capaian": "Teks capaian elemen 2" }
  ]
}`;

  // Coba ambil dari multiple key, fallback ke GEMINI_API_KEY
  try {
    const aiResult = await generate({
      system: "Anda adalah asisten ekstraksi data. Keluarkan HANYA JSON murni tanpa markdown.",
      user: prompt,
      jsonMode: true,
    });
    return parseAIResult(aiResult.text);
  } catch (err) {
    console.error('AI extraction error:', err.message);
    return null;
  }
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

    try {
      const extracted = await extractCPWithGemini(rawText);
      if (extracted && extracted.cpText) {
        extracted.rawText = rawText;
        return NextResponse.json(extracted);
      }
    } catch (aiErr) {
      console.warn('AI extraction gagal, fallback ke teks mentah:', aiErr.message);
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
