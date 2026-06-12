/**
 * MODUL AJAR AI GENERATOR
 * Prompt Builder untuk Poin C (Rancangan Pembelajaran Deep Learning)
 * dan Poin D (Skenario / Langkah-langkah Pembelajaran)
 *
 * SMK Muhammadiyah 3 Purbalingga — Kurikulum Merdeka
 */

// ============================================================
// BAGIAN 1: SYSTEM PROMPT (Instruksi Tetap untuk Model AI)
// ============================================================

const SYSTEM_PROMPT = `
Kamu adalah seorang pengembang kurikulum profesional dan pakar pedagogis Kurikulum Merdeka
di tingkat SMK. Kamu ahli dalam pendekatan Deep Learning (Mindful–Meaningful–Joyful),
Project Based Learning, serta kontekstualisasi pembelajaran berbasis kearifan lokal.

Kamu bekerja untuk SMK Muhammadiyah 3 Purbalingga yang memiliki ciri khas:
- Pendekatan Deep Learning (Mindful, Meaningful, Joyful Learning)
- Integrasi nilai-nilai Islami dan kemuhammadiyahan
- Kontekstualisasi dengan kearifan lokal Purbalingga
- Orientasi pada dunia kerja dan industri sesuai program keahlian

ATURAN OUTPUT:
1. Selalu hasilkan dalam format tabel Markdown yang rapi dan lengkap, sesuai template.
2. Setiap isian harus SPESIFIK dan KONTEKSTUAL — hindari kalimat generik/template kosong.
3. Gunakan referensi nyata yang relevan: nama tempat di Purbalingga, industri lokal,
   tradisi/budaya lokal, ayat Al-Qur'an atau hadits yang relevan.
4. Semua kegiatan pembelajaran harus mencerminkan identitas program keahlian peserta didik.
5. Alokasi waktu di Poin D harus presisi dan totalnya harus tepat sesuai JP yang diberikan.
6. Bahasa: Bahasa Indonesia formal dan baku, sesuai standar dokumen kurikulum resmi.
`.trim();


// ============================================================
// BAGIAN 2: FUNGSI BUILDER PROMPT UTAMA
// ============================================================

/**
 * Membangun prompt lengkap untuk generate Poin C dan D Modul Ajar.
 *
 * @param {Object} konteks - Data konteks modul ajar dari form input
 * @param {string} konteks.namaMataPelajaran       - Nama mata pelajaran (e.g. "Akuntansi Perbankan Syariah")
 * @param {string} konteks.programKeahlian         - Program keahlian (e.g. "Layanan Perbankan Syariah")
 * @param {string} konteks.konsentrasiKeahlian      - Konsentrasi keahlian jika ada
 * @param {string} konteks.faseKelas               - Fase dan kelas (e.g. "Fase F / Kelas XII")
 * @param {string} konteks.semester                - Semester (e.g. "Genap")
 * @param {string} konteks.judulModul              - Judul modul ajar
 * @param {string} konteks.tujuanPembelajaran      - Tujuan Pembelajaran (TP) lengkap
 * @param {string} konteks.indikatorKetercapaian   - IKTP / indikator TP
 * @param {string} konteks.capaianPembelajaran     - CP / elemen CP yang dirujuk
 * @param {number} konteks.jumlahPertemuan         - Jumlah pertemuan (e.g. 2)
 * @param {number} konteks.jpPerPertemuan          - JP per pertemuan (e.g. 5)
 * @param {number} konteks.menitPerJP              - Menit per JP (e.g. 45)
 * @param {string} konteks.kearifanLokal           - Kearifan lokal / konteks Purbalingga yang relevan
 * @param {string} konteks.industriLokal           - Industri / dunia kerja lokal yang relevan
 * @param {string} konteks.modelPembelajaran       - Model pembelajaran (e.g. "Discovery Learning", "PBL", "PjBL")
 * @param {string} konteks.produkBelajar           - Produk/hasil belajar yang diharapkan
 * @param {string[]} konteks.nilaiIslami           - Array ayat/hadits/nilai islami yang relevan
 * @param {string} [konteks.catatanTambahan]       - Catatan khusus dari guru (opsional)
 * @returns {string} - Prompt lengkap siap dikirim ke API AI
 */
function buildPromptPoinCdanD(konteks) {
  const {
    namaMataPelajaran,
    programKeahlian,
    konsentrasiKeahlian,
    faseKelas,
    semester,
    judulModul,
    tujuanPembelajaran,
    indikatorKetercapaian,
    capaianPembelajaran,
    jumlahPertemuan,
    jpPerPertemuan,
    menitPerJP,
    kearifanLokal,
    industriLokal,
    modelPembelajaran,
    produkBelajar,
    nilaiIslami,
    catatanTambahan,
  } = konteks;

  const totalMenit = jpPerPertemuan * menitPerJP;
  const nilaiIslamiStr = Array.isArray(nilaiIslami)
    ? nilaiIslami.join('; ')
    : nilaiIslami;

  // ---- Bagian konteks yang diinjeksikan ke prompt ----
  const konteksBlock = `
## KONTEKS MODUL AJAR

| Komponen                  | Keterangan |
|---------------------------|------------|
| Mata Pelajaran            | ${namaMataPelajaran} |
| Program Keahlian          | ${programKeahlian} |
| Konsentrasi Keahlian      | ${konsentrasiKeahlian || '-'} |
| Fase / Kelas              | ${faseKelas} |
| Semester                  | ${semester} |
| Judul Modul               | ${judulModul} |
| Capaian Pembelajaran (CP) | ${capaianPembelajaran} |
| Tujuan Pembelajaran (TP)  | ${tujuanPembelajaran} |
| Indikator Ketercapaian TP | ${indikatorKetercapaian} |
| Model Pembelajaran        | ${modelPembelajaran} |
| Produk / Hasil Belajar    | ${produkBelajar} |
| Jumlah Pertemuan          | ${jumlahPertemuan} pertemuan |
| JP per Pertemuan          | ${jpPerPertemuan} JP (${totalMenit} menit) |
| Kearifan Lokal Relevan    | ${kearifanLokal} |
| Industri / Dunia Kerja    | ${industriLokal} |
| Nilai Islami               | ${nilaiIslamiStr} |
${catatanTambahan ? `| Catatan Tambahan          | ${catatanTambahan} |` : ''}
`.trim();

  // ---- Instruksi generate Poin C ----
  const instruksiPoinC = `
## TUGAS 1: GENERATE POIN C — RANCANGAN PEMBELAJARAN (PENDEKATAN DEEP LEARNING)

Buatlah Poin C yang terdiri dari tiga sub-bagian berikut. Setiap sub-bagian disajikan
dalam format **tabel dua kolom**: | Aspek | Uraian |

---

### C.1 MINDFUL LEARNING — Pembelajaran Penuh Kesadaran

Isi empat aspek berikut secara SPESIFIK dan KONTEKSTUAL:

1. **Apersepsi & Aktivasi Pengetahuan Awal**
   - Gunakan stimulus visual/audio yang mengaitkan dengan fenomena NYATA dalam bidang
     "${programKeahlian}" atau "${konsentrasiKeahlian}" di konteks Purbalingga.
   - Sebutkan contoh konkret (nama tempat, kegiatan industri, atau fenomena lokal).
   - Deskripsikan aktivitas peserta didik (bukan hanya guru) secara detail.

2. **Pertanyaan Pemantik**
   - Buat 3 pertanyaan pemantik yang bertingkat (dari konkret → analitis → reflektif).
   - Pertanyaan harus mengaitkan materi "${namaMataPelajaran}" dengan kehidupan nyata
     di "${industriLokal}" atau "${kearifanLokal}".
   - Satu pertanyaan harus mengandung dimensi nilai Islami.

3. **Penetapan Tujuan Bersama**
   - Deskripsikan prosedur guru dan peserta didik dalam menyepakati tujuan pembelajaran.
   - Kaitkan dengan TP: "${tujuanPembelajaran}".

4. **Strategi Refleksi Akhir**
   - Pilih dan jelaskan teknik refleksi yang sesuai (3-2-1, Think-Pair-Share, Exit Ticket, dll).
   - Refleksi harus relevan dengan produk belajar: "${produkBelajar}".

---

### C.2 MEANINGFUL LEARNING — Pembelajaran Bermakna

Isi empat aspek berikut secara SPESIFIK dan KONTEKSTUAL:

1. **Koneksi dengan Dunia Nyata / Industri**
   - Kaitkan materi secara EKSPLISIT dengan "${industriLokal}" sebagai dunia kerja nyata
     peserta didik program "${programKeahlian}".
   - Sebutkan contoh penerapan nyata konsep/materi dalam pekerjaan sehari-hari di industri tersebut.

2. **Koneksi Antar Mata Pelajaran**
   - Identifikasi minimal 3 mata pelajaran lain yang berkaitan, beserta aspek keterkaitannya.

3. **Koneksi dengan Kearifan Lokal Purbalingga**
   - Kaitkan materi dengan "${kearifanLokal}" secara bermakna.
   - Jelaskan bagaimana kearifan lokal ini relevan dengan kompetensi yang dipelajari.

4. **Produk / Hasil Belajar Bermakna**
   - Deskripsikan "${produkBelajar}" secara detail: format, isi, kriteria, dan nilai gunanya
     bagi peserta didik dalam konteks industri nyata.

---

### C.3 JOYFUL LEARNING — Pembelajaran yang Menyenangkan

Isi empat aspek berikut secara SPESIFIK dan KONTEKSTUAL:

1. **Model Pembelajaran**
   - Jelaskan penerapan "${modelPembelajaran}" secara spesifik dalam konteks materi
     "${namaMataPelajaran}" — bukan definisi umum, tapi LANGKAH KONKRET penerapannya.

2. **Variasi Aktivitas**
   - Rancang 4 variasi aktivitas (individu, berpasangan, kelompok, presentasi) yang
     sesuai dengan karakteristik program keahlian "${programKeahlian}".
   - Setiap aktivitas harus memiliki nama/metode yang jelas dan menyenangkan.

3. **Diferensiasi Pembelajaran**
   - Rancang diferensiasi Konten, Proses, dan Produk yang sesuai untuk:
     a) Peserta didik dengan kemampuan di bawah rata-rata
     b) Peserta didik rata-rata
     c) Peserta didik di atas rata-rata (akselerasi)
   - Kaitkan dengan karakteristik kompetensi "${programKeahlian}".

4. **Integrasi Nilai Islami (Muhammadiyah)**
   - Integrasikan nilai: ${nilaiIslamiStr}
   - Jelaskan bagaimana nilai Islami tersebut dikaitkan SECARA ORGANIK (bukan sekadar
     pembuka doa) ke dalam aktivitas pembelajaran, diskusi, atau produk belajar.
`.trim();

  // ---- Instruksi generate Poin D ----
  const pertemuanInstruksi = buildPertemuanInstruksi(
    jumlahPertemuan,
    totalMenit,
    konteks
  );

  const instruksiPoinD = `
## TUGAS 2: GENERATE POIN D — SKENARIO / LANGKAH-LANGKAH PEMBELAJARAN

Buatlah skenario pembelajaran untuk SETIAP pertemuan dalam format **tabel tiga kolom**:

| Fase (Waktu) | Kegiatan Guru | Kegiatan Peserta Didik |

KETENTUAN WAJIB:
- Total waktu setiap pertemuan HARUS TEPAT ${totalMenit} menit.
- Setiap pertemuan memiliki 3 fase: PENDAHULUAN, INTI, PENUTUP.
- Alokasi waktu standar: Pendahuluan ±${Math.round(totalMenit * 0.13)} mnt |
  Inti ±${Math.round(totalMenit * 0.73)} mnt | Penutup ±${Math.round(totalMenit * 0.13)} mnt
  (sesuaikan agar total pas ${totalMenit} menit).
- Setiap kegiatan guru HARUS punya pasangan kegiatan peserta didik yang simetris.
- Setiap fase minimal berisi 5 langkah kegiatan bernomor.
- Cantumkan label [MINDFUL], [MEANINGFUL], atau [JOYFUL] pada langkah yang relevan.
- Integrasikan model pembelajaran "${modelPembelajaran}" secara eksplisit di fase INTI.
- Sertakan referensi LKPD, nama aktivitas, dan produk yang relevan.
- Setiap pertemuan harus memiliki topik/fokus yang berbeda dan saling melengkapi.

${pertemuanInstruksi}

CATATAN FORMAT SKENARIO:
- Penomoran kegiatan: 1., 2., 3., dst. (bukan bullet)
- Gunakan kalimat aktif dan operasional
- Nama kegiatan/metode ditulis dengan huruf kapital (e.g. GALLERY WALK, THINK-PAIR-SHARE)
- Setiap pertemuan diawali dengan header:
  "PERTEMUAN KE-[N] | Alokasi Waktu: [X] JP ([Y] menit)"
  dan subjudul topik pertemuan dalam format italic bold.
`.trim();

  // ---- Gabungkan semua bagian prompt ----
  const fullPrompt = `
${konteksBlock}

---

${instruksiPoinC}

---

${instruksiPoinD}

---

## FORMAT OUTPUT AKHIR

Hasilkan output dalam urutan berikut:
1. **C. RANCANGAN PEMBELAJARAN — PENDEKATAN DEEP LEARNING**
   - C.1 MINDFUL LEARNING
   - C.2 MEANINGFUL LEARNING
   - C.3 JOYFUL LEARNING
2. **D. SKENARIO / LANGKAH-LANGKAH PEMBELAJARAN**
   - Pertemuan ke-1
   - Pertemuan ke-2
   ${jumlahPertemuan > 2 ? Array.from({length: jumlahPertemuan - 2}, (_, i) => `- Pertemuan ke-${i + 3}`).join('\n   ') : ''}

Pastikan output langsung dimulai dari heading "C. RANCANGAN PEMBELAJARAN" tanpa preamble.
`.trim();

  return fullPrompt;
}


// ============================================================
// BAGIAN 3: FUNGSI HELPER — INSTRUKSI PER PERTEMUAN
// ============================================================

/**
 * Membangun deskripsi instruksi untuk setiap pertemuan di Poin D.
 * Membuat topik pertemuan yang progresif dan kontekstual.
 */
function buildPertemuanInstruksi(jumlahPertemuan, totalMenit, konteks) {
  const {
    tujuanPembelajaran,
    modelPembelajaran,
    namaMataPelajaran,
    industriLokal,
    kearifanLokal,
  } = konteks;

  const alurPertemuan = {
    1: {
      fokus: 'Pembukaan & Eksplorasi Konsep',
      deskripsi: `Pengenalan materi dan eksplorasi konsep dasar melalui stimulus kontekstual.
        Peserta didik mulai membangun pemahaman awal terkait TP.
        Model: bagian PEMBUKA dari "${modelPembelajaran}".`,
    },
    2: {
      fokus: 'Analisis Mendalam & Penerapan',
      deskripsi: `Pendalaman materi dan penerapan konsep ke konteks nyata "${industriLokal}".
        Peserta didik mengerjakan tugas analisis/proyek utama.
        Model: bagian PENGEMBANGAN dari "${modelPembelajaran}".`,
    },
    3: {
      fokus: 'Elaborasi & Kreasi Produk',
      deskripsi: `Peserta didik mengelaborasi pemahaman dan mulai menyusun produk belajar.
        Kaitkan dengan "${kearifanLokal}" sebagai konteks penerapan.
        Model: bagian ELABORASI/KREASI dari "${modelPembelajaran}".`,
    },
    4: {
      fokus: 'Presentasi, Evaluasi & Refleksi',
      deskripsi: `Presentasi produk belajar, umpan balik antar teman, dan refleksi akhir TP.
        Penilaian formatif dan konfirmasi ketercapaian TP.`,
    },
  };

  let instruksi = '';
  for (let i = 1; i <= jumlahPertemuan; i++) {
    const pertemuan = alurPertemuan[i] || {
      fokus: `Pendalaman Lanjutan (Pertemuan ${i})`,
      deskripsi: `Lanjutan eksplorasi dan pendalaman materi "${namaMataPelajaran}".`,
    };

    instruksi += `
### Pertemuan ke-${i} (${totalMenit} menit)
**Fokus:** ${pertemuan.fokus}
**Panduan konten:**
${pertemuan.deskripsi}
**Kaitkan dengan TP:** ${tujuanPembelajaran}
`;
  }

  return instruksi.trim();
}


// ============================================================
// BAGIAN 4: FUNGSI PEMANGGIL API (Claude / OpenAI compatible)
// ============================================================

/**
 * Memanggil Anthropic Claude API untuk generate Poin C dan D.
 * Gunakan di backend Node.js atau browser dengan API proxy.
 *
 * @param {Object} konteks - Data konteks modul ajar (lihat buildPromptPoinCdanD)
 * @param {Object} [options] - Konfigurasi tambahan
 * @param {string} [options.model]       - Model AI (default: claude-sonnet-4-6)
 * @param {number} [options.maxTokens]   - Maks token output (default: 8000)
 * @param {Function} [options.onStream]  - Callback streaming (opsional)
 * @returns {Promise<string>} - Hasil generate dalam format Markdown
 */
async function generatePoinCdanD(konteks, options = {}) {
  const {
    model = 'claude-sonnet-4-6',
    maxTokens = 8000,
    onStream = null,
  } = options;

  const userPrompt = buildPromptPoinCdanD(konteks);

  const requestBody = {
    model,
    max_tokens: maxTokens,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // API key dihandle oleh proxy/backend — JANGAN taruh API key di frontend
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API Error ${response.status}: ${errorData?.error?.message || response.statusText}`
      );
    }

    const data = await response.json();

    // Gabungkan semua text block dari response
    const result = data.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    return result;
  } catch (error) {
    console.error('[generatePoinCdanD] Error:', error);
    throw error;
  }
}


// ============================================================
// BAGIAN 5: CONTOH DATA KONTEKS (untuk testing & demo)
// ============================================================

/**
 * Contoh konteks untuk mata pelajaran Layanan Perbankan Syariah
 * (sesuai pengembangan kurikulum Fase F yang sedang dikerjakan)
 */
const CONTOH_KONTEKS_PERBANKAN_SYARIAH = {
  namaMataPelajaran: 'Akuntansi dan Keuangan Lembaga Syariah',
  programKeahlian: 'Akuntansi dan Keuangan Lembaga',
  konsentrasiKeahlian: 'Layanan Perbankan Syariah',
  faseKelas: 'Fase F / Kelas XI',
  semester: 'Ganjil',
  judulModul:
    'Produk Penghimpunan Dana Bank Syariah: Tabungan Wadiah dan Mudharabah dalam Konteks Ekonomi Lokal Purbalingga',
  capaianPembelajaran:
    'Peserta didik mampu memahami karakteristik produk penghimpunan dana bank syariah, membandingkan akad wadiah dan mudharabah, serta menganalisis penerapannya dalam layanan perbankan syariah kontekstual.',
  tujuanPembelajaran:
    'TP-03: Peserta didik mampu menjelaskan perbedaan produk tabungan wadiah dan mudharabah pada bank syariah, menghitung bagi hasil tabungan mudharabah, serta menganalisis kesesuaiannya dengan prinsip syariah secara lisan dan tertulis dengan tepat.',
  indikatorKetercapaian:
    'IKTP 3.1: Peserta didik dapat membedakan karakteristik tabungan wadiah dan mudharabah dari minimal 3 aspek. IKTP 3.2: Peserta didik dapat menghitung bagi hasil tabungan mudharabah dengan benar menggunakan metode harian/bulanan.',
  jumlahPertemuan: 2,
  jpPerPertemuan: 5,
  menitPerJP: 45,
  modelPembelajaran: 'Problem Based Learning (PBL)',
  produkBelajar:
    'Laporan Analisis Produk Tabungan Syariah: dokumen 2–3 halaman yang membandingkan produk tabungan wadiah dan mudharabah dari bank syariah lokal (BSI KCP Purbalingga atau BPR Syariah setempat), dilengkapi simulasi perhitungan bagi hasil.',
  kearifanLokal:
    'Tradisi arisan dan simpan pinjam masyarakat Purbalingga (khususnya komunitas pengrajin knalpot Purbalingga dan pedagang Pasar Segamas) sebagai analogi sistem penghimpunan dana syariah; nilai gotong royong dan amanah dalam pengelolaan uang bersama.',
  industriLokal:
    'Bank Syariah Indonesia (BSI) KCP Purbalingga, BPR Syariah Buana Mitra Perwira Purbalingga, Koperasi Syariah lokal; industri UMKM pengrajin knalpot dan bulu mata sebagai nasabah potensial produk tabungan syariah.',
  nilaiIslami: [
    'QS. Al-Baqarah: 283 — tentang amanah dalam mu\'amalah (akad wadiah)',
    'QS. Al-Baqarah: 275 — larangan riba sebagai landasan produk tabungan syariah',
    'Hadits: "Bayarlah upah pekerja sebelum kering keringatnya" — kaitkan dengan prinsip keadilan bagi hasil mudharabah',
  ],
  catatanTambahan:
    'Modul ini terintegrasi dengan insersi kurikulum Koperasi Provinsi dan Cinta Rupiah. Sertakan relevansi koperasi simpan pinjam syariah dan literasi keuangan dalam desain pembelajaran.',
};

/**
 * Contoh konteks generik untuk mata pelajaran lain
 * (dapat dimodifikasi sesuai kebutuhan)
 */
const CONTOH_KONTEKS_GENERIK = {
  namaMataPelajaran: '[ISI NAMA MAPEL]',
  programKeahlian: '[ISI PROGRAM KEAHLIAN]',
  konsentrasiKeahlian: '[ISI KONSENTRASI KEAHLIAN, jika ada]',
  faseKelas: 'Fase F / Kelas XI',
  semester: 'Ganjil',
  judulModul: '[ISI JUDUL MODUL AJAR]',
  capaianPembelajaran: '[ISI CP ATAU ELEMEN CP YANG DIRUJUK]',
  tujuanPembelajaran: '[ISI TUJUAN PEMBELAJARAN LENGKAP]',
  indikatorKetercapaian: '[ISI IKTP 1, IKTP 2, dst.]',
  jumlahPertemuan: 2,
  jpPerPertemuan: 5,
  menitPerJP: 45,
  modelPembelajaran: '[ISI MODEL: PBL / PjBL / Discovery / Inquiry / dll]',
  produkBelajar: '[ISI DESKRIPSI PRODUK/HASIL BELAJAR]',
  kearifanLokal:
    '[ISI KEARIFAN LOKAL PURBALINGGA YANG RELEVAN: tradisi, tempat, profesi, dll]',
  industriLokal:
    '[ISI INDUSTRI / DUNIA KERJA LOKAL: nama perusahaan, jenis usaha, dll]',
  nilaiIslami: ['[ISI AYAT/HADITS/NILAI ISLAMI YANG RELEVAN]'],
  catatanTambahan: '[OPSIONAL: catatan khusus untuk generator]',
};


// ============================================================
// BAGIAN 6: EKSPOR MODUL
// ============================================================

module.exports = {
  SYSTEM_PROMPT,
  buildPromptPoinCdanD,
  generatePoinCdanD,
  CONTOH_KONTEKS_PERBANKAN_SYARIAH,
  CONTOH_KONTEKS_GENERIK,
};


// ============================================================
// BAGIAN 7: QUICK TEST (jalankan langsung jika diperlukan)
// ============================================================

/**
 * Untuk uji coba prompt tanpa memanggil API:
 *
 *   node modulAjarPromptGenerator.js
 *
 * Akan mencetak prompt lengkap ke console.
 */
if (require.main === module) {
  const promptPreview = buildPromptPoinCdanD(CONTOH_KONTEKS_PERBANKAN_SYARIAH);
  console.log('='.repeat(70));
  console.log('PREVIEW SYSTEM PROMPT:');
  console.log('='.repeat(70));
  console.log(SYSTEM_PROMPT);
  console.log('\n' + '='.repeat(70));
  console.log('PREVIEW USER PROMPT (Poin C & D):');
  console.log('='.repeat(70));
  console.log(promptPreview);
  console.log('\n[Total karakter prompt:', promptPreview.length, ']');
}
