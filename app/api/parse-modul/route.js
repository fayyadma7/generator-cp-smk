import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { generate, parseAIResult } from '../../../lib/aiClient';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    const isDocx = file.name.toLowerCase().endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isPdf && !isDocx) {
      return NextResponse.json({ error: 'Format file tidak didukung. Harap unggah PDF atau DOCX.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let rawText = '';

    if (isPdf) {
      const data = await pdfParse(buffer);
      rawText = data.text;
    } else {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    }

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json({ error: 'Gagal membaca teks dari dokumen. Pastikan dokumen tidak kosong/berupa gambar.' }, { status: 400 });
    }

    const extracted = await extractModulWithGemini(rawText.substring(0, 40000));

    return NextResponse.json({ extracted });

  } catch (error) {
    console.error('Error in parse-modul:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan saat memproses modul.' }, { status: 500 });
  }
}

// ── EKSTRAKSI 4 BAGIAN (Divide & Conquer) ──
async function extractModulWithGemini(rawText) {
  async function fetchPart(promptText) {
    try {
      const res = await generate({
        user: promptText + "\n\n--- TEKS MODUL ---\n" + rawText,
        jsonMode: true
      });
      const parsed = parseAIResult(res.text);
      if (!parsed) throw new Error("Format JSON tidak valid");
      return parsed;
    } catch (e) {
      console.error("fetchPart gagal menggunakan semua AI:", e.message);
      throw new Error(`Semua AI gagal mengekstrak. Error: ${e.message}`);
    }
  }

  // Bagian 1: Identitas
  const p1 = fetchPart(`Ekstrak identitas utama dari teks modul ke dalam JSON HANYA:
  {
    "namaSekolah": "(Nama instansi/sekolah)",
    "taglineSekolah": "(Motto/tagline jika ada, kosongkan jika tidak ada)",
    "mataPelajaran": "(Nama mapel)",
    "faseKelas": "(Misal: Fase E / Kelas X)",
    "judulModul": "(Topik/Materi pokok)",
    "kodeModul": "(Kode jika ada)",
    "tahunPelajaran": "(Misal 2024/2025)",
    "konteksLokal": "(Identifikasi nama daerah atau potensi lokal yang relevan dari teks)",
    "nilaiSekolah": "(Nilai karakter yang ditonjolkan, misal Islami/Nasionalis)"
  }`);
  
  // Bagian 2: Tujuan & Kompetensi
  const p2 = fetchPart(`Ekstrak tujuan pembelajaran dan buat rancangan remediasi ke dalam JSON HANYA:
  {
    "tujuanPembelajaran": "(Teks paragraf tujuan pembelajaran lengkap)",
    "iktp": "(Daftar indikator ketercapaian, beri nomor 1, 2, dst)",
    "iktpRemediasi": "(Pilih 1 IKTP paling dasar yang cocok untuk remediasi)"
  }`);
  
  // Bagian 3: Skenario & Keterkaitan
  const p3 = fetchPart(`Ekstrak skenario pertemuan dan buat ide pengayaan ke dalam JSON HANYA:
  {
    "topikPertemuan1": "(Materi spesifik pertemuan 1)",
    "metodePertemuan1": "(Metode/model pembelajaran pertemuan 1)",
    "topikPertemuan2": "(Materi spesifik pertemuan 2)",
    "metodePertemuan2": "(Metode/model pembelajaran pertemuan 2)",
    "dimensiKeterkaitan": "(Misal: teori & praktik, alam & sosial)",
    "topikPengayaan": "(Buat 1 ide topik pengayaan yang lebih mendalam/HOTS dari materi)",
    "jenisTugasPengayaan": "(Misal: Mini-riset, Infografis, Esai)"
  }`);
  
  // Bagian 4: Asesmen
  const p4 = fetchPart(`Ekstrak info asesmen dan ide penutup ke dalam JSON HANYA:
  {
    "jenisProdukSumatif": "(Bentuk produk asesmen sumatif, misal Laporan, Poster)",
    "aspekPenilaianSumatif": "(Sebutkan 3-4 aspek, misal: Pengetahuan, Analisis, Sikap)",
    "bobotAspek": "(Tentukan bobot logis, misal: Pengetahuan 30%, Analisis 50%, Sikap 20%)",
    "kktp": 70,
    "kutipanPenutup": "(Buat 1 kalimat kutipan motivasi yang relevan dengan topik modul)"
  }`);

  const [res1, res2, res3, res4] = await Promise.all([p1, p2, p3, p4]);

  return { ...res1, ...res2, ...res3, ...res4 };
}
