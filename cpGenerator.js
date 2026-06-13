// ============================================================
//  CP GENERATOR — Prompt Builder
//  SMK Muhammadiyah 3 Purbalingga | Kurikulum Merdeka
//  Generator Capaian Pembelajaran (CP) berbasis format sekolah
// ============================================================

/**
 * Kamus konteks industri per program/konsentrasi keahlian.
 * Digunakan untuk membuat CP yang benar-benar kontekstual.
 * Tambahkan entri baru sesuai kebutuhan sekolah.
 */
const KONTEKS_KEAHLIAN = {
  // ── TEKNOLOGI INFORMASI ──────────────────────────────────
  "Rekayasa Perangkat Lunak": {
    industri: "pengembangan aplikasi, startup teknologi, software house, dan layanan digital",
    produk_nyata: "aplikasi mobile, sistem informasi sekolah, website UMKM lokal",
    fenomena_ipas: [
      "dampak energi listrik terhadap konsumsi server dan data center",
      "dinamika sosial komunitas developer dan ekosistem digital",
      "fenomena transformasi ekonomi melalui digitalisasi UMKM Purbalingga",
    ],
    konteks_lokal:
      "digitalisasi pengrajin industri bulu mata dan UMKM di Purbalingga, serta pengembangan sistem informasi untuk koperasi lokal",
    dudi_mitra: "software house lokal, startup Purwokerto-Purbalingga, Dinas Kominfo Kabupaten Purbalingga",
  },

  "Teknik Komputer dan Jaringan": {
    industri: "infrastruktur jaringan, ISP, instalasi CCTV, dan managed service IT",
    produk_nyata: "jaringan LAN sekolah/kantor, sistem keamanan CCTV, konfigurasi router",
    fenomena_ipas: [
      "energi dan gelombang elektromagnetik dalam transmisi data nirkabel",
      "dampak sosial konektivitas internet terhadap masyarakat pedesaan Purbalingga",
      "perubahan pola ekonomi UMKM akibat penetrasi internet",
    ],
    konteks_lokal:
      "perluasan akses internet di desa-desa lereng Gunung Slamet dan pembangunan infrastruktur digital Kabupaten Purbalingga",
    dudi_mitra: "ISP lokal, vendor perangkat jaringan, instansi pemerintah Purbalingga",
  },

  // ── BISNIS DAN MANAJEMEN ─────────────────────────────────
  "Akuntansi dan Keuangan Lembaga": {
    industri: "perbankan, koperasi, lembaga keuangan mikro, kantor akuntan, dan UMKM",
    produk_nyata: "laporan keuangan sederhana, analisis neraca UMKM, simulasi pembukuan koperasi",
    fenomena_ipas: [
      "dinamika ekonomi dan kesejahteraan pelaku UMKM industri bulu mata Purbalingga",
      "perubahan sosial akibat fluktuasi harga komoditas pertanian lereng Slamet",
      "interaksi antara lembaga keuangan mikro dan kesejahteraan masyarakat lokal",
    ],
    konteks_lokal:
      "analisis keuangan koperasi simpan pinjam lokal, industri rumahan bulu mata, dan kelompok tani lereng Gunung Slamet",
    dudi_mitra: "Koperasi Simpan Pinjam Purbalingga, BPR lokal, UMKM sentra industri bulu mata",
  },

  "Bisnis Retail": {
    industri: "ritel modern, minimarket, e-commerce, manajemen toko, dan distribusi",
    produk_nyata: "rancangan tata letak toko, analisis perilaku konsumen, laporan penjualan",
    fenomena_ipas: [
      "perilaku ekonomi konsumen dan pola belanja masyarakat Purbalingga",
      "dampak e-commerce terhadap pasar tradisional lokal",
      "dinamika sosial perubahan gaya hidup masyarakat urban Purbalingga",
    ],
    konteks_lokal:
      "Pasar Segamas dan Pasar Bukateja sebagai laboratorium ritel nyata, serta pertumbuhan minimarket di kecamatan-kecamatan Purbalingga",
    dudi_mitra: "Indomaret/Alfamart Purbalingga, toko oleh-oleh lokal, UMKM retail",
  },

  // ── KESEHATAN ────────────────────────────────────────────
  "Asisten Keperawatan": {
    industri: "rumah sakit, puskesmas, klinik, panti asuhan, dan layanan home care",
    produk_nyata: "laporan observasi kondisi pasien, simulasi pengukuran tanda vital, leaflet edukasi kesehatan",
    fenomena_ipas: [
      "mekanisme tubuh manusia dan sistem imun dalam menghadapi penyakit endemik lokal",
      "dinamika sosial akses layanan kesehatan masyarakat di wilayah pegunungan Purbalingga",
      "zat dan perubahan kimiawi dalam proses sterilisasi dan farmakologi dasar",
    ],
    konteks_lokal:
      "kondisi kesehatan masyarakat lereng Gunung Slamet, prevalensi penyakit musiman (ISPA, diare) di Purbalingga, dan program Puskesmas setempat",
    dudi_mitra: "RSUD dr. R. Goeteng Taroenadibrata Purbalingga, Puskesmas wilayah, klinik pratama",
  },

  "Farmasi Klinis dan Komunitas": {
    industri: "apotek, rumah sakit, industri farmasi, BPOM, dan distributor obat",
    produk_nyata: "etiket obat, laporan dispensing, brosur edukasi penggunaan obat",
    fenomena_ipas: [
      "reaksi kimia dan perubahan zat dalam proses produksi dan penyimpanan sediaan farmasi",
      "fenomena sosial pola konsumsi obat dan swamedikasi di masyarakat Purbalingga",
      "interaksi makhluk hidup dengan senyawa kimia obat pada level seluler",
    ],
    konteks_lokal:
      "apotek komunitas di Purbalingga, pola distribusi obat tradisional berbahan tanaman lokal, dan program JKN di Puskesmas setempat",
    dudi_mitra: "Apotek Kimia Farma Purbalingga, RSUD setempat, distributor farmasi regional",
  },

  // ── PARIWISATA ───────────────────────────────────────────
  "Kuliner": {
    industri: "restoran, catering, hotel, industri makanan & minuman, wirausaha kuliner",
    produk_nyata: "kreasi resep berbahan lokal, laporan uji organoleptik, proposal usaha kuliner",
    fenomena_ipas: [
      "perubahan zat dalam proses memasak: reaksi Maillard, fermentasi, dan emulsifikasi",
      "potensi ekonomi kuliner lokal Purbalingga sebagai daya tarik wisata",
      "dinamika sosial budaya makanan dalam identitas masyarakat Banyumas-Purbalingga",
    ],
    konteks_lokal:
      "makanan khas Purbalingga (mendoan, sroto, cluban), bahan pangan lokal dari pertanian lereng Slamet, dan potensi wisata kuliner Owabong",
    dudi_mitra: "restoran lokal Purbalingga, UMKM olahan pangan, Dinas Pariwisata Purbalingga",
  },

  "Perhotelan": {
    industri: "hotel, resort, villa, penginapan, dan manajemen hospitality",
    produk_nyata: "standar operasional prosedur (SOP) layanan kamar, simulasi check-in, laporan analisis kepuasan tamu",
    fenomena_ipas: [
      "interaksi sosial dan komunikasi lintas budaya dalam layanan pariwisata",
      "pengelolaan energi dan air sebagai sumber daya hotel yang efisien",
      "dampak pariwisata terhadap dinamika sosial dan ekonomi masyarakat sekitar Purbalingga",
    ],
    konteks_lokal:
      "Owabong Water Park, wisata alam Purbalingga, dan penginapan di sekitar kawasan wisata sebagai objek studi nyata",
    dudi_mitra: "hotel berbintang di Purwokerto-Purbalingga, Owabong, Dinas Pariwisata",
  },

  // ── PERTANIAN ────────────────────────────────────────────
  "Agribisnis Tanaman Pangan dan Hortikultura": {
    industri: "pertanian modern, agribisnis, greenhouse, distribusi hasil tani, dan agrowisata",
    produk_nyata: "rencana tanam berbasis analisis tanah, laporan budidaya, proposal agribisnis",
    fenomena_ipas: [
      "ekosistem pertanian dan interaksi organisme dalam sistem budidaya tanaman",
      "perubahan cuaca dan iklim lereng Gunung Slamet dan dampaknya pada produktivitas pertanian",
      "dinamika ekonomi petani dan rantai pasok komoditas sayuran Purbalingga",
    ],
    konteks_lokal:
      "pertanian sayuran di Karangreja dan Kutabawa, agrowisata strawberry lereng Slamet, dan kelompok tani lokal sebagai mitra belajar",
    dudi_mitra: "Kelompok Tani Maju Purbalingga, Dinas Pertanian Purbalingga, agrowisata setempat",
  },
};

/**
 * Elemen-elemen CP Projek IPAS resmi dari Kepmendikbudristek.
 * Tidak boleh diubah, hanya dikontekstualisasikan.
 */
const ELEMEN_CP_RESMI = {
  elemen1: {
    nama: "Menjelaskan Fenomena secara Ilmiah",
    deskripsi_resmi:
      "Murid mampu menjelaskan pengetahuan ilmiah dan membuat prediksi sederhana disertai pembuktian fenomena-fenomena yang terjadi di lingkungan sekitarnya dilihat dari berbagai aspek: Makhluk hidup dan lingkungannya; Zat dan perubahannya; Energi dan perubahannya; Keruangan dan konektivitas antarruang dan antarwaktu; Interaksi, komunikasi, sosialisasi, institusi sosial, dan dinamika sosial; Perilaku ekonomi dan kesejahteraan. Murid juga mampu mengaitkan fenomena-fenomena tersebut dengan keterampilan teknis pada bidang keahliannya.",
  },
  elemen2: {
    nama: "Menyusun Penyelidikan Ilmiah",
    deskripsi_resmi:
      "Murid mampu menyusun percobaan dengan menerapkan prosedur penyelidikan ilmiah dan memeriksa kekurangan atau kesalahan pada rancangan percobaan ilmiah tersebut.",
  },
  elemen3: {
    nama: "Merefleksikan Data dan Bukti-bukti secara Ilmiah",
    deskripsi_resmi:
      "Murid mampu membuktikan dengan prinsip dasar melalui data dan bukti dari berbagai sumber untuk membangun dan mempertahankan argumen dengan penjelasan ilmiah, mengomunikasikan proses dan hasil, serta melakukan refleksi diri terhadap tahapan kegiatan yang dilakukan.",
  },
};

// ============================================================
//  FUNGSI UTAMA: buildCPPrompt
//  Menghasilkan system prompt + user prompt untuk Claude API
// ============================================================

/**
 * Membangun prompt lengkap untuk generate dokumen CP.
 *
 * @param {Object} input - Data yang diisi dari form generator
 * @param {string} input.programKeahlian        - Nama program keahlian (harus ada di KONTEKS_KEAHLIAN)
 * @param {string} input.konsentrasiKeahlian     - Nama konsentrasi keahlian (opsional, lebih spesifik)
 * @param {string} input.fase                    - "E" atau "F"
 * @param {string} input.kelas                  - "X", "XI", atau "XII"
 * @param {string} input.semester               - "Ganjil", "Genap", atau "Ganjil dan Genap"
 * @param {string} input.tahunPelajaran         - Contoh: "2025/2026"
 * @param {string} input.namaGuru               - Nama guru pengampu
 * @param {string} input.nipGuru                - NIP/NUPTK guru
 * @param {string} input.alokasiWaktu           - Contoh: "5 JP per minggu × 36 minggu = 180 JP"
 * @param {string} input.konteksLokalTambahan   - Konteks lokal spesifik tambahan dari guru (opsional)
 * @param {string} input.nilaiKarakter          - Nilai karakter unggulan (default: "Islami, entrepreneur")
 * @param {string[]} input.dimensiProfilLulusan - Array dimensi profil yang diprioritaskan (opsional)
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
function buildCPPrompt(input) {
  const {
    mataPelajaran = "Mata Pelajaran",
    elemenList = [],
    programKeahlian,
    konsentrasiKeahlian = "",
    fase = "E",
    kelas = "X",
    semester = "Ganjil dan Genap",
    tahunPelajaran = "2025/2026",
    namaGuru = "__________________",
    nipGuru = "__________________",
    alokasiWaktu = "5 JP per minggu × 36 minggu = 180 JP",
    konteksLokalTambahan = "",
    nilaiKarakter = "Islami dan berjiwa entrepreneur",
    dimensiProfilLulusan = [],
  } = input;

  // Ambil konteks keahlian dari kamus; fallback ke template generik
  const ctx =
    KONTEKS_KEAHLIAN[konsentrasiKeahlian] ||
    KONTEKS_KEAHLIAN[programKeahlian] ||
    _fallbackKonteks(programKeahlian, konsentrasiKeahlian);

  const namaKeahlian = konsentrasiKeahlian || programKeahlian;
  const konteksLokalFull = [ctx.konteks_lokal, konteksLokalTambahan].filter(Boolean).join(". ");

  // ── SYSTEM PROMPT ────────────────────────────────────────
  const systemPrompt = `
Kamu adalah seorang pengembang kurikulum senior yang berpengalaman lebih dari 15 tahun dalam 
menyusun dokumen Capaian Pembelajaran (CP) untuk SMK di Indonesia. Kamu sangat memahami 
Kurikulum Merdeka, Kepmendikbudristek, dan konteks lokal sekolah kejuruan.

Gaya penulisanmu BUKAN seperti robot atau mesin. Kamu menulis seperti seorang guru yang 
benar-benar memahami siswa dan dunia kerja. Kalimatmu mengalir alami, hangat, dan membumi 
— tidak kaku, tidak berlebihan, tidak penuh jargon yang dipaksakan.

Prinsip penulisan yang selalu kamu pegang:
1. HUMANIZED: Tulis seolah seorang guru berpengalaman yang menulis untuk rekan sejawat, 
   bukan untuk memenuhi format administratif semata. Gunakan diksi yang hidup dan natural.
2. KONTEKSTUAL: Setiap kalimat CP harus mencerminkan realita dunia kerja di bidang 
   ${namaKeahlian} dan konteks lokal Purbalingga — bukan teori yang mengambang.
3. OPERASIONAL: Gunakan kata kerja yang bisa diukur dan diobservasi (mampu merancang, 
   mampu menganalisis, mampu mempresentasikan, mampu membandingkan, mampu mengidentifikasi).
4. INTEGRATIF: CP harus menunjukkan benang merah antara konsep IPA/IPS dengan keterampilan 
   teknis keahlian ${namaKeahlian} secara mulus dan tidak terkesan dipaksakan.
5. KONSISTEN: Gunakan orang ketiga tunggal ("murid") secara konsisten; hindari "peserta didik" 
   dan "siswa" di dalam kalimat CP itu sendiri agar sesuai dokumen resmi Kemendikbudristek.

Yang TIDAK boleh kamu lakukan:
- Mengulang kata yang sama berkali-kali dalam satu paragraf
- Menggunakan kalimat pasif berlebihan ("dapat dilakukan", "akan dipelajari")
- Menulis CP yang bisa berlaku untuk semua bidang keahlian tanpa konteks spesifik
- Menambahkan basa-basi pembuka atau penutup di luar struktur yang diminta
- Menggunakan frasa klise seperti "diharapkan mampu", "bertujuan untuk", "dalam rangka"
`.trim();

  // ── USER PROMPT ──────────────────────────────────────────
  const userPrompt = `
Susunlah dokumen Capaian Pembelajaran (CP) lengkap untuk mata pelajaran ${mataPelajaran} 
di SMK Muhammadiyah 3 Purbalingga dengan spesifikasi berikut:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 DATA IDENTITAS DOKUMEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Nama Mata Pelajaran : ${mataPelajaran}
- Program Keahlian    : ${programKeahlian}
- Konsentrasi Keahlian: ${konsentrasiKeahlian || "Semua Konsentrasi"}
- Fase / Kelas        : Fase ${fase} / Kelas ${kelas}
- Semester            : ${semester}
- Tahun Pelajaran     : ${tahunPelajaran}
- Alokasi Waktu       : ${alokasiWaktu}
- Guru Mata Pelajaran : ${namaGuru} | NIP/NUPTK: ${nipGuru}
- Konteks Lokal       : ${konteksLokalFull}
- Konteks Industri    : ${ctx.industri}
- DUDI Mitra          : ${ctx.dudi_mitra}
- Nilai Karakter      : ${nilaiKarakter}

${elemenList && elemenList.length > 0 ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ELEMEN CP RESMI (jangan ubah substansinya)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${elemenList.map((el, i) => `ELEMEN ${i + 1} — ${el.nama}:\n"${el.capaian}"\n`).join('\n')}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 CONTOH FENOMENA/KONTEKS SPESIFIK KEAHLIAN INI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gunakan fenomena-fenomena konkret berikut sebagai bahan kontekstualisasi:
${ctx.fenomena_ipas.map((f, i) => `${i + 1}. ${f}`).join("\n")}

Produk/hasil belajar nyata bidang ini:
- ${ctx.produk_nyata}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 INSTRUKSI PENYUSUNAN SETIAP BAGIAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hasilkan dokumen CP lengkap dengan SEMUA bagian berikut secara berurutan.

── BAGIAN C: ANALISIS DAN KONTEKSTUALISASI CP ──
C.1 — Kompetensi Inti (Knowledge/Skill/Attitude)
Rincikan masing-masing 4 poin yang SPESIFIK untuk bidang ${namaKeahlian}.
Gunakan bahasa yang aktif dan terukur. Contoh BURUK: "Memahami konsep."
Contoh BAIK: "Memahami cara kerja jaringan komputer dan pengaruh gangguan sinyal terhadap produktivitas industri digital."

C.2 — Koneksi dengan DUDI
Jelaskan relevansi ${mataPelajaran} dengan minimal 3 jenis pekerjaan atau industri nyata di bidang ${namaKeahlian}. Gunakan nama industri/perusahaan yang realistis dan dekat dengan konteks lokal Purbalingga-Banyumas.

C.3 — Koneksi dengan Konteks Lokal Purbalingga
Jabarkan 5–6 tema projek kontekstual yang bisa dikembangkan guru, masing-masing dikaitkan dengan aspek materi yang relevan. Gunakan detail geografis Purbalingga (Sungai Klawing, Gunung Slamet, Owabong, industri bulu mata, dll.) secara alami dan spesifik.

── BAGIAN D: KETERKAITAN DENGAN 8 DIMENSI PROFIL LULUSAN ──
Untuk setiap dimensi, tulis 1–2 kalimat yang SPESIFIK menunjukkan bagaimana ${mataPelajaran} di bidang ${namaKeahlian} mengembangkan dimensi tersebut.
${dimensiProfilLulusan.length > 0 ? `Prioritaskan pendalaman pada: ${dimensiProfilLulusan.join(", ")}.` : ""}

── BAGIAN E: PENDEKATAN DEEP LEARNING ──
Uraikan implementasi 3 prinsip deep learning untuk bidang ${namaKeahlian}:

🧠 Mindful Learning
Deskripsikan 3–4 aktivitas mindful yang SPESIFIK untuk bidang ini. Bukan hanya "refleksi diri" generik — sebutkan contoh konkret pertanyaan pemantik atau momen refleksi yang relevan.

💡 Meaningful Learning  
Deskripsikan 3–4 cara materi dikaitkan dengan kehidupan nyata siswa di bidang ini. Sebutkan minimal satu nama DUDI atau konteks lokal yang konkret.

🎉 Joyful Learning
Deskripsikan 3–4 aktivitas pembelajaran yang menyenangkan dan relevan secara kejuruan. Bukan sekadar "games" — tapi aktivitas seperti field study, simulasi industri, atau pameran karya.

── BAGIAN F: REKOMENDASI STRATEGI PEMBELAJARAN ──
Sarankan:
- Model pembelajaran yang paling cocok untuk bidang ${namaKeahlian}
- Pendekatan asesmen yang realistis
- Sumber & media belajar kontekstual
- Alat/perangkat yang tersedia di sekolah

── BAGIAN G: CATATAN PENGEMBANGAN ──
Isi dengan:
- Catatan kontekstualisasi CP untuk bidang ${namaKeahlian}
- 2–3 tantangan nyata yang mungkin dihadapi guru beserta solusinya

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PANDUAN NADA DAN GAYA PENULISAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Gaya bahasa  : formal-hangat (seperti panduan yang ditulis guru senior untuk rekan guru)
✓ Kalimat      : aktif, langsung, tidak bertele-tele
✓ Panjang CP   : setiap elemen 2–4 kalimat padat
✓ Keaslian     : hindari kalimat copy-paste template generik
✓ Nilai Islami : sisipkan secara organik — bukan dipaksakan
✓ Diksi        : pilih kata yang tepat dan bertenaga
`.trim();

  return { systemPrompt, userPrompt };
}

// ============================================================
//  FUNGSI PEMBANTU: _fallbackKonteks
//  Membuat konteks generik jika keahlian belum ada di kamus
// ============================================================
function _fallbackKonteks(programKeahlian, konsentrasiKeahlian) {
  const nama = konsentrasiKeahlian || programKeahlian;
  return {
    industri: `industri dan dunia usaha di bidang ${nama}`,
    produk_nyata: `produk dan layanan yang relevan dengan bidang ${nama}`,
    fenomena_ipas: [
      `fenomena alam yang berkaitan dengan proses kerja di bidang ${nama}`,
      `dinamika sosial dan ekonomi yang mempengaruhi industri ${nama}`,
      `perubahan energi dan zat dalam proses produksi di bidang ${nama}`,
    ],
    konteks_lokal: `potensi lokal Purbalingga yang relevan dengan bidang ${nama}`,
    dudi_mitra: `perusahaan dan UMKM lokal di bidang ${nama} di wilayah Purbalingga-Banyumas`,
  };
}

// ============================================================
//  FUNGSI UTAMA: generateCP
//  Memanggil Claude API dan mengembalikan teks CP lengkap
// ============================================================

/**
 * Memanggil Claude API untuk menghasilkan dokumen CP.
 *
 * @param {Object} input - Sama dengan parameter buildCPPrompt
 * @returns {Promise<string>} - Teks CP lengkap yang dihasilkan
 */
async function generateCP(input) {
  const { systemPrompt, userPrompt } = buildCPPrompt(input);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();

  const fullText = data.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return fullText;
}

// ============================================================
//  CONTOH PENGGUNAAN
// ============================================================

/*
// Contoh 1 — Rekayasa Perangkat Lunak
const hasilCP = await generateCP({
  programKeahlian: "Teknologi Informasi",
  konsentrasiKeahlian: "Rekayasa Perangkat Lunak",
  fase: "E",
  kelas: "X",
  semester: "Ganjil dan Genap",
  tahunPelajaran: "2025/2026",
  namaGuru: "Fayyad Malik, S.Pd.",
  nipGuru: "198XXXXXXXX",
  alokasiWaktu: "5 JP per minggu × 36 minggu = 180 JP",
  nilaiKarakter: "Islami dan berjiwa entrepreneur",
  konteksLokalTambahan: "pengembangan aplikasi kasir untuk UMKM sentra industri bulu mata Purbalingga",
  dimensiProfilLulusan: ["Penalaran Kritis", "Kreativitas", "Kolaborasi"],
});
console.log(hasilCP);

// Contoh 2 — Akuntansi dan Keuangan Lembaga
const hasilCP2 = await generateCP({
  programKeahlian: "Bisnis dan Manajemen",
  konsentrasiKeahlian: "Akuntansi dan Keuangan Lembaga",
  fase: "E",
  kelas: "X",
  tahunPelajaran: "2026/2027",
  nilaiKarakter: "jujur, amanah, dan berjiwa entrepreneur",
  konteksLokalTambahan: "analisis laporan keuangan koperasi simpan pinjam di Purbalingga",
});
console.log(hasilCP2);
*/

// ============================================================
//  EXPORT
// ============================================================
export {
  generateCP,
  buildCPPrompt,
  KONTEKS_KEAHLIAN,
  ELEMEN_CP_RESMI,
};
