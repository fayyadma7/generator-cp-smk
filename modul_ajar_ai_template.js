/**
 * ============================================================
 * TEMPLATE PROMPT AI — GENERATOR MODUL AJAR
 * Berbasis: Modul Ajar IPAS TP-01 SMK Muhammadiyah 3 Purbalingga
 * Kurikulum Merdeka | Pendekatan Deep Learning
 * ============================================================
 *
 * PETUNJUK PENGGUNAAN:
 * Setiap field memiliki dua properti:
 *   - `value`  : Nilai default / contoh dari modul asli
 *   - `prompt` : Instruksi kepada AI tentang cara mengisi field ini
 *
 * Kirimkan seluruh objek `MODULE_SCHEMA` ke AI bersama data input
 * pengguna (nama sekolah, mata pelajaran, kelas, dll).
 * AI wajib mengisi setiap `value` berdasarkan `prompt`-nya.
 * ============================================================
 */

// ─────────────────────────────────────────────────────────────
// SYSTEM PROMPT — dikirim sebagai peran "system" ke AI
// ─────────────────────────────────────────────────────────────
export const SYSTEM_PROMPT = `
Kamu adalah asisten ahli pedagogi Indonesia yang berspesialisasi dalam
penyusunan Modul Ajar Kurikulum Merdeka untuk jenjang SMK.
Kamu memahami pendekatan Deep Learning (Mindful, Meaningful, Joyful Learning),
struktur Capaian Pembelajaran Fase E, dan prinsip penilaian berbasis kompetensi.

ATURAN WAJIB:
1. Setiap output harus kontekstual dengan lokasi sekolah, program keahlian,
   dan kondisi sosial-budaya setempat yang diberikan pengguna.
2. Gunakan bahasa Indonesia formal dan baku.
3. Integrasikan nilai Profil Pelajar Pancasila secara alami, bukan sekadar daftar.
4. Untuk sekolah berbasis Islam/Muhammadiyah, tambahkan integrasi nilai Islami
   yang relevan (ayat Al-Qur'an, nilai amanah, khalifah) HANYA jika diminta.
5. Setiap aktivitas pembelajaran harus realistis dan dapat dilaksanakan
   dengan sumber daya yang tersedia di SMK daerah.
6. Pastikan rubrik penilaian memiliki deskriptor yang spesifik dan terukur,
   bukan deskriptor yang ambigu.
7. Output dikembalikan dalam format JSON sesuai skema yang diberikan.
   Jangan tambahkan komentar atau teks di luar JSON.
`;

// ─────────────────────────────────────────────────────────────
// USER PROMPT BUILDER — fungsi untuk membangun prompt pengguna
// ─────────────────────────────────────────────────────────────
/**
 * Bangun prompt pengguna berdasarkan input dari form.
 * @param {Object} userInput - Data yang diisi oleh pengguna di form generator
 * @returns {string} - Prompt siap kirim ke AI
 */
export function buildUserPrompt(userInput) {
  return `
Buatkan Modul Ajar lengkap berdasarkan data berikut:

INPUT PENGGUNA:
${JSON.stringify(userInput, null, 2)}

Isi setiap field dalam skema JSON di bawah ini.
Ikuti instruksi pada setiap field "prompt" secara seksama.
Kembalikan HANYA objek JSON tanpa teks tambahan.

SKEMA YANG HARUS DIISI:
${JSON.stringify(MODULE_SCHEMA, null, 2)}
  `;
}

// ─────────────────────────────────────────────────────────────
// SKEMA UTAMA — Struktur Modul Ajar dengan Prompt per Field
// ─────────────────────────────────────────────────────────────
export const MODULE_SCHEMA = {

  // ══════════════════════════════════════════════
  // BAGIAN A — IDENTITAS MODUL AJAR
  // ══════════════════════════════════════════════
  identitas: {
    _section: "A. IDENTITAS MODUL AJAR",

    nama_mata_pelajaran: {
      value: "Mata Pelajaran (Contoh: Matematika / IPAS / dll)",
      prompt: `Tulis nama mata pelajaran lengkap sesuai nomenklatur Kurikulum Merdeka.
               Gunakan nama resmi dari Kepmendikbudristek.
               Contoh: "Pendidikan Pancasila".`
    },

    program_keahlian: {
      value: "Semua Program Keahlian",
      prompt: `Isi dengan program keahlian spesifik yang relevan dengan modul ini.
               Jika modul berlaku lintas program, tulis "Semua Program Keahlian".
               Jika spesifik, sebutkan contohnya: "Teknik Komputer dan Jaringan".`
    },

    fase_kelas: {
      value: "Fase E / Kelas X",
      prompt: `Tentukan fase dan kelas sesuai Kurikulum Merdeka.
               Format: "Fase [E/F] / Kelas [X/XI/XII]".
               Fase E = Kelas X, Fase F = Kelas XI–XII.`
    },

    semester: {
      value: "Ganjil",
      prompt: `Tulis "Ganjil" atau "Genap" sesuai penempatan modul dalam semester berjalan.`
    },

    tahun_pelajaran: {
      value: "2025/2026",
      prompt: `Isi tahun pelajaran dengan format "YYYY/YYYY", misalnya "2025/2026".`
    },

    judul_modul: {
      value: "Judul Modul Kontekstual Sesuai Topik",
      prompt: `Buat judul modul yang:
               (1) Mencerminkan topik utama secara spesifik dan menarik,
               (2) Mengandung konteks lokal daerah sekolah jika relevan,
               (3) Tidak terlalu panjang (maks. 20 kata),
               (4) Menggunakan diksi yang memotivasi peserta didik.
               Hindari judul generik seperti "Modul Pelajaran Kelas X".`
    },

    nomor_modul: {
      value: "MA-MAPEL-01",
      prompt: `Generate kode unik modul dengan format: "MA-[KODE_MAPEL]-[NOMOR_URUT]".
               Kode mapel: MTK, BIN, BIG, PKN, sesuai mata pelajaran.
               Nomor urut: 01, 02, dst. berdasarkan urutan ATP.`
    },

    nomor_tp: {
      value: "TP-01",
      prompt: `Sebutkan nomor Tujuan Pembelajaran yang dirujuk modul ini.
               Format: "TP-[nomor urut dalam ATP]". Bisa lebih dari satu jika lintas TP.`
    },

    alokasi_waktu: {
      value: "10 JP (2 Pertemuan × 5 JP @ 225 menit)",
      prompt: `Hitung dan tulis alokasi waktu total dengan format:
               "[Total JP] JP ([jumlah pertemuan] Pertemuan × [JP/pertemuan] JP @ [menit] menit)".
               Sesuaikan dengan beban belajar SMK: 1 JP = 45 menit.
               Pastikan total JP selaras dengan kompleksitas TP yang dituju.`
    },

    pertemuan_ke: {
      value: "Pertemuan ke-1 s.d. ke-2",
      prompt: `Tulis rentang pertemuan yang dicakup modul ini dalam ATP.
               Format: "Pertemuan ke-[awal] s.d. ke-[akhir]".`
    }
  },

  // ══════════════════════════════════════════════
  // BAGIAN B — KERANGKA KURIKULUM
  // ══════════════════════════════════════════════
  kerangka_kurikulum: {
    _section: "B. KERANGKA KURIKULUM",

    capaian_pembelajaran: {
      value: "Pada akhir Fase, murid memiliki kemampuan sesuai elemen capaian pembelajaran.",
      prompt: `Salin verbatim Capaian Pembelajaran (CP) resmi dari dokumen Kemendikbudristek
               yang sesuai dengan mata pelajaran dan fase yang dipilih.
               Jangan parafrase atau modifikasi — CP adalah dokumen resmi.
               Sumber: Kepmendikbudristek No. 958/M/2020 atau pembaruan terbarunya.`
    },

    elemen_cp: {
      value: ["Elemen 1", "Elemen 2"],
      prompt: `Daftarkan elemen-elemen CP yang relevan dengan modul ini.
               Ambil langsung dari dokumen CP resmi, bukan dibuat sendiri.
               Pilih hanya elemen yang benar-benar tercakup dalam modul ini.
               Format: array string.`
    },

    tujuan_pembelajaran: {
      value: "TP-01: Peserta didik mampu menjelaskan materi sesuai konteks lokal secara lisan maupun tulisan dengan tepat dan sistematis.",
      prompt: `Rumuskan Tujuan Pembelajaran (TP) yang:
               (1) Dimulai dengan "Peserta didik mampu..." atau "Peserta didik dapat...",
               (2) Mengandung kompetensi (kata kerja operasional), konten (materi), dan konteks (situasi/produk),
               (3) Mengacu pada salah satu atau beberapa elemen CP,
               (4) Terkontekskan dengan lingkungan lokal sekolah (daerah/industri setempat),
               (5) Dapat diukur ketercapaiannya.
               Gunakan taksonomi Bloom versi revisi: C1–C6.`
    },

    indikator_ketercapaian_tp: {
      value: [
        "IKTP 1.1: Peserta didik dapat menyebutkan materi secara lisan dengan benar.",
        "IKTP 1.2: Peserta didik dapat mengaplikasikan materi ke dalam tugas praktikum secara runtut."
      ],
      prompt: `Buat 2–4 Indikator Ketercapaian Tujuan Pembelajaran (IKTP) yang:
               (1) Merupakan penjabaran spesifik dan terukur dari TP,
               (2) Menggunakan kata kerja operasional yang lebih konkret dari TP,
               (3) Mencakup aspek pengetahuan DAN keterampilan,
               (4) Berisi kriteria minimum yang jelas (misalnya: "minimal 5", "dengan benar", "secara runtut"),
               (5) Diurutkan dari level kognitif rendah ke tinggi (LOTS ke HOTS).
               Format: array string dengan kode "IKTP [nomor TP].[nomor indikator]".`
    },

    posisi_dalam_atp: {
      value: "Urutan ke-1 dalam Alur Tujuan Pembelajaran. Merupakan modul pembuka yang membangun fondasi konseptual. Setelah modul ini: TP-02.",
      prompt: `Jelaskan posisi modul ini dalam Alur Tujuan Pembelajaran (ATP) dengan menyebutkan:
               (1) Urutan ke berapa dalam ATP semester ini,
               (2) Peran modul (fondasi/pendalaman/penerapan/proyek),
               (3) Prasyarat: modul/TP sebelumnya yang harus dikuasai dulu,
               (4) Kelanjutan: modul/TP yang mengikuti setelah ini.`
    },

    dimensi_profil_lulusan: {
      value: [
        "Keimanan & Ketakwaan → Mengagumi ciptaan Allah",
        "Penalaran Kritis → Mengidentifikasi dan memecahkan masalah"
      ],
      prompt: `Pilih 2–4 dimensi Profil Pelajar Pancasila (atau Profil Lulusan SMK) yang
               benar-benar dikembangkan dalam modul ini, bukan sekadar dicantumkan.
               Untuk setiap dimensi, tulis kata hubung "→" diikuti penjelasan konkret
               tentang bagaimana dimensi itu muncul dalam aktivitas pembelajaran.
               Dimensi PPP: Beriman, Berkebinekaan, Bergotong Royong,
               Mandiri, Bernalar Kritis, Kreatif.
               Jangan cantumkan dimensi yang tidak benar-benar terwujud dalam kegiatan.`
    }
  },

  // ══════════════════════════════════════════════
  // BAGIAN C — RANCANGAN PEMBELAJARAN DEEP LEARNING
  // ══════════════════════════════════════════════
  rancangan_pembelajaran: {
    _section: "C. RANCANGAN PEMBELAJARAN — PENDEKATAN DEEP LEARNING",

    mindful_learning: {
      _subsection: "C.1 MINDFUL LEARNING — Pembelajaran Penuh Kesadaran",

      apersepsi: {
        value: "Guru menampilkan foto/video singkat fenomena lokal Purbalingga (banjir di Sungai Klawing, panen tembakau di lereng Gunung Slamet, atau kesibukan pekerja industri bulu mata). Peserta didik diminta berbagi pengalaman atau pengetahuan yang mereka miliki terkait fenomena tersebut dalam diskusi singkat 5 menit.",
        prompt: `Rancang kegiatan apersepsi yang:
                 (1) Menggunakan stimulus konkret dari lingkungan LOKAL sekolah
                     (tempat, industri, fenomena, tokoh daerah — bukan contoh umum),
                 (2) Berlangsung maksimal 10 menit,
                 (3) Mengaktivasi pengetahuan awal peserta didik (bukan langsung menjelaskan materi),
                 (4) Memancing rasa ingin tahu secara alami.
                 Gunakan media yang realistis tersedia di SMK daerah
                 (foto, video pendek, benda nyata, data lokal).`
      },

      pertanyaan_pemantik: {
        value: [
          "\"Fenomena apa yang sering kalian lihat di sekitar [nama daerah]? Apakah itu termasuk fenomena alam, sosial, atau keduanya?\"",
          "\"Mengapa [fenomena lokal] bisa menyebabkan [dampak lokal]?\"",
          "\"Bagaimana [nilai spiritual/moral] terhubung dengan tanggung jawab kita terhadap [isu lingkungan lokal]?\""
        ],
        prompt: `Buat 3 pertanyaan pemantik yang:
                 (1) Pertanyaan 1: Terbuka dan dekat dengan kehidupan sehari-hari peserta didik di daerah tersebut,
                 (2) Pertanyaan 2: Mendorong berpikir kausal/ilmiah tentang fenomena lokal spesifik,
                 (3) Pertanyaan 3: Mengaitkan materi dengan nilai moral, spiritual, atau sosial-budaya setempat,
                 (4) Semua pertanyaan menggunakan konteks lokal yang riil — sebutkan nama tempat/industri/tokoh nyata.
                 Hindari pertanyaan yang bisa dijawab "ya/tidak".
                 Gunakan tanda kutip untuk penulisan pertanyaan.`
      },

      penetapan_tujuan_bersama: {
        value: "Di awal pertemuan, guru menuliskan TP-01 di papan tulis, lalu mengajak peserta didik mendiskusikan 'apa yang ingin mereka pelajari' dan 'mengapa ini penting bagi kehidupan mereka'. Kesepakatan tujuan dicatat dalam jurnal belajar masing-masing peserta didik.",
        prompt: `Deskripsikan prosedur penetapan tujuan bersama yang:
                 (1) Melibatkan suara peserta didik secara aktif (bukan guru yang seluruhnya menentukan),
                 (2) Menghubungkan TP dengan relevansi personal atau karir peserta didik,
                 (3) Menghasilkan "komitmen belajar" yang dicatat/diingat peserta didik,
                 (4) Realistis dilakukan dalam 5–10 menit.`
      },

      strategi_refleksi: {
        value: "Teknik 3-2-1: di akhir setiap pertemuan, peserta didik menuliskan 3 hal yang dipelajari, 2 pertanyaan yang masih ingin dijawab, dan 1 cara mereka menerapkan ilmu ini dalam kehidupan sehari-hari.",
        prompt: `Pilih dan deskripsikan teknik refleksi akhir yang:
                 (1) Terstruktur dan spesifik (bukan sekadar "tulis kesan"),
                 (2) Mendorong metakognisi (peserta didik merefleksikan CARA belajarnya),
                 (3) Dapat dilakukan dalam 5–10 menit,
                 (4) Hasilnya bisa digunakan guru untuk perbaikan pembelajaran.
                 Opsi teknik: 3-2-1, Exit Ticket, PMI (Plus-Minus-Interesting),
                 One-Sentence Summary, Traffic Light Reflection, dll.
                 Jelaskan instruksi spesifik untuk teknik yang dipilih.`
      }
    },

    meaningful_learning: {
      _subsection: "C.2 MEANINGFUL LEARNING — Pembelajaran Bermakna",

      koneksi_dunia_nyata: {
        value: "Materi dikaitkan langsung dengan dua industri unggulan Purbalingga: (1) Industri bulu mata dan rambut palsu yang bergantung pada bahan baku dan kondisi lingkungan, (2) Pertanian lereng Gunung Slamet yang dipengaruhi iklim dan ekosistem. Peserta didik diajak menganalisis bagaimana fenomena alam berdampak pada mata pencaharian warga.",
        prompt: `Hubungkan materi dengan konteks dunia nyata yang SPESIFIK untuk daerah sekolah:
                 (1) Sebutkan minimal 2 industri/profesi/fenomena LOKAL yang relevan dengan materi,
                 (2) Jelaskan secara konkret bagaimana materi ini membantu memahami atau memecahkan
                     masalah di konteks tersebut,
                 (3) Jika memungkinkan, hubungkan dengan program keahlian peserta didik.
                 Gunakan nama industri, tempat, atau tokoh lokal yang nyata dan dapat diverifikasi.
                 Hindari contoh generik yang bisa berlaku di mana saja.`
      },

      koneksi_antar_mapel: {
        value: {
          "IPS (Geografi Sosial)": "dinamika masyarakat dan tata ruang",
          "Bahasa Indonesia": "penyusunan laporan pengamatan",
          "Matematika": "pembacaan data curah hujan dan tabel statistik sederhana"
        },
        prompt: `Identifikasi 2–4 mata pelajaran lain yang memiliki koneksi SUBSTANTIF dengan materi ini.
                 Untuk setiap koneksi, jelaskan secara konkret:
                 - Konsep/keterampilan dari mapel lain yang digunakan dalam modul ini,
                 - Bagaimana penggunaannya (bukan sekadar "relevan").
                 Format: object dengan key nama mapel dan value penjelasan koneksi.
                 Jangan cantumkan koneksi yang dipaksakan atau tidak benar-benar muncul.`
      },

      koneksi_kearifan_lokal: {
        value: "Tradisi masyarakat lereng Gunung Slamet dalam memantau tanda-tanda alam (kearifan lokal pertanian) dikaitkan dengan konsep ekosistem dan perubahan cuaca. Nilai gotong royong dalam menghadapi bencana banjir Sungai Klawing dikaitkan dengan dinamika sosial.",
        prompt: `Identifikasi kearifan lokal, tradisi, atau budaya daerah sekolah yang RELEVAN dengan materi.
                 Jelaskan:
                 (1) Nama kearifan lokal/tradisi tersebut secara spesifik,
                 (2) Bagaimana ia terhubung dengan konsep ilmiah dalam materi,
                 (3) Nilai apa yang dapat dipetik peserta didik dari koneksi ini.
                 Jika tidak ada kearifan lokal yang benar-benar relevan, tulis null.
                 Jangan mengarang kearifan lokal yang tidak ada.`
      },

      produk_bermakna: {
        value: "Jurnal Observasi Fenomena: sebuah dokumen tertulis (1–2 halaman) yang berisi identifikasi minimal 5 fenomena alam dan sosial di daerah setempat lengkap dengan penjelasan ilmiahnya dan keterkaitan antar fenomena. Jurnal ini menjadi portofolio awal peserta didik.",
        prompt: `Rancang produk/hasil belajar bermakna yang:
                 (1) Merupakan artefak nyata yang bisa digunakan di luar kelas (bukan hanya untuk nilai),
                 (2) Menunjukkan ketercapaian TP secara otentik,
                 (3) Realistis dibuat peserta didik SMK dalam alokasi waktu yang tersedia,
                 (4) Memiliki relevansi dengan kehidupan atau karir peserta didik.
                 Jelaskan: nama produk, format/wujudnya, isi/komponen minimalnya,
                 dan fungsinya (untuk apa produk ini digunakan setelah selesai).`
      }
    },

    joyful_learning: {
      _subsection: "C.3 JOYFUL LEARNING — Pembelajaran yang Menyenangkan",

      model_pembelajaran: {
        value: "Discovery Learning berbasis konteks lokal: peserta didik diarahkan menemukan sendiri hubungan antar fenomena alam dan sosial melalui stimulus visual, diskusi, dan observasi data sekunder.",
        prompt: `Pilih model pembelajaran yang PALING SESUAI dengan TP ini:
                 Discovery Learning, Inquiry Learning, Problem Based Learning (PBL),
                 Project Based Learning (PjBL), atau model lainnya.
                 Jelaskan:
                 (1) Nama model yang dipilih dan alasan pemilihan (kaitkan dengan karakteristik TP),
                 (2) Bagaimana model ini diimplementasikan secara spesifik dalam konteks lokal.
                 Jangan memilih model hanya karena populer — pilih yang paling cocok untuk
                 kompetensi yang ingin dicapai.`
      },

      variasi_aktivitas: {
        value: {
          individu: "Membuat peta pikiran (mind map) fenomena alam & sosial di daerah setempat",
          berpasangan: "Diskusi 'Tanya-Jawab Ilmiah' untuk saling menguji pemahaman",
          kelompok: "Galeri berjalan (gallery walk) — setiap kelompok menganalisis satu fenomena dan menampilkannya di karton poster",
          presentasi: "Setiap kelompok mempresentasikan hasil analisis fenomenanya kepada kelas (2 menit per kelompok)"
        },
        prompt: `Rancang variasi aktivitas yang mencakup minimal 3 moda sosial berbeda:
                 individu, berpasangan, kelompok, dan/atau presentasi.
                 Untuk setiap aktivitas:
                 (1) Berikan nama aktivitas yang jelas dan menarik,
                 (2) Deskripsikan instruksi singkat yang bisa langsung dipahami peserta didik,
                 (3) Pastikan aktivitas BERBEDA — hindari pengulangan format yang sama.
                 Pertimbangkan ketersediaan ruang, waktu, dan bahan di SMK daerah.
                 Format: object dengan key moda sosial dan value deskripsi aktivitas.`
      },

      diferensiasi_pembelajaran: {
        value: {
          konten: "Kelompok lambat → fenomena sederhana (cuaca lokal); Kelompok cepat → analisis dampak multi-dimensi",
          proses: "Pilihan moda belajar — teks, visual (peta/gambar), atau audio-visual (video lokal)",
          produk: "Jurnal bisa berupa tulisan, peta konsep bergambar, atau presentasi lisan terekam",
          lingkungan: "Meja kelompok fleksibel; pojok mandiri untuk peserta yang perlu ketenangan"
        },
        prompt: `Rancang strategi diferensiasi yang mencakup minimal 3 dari 4 aspek:
                 konten (APA yang dipelajari), proses (BAGAIMANA belajar),
                 produk (BAGAIMANA menunjukkan hasil), lingkungan belajar.
                 Untuk setiap aspek:
                 (1) Sebutkan minimal 2 pilihan konkret yang diberikan kepada peserta didik,
                 (2) Pastikan pilihan tidak diskriminatif — semua pilihan setara kualitasnya,
                 (3) Buat pilihan yang realistis disiapkan guru kelas SMK.
                 Diferensiasi bukan berarti membedakan peserta didik secara eksplisit,
                 tapi menyediakan jalur belajar yang beragam.
                 Format: object dengan key aspek diferensiasi dan value penjelasan.`
      },

      integrasi_nilai: {
        value: "QS. Al-A'raf: 56 — 'Dan janganlah kamu berbuat kerusakan di bumi setelah (diciptakan) dengan baik.' → diintegrasikan dalam diskusi tentang menjaga ekosistem. Pembiasaan: Membuka dan menutup kelas dengan doa; menginternalisasi nilai amanah dalam pengamatan ilmiah.",
        prompt: `[KONDISIONAL] Isi field ini HANYA jika sekolah adalah sekolah Islam/Muhammadiyah/pesantren.
                 Jika bukan, isi dengan nilai karakter umum (jujur, tanggung jawab, peduli lingkungan).

                 Untuk sekolah Islam:
                 (1) Kutip 1 ayat Al-Qur'an atau Hadits yang benar-benar relevan dengan materi
                     (bukan dipaksakan), beserta terjemahannya,
                 (2) Jelaskan koneksi substantif antara ayat dengan materi ilmiah,
                 (3) Sebutkan pembiasaan karakter Islami yang diterapkan dalam kelas.
                 PENTING: Jangan mengutip ayat yang tidak relevan hanya untuk melengkapi form.
                 Akurasi referensi agama adalah tanggung jawab moral — verifikasi nomor surat dan ayat.`
      }
    }
  },

  // ══════════════════════════════════════════════
  // BAGIAN D — SKENARIO PEMBELAJARAN
  // ══════════════════════════════════════════════
  skenario_pembelajaran: {
    _section: "D. SKENARIO / LANGKAH-LANGKAH PEMBELAJARAN",
    _instruction: `Generate skenario untuk setiap pertemuan berdasarkan jumlah pertemuan di identitas.
                   Setiap pertemuan memiliki struktur: pendahuluan (10–15%), inti (70–75%), penutup (10–15%).`,

    pertemuan: [
      {
        nomor: 1,
        topik: "Mengenal Fenomena Alam di [Nama Daerah] (Ekosistem & Cuaca)",
        topik_prompt: `Buat topik pertemuan pertama yang:
                       (1) Fokus pada SEBAGIAN dari TP (bukan semua sekaligus),
                       (2) Membangun fondasi konseptual yang akan didalami di pertemuan berikutnya,
                       (3) Menggunakan konteks lokal di nama topiknya.`,

        alokasi_waktu: "5 JP (225 menit)",

        pendahuluan: {
          durasi: "30 menit",
          kegiatan_guru: [
            "Membuka kelas dengan salam dan doa bersama.",
            "Mengecek kehadiran dan kesiapan belajar peserta didik.",
            "Menampilkan stimulus visual fenomena lokal [nama daerah] [MINDFUL].",
            "Mengajukan pertanyaan pemantik No. 1 dan 2.",
            "Menyampaikan TP, IKTP, dan manfaat pembelajaran hari ini."
          ],
          kegiatan_peserta_didik: [
            "Menjawab salam dan berdoa bersama.",
            "Merespons presensi.",
            "Menyimak dan mengamati stimulus, lalu mengungkapkan kesan pertama secara lisan.",
            "Merespons pertanyaan pemantik dengan berbagi pengalaman.",
            "Mencatat tujuan pembelajaran dalam jurnal belajar."
          ],
          prompt: `Rancang kegiatan pendahuluan (30 menit) yang:
                   (1) Diawali rutinitas positif (salam, doa, cek kehadiran),
                   (2) Menggunakan apersepsi yang kontekstual dan memancing rasa ingin tahu,
                   (3) Mengajukan pertanyaan pemantik yang relevan (2 dari 3 pertanyaan pemantik),
                   (4) Mengkomunikasikan tujuan dan manfaat pembelajaran dengan jelas.
                   Format: dua array paralel — kegiatan_guru dan kegiatan_peserta_didik,
                   dengan penomoran yang bersesuaian. Gunakan tag [MINDFUL] untuk aktivitas mindful.`
        },

        inti: {
          durasi: "165 menit",
          kegiatan_guru: [
            "Menyajikan materi konsep utama dengan konteks lokal [MEANINGFUL].",
            "Membagi kelas menjadi kelompok (4–5 orang) dengan penugasan fenomena berbeda.",
            "Membagikan LKPD dan membimbing kerja kelompok.",
            "Memfasilitasi aktivitas kolaboratif [nama aktivitas] [JOYFUL].",
            "Mengaitkan temuan peserta didik dengan nilai karakter.",
            "Menyimpulkan dan mengkonsolidasi konsep bersama kelas."
          ],
          kegiatan_peserta_didik: [
            "Menyimak penjelasan guru dan mencatat poin penting.",
            "Bergabung dalam kelompok dan menyepakati pembagian tugas.",
            "Mengerjakan LKPD: mengidentifikasi ciri, penyebab, dan dampak fenomena.",
            "Mengikuti aktivitas kolaboratif dan memberikan kontribusi aktif.",
            "Mendiskusikan kaitan fenomena dengan nilai-nilai yang berlaku.",
            "Berpartisipasi aktif dalam penyimpulan bersama."
          ],
          prompt: `Rancang kegiatan inti (165 menit) yang mengimplementasikan model pembelajaran yang dipilih.
                   Sertakan:
                   (1) Penyampaian materi yang MINIMAL — peserta didik lebih banyak beraktivitas,
                   (2) Penerapan MINIMAL 2 variasi aktivitas dari rancangan pembelajaran (C.3),
                   (3) Pembagian kelompok dan distribusi tugas yang jelas,
                   (4) Penggunaan LKPD sebagai panduan kerja (sebutkan nomor LKPD-nya),
                   (5) Integrasi nilai karakter secara alami (bukan ceramah moral tersendiri).
                   Tandai setiap aktivitas dengan tag [MINDFUL], [MEANINGFUL], atau [JOYFUL] sesuai prinsip Deep Learning.
                   Format: dua array paralel — kegiatan_guru dan kegiatan_peserta_didik.`
        },

        penutup: {
          durasi: "30 menit",
          kegiatan_guru: [
            "Membimbing peserta didik menyimpulkan materi yang dipelajari hari ini.",
            "Melakukan asesmen formatif lisan (3 pertanyaan acak ke peserta didik berbeda).",
            "Memfasilitasi refleksi akhir [MINDFUL].",
            "Menginformasikan topik pertemuan berikutnya.",
            "Menutup dengan doa dan salam."
          ],
          kegiatan_peserta_didik: [
            "Menyusun kesimpulan bersama guru.",
            "Menjawab pertanyaan formatif lisan.",
            "Mengisi lembar refleksi dalam jurnal belajar.",
            "Mencatat tugas mandiri untuk pertemuan berikutnya.",
            "Berdoa dan menjawab salam."
          ],
          prompt: `Rancang kegiatan penutup (30 menit) yang mencakup:
                   (1) Penyimpulan bersama (guru memandu, peserta didik yang merumuskan),
                   (2) Asesmen formatif cepat (teknik: pertanyaan lisan / exit ticket / kuis singkat),
                   (3) Refleksi terstruktur menggunakan teknik yang telah dipilih di C.1,
                   (4) Pemberian informasi tindak lanjut (tugas mandiri + preview pertemuan berikutnya),
                   (5) Penutupan dengan rutinitas positif.
                   Format: dua array paralel — kegiatan_guru dan kegiatan_peserta_didik.`
        }
      }
      // CATATAN: AI harus menduplikasi struktur pertemuan di atas
      // untuk setiap pertemuan tambahan, dengan topik yang berbeda.
      // Pertemuan terakhir berfokus pada sintesis dan pengerjaan produk akhir.
    ]
  },

  // ══════════════════════════════════════════════
  // BAGIAN E — RANCANGAN ASESMEN
  // ══════════════════════════════════════════════
  asesmen: {
    _section: "E. RANCANGAN ASESMEN",

    diagnostik: {
      teknik: {
        value: "Pertanyaan pemantik lisan di awal pertemuan ke-1 (3 pertanyaan) + curah pendapat tentang fenomena yang diketahui peserta didik.",
        prompt: `Deskripsikan teknik asesmen diagnostik yang:
                 (1) Dilakukan SEBELUM atau di awal pembelajaran,
                 (2) Mengidentifikasi pengetahuan awal, minat, atau gaya belajar peserta didik,
                 (3) Tidak membutuhkan waktu lebih dari 10–15 menit,
                 (4) Tidak menimbulkan kecemasan ("bukan ujian").
                 Teknik: pertanyaan pemantik, peta konsep awal, angket cepat, brainstorming, dll.`
      },
      tindak_lanjut: {
        value: "Jika mayoritas peserta didik belum mengenal istilah dasar, guru memperlambat tempo materi konsep. Jika sudah cukup paham, langsung diperdalam ke analisis keterkaitan.",
        prompt: `Jelaskan 2–3 skenario tindak lanjut berdasarkan hasil diagnostik:
                 (1) Jika peserta didik BELUM memiliki pengetahuan prasyarat → apa yang guru lakukan?
                 (2) Jika SEBAGIAN peserta didik sudah paham → bagaimana penyesuaian pembelajaran?
                 (3) Jika MAYORITAS sudah paham → bagaimana guru mempercepat/memperdalam?
                 Tindak lanjut harus konkret dan dapat dilakukan, bukan sekadar "disesuaikan".`
      }
    },

    formatif: {
      teknik: {
        value: ["Observasi aktifitas Gallery Walk Pertemuan 1", "Pertanyaan lisan acak di akhir Pertemuan 1", "Kuis tulis 5 soal pilihan ganda di akhir Pertemuan 2"],
        prompt: `Rancang minimal 3 teknik asesmen formatif yang berbeda dan terdistribusi
                 di sepanjang pembelajaran (bukan hanya di akhir):
                 (1) Minimal 1 teknik berbasis OBSERVASI (tidak tertulis),
                 (2) Minimal 1 teknik berbasis LISAN,
                 (3) Minimal 1 teknik berbasis TULISAN.
                 Pastikan teknik sesuai dengan alokasi waktu dan sumber daya yang tersedia.
                 Format: array string.`
      },
      instrumen: {
        value: "Lembar observasi partisipasi Gallery Walk, daftar 3 pertanyaan lisan, soal kuis 5 butir.",
        prompt: `Sebutkan instrumen konkret untuk setiap teknik formatif yang dipilih.
                 Gunakan nama instrumen yang spesifik (bukan hanya "lembar penilaian").
                 Contoh: "Lembar Observasi Diskusi Kelompok (4 indikator)", "Soal Kuis 5 Butir PG".`
      },
      tindak_lanjut: {
        value: {
          remediasi: "Bagi yang belum mencapai IKTP → diberikan bacaan pengayaan sederhana + tugas membuat 3 contoh fenomena tambahan.",
          pengayaan: "Bagi yang sudah melampaui → ditugaskan membuat mini-infografis keterkaitan fenomena lokal.",
          penguatan: "Kelompok tengah → diberikan latihan soal analisis keterkaitan tambahan."
        },
        prompt: `Rancang tindak lanjut formatif untuk 3 kelompok peserta didik:
                 (1) Remediasi: bagi yang BELUM mencapai IKTP — aktivitas konkret, bukan hanya "belajar lagi",
                 (2) Pengayaan: bagi yang SUDAH melampaui — tantangan yang lebih kompleks dan bermakna,
                 (3) Penguatan: bagi yang hampir mencapai — latihan tambahan yang bertarget.
                 Semua tindak lanjut harus bisa dikerjakan secara mandiri oleh peserta didik.
                 Format: object dengan key remediasi, pengayaan, penguatan.`
      }
    },

    sumatif: {
      teknik: {
        value: "Penilaian Jurnal Observasi Fenomena (produk tertulis) + penilaian lisan singkat (jika ada sesi presentasi).",
        prompt: `Tentukan teknik asesmen sumatif yang:
                 (1) Menilai ketercapaian TP secara OTENTIK (bukan hanya tes tulis konvensional),
                 (2) Selaras dengan produk bermakna yang dirancang di C.2,
                 (3) Mencakup penilaian aspek pengetahuan DAN keterampilan,
                 (4) Dapat diselesaikan dalam alokasi waktu yang tersedia.`
      },
      instrumen: {
        value: "Rubrik penilaian jurnal 4 aspek × 4 level (lihat Bagian G).",
        prompt: `Sebutkan instrumen asesmen sumatif yang digunakan.
                 Jika berupa rubrik, sebutkan jumlah aspek dan level penilaiannya.
                 Jika berupa soal, sebutkan jumlah dan bentuk soalnya.`
      },
      kktp: {
        value: {
          kriteria: "Peserta didik dinyatakan MENCAPAI TP-01 apabila: (1) Menyebutkan ≥ 5 fenomena dengan benar, DAN (2) Menjelaskan keterkaitan minimal 2 fenomena secara ilmiah dan runtut.",
          nilai_minimum: 70
        },
        prompt: `Rumuskan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) yang:
                 (1) Memiliki MINIMAL 2 kriteria spesifik dan terukur (bukan hanya nilai angka),
                 (2) Menggunakan kata "DAN" untuk kriteria yang bersifat kumulatif,
                 (3) Selaras dengan IKTP yang telah ditetapkan,
                 (4) Menetapkan nilai minimum (umumnya 70–75 dari 100).
                 Format: object dengan key "kriteria" (string) dan "nilai_minimum" (number).`
      },
      dimensi_dinilai: {
        value: {
          "Penalaran Kritis": "50%",
          "Komunikasi": "30%",
          "Keimanan & Ketakwaan": "20%"
        },
        prompt: `Tentukan 2–4 dimensi Profil Lulusan yang dinilai dalam asesmen sumatif ini,
                 beserta bobot persentasenya (total = 100%).
                 Pilih dimensi yang benar-benar tercermin dalam instrumen penilaian.
                 Format: object dengan key nama dimensi dan value persentase (string dengan %).`
      }
    }
  },

  // ══════════════════════════════════════════════
  // BAGIAN F — MATERI DAN SUMBER BELAJAR
  // ══════════════════════════════════════════════
  materi_sumber: {
    _section: "F. MATERI DAN SUMBER BELAJAR",

    materi_pokok: {
      value: [
        "Pengertian dan jenis fenomena alam (ekosistem, cuaca, bencana alam) di konteks daerah setempat",
        "Pengertian dan jenis fenomena sosial (dinamika penduduk, perubahan sosial, tradisi lokal)",
        "Keterkaitan fenomena alam dan sosial: sebab-akibat dan interdependensi",
        "Pengantar metode ilmiah: cara menjelaskan fenomena secara sistematis"
      ],
      prompt: `Daftarkan 3–6 topik materi ESENSIAL yang:
               (1) Harus dikuasai peserta didik untuk mencapai TP,
               (2) Urut dari konsep dasar ke konsep yang lebih kompleks,
               (3) Disajikan dengan konteks lokal daerah sekolah,
               (4) Tidak terlalu luas — fokus pada yang benar-benar diperlukan untuk TP ini.
               Format: array string.`
    },

    materi_pengayaan: {
      value: "Analisis multi-variabel fenomena: bagaimana perubahan iklim global berdampak lokal pada ekosistem dan komunitas daerah setempat.",
      prompt: `Rancang materi pengayaan untuk peserta didik yang sudah melampaui TP.
               Materi pengayaan harus:
               (1) Lebih kompleks atau lebih luas dari materi pokok,
               (2) Menantang tanpa membebani,
               (3) Tetap relevan dengan TP dan konteks lokal.
               Hindari pengayaan yang hanya "lebih banyak soal" — berikan kedalaman, bukan volume.`
    },

    materi_remedial: {
      value: "Modul bacaan sederhana bergambar: 'Alam dan Masyarakat [Nama Daerah]' + latihan mengidentifikasi 3 fenomena alam dan 3 fenomena sosial dari gambar.",
      prompt: `Rancang materi remedial untuk peserta didik yang belum mencapai IKTP.
               Materi remedial harus:
               (1) Menyederhanakan konsep (bukan mengulang dengan cara yang sama),
               (2) Menggunakan pendekatan visual atau konkret (tidak hanya teks),
               (3) Dapat dikerjakan secara mandiri di luar jam pelajaran,
               (4) Realistis dibuat/disediakan oleh guru SMK.`
    },

    sumber_belajar_utama: {
      value: [
        "Buku Projek IPAS Fase E (Kemendikbudristek, 2022)",
        "Data BPBD Kabupaten [nama kabupaten]",
        "Profil Daerah Kabupaten [nama kabupaten] (BPS, [tahun terbaru])"
      ],
      prompt: `Daftarkan 2–4 sumber belajar utama yang:
               (1) Tersedia dan dapat diakses oleh SMK di daerah tersebut,
               (2) Mencakup sumber resmi pemerintah (buku Kemendikbud, BPS, BPBD lokal),
               (3) Relevan dengan konteks lokal jika ada sumber daerah yang tersedia,
               (4) Aktual — prioritaskan sumber 5 tahun terakhir.
               Format: array string dengan format "[Judul] ([Penerbit/Sumber], [Tahun])".`
    },

    sumber_belajar_pendukung: {
      value: [
        "Video dokumenter lokal (YouTube — cari fenomena spesifik daerah setempat)",
        "Artikel berita lokal tentang industri/fenomena unggulan daerah",
        "Peta wilayah Kabupaten [nama kabupaten]"
      ],
      prompt: `Daftarkan 2–4 sumber belajar pendukung yang:
               (1) Bersifat kontekstual dan lokal (media daerah, video fenomena lokal),
               (2) Mudah diakses gratis (YouTube, situs pemerintah daerah, koran lokal online),
               (3) Beragam jenis media (video, artikel, peta, infografis).
               Format: array string.`
    },

    media_pembelajaran: {
      value: "Slide PPT (15 slide, berisi foto fenomena lokal + data); Video clip 3–5 menit fenomena lokal; Karton poster A3 untuk Gallery Walk.",
      prompt: `Tentukan media pembelajaran yang:
               (1) Mencakup minimal 2 jenis media berbeda (visual, audio-visual, manipulatif, dll.),
               (2) Realistis tersedia di SMK daerah (tidak membutuhkan perangkat mahal),
               (3) Mendukung gaya belajar yang beragam.
               Untuk setiap media, sebutkan spesifikasi singkatnya (jumlah slide, durasi video, dll.).`
    },

    alat_bahan: {
      value: ["Proyektor/TV", "Laptop guru", "Spidol warna", "Karton poster A3", "Sticky note", "Selotip", "LKPD yang dicetak"],
      prompt: `Daftarkan alat dan bahan fisik yang dibutuhkan untuk pembelajaran.
               Pastikan semua item:
               (1) Tersedia di SMK pada umumnya atau mudah diadakan dengan biaya minimal,
               (2) Diperlukan untuk aktivitas yang telah dirancang (tidak ada yang mubazir).
               Format: array string.`
    },

    lkpd: {
      value: [
        { kode: "LKPD-01a", judul: "Analisis Fenomena Alam (Gallery Walk)", pertemuan: 1 },
        { kode: "LKPD-01b", judul: "Bagan Keterkaitan Alam–Sosial", pertemuan: 2 }
      ],
      prompt: `Daftarkan semua LKPD yang digunakan dalam modul ini.
               Setiap LKPD harus:
               (1) Memiliki kode unik: "LKPD-[nomor modul][a/b/c]",
               (2) Judul yang mencerminkan aktivitas (bukan hanya "LKPD Pertemuan 1"),
               (3) Terhubung dengan pertemuan spesifik.
               Format: array object dengan key kode, judul, pertemuan.`
    }
  },

  // ══════════════════════════════════════════════
  // BAGIAN G — RUBRIK PENILAIAN HOLISTIK
  // ══════════════════════════════════════════════
  rubrik_penilaian: {
    _section: "G. RUBRIK PENILAIAN HOLISTIK",
    _formula: "Nilai Akhir = (Total Skor / [maks_skor]) × 100 | KKTP: Nilai ≥ [nilai_minimum]",

    objek_penilaian: {
      value: "Jurnal Observasi Fenomena (Produk Akhir)",
      prompt: `Sebutkan TEPAT objek/produk yang dinilai menggunakan rubrik ini.
               Harus konsisten dengan produk bermakna yang dirancang di C.2.`
    },

    aspek: [
      {
        nama: "Pengetahuan: Identifikasi Fenomena",
        nama_prompt: `Nama aspek penilaian harus:
                      (1) Mencerminkan SATU dimensi kompetensi yang jelas,
                      (2) Menggunakan format "[Domain]: [Objek Penilaian]",
                      (3) Konsisten dengan IKTP yang telah ditetapkan.`,

        level_1: { label: "Perlu Bimbingan (1)", deskriptor: "Menyebutkan < 3 fenomena atau tidak relevan." },
        level_2: { label: "Cukup (2)", deskriptor: "Menyebutkan 3–4 fenomena dengan benar." },
        level_3: { label: "Baik (3)", deskriptor: "Menyebutkan 5–6 fenomena dengan benar dan deskripsi singkat." },
        level_4: { label: "Sangat Baik (4)", deskriptor: "Menyebutkan > 6 fenomena lengkap dengan penjelasan ilmiah yang mendalam." },

        deskriptor_prompt: `Untuk setiap aspek, buat 4 level deskriptor yang:
                            (1) SPESIFIK dan TERUKUR — guru bisa menilai tanpa ambiguitas,
                            (2) Menggunakan kriteria kuantitatif (angka, frekuensi) ATAU kualitatif yang konkret,
                            (3) Menunjukkan PERBEDAAN NYATA antar level (bukan sekadar kata kualitas yang berbeda),
                            (4) Level 1 (Perlu Bimbingan) tetap menghargai usaha peserta didik,
                            (5) Level 4 (Sangat Baik) merupakan pencapaian yang AMBISIUS namun MUNGKIN.
                            Hindari deskriptor samar seperti "cukup baik" atau "kurang memadai" tanpa penjelasan.`
      },
      {
        nama: "Keterampilan: Analisis Keterkaitan",
        level_1: { label: "Perlu Bimbingan (1)", deskriptor: "Belum mampu menghubungkan fenomena alam dan sosial." },
        level_2: { label: "Cukup (2)", deskriptor: "Menghubungkan 1 fenomena alam dengan 1 sosial secara sederhana." },
        level_3: { label: "Baik (3)", deskriptor: "Menghubungkan ≥ 2 fenomena alam–sosial dengan penjelasan logis." },
        level_4: { label: "Sangat Baik (4)", deskriptor: "Menganalisis ≥ 3 keterkaitan secara mendalam dan sistematis dengan bukti data." }
      },
      {
        nama: "Komunikasi: Penyajian Jurnal",
        level_1: { label: "Perlu Bimbingan (1)", deskriptor: "Tulisan tidak runtut, sulit dipahami." },
        level_2: { label: "Cukup (2)", deskriptor: "Tulisan cukup runtut dengan beberapa kesalahan bahasa." },
        level_3: { label: "Baik (3)", deskriptor: "Tulisan runtut, jelas, dan menggunakan istilah ilmiah dengan tepat." },
        level_4: { label: "Sangat Baik (4)", deskriptor: "Tulisan sangat runtut, sistematis, menggunakan istilah ilmiah, dilengkapi gambar/bagan." }
      },
      {
        nama: "Sikap: Nilai Karakter & Profil Lulusan",
        level_1: { label: "Perlu Bimbingan (1)", deskriptor: "Tidak menunjukkan kepedulian terhadap lingkungan atau isu sosial." },
        level_2: { label: "Cukup (2)", deskriptor: "Menunjukkan kepedulian dengan bimbingan penuh dari guru." },
        level_3: { label: "Baik (3)", deskriptor: "Mengaitkan fenomena dengan tanggung jawab sebagai warga dan/atau khalifah." },
        level_4: { label: "Sangat Baik (4)", deskriptor: "Secara mandiri dan konsisten mengintegrasikan nilai karakter dalam analisis dan sikap." }
      }
    ],

    aspek_prompt: `Generate 4 aspek penilaian yang mencerminkan dimensi holistik:
                   (1) Aspek PENGETAHUAN (kognitif — apa yang peserta didik tahu),
                   (2) Aspek KETERAMPILAN (psikomotor/proses — apa yang peserta didik bisa lakukan),
                   (3) Aspek KOMUNIKASI (penyajian — bagaimana peserta didik mengungkapkan),
                   (4) Aspek SIKAP (afektif — nilai karakter yang ditunjukkan).
                   Setiap aspek harus memiliki 4 level: Perlu Bimbingan (1), Cukup (2), Baik (3), Sangat Baik (4).
                   Deskriptor setiap level harus SPESIFIK, TERUKUR, dan BERBEDA NYATA antar level.`
  },

  // ══════════════════════════════════════════════
  // BAGIAN H — REFLEKSI GURU
  // ══════════════════════════════════════════════
  refleksi_guru: {
    _section: "H. REFLEKSI GURU DAN TINDAK LANJUT",
    _note: "Bagian ini dikosongkan — diisi oleh guru setelah pembelajaran dilaksanakan.",

    pertanyaan_refleksi: [
      "Apakah tujuan pembelajaran tercapai? (Ya / Sebagian / Belum) — Alasan:",
      "Apa yang berjalan baik dalam pembelajaran ini?",
      "Apa yang perlu diperbaiki untuk pelaksanaan berikutnya?",
      "Bagaimana respons peserta didik terhadap pembelajaran ini?",
      "Tindak lanjut apa yang direncanakan untuk kelas/modul berikutnya?",
      "Catatan khusus (kejadian penting, peserta didik yang perlu perhatian khusus, dll.):"
    ],

    prompt: `Bagian ini adalah template refleksi untuk guru.
             AI TIDAK mengisi jawaban refleksi — itu adalah ruang guru.
             Pastikan pertanyaan refleksi:
             (1) Mencakup aspek ketercapaian TP,
             (2) Mendorong refleksi tentang proses (bukan hanya hasil),
             (3) Berorientasi pada perbaikan dan tindak lanjut,
             (4) Mencakup perhatian pada peserta didik secara individual.`
  },

  // ══════════════════════════════════════════════
  // BAGIAN I — DAFTAR LAMPIRAN
  // ══════════════════════════════════════════════
  lampiran: {
    _section: "I. DAFTAR LAMPIRAN MODUL AJAR",

    daftar: {
      value: [
        { no: 1, nama: "Lembar Kerja Peserta Didik (LKPD-01a)", keterangan: "Gallery Walk — Analisis Fenomena Alam", status: "Ada" },
        { no: 2, nama: "Lembar Kerja Peserta Didik (LKPD-01b)", keterangan: "Bagan Keterkaitan Alam–Sosial", status: "Ada" },
        { no: 3, nama: "Instrumen Asesmen Formatif", keterangan: "Daftar pertanyaan lisan + soal kuis", status: "Ada" },
        { no: 4, nama: "Instrumen Asesmen Sumatif", keterangan: "Rubrik penilaian jurnal 4 aspek", status: "Ada" },
        { no: 5, nama: "Rubrik Penilaian Lengkap", keterangan: "Rubrik 4 aspek × 4 level (Bagian G)", status: "Ada" },
        { no: 6, nama: "Media Pembelajaran", keterangan: "Slide PPT + link video fenomena lokal", status: "Ada" },
        { no: 7, nama: "Lembar Refleksi Peserta Didik", keterangan: "Lembar refleksi terstruktur (per pertemuan)", status: "Ada" },
        { no: 8, nama: "Bahan Pengayaan", keterangan: "Materi analisis mendalam + sumber tambahan", status: "Ada" },
        { no: 9, nama: "Bahan Remediasi", keterangan: "Modul bacaan sederhana + latihan soal", status: "Ada" },
        { no: 10, nama: "Dokumentasi Foto Kegiatan", keterangan: "Diisi setelah pelaksanaan pembelajaran", status: "Belum" }
      ],
      prompt: `Generate daftar lampiran yang komprehensif dan konsisten dengan isi modul.
               Pastikan setiap LKPD, instrumen, media, dan rubrik yang disebutkan di bagian lain
               terdaftar di sini.
               Status "Ada" = lampiran wajib yang harus disiapkan oleh AI/guru sebelum mengajar.
               Status "Belum" = lampiran yang diisi setelah pelaksanaan (dokumentasi, evaluasi).
               Format: array object dengan key no, nama, keterangan, status.`
    }
  }
};

// ─────────────────────────────────────────────────────────────
// CONTOH USER INPUT — Data yang diisi pengguna di form generator
// ─────────────────────────────────────────────────────────────
export const EXAMPLE_USER_INPUT = {
  nama_sekolah: "SMK Muhammadiyah 3 Purbalingga",
  jenis_sekolah: "Swasta Islam (Muhammadiyah)",
  kota_kabupaten: "Purbalingga",
  provinsi: "Jawa Tengah",
  mata_pelajaran: "Projek Ilmu Pengetahuan Alam dan Sosial (Projek IPAS)",
  program_keahlian: "Semua Program Keahlian",
  fase: "E",
  kelas: "X",
  semester: "Ganjil",
  tahun_pelajaran: "2025/2026",
  topik_utama: "Fenomena Alam dan Sosial",
  konteks_lokal: "Purbalingga dikenal dengan industri bulu mata, pertanian lereng Gunung Slamet, dan Sungai Klawing",
  jumlah_jp: 10,
  jumlah_pertemuan: 2,
  jp_per_pertemuan: 5,
  menit_per_jp: 45,
  pendekatan: "Deep Learning (Mindful, Meaningful, Joyful)",
  model_pembelajaran: "Discovery Learning",
  integrasi_nilai_islam: true,
  nama_guru: null  // null = dikosongkan (diisi manual)
};
