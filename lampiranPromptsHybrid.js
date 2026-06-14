/**
 * Build prompts for each lampiran section.
 * Hybrid approach: AI generates content based on header/meta data,
 * user can edit afterward.
 */

const SYSTEM_PROMPT = `Anda adalah asisten guru yang membantu membuat lampiran modul ajar.
Gunakan bahasa Indonesia pendidikan yang formal namun komunikatif.
Output harus berupa JSON VALID tanpa markdown formatting atau teks lain di luar JSON.
Pastikan konten yang dihasilkan sesuai dengan Kurikulum Merdeka dan pendekatan Deep Learning (Mindful, Meaningful, Joyful).`;

/* ── Helper: common context string from header ── */
function buildContext(header) {
  return `
Konteks Pembelajaran:
- Sekolah: ${header.namaSekolah || '-'}
- Mata Pelajaran: ${header.mataPelajaran || '-'}
- Kode Modul: ${header.kodeModul || '-'}
- Judul Modul: ${header.judulModul || '-'}
- Nomor TP: ${header.nomorTP || '-'}
- Fase/Kelas: ${header.faseKelas || '-'}
- Semester: ${header.semester || '-'}
- Tahun Pelajaran: ${header.tahunPelajaran || '-'}
- Nama Guru: ${header.namaGuru || '-'}
`.trim();
}

/* ── LKPD ── */
function buildLKPDPrompt(header, existingData) {
  return {
    system: SYSTEM_PROMPT,
    user: `${buildContext(header)}

Buatlah data untuk LEMBAR KERJA PESERTA DIDIK (LKPD) dengan struktur JSON berikut:
{
  "judulKegiatan": "Judul kegiatan yang menarik dan kontekstual",
  "alokasiWaktu": "Alokasi waktu (misal: 2 JP × 45 menit)",
  "tujuan": "Tujuan kegiatan LKPD (2-3 kalimat)",
  "kegiatan": [
    {
      "tanggal": "Tanggal/Hari pertemuan (misal: Pertemuan 1)",
      "deskripsi": "Deskripsi langkah kegiatan",
      "stimulus": "Stimulus/pemicu untuk peserta didik"
    }
  ]
}

Buat 2-3 kegiatan. Pastikan relevan dengan mata pelajaran dan fase tersebut.`
  };
}

/* ── Formatif ── */
function buildFormatifPrompt(header, existingData) {
  return {
    system: SYSTEM_PROMPT,
    user: `${buildContext(header)}

Buatlah data untuk PENILAIAN FORMATIF dengan struktur JSON berikut:
{
  "teknik": "Teknik penilaian (Observasi/Unjuk Kerja/Tes Tertulis/Tes Lisan/Penugasan/Portofolio/Proyek/Jurnal)",
  "jenisPenilaian": ["Sikap", "Pengetahuan", "Keterampilan"],
  "instrumen": [
    {
      "aspek": "Aspek yang dinilai",
      "indikator": "Indikator pencapaian",
      "skor": "Skor maksimal (1-100)"
    }
  ]
}

Buat 3-5 instrumen penilaian yang sesuai dengan mata pelajaran ${header.mataPelajaran}.`
  };
}

/* ── Sumatif ── */
function buildSumatifPrompt(header, existingData) {
  return {
    system: SYSTEM_PROMPT,
    user: `${buildContext(header)}

Buatlah data untuk PENILAIAN SUMATIF dengan struktur JSON berikut:
{
  "bentuk": "Bentuk penilaian (Pilihan Ganda/Uraian/Essai/Proyek/Portofolio/Unjuk Kerja/Tes Lisan)",
  "instrumen": [
    {
      "uraian": "Uraian soal atau indikator penilaian",
      "bobot": "Bobot/nilai (misal: 20)"
    }
  ],
  "kkm": "Nilai KKM/Kriteria Ketuntasan (misal: 70)"
}

Buat 3-5 soal/indikator yang sesuai.`
  };
}

/* ── Rubrik ── */
function buildRubrikPrompt(header, existingData) {
  return {
    system: SYSTEM_PROMPT,
    user: `${buildContext(header)}

Buatlah data untuk RUBRIK PENILAIAN dengan struktur JSON berikut:
{
  "kriteria": [
    {
      "kriteria": "Nama kriteria penilaian",
      "deskripsi": "Deskripsi skala penilaian (4-3-2-1 atau Sangat Baik - Kurang)"
    }
  ]
}

Buat 3-5 kriteria rubrik dengan deskripsi yang jelas.`
  };
}

/* ── Materi ── */
function buildMateriPrompt(header, existingData) {
  return {
    system: SYSTEM_PROMPT,
    user: `${buildContext(header)}

Buatlah data untuk BAHAN AJAR/MATERI dengan struktur JSON berikut:
{
  "materiList": [
    "Nama materi/topik 1",
    "Nama materi/topik 2",
    "Nama materi/topik 3"
  ],
  "sumber": "Sumber referensi yang digunakan (buku, jurnal, link)"
}

Buat 3-5 materi pokok yang sesuai dengan judul modul "${header.judulModul}".`
  };
}

/* ── Media ── */
function buildMediaPrompt(header, existingData) {
  return {
    system: SYSTEM_PROMPT,
    user: `${buildContext(header)}

Buatlah data untuk MEDIA PEMBELAJARAN dengan struktur JSON berikut:
{
  "mediaList": [
    {
      "jenis": "Video/Audio/Gambar/PPT/Infografis/Alat Peraga/Simulasi/LMS/Lainnya",
      "deskripsi": "Nama media dan deskripsi singkat"
    }
  ],
  "catatan": "Catatan penggunaan media dalam pembelajaran"
}

Buat 3-5 media yang relevan.`
  };
}

/* ── Refleksi ── */
function buildRefleksiPrompt(header, existingData) {
  return {
    system: SYSTEM_PROMPT,
    user: `${buildContext(header)}

Buatlah data untuk REFLEKSI PEMBELAJARAN dengan struktur JSON berikut:
{
  "refleksiList": [
    {
      "pertanyaan": "Pertanyaan refleksi untuk peserta didik",
      "target": "Guru/Peserta Didik/Keduanya"
    }
  ]
}

Buat 4-6 pertanyaan refleksi dengan pendekatan 3-2-1 (3 hal baru, 2 kesulitan, 1 pertanyaan) atau teknik refleksi lainnya.`
  };
}

/* ── Pengayaan ── */
function buildPengayaanPrompt(header, existingData) {
  return {
    system: SYSTEM_PROMPT,
    user: `${buildContext(header)}

Buatlah data untuk AKTIVITAS PENGAYAAN dengan struktur JSON berikut:
{
  "pengayaanList": [
    "Deskripsi aktivitas pengayaan 1",
    "Deskripsi aktivitas pengayaan 2"
  ]
}

Buat 2-3 aktivitas pengayaan untuk peserta didik yang telah mencapai ketuntasan.`
  };
}

/* ── Remediasi ── */
function buildRemediasiPrompt(header, existingData) {
  return {
    system: SYSTEM_PROMPT,
    user: `${buildContext(header)}

Buatlah data untuk AKTIVITAS REMEDIASI dengan struktur JSON berikut:
{
  "remediasiList": [
    "Deskripsi aktivitas remediasi 1",
    "Deskripsi aktivitas remediasi 2"
  ]
}

Buat 2-3 aktivitas remediasi untuk peserta didik yang belum mencapai ketuntasan.`
  };
}

/* ── Exports ── */
export const sectionPrompts = {
  lkpd: buildLKPDPrompt,
  formatif: buildFormatifPrompt,
  sumatif: buildSumatifPrompt,
  rubrik: buildRubrikPrompt,
  materi: buildMateriPrompt,
  media: buildMediaPrompt,
  refleksi: buildRefleksiPrompt,
  pengayaan: buildPengayaanPrompt,
  remediasi: buildRemediasiPrompt,
};

export const SECTION_LABELS = {
  lkpd: 'Lembar Kerja Peserta Didik (LKPD)',
  formatif: 'Penilaian Formatif',
  sumatif: 'Penilaian Sumatif',
  rubrik: 'Rubrik Penilaian',
  materi: 'Bahan Ajar / Materi',
  media: 'Media Pembelajaran',
  refleksi: 'Refleksi Pembelajaran',
  pengayaan: 'Aktivitas Pengayaan',
  remediasi: 'Aktivitas Remediasi',
};
