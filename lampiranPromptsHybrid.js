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
function buildContext(header, modulText) {
  let ctx = `
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

  if (modulText && modulText.trim().length > 20) {
    ctx += `\n\n=== ISI MODUL AJAR (sebagai referensi) ===\n${modulText.trim()}\n=== AKHIR MODUL ===\n\nGunakan informasi dari modul di atas untuk membuat konten yang sesuai dan kontekstual.`;
  }

  return ctx;
}

/* ── Factory: all prompts share the same signature ── */
function makePrompt(key, header, existingData, modulText, extraInstructions) {
  const sectionNames = {
    lkpd: 'LEMBAR KERJA PESERTA DIDIK (LKPD)',
    formatif: 'PENILAIAN FORMATIF',
    sumatif: 'PENILAIAN SUMATIF',
    rubrik: 'RUBRIK PENILAIAN',
    materi: 'BAHAN AJAR / MATERI',
    media: 'MEDIA PEMBELAJARAN',
    refleksi: 'REFLEKSI PEMBELAJARAN',
    pengayaan: 'AKTIVITAS PENGAYAAN',
    remediasi: 'AKTIVITAS REMEDIASI',
  };

  const jsonSchemas = {
    lkpd: `{
  "judulKegiatan": "Judul kegiatan yang menarik dan kontekstual",
  "alokasiWaktu": "Alokasi waktu (misal: 2 JP × 45 menit)",
  "tujuan": "Tujuan kegiatan LKPD (2-3 kalimat)",
  "kegiatan": [
    { "tanggal": "Tanggal/Hari pertemuan", "deskripsi": "Deskripsi langkah", "stimulus": "Stimulus" }
  ]
}`,
    formatif: `{
  "teknik": "Teknik penilaian (Observasi/Unjuk Kerja/Tes Tertulis/Tes Lisan/Penugasan/Portofolio/Proyek/Jurnal)",
  "jenisPenilaian": ["Sikap", "Pengetahuan", "Keterampilan"],
  "instrumen": [
    { "aspek": "Aspek", "indikator": "Indikator", "skor": "Skor" }
  ]
}`,
    sumatif: `{
  "bentuk": "Bentuk penilaian",
  "instrumen": [
    { "uraian": "Soal/indikator", "bobot": "Bobot" }
  ],
  "kkm": "Nilai KKM"
}`,
    rubrik: `{
  "kriteria": [
    { "kriteria": "Nama kriteria", "deskripsi": "Deskripsi skala" }
  ]
}`,
    materi: `{
  "materiList": ["Materi 1", "Materi 2", "Materi 3"],
  "sumber": "Sumber referensi"
}`,
    media: `{
  "mediaList": [
    { "jenis": "Video/Audio/dll", "deskripsi": "Nama media" }
  ],
  "catatan": "Catatan penggunaan"
}`,
    refleksi: `{
  "refleksiList": [
    { "pertanyaan": "Pertanyaan refleksi", "target": "Guru/Peserta Didik/Keduanya" }
  ]
}`,
    pengayaan: `{
  "pengayaanList": ["Aktivitas 1", "Aktivitas 2"]
}`,
    remediasi: `{
  "remediasiList": ["Aktivitas 1", "Aktivitas 2"]
}`,
  };

  const instructions = {
    lkpd: 'Buat 2-3 kegiatan relevan dengan mata pelajaran dan fase tersebut.',
    formatif: `Buat 3-5 instrumen penilaian yang sesuai dengan mata pelajaran ${header.mataPelajaran}.`,
    sumatif: 'Buat 3-5 soal/indikator yang sesuai.',
    rubrik: 'Buat 3-5 kriteria rubrik dengan deskripsi yang jelas.',
    materi: `Buat 3-5 materi pokok yang sesuai dengan judul modul "${header.judulModul}".`,
    media: 'Buat 3-5 media yang relevan.',
    refleksi: 'Buat 4-6 pertanyaan refleksi dengan pendekatan 3-2-1 atau teknik lainnya.',
    pengayaan: 'Buat 2-3 aktivitas pengayaan untuk peserta didik yang telah mencapai ketuntasan.',
    remediasi: 'Buat 2-3 aktivitas remediasi untuk peserta didik yang belum mencapai ketuntasan.',
  };

  const sectionName = sectionNames[key] || key.toUpperCase();
  const schema = jsonSchemas[key] || '{}';
  const instr = instructions[key] || '';
  const extra = extraInstructions ? '\n\n' + extraInstructions : '';

  return {
    system: SYSTEM_PROMPT,
    user: `${buildContext(header, modulText)}

Buatlah data untuk ${sectionName} dengan struktur JSON berikut:
${schema}

${instr}${extra}`
  };
}

/* ── All prompt builders ── */
const buildLKPDPrompt     = (h, e, m) => makePrompt('lkpd', h, e, m);
const buildFormatifPrompt  = (h, e, m) => makePrompt('formatif', h, e, m);
const buildSumatifPrompt   = (h, e, m) => makePrompt('sumatif', h, e, m);
const buildRubrikPrompt    = (h, e, m) => makePrompt('rubrik', h, e, m);
const buildMateriPrompt    = (h, e, m) => makePrompt('materi', h, e, m);
const buildMediaPrompt     = (h, e, m) => makePrompt('media', h, e, m);
const buildRefleksiPrompt  = (h, e, m) => makePrompt('refleksi', h, e, m);
const buildPengayaanPrompt = (h, e, m) => makePrompt('pengayaan', h, e, m);
const buildRemediasiPrompt = (h, e, m) => makePrompt('remediasi', h, e, m);

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
