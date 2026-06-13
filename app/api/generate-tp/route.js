import { NextResponse } from 'next/server';
import { buildTPATPPrompt } from '../../../tpAtpGenerator';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.json();
    const { subject, program, phase, grade, semester, year, cpText, timeTotal, teacher, nipGuru, konteksLokalTambahan } = data;

    if (!cpText) {
      return NextResponse.json({ error: 'Teks CP tidak boleh kosong' }, { status: 400 });
    }

    // ── Load Balancer: Rotasi API Key ──
    const apiKeys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY,
    ].filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: 'API Key Gemini belum diatur di Environment Variables' }, { status: 500 });
    }

    // Pilih key secara acak untuk distribusi beban
    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

    // ── Bangun prompt kontekstual dari tpAtpGenerator.js ──
    let systemPrompt, userPrompt;
    try {
      ({ systemPrompt, userPrompt } = buildTPATPPrompt({
        mataPelajaran: subject || 'Mata Pelajaran',
        konsentrasiKeahlian: program || 'Teknologi Farmasi',
        fase: phase?.replace('Fase ', '') || 'E',
        kelas: grade || 'X',
        semester: semester || 'Ganjil dan Genap',
        tahunPelajaran: year || '2025/2026',
        namaGuru: teacher || '__________________',
        nipGuru: nipGuru || '__________________',
        alokasiTotal: timeTotal ? `${timeTotal} JP` : null,
        konteksLokalTambahan: konteksLokalTambahan || '',
        jumlahTP: 12,
      }));
    } catch (promptErr) {
      // Fallback jika konsentrasi tidak ada di kamus tpAtpGenerator
      console.warn('buildTPATPPrompt fallback:', promptErr.message);
      systemPrompt = `Kamu adalah perancang kurikulum SMK ahli Kurikulum Merdeka yang menulis TP & ATP kontekstual.`;
      userPrompt = ``;
    }

    // ── Siapkan data elemen dari CP yang diupload ──
    const elemenList = data.elemenList || [];
    const elemenBlock = elemenList.length > 0
      ? `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n ELEMEN CP DARI FILE YANG DIUPLOAD GURU (GUNAKAN PERSIS INI)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${elemenList.map((el, i) => `ELEMEN ${i+1} — ${el.nama}:\n"${el.capaian}"`).join('\n\n')}`
      : '';

    // ── Instruksi JSON output ditambahkan setelah user prompt ──
    const finalPrompt = `${userPrompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 DOKUMEN CP ASLI YANG DIUPLOAD GURU — WAJIB DIJADIKAN ACUAN UTAMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ PENTING: Rumusan TP, IKTP, dan materi ATP harus diturunkan LANGSUNG dari teks CP dan elemen di bawah ini.
JANGAN mengganti atau mengabaikan elemen dan teks CP ini. Jika ada nama elemen yang sudah tertulis, gunakan PERSIS nama tersebut.

Teks CP Umum (dari dokumen yang diupload):
${cpText}
${elemenBlock}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FORMAT OUTPUT — WAJIB DIIKUTI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Output harus HANYA berupa JSON murni (tanpa markdown/komentar) dengan struktur PERSIS berikut.
SEMUA field wajib diisi — tidak boleh ada yang kosong atau null.

{
  "tujuanPembelajaran": [
    {
      "id": "TP-01",
      "rumusanTp": "Peserta didik mampu … [diturunkan dari elemen CP di atas, kontekstual, spesifik]",
      "levelKognitif": "C2 — Memahami",
      "dimensiProfil": "Penalaran Kritis, Kemandirian",
      "alokasiWaktu": "10 JP",
      "iktp": "IKTP-1: … \\nIKTP-2: … \\nIKTP-3: …",
      "bentukAsesmen": "Formatif lisan / Unjuk kerja / Portofolio",
      "instrumen": "Rubrik penilaian / Lembar observasi",
      "semester": "Ganjil",
      "elemenCpYangDirujuk": "[nama elemen CP yang menjadi sumber TP ini]"
    }
  ],
  "alurTujuanPembelajaran": [
    {
      "idTp": "TP-01",
      "materi": "- Topik 1 (langsung dari elemen CP)\\n- Topik 2 (nama tempat/produk lokal)\\n- Topik 3",
      "dimensiProfil": "Penalaran Kritis",
      "deepLearning": "Mindful: [aktivitas konkret] / Meaningful: [konteks DUDI lokal] / Joyful: [aktivitas seru]",
      "waktu": "10 JP",
      "asesmen": "Formatif lisan",
      "semester": "Ganjil",
      "pertemuan": "Ptm 1–2"
    }
  ],
  "catatan": {
    "kontekstualisasi": "Catatan penyesuaian TP dengan konteks lokal Purbalingga dan DUDI",
    "kesesuaianDeepLearning": "Penjelasan konkret Mindful, Meaningful, Joyful pada rangkaian TP",
    "modelPembelajaran": "PjBL / Teaching Factory / Discovery Learning (pilih yang sesuai)"
  }
}

Catatan Penting:
1. TP harus DITURUNKAN dari elemen CP yang sudah diupload — bukan dibuat bebas dari pikiran AI.
2. Buat TEPAT 12 TP: TP-01 s/d TP-06 untuk Semester Ganjil, TP-07 s/d TP-12 untuk Semester Genap.
3. Level Bloom HARUS eskalatif: Ganjil C2→C5, Genap C4→C6 (sesuai pola ATP di atas).
4. Total JP seluruh TP harus sesuai alokasi yang diberikan guru (${data.timeTotal ? data.timeTotal + ' JP' : 'sesuaikan dengan CP'}).
5. Setiap TP wajib mencantumkan field "semester" dengan nilai "Ganjil" atau "Genap".
6. Minimal 60% TP menyebut nama/tempat/produk lokal Purbalingga secara eksplisit.
7. Field "elemenCpYangDirujuk" wajib diisi dengan nama elemen dari dokumen yang diupload.`;

    // ── Panggil Gemini API ──
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: finalPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit tercapai. Coba lagi sebentar.' },
          { status: 429 }
        );
      }
      return NextResponse.json({ error: 'Gagal menghubungi Gemini AI' }, { status: 500 });
    }

    const aiData = await response.json();
    const textOutput = aiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      return NextResponse.json({ error: 'AI mengembalikan respon kosong.' }, { status: 500 });
    }

    const result = JSON.parse(textOutput);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan di server' }, { status: 500 });
  }
}

