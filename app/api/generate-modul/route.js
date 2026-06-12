import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '../../../modul_ajar_ai_template.js';

export const runtime = 'nodejs';
export const maxDuration = 120;

// ─────────────────────────────────────────────────────────
// SCHEMA CHUNKS — dipecah menjadi 4 bagian kecil
// ─────────────────────────────────────────────────────────

const SCHEMA_STEP_1 = {
  identitas: {
    nama_mata_pelajaran: { prompt: "Tulis nama mata pelajaran lengkap sesuai nomenklatur Kurikulum Merdeka." },
    program_keahlian: { prompt: "Isi dengan program keahlian spesifik atau 'Semua Program Keahlian'." },
    fase_kelas: { prompt: "Format: 'Fase [E/F] / Kelas [X/XI/XII]'." },
    semester: { prompt: "'Ganjil' atau 'Genap' sesuai semester berjalan." },
    tahun_pelajaran: { prompt: "Format 'YYYY/YYYY'." },
    judul_modul: { prompt: "Judul modul menarik, kontekstual lokal, maks 20 kata, bukan generik." },
    nomor_modul: { prompt: "Format: 'MA-[KODE_MAPEL]-[NOMOR_URUT]'." },
    nomor_tp: { prompt: "Nomor TP yang dirujuk, misal 'TP-01'." },
    alokasi_waktu: { prompt: "Format: '[Total JP] JP ([pertemuan] Pertemuan × [JP/ptm] JP @ [menit] menit)'." },
    pertemuan_ke: { prompt: "Format: 'Pertemuan ke-[awal] s.d. ke-[akhir]'." }
  },
  kerangka_kurikulum: {
    capaian_pembelajaran: { prompt: "Salin Capaian Pembelajaran (CP) resmi dari dokumen referensi yang relevan dengan mata pelajaran dan fase." },
    elemen_cp: { prompt: "Array elemen CP yang relevan dengan modul ini, ambil dari dokumen CP resmi." },
    tujuan_pembelajaran: { prompt: "Rumuskan TP: 'Peserta didik mampu...' + kompetensi + konten + konteks lokal. Gunakan taksonomi Bloom C1-C6." },
    indikator_ketercapaian_tp: { prompt: "Buat 2-4 IKTP spesifik dan terukur, dari LOTS ke HOTS. Format array string 'IKTP [no_tp].[no_indikator]: ...'." },
    posisi_dalam_atp: { prompt: "Jelaskan urutan ke-berapa dalam ATP, peran modul, prasyarat, dan kelanjutan." },
    dimensi_profil_lulusan: { prompt: "Pilih 2-4 dimensi PPP yang benar-benar dikembangkan. Format array string: 'Dimensi → penjelasan konkret'." }
  }
};

const SCHEMA_STEP_2 = {
  rancangan_pembelajaran: {
    mindful_learning: {
      apersepsi: { prompt: "Stimulus konkret dari lingkungan LOKAL sekolah, maks 10 menit, aktivasi pengetahuan awal." },
      pertanyaan_pemantik: { prompt: "Buat 3 pertanyaan: (1) konteks sehari-hari lokal, (2) kausal/ilmiah fenomena lokal spesifik, (3) nilai moral/spiritual/sosial. Format array string." },
      penetapan_tujuan_bersama: { prompt: "Prosedur 5-10 menit yang melibatkan suara siswa, hubungkan TP dengan relevansi personal." },
      strategi_refleksi: { prompt: "Teknik refleksi terstruktur: 3-2-1, Exit Ticket, PMI, dll. Jelaskan instruksi spesifiknya." }
    },
    meaningful_learning: {
      koneksi_dunia_nyata: { prompt: "Min 2 industri/profesi/fenomena LOKAL yang relevan. Nama industri/tempat lokal yang nyata." },
      koneksi_antar_mapel: { prompt: "2-4 mapel lain dengan koneksi substantif. Format object: key nama mapel, value penjelasan koneksi konkret." },
      koneksi_kearifan_lokal: { prompt: "Kearifan lokal/tradisi daerah yang relevan. Jika tidak ada, tulis null. Jangan mengarang." },
      produk_bermakna: { prompt: "Artefak nyata yang bisa digunakan di luar kelas: nama produk, format, isi minimal, fungsi." }
    },
    joyful_learning: {
      model_pembelajaran: { prompt: "Pilih model paling sesuai (Discovery/Inquiry/PBL/PjBL/dll). Nama model + alasan + cara implementasi konteks lokal." },
      variasi_aktivitas: { prompt: "Min 3 moda sosial: individu, berpasangan, kelompok, presentasi. Format object: key moda, value deskripsi aktivitas." },
      diferensiasi_pembelajaran: { prompt: "Min 3 dari 4 aspek: konten, proses, produk, lingkungan. Min 2 pilihan konkret per aspek. Format object." },
      integrasi_nilai: { prompt: "Untuk sekolah Islam: 1 ayat/hadits relevan + terjemahan + koneksi substantif + pembiasaan. Untuk non-Islam: nilai karakter umum." }
    }
  }
};

const SCHEMA_STEP_3 = {
  skenario_pembelajaran: {
    _instruction: "Buat skenario untuk setiap pertemuan. Setiap pertemuan: pendahuluan (10-15%), inti (70-75%), penutup (10-15%).",
    pertemuan: [
      {
        nomor: 1,
        topik: { prompt: "Topik pertemuan pertama: fokus sebagian TP, bangun fondasi, konteks lokal di nama topik." },
        alokasi_waktu: { prompt: "Format: '[JP] JP ([menit] menit)'." },
        pendahuluan: {
          durasi: { prompt: "Durasi pendahuluan, misal '30 menit'." },
          kegiatan_guru: { prompt: "Array langkah kegiatan guru: salam+doa, presensi, apersepsi [MINDFUL], pertanyaan pemantik, penyampaian TP." },
          kegiatan_peserta_didik: { prompt: "Array langkah kegiatan siswa paralel dengan kegiatan guru di atas." }
        },
        inti: {
          durasi: { prompt: "Durasi inti, misal '165 menit'." },
          kegiatan_guru: { prompt: "Array langkah kegiatan guru: sajikan materi minimal [MEANINGFUL], bagi kelompok, bagikan LKPD, fasilitasi aktivitas [JOYFUL], integrasikan nilai, konsolidasi." },
          kegiatan_peserta_didik: { prompt: "Array langkah kegiatan siswa paralel dengan guru, aktif dan bervariasi." }
        },
        penutup: {
          durasi: { prompt: "Durasi penutup, misal '30 menit'." },
          kegiatan_guru: { prompt: "Array langkah: penyimpulan bersama, asesmen formatif cepat, fasilitasi refleksi [MINDFUL], info tindak lanjut, doa+salam." },
          kegiatan_peserta_didik: { prompt: "Array langkah siswa: susun kesimpulan, jawab formatif, isi refleksi, catat tugas, doa+salam." }
        }
      },
      {
        nomor: 2,
        topik: { prompt: "Topik pertemuan kedua: pendalaman/penerapan dari pertemuan 1, menuju produk akhir." },
        alokasi_waktu: { prompt: "Format: '[JP] JP ([menit] menit)'." },
        pendahuluan: {
          durasi: { prompt: "Durasi pendahuluan." },
          kegiatan_guru: { prompt: "Array kegiatan guru pendahuluan pertemuan 2: review pertemuan 1, motivasi, sampaikan alur hari ini." },
          kegiatan_peserta_didik: { prompt: "Array kegiatan siswa paralel." }
        },
        inti: {
          durasi: { prompt: "Durasi inti pertemuan 2." },
          kegiatan_guru: { prompt: "Array kegiatan guru inti: fokus pada pengerjaan produk bermakna, bimbing, fasilitasi presentasi/gallery walk." },
          kegiatan_peserta_didik: { prompt: "Array kegiatan siswa: kerjakan produk, presentasi, berikan umpan balik." }
        },
        penutup: {
          durasi: { prompt: "Durasi penutup pertemuan 2." },
          kegiatan_guru: { prompt: "Array kegiatan guru: konsolidasi seluruh pembelajaran, asesmen sumatif, refleksi akhir modul, doa+salam." },
          kegiatan_peserta_didik: { prompt: "Array kegiatan siswa paralel." }
        }
      }
    ]
  }
};

const SCHEMA_STEP_4 = {
  asesmen: {
    diagnostik: {
      teknik: { prompt: "Teknik asesmen di awal pembelajaran, 10-15 menit, tidak menimbulkan kecemasan." },
      tindak_lanjut: { prompt: "2-3 skenario tindak lanjut: jika belum paham, sebagian paham, mayoritas paham." }
    },
    formatif: {
      teknik: { prompt: "Min 3 teknik berbeda: observasi, lisan, tulisan. Format array string." },
      instrumen: { prompt: "Instrumen konkret untuk setiap teknik formatif. Nama spesifik, bukan generik." },
      tindak_lanjut: { prompt: "Format object: remediasi (belum IKTP), pengayaan (melampaui), penguatan (mendekati)." }
    },
    sumatif: {
      teknik: { prompt: "Teknik sumatif otentik, selaras dengan produk bermakna di rancangan pembelajaran." },
      instrumen: { prompt: "Instrumen sumatif: rubrik (sebutkan aspek dan level), soal (sebutkan jumlah dan bentuk)." },
      kktp: { prompt: "Format object: kriteria (string dengan min 2 kriteria spesifik terukur) dan nilai_minimum (number, 70-75)." },
      dimensi_dinilai: { prompt: "Object: key nama dimensi PPP, value persentase (string %). Total harus 100%." }
    }
  },
  materi_sumber: {
    materi_pokok: { prompt: "3-6 topik esensial, urut dari dasar ke kompleks, konteks lokal. Format array string." },
    materi_pengayaan: { prompt: "Materi lebih kompleks untuk siswa melampaui TP. Kedalaman, bukan volume." },
    materi_remedial: { prompt: "Penyederhanaan konsep, pendekatan visual/konkret, bisa mandiri di luar jam." },
    sumber_belajar_utama: { prompt: "2-4 sumber resmi, tersedia di SMK daerah, aktual 5 tahun terakhir. Format array string." },
    sumber_belajar_pendukung: { prompt: "2-4 sumber pendukung kontekstual lokal, gratis, beragam media. Format array string." },
    media_pembelajaran: { prompt: "Min 2 jenis media, realistis tersedia di SMK daerah. Spesifikasi singkat per media." },
    alat_bahan: { prompt: "Alat/bahan fisik untuk pembelajaran. Semua harus ada di SMK. Format array string." },
    lkpd: { prompt: "Daftar LKPD. Format array object: {kode: 'LKPD-01a', judul: '...', pertemuan: 1}." }
  },
  rubrik_penilaian: {
    objek_penilaian: { prompt: "Nama produk/karya yang dinilai. Konsisten dengan produk bermakna." },
    aspek: [
      {
        nama: { prompt: "Aspek 1 — PENGETAHUAN: format 'Pengetahuan: [Objek Penilaian]'." },
        level_1: { deskriptor: { prompt: "Deskriptor spesifik, terukur, menghargai usaha." } },
        level_2: { deskriptor: { prompt: "Deskriptor level Cukup, perbedaan nyata dari level 1." } },
        level_3: { deskriptor: { prompt: "Deskriptor level Baik, perbedaan nyata dari level 2." } },
        level_4: { deskriptor: { prompt: "Deskriptor Sangat Baik, ambisius namun mungkin dicapai." } }
      },
      {
        nama: { prompt: "Aspek 2 — KETERAMPILAN: format 'Keterampilan: [Objek Penilaian]'." },
        level_1: { deskriptor: { prompt: "Deskriptor spesifik terukur." } },
        level_2: { deskriptor: { prompt: "Deskriptor Cukup." } },
        level_3: { deskriptor: { prompt: "Deskriptor Baik." } },
        level_4: { deskriptor: { prompt: "Deskriptor Sangat Baik." } }
      },
      {
        nama: { prompt: "Aspek 3 — KOMUNIKASI: format 'Komunikasi: [Objek Penilaian]'." },
        level_1: { deskriptor: { prompt: "Deskriptor spesifik terukur." } },
        level_2: { deskriptor: { prompt: "Deskriptor Cukup." } },
        level_3: { deskriptor: { prompt: "Deskriptor Baik." } },
        level_4: { deskriptor: { prompt: "Deskriptor Sangat Baik." } }
      },
      {
        nama: { prompt: "Aspek 4 — SIKAP: format 'Sikap: [Nilai Karakter]'." },
        level_1: { deskriptor: { prompt: "Deskriptor spesifik terukur." } },
        level_2: { deskriptor: { prompt: "Deskriptor Cukup." } },
        level_3: { deskriptor: { prompt: "Deskriptor Baik." } },
        level_4: { deskriptor: { prompt: "Deskriptor Sangat Baik." } }
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
