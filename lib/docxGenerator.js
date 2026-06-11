import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, Header, Footer,
} from "docx";
import { saveAs } from "file-saver";

// ─────────────────────────────────────────────
// KONSTANTA WARNA & UKURAN
// ─────────────────────────────────────────────
const C = {
  navyDark:  "1F3864",
  navyMid:   "2E5D9E",
  navyLight: "D6E4F0",
  yellow:    "FFC000",
  yellowLight: "FFF2CC",
  white:     "FFFFFF",
  gray:      "F2F2F2",
  grayMid:   "D9D9D9",
  textDark:  "1A1A1A",
  textBlue:  "1F3864",
  green:     "375623",
  greenLight:"E2EFDA",
};

const PAGE_W   = 11906;
const PAGE_H   = 16838;
const MARGIN   = 1080;
const CONTENT_W = PAGE_W - MARGIN * 2;

function solidBorder(color = C.navyMid, sz = 4) {
  return { style: BorderStyle.SINGLE, size: sz, color };
}
function allBorders(color = "AAAAAA", sz = 3) {
  const b = solidBorder(color, sz);
  return { top: b, bottom: b, left: b, right: b };
}
function noBorders() {
  const b = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return { top: b, bottom: b, left: b, right: b };
}
const CM = { top: 80, bottom: 80, left: 140, right: 140 };

// ─── Paragraph helper ───
function p(text, opts = {}) {
  const {
    bold = false, italic = false, size = 20,
    color = C.textDark, align = AlignmentType.LEFT,
    spBefore = 40, spAfter = 40, indent = null,
    underline = false,
  } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before: spBefore, after: spAfter },
    indent: indent || undefined,
    children: [new TextRun({ text, bold, italic, size, color, font: "Arial", underline: underline ? {} : undefined })],
  });
}

function pEmpty(sp = 80) {
  return new Paragraph({ children: [new TextRun("")], spacing: { before: sp, after: sp } });
}

// ─── Cell helpers ───
function hCell(text, opts = {}) {
  const { colSpan = 1, rowSpan = 1, w, bg = C.navyDark, size = 20, align = AlignmentType.CENTER } = opts;
  return new TableCell({
    columnSpan: colSpan, rowSpan: rowSpan,
    width: w ? { size: w, type: WidthType.DXA } : undefined,
    borders: allBorders(C.navyMid, 4),
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: CM, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold: true, size, color: C.white, font: "Arial" })],
    })],
  });
}

function dCell(children, opts = {}) {
  const { w, bg = C.white, colSpan = 1, rowSpan = 1, vAlign = VerticalAlign.TOP } = opts;
  return new TableCell({
    columnSpan: colSpan, rowSpan: rowSpan,
    width: w ? { size: w, type: WidthType.DXA } : undefined,
    borders: allBorders("BBBBBB", 2),
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: CM, verticalAlign: vAlign,
    children: Array.isArray(children) ? children : [children],
  });
}

function labelCell(text, w = 2800, bg = C.navyLight) {
  return dCell(p(text, { bold: true, size: 20 }), { w, bg });
}

function valueCell(text, w, italic = false) {
  if (!text) return dCell(p("", { size: 20 }), { w });
  const lines = String(text).split('\n');
  const paragraphs = lines.map(line => p(line, { italic, size: 20, spBefore: 20, spAfter: 20 }));
  return dCell(paragraphs, { w });
}

function bannerTable(text, bg = C.navyDark, textColor = C.white, textSize = 22) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: CONTENT_W, type: WidthType.DXA },
        borders: allBorders(C.navyMid, 4),
        shading: { fill: bg, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text, bold: true, size: textSize, color: textColor, font: "Arial" })],
        })],
      }),
    ]})],
  });
}

function sectionBannerRow(text, colSpan = 2, bg = C.navyDark) {
  return new TableRow({ children: [
    new TableCell({
      columnSpan: colSpan,
      borders: allBorders(C.navyMid, 4),
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [p(text, { bold: true, size: 21, color: C.white })],
    }),
  ]});
}

function subSectionRow(text, colSpan = 2, bg = C.navyMid) {
  return new TableRow({ children: [
    new TableCell({
      columnSpan: colSpan,
      borders: allBorders(C.navyMid, 3),
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 140, right: 140 },
      children: [p(text, { bold: true, size: 20, color: C.white })],
    }),
  ]});
}

// ─────────────────────────────────────────────
// BAGIAN I: HEADER / IDENTITAS SEKOLAH
// ─────────────────────────────────────────────
function makeSchoolHeader() {
  // Banner utama
  const headerBanner = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: allBorders(C.navyDark, 6),
        shading: { fill: C.navyDark, type: ShadingType.CLEAR },
        margins: { top: 160, bottom: 160, left: 200, right: 200 },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "FORMAT CAPAIAN PEMBELAJARAN", bold: true, size: 32, color: C.white, font: "Arial" })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "SMK Muhammadiyah 3 Purbalingga", bold: true, size: 26, color: C.yellow, font: "Arial" })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Kurikulum Merdeka  │  Pendekatan Deep Learning", bold: false, size: 22, color: C.navyLight, font: "Arial" })] }),
        ],
      }),
    ]})]
  });

  // Visi Banner
  const visiTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2000, CONTENT_W - 2000],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: allBorders(C.yellow, 4),
        shading: { fill: C.yellow, type: ShadingType.CLEAR },
        margins: CM, verticalAlign: VerticalAlign.CENTER,
        children: [p("VISI", { bold: true, size: 22, color: C.navyDark, align: AlignmentType.CENTER })],
      }),
      new TableCell({
        borders: allBorders(C.yellow, 4),
        shading: { fill: C.yellowLight, type: ShadingType.CLEAR },
        margins: CM,
        children: [p("MENJADIKAN SMK YANG UNGGUL, ISLAMI, DAN BERJIWA ENTREPRENEUR", { bold: true, size: 22, color: C.navyDark })],
      }),
    ]})],
  });

  // MISI
  const misiRows = [
    "Menyelenggarakan pendidikan dan pembiasaan nilai-nilai Islami berbasis Industri.",
    "Menyelenggarakan pendidikan yang mendorong peserta didik mahir pada keahlian bidang Informasi, Media dan Teknologi.",
    "Membekali peserta didik dengan pendidikan yang mendorong peserta didik dalam berinovasi dan mengembangkan diri.",
    "Membekali peserta didik dengan pendidikan kecakapan hidup.",
    "Membina dan membekali peserta didik yang berjiwa kompetitif.",
    "Membekali siswa dengan pendidikan Entrepreneur.",
    "Menyelenggarakan pendidikan berbasis industri / dunia usaha.",
    "Menyelenggarakan pendidikan berwawasan global dan kearifan lokal.",
  ];

  const misiTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1800, CONTENT_W - 1800],
    rows: [
      new TableRow({ children: [
        hCell("MISI", { w: 1800, bg: C.navyMid, colSpan: 1 }),
        hCell("Uraian Misi Sekolah", { bg: C.navyMid }),
      ]}),
      ...misiRows.map((m, i) => new TableRow({ children: [
        dCell(p(`${i + 1}.`, { bold: true, size: 20, align: AlignmentType.CENTER }), { w: 1800, bg: C.gray }),
        dCell(p(m, { size: 20 }), {}),
      ]})),
    ],
  });

  return [headerBanner, pEmpty(80), visiTable, pEmpty(80), misiTable];
}

// ─────────────────────────────────────────────
// BAGIAN II: 8 DIMENSI PROFIL LULUSAN
// ─────────────────────────────────────────────
function makeDimensiSection() {
  const dimensiData = [
    { no: "1", nama: "Keimanan dan Ketakwaan terhadap Tuhan YME", deskripsi: "Memiliki keyakinan spiritual, berakhlak mulia, dan mengamalkannya dalam kehidupan sehari-hari." },
    { no: "2", nama: "Kewargaan (Citizenship)", deskripsi: "Memiliki jiwa nasionalisme, cinta tanah air, toleransi dalam keberagaman, serta kepedulian terhadap lingkungan dan masyarakat global." },
    { no: "3", nama: "Penalaran Kritis", deskripsi: "Mampu memproses informasi secara logis, objektif, serta mampu menganalisis dan memecahkan masalah." },
    { no: "4", nama: "Kreativitas", deskripsi: "Mampu menghasilkan gagasan, karya, atau tindakan orisinal serta inovatif untuk beradaptasi dengan berbagai situasi." },
    { no: "5", nama: "Kemandirian", deskripsi: "Bertanggung jawab atas proses belajarnya sendiri, mampu mengatur waktu, dan memiliki inisiatif tinggi tanpa ketergantungan penuh." },
    { no: "6", nama: "Kolaborasi", deskripsi: "Kemampuan bekerja sama secara efektif, menghargai pendapat orang lain, dan berkontribusi secara positif dalam kelompok." },
    { no: "7", nama: "Komunikasi", deskripsi: "Terampil menyampaikan ide, gagasan, dan perasaan secara jelas, efektif, dan santun, baik secara lisan maupun tulisan." },
    { no: "8", nama: "Kesehatan", deskripsi: "Memiliki kesadaran dan kemampuan dalam menjaga kesejahteraan fisik dan mental agar siap dan optimal dalam beraktivitas." },
  ];

  const W3 = [700, 3000, CONTENT_W - 700 - 3000];

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W3,
    rows: [
      new TableRow({ children: [
        hCell("No", { w: W3[0] }),
        hCell("Dimensi Profil Lulusan", { w: W3[1] }),
        hCell("Deskripsi", {}),
      ]}),
      ...dimensiData.map(d => new TableRow({ children: [
        dCell(p(d.no, { size: 20, align: AlignmentType.CENTER }), { w: W3[0], bg: C.gray }),
        dCell(p(d.nama, { bold: true, size: 20 }), { w: W3[1] }),
        dCell(p(d.deskripsi, { size: 20, italic: true }), {}),
      ]})),
    ],
  });
}

// ─────────────────────────────────────────────
// BAGIAN III: PETUNJUK PENGISIAN
// ─────────────────────────────────────────────
function makePetunjukSection() {
  const petunjukData = [
    { bag: "A", komponen: "Identitas Mata Pelajaran", petunjuk: "Isi sesuai data mata pelajaran, program keahlian, fase, kelas, dan alokasi waktu yang diajarkan." },
    { bag: "B", komponen: "Capaian Pembelajaran", petunjuk: "Salin teks CP dari dokumen Kepmendikbudristek yang berlaku. Pastikan sesuai dengan fase dan program keahlian." },
    { bag: "C", komponen: "Analisis & Kontekstualisasi", petunjuk: "Jabarkan kompetensi inti (pengetahuan, keterampilan, sikap) dan kaitkan dengan konteks lokal Purbalingga serta dunia industri." },
    { bag: "D", komponen: "8 Dimensi Profil Lulusan", petunjuk: "Beri tanda centang (✓) dan uraikan singkat bagaimana mata pelajaran ini mengembangkan dimensi profil yang relevan." },
    { bag: "E", komponen: "Pendekatan Deep Learning", petunjuk: "Jelaskan implementasi 3 aspek deep learning: Mindful (sadar), Meaningful (bermakna), Joyful (menyenangkan)." },
    { bag: "F", komponen: "Strategi Pembelajaran", petunjuk: "Rekomendasikan model pembelajaran, asesmen, dan sumber belajar yang sesuai. Ini menjadi acuan pembuatan ATP dan Modul Ajar." },
    { bag: "G", komponen: "Catatan Pengembangan", petunjuk: "Dokumentasikan adaptasi yang dilakukan, tantangan yang diperkirakan, dan proses validasi oleh Waka Kurikulum & Kepala Sekolah." },
  ];

  const W3 = [700, 2800, CONTENT_W - 700 - 2800];

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W3,
    rows: [
      new TableRow({ children: [
        hCell("Bag.", { w: W3[0] }),
        hCell("Komponen", { w: W3[1] }),
        hCell("Petunjuk Pengisian", {}),
      ]}),
      ...petunjukData.map((d, i) => new TableRow({ children: [
        dCell(p(d.bag, { bold: true, size: 20, align: AlignmentType.CENTER }), { w: W3[0], bg: i % 2 === 0 ? C.navyLight : C.gray }),
        dCell(p(d.komponen, { bold: true, size: 20 }), { w: W3[1], bg: i % 2 === 0 ? C.white : C.gray }),
        dCell(p(d.petunjuk, { size: 20, italic: true }), { bg: i % 2 === 0 ? C.white : C.gray }),
      ]})),
    ],
  });
}

// ─────────────────────────────────────────────
// BAGIAN IV: FORMAT CP MATA PELAJARAN UTAMA
// ─────────────────────────────────────────────
export async function generateAndDownloadDocx(data, aiData) {
  const W2 = [3200, CONTENT_W - 3200];

  function lv(label, value) {
    return new TableRow({ children: [
      labelCell(label, W2[0]),
      valueCell(value || "...", W2[1]),
    ]});
  }

  // Dimensi profil with checkboxes
  const dimNames = [
    "Keimanan & Ketakwaan",
    "Kewargaan (Citizenship)",
    "Penalaran Kritis",
    "Kreativitas",
    "Kemandirian",
    "Kolaborasi",
    "Komunikasi",
    "Kesehatan",
  ];
  const dimProfilTexts = dimNames.map((name, i) => {
    const key = `dimensi${i + 1}`;
    const val = aiData.dimensiProfil[key];
    if (val && val.trim()) {
      return p(`☑ ${i + 1}. ${name} → ${val}`, { size: 20, spBefore: 20, spAfter: 20 });
    }
    return p(`☐ ${i + 1}. ${name}`, { size: 20, spBefore: 20, spAfter: 20 });
  });

  // Tanda tangan row
  const today = new Date();
  const dateStr = `Purbalingga, ${today.getDate()} ${['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][today.getMonth()]} ${today.getFullYear()}`;

  const W3ttd = [Math.floor(CONTENT_W / 3), Math.floor(CONTENT_W / 3), CONTENT_W - Math.floor(CONTENT_W / 3) * 2];
  const ttdRow = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W3ttd,
    rows: [
      new TableRow({ children: [
        dCell([
          p("Diverifikasi oleh", { bold: true, size: 20, align: AlignmentType.CENTER }),
          p("Waka Kurikulum", { size: 20, align: AlignmentType.CENTER }),
          pEmpty(200),
          pEmpty(200),
          pEmpty(200),
          p(data.waka || ".................................", { bold: true, size: 20, align: AlignmentType.CENTER, underline: true }),
        ], { w: W3ttd[0] }),
        dCell([
          p(dateStr, { bold: false, size: 20, align: AlignmentType.CENTER }),
          p("Guru Mata Pelajaran", { size: 20, align: AlignmentType.CENTER }),
          pEmpty(200),
          pEmpty(200),
          pEmpty(200),
          p(data.teacher || ".................................", { bold: true, size: 20, align: AlignmentType.CENTER, underline: true }),
        ], { w: W3ttd[1] }),
        dCell([
          p("Disetujui oleh", { bold: true, size: 20, align: AlignmentType.CENTER }),
          p("Kepala Sekolah", { size: 20, align: AlignmentType.CENTER }),
          pEmpty(200),
          pEmpty(200),
          pEmpty(200),
          p(data.principal || ".................................", { bold: true, size: 20, align: AlignmentType.CENTER, underline: true }),
        ], { w: W3ttd[2] }),
      ]}),
    ],
  });

  const mainTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W2,
    rows: [
      // ─── A. IDENTITAS ───
      sectionBannerRow("A. IDENTITAS MATA PELAJARAN"),
      lv("Nama Mata Pelajaran", data.subject),
      lv("Program Keahlian", data.program),
      lv("Fase", data.phase),
      lv("Kelas", data.grade),
      lv("Semester", data.semester),
      lv("Tahun Pelajaran", data.year),
      lv("Alokasi Waktu", data.time),
      lv("Guru Mata Pelajaran", data.teacher),

      // ─── B. CAPAIAN PEMBELAJARAN ───
      sectionBannerRow("B. CAPAIAN PEMBELAJARAN"),
      subSectionRow("B.1  Capaian Pembelajaran Umum (dari Kepmendikbudristek)"),
      lv("Elemen CP", data.elemcp || "—"),
      lv("Deskripsi CP", data.cpText),
      subSectionRow("B.2  Capaian Pembelajaran Per Elemen"),
      lv("Elemen 1", data.elemen1 || "—"),
      lv("Capaian Elemen 1", data.capaian1 || "—"),
      lv("Elemen 2", data.elemen2 || "—"),
      lv("Capaian Elemen 2", data.capaian2 || "—"),

      // ─── C. ANALISIS ───
      sectionBannerRow("C. ANALISIS DAN KONTEKSTUALISASI CP"),
      lv("Kompetensi Inti yang Dikembangkan", aiData.analisis.kompetensiInti),
      lv("Koneksi dengan Dunia Kerja / Industri", aiData.analisis.koneksiIndustri),
      lv("Koneksi dengan Konteks Lokal", aiData.analisis.koneksiLokal),

      // ─── D. 8 DIMENSI ───
      sectionBannerRow("D. KETERKAITAN DENGAN 8 DIMENSI PROFIL LULUSAN"),
      new TableRow({ children: [
        labelCell("Dimensi Profil yang Dikembangkan", W2[0]),
        dCell(dimProfilTexts, { w: W2[1] }),
      ]}),

      // ─── E. DEEP LEARNING ───
      sectionBannerRow("E. PENDEKATAN DEEP LEARNING"),
      lv("Mindful Learning (Pembelajaran Penuh Kesadaran)", aiData.deepLearning.mindful),
      lv("Meaningful Learning (Pembelajaran Bermakna)", aiData.deepLearning.meaningful),
      lv("Joyful Learning (Pembelajaran yang Menyenangkan)", aiData.deepLearning.joyful),

      // ─── F. STRATEGI ───
      sectionBannerRow("F. REKOMENDASI STRATEGI PEMBELAJARAN"),
      lv("Model Pembelajaran yang Disarankan", aiData.strategi.model),
      lv("Pendekatan Asesmen", aiData.strategi.asesmen),
      lv("Sumber & Media Belajar", aiData.strategi.media),
      lv("Alat / Perangkat yang Dibutuhkan", aiData.strategi.alat),

      // ─── G. CATATAN PENGEMBANGAN ───
      sectionBannerRow("G. CATATAN PENGEMBANGAN"),
      lv("Catatan Kontekstualisasi CP", data.catatan || "—"),
      lv("Tantangan & Solusi Antisipasi", data.tantangan || "—"),
    ],
  });

  // ─── Catatan Penting Footer ───
  const catatanPenting = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [
      new TableRow({ children: [
        new TableCell({
          borders: allBorders(C.navyMid, 3),
          shading: { fill: C.navyLight, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 200, right: 200 },
          children: [
            p("📌 Catatan Penting untuk Guru:", { bold: true, size: 20, color: C.textBlue }),
            p("• Format CP ini bersifat template — sesuaikan setiap bagian dengan mata pelajaran dan program keahlian masing-masing.", { size: 19, italic: true }),
            p("• Pastikan CP yang ditulis merujuk pada dokumen resmi Kepmendikbudristek yang berlaku.", { size: 19, italic: true }),
            p("• Libatkan minimal 1 (satu) Dimensi Profil Lulusan yang relevan pada setiap mata pelajaran.", { size: 19, italic: true }),
            p("• Dokumen yang telah diisi wajib diverifikasi Waka Kurikulum dan disimpan sebagai arsip kurikulum sekolah.", { size: 19, italic: true }),
          ],
        }),
      ]}),
    ],
  });

  // ─── BUILD DOCUMENT ───
  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 20 } } } },
    sections: [
      // ── HALAMAN 1: Bagian I, II, III ──
      {
        properties: {
          page: {
            size: { width: PAGE_W, height: PAGE_H },
            margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
          },
        },
        children: [
          // BAGIAN I
          ...makeSchoolHeader(),
          pEmpty(120),

          // BAGIAN II
          bannerTable("BAGIAN II — 8 DIMENSI PROFIL LULUSAN SMK MUHAMMADIYAH 3 PURBALINGGA", C.navyMid, C.white, 22),
          pEmpty(80),
          makeDimensiSection(),
          pEmpty(120),

          // BAGIAN III
          bannerTable("BAGIAN III — PETUNJUK PENGISIAN FORMAT CAPAIAN PEMBELAJARAN", C.navyMid, C.white, 22),
          pEmpty(80),
          makePetunjukSection(),
          pEmpty(160),
        ],
      },
      // ── HALAMAN 2: Bagian IV (Form CP) ──
      {
        properties: {
          page: {
            size: { width: PAGE_W, height: PAGE_H },
            margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
          },
        },
        children: [
          bannerTable("BAGIAN IV — FORMAT CAPAIAN PEMBELAJARAN MATA PELAJARAN", C.navyDark, C.white, 24),
          bannerTable("SMK Muhammadiyah 3 Purbalingga  │  Kurikulum Merdeka  │  Pendekatan Deep Learning", C.navyMid, C.white, 20),
          pEmpty(120),
          mainTable,
          pEmpty(120),
          ttdRow,
          pEmpty(80),
          catatanPenting,
          pEmpty(80),
          bannerTable("SMK MUHAMMADIYAH 3 PURBALINGGA  •  Unggul  •  Islami  •  Berjiwa Entrepreneur", C.navyDark, C.yellow, 20),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Format_CP_${(data.subject || "Mapel").replace(/ /g, '_')}.docx`);
}
