/**
 * ============================================================
 * PROMPT GENERATOR: INSERSI PENDIDIKAN PERKOPERASIAN DI SMK
 * Konteks: Dinas Pendidikan Provinsi Jawa Tengah
 * Sumber Acuan: Paparan Yuliana Setiasih, S.Pd (Pengawas SMK Jateng)
 * Tanggal Referensi: 22 Mei 2026
 * ============================================================
 *
 * Cara pakai:
 *   1. Panggil generateCPPrompt(cpPemerintah, mataPelajaran, opsiInsersi)
 *   2. Hasilnya adalah string prompt siap kirim ke LLM (mis. Claude / GPT)
 *   3. Parameter 'cpPemerintah' adalah teks CP asli yang di-upload guru
 *   4. Parameter 'mataPelajaran' adalah "KIK" atau "IPAS"
 *   5. Parameter 'opsiInsersi' adalah objek konfigurasi opsional (lihat JSDoc)
 */

// ─────────────────────────────────────────────────────────────
// BAGIAN 1: KNOWLEDGE BASE INSERSI PERKOPERASIAN
// Diambil langsung dari paparan PDF – jangan diubah sembarangan
// ─────────────────────────────────────────────────────────────

const KNOWLEDGE_BASE = {

  /**
   * Definisi inti pendidikan perkoperasian (slide 2 PDF)
   */
  definisi: `
    Pendidikan perkoperasian adalah upaya menanamkan nilai, prinsip, dan praktik koperasi
    kepada peserta didik melalui pembelajaran di sekolah untuk membentuk generasi yang
    berkarakter, mandiri, dan peduli terhadap kesejahteraan bersama.
  `,

  /**
   * Dasar hukum / landasan (slide 2 PDF)
   */
  dasarHukum: {
    pancasila: "Pancasila Sila Ke-5: Keadilan sosial bagi seluruh rakyat Indonesia",
    uud1945Pasal33: "Perekonomian disusun sebagai usaha bersama berdasarkan asas kekeluargaan",
    peranKoperasi: "Koperasi adalah sokoguru perekonomian rakyat dan sesuai dengan jati diri bangsa Indonesia",
  },

  /**
   * Tiga aspek pendidikan perkoperasian (slide 2 PDF)
   */
  tigaAspek: {
    tahu: {
      label: "TAHU (Pengetahuan)",
      indikator: [
        "Konsep koperasi",
        "Sejarah koperasi",
        "Prinsip koperasi",
        "Peran koperasi dalam ekonomi rakyat",
      ],
    },
    bisa: {
      label: "BISA (Keterampilan)",
      indikator: [
        "Kerja sama",
        "Simulasi jual beli",
        "Musyawarah",
        "Struktur organisasi",
        "Proyek koperasi siswa",
      ],
    },
    terbiasa: {
      label: "TERBIASA (Sikap)",
      indikator: ["Jujur", "Disiplin", "Bertanggung jawab", "Kolaboratif", "Demokratis"],
    },
  },

  /**
   * Nilai karakter yang ditekankan (slide 2 & 3 PDF)
   */
  nilaiKarakter: [
    "Gotong Royong",
    "Tanggung Jawab",
    "Jujur",
    "Kerja Sama",
    "Peduli",
    "Demokratis",
    "Adil",
    "Mandiri",
    "Kolaboratif",
  ],

  /**
   * Nilai & Prinsip Koperasi yang wajib diintegrasikan (slide 3 & 6 PDF)
   */
  nilaiPrinsipKoperasi: [
    "Kebersamaan & Gotong Royong",
    "Demokrasi & Partisipasi",
    "Kejujuran & Transparansi",
    "Tanggung Jawab",
    "Kemandirian Ekonomi",
    "Kepedulian Sosial",
  ],

  /**
   * Materi pokok pendidikan perkoperasian (slide 2 PDF)
   */
  materiPokok: [
    "Sejarah koperasi Indonesia",
    "Mohammad Hatta – Bapak Koperasi",
    "Tujuan koperasi",
    "Prinsip koperasi",
    "Jenis-jenis koperasi",
    "Koperasi sekolah",
    "SHU (Sisa Hasil Usaha)",
    "Demokrasi ekonomi",
    "Koperasi modern",
    "Transparansi dan akuntabilitas",
  ],

  /**
   * Tiga langkah insersi bagi guru (slide 2 PDF)
   */
  langkahInsersi: [
    {
      tahap: "Tahap 1 – Inisiatif Merancang",
      deskripsi:
        "Guru menganalisis CP/TP, menentukan tujuan pembelajaran, menyiapkan aktivitas belajar, media, dan penilaian.",
    },
    {
      tahap: "Tahap 2 – Sertakan Peserta Didik",
      deskripsi:
        "Pembelajaran aktif, menyenangkan, berbasis pengalaman: diskusi, simulasi, proyek, permainan, video, dll.",
    },
    {
      tahap: "Tahap 3 – Siapkan Jejaring",
      deskripsi:
        "Bekerja sama dengan guru lain, MGMP/KKG, orang tua, masyarakat, dan lingkungan sekitar.",
    },
  ],

  /**
   * Prinsip pelaksanaan pembelajaran insersi (slide 3 & 6 PDF)
   */
  prinsipPelaksanaan: [
    "Kontekstual",
    "Bermakna",
    "Menyenangkan",
    "Kolaboratif",
    "Fleksibel",
    "Berbasis pengalaman nyata",
  ],

  /**
   * Proses pembelajaran mendalam (slide 6 PDF)
   */
  prosesPembelajaran: [
    {
      fase: "1. MEMAHAMI",
      deskripsi: "Mempelajari konsep koperasi, nilai, peran, dan manfaatnya.",
    },
    {
      fase: "2. MENGAPLIKASI",
      deskripsi: "Merancang, mengelola, dan menjalankan proyek/usaha koperasi.",
    },
    {
      fase: "3. MEREFLEKSI",
      deskripsi: "Mengevaluasi hasil usaha dan dampak sosial untuk perbaikan berkelanjutan.",
    },
  ],

  // ─── MATA PELAJARAN SPESIFIK ───────────────────────────────

  /**
   * Spesifikasi insersi untuk PROJEK IPAS – SMK Fase E (slide 4 PDF)
   * Aspek: Perilaku Ekonomi dan Kesejahteraan
   */
  proyekIPAS: {
    fase: "Fase E (Kelas X)",
    aspekUtama: "Perilaku Ekonomi dan Kesejahteraan",
    cpInsersiRingkasan:
      "Murid mampu memahami konsep dan peran pelaku serta lembaga ekonomi dalam sistem perekonomian Indonesia.",
    cpProjekIPASKelasX:
      "Murid mampu memahami peran individu dan lembaga ekonomi dalam memenuhi kebutuhan hidup dan meningkatkan kesejahteraan masyarakat; memahami pengelolaan keuangan secara bijak; menganalisis fungsi lembaga ekonomi dalam kegiatan perekonomian; mengidentifikasi perilaku ekonomi masyarakat dalam kehidupan sehari-hari; serta menjelaskan hubungan kegiatan ekonomi dengan kesejahteraan sosial ekonomi dalam konteks kehidupan lokal, nasional, dan global.",
    elemen: [
      {
        elemen: "Menjelaskan Fenomena Secara Ilmiah",
        elemenIPAS: ["Memahami konsep ekonomi dan kesejahteraan", "Menganalisis fenomena ekonomi di lingkungan sekitar"],
        elemenPerkoperasian: [
          "Memahami konsep koperasi sebagai lembaga ekonomi rakyat",
          "Menganalisis peran koperasi dalam kegiatan ekonomi dan kewirausahaan berbasis kebersamaan",
        ],
        tujuanPembelajaran: [
          "Menjelaskan pengertian, tujuan, fungsi, dan peran koperasi dalam meningkatkan kesejahteraan anggota dan masyarakat",
          "Menganalisis kontribusi koperasi bagi ekonomi, UMKM, dan kesejahteraan masyarakat",
        ],
        materi: [
          "Pengertian, tujuan, fungsi koperasi",
          "Peran koperasi dalam ekonomi masyarakat, koperasi modern, kewirausahaan koperasi, pemberdayaan UMKM",
        ],
      },
      {
        elemen: "Mendesain dan Mengevaluasi Penyelidikan Ilmiah",
        elemenIPAS: [
          "Merancang penyelidikan sederhana",
          "Mengevaluasi proses dan hasil penyelidikan",
          "Merancang solusi terhadap masalah ekonomi",
        ],
        elemenPerkoperasian: [
          "Menyusun perencanaan usaha koperasi sederhana",
          "Mengembangkan struktur organisasi dan pembagian tugas",
          "Melaksanakan proyek kewirausahaan berbasis koperasi",
        ],
        tujuanPembelajaran: [
          "Merancang usaha koperasi berdasarkan kebutuhan anggota dan lingkungan",
          "Menyusun struktur organisasi dan menjelaskan tugas pengurus, pengawas, dan anggota",
          "Melaksanakan simulasi/proyek pengelolaan koperasi secara kolaboratif",
        ],
        materi: [
          "Tahapan pendirian koperasi, rencana usaha, identifikasi kebutuhan anggota",
          "Struktur organisasi, tugas pengurus, pengawas, dan rapat anggota",
          "Simulasi rapat & pengelolaan koperasi siswa, proyek kewirausahaan koperasi",
        ],
      },
      {
        elemen: "Menerjemahkan Data dan Bukti-Bukti Secara Ilmiah",
        elemenIPAS: [
          "Mengolah dan menganalisis data",
          "Menginterpretasikan data dan bukti",
          "Mengkomunikasikan hasil secara ilmiah",
        ],
        elemenPerkoperasian: [
          "Menyusun laporan kegiatan dan laporan keuangan koperasi",
          "Menganalisis data hasil kegiatan usaha koperasi",
          "Mengkomunikasikan hasil proyek koperasi secara ilmiah dan kolaboratif",
        ],
        tujuanPembelajaran: [
          "Menyusun laporan kegiatan dan keuangan secara jujur dan bertanggung jawab",
          "Menginterpretasikan data (SHU, transaksi) untuk pengambilan keputusan bersama",
          "Mempresentasikan hasil proyek dan melakukan refleksi kegiatan",
        ],
        materi: [
          "Laporan keuangan & pertanggungjawaban pengurus dan pengawas",
          "SHU, pencatatan transaksi, analisis hasil usaha koperasi",
          "Presentasi proyek koperasi, refleksi kegiatan, komunikasi dan kerja sama kelompok",
        ],
      },
    ],
    hasilAkhir:
      "Peserta didik memiliki pengetahuan, keterampilan, dan sikap kooperatif untuk berperilaku ekonomi yang bertanggung jawab, serta berkontribusi pada kesejahteraan diri, masyarakat, dan lingkungan.",
    nilaiKoperasi: ["Kebersamaan", "Demokrasi", "Tanggung Jawab", "Kejujuran", "Partisipasi"],
  },

  /**
   * Spesifikasi insersi untuk KIK – SMK Fase F (slide 5 PDF)
   * Mata Pelajaran: Kreativitas, Inovasi, dan Kewirausahaan
   */
  kik: {
    fase: "Fase F (Kelas XI)",
    namaMapel: "Kreativitas, Inovasi dan Kewirausahaan (KIK)",
    tujuanUtama:
      "Mewujudkan peserta didik yang kreatif, inovatif, berjiwa kewirausahaan, dan mampu mengelola usaha koperasi secara mandiri, kolaboratif, dan berkelanjutan.",
    cpKIKFaseFokus: {
      kreativitas: "Mengembangkan ide dan gagasan baru dengan pola pikir berkembang dan karakter wirausaha.",
      inovasi: "Menerapkan design thinking, mengembangkan inovasi, dan memanfaatkan teknologi.",
      kewirausahaan:
        "Menyusun rencana produksi, membuat produk/jasa, pengemasan, serta strategi distribusi dan pemasaran.",
      pengelolaanUsaha:
        "Menganalisis peluang usaha, menyusun laporan keuangan, dan mengelola usaha secara mandiri & berkelanjutan.",
    },
    elemen: [
      {
        elemenCP: "Memahami konsep koperasi dan nilai-nilai koperasi",
        tujuanPembelajaran:
          "Memahami konsep, tujuan, fungsi, dan peran koperasi serta menerapkan nilai-nilainya dalam ide usaha kreatif",
        materi: ["Pengertian, tujuan, fungsi, prinsip & nilai koperasi"],
      },
      {
        elemenCP: "Menyusun perencanaan usaha koperasi",
        tujuanPembelajaran:
          "Merancang solusi usaha koperasi menggunakan design thinking dan teknologi",
        materi: [
          "Tahapan pendirian koperasi",
          "Identifikasi kebutuhan anggota",
          "Rencana usaha",
        ],
      },
      {
        elemenCP: "Melaksanakan proyek & produksi usaha koperasi",
        tujuanPembelajaran:
          "Menghasilkan produk/jasa inovatif serta menentukan strategi pemasaran dan distribusi secara kolaboratif",
        materi: [
          "Proyek kewirausahaan koperasi",
          "Inovasi produk/jasa",
          "Koperasi modern, teknologi & pemasaran digital",
        ],
      },
      {
        elemenCP: "Mengembangkan pengelolaan usaha koperasi modern",
        tujuanPembelajaran:
          "Menyusun pembagian tugas dan menjalankan produksi usaha koperasi secara efektif",
        materi: [
          "Struktur organisasi, tugas pengurus, pengawas, anggota, pembagian tugas",
        ],
      },
      {
        elemenCP: "Menyusun laporan kegiatan & laporan keuangan koperasi",
        tujuanPembelajaran:
          "Menyusun laporan keuangan sederhana dan mengelola usaha secara jujur, mandiri, dan berkelanjutan",
        materi: ["SHU, pencatatan transaksi, laporan keuangan koperasi"],
      },
      {
        elemenCP: "Mengevaluasi kegiatan koperasi & pengambilan keputusan bersama",
        tujuanPembelajaran:
          "Mengevaluasi kegiatan usaha dan mengambil keputusan bersama untuk pengembangan usaha",
        materi: [
          "Evaluasi kegiatan koperasi",
          "Rapat anggota",
          "Pengambilan keputusan",
        ],
      },
    ],
    integrasiKIKdanPerkoperasian: [
      "Mengembangkan ide usaha kreatif berbasis kebutuhan bersama dan nilai koperasi",
      "Menggunakan design thinking untuk merancang solusi usaha koperasi yang inovatif",
      "Membuat produk/jasa koperasi dan menentukan strategi pemasaran serta distribusi",
      "Melaksanakan produksi usaha koperasi dengan pembagian peran secara demokratis",
      "Membuat pembukuan sederhana dan mengelola usaha secara mandiri & berkelanjutan",
      "Melakukan refleksi & evaluasi usaha serta menyusun rencana pengembangan",
      "Mempresentasikan produk/usaha koperasi dalam pameran atau business pitching",
    ],
    hasilAkhir:
      "Peserta didik memiliki kompetensi kreatif, inovatif, dan kewirausahaan melalui koperasi untuk menciptakan usaha yang bermanfaat bagi anggota, masyarakat, dan lingkungan.",
    nilaiKoperasi: [
      "Kebersamaan",
      "Demokrasi",
      "Tanggung Jawab",
      "Kejujuran",
      "Partisipasi",
      "Berorientasi Kesejahteraan Bersama",
    ],
  },

  /**
   * Kolaborasi & kemitraan yang bisa dijadikan konteks pembelajaran
   */
  kemitraan: ["Orang Tua", "Masyarakat", "Dunia Usaha/Dunia Kerja", "Koperasi & UMKM", "Alumni"],

  /**
   * Hasil yang diharapkan dari seluruh program insersi (slide 3 PDF)
   */
  hasilYangDiharapkan: [
    "Karakter kuat & berintegritas",
    "Keterampilan kewirausahaan & inovasi",
    "Literasi finansial yang baik",
    "Kemampuan kolaborasi & komunikasi",
    "Kemandirian ekonomi & kepedulian sosial",
    "Siap kerja, berdaya saing, dan berjiwa koperasi",
  ],
};

// ─────────────────────────────────────────────────────────────
// BAGIAN 2: HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Mengubah array menjadi bullet list teks (untuk dimasukkan ke prompt)
 */
function toBulletList(arr) {
  return arr.map((item) => `  - ${item}`).join("\n");
}

/**
 * Mengubah array objek menjadi deskripsi teks singkat
 */
function toObjectList(arr, keyLabel, valueKey) {
  return arr
    .map((obj) => `  - ${obj[keyLabel]}: ${Array.isArray(obj[valueKey]) ? obj[valueKey].join(", ") : obj[valueKey]}`)
    .join("\n");
}

// ─────────────────────────────────────────────────────────────
// BAGIAN 3: SYSTEM PROMPT GENERATOR
// ─────────────────────────────────────────────────────────────

/**
 * Membangun system prompt yang menanamkan konteks insersi perkoperasian
 * ke dalam model AI sebelum menerima CP dari guru.
 *
 * @param {"KIK" | "IPAS"} mataPelajaran
 * @returns {string} system prompt
 */
function buildSystemPrompt(mataPelajaran) {
  const mapelData = mataPelajaran === "KIK" ? KNOWLEDGE_BASE.kik : KNOWLEDGE_BASE.proyekIPAS;

  return `
Kamu adalah asisten ahli kurikulum SMK yang memiliki pemahaman mendalam tentang:
1. Kurikulum Merdeka untuk SMK (Fase E dan Fase F)
2. Insersi Pendidikan Perkoperasian di SMK berdasarkan program Dinas Pendidikan Provinsi Jawa Tengah
3. Penyusunan Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), dan Alur Tujuan Pembelajaran (ATP)

=== KONTEKS INSERSI PENDIDIKAN PERKOPERASIAN ===

DEFINISI:
${KNOWLEDGE_BASE.definisi.trim()}

LANDASAN HUKUM:
- ${KNOWLEDGE_BASE.dasarHukum.pancasila}
- ${KNOWLEDGE_BASE.dasarHukum.uud1945Pasal33}
- ${KNOWLEDGE_BASE.dasarHukum.peranKoperasi}

TIGA ASPEK YANG HARUS TERPENUHI DALAM CP/TP:
1. TAHU (Pengetahuan): ${KNOWLEDGE_BASE.tigaAspek.tahu.indikator.join(", ")}
2. BISA (Keterampilan): ${KNOWLEDGE_BASE.tigaAspek.bisa.indikator.join(", ")}
3. TERBIASA (Sikap): ${KNOWLEDGE_BASE.tigaAspek.terbiasa.indikator.join(", ")}

NILAI DAN PRINSIP KOPERASI YANG WAJIB DIINTEGRASIKAN:
${toBulletList(KNOWLEDGE_BASE.nilaiPrinsipKoperasi)}

NILAI KARAKTER YANG DITEKANKAN:
${toBulletList(KNOWLEDGE_BASE.nilaiKarakter)}

PRINSIP PELAKSANAAN PEMBELAJARAN:
${toBulletList(KNOWLEDGE_BASE.prinsipPelaksanaan)}

PROSES PEMBELAJARAN MENDALAM (urutan wajib):
${KNOWLEDGE_BASE.prosesPembelajaran.map((p) => `  ${p.fase}: ${p.deskripsi}`).join("\n")}

=== SPESIFIKASI UNTUK MAPEL: ${mataPelajaran === "KIK" ? "KREATIVITAS, INOVASI DAN KEWIRAUSAHAAN (KIK) – FASE F" : "PROJEK IPAS – FASE E"} ===

${
  mataPelajaran === "KIK"
    ? `
FASE: ${KNOWLEDGE_BASE.kik.fase}
TUJUAN UTAMA: ${KNOWLEDGE_BASE.kik.tujuanUtama}

FOKUS CP KIK FASE F:
- Kreativitas: ${KNOWLEDGE_BASE.kik.cpKIKFaseFokus.kreativitas}
- Inovasi: ${KNOWLEDGE_BASE.kik.cpKIKFaseFokus.inovasi}
- Kewirausahaan: ${KNOWLEDGE_BASE.kik.cpKIKFaseFokus.kewirausahaan}
- Pengelolaan Usaha: ${KNOWLEDGE_BASE.kik.cpKIKFaseFokus.pengelolaanUsaha}

ELEMEN CP PERKOPERASIAN YANG HARUS DIINTEGRASIKAN:
${KNOWLEDGE_BASE.kik.elemen
  .map(
    (e, i) => `  ${i + 1}. Elemen: ${e.elemenCP}
     TP: ${e.tujuanPembelajaran}
     Materi: ${e.materi.join(", ")}`
  )
  .join("\n")}

INTEGRASI KIK DAN PERKOPERASIAN (output yang diharapkan):
${toBulletList(KNOWLEDGE_BASE.kik.integrasiKIKdanPerkoperasian)}

HASIL AKHIR YANG DIHARAPKAN:
${KNOWLEDGE_BASE.kik.hasilAkhir}

NILAI KOPERASI YANG MENJADI LANDASAN:
${toBulletList(KNOWLEDGE_BASE.kik.nilaiKoperasi)}
`
    : `
FASE: ${KNOWLEDGE_BASE.proyekIPAS.fase}
ASPEK UTAMA: ${KNOWLEDGE_BASE.proyekIPAS.aspekUtama}

CP PROJEK IPAS KELAS X:
${KNOWLEDGE_BASE.proyekIPAS.cpProjekIPASKelasX}

CP INSERSI PERKOPERASIAN (ringkasan):
${KNOWLEDGE_BASE.proyekIPAS.cpInsersiRingkasan}

ELEMEN DAN TUJUAN PEMBELAJARAN PERKOPERASIAN:
${KNOWLEDGE_BASE.proyekIPAS.elemen
  .map(
    (e, i) => `  ${i + 1}. ELEMEN: ${e.elemen}
     Elemen IPAS: ${e.elemenIPAS.join("; ")}
     Elemen Perkoperasian: ${e.elemenPerkoperasian.join("; ")}
     TP Perkoperasian: ${e.tujuanPembelajaran.join("; ")}
     Materi: ${e.materi.join("; ")}`
  )
  .join("\n\n")}

HASIL AKHIR YANG DIHARAPKAN:
${KNOWLEDGE_BASE.proyekIPAS.hasilAkhir}

NILAI KOPERASI YANG MENJADI LANDASAN:
${toBulletList(KNOWLEDGE_BASE.proyekIPAS.nilaiKoperasi)}
`
}

=== ATURAN DALAM MENGHASILKAN CP/TP ===

1. Gunakan BAHASA INDONESIA yang baku dan sesuai kaidah penulisan kurikulum Merdeka.
2. CP harus MENCAKUP ketiga aspek: TAHU, BISA, dan TERBIASA (pengetahuan, keterampilan, sikap).
3. INTEGRASIKAN nilai perkoperasian SECARA ORGANIK, bukan sebagai tambahan yang dipaksakan.
4. Kata kerja operasional harus TERUKUR dan sesuai taksonomi Bloom revisi.
5. Setiap CP/TP harus mencerminkan PRINSIP: Kontekstual, Bermakna, Kolaboratif.
6. OUTPUT harus siap pakai oleh guru SMK dalam menyusun modul ajar.
7. Pastikan ada BENANG MERAH antara CP pemerintah asli → elemen insersi → TP → materi pokok → penilaian.
`.trim();
}

// ─────────────────────────────────────────────────────────────
// BAGIAN 4: USER PROMPT GENERATOR (inti permintaan ke LLM)
// ─────────────────────────────────────────────────────────────

/**
 * @typedef {Object} OpsiInsersi
 * @property {boolean} [hubungkanInsersi=true]        - Apakah menghubungkan CP dengan insersi perkoperasian
 * @property {boolean} [generateTP=true]              - Apakah menghasilkan Tujuan Pembelajaran
 * @property {boolean} [generateATP=false]            - Apakah menghasilkan Alur Tujuan Pembelajaran
 * @property {boolean} [generateMateri=true]          - Apakah menyertakan daftar materi pokok
 * @property {boolean} [generatePenilaian=false]      - Apakah menyertakan saran penilaian
 * @property {boolean} [generateModulAjar=false]      - Apakah menghasilkan kerangka modul ajar
 * @property {string}  [konteksLokal=""]              - Konteks lokal spesifik (mis. "daerah pertanian", "pesisir")
 * @property {string}  [namaSekolah="SMK"]            - Nama sekolah untuk personalisasi
 * @property {number}  [jumlahPertemuan=3]            - Jumlah pertemuan yang direncanakan
 * @property {number}  [jpPerPertemuan=6]             - JP per pertemuan
 * @property {"X"|"XI"} [kelas="X"]                  - Kelas target
 */

/**
 * Membangun user prompt berdasarkan CP yang di-upload guru.
 *
 * @param {string} cpPemerintah - Teks CP asli dari pemerintah yang di-upload guru
 * @param {"KIK" | "IPAS"} mataPelajaran - Mata pelajaran yang dipilih
 * @param {OpsiInsersi} opsiInsersi - Konfigurasi tambahan
 * @returns {string} user prompt
 */
function buildUserPrompt(cpPemerintah, mataPelajaran, opsiInsersi = {}) {
  const {
    hubungkanInsersi = true,
    generateTP = true,
    generateATP = false,
    generateMateri = true,
    generatePenilaian = false,
    generateModulAjar = false,
    konteksLokal = "",
    namaSekolah = "SMK",
    jumlahPertemuan = 3,
    jpPerPertemuan = 6,
    kelas = mataPelajaran === "KIK" ? "XI" : "X",
  } = opsiInsersi;

  const namaMapelLengkap =
    mataPelajaran === "KIK"
      ? "Kreativitas, Inovasi dan Kewirausahaan (KIK)"
      : "Projek Ilmu Pengetahuan Alam dan Sosial (Projek IPAS)";

  const faseLabel = mataPelajaran === "KIK" ? "Fase F" : "Fase E";

  let prompt = `
Berikut adalah CP (Capaian Pembelajaran) dari pemerintah untuk mata pelajaran **${namaMapelLengkap}** – ${faseLabel}, yang telah diunggah oleh guru dari ${namaSekolah}:

---
CP DARI PEMERINTAH:
${cpPemerintah.trim()}
---

`;

  if (!hubungkanInsersi) {
    // Mode: hanya generate CP/TP tanpa insersi
    prompt += `
Tugas kamu:
Susunkan **Tujuan Pembelajaran (TP)** berdasarkan CP di atas untuk kelas ${kelas} dengan alokasi waktu ${jumlahPertemuan} pertemuan (${jpPerPertemuan} JP @ 45 menit per pertemuan).

Format output:
1. Ringkasan CP (1-2 kalimat)
2. Daftar Tujuan Pembelajaran (nomor urut, kata kerja operasional, objek, konteks)
3. Materi pokok yang relevan
`;
  } else {
    // Mode: insersi perkoperasian aktif
    prompt += `
Tugas kamu adalah menghasilkan **CP yang telah diinsersi pendidikan perkoperasian** berdasarkan:
1. CP pemerintah di atas
2. Panduan insersi pendidikan perkoperasian dari Dinas Pendidikan Provinsi Jawa Tengah (sudah ada dalam konteksmu)

Kelas: ${kelas} | Fase: ${faseLabel} | Alokasi: ${jumlahPertemuan} pertemuan × ${jpPerPertemuan} JP @ 45 menit
${konteksLokal ? `Konteks lokal sekolah: ${konteksLokal}` : ""}

=== OUTPUT YANG DIMINTA ===

**1. CP TERINSERSI**
Tulis ulang CP secara utuh dengan mengintegrasikan nilai, prinsip, dan praktik perkoperasian ke dalam rumusan CP. Pastikan CP terinsersi mencakup:
- Dimensi pengetahuan perkoperasian (TAHU)
- Dimensi keterampilan perkoperasian (BISA)
- Dimensi karakter/sikap perkoperasian (TERBIASA)
- Minimal menyebut 2-3 nilai koperasi yang relevan

Format CP terinsersi:
"Murid mampu [rumusan lengkap yang mengintegrasikan CP asli + perkoperasian]"
`;

    if (generateTP) {
      prompt += `

**2. TUJUAN PEMBELAJARAN (TP) TERINSERSI**
Susun ${jumlahPertemuan * 2}-${jumlahPertemuan * 3} Tujuan Pembelajaran yang:
- Mencerminkan elemen insersi perkoperasian yang relevan dengan CP di atas
- Menggunakan kata kerja operasional yang terukur (Bloom revisi)
- Seimbang antara kognitif, psikomotorik, dan afektif
- Berurutan dari Memahami → Mengaplikasi → Merefleksi

Format setiap TP:
[Kode TP] | [Kata Kerja] + [Objek] + [Konteks Perkoperasian] | [Aspek: Tahu/Bisa/Terbiasa]
`;
    }

    if (generateATP) {
      prompt += `

**3. ALUR TUJUAN PEMBELAJARAN (ATP)**
Susun ATP dalam bentuk tabel dengan kolom:
| Pertemuan | TP | Kegiatan Inti | Nilai Koperasi | Penilaian Singkat |

ATP harus menggambarkan alur Memahami → Mengaplikasi → Merefleksi yang logis.
`;
    }

    if (generateMateri) {
      prompt += `

**4. MATERI POKOK TERINSERSI**
Daftar topik/materi untuk setiap pertemuan, hubungkan materi mapel dengan materi perkoperasian.
Format: 
Pertemuan [N]: [Topik Mapel] ↔ [Topik Perkoperasian]
`;
    }

    if (generatePenilaian) {
      prompt += `

**5. SARAN PENILAIAN**
Berikan 3-5 contoh instrumen/bentuk penilaian yang:
- Mengukur aspek perkoperasian secara autentik
- Sesuai dengan prinsip pembelajaran aktif dan berbasis proyek
- Mencakup penilaian proses dan hasil
`;
    }

    if (generateModulAjar) {
      prompt += `

**6. KERANGKA MODUL AJAR**
Hasilkan kerangka modul ajar lengkap dengan:
A. Identitas Modul
B. Capaian Pembelajaran (CP terinsersi)
C. Tujuan Pembelajaran
D. Profil Pelajar Pancasila yang Dikembangkan
E. Sarana dan Prasarana
F. Target Peserta Didik
G. Model Pembelajaran
H. Kegiatan Pembelajaran (per pertemuan):
   - Pendahuluan (... menit)
   - Inti – fase Memahami/Mengaplikasi/Merefleksi (... menit)
   - Penutup (... menit)
I. Asesmen
J. Refleksi Guru
`;
    }

    prompt += `

=== CATATAN PENTING ===
- Insersi harus terasa ORGANIK dan tidak dipaksakan – nilai koperasi harus muncul secara alami dari konteks pembelajaran
- Gunakan konteks nyata koperasi sekolah, koperasi UMKM lokal, atau koperasi digital sebagai contoh konkret
- Pastikan ada KESINAMBUNGAN antara CP pemerintah asli dan CP terinsersi
- Bahasa harus sesuai kaidah penulisan kurikulum Merdeka (formal, terstruktur, operasional)
`;
  }

  return prompt.trim();
}

// ─────────────────────────────────────────────────────────────
// BAGIAN 5: MAIN GENERATOR FUNCTION (EXPORT UTAMA)
// ─────────────────────────────────────────────────────────────

/**
 * Fungsi utama untuk menghasilkan pasangan system + user prompt
 * siap dikirim ke API Claude/GPT.
 *
 * @param {string} cpPemerintah - Teks CP asli yang di-upload guru
 * @param {"KIK" | "IPAS"} mataPelajaran - Pilihan mata pelajaran
 * @param {OpsiInsersi} opsiInsersi - Konfigurasi tambahan (opsional)
 * @returns {{ systemPrompt: string, userPrompt: string, metadata: object }}
 */
function generateCPPrompt(cpPemerintah, mataPelajaran = "IPAS", opsiInsersi = {}) {
  if (!cpPemerintah || cpPemerintah.trim().length < 10) {
    throw new Error("cpPemerintah tidak boleh kosong. Upload teks CP dari pemerintah terlebih dahulu.");
  }

  if (!["KIK", "IPAS"].includes(mataPelajaran)) {
    throw new Error('mataPelajaran harus "KIK" atau "IPAS"');
  }

  const systemPrompt = buildSystemPrompt(mataPelajaran);
  const userPrompt = buildUserPrompt(cpPemerintah, mataPelajaran, opsiInsersi);

  return {
    systemPrompt,
    userPrompt,
    metadata: {
      mataPelajaran,
      fase: mataPelajaran === "KIK" ? "Fase F" : "Fase E",
      kelas: opsiInsersi.kelas || (mataPelajaran === "KIK" ? "XI" : "X"),
      hubungkanInsersi: opsiInsersi.hubungkanInsersi !== false,
      fiturAktif: {
        tp: opsiInsersi.generateTP !== false,
        atp: !!opsiInsersi.generateATP,
        materi: opsiInsersi.generateMateri !== false,
        penilaian: !!opsiInsersi.generatePenilaian,
        modulAjar: !!opsiInsersi.generateModulAjar,
      },
      sumber: "Paparan Insersi Pendidikan Perkoperasian SMK – Dinas Pendidikan Provinsi Jawa Tengah, 22 Mei 2026",
      penyusunReferensi: "Yuliana Setiasih, S.Pd (Pengawas SMK Provinsi Jawa Tengah)",
    },
  };
}

// ─────────────────────────────────────────────────────────────
// BAGIAN 6: CONTOH PENGGUNAAN (bisa dihapus di production)
// ─────────────────────────────────────────────────────────────

/*
// === CONTOH 1: Projek IPAS dengan insersi perkoperasian ===

const cpIPASdariPemerintah = `
Pada akhir fase E, peserta didik mampu memahami konsep dan fenomena ekonomi yang terjadi di 
masyarakat. Peserta didik mampu menganalisis hubungan antara kegiatan ekonomi individu, 
kelompok, dan lembaga dalam sistem perekonomian nasional. Peserta didik juga mampu 
mengidentifikasi berbagai permasalahan ekonomi di lingkungan sekitarnya dan merancang solusi 
sederhana berbasis data dan bukti ilmiah.
`;

const hasilIPAS = generateCPPrompt(cpIPASdariPemerintah, "IPAS", {
  hubungkanInsersi: true,
  generateTP: true,
  generateATP: true,
  generateMateri: true,
  generatePenilaian: true,
  konteksLokal: "Wilayah pertanian dan perkebunan, banyak koperasi tani aktif",
  namaSekolah: "SMK Negeri 1 Purbalingga",
  jumlahPertemuan: 3,
  jpPerPertemuan: 6,
  kelas: "X",
});

console.log("=== SYSTEM PROMPT ===");
console.log(hasilIPAS.systemPrompt);
console.log("\n=== USER PROMPT ===");
console.log(hasilIPAS.userPrompt);
console.log("\n=== METADATA ===");
console.log(hasilIPAS.metadata);


// === CONTOH 2: KIK dengan modul ajar lengkap ===

const cpKIKdariPemerintah = `
Pada akhir fase F, peserta didik mampu mengembangkan kreativitas dan inovasi dalam merancang 
ide usaha yang bernilai ekonomis. Peserta didik mampu menerapkan prinsip-prinsip kewirausahaan 
dalam mengelola usaha secara efektif dan efisien, membuat produk/jasa yang inovatif, 
menentukan strategi pemasaran yang tepat, serta menyusun laporan keuangan usaha sederhana.
`;

const hasilKIK = generateCPPrompt(cpKIKdariPemerintah, "KIK", {
  hubungkanInsersi: true,
  generateTP: true,
  generateMateri: true,
  generatePenilaian: true,
  generateModulAjar: true,
  namaSekolah: "SMK Negeri 2 Purwokerto",
  jumlahPertemuan: 3,
  jpPerPertemuan: 5,
  kelas: "XI",
});

// Kirim ke API Claude:
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: hasilKIK.systemPrompt,
    messages: [{ role: "user", content: hasilKIK.userPrompt }],
  }),
});
const data = await response.json();
console.log(data.content[0].text);
*/

// ─────────────────────────────────────────────────────────────
// BAGIAN 7: EXPORTS
// ─────────────────────────────────────────────────────────────

// Untuk penggunaan di Node.js / module bundler
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateCPPrompt,
    buildSystemPrompt,
    buildUserPrompt,
    KNOWLEDGE_BASE,
  };
}

// Untuk penggunaan di browser (ES Module)
// export { generateCPPrompt, buildSystemPrompt, buildUserPrompt, KNOWLEDGE_BASE };
