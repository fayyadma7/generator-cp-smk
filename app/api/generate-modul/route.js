import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '../../../modul_ajar_ai_template.js';

export const runtime = 'nodejs';
export const maxDuration = 120;

// ─────────────────────────────────────────────────────────
// SCHEMA CHUNKS — dipecah menjadi 4 bagian kecil
// ─────────────────────────────────────────────────────────

const SCHEMA_STEP_1 = {
  identitas: {
    nama_mata_pelajaran: "[Isi dengan nama mata pelajaran lengkap]",
    program_keahlian: "[Isi dengan program keahlian spesifik atau 'Semua Program Keahlian']",
    fase_kelas: "[Isi dengan format: 'Fase [E/F] / Kelas [X/XI/XII]']",
    semester: "[Isi dengan 'Ganjil' atau 'Genap']",
    tahun_pelajaran: "[Isi dengan format 'YYYY/YYYY']",
    judul_modul: "[Isi dengan judul modul yang menarik, kontekstual lokal, maks 20 kata]",
    nomor_modul: "[Isi dengan format: 'MA-[KODE_MAPEL]-[NOMOR_URUT]']",
    nomor_tp: "[Isi dengan Nomor TP yang dirujuk, misal 'TP-01']",
    alokasi_waktu: "[Isi dengan format: '[Total JP] JP ([pertemuan] Pertemuan × [JP/ptm] JP @ [menit] menit)']",
    pertemuan_ke: "[Isi dengan format: 'Pertemuan ke-[awal] s.d. ke-[akhir]']"
  },
  kerangka_kurikulum: {
    capaian_pembelajaran: "[Salin utuh Capaian Pembelajaran resmi dari referensi yang relevan]",
    elemen_cp: [
      "[Isi dengan elemen 1]",
      "[Isi dengan elemen 2]"
    ],
    tujuan_pembelajaran: "[Rumuskan TP: 'Peserta didik mampu...' + kompetensi + konten + konteks lokal]",
    indikator_ketercapaian_tp: [
      "[IKTP 1: dari LOTS ke HOTS]",
      "[IKTP 2: spesifik dan terukur]"
    ],
    posisi_dalam_atp: "[Jelaskan peran modul, urutan, prasyarat, dan kelanjutannya]",
    dimensi_profil_lulusan: [
      "[Dimensi 1 → penjelasan konkret integrasinya]",
      "[Dimensi 2 → penjelasan konkret integrasinya]"
    ]
  }
};

const SCHEMA_STEP_2 = {
  rancangan_pembelajaran: {
    mindful_learning: {
      apersepsi: "[Deskripsikan apersepsi konkret dari lingkungan LOKAL sekolah, maks 10 menit]",
      pertanyaan_pemantik: [
        "[Pertanyaan 1: konteks sehari-hari lokal]",
        "[Pertanyaan 2: kausal/ilmiah fenomena lokal]",
        "[Pertanyaan 3: nilai moral/spiritual]"
      ],
      penetapan_tujuan_bersama: "[Deskripsikan prosedur 5-10 menit pelibatan suara siswa menetapkan tujuan]",
      strategi_refleksi: "[Deskripsikan teknik refleksi terstruktur beserta instruksinya]"
    },
    meaningful_learning: {
      koneksi_dunia_nyata: "[Deskripsikan min 2 industri/profesi LOKAL yang relevan]",
      koneksi_antar_mapel: {
        "Nama Mapel 1": "[Koneksi substantif dengan materi]",
        "Nama Mapel 2": "[Koneksi substantif dengan materi]"
      },
      koneksi_kearifan_lokal: "[Deskripsikan kearifan lokal/tradisi yang relevan, atau null jika tidak ada]",
      produk_bermakna: "[Deskripsikan format produk, isi, dan fungsinya di luar kelas]"
    },
    joyful_learning: {
      model_pembelajaran: "[Sebutkan nama model pembelajaran + alasan + cara implementasi]",
      variasi_aktivitas: {
        individu: "[Deskripsi aktivitas individu]",
        berpasangan: "[Deskripsi aktivitas berpasangan]",
        kelompok: "[Deskripsi aktivitas kelompok]",
        presentasi: "[Deskripsi aktivitas presentasi]"
      },
      diferensiasi_pembelajaran: {
        konten: "[Pilihan diferensiasi konten]",
        proses: "[Pilihan diferensiasi proses]",
        produk: "[Pilihan diferensiasi produk]"
      },
      integrasi_nilai: "[Untuk sekolah Islam: ayat/hadits relevan + pembiasaan; non-Islam: nilai karakter]"
    }
  }
};

const SCHEMA_STEP_3 = {
  skenario_pembelajaran: {
    pertemuan: [
      {
        nomor: 1,
        topik: "[Topik pertemuan 1, kontekstual lokal]",
        alokasi_waktu: "[Waktu pertemuan 1, misal: 4 JP (180 menit)]",
        pendahuluan: {
          durasi: "[Misal: 15 menit]",
          kegiatan_guru: [
            "[Langkah 1 kegiatan guru]",
            "[Langkah 2 kegiatan guru]"
          ],
          kegiatan_peserta_didik: [
            "[Langkah 1 kegiatan siswa, respons terhadap guru langkah 1]",
            "[Langkah 2 kegiatan siswa, respons terhadap guru langkah 2]"
          ]
        },
        inti: {
          durasi: "[Misal: 150 menit]",
          kegiatan_guru: [
            "[Langkah eksplorasi/diskusi guru]"
          ],
          kegiatan_peserta_didik: [
            "[Aktivitas aktif siswa]"
          ]
        },
        penutup: {
          durasi: "[Misal: 15 menit]",
          kegiatan_guru: [
            "[Langkah penyimpulan, refleksi, asesmen]"
          ],
          kegiatan_peserta_didik: [
            "[Langkah kesimpulan, respon siswa]"
          ]
        }
      }
    ]
  }
};

const SCHEMA_STEP_4 = {
  asesmen: {
    diagnostik: {
      teknik: "[Deskripsikan teknik asesmen di awal, maks 15 menit]",
      tindak_lanjut: "[Skenario tindak lanjut jika belum paham, sebagian paham, mayoritas paham]"
    },
    formatif: {
      teknik: [
        "[Teknik 1: observasi]",
        "[Teknik 2: lisan]",
        "[Teknik 3: tulisan]"
      ],
      instrumen: "[Sebutkan instrumen untuk teknik formatif tersebut]",
      tindak_lanjut: {
        remediasi: "[Tindak lanjut siswa yang belum capai IKTP]",
        pengayaan: "[Tindak lanjut siswa yang melampaui]",
        penguatan: "[Tindak lanjut siswa yang mendekati]"
      }
    },
    sumatif: {
      teknik: "[Teknik sumatif otentik yang selaras dengan produk bermakna]",
      instrumen: "[Instrumen sumatif, misal: rubrik 4 aspek]",
      kktp: {
        kriteria: "[Rumusan min 2 kriteria terukur yang menggunakan kata 'DAN']",
        nilai_minimum: 75
      },
      dimensi_dinilai: {
        "Penalaran Kritis": "50%",
        "Komunikasi": "50%"
      }
    }
  },
  materi_sumber: {
    materi_pokok: [
      "[Topik esensial 1]",
      "[Topik esensial 2]"
    ],
    materi_pengayaan: "[Materi pendalaman bagi yang melampaui TP]",
    materi_remedial: "[Materi sederhana dengan visual konkret]",
    sumber_belajar_utama: [
      "[Sumber resmi 1, maks 5 thn terakhir]",
      "[Sumber resmi 2, maks 5 thn terakhir]"
    ],
    sumber_belajar_pendukung: [
      "[Sumber kontekstual lokal, artikel/video 1]",
      "[Sumber kontekstual lokal, artikel/video 2]"
    ],
    media_pembelajaran: "[Min 2 jenis media yang tersedia di SMK daerah]",
    alat_bahan: [
      "[Alat 1]",
      "[Alat 2]"
    ],
    lkpd: [
      {
        kode: "[Misal: LKPD-01a]",
        judul: "[Judul LKPD]",
        pertemuan: 1
      }
    ]
  },
  rubrik_penilaian: {
    objek_penilaian: "[Sebutkan produk karya yang dinilai]",
    aspek: [
      {
        nama: "Pengetahuan: [Aspek pengetahuan yang dinilai]",
        level_1: { deskriptor: "[Deskriptor Perlu Bimbingan]" },
        level_2: { deskriptor: "[Deskriptor Cukup]" },
        level_3: { deskriptor: "[Deskriptor Baik]" },
        level_4: { deskriptor: "[Deskriptor Sangat Baik]" }
      },
      {
        nama: "Keterampilan: [Aspek keterampilan yang dinilai]",
        level_1: { deskriptor: "[Deskriptor Perlu Bimbingan]" },
        level_2: { deskriptor: "[Deskriptor Cukup]" },
        level_3: { deskriptor: "[Deskriptor Baik]" },
        level_4: { deskriptor: "[Deskriptor Sangat Baik]" }
      },
      {
        nama: "Komunikasi: [Aspek komunikasi yang dinilai]",
        level_1: { deskriptor: "[Deskriptor Perlu Bimbingan]" },
        level_2: { deskriptor: "[Deskriptor Cukup]" },
        level_3: { deskriptor: "[Deskriptor Baik]" },
        level_4: { deskriptor: "[Deskriptor Sangat Baik]" }
      },
      {
        nama: "Sikap: [Nilai Karakter yang dinilai]",
        level_1: { deskriptor: "[Deskriptor Perlu Bimbingan]" },
        level_2: { deskriptor: "[Deskriptor Cukup]" },
        level_3: { deskriptor: "[Deskriptor Baik]" },
        level_4: { deskriptor: "[Deskriptor Sangat Baik]" }
      }
    ]
  }
};

const SCHEMAS = {
  1: SCHEMA_STEP_1,
  2: SCHEMA_STEP_2,
  3: SCHEMA_STEP_3,
  4: SCHEMA_STEP_4
};

const STEP_LABELS = {
  1: "Identitas & Kerangka Kurikulum (A & B)",
  2: "Rancangan Pembelajaran Deep Learning (C)",
  3: "Skenario Pembelajaran (D)",
  4: "Asesmen, Materi & Rubrik (E, F & G)"
};

// ─────────────────────────────────────────────────────────
// API HANDLER
// ─────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.tpText) {
      return NextResponse.json({ error: 'Teks dokumen TP & ATP tidak boleh kosong' }, { status: 400 });
    }

    const step = parseInt(data.step) || 1;
    if (step < 1 || step > 4) {
      return NextResponse.json({ error: 'Parameter step harus antara 1 dan 4' }, { status: 400 });
    }

    const schema = SCHEMAS[step];
    const stepLabel = STEP_LABELS[step];

    // Potong konteks agar tidak melebihi batas token
    const contextText = data.tpText.substring(0, 8000);

    const userPrompt = `Kamu sedang mengisi Bagian ${step}/4 dari Modul Ajar: "${stepLabel}".

INPUT DARI GURU:
- Mata Pelajaran: ${data.subject || 'Tidak diisi'}
- Program Keahlian: ${data.program || 'Semua Program Keahlian'}
- Fase/Kelas: ${data.phase || 'E'}${data.grade ? '/' + data.grade : ''}
- Semester: ${data.semester || 'Ganjil'}
- Tahun Pelajaran: ${data.year || '2025/2026'}
- Target TP Nomor: ${data.targetTp || 'TP-01'}
- Isi TP yang dimaksud: ${data.targetTpText || 'Lihat dari dokumen referensi'}
- Nama Guru: ${data.teacher || 'Tidak diisi'}

DOKUMEN REFERENSI (Potongan dari file TP & ATP yang diupload guru):
---
${contextText}
---

Isi setiap field dalam skema JSON di bawah ini berdasarkan data guru di atas.
Ikuti instruksi pada setiap field "prompt" dengan seksama.
Gunakan konteks sekolah SMK Muhammadiyah 3 Purbalingga, Jawa Tengah.
Kembalikan HANYA objek JSON yang memiliki struktur PERSIS sama dengan skema, tanpa teks tambahan.

SKEMA YANG HARUS DIISI:
${JSON.stringify(schema, null, 2)}`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Groq API Error (step ${step}):`, errorText);

      // Deteksi rate limit agar frontend bisa retry
      if (res.status === 429) {
        return NextResponse.json(
          { error: 'RATE_LIMIT', message: 'Batas request tercapai. Harap tunggu beberapa detik.' },
          { status: 429 }
        );
      }
      return NextResponse.json({ error: `Gagal menghubungi AI pada step ${step}: ${res.status}` }, { status: 500 });
    }

    const aiData = await res.json();
    const content = aiData.choices[0].message.content;

    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error(`JSON Parse Error (step ${step}). Raw:`, content.substring(0, 500));
      return NextResponse.json({ error: `AI mengembalikan format tidak valid pada step ${step}. Silakan coba lagi.` }, { status: 500 });
    }

    return NextResponse.json({ step, result });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses: ' + error.message },
      { status: 500 }
    );
  }
}
