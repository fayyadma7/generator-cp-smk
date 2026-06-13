/**
 * SCHEMA LAMPIRAN MODUL AJAR
 * Format kerangka lampiran untuk generator AI perangkat ajar
 * Berdasarkan: Lampiran Modul Ajar IPAS TP-01 — SMK Muh 3 Purbalingga
 */

// ─────────────────────────────────────────────
// METADATA DOKUMEN
// ─────────────────────────────────────────────

export const dokumenHeader = {
  sekolah: "",
  tagline: "",               // contoh: "Unggul • Islami • Berjiwa Entrepreneur"
  judulDokumen: "DOKUMEN LAMPIRAN",
  judulModul: "",
  kodeModul: "",             // contoh: "MA-MAPEL-01 │ TP-01"
  faseKelas: "",             // contoh: "Fase E / Kelas X"
  semester: "",              // contoh: "Ganjil — Tahun Pelajaran 2025/2026"
  mataPelajaran: "",
  kurikulum: "",             // contoh: "Kurikulum Merdeka — Pendekatan Deep Learning"
};


// ─────────────────────────────────────────────
// DAFTAR LAMPIRAN
// ─────────────────────────────────────────────

export const daftarLampiran = [
  // Setiap entri mewakili satu lampiran dalam dokumen
  {
    no: 1,
    namaLampiran: "",        // contoh: "LKPD-01a: Analisis Fenomena Alam"
    keterangan: "",          // contoh: "Gallery Walk — Pertemuan ke-1"
    halaman: null,           // nomor halaman (integer)
  },
  // ... tambah sesuai kebutuhan
];


// ─────────────────────────────────────────────
// LAMPIRAN 1 — LKPD (Lembar Kerja Peserta Didik) Pertemuan 1
// ─────────────────────────────────────────────

export const lkpd01a = {
  judulLampiran: "LKPD-01a",
  subjudul: "",              // contoh: "Analisis Fenomena Alam"
  metode: "",                // contoh: "Gallery Walk"
  pertemuan: "",             // contoh: "Pertemuan ke-1"
  identitas: {
    sekolah: "",
    mataPelajaran: "",
    kelas: "",
    tp: "",                  // contoh: "TP-01"
  },
  headerForm: {
    tujuanPembelajaran: "",
    namaFenomenaLabel: "Nama Fenomena yang Dianalisis:",
    namaKelompokLabel: "Nama / Kelompok:",
    kelasLabel: "Kelas:",
    tanggalLabel: "Tanggal:",
  },
  petunjuk: [
    // Array string — setiap elemen = satu poin petunjuk
    // contoh: "Amati fenomena alam yang ditugaskan kepada kelompokmu."
  ],
  tabelAnalisis: [
    // Kolom pertanyaan yang harus dijawab siswa
    {
      kode: "A",
      judulKolom: "",        // contoh: "DESKRIPSI FENOMENA"
      pertanyaan: "",        // instruksi detail untuk siswa
    },
    { kode: "B", judulKolom: "", pertanyaan: "" },
    { kode: "C", judulKolom: "", pertanyaan: "" },
    { kode: "D", judulKolom: "", pertanyaan: "" },
    { kode: "E", judulKolom: "", pertanyaan: "" },
    { kode: "F", judulKolom: "", pertanyaan: "" },
    { kode: "G", judulKolom: "", pertanyaan: "" },
    // Tambah / kurangi sesuai kebutuhan
  ],
  penilaianGalleryWalk: {
    instruksi: "",           // contoh: "Kunjungi poster kelompok lain dan berikan komentar..."
    jumlahBaris: 4,          // jumlah baris tabel komentar (default: 4)
    kolomHeader: [
      "Kelompok yang Dikunjungi",
      "Komentar / Pertanyaan",
    ],
  },
};


// ─────────────────────────────────────────────
// LAMPIRAN 2 — LKPD Pertemuan 2
// ─────────────────────────────────────────────

export const lkpd01b = {
  judulLampiran: "LKPD-01b",
  subjudul: "",              // contoh: "Bagan Keterkaitan Alam–Sosial"
  deskripsiPertemuan: "",    // contoh: "Pertemuan ke-2 — Analisis Interdependensi Fenomena"
  identitas: {
    sekolah: "",
    mataPelajaran: "",
    kelas: "",
    tp: "",
  },
  headerForm: {
    namaKelompokLabel: "Nama / Kelompok:",
    kelasLabel: "Kelas:",
    tanggalLabel: "Tanggal:",
    tujuan: "",              // deskripsi tujuan spesifik kegiatan ini
  },
  bagianA: {
    judul: "BAGIAN A — IDENTIFIKASI FENOMENA",
    kolomKiri: {
      label: "",             // contoh: "FENOMENA ALAM di Purbalingga"
      instruksi: "",         // contoh: "Tuliskan minimal 2 fenomena alam:"
      jumlahEntri: 3,        // jumlah baris isian fenomena
    },
    kolomKanan: {
      label: "",             // contoh: "FENOMENA SOSIAL di Purbalingga"
      instruksi: "",
      jumlahEntri: 3,
    },
  },
  bagianB: {
    judul: "BAGIAN B — BAGAN KETERKAITAN",
    instruksi: "",           // instruksi membuat bagan panah
    contohFormat: "",        // contoh: "Fenomena Alam A → menyebabkan → Fenomena Sosial B"
    labelRuang: "",          // label placeholder kotak gambar
  },
  bagianC: {
    judul: "BAGIAN C — ANALISIS KETERKAITAN (URAIAN)",
    jumlahPasangan: 3,       // jumlah baris pasangan keterkaitan
    kolomHeader: [
      "Pasangan Keterkaitan",
      "Penjelasan Ilmiah (mekanisme sebab-akibat)",
    ],
  },
  bagianD: {
    judul: "BAGIAN D — REFLEKSI",
    pertanyaanRefleksi: "",  // pertanyaan refleksi (bisa dikaitkan nilai/ayat)
  },
};


// ─────────────────────────────────────────────
// LAMPIRAN 3 — INSTRUMEN ASESMEN FORMATIF
// ─────────────────────────────────────────────

export const asesmenFormatif = {
  judulLampiran: "Instrumen Asesmen Formatif",
  subjudul: "",              // contoh: "Pertanyaan Lisan Pertemuan 1 & Soal Kuis Pertemuan 2"
  identitas: {
    sekolah: "",
    mataPelajaran: "",
    kelas: "",
    tp: "",
  },
  bagianA: {
    judul: "A. PERTANYAAN LISAN",
    keterangan: "",          // contoh: "Diajukan secara acak kepada 3 peserta didik..."
    pertemuan: "",
    kolomHeader: [
      "No.",
      "Pertanyaan Lisan",
      "Kunci Jawaban (Referensi Guru)",
    ],
    pertanyaan: [
      // { no: 1, pertanyaan: "", kunciJawaban: "" },
      // { no: 2, pertanyaan: "", kunciJawaban: "" },
      // { no: 3, pertanyaan: "", kunciJawaban: "" },
    ],
  },
  bagianB: {
    judul: "B. SOAL KUIS TULIS",
    jumlahSoal: 5,           // default 5 butir
    petunjuk: "",            // instruksi pengerjaan kuis
    headerForm: {
      namaLabel: "Nama:",
      kelasLabel: "Kelas:",
      tanggalLabel: "Tanggal:",
    },
    soal: [
      // Setiap soal = 1 pilihan ganda
      {
        no: 1,
        pertanyaan: "",
        opsi: [
          { huruf: "A", teks: "" },
          { huruf: "B", teks: "" },
          { huruf: "C", teks: "" },
          { huruf: "D", teks: "" },
        ],
        kunci: "",           // contoh: "C"
      },
      // Salin struktur di atas untuk soal 2–5
    ],
  },
};


// ─────────────────────────────────────────────
// LAMPIRAN 4 — INSTRUMEN ASESMEN SUMATIF
// ─────────────────────────────────────────────

export const asesmenSumatif = {
  judulLampiran: "Instrumen Asesmen Sumatif",
  subjudul: "",              // contoh: "Rubrik Penilaian Jurnal Observasi"
  identitas: {
    sekolah: "",
    mataPelajaran: "",
    kelas: "",
    tp: "",
  },
  headerForm: {
    namaPesertaDidikLabel: "Nama Peserta Didik:",
    kelasLabel: "Kelas:",
    tanggalPenilaianLabel: "Tanggal Penilaian:",
    guruPenilaiLabel: "Guru Penilai:",
  },
  kriteriaPenilaian: {
    kktp: "",                // contoh: "Nilai ≥ 70"
    formulaNilaiAkhir: "",   // contoh: "(Total Skor / 16) × 100"
  },
  rubrik: {
    kolomHeader: [
      "Aspek Penilaian",
      "Perlu Bimbingan (1)",
      "Cukup (2)",
      "Baik (3)",
      "Sangat Baik (4)",
    ],
    aspek: [
      // Setiap aspek = 1 baris pada tabel rubrik
      {
        namaAspek: "",       // contoh: "Pengetahuan: Identifikasi Fenomena"
        bobot: "",           // contoh: "Penalaran Kritis 50%"
        perluBimbingan: "",
        cukup: "",
        baik: "",
        sangatBaik: "",
      },
      // Salin untuk aspek-aspek berikutnya
    ],
  },
  totalSkor: {
    skorMaksimal: null,      // contoh: 16
    kolomSummary: [
      "Total Skor (maks.)",
      "Nilai Akhir",
      "Keterangan (Tercapai / Belum)",
    ],
  },
  catatanGuru: true,         // true = tampilkan kotak catatan guru
};


// ─────────────────────────────────────────────
// LAMPIRAN 5 — RUBRIK REKAP KELAS
// ─────────────────────────────────────────────

export const rekapKelas = {
  judulLampiran: "Rubrik Penilaian Lengkap — Rekap Kelas",
  subjudul: "",              // contoh: "Rekapitulasi Nilai Jurnal Observasi TP-01"
  identitas: {
    sekolah: "",
    mataPelajaran: "",
    kelas: "",
    tp: "",
  },
  headerForm: {
    guruLabel: "Guru Mata Pelajaran:",
    kelasLabel: "Kelas:",
    semesterLabel: "Semester:",
  },
  tabelRekap: {
    jumlahSiswa: 32,         // jumlah baris siswa (bisa diubah)
    aspek: [
      // Setiap aspek = 1 kolom nilai
      { kode: "A", label: "Aspek A (Penget.)", skorMaks: 4 },
      { kode: "B", label: "Aspek B (Analisis)", skorMaks: 4 },
      { kode: "C", label: "Aspek C (Komun.)", skorMaks: 4 },
      { kode: "D", label: "Aspek D (Sikap)", skorMaks: 4 },
    ],
    kolomTambahan: ["Total /16", "Nilai Akhir"],
    tampilkanRataRata: true,
  },
  keterangan: [
    // Array string — setiap elemen = 1 poin keterangan
    // contoh: "Peserta didik MENCAPAI TP-01 jika Nilai Akhir ≥ 70"
  ],
};


// ─────────────────────────────────────────────
// LAMPIRAN 6 — MEDIA PEMBELAJARAN
// ─────────────────────────────────────────────

export const mediaPembelajaran = {
  judulLampiran: "Media Pembelajaran",
  subjudul: "",              // contoh: "Slide PPT & Referensi Video"
  identitas: {
    sekolah: "",
    mataPelajaran: "",
    kelas: "",
    tp: "",
  },
  bagianA: {
    judul: "A. RINCIAN SLIDE PRESENTASI",
    jumlahSlide: 15,         // total slide
    kolomHeader: [
      "Slide",
      "Judul Slide",
      "Konten Utama",
      "Catatan Guru",
    ],
    slide: [
      // { no: 1, judulSlide: "", kontenUtama: "", catatanGuru: "" },
      // Ulangi untuk tiap slide
    ],
  },
  bagianB: {
    judul: "B. REFERENSI VIDEO & SUMBER DIGITAL",
    kolomHeader: [
      "No.",
      "Judul Video / Sumber",
      "Keterangan Penggunaan",
      "Durasi / Halaman",
    ],
    referensi: [
      // { no: 1, judul: "", keterangan: "", durasi: "" },
    ],
  },
  catatanTeknis: [
    // Array string — poin-poin catatan teknis media
    // contoh: "Pastikan proyektor/TV sudah diuji sebelum pembelajaran dimulai."
  ],
};


// ─────────────────────────────────────────────
// LAMPIRAN 7 — LEMBAR REFLEKSI PESERTA DIDIK
// ─────────────────────────────────────────────

export const lembarRefleksi = {
  judulLampiran: "Lembar Refleksi Peserta Didik",
  teknik: "",                // contoh: "Teknik 3-2-1"
  keterangan: "",            // contoh: "Per Pertemuan"
  identitas: {
    sekolah: "",
    mataPelajaran: "",
    kelas: "",
    tp: "",
  },
  pertemuan: [
    // Satu entri = satu lembar refleksi per pertemuan
    {
      labelPertemuan: "",    // contoh: "LEMBAR REFLEKSI — PERTEMUAN KE-1"
      headerForm: {
        namaLabel: "Nama:",
        kelasLabel: "Kelas:",
        tanggalLabel: "Tanggal:",
        topik: "",           // topik pertemuan
      },
      // Format 3-2-1:
      tiga: {
        label: "3",
        pertanyaan: "",      // contoh: "HAL yang saya PELAJARI hari ini:"
        jumlahBaris: 3,
      },
      dua: {
        label: "2",
        pertanyaan: "",      // contoh: "PERTANYAAN yang masih ingin saya jawab:"
        jumlahBaris: 2,
      },
      satu: {
        label: "1",
        pertanyaan: "",      // contoh: "CARA saya menerapkan ilmu ini..."
        jumlahBaris: 2,
      },
    },
    // Tambah entri untuk pertemuan ke-2, dst.
  ],
  kutipanPenutup: "",        // kutipan motivasi/ayat di bagian bawah (opsional)
};


// ─────────────────────────────────────────────
// LAMPIRAN 8 — BAHAN PENGAYAAN
// ─────────────────────────────────────────────

export const bahanPengayaan = {
  judulLampiran: "Bahan Pengayaan",
  subjudul: "",              // contoh: "Analisis Multi-Variabel Fenomena Lokal"
  identitas: {
    sekolah: "",
    mataPelajaran: "",
    kelas: "",
    tp: "",
  },
  targetPesertaDidik: "",    // contoh: "Untuk Peserta Didik yang Telah Melampaui KKTP (Nilai > 85)"
  deskripsiUmum: "",         // paragraf pengantar materi pengayaan
  bagianMateriBacaan: [
    // Setiap bagian = satu sub-topik materi
    {
      judul: "",
      narasiBacaan: "",      // teks pengantar/deskripsi topik
      tabelAnalisis: {
        kolomHeader: [],     // array string nama kolom
        baris: [
          // { kolom1: "", kolom2: "", kolom3: "" }
          // sesuaikan dengan kolomHeader
        ],
      },
    },
  ],
  studyCase: {
    judul: "",               // judul studi kasus
    narasiPengantar: "",
    levelAnalisis: [
      // Cascade / berlapis — setiap level = 1 baris
      { label: "", deskripsi: "" },
    ],
  },
  tugasPengayaan: {
    instruksi: "",           // instruksi tugas akhir pengayaan
    format: "",              // format pengumpulan (misal: mini-infografis A4)
    poin: [
      // Array string — poin-poin yang harus ada dalam tugas
    ],
    batasWaktu: "",
  },
};


// ─────────────────────────────────────────────
// LAMPIRAN 9 — BAHAN REMEDIASI
// ─────────────────────────────────────────────

export const bahanRemediasi = {
  judulLampiran: "Bahan Remediasi",
  subjudul: "",              // contoh: "Modul Bacaan Sederhana Bergambar & Latihan Soal"
  identitas: {
    sekolah: "",
    mataPelajaran: "",
    kelas: "",
    tp: "",
  },
  targetPesertaDidik: "",    // contoh: "Untuk Peserta Didik yang Perlu Bimbingan Tambahan (Nilai < 70)"
  pesanMotivasi: "",         // pesan penyemangat di awal
  bagianMateri: [
    // Setiap bagian = sub-topik materi bacaan sederhana
    {
      nomor: 1,
      judul: "",
      narasiPengantar: "",
      tabelContoh: {
        kolomHeader: [],     // array string nama kolom
        baris: [
          // { kolom1: "", kolom2: "" }
        ],
      },
    },
  ],
  latihanSoal: {
    headerForm: {
      namaLabel: "Nama:",
      kelasLabel: "Kelas:",
      tanggalLabel: "Tanggal:",
    },
    bagianA: {
      judul: "Soal A — Identifikasi Fenomena",
      instruksi: "",
      kolomHeader: [
        "No.",
        "Deskripsi Kejadian",
        "Jenis Fenomena (Alam / Sosial)",
        "Penjelasan Singkat Kamu",
      ],
      jumlahSoal: 5,         // jumlah baris soal identifikasi
    },
    bagianB: {
      judul: "Soal B — Pertanyaan Singkat",
      instruksi: "",
      pertanyaan: [
        // { no: 1, pertanyaan: "", jumlahSubpoin: 3 },
      ],
    },
  },
  pesanPenutup: "",          // contoh: "Setelah menyelesaikan modul ini, kunjungi gurumu..."
};


// ─────────────────────────────────────────────
// EXPORT SEMUA LAMPIRAN (bundle)
// ─────────────────────────────────────────────

export const lampiranModulAjar = {
  header: dokumenHeader,
  daftarLampiran,
  lampiran: {
    lkpd01a,
    lkpd01b,
    asesmenFormatif,
    asesmenSumatif,
    rekapKelas,
    mediaPembelajaran,
    lembarRefleksi,
    bahanPengayaan,
    bahanRemediasi,
  },
};

export default lampiranModulAjar;
