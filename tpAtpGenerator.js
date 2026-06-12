// ============================================================
//  TP & ATP GENERATOR — Prompt Builder
//  SMK Muhammadiyah 3 Purbalingga | Kurikulum Merdeka
//  Generator Tujuan Pembelajaran & Alur Tujuan Pembelajaran
//  Konsentrasi: Teknologi Farmasi | Layanan Perbankan Syariah
// ============================================================

// ============================================================
//  BAGIAN 1: KAMUS KONTEKS KONSENTRASI KEAHLIAN
//  Data ini menjadi "DNA" setiap TP yang dihasilkan.
//  Semakin kaya data di sini, semakin kontekstual hasilnya.
// ============================================================

const KONTEKS_KONSENTRASI = {

  // ──────────────────────────────────────────────────────────
  //  TEKNOLOGI FARMASI
  //  SMK Muh. 3 Purbalingga
  // ──────────────────────────────────────────────────────────
  "Teknologi Farmasi": {
    label_pendek: "Teknologi Farmasi",
    deskripsi_singkat:
      "Program keahlian yang mempersiapkan tenaga teknis kefarmasian yang mampu " +
      "bekerja di apotek, klinik, rumah sakit, dan industri farmasi dengan landasan " +
      "ilmu sains yang kuat dan etika pelayanan kesehatan.",

    // Fenomena IPAS yang paling relevan dengan bidang ini
    fenomena_ipas: {
      makhluk_hidup:
        "mekanisme kerja obat dalam tubuh manusia (farmakodinamik), respons imun " +
        "terhadap penyakit infeksi yang endemik di Purbalingga (ISPA, DBD), dan " +
        "interaksi mikroorganisme patogen dengan sel inang",
      zat_perubahan:
        "reaksi kimia dalam proses formulasi sediaan farmasi (tablet, kapsul, sirup, " +
        "salep), perubahan fisika-kimia obat akibat suhu dan kelembapan, serta " +
        "identifikasi senyawa kimia dalam bahan baku obat tradisional tanaman lokal " +
        "Purbalingga (jahe, temulawak, kayu manis dari lereng Gunung Slamet)",
      energi:
        "energi yang dibutuhkan dalam proses sterilisasi alat kesehatan, mekanisme " +
        "perpindahan panas dalam penyimpanan vaksin (cold chain), dan energi yang " +
        "terlibat dalam reaksi biokimia tubuh",
      keruangan:
        "pola distribusi penyakit dan akses layanan kesehatan di wilayah pegunungan " +
        "dan pedesaan Purbalingga, termasuk desa-desa di kecamatan Karangreja dan " +
        "Kutabawa yang akses kesehatannya terbatas",
      dinamika_sosial:
        "perilaku masyarakat dalam swamedikasi (pengobatan mandiri), kepercayaan " +
        "pada pengobatan tradisional vs modern, dan dinamika sosial pasien di " +
        "apotek komunitas Purbalingga",
      ekonomi:
        "analisis harga dan keterjangkauan obat bagi masyarakat berpenghasilan " +
        "rendah Purbalingga, peran BPJS Kesehatan dalam sistem distribusi obat, " +
        "dan potensi ekonomi jamu serta obat herbal lokal",
    },

    // Produk/hasil belajar nyata yang bisa dibuat siswa
    produk_nyata: [
      "laporan uji mutu sediaan farmasi sederhana (uji kekerasan tablet, uji disolusi)",
      "etiket obat dan brosur konseling pasien yang memenuhi standar BPOM",
      "proposal mini penelitian khasiat tanaman obat lokal Purbalingga",
      "video edukasi cara penggunaan obat yang benar untuk masyarakat",
      "laporan observasi alur pelayanan resep di apotek komunitas",
    ],

    // Tema projek terintegrasi yang konkret
    tema_projek: [
      "Analisis kandungan zat aktif pada tanaman obat tradisional lereng Gunung Slamet " +
        "dan potensinya sebagai alternatif pengobatan ISPA",
      "Pemetaan pola swamedikasi masyarakat Purbalingga dan edukasi penggunaan " +
        "antibiotik yang tepat guna",
      "Studi komparasi akses layanan apotek di wilayah perkotaan vs pedesaan Purbalingga " +
        "beserta dampak sosialnya",
      "Formulasi dan uji organoleptik minuman herbal berbahan tanaman lokal Purbalingga " +
        "untuk mendukung daya tahan tubuh pekerja industri",
    ],

    // Konteks lokal spesifik
    konteks_lokal:
      "apotek komunitas di Purbalingga, Puskesmas Kecamatan, RSUD dr. R. Goeteng " +
      "Taroenadibrata, tanaman obat keluarga (TOGA) yang tumbuh di lereng Gunung Slamet, " +
      "dan industri jamu/herbal skala rumahan di Purbalingga",

    // Koneksi DUDI nyata
    dudi_mitra:
      "Apotek Kimia Farma Purbalingga, RSUD dr. R. Goeteng Taroenadibrata, " +
      "Puskesmas wilayah Purbalingga, distributor farmasi regional Purwokerto, " +
      "industri jamu tradisional Banyumas-Purbalingga",

    // Nilai karakter spesifik yang relevan
    nilai_karakter_spesifik:
      "amanah dalam pelayanan kesehatan, teliti dan presisi sebagai standar " +
      "kefarmasian, dan kepedulian terhadap kesehatan masyarakat sebagai wujud " +
      "rahmatan lil 'alamin",

    // Kata kerja operasional yang dominan untuk bidang ini
    kata_kerja_dominan: [
      "mengidentifikasi", "memformulasikan", "menguji", "menganalisis kandungan",
      "menyusun laporan", "mengevaluasi mutu", "mendemonstrasi prosedur",
      "memetakan", "merancang uji", "menginterpretasikan data",
    ],

    // Referensi standar industri yang relevan
    standar_industri: "BPOM, Farmakope Indonesia, Standar Pelayanan Kefarmasian (PMK 74/2016)",

    // Alokasi waktu per semester (bisa disesuaikan)
    alokasi: { ganjil: "70 JP", genap: "95 JP", total: "165 JP" },
  },

  // ──────────────────────────────────────────────────────────
  //  LAYANAN PERBANKAN SYARIAH
  //  SMK Muh. 3 Purbalingga
  // ──────────────────────────────────────────────────────────
  "Layanan Perbankan Syariah": {
    label_pendek: "Layanan Perbankan Syariah",
    deskripsi_singkat:
      "Program keahlian yang mempersiapkan tenaga profesional di lembaga keuangan " +
      "syariah — bank syariah, BPRS, BMT, koperasi syariah — dengan pemahaman " +
      "mendalam tentang prinsip muamalah Islam dan praktik keuangan halal.",

    fenomena_ipas: {
      makhluk_hidup:
        "dampak kesejahteraan finansial terhadap kesehatan fisik dan mental " +
        "masyarakat Purbalingga, serta pola konsumsi pangan bergizi yang dipengaruhi " +
        "oleh kemampuan ekonomi rumah tangga",
      zat_perubahan:
        "perubahan nilai uang dalam konsep inflasi dan purchasing power, transformasi " +
        "aset fisik menjadi instrumen keuangan (gadai emas syariah/rahn), dan " +
        "perubahan material dalam produksi UMKM yang dibiayai kredit syariah",
      energi:
        "energi ekonomi dalam perputaran uang dan modal usaha, konsumsi energi " +
        "lembaga keuangan syariah sebagai entitas bisnis, dan potensi pembiayaan " +
        "syariah untuk proyek energi terbarukan lokal Purbalingga",
      keruangan:
        "distribusi spasial kantor bank syariah, BMT, dan koperasi simpan pinjam " +
        "di seluruh kecamatan Purbalingga, serta kesenjangan akses keuangan antara " +
        "wilayah perkotaan dan pedesaan/pegunungan",
      dinamika_sosial:
        "perubahan perilaku ekonomi masyarakat Purbalingga yang beralih dari bank " +
        "konvensional ke lembaga keuangan syariah, dinamika kepercayaan masyarakat " +
        "terhadap produk keuangan halal, dan peran BMT dalam pemberdayaan UMKM lokal",
      ekonomi:
        "analisis permintaan dan penawaran produk keuangan syariah (tabungan, " +
        "pembiayaan mudharabah, murabahah), peran BPRS dan BMT dalam mendukung " +
        "UMKM industri bulu mata dan pertanian Purbalingga, serta konsep zakat " +
        "sebagai instrumen distribusi kesejahteraan",
    },

    produk_nyata: [
      "laporan analisis produk tabungan dan pembiayaan syariah di BMT/BPRS Purbalingga",
      "simulasi akad murabahah dan mudharabah untuk pembiayaan UMKM",
      "proposal program CSR lembaga keuangan syariah untuk komunitas lokal",
      "infografis perbandingan bunga bank konvensional vs bagi hasil syariah",
      "laporan observasi alur pelayanan nasabah di bank syariah",
    ],

    tema_projek: [
      "Analisis peran BMT Purbalingga dalam mendukung permodalan pengrajin industri " +
        "bulu mata dan dampaknya terhadap kesejahteraan keluarga",
      "Pemetaan literasi keuangan syariah masyarakat petani lereng Gunung Slamet " +
        "dan strategi peningkatannya melalui edukasi berbasis komunitas",
      "Studi kelayakan pendirian unit simpan pinjam syariah di lingkungan sekolah " +
        "sebagai laboratorium keuangan nyata",
      "Evaluasi distribusi zakat dan wakaf produktif Purbalingga dalam mengurangi " +
        "kesenjangan ekonomi antarwilayah",
    ],

    konteks_lokal:
      "Bank Syariah Indonesia (BSI) Purbalingga, BPRS Buana Mitra Perwira, " +
      "BMT-BMT di kecamatan Purbalingga, koperasi syariah berbasis komunitas, " +
      "Baznas Purbalingga, dan UMKM yang menggunakan pembiayaan syariah",

    dudi_mitra:
      "BSI KC Purbalingga, BPRS Buana Mitra Perwira, BMT El-Mentari, " +
      "Koperasi Syariah Al-Amin Purbalingga, Baznas Purbalingga, " +
      "Dinas Koperasi dan UMKM Kabupaten Purbalingga",

    nilai_karakter_spesifik:
      "kejujuran dan amanah sebagai fondasi muamalah Islam, menghindari riba " +
      "dan gharar dalam setiap transaksi keuangan, serta semangat berkontribusi " +
      "pada ekonomi umat yang adil dan maslahah",

    kata_kerja_dominan: [
      "menganalisis", "mengevaluasi", "membandingkan", "merancang simulasi",
      "menyusun proposal", "memetakan", "mengidentifikasi", "menghitung",
      "menginterpretasikan", "menilai kelayakan",
    ],

    standar_industri: "POJK Perbankan Syariah, Fatwa DSN-MUI, OJK Literasi Keuangan Syariah",

    alokasi: { ganjil: "70 JP", genap: "95 JP", total: "165 JP" },
  },
};

// ============================================================
//  BAGIAN 2: SCAFFOLD TAKSONOMI BLOOM
//  Memastikan urutan kognitif TP selalu eskalatif dan valid
// ============================================================

const BLOOM_SCAFFOLD = {
  C2: {
    level: "C2 — Memahami",
    kata_kerja: ["menjelaskan", "mendeskripsikan", "mengidentifikasi", "mencontohkan", "merangkum"],
    deskripsi: "Murid mampu memaknai dan menerangkan konsep dengan kata-katanya sendiri",
  },
  C3: {
    level: "C3 — Menerapkan",
    kata_kerja: ["menerapkan", "menggunakan", "melaksanakan", "mendemonstrasikan", "mengoperasikan"],
    deskripsi: "Murid mampu menggunakan konsep dalam situasi baru yang konkret",
  },
  C4: {
    level: "C4 — Menganalisis",
    kata_kerja: ["menganalisis", "membandingkan", "menguraikan", "menelaah", "membedakan"],
    deskripsi: "Murid mampu memecah informasi kompleks menjadi bagian-bagian untuk memahami hubungannya",
  },
  C5: {
    level: "C5 — Mengevaluasi",
    kata_kerja: ["mengevaluasi", "menilai", "mempertahankan argumen", "mengkritisi", "memvalidasi"],
    deskripsi: "Murid mampu membuat penilaian berdasarkan kriteria dan bukti yang valid",
  },
  C6: {
    level: "C6 — Mencipta",
    kata_kerja: ["merancang", "menyusun", "mengembangkan", "memproduksi", "mempresentasikan"],
    deskripsi: "Murid mampu menghasilkan produk atau karya orisinal yang mengintegrasikan berbagai konsep",
  },
};

// ============================================================
//  BAGIAN 3: POLA ATP (urutan TP per semester)
//  Sesuai dokumen asli sekolah: eskalatif C2→C6
// ============================================================

const POLA_ATP = {
  ganjil: [
    { nomor: "TP-01", bloom: "C2", fokus: "pengantar dan orientasi fenomena lokal" },
    { nomor: "TP-02", bloom: "C2", fokus: "makhluk hidup, lingkungan, dan konteks lokal" },
    { nomor: "TP-03", bloom: "C3", fokus: "zat dan perubahannya dalam industri keahlian" },
    { nomor: "TP-04", bloom: "C3", fokus: "energi dan penyelidikan ilmiah" },
    { nomor: "TP-05", bloom: "C4", fokus: "analisis dan peer review rancangan percobaan" },
    { nomor: "TP-06", bloom: "C5", fokus: "presentasi data dan argumen ilmiah" },
  ],
  genap: [
    { nomor: "TP-07", bloom: "C4", fokus: "keruangan, konektivitas, dan geografi sosial" },
    { nomor: "TP-08", bloom: "C4", fokus: "dinamika sosial dan pembangunan berkelanjutan" },
    { nomor: "TP-09", bloom: "C5", fokus: "ekonomi, UMKM, dan wirausaha kontekstual" },
    { nomor: "TP-10", bloom: "C6", fokus: "perancangan projek terintegrasi IPA+IPS" },
    { nomor: "TP-11", bloom: "C6", fokus: "pelaksanaan dan pengumpulan data projek" },
    { nomor: "TP-12", bloom: "C6", fokus: "presentasi publik dan refleksi akhir tahun" },
  ],
};

// ============================================================
//  BAGIAN 4: buildTPATPPrompt — fungsi utama
// ============================================================

/**
 * Membangun system prompt + user prompt untuk generate TP & ATP.
 *
 * @param {Object} input
 * @param {string} input.konsentrasiKeahlian   - "Teknologi Farmasi" | "Layanan Perbankan Syariah"
 * @param {string} input.fase                  - "E" | "F"
 * @param {string} input.kelas                 - "X" | "XI" | "XII"
 * @param {string} input.semester              - "Ganjil dan Genap" | "Ganjil" | "Genap"
 * @param {string} input.tahunPelajaran        - "2025/2026"
 * @param {string} input.namaGuru              - Nama guru penyusun
 * @param {string} input.nipGuru               - NIP/NUPTK guru
 * @param {string} input.alokasiTotal          - Total JP (default dari konteks)
 * @param {string} input.konteksLokalTambahan  - Info lokal tambahan dari guru (opsional)
 * @param {number} input.jumlahTP              - Jumlah TP yang diinginkan (default: 12)
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
function buildTPATPPrompt(input) {
  const {
    konsentrasiKeahlian,
    fase = "E",
    kelas = "X",
    semester = "Ganjil dan Genap",
    tahunPelajaran = "2025/2026",
    namaGuru = "__________________",
    nipGuru = "__________________",
    alokasiTotal = null,
    konteksLokalTambahan = "",
    jumlahTP = 12,
  } = input;

  const ctx = KONTEKS_KONSENTRASI[konsentrasiKeahlian];
  if (!ctx) {
    throw new Error(
      `Konsentrasi "${konsentrasiKeahlian}" belum ada di kamus. ` +
      `Tersedia: ${Object.keys(KONTEKS_KONSENTRASI).join(", ")}`
    );
  }

  const totalJP = alokasiTotal || ctx.alokasi.total;
  const konteksLokalFull = [ctx.konteks_lokal, konteksLokalTambahan].filter(Boolean).join(". ");

  // Buat deskripsi pola TP per semester
  const pola_ganjil = POLA_ATP.ganjil
    .map((t) => `  ${t.nomor} (${t.bloom}) — ${t.fokus}`)
    .join("\n");
  const pola_genap = POLA_ATP.genap
    .map((t) => `  ${t.nomor} (${t.bloom}) — ${t.fokus}`)
    .join("\n");

  // Serialisasi data fenomena IPAS untuk prompt
  const fenomena_list = Object.entries(ctx.fenomena_ipas)
    .map(([aspek, uraian]) => {
      const label = {
        makhluk_hidup: "Makhluk Hidup & Lingkungan",
        zat_perubahan: "Zat dan Perubahannya",
        energi: "Energi dan Perubahannya",
        keruangan: "Keruangan & Konektivitas",
        dinamika_sosial: "Dinamika Sosial",
        ekonomi: "Perilaku Ekonomi",
      }[aspek] || aspek;
      return `  • ${label}: ${uraian}`;
    })
    .join("\n");

  const produk_list = ctx.produk_nyata.map((p) => `  • ${p}`).join("\n");
  const tema_list = ctx.tema_projek.map((t, i) => `  ${i + 1}. ${t}`).join("\n");
  const kata_kerja_list = ctx.kata_kerja_dominan.join(", ");

  // ── SYSTEM PROMPT ────────────────────────────────────────
  const systemPrompt = `
Kamu adalah perancang kurikulum SMK yang sudah berpengalaman lebih dari satu dekade 
dalam menyusun Tujuan Pembelajaran (TP) dan Alur Tujuan Pembelajaran (ATP) berbasis 
Kurikulum Merdeka. Kamu sangat paham konteks SMK kejuruan Indonesia, termasuk 
dinamika dunia kerja di bidang ${ctx.label_pendek}.

CARA KAMU MENULIS:
Kamu tidak menulis seperti dokumen birokrasi. Kamu menulis seperti seorang guru 
senior yang benar-benar tahu apa yang ingin dicapai siswa — kalimatnya langsung 
ke inti, aktif, terukur, dan mencerminkan realita kelas dan dunia kerja.

STANDAR KALIMAT TP YANG KAMU HASILKAN:
✓ Selalu diawali "Peserta didik mampu…" — bukan "diharapkan", bukan "dapat"
✓ Kata kerja operasional yang terukur dan sesuai level Bloom yang ditentukan
✓ Menyebut konteks spesifik (nama tempat, produk, atau situasi nyata) — bukan generik
✓ Satu kalimat TP maksimal 2–3 baris, padat dan tidak bertele-tele
✓ Tidak ada redundansi antar TP dalam satu dokumen

STANDAR KALIMAT IKTP YANG KAMU HASILKAN:
✓ Setiap TP menghasilkan 2–3 IKTP yang observable dan measurable
✓ IKTP menggunakan kriteria kuantitatif jika memungkinkan (minimal X, ≥ Y%, dalam N menit)
✓ IKTP harus berbeda level antara yang satu dengan lainnya (tidak semua "dapat menyebutkan")
✓ IKTP menggambarkan bukti konkret yang bisa diperiksa guru

YANG TIDAK BOLEH KAMU LAKUKAN:
✗ Menulis TP yang bisa berlaku untuk semua bidang keahlian (terlalu generik)
✗ Menggunakan kalimat pasif berlebihan
✗ Copy-paste TP yang hampir identik dengan hanya mengganti satu kata
✗ Menambahkan narasi atau catatan kaki di luar format yang diminta
✗ Menggunakan istilah klise: "dalam rangka", "sehubungan dengan", "diharapkan mampu"
✗ Memunculkan preamble atau kalimat pengantar sebelum tabel — langsung mulai dari Bagian A
`.trim();

  // ── USER PROMPT ──────────────────────────────────────────
  const userPrompt = `
Susunlah dokumen TP & ATP lengkap untuk mata pelajaran Projek IPAS di SMK Muhammadiyah 3 
Purbalingga dengan konsentrasi keahlian ${ctx.label_pendek}. Ikuti SEMUA instruksi berikut 
dengan cermat.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 IDENTITAS DOKUMEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Mata Pelajaran       : Projek Ilmu Pengetahuan Alam dan Sosial (Projek IPAS)
- Konsentrasi Keahlian : ${konsentrasiKeahlian}
- Fase / Kelas         : Fase ${fase} / Kelas ${kelas}
- Semester             : ${semester}
- Tahun Pelajaran      : ${tahunPelajaran}
- Alokasi Waktu Total  : ${totalJP} (Ganjil: ${ctx.alokasi.ganjil} │ Genap: ${ctx.alokasi.genap})
- Guru Mata Pelajaran  : ${namaGuru} / NIP/NUPTK: ${nipGuru}
- Jumlah TP            : ${jumlahTP} TP (6 Ganjil + 6 Genap)
- Konteks Lokal        : ${konteksLokalFull}
- DUDI Mitra           : ${ctx.dudi_mitra}
- Standar Industri     : ${ctx.standar_industri}
- Nilai Karakter       : ${ctx.nilai_karakter_spesifik}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 KONTEKS KEAHLIAN — BAHAN UTAMA KONTEKSTUALISASI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Deskripsi program: ${ctx.deskripsi_singkat}

Fenomena IPAS yang relevan dengan bidang ini (WAJIB muncul sebagai konteks TP):
${fenomena_list}

Produk/hasil belajar nyata yang bisa dibuat siswa di bidang ini:
${produk_list}

Tema projek terintegrasi yang konkret dan realistis:
${tema_list}

Kata kerja operasional yang dominan untuk bidang ini:
${kata_kerja_list}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 POLA ALUR DAN LEVEL BLOOM YANG HARUS DIIKUTI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEMESTER GANJIL (urutan eskalatif C2 → C5):
${pola_ganjil}

SEMESTER GENAP (urutan eskalatif C4 → C6):
${pola_genap}

Level Bloom harus BENAR-BENAR naik secara bertahap. TP-01 dan TP-02 ada di C2 (Memahami), 
bukan C3 atau C4. TP-10 sampai TP-12 ada di C6 (Mencipta), bukan C4.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 INSTRUKSI PENYUSUNAN PER BAGIAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BAGIAN A — IDENTITAS MATA PELAJARAN
Format: tabel dua kolom (Komponen | Keterangan).
Isi sesuai data identitas di atas. Cantumkan juga baris "Elemen CP yang Dirujuk" 
dengan ketiga elemen resmi Kepmendikbudristek.

BAGIAN B — RINGKASAN CAPAIAN PEMBELAJARAN YANG DIRUJUK
Format: tabel yang memuat Fase, Elemen CP, Deskripsi CP (teks resmi, tidak diubah), 
dan Kompetensi yang Dijabarkan (6 poin sesuai dokumen asli sekolah).

BAGIAN C — TABEL TUJUAN PEMBELAJARAN (TP) ← BAGIAN PALING KRITIS
Format tabel: No. TP | Rumusan Tujuan Pembelajaran | Level Bloom | Dimensi Profil Lulusan | Alokasi Waktu

Untuk setiap TP, ikuti instruksi ini dengan ketat:

  [RUMUSAN TP]
  → Awali dengan: "Peserta didik mampu…"
  → Gunakan kata kerja yang tepat sesuai level Bloom yang ditentukan
  → Sebutkan KONTEKS SPESIFIK bidang ${ctx.label_pendek} — jangan generik
  → Sebutkan minimal 1 nama/istilah spesifik (nama tempat, nama proses, nama produk, 
    nama lembaga) yang relevan dengan ${ctx.label_pendek} di Purbalingga
  → Kalimat harus bisa langsung dipahami guru tanpa penjelasan tambahan

  CONTOH BURUK (generik, hindari):
  "Peserta didik mampu menjelaskan konsep ekonomi dan kaitannya dengan dunia kerja."

  CONTOH BAIK untuk ${ctx.label_pendek}:
${konsentrasiKeahlian === "Layanan Perbankan Syariah"
  ? `  "Peserta didik mampu menjelaskan mekanisme akad murabahah dan mudharabah dalam ` +
    `pembiayaan UMKM industri bulu mata Purbalingga menggunakan konsep ekonomi Islam ` +
    `secara lisan dengan tepat dan sistematis."`
  : `  "Peserta didik mampu menjelaskan mekanisme kerja obat analgesik dalam sistem saraf ` +
    `manusia dan mengaitkannya dengan pola swamedikasi masyarakat Purbalingga ` +
    `berdasarkan data kunjungan apotek komunitas setempat."`
}

  [LEVEL BLOOM]
  → Cantumkan kode dan nama: C2 — Memahami / C3 — Menerapkan / dll.
  → Level harus konsisten dengan kata kerja yang digunakan di rumusan TP

  [DIMENSI PROFIL LULUSAN]
  → Pilih 2–3 dimensi yang paling relevan dari 8 dimensi:
    Keimanan & Ketakwaan | Kewargaan | Penalaran Kritis | Kreativitas |
    Kemandirian | Kolaborasi | Komunikasi | Kesehatan
  → TP-12 wajib mencantumkan "Semua 8 Dimensi Profil Lulusan"

  [ALOKASI WAKTU]
  → TP-01 s.d. TP-02: 10 JP masing-masing
  → TP-03 s.d. TP-04: 15 JP masing-masing
  → TP-05 s.d. TP-06: 10 JP masing-masing
  → TP-07 s.d. TP-08: 10–15 JP (sesuaikan dengan kedalaman materi)
  → TP-09: 15 JP
  → TP-10: 15 JP
  → TP-11: 20 JP
  → TP-12: 20 JP
  → Total harus persis ${totalJP}

BAGIAN D — INDIKATOR KETERCAPAIAN TP (IKTP) & ASESMEN
Format tabel: No. TP | Rumusan TP (singkat, italic) | IKTP | Bentuk Asesmen | Instrumen/Alat Ukur

Untuk setiap TP, hasilkan 2–3 IKTP dengan kualitas ini:

  IKTP-1: Observable sederhana (level "dapat menyebutkan/mengidentifikasi/membuat")
  IKTP-2: Observable lebih kompleks (level "dapat menganalisis/membandingkan/merancang")
  IKTP-3 (jika ada): Berbasis produk nyata atau unjuk kerja di depan orang lain

  Contoh IKTP yang BERKUALITAS untuk ${ctx.label_pendek}:
${konsentrasiKeahlian === "Layanan Perbankan Syariah"
  ? `  IKTP-1: Peserta didik dapat membedakan minimal 3 perbedaan mendasar antara akad ` +
    `murabahah dan mudharabah menggunakan tabel perbandingan yang tepat\n` +
    `  IKTP-2: Peserta didik dapat mensimulasikan proses pencairan pembiayaan syariah ` +
    `untuk skenario UMKM fiktif dengan komponen akad yang lengkap dan sesuai fatwa DSN-MUI\n` +
    `  IKTP-3: Peserta didik dapat membuat brosur sederhana produk tabungan syariah ` +
    `yang memenuhi prinsip transparansi dan bebas gharar`
  : `  IKTP-1: Peserta didik dapat menyebutkan minimal 5 senyawa aktif yang umum ` +
    `terkandung dalam obat ISPA beserta mekanisme kerjanya secara singkat\n` +
    `  IKTP-2: Peserta didik dapat membuat etiket obat dan informasi konseling ` +
    `untuk 3 jenis sediaan farmasi yang berbeda dengan benar sesuai standar BPOM\n` +
    `  IKTP-3: Peserta didik dapat mempresentasikan hasil observasi apotek selama ` +
    `30 menit dan menjawab pertanyaan guru/teman dengan argumen berbasis data`
}

  [BENTUK ASESMEN] — pilih yang paling sesuai:
  Formatif lisan | Formatif tulis | Unjuk kerja | Portofolio | Peer assessment |
  Sumatif tertulis | Sumatif presentasi | Formatif observasi lapangan

  [INSTRUMEN/ALAT UKUR] — sebutkan nama konkret, bukan hanya kategori:
  Rubrik penilaian (sebutkan aspeknya) | Lembar observasi | Checklist prosedur |
  Lembar peer review | Lembar jurnal lapangan | Kuis pilihan ganda/uraian

BAGIAN E — PETA ALUR TUJUAN PEMBELAJARAN
Sajikan dalam dua bagian:

  E.1 Diagram Alur Visual (tabel linear)
  Semester Ganjil: TP-01(C2) → TP-02(C2) → TP-03(C3) → TP-04(C3) → TP-05(C4) → TP-06(C5)
  Semester Genap:  TP-07(C4) → TP-08(C4) → TP-09(C5) → TP-10(C6) → TP-11(C6) → TP-12(C6)

  E.2 Tabel ATP Lengkap
  Format: No. TP | Tujuan Pembelajaran | Materi/Konten Esensial | Dimensi Profil Lulusan | 
          Pendekatan Deep Learning | Waktu | Bentuk Asesmen | Pertemuan

  Untuk kolom [Materi/Konten Esensial]:
  → Cantumkan 3–5 poin materi yang spesifik, bukan hanya judul bab
  → Minimum 1 poin harus menyebut konteks lokal Purbalingga atau ${ctx.label_pendek}
  → Konten harus selaras dengan level Bloom TP tersebut

  Untuk kolom [Pendekatan Deep Learning]:
  → Setiap TP harus memuat minimal 1 dari 3 prinsip: Mindful | Meaningful | Joyful
  → Deskripsikan KONKRET aktivitasnya, bukan hanya labelnya
  → Contoh BAIK: "Meaningful: analisis data kunjungan pasien apotek komunitas Purbalingga 
    sebagai sumber data primer"
  → Contoh BURUK: "Meaningful Learning"

  Untuk kolom [Pertemuan]:
  → Hitung dan cantumkan "Ptm X–Y" secara berurutan dan konsisten
  → Total pertemuan harus sesuai dengan total JP yang dibagi 5 JP per pertemuan

BAGIAN F — CATATAN PENGEMBANGAN DAN VALIDASI
Format tabel yang memuat:
  • Catatan kontekstualisasi TP untuk bidang ${ctx.label_pendek} (2–3 kalimat padat)
  • Kesesuaian dengan pendekatan deep learning (Mindful, Meaningful, Joyful — 
    sebutkan contoh konkret 1–2 kalimat per prinsip)
  • Tantangan dan solusi antisipasi yang REALISTIS untuk bidang ini 
    (bukan tantangan generik, tapi yang benar-benar mungkin dihadapi guru ${ctx.label_pendek})
  • Baris tanda tangan: Guru Penyusun | Waka Kurikulum | Kepala Sekolah
  • Tanggal: Purbalingga, __________________ ${tahunPelajaran.split("/")[0]}

Footer dokumen:
SMK MUHAMMADIYAH 3 PURBALINGGA
Unggul • Islami • Berjiwa Entrepreneur

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 STANDAR GAYA PENULISAN AKHIR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Gaya formal-hangat: seperti panduan dari guru senior kepada rekan sejawat
✓ Kalimat TP: aktif, langsung, tidak bertele-tele
✓ Nilai ${ctx.nilai_karakter_spesifik} → sisipkan secara organik, 
  bukan dipaksakan di setiap baris
✓ Variasi kata kerja: jangan gunakan kata kerja yang sama di dua TP berbeda
✓ Konteks lokal: minimal 60% TP menyebut nama/tempat/produk Purbalingga secara eksplisit
✓ Keaslian: tidak boleh terasa seperti hasil modifikasi template buku teks

Mulai langsung dari BAGIAN A. Tidak perlu kalimat pengantar sebelum tabel.
`.trim();

  return { systemPrompt, userPrompt };
}

// ============================================================
//  BAGIAN 5: generateTPATP — pemanggil API
// ============================================================

/**
 * Memanggil Claude API dan mengembalikan dokumen TP & ATP lengkap.
 *
 * @param {Object} input - Sama dengan parameter buildTPATPPrompt
 * @returns {Promise<string>} - Teks TP & ATP lengkap
 */
async function generateTPATP(input) {
  const { systemPrompt, userPrompt } = buildTPATPPrompt(input);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

// ============================================================
//  BAGIAN 6: generateBothKonsentrasi
//  Utility untuk generate dua konsentrasi sekaligus
// ============================================================

/**
 * Generate TP & ATP untuk kedua konsentrasi sekolah sekaligus.
 * Berguna untuk preview atau batch export.
 *
 * @param {Object} baseInput - Input dasar (tanpa konsentrasiKeahlian)
 * @returns {Promise<{ farmasi: string, syariah: string }>}
 */
async function generateBothKonsentrasi(baseInput) {
  const [farmasi, syariah] = await Promise.all([
    generateTPATP({ ...baseInput, konsentrasiKeahlian: "Teknologi Farmasi" }),
    generateTPATP({ ...baseInput, konsentrasiKeahlian: "Layanan Perbankan Syariah" }),
  ]);
  return { farmasi, syariah };
}

// ============================================================
//  BAGIAN 7: getKonteksPreview
//  Utility untuk menampilkan ringkasan konteks di UI form
// ============================================================

/**
 * Mengembalikan ringkasan konteks konsentrasi untuk ditampilkan
 * di antarmuka generator sebelum user klik "Generate".
 *
 * @param {string} konsentrasiKeahlian
 * @returns {Object} Ringkasan konteks
 */
function getKonteksPreview(konsentrasiKeahlian) {
  const ctx = KONTEKS_KONSENTRASI[konsentrasiKeahlian];
  if (!ctx) return null;
  return {
    label: ctx.label_pendek,
    deskripsi: ctx.deskripsi_singkat,
    topikUtama: Object.keys(ctx.fenomena_ipas).length + " aspek IPAS terkontekstualisasi",
    produkNyata: ctx.produk_nyata.length + " jenis produk belajar",
    temaProyek: ctx.tema_projek.length + " tema projek terintegrasi",
    dudiMitra: ctx.dudi_mitra,
    standarIndustri: ctx.standar_industri,
    alokasi: ctx.alokasi,
  };
}

// ============================================================
//  BAGIAN 8: getDaftarKonsentrasi
//  Utility untuk mengisi dropdown di form generator
// ============================================================

/**
 * Mengembalikan daftar nama konsentrasi yang tersedia.
 * @returns {string[]}
 */
function getDaftarKonsentrasi() {
  return Object.keys(KONTEKS_KONSENTRASI);
}

// ============================================================
//  CONTOH PENGGUNAAN
// ============================================================

/*
// Contoh 1 — Teknologi Farmasi
const hasil = await generateTPATP({
  konsentrasiKeahlian: "Teknologi Farmasi",
  fase: "E",
  kelas: "X",
  semester: "Ganjil dan Genap",
  tahunPelajaran: "2025/2026",
  namaGuru: "Fayyad Malik, S.Pd.",
  nipGuru: "198XXXXXXXX",
  konteksLokalTambahan:
    "program TOGA (Tanaman Obat Keluarga) yang dikembangkan bersama Puskesmas setempat",
});
console.log(hasil);

// Contoh 2 — Layanan Perbankan Syariah
const hasil2 = await generateTPATP({
  konsentrasiKeahlian: "Layanan Perbankan Syariah",
  fase: "E",
  kelas: "X",
  tahunPelajaran: "2025/2026",
  namaGuru: "Fayyad Malik, S.Pd.",
  konteksLokalTambahan:
    "kerja sama dengan BPRS Buana Mitra Perwira sebagai DUDI pendamping praktik",
});
console.log(hasil2);

// Contoh 3 — Generate dua konsentrasi sekaligus
const { farmasi, syariah } = await generateBothKonsentrasi({
  fase: "E",
  kelas: "X",
  tahunPelajaran: "2025/2026",
  namaGuru: "Fayyad Malik, S.Pd.",
});

// Contoh 4 — Preview konteks di UI
const preview = getKonteksPreview("Teknologi Farmasi");
console.log(preview.dudiMitra);

// Contoh 5 — Isi dropdown
const options = getDaftarKonsentrasi();
// → ["Teknologi Farmasi", "Layanan Perbankan Syariah"]
*/

// ============================================================
//  EXPORT
// ============================================================
export {
  generateTPATP,
  buildTPATPPrompt,
  generateBothKonsentrasi,
  getKonteksPreview,
  getDaftarKonsentrasi,
  KONTEKS_KONSENTRASI,
  BLOOM_SCAFFOLD,
  POLA_ATP,
};
