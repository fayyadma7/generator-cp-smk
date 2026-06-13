/**
 * PROMPTS GENERATOR LAMPIRAN MODUL AJAR
 * ─────────────────────────────────────────────────────────────────────────────
 * Setiap prompt dirancang untuk mengisi field-field pada lampiranSchema.js.
 * Gunakan sebagai system/user prompt pada API call ke model AI.
 *
 * KONVENSI:
 *   - INPUT_GURU   → variabel yang diisi oleh guru melalui form di website
 *   - OUTPUT_FIELD → nama field di lampiranSchema.js yang akan diisi
 *   - Setiap prompt menghasilkan JSON yang langsung di-merge ke schema
 * ─────────────────────────────────────────────────────────────────────────────
 */


// ═════════════════════════════════════════════════════════════════════════════
// SISTEM PROMPT GLOBAL
// Digunakan sebagai system prompt di SEMUA request API lampiran
// ═════════════════════════════════════════════════════════════════════════════

export const SYSTEM_PROMPT_GLOBAL = `
Kamu adalah asisten AI spesialis pengembang perangkat ajar untuk jenjang SMK dan SMA
di Indonesia yang menggunakan Kurikulum Merdeka.

TUGAS UTAMA:
Menghasilkan konten lampiran modul ajar yang lengkap, kontekstual, ilmiah, dan siap
pakai. Setiap output harus mencerminkan karakteristik lokal daerah, bidang keahlian
siswa, serta nilai-nilai yang relevan dengan identitas sekolah.

PRINSIP PENULISAN:
1. Gunakan Bahasa Indonesia yang baku, jelas, dan sesuai usia peserta didik (15–18 tahun).
2. Konten harus KONTEKSTUAL — selalu kaitkan dengan lokasi, budaya, dan kondisi nyata
   di daerah yang disebutkan guru. Jangan gunakan contoh generik.
3. Pertanyaan dan instruksi harus mendorong BERPIKIR TINGKAT TINGGI (HOTS) sesuai
   Taksonomi Bloom level Analisis (C4), Evaluasi (C5), dan Kreasi (C6).
4. Jika sekolah memiliki nilai/identitas keislaman, integrasikan nilai Islami secara
   natural (kutipan Al-Quran/Hadis yang relevan) — JANGAN dipaksakan.
5. Jika sekolah TIDAK bernuansa keislaman, abaikan integrasi nilai keagamaan.
6. Setiap rubrik penilaian harus memiliki deskriptor yang TERUKUR dan MEMBEDAKAN
   antar tingkat capaian secara jelas.
7. Bahan remediasi harus menggunakan bahasa yang lebih sederhana dari modul utama.
   Bahan pengayaan harus melampaui tujuan pembelajaran utama secara signifikan.

FORMAT OUTPUT:
- Selalu kembalikan JSON murni tanpa markdown, tanpa preamble, tanpa komentar.
- Gunakan struktur field persis seperti yang diminta di setiap prompt.
- Jika ada field yang tidak relevan dengan konteks, isi dengan string kosong "".
- Angka/integer jangan dibungkus tanda kutip.
`;


// ═════════════════════════════════════════════════════════════════════════════
// PROMPT 0 — METADATA & DAFTAR LAMPIRAN
// Mengisi: dokumenHeader + daftarLampiran
// ═════════════════════════════════════════════════════════════════════════════

export const PROMPT_HEADER_DAN_DAFTAR = (inputGuru) => `
Kamu diminta mengisi metadata dokumen lampiran modul ajar dan membuat daftar lampiran
yang sistematis berdasarkan informasi berikut dari guru:

INPUT GURU:
- Nama Sekolah           : ${inputGuru.namaSekolah}
- Tagline/Motto Sekolah  : ${inputGuru.taglineSekolah}
- Judul Modul            : ${inputGuru.judulModul}
- Kode Modul             : ${inputGuru.kodeModul}
- Fase / Kelas           : ${inputGuru.faseKelas}
- Semester               : ${inputGuru.semester}
- Tahun Pelajaran        : ${inputGuru.tahunPelajaran}
- Mata Pelajaran         : ${inputGuru.mataPelajaran}
- Kurikulum              : ${inputGuru.kurikulum}
- Pendekatan Pembelajaran: ${inputGuru.pendekatanPembelajaran}
- Lampiran yang diminta  : ${inputGuru.daftarLampiranYangDiminta}
  (contoh: "LKPD x2, Asesmen Formatif, Asesmen Sumatif, Rekap Kelas,
   Media Pembelajaran, Lembar Refleksi, Pengayaan, Remediasi")

INSTRUKSI:
1. Isi semua field dokumenHeader secara lengkap.
2. Buat daftarLampiran sesuai lampiran yang diminta guru. Nomori secara urut.
   Setiap nama lampiran harus deskriptif dan mencerminkan isi sebenarnya.
3. Halaman dimulai dari 2 untuk lampiran pertama (halaman 1 = cover/daftar isi).
   Perkirakan jumlah halaman tiap lampiran berdasarkan kompleksitasnya:
   LKPD = 2 hal, Asesmen Formatif = 3 hal, Asesmen Sumatif = 2 hal,
   Rekap Kelas = 2 hal, Media Pembelajaran = 2 hal, Refleksi = 2 hal,
   Pengayaan = 3 hal, Remediasi = 3 hal.

OUTPUT JSON (ikuti struktur ini persis):
{
  "dokumenHeader": {
    "sekolah": "",
    "tagline": "",
    "judulDokumen": "DOKUMEN LAMPIRAN",
    "judulModul": "",
    "kodeModul": "",
    "faseKelas": "",
    "semester": "",
    "mataPelajaran": "",
    "kurikulum": ""
  },
  "daftarLampiran": [
    {
      "no": 1,
      "namaLampiran": "",
      "keterangan": "",
      "halaman": 2
    }
  ]
}
`;


// ═════════════════════════════════════════════════════════════════════════════
// PROMPT 1 — LKPD PERTEMUAN 1 (lkpd01a)
// Mengisi: lkpd01a — LKPD berbasis aktivitas (Gallery Walk / diskusi / observasi)
// ═════════════════════════════════════════════════════════════════════════════

export const PROMPT_LKPD_PERTEMUAN_1 = (inputGuru) => `
Kamu diminta membuat LKPD (Lembar Kerja Peserta Didik) untuk Pertemuan ke-1 dari
modul ajar berikut:

KONTEKS MODUL:
- Sekolah          : ${inputGuru.namaSekolah}
- Mata Pelajaran   : ${inputGuru.mataPelajaran}
- Kelas            : ${inputGuru.faseKelas}
- Tujuan Pembelajaran (TP): ${inputGuru.tujuanPembelajaran}
- Topik Pertemuan 1: ${inputGuru.topikPertemuan1}
- Metode/Aktivitas : ${inputGuru.metodePertemuan1}
  (contoh: Gallery Walk, Studi Kasus, Observasi Langsung, dll.)
- Konteks Lokal    : ${inputGuru.konteksLokal}
  (contoh: nama daerah, fenomena/isu lokal, industri setempat, dll.)
- Nilai Sekolah    : ${inputGuru.nilaiSekolah}
  (contoh: "Islami", "Nasionalis", "Entrepreneur", atau "tidak ada")
- Jumlah Aspek Analisis yang Diinginkan: ${inputGuru.jumlahAspekAnalisis}
  (default: 7 aspek, A sampai G)

INSTRUKSI PENULISAN LKPD:
1. Tujuan Pembelajaran harus dikutip PERSIS dari input guru (field tujuanPembelajaran).
2. Petunjuk kerja: buat 4–5 poin instruksi operasional yang jelas dan urut.
3. Tabel Analisis: buat ${inputGuru.jumlahAspekAnalisis || 7} aspek (kode A, B, C, ...).
   - Setiap aspek punya judulKolom (nama singkat, huruf kapital semua) dan
     pertanyaan (instruksi lengkap + spesifikasi minimal jawaban, misal "minimal 3 kalimat").
   - Dimensi analisis yang WAJIB ada: Deskripsi, Lokasi/Waktu, Penyebab, Dampak,
     Keterkaitan Ilmiah. Aspek tambahan disesuaikan dengan topik dan nilai sekolah.
   - Jika sekolah bernilai Islami, aspek terakhir = refleksi nilai Islami.
   - Jika tidak, aspek terakhir = refleksi/solusi sebagai warga masyarakat.
4. Penilaian Gallery Walk (atau aktivitas peer): buat instruksi yang mendorong
   siswa memberikan komentar SUBSTANTIF (bukan sekadar "bagus"), 4 baris tabel.

OUTPUT JSON (ikuti struktur ini persis):
{
  "judulLampiran": "LKPD-01a",
  "subjudul": "",
  "metode": "",
  "pertemuan": "Pertemuan ke-1",
  "identitas": {
    "sekolah": "",
    "mataPelajaran": "",
    "kelas": "",
    "tp": ""
  },
  "headerForm": {
    "tujuanPembelajaran": "",
    "namaFenomenaLabel": "Nama Topik / Objek yang Dianalisis:",
    "namaKelompokLabel": "Nama / Kelompok:",
    "kelasLabel": "Kelas:",
    "tanggalLabel": "Tanggal:"
  },
  "petunjuk": [],
  "tabelAnalisis": [
    { "kode": "A", "judulKolom": "", "pertanyaan": "" }
  ],
  "penilaianGalleryWalk": {
    "instruksi": "",
    "jumlahBaris": 4,
    "kolomHeader": ["Kelompok yang Dikunjungi", "Komentar / Pertanyaan"]
  }
}
`;


// ═════════════════════════════════════════════════════════════════════════════
// PROMPT 2 — LKPD PERTEMUAN 2 (lkpd01b)
// Mengisi: lkpd01b — LKPD berbasis analisis keterkaitan / sintesis
// ═════════════════════════════════════════════════════════════════════════════

export const PROMPT_LKPD_PERTEMUAN_2 = (inputGuru) => `
Kamu diminta membuat LKPD Pertemuan ke-2 yang berfokus pada ANALISIS KETERKAITAN
dan SINTESIS dari dua atau lebih konsep/fenomena yang telah dipelajari di Pertemuan 1.

KONTEKS MODUL:
- Sekolah           : ${inputGuru.namaSekolah}
- Mata Pelajaran    : ${inputGuru.mataPelajaran}
- Kelas             : ${inputGuru.faseKelas}
- Tujuan Pembelajaran (TP): ${inputGuru.tujuanPembelajaran}
- Topik Pertemuan 2 : ${inputGuru.topikPertemuan2}
- Konsep/Dimensi yang Dikaitkan: ${inputGuru.dimensiKeterkaitan}
  (contoh: "alam dan sosial", "teori dan praktik industri", "sains dan teknologi")
- Konteks Lokal     : ${inputGuru.konteksLokal}
- Nilai Sekolah     : ${inputGuru.nilaiSekolah}
- Jumlah Pasangan Keterkaitan: ${inputGuru.jumlahPasanganKeterkaitan || 3}

INSTRUKSI PENULISAN LKPD:
1. Bagian A (Identifikasi): Buat dua kolom yang meminta siswa mengidentifikasi
   masing-masing dimensi yang akan dikaitkan. Minimal 2 entri per kolom, plus
   1 baris opsional. Label kolom harus spesifik sesuai topik (bukan generik).
2. Bagian B (Bagan): Instruksi harus mewajibkan siswa MENGGAMBAR bagan panah
   yang menunjukkan hubungan sebab-akibat. Sediakan contoh format panah yang jelas.
   labelRuang harus deskriptif (bukan hanya "Ruang Gambar").
3. Bagian C (Uraian): Buat ${inputGuru.jumlahPasanganKeterkaitan || 3} baris pasangan
   keterkaitan. Kolom kiri = identifikasi pasangan (format template isian),
   kolom kanan = penjelasan ilmiah mekanisme sebab-akibat.
4. Bagian D (Refleksi): Pertanyaan refleksi harus menuntut SIKAP dan TANGGUNG JAWAB
   siswa terhadap isu yang dipelajari. Jika sekolah Islami, kaitkan dengan ayat/peran
   khalifah. Jika tidak, kaitkan dengan peran sebagai warga negara/masyarakat.

OUTPUT JSON (ikuti struktur ini persis):
{
  "judulLampiran": "LKPD-01b",
  "subjudul": "",
  "deskripsiPertemuan": "",
  "identitas": {
    "sekolah": "",
    "mataPelajaran": "",
    "kelas": "",
    "tp": ""
  },
  "headerForm": {
    "namaKelompokLabel": "Nama / Kelompok:",
    "kelasLabel": "Kelas:",
    "tanggalLabel": "Tanggal:",
    "tujuan": ""
  },
  "bagianA": {
    "judul": "BAGIAN A — IDENTIFIKASI",
    "kolomKiri": { "label": "", "instruksi": "", "jumlahEntri": 3 },
    "kolomKanan": { "label": "", "instruksi": "", "jumlahEntri": 3 }
  },
  "bagianB": {
    "judul": "BAGIAN B — BAGAN KETERKAITAN",
    "instruksi": "",
    "contohFormat": "",
    "labelRuang": ""
  },
  "bagianC": {
    "judul": "BAGIAN C — ANALISIS KETERKAITAN (URAIAN)",
    "jumlahPasangan": 3,
    "kolomHeader": ["Pasangan Keterkaitan", "Penjelasan Ilmiah (mekanisme sebab-akibat)"]
  },
  "bagianD": {
    "judul": "BAGIAN D — REFLEKSI",
    "pertanyaanRefleksi": ""
  }
}
`;


// ═════════════════════════════════════════════════════════════════════════════
// PROMPT 3 — INSTRUMEN ASESMEN FORMATIF (asesmenFormatif)
// Mengisi: asesmenFormatif — pertanyaan lisan + kuis tulis pilihan ganda
// ═════════════════════════════════════════════════════════════════════════════

export const PROMPT_ASESMEN_FORMATIF = (inputGuru) => `
Kamu diminta membuat instrumen asesmen FORMATIF yang terdiri dari:
(A) Pertanyaan lisan untuk Pertemuan 1, dan
(B) Soal kuis tulis pilihan ganda untuk Pertemuan 2.

KONTEKS MODUL:
- Sekolah              : ${inputGuru.namaSekolah}
- Mata Pelajaran       : ${inputGuru.mataPelajaran}
- Kelas                : ${inputGuru.faseKelas}
- Tujuan Pembelajaran  : ${inputGuru.tujuanPembelajaran}
- Indikator Ketercapaian Tujuan Pembelajaran (IKTP):
  ${inputGuru.iktp}
  (contoh: "1. Mengidentifikasi ..., 2. Menjelaskan ..., 3. Menganalisis ...")
- Materi Pertemuan 1   : ${inputGuru.topikPertemuan1}
- Materi Pertemuan 2   : ${inputGuru.topikPertemuan2}
- Konteks Lokal        : ${inputGuru.konteksLokal}
- Nilai Sekolah        : ${inputGuru.nilaiSekolah}
- Jumlah Pertanyaan Lisan: ${inputGuru.jumlahPertanyaanLisan || 3}
- Jumlah Soal Kuis     : ${inputGuru.jumlahSoalKuis || 5}

INSTRUKSI PEMBUATAN PERTANYAAN LISAN:
1. Buat ${inputGuru.jumlahPertanyaanLisan || 3} pertanyaan lisan yang:
   - Menguji pemahaman KONSEPTUAL (bukan sekadar hafalan)
   - Menggunakan konteks lokal spesifik dari input guru
   - Terdistribusi di level C2 (Memahami), C3 (Menerapkan), dan C4 (Menganalisis)
2. Kunci jawaban harus berupa POIN-POIN REFERENSI guru (bukan jawaban lengkap),
   mencakup kata kunci konsep yang harus muncul dalam jawaban siswa.

INSTRUKSI PEMBUATAN SOAL KUIS:
1. Buat ${inputGuru.jumlahSoalKuis || 5} soal pilihan ganda (A, B, C, D) yang:
   - Mengukur IKTP secara merata (jangan hanya satu indikator)
   - Menggunakan stem soal yang kontekstual (berbasis kasus lokal, bukan abstrak)
   - Pengecoh (distraktor) harus PLAUSIBEL — jawaban yang salah harus terlihat
     masuk akal bagi siswa yang belum paham benar
   - Hindari kata "bukan", "kecuali", "tidak" pada stem soal
   - Satu soal terakhir dianjurkan mengukur dimensi sikap/nilai (afektif)
2. Cantumkan kunci jawaban (satu huruf: A/B/C/D) untuk setiap soal.

OUTPUT JSON (ikuti struktur ini persis):
{
  "judulLampiran": "Instrumen Asesmen Formatif",
  "subjudul": "",
  "identitas": {
    "sekolah": "",
    "mataPelajaran": "",
    "kelas": "",
    "tp": ""
  },
  "bagianA": {
    "judul": "A. PERTANYAAN LISAN",
    "keterangan": "",
    "pertemuan": "Pertemuan ke-1",
    "kolomHeader": ["No.", "Pertanyaan Lisan", "Kunci Jawaban (Referensi Guru)"],
    "pertanyaan": [
      { "no": 1, "pertanyaan": "", "kunciJawaban": "" }
    ]
  },
  "bagianB": {
    "judul": "B. SOAL KUIS TULIS",
    "jumlahSoal": 5,
    "petunjuk": "",
    "headerForm": {
      "namaLabel": "Nama:",
      "kelasLabel": "Kelas:",
      "tanggalLabel": "Tanggal:"
    },
    "soal": [
      {
        "no": 1,
        "pertanyaan": "",
        "opsi": [
          { "huruf": "A", "teks": "" },
          { "huruf": "B", "teks": "" },
          { "huruf": "C", "teks": "" },
          { "huruf": "D", "teks": "" }
        ],
        "kunci": ""
      }
    ]
  }
}
`;


// ═════════════════════════════════════════════════════════════════════════════
// PROMPT 4 — INSTRUMEN ASESMEN SUMATIF (asesmenSumatif)
// Mengisi: asesmenSumatif — rubrik penilaian produk/jurnal/portofolio
// ═════════════════════════════════════════════════════════════════════════════

export const PROMPT_ASESMEN_SUMATIF = (inputGuru) => `
Kamu diminta membuat instrumen asesmen SUMATIF berupa rubrik penilaian holistik
untuk produk/karya/jurnal peserta didik.

KONTEKS MODUL:
- Sekolah              : ${inputGuru.namaSekolah}
- Mata Pelajaran       : ${inputGuru.mataPelajaran}
- Kelas                : ${inputGuru.faseKelas}
- Tujuan Pembelajaran  : ${inputGuru.tujuanPembelajaran}
- IKTP                 : ${inputGuru.iktp}
- Jenis Produk/Karya yang Dinilai: ${inputGuru.jenisProdukSumatif}
  (contoh: jurnal observasi, laporan praktikum, poster, presentasi, esai)
- Aspek Penilaian yang Diminta:
  ${inputGuru.aspekPenilaianSumatif}
  (contoh: "Pengetahuan, Keterampilan Analisis, Komunikasi, Sikap" — minimal 3 aspek)
- Bobot per Aspek      : ${inputGuru.bobotAspek}
  (contoh: "Pengetahuan 30%, Keterampilan 40%, Komunikasi 20%, Sikap 10%")
- Nilai KKTP           : ${inputGuru.kktp || 70}
- Nilai Sekolah        : ${inputGuru.nilaiSekolah}

INSTRUKSI PEMBUATAN RUBRIK:
1. Setiap aspek WAJIB memiliki 4 level deskriptor:
   - Perlu Bimbingan (skor 1): menggambarkan capaian PALING DASAR atau tidak tercapai
   - Cukup (skor 2)          : capaian minimal, ada kekurangan signifikan
   - Baik (skor 3)           : capaian standar sesuai harapan TP
   - Sangat Baik (skor 4)    : melampaui harapan TP, menunjukkan kemandirian/kreativitas
2. Setiap deskriptor harus OPERASIONAL dan TERUKUR — gunakan kata kerja yang bisa
   diamati (menyebutkan, menjelaskan, menganalisis, menghubungkan, dll.) dan
   cantumkan ANGKA MINIMAL yang jelas (misal: "menyebutkan ≥ 3 fenomena").
3. Jangan gunakan deskriptor yang ambigu seperti "cukup baik", "sudah lumayan", dll.
4. Formula nilai akhir = (Total Skor / Skor Maksimal) × 100.
   Hitung skor maksimal berdasarkan jumlah aspek × 4.
5. Jika sekolah Islami, satu aspek WAJIB mencakup dimensi nilai/karakter Islami.

OUTPUT JSON (ikuti struktur ini persis):
{
  "judulLampiran": "Instrumen Asesmen Sumatif",
  "subjudul": "",
  "identitas": {
    "sekolah": "",
    "mataPelajaran": "",
    "kelas": "",
    "tp": ""
  },
  "headerForm": {
    "namaPesertaDidikLabel": "Nama Peserta Didik:",
    "kelasLabel": "Kelas:",
    "tanggalPenilaianLabel": "Tanggal Penilaian:",
    "guruPenilaiLabel": "Guru Penilai:"
  },
  "kriteriaPenilaian": {
    "kktp": "",
    "formulaNilaiAkhir": ""
  },
  "rubrik": {
    "kolomHeader": [
      "Aspek Penilaian",
      "Perlu Bimbingan (1)",
      "Cukup (2)",
      "Baik (3)",
      "Sangat Baik (4)"
    ],
    "aspek": [
      {
        "namaAspek": "",
        "bobot": "",
        "perluBimbingan": "",
        "cukup": "",
        "baik": "",
        "sangatBaik": ""
      }
    ]
  },
  "totalSkor": {
    "skorMaksimal": null,
    "kolomSummary": [
      "Total Skor (maks.)",
      "Nilai Akhir",
      "Keterangan (Tercapai / Belum)"
    ]
  },
  "catatanGuru": true
}
`;


// ═════════════════════════════════════════════════════════════════════════════
// PROMPT 5 — REKAP KELAS (rekapKelas)
// Mengisi: rekapKelas — tabel rekapitulasi nilai seluruh siswa per kelas
// ═════════════════════════════════════════════════════════════════════════════

export const PROMPT_REKAP_KELAS = (inputGuru) => `
Kamu diminta membuat struktur tabel rekapitulasi nilai kelas yang sinkron
dengan rubrik asesmen sumatif yang telah dibuat sebelumnya.

KONTEKS:
- Sekolah          : ${inputGuru.namaSekolah}
- Mata Pelajaran   : ${inputGuru.mataPelajaran}
- Kelas            : ${inputGuru.faseKelas}
- Kode TP          : ${inputGuru.kodeModul}
- Semester         : ${inputGuru.semester}
- Aspek Penilaian (dari rubrik sumatif):
  ${inputGuru.aspekPenilaianSumatif}
- Skor Maksimal per Aspek: 4
- Jumlah Siswa per Kelas : ${inputGuru.jumlahSiswa || 32}
- Nilai KKTP       : ${inputGuru.kktp || 70}

INSTRUKSI:
1. Buat kolom aspek sesuai aspek yang ada di rubrik sumatif (kode A, B, C, dst.).
   Label kolom harus singkat tapi informatif (misal: "Aspek A (Penget.)").
2. Skor maksimal tiap aspek = 4. Total = jumlah aspek × 4.
3. Nilai akhir dihitung otomatis: (Total / Skor Maks) × 100.
4. Buat keterangan di bawah tabel (minimal 3 poin) yang menjelaskan:
   - Kriteria MENCAPAI TP
   - Kriteria BELUM MENCAPAI TP (perlu remediasi)
   - Kriteria MELAMPAUI KKTP (layak pengayaan)
5. jumlahSiswa menentukan jumlah baris, tampilkan juga baris "Rata-rata Kelas".

OUTPUT JSON (ikuti struktur ini persis):
{
  "judulLampiran": "Rubrik Penilaian Lengkap — Rekap Kelas",
  "subjudul": "",
  "identitas": {
    "sekolah": "",
    "mataPelajaran": "",
    "kelas": "",
    "tp": ""
  },
  "headerForm": {
    "guruLabel": "Guru Mata Pelajaran:",
    "kelasLabel": "Kelas:",
    "semesterLabel": "Semester:"
  },
  "tabelRekap": {
    "jumlahSiswa": 32,
    "aspek": [
      { "kode": "A", "label": "", "skorMaks": 4 }
    ],
    "kolomTambahan": ["Total", "Nilai Akhir"],
    "tampilkanRataRata": true
  },
  "keterangan": []
}
`;


// ═════════════════════════════════════════════════════════════════════════════
// PROMPT 6 — MEDIA PEMBELAJARAN (mediaPembelajaran)
// Mengisi: mediaPembelajaran — rincian slide PPT + referensi video/sumber digital
// ═════════════════════════════════════════════════════════════════════════════

export const PROMPT_MEDIA_PEMBELAJARAN = (inputGuru) => `
Kamu diminta membuat rencana media pembelajaran yang terdiri dari:
(A) Rincian slide presentasi per slide, dan
(B) Daftar referensi video dan sumber digital yang relevan.

KONTEKS MODUL:
- Sekolah              : ${inputGuru.namaSekolah}
- Mata Pelajaran       : ${inputGuru.mataPelajaran}
- Kelas                : ${inputGuru.faseKelas}
- Tujuan Pembelajaran  : ${inputGuru.tujuanPembelajaran}
- Topik Pertemuan 1    : ${inputGuru.topikPertemuan1}
- Topik Pertemuan 2    : ${inputGuru.topikPertemuan2}
- Konteks Lokal        : ${inputGuru.konteksLokal}
- Nilai Sekolah        : ${inputGuru.nilaiSekolah}
- Jumlah Slide Total   : ${inputGuru.jumlahSlide || 15}
- Referensi Video/Sumber yang Diinginkan: ${inputGuru.jumlahReferensi || 5}
- Aktivitas Pembelajaran: ${inputGuru.metodePertemuan1} (P1), ${inputGuru.metodePertemuan2 || "Diskusi"} (P2)

INSTRUKSI SLIDE:
1. Distribusi slide mengikuti alur pembelajaran:
   - Pembukaan (Cover + TP + Pemantik)       : ~3 slide
   - Materi Inti Pertemuan 1                 : ~4 slide
   - Aktivitas/Instruksi Pertemuan 1         : 1 slide
   - Materi Inti Pertemuan 2                 : ~3 slide
   - Aktivitas Pertemuan 2                   : 1 slide
   - Penilaian, Refleksi, Penutup            : ~3 slide
   (Sesuaikan dengan jumlahSlide yang diminta)
2. Setiap slide: judulSlide harus menarik (bukan hanya judul bab),
   kontenUtama harus spesifik (bukan hanya "materi tentang X"),
   catatanGuru harus berisi TIP PEDAGOGIS yang actionable.
3. Slide pemantik WAJIB menyebut fenomena/konteks lokal yang konkret.
4. Jika sekolah Islami, satu slide mengintegrasikan ayat/dalil relevan.

INSTRUKSI REFERENSI:
1. Referensi video: berikan kata kunci pencarian YouTube yang SPESIFIK dan akurat.
   Jangan memberikan URL palsu/halusinasi — gunakan kata kunci saja.
2. Referensi data: sebutkan instansi/lembaga resmi yang relevan (BPS, BPBD, Dinas, dll.)
   beserta URL domain resminya yang bisa diverifikasi.
3. Setiap referensi harus ada keterangan penggunaannya (di slide berapa, untuk apa).

OUTPUT JSON (ikuti struktur ini persis):
{
  "judulLampiran": "Media Pembelajaran",
  "subjudul": "",
  "identitas": {
    "sekolah": "",
    "mataPelajaran": "",
    "kelas": "",
    "tp": ""
  },
  "bagianA": {
    "judul": "A. RINCIAN SLIDE PRESENTASI",
    "jumlahSlide": 15,
    "kolomHeader": ["Slide", "Judul Slide", "Konten Utama", "Catatan Guru"],
    "slide": [
      { "no": 1, "judulSlide": "", "kontenUtama": "", "catatanGuru": "" }
    ]
  },
  "bagianB": {
    "judul": "B. REFERENSI VIDEO & SUMBER DIGITAL",
    "kolomHeader": ["No.", "Judul Video / Sumber", "Keterangan Penggunaan", "Durasi / Halaman"],
    "referensi": [
      { "no": 1, "judul": "", "keterangan": "", "durasi": "" }
    ]
  },
  "catatanTeknis": []
}
`;


// ═════════════════════════════════════════════════════════════════════════════
// PROMPT 7 — LEMBAR REFLEKSI PESERTA DIDIK (lembarRefleksi)
// Mengisi: lembarRefleksi — teknik 3-2-1 per pertemuan
// ═════════════════════════════════════════════════════════════════════════════

export const PROMPT_LEMBAR_REFLEKSI = (inputGuru) => `
Kamu diminta membuat lembar refleksi peserta didik menggunakan teknik 3-2-1
(3 hal dipelajari, 2 pertanyaan, 1 aksi nyata) untuk setiap pertemuan.

KONTEKS MODUL:
- Sekolah             : ${inputGuru.namaSekolah}
- Mata Pelajaran      : ${inputGuru.mataPelajaran}
- Kelas               : ${inputGuru.faseKelas}
- Tujuan Pembelajaran : ${inputGuru.tujuanPembelajaran}
- Topik Pertemuan 1   : ${inputGuru.topikPertemuan1}
- Topik Pertemuan 2   : ${inputGuru.topikPertemuan2}
- Konteks Lokal       : ${inputGuru.konteksLokal}
- Nilai Sekolah       : ${inputGuru.nilaiSekolah}
- Teknik Refleksi     : ${inputGuru.teknikRefleksi || "3-2-1"}
- Jumlah Pertemuan    : ${inputGuru.jumlahPertemuan || 2}
- Kutipan/Ayat Penutup: ${inputGuru.kutipanPenutup || ""}
  (opsional — kosongkan jika tidak perlu)

INSTRUKSI:
1. Pertanyaan "3 hal" harus SPESIFIK pada topik pertemuan tersebut,
   bukan sekadar "hal yang saya pelajari hari ini" yang terlalu umum.
   Arahkan siswa untuk merefleksikan KONSEP KUNCI yang ingin dicapai guru.
2. Pertanyaan "2 hal" harus mendorong RASA INGIN TAHU lanjutan yang produktif —
   bukan kebingungan, tapi eksplorasi intelektual ke topik berikutnya.
3. Pertanyaan "1 hal" di Pertemuan 1 = aplikasi dalam kehidupan sehari-hari.
   Pertanyaan "1 hal" di Pertemuan TERAKHIR = aksi nyata/konkret yang akan dilakukan.
4. Lembar refleksi terakhir (akhir modul) harus lebih dalam dan merefleksikan
   seluruh perjalanan belajar, bukan hanya pertemuan tersebut.
5. Kutipan penutup (jika ada) harus RELEVAN dengan topik modul — jangan asal pilih.

OUTPUT JSON (ikuti struktur ini persis):
{
  "judulLampiran": "Lembar Refleksi Peserta Didik",
  "teknik": "3-2-1",
  "keterangan": "Per Pertemuan",
  "identitas": {
    "sekolah": "",
    "mataPelajaran": "",
    "kelas": "",
    "tp": ""
  },
  "pertemuan": [
    {
      "labelPertemuan": "",
      "headerForm": {
        "namaLabel": "Nama:",
        "kelasLabel": "Kelas:",
        "tanggalLabel": "Tanggal:",
        "topik": ""
      },
      "tiga": { "label": "3", "pertanyaan": "", "jumlahBaris": 3 },
      "dua":  { "label": "2", "pertanyaan": "", "jumlahBaris": 2 },
      "satu": { "label": "1", "pertanyaan": "", "jumlahBaris": 2 }
    }
  ],
  "kutipanPenutup": ""
}
`;


// ═════════════════════════════════════════════════════════════════════════════
// PROMPT 8 — BAHAN PENGAYAAN (bahanPengayaan)
// Mengisi: bahanPengayaan — materi mendalam + studi kasus + tugas untuk siswa HOTS
// ═════════════════════════════════════════════════════════════════════════════

export const PROMPT_BAHAN_PENGAYAAN = (inputGuru) => `
Kamu diminta membuat bahan pengayaan untuk peserta didik yang telah MELAMPAUI
Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).

KONTEKS MODUL:
- Sekolah              : ${inputGuru.namaSekolah}
- Mata Pelajaran       : ${inputGuru.mataPelajaran}
- Kelas                : ${inputGuru.faseKelas}
- Tujuan Pembelajaran  : ${inputGuru.tujuanPembelajaran}
- Konteks Lokal        : ${inputGuru.konteksLokal}
- Nilai KKTP (ambang)  : ${inputGuru.kktp || 70}
- Nilai Ambang Pengayaan: ${inputGuru.nilaiAmbangPengayaan || 85}
- Nilai Sekolah        : ${inputGuru.nilaiSekolah}
- Topik Pengayaan (lebih dalam dari TP): ${inputGuru.topikPengayaan}
  (contoh: dampak perubahan iklim global → ekosistem lokal, keterkaitan multi-variabel, dll.)
- Jenis Tugas Pengayaan: ${inputGuru.jenisTugasPengayaan}
  (contoh: mini-infografis, esai ilmiah, video dokumenter singkat, poster digital)
- Batas Waktu Tugas    : ${inputGuru.batasWaktuPengayaan || "1 minggu"}

INSTRUKSI PEMBUATAN BAHAN PENGAYAAN:
1. Materi bacaan harus MELAMPAUI materi di modul utama secara signifikan:
   - Gunakan konsep yang lebih kompleks (multi-variabel, global-lokal, interdisiplin)
   - Sertakan data/fakta terkini yang relevan dengan topik lokal
   - Tulis dengan gaya akademik yang lebih formal (latih menulis ilmiah)
2. Tabel analisis di bagian materi harus memiliki kolom yang menantang
   (misal: variabel global, mekanisme, dampak lokal, solusi berbasis sains)
3. Studi kasus harus SPESIFIK dan LOKAL — gunakan nama sungai, gunung, industri,
   atau isu nyata yang ada di daerah dari konteks lokal guru.
4. Analisis berlapis (cascade effect): minimal 4 level (Alam → Ekosistem → Ekonomi → Sosial)
   atau sesuaikan dengan topik, tapi harus menunjukkan dampak berantai yang sistemis.
5. Tugas pengayaan harus:
   - Menuntut kreativitas dan sintesis (C5/C6 Bloom)
   - Memiliki produk nyata yang bisa dipajang/dibagikan
   - Poin-poin tugas harus mencakup: data, analisis, solusi, dan dimensi nilai

OUTPUT JSON (ikuti struktur ini persis):
{
  "judulLampiran": "Bahan Pengayaan",
  "subjudul": "",
  "identitas": {
    "sekolah": "",
    "mataPelajaran": "",
    "kelas": "",
    "tp": ""
  },
  "targetPesertaDidik": "",
  "deskripsiUmum": "",
  "bagianMateriBacaan": [
    {
      "judul": "",
      "narasiBacaan": "",
      "tabelAnalisis": {
        "kolomHeader": [],
        "baris": []
      }
    }
  ],
  "studyCase": {
    "judul": "",
    "narasiPengantar": "",
    "levelAnalisis": [
      { "label": "", "deskripsi": "" }
    ]
  },
  "tugasPengayaan": {
    "instruksi": "",
    "format": "",
    "poin": [],
    "batasWaktu": ""
  }
}
`;


// ═════════════════════════════════════════════════════════════════════════════
// PROMPT 9 — BAHAN REMEDIASI (bahanRemediasi)
// Mengisi: bahanRemediasi — bacaan sederhana + latihan soal untuk siswa yang belum tuntas
// ═════════════════════════════════════════════════════════════════════════════

export const PROMPT_BAHAN_REMEDIASI = (inputGuru) => `
Kamu diminta membuat bahan remediasi untuk peserta didik yang BELUM MENCAPAI
Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).

KONTEKS MODUL:
- Sekolah              : ${inputGuru.namaSekolah}
- Mata Pelajaran       : ${inputGuru.mataPelajaran}
- Kelas                : ${inputGuru.faseKelas}
- Tujuan Pembelajaran  : ${inputGuru.tujuanPembelajaran}
- IKTP yang Belum Tercapai (fokus remediasi): ${inputGuru.iktpRemediasi}
  (contoh: "siswa belum mampu membedakan fenomena alam dan sosial" — isi berdasarkan
   analisis nilai siswa yang paling rendah)
- Konteks Lokal        : ${inputGuru.konteksLokal}
- Nilai KKTP           : ${inputGuru.kktp || 70}
- Nilai Sekolah        : ${inputGuru.nilaiSekolah}
- Gaya Belajar yang Difasilitasi: ${inputGuru.gayaBelajarRemediasi || "visual + tekstual"}

PRINSIP REMEDIASI YANG WAJIB DIIKUTI:
1. BAHASA LEBIH SEDERHANA: gunakan kalimat pendek (maks. 20 kata per kalimat),
   kata-kata sehari-hari, hindari jargon tanpa penjelasan.
2. CONTOH LOKAL & KONKRET: setiap konsep WAJIB diilustrasikan dengan contoh dari
   kehidupan nyata di daerah siswa (konteks lokal dari input guru).
3. VISUAL DESKRIPTIF: deskripsikan tabel atau bagan dengan jelas karena siswa
   remediasi cenderung visual — tabel contoh harus mudah dibaca.
4. BERTAHAP: mulai dari yang PALING DASAR (definisi, ciri-ciri, contoh sederhana)
   sebelum masuk ke analisis.
5. MOTIVASI: tone penulisan harus SUPORTIF dan POSITIF. Hindari kata-kata yang
   bisa membuat siswa merasa inferior (jangan tulis "seharusnya kamu sudah tahu...").
6. Latihan soal harus LEBIH MUDAH dari soal kuis utama (level C1-C2 Bloom),
   fokus pada identifikasi dan pemahaman dasar.

INSTRUKSI TEKNIS:
1. Buat minimal 2 bagian materi bacaan sederhana (sesuai IKTP yang difokuskan).
2. Tabel contoh di setiap bagian: 4–5 baris dengan kolom yang jelas dan isian singkat.
3. Latihan Soal A (identifikasi): 5 kasus deskriptif, siswa mengidentifikasi
   jenis/kategori + menjelaskan singkat.
4. Latihan Soal B (pertanyaan singkat): 3 pertanyaan esai pendek, setiap pertanyaan
   minta minimal 3 sub-poin jawaban. Pertanyaan harus berbasis pengalaman siswa sendiri.
5. Pesan penutup harus HANGAT, mendorong siswa untuk menemui guru setelah selesai.

OUTPUT JSON (ikuti struktur ini persis):
{
  "judulLampiran": "Bahan Remediasi",
  "subjudul": "",
  "identitas": {
    "sekolah": "",
    "mataPelajaran": "",
    "kelas": "",
    "tp": ""
  },
  "targetPesertaDidik": "",
  "pesanMotivasi": "",
  "bagianMateri": [
    {
      "nomor": 1,
      "judul": "",
      "narasiPengantar": "",
      "tabelContoh": {
        "kolomHeader": [],
        "baris": []
      }
    }
  ],
  "latihanSoal": {
    "headerForm": {
      "namaLabel": "Nama:",
      "kelasLabel": "Kelas:",
      "tanggalLabel": "Tanggal:"
    },
    "bagianA": {
      "judul": "Soal A — Identifikasi",
      "instruksi": "",
      "kolomHeader": [],
      "jumlahSoal": 5
    },
    "bagianB": {
      "judul": "Soal B — Pertanyaan Singkat",
      "instruksi": "",
      "pertanyaan": [
        { "no": 1, "pertanyaan": "", "jumlahSubpoin": 3 }
      ]
    }
  },
  "pesanPenutup": ""
}
`;


// ═════════════════════════════════════════════════════════════════════════════
// HELPER: INPUT GURU TEMPLATE
// Objek template yang diisi oleh form di website sebelum dikirim ke prompt
// ═════════════════════════════════════════════════════════════════════════════

export const inputGuruTemplate = {
  // ── IDENTITAS SEKOLAH & MODUL ──
  namaSekolah: "",
  taglineSekolah: "",
  judulModul: "",
  kodeModul: "",
  faseKelas: "",
  semester: "",
  tahunPelajaran: "",
  mataPelajaran: "",
  kurikulum: "",
  pendekatanPembelajaran: "",
  nilaiSekolah: "",            // "Islami" | "Nasionalis" | "Entrepreneur" | ""

  // ── TUJUAN PEMBELAJARAN ──
  tujuanPembelajaran: "",      // teks TP utama
  iktp: "",                    // indikator ketercapaian, pisahkan dengan koma/newline
  iktpRemediasi: "",           // IKTP spesifik yang jadi fokus remediasi

  // ── KONTEKS PEMBELAJARAN ──
  konteksLokal: "",            // nama daerah + isu/fenomena lokal spesifik
  topikPertemuan1: "",
  topikPertemuan2: "",
  metodePertemuan1: "",        // contoh: Gallery Walk, Studi Kasus
  metodePertemuan2: "",
  dimensiKeterkaitan: "",      // untuk LKPD-01b
  jumlahPertemuan: 2,

  // ── PARAMETER LKPD ──
  jumlahAspekAnalisis: 7,
  jumlahPasanganKeterkaitan: 3,

  // ── PARAMETER ASESMEN ──
  jumlahPertanyaanLisan: 3,
  jumlahSoalKuis: 5,
  jenisProdukSumatif: "",      // contoh: jurnal observasi, laporan, poster
  aspekPenilaianSumatif: "",   // contoh: "Pengetahuan, Analisis, Komunikasi, Sikap"
  bobotAspek: "",
  kktp: 70,

  // ── PARAMETER REKAP KELAS ──
  jumlahSiswa: 32,

  // ── PARAMETER MEDIA ──
  jumlahSlide: 15,
  jumlahReferensi: 5,

  // ── PARAMETER REFLEKSI ──
  teknikRefleksi: "3-2-1",
  kutipanPenutup: "",

  // ── PARAMETER PENGAYAAN ──
  nilaiAmbangPengayaan: 85,
  topikPengayaan: "",
  jenisTugasPengayaan: "",
  batasWaktuPengayaan: "1 minggu",

  // ── PARAMETER REMEDIASI ──
  gayaBelajarRemediasi: "visual + tekstual",

  // ── DAFTAR LAMPIRAN ──
  daftarLampiranYangDiminta: "", // contoh: "LKPD x2, Asesmen Formatif, ..."
};


// ═════════════════════════════════════════════════════════════════════════════
// EXPORT BUNDLE SEMUA PROMPT
// ═════════════════════════════════════════════════════════════════════════════

export const allPrompts = {
  systemGlobal:       SYSTEM_PROMPT_GLOBAL,
  headerDanDaftar:    PROMPT_HEADER_DAN_DAFTAR,
  lkpdPertemuan1:     PROMPT_LKPD_PERTEMUAN_1,
  lkpdPertemuan2:     PROMPT_LKPD_PERTEMUAN_2,
  asesmenFormatif:    PROMPT_ASESMEN_FORMATIF,
  asesmenSumatif:     PROMPT_ASESMEN_SUMATIF,
  rekapKelas:         PROMPT_REKAP_KELAS,
  mediaPembelajaran:  PROMPT_MEDIA_PEMBELAJARAN,
  lembarRefleksi:     PROMPT_LEMBAR_REFLEKSI,
  bahanPengayaan:     PROMPT_BAHAN_PENGAYAAN,
  bahanRemediasi:     PROMPT_BAHAN_REMEDIASI,
  inputGuruTemplate,
};

export default allPrompts;
