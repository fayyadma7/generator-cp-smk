import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

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
  const apiKeys = [
    process.env.GEMINI_API_KEY_1, process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3, process.env.GEMINI_API_KEY_4, process.env.GEMINI_API_KEY
  ].filter(Boolean);

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  async function fetchPart(promptText) {
    let retryCount = 0;
    while (retryCount < 5) {
      const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText + "\n\n--- TEKS MODUL ---\n" + rawText }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
          })
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return JSON.parse(text);
      } catch (e) {
        retryCount++;
        await delay(2000);
      }
    }
    return {};
  }

  // Bagian 1: Identitas
  const p1 = fetchPart(`Ekstrak identitas modul ke dalam JSON: { "namaSekolah":"", "taglineSekolah":"", "mataPelajaran":"", "faseKelas":"", "judulModul":"", "kodeModul":"", "tahunPelajaran":"", "konteksLokal":"", "nilaiSekolah":"" }`);
  
  // Bagian 2: Tujuan & Kompetensi
  const p2 = fetchPart(`Ekstrak tujuan pembelajaran ke dalam JSON: { "tujuanPembelajaran":"(teks paragraf lengkap)", "iktp":"(indikator, beri nomor 1, 2, dst)", "iktpRemediasi":"(pilih 1 iktp paling dasar untuk remediasi)" }`);
  
  // Bagian 3: Skenario & Keterkaitan
  const p3 = fetchPart(`Ekstrak info skenario pertemuan ke dalam JSON: { "topikPertemuan1":"", "metodePertemuan1":"", "topikPertemuan2":"", "metodePertemuan2":"", "dimensiKeterkaitan":"" }`);
  
  // Bagian 4: Asesmen
  const p4 = fetchPart(`Ekstrak info asesmen ke dalam JSON: { "jenisProdukSumatif":"", "aspekPenilaianSumatif":"(misal: Pengetahuan, Sikap, dsb)", "kktp":70 }`);

  const [res1, res2, res3, res4] = await Promise.all([p1, p2, p3, p4]);

  return { ...res1, ...res2, ...res3, ...res4 };
}
