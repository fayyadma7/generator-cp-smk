import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
} from "docx";
import { saveAs } from "file-saver";

// ═══════════════════════════════════════════════════════════
// KONSTANTA & HELPER (Menggunakan skema warna yang mirip dengan docxGenerator)
// ═══════════════════════════════════════════════════════════
const C = {
  navyDark:   "1F3864",
  navyMid:    "2E5D9E",
  navyLight:  "D6E4F0",
  white:      "FFFFFF",
  gray:       "F2F2F2",
  grayDark:   "D9D9D9",
  textDark:   "1A1A1A",
  textBlue:   "1F3864",
  green:      "375623",
  blue:       "2F5597",
  orange:     "C55A11",
};

const PAGE_W    = 11906;  // A4 lebar
const PAGE_H    = 16838;  // A4 tinggi
const MARGIN    = 1080;
const CONTENT_W = PAGE_W - MARGIN * 2;
const CM        = { top: 80, bottom: 80, left: 140, right: 140 };

const allBorders  = (color = "AAAAAA", sz = 3)  => { const b = { style: BorderStyle.SINGLE, size: sz, color }; return { top: b, bottom: b, left: b, right: b }; };

function p(text, opts = {}) {
  const {
    bold = false, italic = false, size = 20,
    color = C.textDark, align = AlignmentType.LEFT,
    spBefore = 40, spAfter = 40, underline = false,
  } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before: spBefore, after: spAfter },
    children: [new TextRun({ text, bold, italic, size, color, font: "Arial", underline: underline ? {} : undefined })],
  });
}

function pMulti(runs, opts = {}) {
  const { align = AlignmentType.LEFT, spBefore = 40, spAfter = 40 } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before: spBefore, after: spAfter },
    children: runs.map(r => new TextRun({ font: "Arial", ...r })),
  });
}

const pEmpty = (sp = 80) => new Paragraph({ children: [new TextRun("")], spacing: { before: sp, after: sp } });

function dCell(children, opts = {}) {
  const { w, bg = C.white, colSpan = 1, rowSpan = 1, vAlign = VerticalAlign.TOP, borders: brd } = opts;
  return new TableCell({
    columnSpan: colSpan, rowSpan: rowSpan,
    width: w ? { size: w, type: WidthType.DXA } : undefined,
    borders: brd || allBorders("BBBBBB", 2),
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: CM, verticalAlign: vAlign,
    children: Array.isArray(children) ? children : [children],
  });
}

function bannerTable(text, bg = C.navyDark, textColor = C.white, textSize = 22, subText = null) {
  const lines = [new TextRun({ text, bold: true, size: textSize, color: textColor, font: "Arial" })];
  const children = [new Paragraph({ alignment: AlignmentType.CENTER, children: lines })];
  if (subText) children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: subText, size: textSize - 4, color: textColor, font: "Arial" })] }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: CONTENT_W, type: WidthType.DXA },
      borders: allBorders(C.navyMid, 4),
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 140, bottom: 140, left: 200, right: 200 },
      children,
    })] })],
  });
}

function secRow(text, colSpan = 2, bg = C.grayDark) {
  return new TableRow({ children: [new TableCell({
    columnSpan: colSpan,
    borders: allBorders("888888", 4),
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [p(text, { bold: true, size: 22 })],
  })] });
}

function valueCell(text, w) {
  if (!text) return dCell(p("\u2014", { size: 20 }), { w });
  const lines = String(text).split("\n");
  return dCell(lines.map(l => p(l, { size: 20, spBefore: 20, spAfter: 20 })), { w });
}

const labelCell = (text, w = 3000, bg = C.gray) =>
  dCell(p(text, { bold: true, size: 20 }), { w, bg });


// ═══════════════════════════════════════════════════════════
// D. SKENARIO (Helper)
// ═══════════════════════════════════════════════════════════
function makeSkenarioRows(aiData) {
  const W_SKEN = [Math.floor(CONTENT_W * 0.15), Math.floor(CONTENT_W * 0.425), Math.floor(CONTENT_W * 0.425)];
  const skenarioData = aiData.skenario || [];
  
  if (skenarioData.length === 0) {
    return [new TableRow({ children: [dCell(p("Belum ada skenario", { size: 20, italic: true }), { colSpan: 3 })] })];
  }

  const rows = [];
  skenarioData.forEach((sken, idx) => {
    // Header Pertemuan
    rows.push(new TableRow({ children: [
      dCell(p(`PERTEMUAN KE-${idx + 1} (${sken.waktu || '... JP'})`, { bold: true, size: 20 }), { colSpan: 3, bg: C.grayDark })
    ]}));

    // Header Kolom
    rows.push(new TableRow({ children: [
      dCell(p("Fase Pembelajaran", { bold: true, size: 20, align: AlignmentType.CENTER }), { w: W_SKEN[0], bg: C.gray }),
      dCell(p("Kegiatan Guru", { bold: true, size: 20, align: AlignmentType.CENTER }), { w: W_SKEN[1], bg: C.gray }),
      dCell(p("Kegiatan Peserta Didik", { bold: true, size: 20, align: AlignmentType.CENTER }), { w: W_SKEN[2], bg: C.gray })
    ]}));

    const fases = [
      { nama: "PENDAHULUAN", data: sken.pendahuluan },
      { nama: "INTI", data: sken.inti },
      { nama: "PENUTUP", data: sken.penutup }
    ];

    fases.forEach(f => {
      rows.push(new TableRow({ children: [
        dCell([
          p(f.nama, { bold: true, size: 20, align: AlignmentType.CENTER }),
          p(f.data?.waktu || "... menit", { size: 18, align: AlignmentType.CENTER })
        ], { w: W_SKEN[0] }),
        valueCell(f.data?.guru, W_SKEN[1]),
        valueCell(f.data?.siswa, W_SKEN[2]),
      ]}));
    });
  });

  return rows;
}

// ═══════════════════════════════════════════════════════════
// BAGIAN UTAMA (FORMAT ISIAN MODUL AJAR)
// ═══════════════════════════════════════════════════════════
function makeModulAjar(data, aiData) {
  const W = [3000, CONTENT_W - 3000];
  const lv = (label, value) => new TableRow({ children: [labelCell(label, W[0]), valueCell(value, W[1])] });

  // Dimensi Profil
  const dimNames = ["Keimanan & Ketakwaan", "Kewargaan", "Penalaran Kritis", "Kreativitas", "Kemandirian", "Kolaborasi", "Komunikasi", "Kesehatan"];
  const dimCells = dimNames.map((name, i) => {
    const isChecked = aiData.kerangka?.dimensiProfil?.includes(name) || false;
    return pMulti([
      { text: isChecked ? "\u2611 " : "\u2610 ", size: 22, color: C.textDark },
      { text: name, size: 20, color: C.textDark },
    ], { spBefore: 20, spAfter: 20 });
  });

  const mainTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      // ── A. IDENTITAS MODUL AJAR ──
      secRow("A. IDENTITAS MODUL AJAR"),
      lv("Nama Mata Pelajaran", data.subject),
      lv("Program Keahlian", data.program),
      lv("Fase / Kelas", data.phase + (data.grade ? ` / ${data.grade}` : '')),
      lv("Semester", data.semester),
      lv("Tahun Pelajaran", data.year),
      lv("Judul Modul Ajar", aiData.identitas?.judulModul),
      lv("Nomor Modul Ajar", aiData.identitas?.nomorModul),
      lv("Nomor TP yang Dirujuk", data.targetTp),
      lv("Alokasi Waktu", aiData.identitas?.alokasiWaktu),
      lv("Pertemuan ke-", aiData.identitas?.pertemuanKe),
      lv("Guru Mata Pelajaran", data.teacher),

      // ── B. KERANGKA KURIKULUM ──
      secRow("B. KERANGKA KURIKULUM"),
      lv("Capaian Pembelajaran (CP)", data.cpText),
      lv("Elemen CP", data.elemenCP),
      lv("Tujuan Pembelajaran (TP)", data.targetTpText),
      lv("Indikator Ketercapaian TP (IKTP)", aiData.kerangka?.iktp),
      lv("Posisi dalam ATP", aiData.kerangka?.posisiAtp),
      new TableRow({ children: [
        labelCell("8 Dimensi Profil Lulusan yang Dikembangkan", W[0]),
        dCell([
          ...dimCells,
          pEmpty(40),
          p(`Detail: ${aiData.kerangka?.detailDimensi || "\u2014"}`, { size: 20, italic: true })
        ], { w: W[1] })
      ]}),

      // ── C. RANCANGAN PEMBELAJARAN ──
      secRow("C. RANCANGAN PEMBELAJARAN — PENDEKATAN DEEP LEARNING"),
      
      new TableRow({ children: [dCell(p("C.1 MINDFUL LEARNING - Pembelajaran Penuh Kesadaran", { bold: true, color: C.green }), { colSpan: 2, bg: C.grayDark })] }),
      lv("Apersepsi & Aktivasi Pengetahuan Awal", aiData.deepLearning?.mindful?.apersepsi),
      lv("Pertanyaan Pemantik", aiData.deepLearning?.mindful?.pemantik),
      lv("Penetapan Tujuan Bersama", aiData.deepLearning?.mindful?.tujuan),
      lv("Strategi Refleksi Akhir", aiData.deepLearning?.mindful?.refleksi),

      new TableRow({ children: [dCell(p("C.2 MEANINGFUL LEARNING - Pembelajaran Bermakna", { bold: true, color: C.blue }), { colSpan: 2, bg: C.grayDark })] }),
      lv("Koneksi dengan Dunia Nyata / Industri", aiData.deepLearning?.meaningful?.dudi),
      lv("Koneksi Antar Mata Pelajaran", aiData.deepLearning?.meaningful?.antarMapel),
      lv("Koneksi dengan Kearifan Lokal Purbalingga", aiData.deepLearning?.meaningful?.lokal),
      lv("Produk / Hasil Belajar Bermakna", aiData.deepLearning?.meaningful?.produk),

      new TableRow({ children: [dCell(p("C.3 JOYFUL LEARNING - Pembelajaran yang Menyenangkan", { bold: true, color: C.orange }), { colSpan: 2, bg: C.grayDark })] }),
      lv("Strategi / Model Pembelajaran", aiData.deepLearning?.joyful?.model),
      lv("Variasi Aktivitas Pembelajaran", aiData.deepLearning?.joyful?.aktivitas),
      lv("Diferensiasi Pembelajaran", aiData.deepLearning?.joyful?.diferensiasi),
      lv("Integrasi Nilai Islami", aiData.deepLearning?.joyful?.islami),
    ]
  });

  const skenarioTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [Math.floor(CONTENT_W * 0.15), Math.floor(CONTENT_W * 0.425), Math.floor(CONTENT_W * 0.425)],
    rows: [
      secRow("D. SKENARIO / LANGKAH-LANGKAH PEMBELAJARAN", 3),
      ...makeSkenarioRows(aiData)
    ]
  });

  const asesmenTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      secRow("E. RANCANGAN ASESMEN"),
      
      new TableRow({ children: [dCell(p("E.1 ASESMEN FORMATIF", { bold: true }), { colSpan: 2, bg: C.grayDark })] }),
      lv("Teknik Asesmen Formatif", aiData.asesmen?.formatif?.teknik),
      lv("Instrumen", aiData.asesmen?.formatif?.instrumen),
      lv("Waktu Pelaksanaan", aiData.asesmen?.formatif?.waktu),
      lv("Tindak Lanjut", aiData.asesmen?.formatif?.tindakLanjut),

      new TableRow({ children: [dCell(p("E.2 ASESMEN SUMATIF", { bold: true }), { colSpan: 2, bg: C.grayDark })] }),
      lv("Teknik Asesmen Sumatif", aiData.asesmen?.sumatif?.teknik),
      lv("Instrumen", aiData.asesmen?.sumatif?.instrumen),
      lv("Kriteria Ketercapaian (KKTP)", aiData.asesmen?.sumatif?.kktp),
      lv("Dimensi Profil yang Dinilai", aiData.asesmen?.sumatif?.profil),

      new TableRow({ children: [dCell(p("E.3 ASESMEN DIAGNOSTIK", { bold: true }), { colSpan: 2, bg: C.grayDark })] }),
      lv("Teknik Diagnostik", aiData.asesmen?.diagnostik?.teknik),
      lv("Hasil & Tindak Lanjut", aiData.asesmen?.diagnostik?.tindakLanjut),
    ]
  });

  const materiTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      secRow("F. MATERI DAN SUMBER BELAJAR"),
      lv("Materi Pokok / Esensial", aiData.materi?.pokok),
      lv("Materi Pengayaan", aiData.materi?.pengayaan),
      lv("Materi Remedial", aiData.materi?.remedial),
      lv("Sumber Belajar Utama", aiData.materi?.sumberUtama),
      lv("Sumber Belajar Pendukung", aiData.materi?.sumberPendukung),
      lv("Media Pembelajaran", aiData.materi?.media),
      lv("Alat & Bahan Praktik", aiData.materi?.alat),
      lv("Lembar Kerja Peserta Didik (LKPD)", aiData.materi?.lkpd),
    ]
  });

  const rubrikW = [Math.floor(CONTENT_W * 0.2), Math.floor(CONTENT_W * 0.2), Math.floor(CONTENT_W * 0.2), Math.floor(CONTENT_W * 0.2), Math.floor(CONTENT_W * 0.2)];
  const rubrikTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: rubrikW,
    rows: [
      secRow("G. RUBRIK PENILAIAN HOLISTIK", 5),
      new TableRow({ children: [
        dCell(p("Aspek Penilaian", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
        dCell(p("Perlu Bimbingan (1)", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
        dCell(p("Cukup (2)", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
        dCell(p("Baik (3)", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
        dCell(p("Sangat Baik (4)", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
      ]}),
      new TableRow({ children: [
        dCell(p("Pengetahuan / Pemahaman Konsep", { bold: true })),
        dCell(p("Belum memahami konsep; jawaban tidak relevan.")),
        dCell(p("Memahami sebagian konsep dengan kekeliruan.")),
        dCell(p("Memahami konsep dengan baik; sedikit kekeliruan.")),
        dCell(p("Memahami konsep secara mendalam dan komprehensif.")),
      ]}),
      new TableRow({ children: [
        dCell(p("Keterampilan / Unjuk Kerja", { bold: true })),
        dCell(p("Belum dapat melaksanakan prosedur.")),
        dCell(p("Melaksanakan prosedur dengan banyak kesalahan.")),
        dCell(p("Melaksanakan prosedur dengan beberapa kesalahan kecil.")),
        dCell(p("Melaksanakan prosedur dengan tepat, sistematis, dan mandiri.")),
      ]}),
      new TableRow({ children: [
        dCell(p("Sikap & Profil Lulusan", { bold: true })),
        dCell(p("Belum menunjukkan sikap yang diharapkan.")),
        dCell(p("Menunjukkan sikap dengan bimbingan penuh.")),
        dCell(p("Menunjukkan sikap secara konsisten dengan sedikit bimbingan.")),
        dCell(p("Menunjukkan sikap secara mandiri, konsisten, dan menjadi teladan.")),
      ]}),
      new TableRow({ children: [
        dCell(p("Produk / Karya Akhir", { bold: true })),
        dCell(p("Produk tidak sesuai kriteria.")),
        dCell(p("Produk sesuai sebagian kriteria.")),
        dCell(p("Produk sesuai kriteria dengan kualitas cukup baik.")),
        dCell(p("Produk melampaui kriteria; inovatif dan bernilai guna tinggi.")),
      ]}),
    ]
  });

  const refleksiTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      secRow("H. REFLEKSI GURU DAN TINDAK LANJUT"),
      lv("Apakah tujuan pembelajaran tercapai?", "Ya / Sebagian / Belum | Alasan: ..."),
      lv("Apa yang berjalan baik?", "..."),
      lv("Apa yang perlu diperbaiki?", "..."),
      lv("Bagaimana respons peserta didik?", "..."),
      lv("Tindak Lanjut yang Direncanakan", "..."),
      lv("Catatan Khusus", "..."),
      lv("Tanggal Refleksi", "..."),
    ]
  });

  const lampiranTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [Math.floor(CONTENT_W * 0.1), Math.floor(CONTENT_W * 0.4), Math.floor(CONTENT_W * 0.3), Math.floor(CONTENT_W * 0.2)],
    rows: [
      secRow("I. DAFTAR LAMPIRAN MODUL AJAR", 4),
      new TableRow({ children: [
        dCell(p("No", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
        dCell(p("Nama Lampiran", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
        dCell(p("Keterangan", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
        dCell(p("Status", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
      ]}),
      ...[
        ["1", "Lembar Kerja Peserta Didik (LKPD)", "Terlampir dalam modul"],
        ["2", "Instrumen Asesmen Formatif", "Lembar observasi, kuis, dll."],
        ["3", "Instrumen Asesmen Sumatif", "Soal tes / Rubrik proyek"],
        ["4", "Rubrik Penilaian Lengkap", "Rubrik 4 aspek sesuai Bagian G"],
        ["5", "Materi Ajar / Bahan Bacaan", "Handout / ringkasan materi"],
        ["6", "Media Pembelajaran", "Link video / PPT / infografis"],
        ["7", "Lembar Refleksi Peserta Didik", "Jurnal / exit ticket / 3-2-1"],
        ["8", "Bahan Pengayaan", "Untuk peserta didik KKTP terlampaui"],
        ["9", "Bahan Remediasi", "Untuk peserta didik belum KKTP"],
        ["10", "Dokumentasi Foto Kegiatan", "Foto proses pembelajaran"],
      ].map(r => new TableRow({ children: [
        dCell(p(r[0], { align: AlignmentType.CENTER })),
        dCell(p(r[1])),
        dCell(p(r[2])),
        dCell(p("Ada / Tidak", { align: AlignmentType.CENTER, italic: true })),
      ]}))
    ]
  });

  // Tanda Tangan
  const today = new Date();
  const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const dateStr = `Purbalingga, ${today.getDate()} ${BULAN[today.getMonth()]} ${today.getFullYear()}`;
  const W3 = [Math.floor(CONTENT_W / 3), Math.floor(CONTENT_W / 3), CONTENT_W - Math.floor(CONTENT_W / 3) * 2];

  const ttdTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W3,
    rows: [
      secRow("J. PENGESAHAN MODUL AJAR", 3),
      new TableRow({ children: [
      dCell([
        p("Disusun Oleh", { bold: true, size: 20, align: AlignmentType.CENTER }),
        p("Guru Mata Pelajaran", { size: 20, align: AlignmentType.CENTER }),
        pEmpty(160), pEmpty(160), pEmpty(80),
        p(data.teacher || ".............................", { bold: true, size: 20, align: AlignmentType.CENTER, underline: true }),
        p("NIP. ..........................", { size: 20, align: AlignmentType.CENTER }),
      ], { w: W3[0] }),
      dCell([
        p("Diperiksa Oleh", { bold: true, size: 20, align: AlignmentType.CENTER }),
        p("Wakil Kepala Kurikulum", { size: 20, align: AlignmentType.CENTER }),
        pEmpty(160), pEmpty(160), pEmpty(80),
        p(".............................", { bold: true, size: 20, align: AlignmentType.CENTER, underline: true }),
        p("NIP. ..........................", { size: 20, align: AlignmentType.CENTER }),
      ], { w: W3[1] }),
      dCell([
        p("Disahkan Oleh", { bold: true, size: 20, align: AlignmentType.CENTER }),
        p("Kepala Sekolah", { size: 20, align: AlignmentType.CENTER }),
        pEmpty(160), pEmpty(160), pEmpty(80),
        p(".............................", { bold: true, size: 20, align: AlignmentType.CENTER, underline: true }),
        p("NIP. ..........................", { size: 20, align: AlignmentType.CENTER }),
      ], { w: W3[2] }),
    ]})],
  });

  return [
    bannerTable("FORMAT ISIAN MODUL AJAR", C.navyDark, C.white, 26, "SMK Muhammadiyah 3 Purbalingga | Kurikulum Merdeka | Pendekatan Deep Learning"),
    pEmpty(100),
    mainTable,
    pEmpty(100),
    skenarioTable,
    pEmpty(100),
    asesmenTable,
    pEmpty(100),
    materiTable,
    pEmpty(100),
    rubrikTable,
    pEmpty(100),
    refleksiTable,
    pEmpty(100),
    lampiranTable,
    pEmpty(100),
    ttdTable,
  ];
}

export async function generateAndDownloadModulDocx(data, aiData) {
  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 20 } } } },
    sections: [
      {
        properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
        children: [...makeModulAjar(data, aiData)],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Modul_Ajar_${(data.subject || "Mapel").replace(/ /g, "_")}_${(data.targetTp || "TP").replace(/ /g, "_")}.docx`);
}
