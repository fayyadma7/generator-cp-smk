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

  // Batasi ukuran teks agar tidak kena limit payload
  const snippet = rawText.substring(0, 150000);

  // Bagi skema menjadi 4 bagian agar AI lebih fokus dan tidak skip field
  const schemas = [
    {
      name: "Identitas",
      schema: `{
        "namaSekolah": "nama sekolah yang tertera",
        "taglineSekolah": "motto/tagline sekolah jika ada",
        "mataPelajaran": "nama mata pelajaran",
        "judulModul": "judul modul ajar",
        "kodeModul": "kode modul contoh MA-IPAS-01 atau TP-01",
        "faseKelas": "fase dan kelas contoh 'Fase E / Kelas X'",
        "semester": "semester contoh 'Ganjil' atau 'Genap'",
        "tahunPelajaran": "tahun pelajaran contoh '2025/2026'",
        "kurikulum": "nama kurikulum yang digunakan"
      }`
    },
    {
      name: "Tujuan",
      schema: `{
        "tujuanPembelajaran": "teks tujuan pembelajaran yang lengkap",
        "iktp": "indikator ketercapaian tujuan pembelajaran. Jika ada beberapa poin, gabungkan dengan \\n",
        "kktp": "nilai kriteria ketercapaian tujuan pembelajaran, angka saja contoh 70. Jika tidak ada, isi 70.",
        "jumlahSiswa": "jumlah siswa dalam kelas, angka saja, default 32"
      }`
    },
    {
      name: "Skenario",
      schema: `{
        "topikPertemuan1": "topik atau materi pokok untuk pertemuan 1. Jika tidak dirinci, ambil dari materi utama modul.",
        "metodePertemuan1": "metode pembelajaran pertemuan 1. Jika tidak ada, isi dengan 'Diskusi dan Observasi'.",
        "topikPertemuan2": "topik atau materi pokok lanjutan untuk pertemuan 2. Jika tidak ada, rumuskan kelanjutan logis.",
        "dimensiKeterkaitan": "WAJIB DIISI! konsep yang dikaitkan di pertemuan 2 (contoh: 'alam dan sosial', 'teori dan praktik'). Rumuskan jika tidak ada.",
        "konteksLokal": "konteks lokal daerah/industri. Jika tidak ada, isi 'Purbalingga'.",
        "nilaiSekolah": "nilai/karakter ditekankan contoh 'Islami', 'Entrepreneur'. Jika tidak tertulis, abaikan."
      }`
    },
    {
      name: "Asesmen",
      schema: `{
        "jenisProdukSumatif": "jenis produk sumatif (contoh: 'Laporan Observasi', 'Poster'). Simpulkan jika tidak ada.",
        "aspekPenilaianSumatif": "aspek penilaian sumatif (misal: 'Pengetahuan, Keterampilan').",
        "daftarLampiranYangDiminta": "daftar lampiran yang ada dalam modul, kosongkan jika tidak ada"
      }`
    }
  ];

  const fetchPart = async (schemaDef, attempt = 0) => {
    // Gunakan API key yang berbeda untuk tiap percobaan/bagian
    const keyIndex = (schemas.indexOf(schemaDef) + attempt) % apiKeys.length;
    const apiKey = apiKeys[keyIndex];

    const prompt = `Ekstrak informasi berikut dari teks modul ajar di bawah ini dan kembalikan sebagai JSON murni. Jika tidak eksplisit, simpulkan berdasarkan isi modul.

Schema JSON yang diminta:
${schemaDef.schema}

Teks Modul:
---
${snippet.substring(0, 80000)}
---
PENTING: Kembalikan JSON murni saja.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, responseMimeType: 'application/json' }
          })
        }
      );

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      
      // Bersihkan dan parse JSON
      const cleaned = text.replace(/```(?:json)?\s*/g, '').replace(/\s*```/g, '').trim();
      try {
        const parsed = JSON.parse(cleaned);
        console.log(`Berhasil ekstrak bagian ${schemaDef.name} (attempt ${attempt + 1})`);
        return parsed;
      } catch (e) {
        console.warn(`JSON parse failed untuk ${schemaDef.name}:`, e.message);
        throw new Error('Parse failed');
      }
    } catch (err) {
      if (attempt < 2) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1))); // Retry delay
        return fetchPart(schemaDef, attempt + 1);
      }
      console.error(`Gagal total bagian ${schemaDef.name}:`, err.message.slice(0, 100));
      return {}; // Fallback ke objek kosong agar bagian lain tetap berjalan
    }
  };

  // Jalankan keempat bagian secara paralel
  console.log('Memulai ekstraksi AI paralel 4 bagian...');
  const results = await Promise.all(schemas.map(s => fetchPart(s)));
  
  // Gabungkan hasil dari ke-4 array/objek menjadi satu
  let mergedResult = {};
  for (const res of results) {
    if (res && typeof res === 'object') {
      mergedResult = { ...mergedResult, ...res };
    }
  }

  return Object.keys(mergedResult).length > 0 ? mergedResult : null;
}

// ── Fallback: Ekstrak via Regex (tanpa AI) ──
// Digunakan jika semua percobaan Gemini gagal
function extractModulWithRegex(rawText) {
  const pick = (patterns) => {
    for (const re of patterns) {
      const m = rawText.match(re);
      if (m && m[1] && m[1].trim().length > 1) return m[1].trim();
    }
    return '';
  };

  const mataPelajaran = pick([
    /(?:Mata Pelajaran|MATA PELAJARAN)\s*[:：]\s*(.+)/i,
    /(?:Mapel)\s*[:：]\s*(.+)/i,
  ]);
  const faseKelas = pick([
    /(?:Fase\s*\/\s*Kelas|Fase\/Kelas|Kelas\s*\/\s*Fase)\s*[:：]\s*(.+)/i,
    /Fase\s+([A-F]\s*\/\s*(?:Kelas\s*)?(?:X|XI|XII))/i,
    /(?:Kelas)\s*[:：]\s*((?:X|XI|XII)[^\n]{0,30})/i,
  ]);
  const semester = pick([
    /(?:Semester)\s*[:：]\s*(Ganjil|Genap)/i,
  ]);
  const tahunPelajaran = pick([
    /(?:Tahun Pelajaran|T\.P\.|TP)\s*[:：]\s*(\d{4}\/\d{4})/i,
    /(\d{4})\s*\/\s*(\d{4})/,
  ]);
  const judulModul = pick([
    /(?:Judul Modul|JUDUL MODUL)\s*[:：]\s*(.+)/i,
    /(?:Modul Ajar)[\s:：]+(.{5,80})/i,
  ]);
  const kodeModul = pick([
    /(?:Kode Modul|No\. Modul|Nomor Modul)\s*[:：]\s*(.+)/i,
    /\b(MA-[A-Z]{2,}-\d+)\b/,
  ]);
  const namaSekolah = pick([
    /(?:SMK|SMA|SMP|SD)\s+(?:Negeri|Swasta|Muhammadiyah)?\s*[\w\s]{2,40}/i,
  ]);
  const tujuanPembelajaran = pick([
    /(?:Tujuan Pembelajaran|TUJUAN PEMBELAJARAN)\s*[:：]\s*([\s\S]{20,500}?)(?=\n\n|IKTP|Indikator|Alokasi|$)/i,
    /(?:Peserta didik mampu[\s\S]{10,400}?)(?=\n\n|IKTP|$)/i,
  ]);
  const iktp = pick([
    /(?:IKTP|Indikator Ketercapaian|Indikator TP)\s*[:：]\s*([\s\S]{10,500}?)(?=\n\n[A-Z]|Alokasi|Pertemuan|$)/i,
  ]);
  const kurikulum = pick([
    /(?:Kurikulum)\s*[:：]\s*(.+)/i,
  ]);
  const kktp = pick([
    /(?:KKTP|KKM|Nilai Minimum|Batas Lulus)\s*[:：]\s*(\d+)/i,
  ]);
  const konteksLokal = pick([
    /Purbalingga|Banyumas|Cilacap|Kebumen|Wonosobo|Banjarnegara|Purwokerto/i,
  ]);

  return {
    namaSekolah: namaSekolah || 'SMK Muhammadiyah 3 Purbalingga',
    taglineSekolah: '',
    mataPelajaran,
    judulModul,
    kodeModul,
    faseKelas,
    semester: semester || 'Ganjil',
    tahunPelajaran: tahunPelajaran || '2025/2026',
    kurikulum: kurikulum || 'Kurikulum Merdeka',
    tujuanPembelajaran,
    iktp,
    topikPertemuan1: '',
    metodePertemuan1: '',
    topikPertemuan2: '',
    dimensiKeterkaitan: '',
    konteksLokal: konteksLokal || 'Purbalingga',
    nilaiSekolah: 'Islami, Entrepreneur',
    jenisProdukSumatif: '',
    aspekPenilaianSumatif: 'Pengetahuan, Keterampilan, Sikap',
    kktp: kktp || '70',
    jumlahSiswa: '32',
    daftarLampiranYangDiminta: '',
    _source: 'regex_fallback' // penanda bahwa ini dari regex bukan AI
  };
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
      // Gemini gagal — gunakan regex fallback agar form tetap bisa terisi sebagian
      console.log('Gemini gagal, menggunakan regex fallback...');
      const regexResult = extractModulWithRegex(rawText);
      return NextResponse.json({
        success: true,
        data: regexResult,
        _warning: 'Analisis AI tidak tersedia. Beberapa field diisi otomatis dari pola teks dokumen. Silakan periksa dan lengkapi secara manual jika perlu.'
      });
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
