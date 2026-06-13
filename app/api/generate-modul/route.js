import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '../../../modul_ajar_ai_template.js';

export const dynamic = 'force-dynamic';
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
      apersepsi: "[Gunakan stimulus visual/audio fenomena NYATA di konteks Purbalingga. Sebutkan contoh konkret tempat/kegiatan industri, deskripsikan aktivitas peserta didik secara detail]",
      pertanyaan_pemantik: [
        "[Pertanyaan 1: Konkret, mengaitkan materi dengan kehidupan nyata/industri/kearifan lokal]",
        "[Pertanyaan 2: Analitis, menantang penalaran kritis]",
        "[Pertanyaan 3: Reflektif, mengandung dimensi nilai Islami (Muhammadiyah)]"
      ],
      penetapan_tujuan_bersama: "[Deskripsikan prosedur spesifik pelibatan suara peserta didik untuk menyepakati tujuan. Kaitkan dengan TP]",
      strategi_refleksi: "[Pilih teknik refleksi (3-2-1/Exit Ticket/dll) dan jelaskan instruksi spesifiknya yang relevan dengan produk belajar]"
    },
    meaningful_learning: {
      koneksi_dunia_nyata: "[Kaitkan materi SECARA EKSPLISIT dengan industri lokal Purbalingga. Sebutkan contoh penerapan nyata di pekerjaan sehari-hari]",
      koneksi_antar_mapel: {
        "Nama Mapel 1": "[Koneksi substantif dengan materi]",
        "Nama Mapel 2": "[Koneksi substantif dengan materi]"
      },
      koneksi_kearifan_lokal: "[Kaitkan materi dengan kearifan lokal Purbalingga secara bermakna, atau isi null jika tidak relevan]",
      produk_bermakna: "[Deskripsikan detail format, isi, kriteria, dan nilai guna produk bagi peserta didik di dunia industri]"
    },
    joyful_learning: {
      model_pembelajaran: "[Jelaskan penerapan model pembelajaran (PBL/PjBL/dll) secara spesifik, langkah konkret penerapannya bukan definisi]",
      variasi_aktivitas: {
        individu: "[Aktivitas individu dengan nama/metode jelas]",
        berpasangan: "[Aktivitas berpasangan dengan nama/metode jelas]",
        kelompok: "[Aktivitas kelompok dengan nama/metode jelas]",
        presentasi: "[Aktivitas presentasi dengan nama/metode jelas]"
      },
      diferensiasi_pembelajaran: {
        konten: "[Pilihan diferensiasi konten/materi yang relevan]",
        proses: "[Pilihan diferensiasi proses/cara belajar]",
        produk: "[Pilihan diferensiasi produk/hasil karya]"
      },
      integrasi_nilai: "[Integrasikan nilai Islami (Muhammadiyah) secara organik ke aktivitas/diskusi/produk, bukan sekadar pembuka doa]"
    }
  }
};

const SCHEMA_STEP_3 = {
  skenario_pembelajaran: {
    pertemuan: [
      {
        nomor: 1,
        topik: "[Isi Topik spesifik pertemuan ini]",
        alokasi_waktu: "[Waktu pertemuan 1, misal: 5 JP (225 menit)]",
        pendahuluan: {
          durasi: "[Estimasi: 30 menit]",
          kegiatan_guru: [
            "[MINDFUL] Langkah 1 — Pembukaan ritual: Salam, basmallah/doa pembuka, cek kehadiran dan kesiapan",
            "[MINDFUL] Langkah 2 — Stimulus dan aktivasi pengetahuan awal: Gunakan stimulus kontekstual lokal, cara memancing respons (Durasi: ... menit)",
            "[MINDFUL] Langkah 3 — Apersepsi dan pertanyaan pemantik: Kutip dari bagian pemantik, gunakan teknik tanya-jawab",
            "[MINDFUL] Langkah 4 — Penetapan tujuan bersama: Cara guru menyampaikan TP dan IKTP, kontrak belajar singkat"
          ],
          kegiatan_peserta_didik: [
            "[Langkah 1 — Siswa membalas salam, berdoa, merespons kehadiran]",
            "[Langkah 2 — Siswa mengamati stimulus dan memberikan respons pertama]",
            "[Langkah 3 — Siswa merespons pertanyaan pemantik secara aktif]",
            "[Langkah 4 — Siswa mencatat tujuan dan menyepakati kontrak belajar]"
          ]
        },
        inti: {
          durasi: "[Estimasi: 165 menit]",
          kegiatan_guru: [
            "[MEANINGFUL] Langkah 1 — Penyampaian materi dengan konteks nyata (Koneksikan dengan konteks lokal secara eksplisit)",
            "[JOYFUL] Langkah 2 — Aktivitas individual/berpasangan/kelompok (Deskripsi konkret guru memfasilitasi aktivitas)",
            "[MEANINGFUL] Langkah 3 — Integrasi nilai karakter Islami secara kontekstual",
            "[JOYFUL] Langkah 4 — Lanjutan aktivitas variatif sesuai sintaks model pembelajaran",
            "[MEANINGFUL] Langkah 5 — Pengerjaan produk belajar: Guru memantau dan memberi scaffolding langkah demi langkah"
          ],
          kegiatan_peserta_didik: [
            "[Langkah 1 — Siswa merespons materi dan menghubungkannya dengan pengalaman/konteks lokal]",
            "[Langkah 2 — Siswa berkolaborasi atau melakukan aktivitas mandiri (mind map, peer review, gallery walk, dll)]",
            "[Langkah 3 — Siswa merefleksikan keterkaitan nilai dengan materi]",
            "[Langkah 4 — Siswa mempraktikkan/mensimulasikan kegiatan]",
            "[Langkah 5 — Siswa mengerjakan produk belajar]"
          ]
        },
        penutup: {
          durasi: "[Estimasi: 30 menit]",
          kegiatan_guru: [
            "[MINDFUL] Langkah 1 — Konsolidasi dan penyimpulan: Guru membimbing siswa menarik kesimpulan bersama",
            "[MINDFUL] Langkah 2 — Asesmen formatif cepat: Teknik lisan/exit ticket, sebutkan jumlah pertanyaan",
            "[MINDFUL] Langkah 3 — Refleksi 3-2-1: Guru menginstruksikan menulis 3 hal dipelajari, 2 pertanyaan, 1 cara penerapan",
            "[MINDFUL] Langkah 4 — Jembatan ke pertemuan berikutnya: Informasikan teaser topik selanjutnya dan tugas mandiri",
            "[MINDFUL] Langkah 5 — Penutupan ritual: Doa penutup dan salam"
          ],
          kegiatan_peserta_didik: [
            "[Langkah 1 — Siswa merumuskan kesimpulan secara lisan/tulis]",
            "[Langkah 2 — Siswa merespons asesmen formatif cepat]",
            "[Langkah 3 — Siswa menuliskan refleksi 3-2-1]",
            "[Langkah 4 — Siswa mencatat informasi pertemuan depan dan tugas]",
            "[Langkah 5 — Siswa berdoa dan menjawab salam]"
          ]
        }
      },
      {
        nomor: 2,
        topik: "[Isi Topik spesifik pertemuan 2]",
        alokasi_waktu: "[Waktu pertemuan 2]",
        pendahuluan: {
          durasi: "[Estimasi: 30 menit]",
          kegiatan_guru: [
            "[MINDFUL] Langkah 1 — Pembukaan ritual",
            "[MINDFUL] Langkah 2 — Review pertemuan sebelumnya",
            "[MINDFUL] Langkah 3 — Apersepsi lanjutan",
            "[MINDFUL] Langkah 4 — Penyampaian tujuan/fokus pertemuan 2"
          ],
          kegiatan_peserta_didik: [
            "[Langkah 1 — Merespons pembukaan]",
            "[Langkah 2 — Menyimak dan mengingat kembali]",
            "[Langkah 3 — Merespons apersepsi]",
            "[Langkah 4 — Mencatat tujuan]"
          ]
        },
        inti: {
          durasi: "[Estimasi: 165 menit]",
          kegiatan_guru: [
            "[MEANINGFUL] Langkah 1 — Fasilitasi diskusi mendalam",
            "[JOYFUL] Langkah 2 — Presentasi hasil/produk belajar",
            "[MEANINGFUL] Langkah 3 — Integrasi nilai karakter lanjutan",
            "[JOYFUL] Langkah 4 — Umpan balik antar teman (Peer Review)",
            "[MEANINGFUL] Langkah 5 — Finalisasi produk belajar"
          ],
          kegiatan_peserta_didik: [
            "[Langkah 1 — Berdiskusi aktif]",
            "[Langkah 2 — Siswa/kelompok mempresentasikan produk]",
            "[Langkah 3 — Merefleksikan nilai karakter]",
            "[Langkah 4 — Memberikan tanggapan konstruktif]",
            "[Langkah 5 — Menyempurnakan produk]"
          ]
        },
        penutup: {
          durasi: "[Estimasi: 30 menit]",
          kegiatan_guru: [
            "[MINDFUL] Langkah 1 — Konsolidasi hasil akhir",
            "[MINDFUL] Langkah 2 — Asesmen formatif/sumatif",
            "[MINDFUL] Langkah 3 — Refleksi 3-2-1 / Evaluasi pembelajaran",
            "[MINDFUL] Langkah 4 — Jembatan materi berikutnya",
            "[MINDFUL] Langkah 5 — Penutupan ritual"
          ],
          kegiatan_peserta_didik: [
            "[Langkah 1 — Menyimpulkan capaian akhir]",
            "[Langkah 2 — Mengerjakan asesmen]",
            "[Langkah 3 — Mengisi refleksi]",
            "[Langkah 4 — Mencatat info lanjutan]",
            "[Langkah 5 — Berdoa dan salam]"
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

    // Potong konteks agar tidak melebihi batas token, perbesar jadi 80000 untuk Gemini
    const contextText = data.tpText.substring(0, 80000);

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

    const apiKeys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY
    ].filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: 'API Key Gemini belum diatur di environment (Step ' + step + ')' }, { status: 500 });
    }

    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [
          { parts: [{ text: userPrompt }] }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.4
        }
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Gemini API Error (step ${step}):`, errorText);

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
    const content = aiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return NextResponse.json({ error: `AI mengembalikan respon kosong pada step ${step}.` }, { status: 500 });
    }

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
