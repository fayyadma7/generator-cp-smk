import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  PageOrientation,
} from "docx";
import { saveAs } from "file-saver";

// ═══════════════════════════════════════════════════════════
// KONSTANTA
// ═══════════════════════════════════════════════════════════
const C = {
  navyDark:   "1F3864",
  navyMid:    "2E5D9E",
  navyLight:  "D6E4F0",
  yellow:     "FFC000",
  yellowLight:"FFF2CC",
  white:      "FFFFFF",
  gray:       "F2F2F2",
  grayDark:   "D9D9D9",
  textDark:   "1A1A1A",
  textBlue:   "1F3864",
  green:      "375623",
  greenLight: "E2EFDA",
};

const PAGE_W    = 11906;  // A4 portrait
const PAGE_H    = 16838;  // A4 portrait
const PAGE_L_W  = 16838;  // A4 landscape width
const MARGIN    = 1080;
const CONTENT_W = PAGE_W - MARGIN * 2;
const CONTENT_L_W = PAGE_L_W - MARGIN * 2;
const CM        = { top: 80, bottom: 80, left: 140, right: 140 };

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════
const solidBorder = (color = C.navyMid, sz = 4) => ({ style: BorderStyle.SINGLE, size: sz, color });
const allBorders  = (color = "AAAAAA", sz = 3)  => { const b = solidBorder(color, sz); return { top: b, bottom: b, left: b, right: b }; };

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

function hCell(text, opts = {}) {
  const { colSpan = 1, rowSpan = 1, w, bg = C.navyDark, size = 20, align = AlignmentType.CENTER, txtColor = C.white } = opts;
  return new TableCell({
    columnSpan: colSpan, rowSpan: rowSpan,
    width: w ? { size: w, type: WidthType.DXA } : undefined,
    borders: allBorders(C.navyMid, 4),
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: CM, verticalAlign: VerticalAlign.CENTER,
    children: [p(text, { bold: true, size, color: txtColor, align, spBefore: 40, spAfter: 40 })],
  });
}

function dCell(children, opts = {}) {
  const { w, bg = C.white, colSpan = 1, rowSpan = 1, vAlign = VerticalAlign.TOP, borders } = opts;
  return new TableCell({
    columnSpan: colSpan, rowSpan: rowSpan,
    width: w ? { size: w, type: WidthType.DXA } : undefined,
    borders: borders || allBorders("BBBBBB", 2),
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: CM, verticalAlign: vAlign,
    children: Array.isArray(children) ? children : [children],
  });
}

const labelCell = (text, w, bg = C.navyLight) => dCell(p(text, { bold: true, size: 20 }), { w, bg });
function valueCell(text, w) {
  if (!text) return dCell(p("", { size: 20 }), { w });
  return dCell(String(text).split("\n").map(l => p(l, { size: 20, spBefore: 20, spAfter: 20 })), { w });
}

function bannerTable(text, bg = C.navyDark, textColor = C.white, textSize = 22, subText = null, w = CONTENT_W) {
  const children = [p(text, { bold: true, size: textSize, color: textColor, align: AlignmentType.CENTER })];
  if (subText) children.push(p(subText, { size: textSize - 4, color: textColor, align: AlignmentType.CENTER }));
  return new Table({
    width: { size: w, type: WidthType.DXA },
    columnWidths: [w],
    rows: [new TableRow({ children: [new TableCell({
      borders: allBorders(C.navyMid, 4),
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 140, bottom: 140, left: 200, right: 200 },
      children,
    })] })],
  });
}

function secHeader(text) {
  return bannerTable(text, C.navyDark, C.white, 22);
}

// ═══════════════════════════════════════════════════════════
// SECTIONS FOR PORTRAIT
// ═══════════════════════════════════════════════════════════

function bagA() {
  const t = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    rows: [new TableRow({ children: [
      dCell([
        p("Apa itu Tujuan Pembelajaran (TP)?", { bold: true, size: 20, color: C.textBlue }),
        p("Tujuan Pembelajaran adalah jabaran operasional dari Capaian Pembelajaran (CP) yang menggambarkan kompetensi spesifik yang harus dikuasai peserta didik dalam satu atau beberapa kali pertemuan. TP bersifat terukur dan dapat diobservasi.", { size: 20 }),
        pEmpty(40),
        p("Prinsip Perumusan Tujuan Pembelajaran:", { bold: true, size: 20, color: C.textBlue }),
        p("• Mengacu pada Capaian Pembelajaran (CP) yang telah disusun.", { size: 20 }),
        p("• Menggunakan kata kerja operasional (KKO) yang terukur sesuai Taksonomi Bloom (C1-C6).", { size: 20 }),
        p("• Memuat komponen: Audience + Behavior + Condition + Degree (ABCD).", { size: 20 }),
        p("• Berkontribusi pada pengembangan Profil Lulusan SMK Muhammadiyah 3 Purbalingga.", { size: 20 }),
        p("• Mendukung pendekatan Deep Learning: Mindful, Meaningful, dan/atau Joyful.", { size: 20 }),
        p("• Disusun secara progresif dari level kognitif rendah menuju tinggi.", { size: 20 }),
      ], { bg: C.navyLight })
    ]})]
  });
  return [secHeader("BAGIAN A - DASAR DAN PRINSIP PENGEMBANGAN TP"), pEmpty(80), t];
}

function bagB(data) {
  const W = [3000, CONTENT_W - 3000];
  const t = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      new TableRow({ children: [hCell("IDENTITAS MATA PELAJARAN", { colSpan: 2, bg: C.navyMid })] }),
      new TableRow({ children: [labelCell("Nama Mata Pelajaran", W[0]), valueCell(data.subject, W[1])] }),
      new TableRow({ children: [labelCell("Program Keahlian", W[0]), valueCell(data.program, W[1])] }),
      new TableRow({ children: [labelCell("Fase / Kelas", W[0]), valueCell(`${data.phase} / ${data.grade}`, W[1])] }),
      new TableRow({ children: [labelCell("Semester", W[0]), valueCell(data.semester, W[1])] }),
      new TableRow({ children: [labelCell("Tahun Pelajaran", W[0]), valueCell(data.year, W[1])] }),
      new TableRow({ children: [labelCell("Alokasi Waktu Total", W[0]), valueCell(`${data.timeTotal} JP`, W[1])] }),
      new TableRow({ children: [labelCell("Guru Mata Pelajaran", W[0]), valueCell(data.teacher, W[1])] }),
    ]
  });
  return [secHeader("BAGIAN B - IDENTITAS MATA PELAJARAN"), pEmpty(80), t];
}

function bagC(data) {
  const W = [3000, CONTENT_W - 3000];
  const t = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      new TableRow({ children: [hCell("Capaian Pembelajaran (CP) Rujukan", { colSpan: 2, bg: C.navyMid })] }),
      new TableRow({ children: [labelCell("Fase", W[0]), valueCell(data.phase, W[1])] }),
      new TableRow({ children: [labelCell("Deskripsi CP", W[0]), valueCell(data.cpText, W[1])] }),
    ]
  });
  return [secHeader("BAGIAN C - RINGKASAN CAPAIAN PEMBELAJARAN"), pEmpty(80), t];
}

function bagD(tps) {
  const W = [800, 4800, 1600, 2000, 1000];
  const rows = [
    new TableRow({ children: [
      hCell("No. TP", { w: W[0] }), hCell("Rumusan Tujuan Pembelajaran", { w: W[1] }),
      hCell("Level Kognitif", { w: W[2] }), hCell("Dimensi Profil", { w: W[3] }), hCell("Waktu", { w: W[4] })
    ]})
  ];

  (tps || []).forEach((tp, i) => {
    rows.push(new TableRow({ children: [
      dCell(p(tp.id, { bold: true, align: AlignmentType.CENTER }), { w: W[0], bg: i % 2 === 0 ? C.white : C.gray, vAlign: VerticalAlign.CENTER }),
      dCell(p(tp.rumusanTp), { w: W[1], bg: i % 2 === 0 ? C.white : C.gray }),
      dCell(p(tp.levelKognitif, { align: AlignmentType.CENTER }), { w: W[2], bg: i % 2 === 0 ? C.white : C.gray, vAlign: VerticalAlign.CENTER }),
      dCell(p(tp.dimensiProfil, { align: AlignmentType.CENTER }), { w: W[3], bg: i % 2 === 0 ? C.white : C.gray, vAlign: VerticalAlign.CENTER }),
      dCell(p(tp.alokasiWaktu, { align: AlignmentType.CENTER }), { w: W[4], bg: i % 2 === 0 ? C.white : C.gray, vAlign: VerticalAlign.CENTER })
    ]}));
  });

  const t = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: W, rows });
  return [
    secHeader("BAGIAN D - TABEL TUJUAN PEMBELAJARAN (TP)"), pEmpty(80),
    p("Rumuskan TP menggunakan komponen ABCD dan terhubung dengan CP.", { italic: true }), pEmpty(40),
    t
  ];
}

function bagE(tps) {
  const W = [800, 3400, 3000, 1500, 1500];
  const rows = [
    new TableRow({ children: [
      hCell("No", { w: W[0] }), hCell("Rumusan TP (singkat)", { w: W[1] }),
      hCell("Indikator Ketercapaian (IKTP)", { w: W[2] }), hCell("Bentuk Asesmen", { w: W[3] }), hCell("Instrumen", { w: W[4] })
    ]})
  ];

  (tps || []).forEach((tp, i) => {
    rows.push(new TableRow({ children: [
      dCell(p(tp.id, { bold: true, align: AlignmentType.CENTER }), { w: W[0], bg: i % 2 === 0 ? C.white : C.gray, vAlign: VerticalAlign.CENTER }),
      dCell(p(tp.rumusanTp), { w: W[1], bg: i % 2 === 0 ? C.white : C.gray }),
      dCell(p(tp.iktp), { w: W[2], bg: i % 2 === 0 ? C.white : C.gray }),
      dCell(p(tp.bentukAsesmen, { align: AlignmentType.CENTER }), { w: W[3], bg: i % 2 === 0 ? C.white : C.gray }),
      dCell(p(tp.instrumen, { align: AlignmentType.CENTER }), { w: W[4], bg: i % 2 === 0 ? C.white : C.gray })
    ]}));
  });

  const t = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: W, rows });
  return [secHeader("BAGIAN E - INDIKATOR KETERCAPAIAN (IKTP) & ASESMEN"), pEmpty(80), t];
}

function bagF(data, notes) {
  const today = new Date();
  const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const dateStr = `Purbalingga, ${today.getDate()} ${BULAN[today.getMonth()]} ${today.getFullYear()}`;

  const W = [3000, CONTENT_W - 3000];
  const t1 = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      new TableRow({ children: [labelCell("Catatan Kontekstualisasi", W[0]), valueCell(notes?.kontekstualisasi, W[1])] }),
      new TableRow({ children: [labelCell("Kesesuaian Deep Learning", W[0]), valueCell(notes?.kesesuaianDeepLearning, W[1])] }),
      new TableRow({ children: [labelCell("Model Pembelajaran", W[0]), valueCell(notes?.modelPembelajaran, W[1])] }),
    ]
  });

  const W3 = [Math.floor(CONTENT_W / 3), Math.floor(CONTENT_W / 3), CONTENT_W - Math.floor(CONTENT_W / 3) * 2];
  const t2 = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W3,
    rows: [new TableRow({ children: [
      dCell([
        p("Diverifikasi oleh", { bold: true, size: 20, align: AlignmentType.CENTER }),
        p("Waka Kurikulum", { size: 20, align: AlignmentType.CENTER }),
        pEmpty(160), pEmpty(160), pEmpty(80),
        p(data.waka || ".............................", { bold: true, size: 20, align: AlignmentType.CENTER, underline: true }),
      ], { w: W3[0] }),
      dCell([
        p(dateStr, { size: 20, align: AlignmentType.CENTER }),
        p("Guru Mata Pelajaran", { size: 20, align: AlignmentType.CENTER }),
        pEmpty(160), pEmpty(160), pEmpty(80),
        p(data.teacher || ".............................", { bold: true, size: 20, align: AlignmentType.CENTER, underline: true }),
      ], { w: W3[1] }),
      dCell([
        p("Disetujui oleh", { bold: true, size: 20, align: AlignmentType.CENTER }),
        p("Kepala Sekolah", { size: 20, align: AlignmentType.CENTER }),
        pEmpty(160), pEmpty(160), pEmpty(80),
        p(data.principal || ".............................", { bold: true, size: 20, align: AlignmentType.CENTER, underline: true }),
      ], { w: W3[2] }),
    ]})]
  });

  return [secHeader("BAGIAN F - CATATAN PENGEMBANGAN DAN VALIDASI TP"), pEmpty(80), t1, pEmpty(120), t2];
}

// ═══════════════════════════════════════════════════════════
// SECTIONS FOR LANDSCAPE (ATP)
// ═══════════════════════════════════════════════════════════

function atpTable(tps, atpData) {
  const W = [800, 3000, 3000, 1800, 2000, 1000, 1500, 1600];
  const rows = [
    new TableRow({ children: [
      hCell("No.", { w: W[0] }), hCell("Tujuan Pembelajaran", { w: W[1] }),
      hCell("Materi / Konten Esensial", { w: W[2] }), hCell("Dimensi Profil", { w: W[3] }),
      hCell("Pendekatan Deep Learning", { w: W[4] }), hCell("Waktu", { w: W[5] }),
      hCell("Asesmen", { w: W[6] }), hCell("Pertemuan", { w: W[7] })
    ]})
  ];

  let currentSemester = null;

  (atpData || []).forEach((item, i) => {
    // Cari rumusan TP dari array tps
    const tpRef = tps?.find(t => t.id === item.idTp);
    const rumusan = tpRef ? tpRef.rumusanTp : "...";

    if (item.semester && item.semester !== currentSemester) {
      currentSemester = item.semester;
      rows.push(new TableRow({ children: [
        hCell(`SEMESTER ${currentSemester.toUpperCase()}`, { colSpan: 8, bg: C.yellow, txtColor: C.navyDark, align: AlignmentType.LEFT })
      ]}));
    }

    rows.push(new TableRow({ children: [
      dCell(p(item.idTp, { bold: true, align: AlignmentType.CENTER }), { w: W[0], bg: i % 2 === 0 ? C.white : C.gray, vAlign: VerticalAlign.CENTER }),
      dCell(p(rumusan), { w: W[1], bg: i % 2 === 0 ? C.white : C.gray }),
      dCell(pMulti(item.materi.split('\n').map(l => ({ text: l + '\n' }))), { w: W[2], bg: i % 2 === 0 ? C.white : C.gray }),
      dCell(p(item.dimensiProfil, { align: AlignmentType.CENTER }), { w: W[3], bg: i % 2 === 0 ? C.white : C.gray }),
      dCell(p(item.deepLearning, { align: AlignmentType.CENTER }), { w: W[4], bg: i % 2 === 0 ? C.white : C.gray }),
      dCell(p(item.waktu, { align: AlignmentType.CENTER, bold: true }), { w: W[5], bg: i % 2 === 0 ? C.white : C.gray, vAlign: VerticalAlign.CENTER }),
      dCell(p(item.asesmen, { align: AlignmentType.CENTER }), { w: W[6], bg: i % 2 === 0 ? C.white : C.gray }),
      dCell(p(item.pertemuan, { align: AlignmentType.CENTER, italic: true }), { w: W[7], bg: i % 2 === 0 ? C.white : C.gray, vAlign: VerticalAlign.CENTER }),
    ]}));
  });

  const t = new Table({ width: { size: CONTENT_L_W, type: WidthType.DXA }, columnWidths: W, rows });
  
  return [
    bannerTable("FORMAT ALUR TUJUAN PEMBELAJARAN (ATP)", C.navyDark, C.white, 24, "SMK Muhammadiyah 3 Purbalingga | Kurikulum Merdeka", CONTENT_L_W),
    pEmpty(80),
    p("Apa itu Alur Tujuan Pembelajaran (ATP)? ATP adalah urutan/sekuens TP yang disusun secara logis dan sistematis dari sederhana ke kompleks.", { italic: true }),
    pEmpty(80),
    t
  ];
}


// ═══════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════
export async function generateAndDownloadTpAtp(data, aiData) {
  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 20 } } } },
    sections: [
      // ── HALAMAN 1 (PORTRAIT): FORMAT TP ──
      {
        properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
        children: [
          bannerTable("FORMAT TUJUAN PEMBELAJARAN (TP)", C.navyDark, C.white, 26, "SMK Muhammadiyah 3 Purbalingga | Kurikulum Merdeka | Deep Learning"),
          pEmpty(120),
          ...bagA(), pEmpty(120),
          ...bagB(data), pEmpty(120),
          ...bagC(data), pEmpty(120),
          ...bagD(aiData.tujuanPembelajaran), pEmpty(120),
          ...bagE(aiData.tujuanPembelajaran), pEmpty(120),
          ...bagF(data, aiData.catatan), pEmpty(120)
        ],
      },
      // ── HALAMAN 2 (LANDSCAPE): ATP ──
      {
        properties: { 
          page: { 
            size: { orientation: PageOrientation.LANDSCAPE }, 
            margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } 
          } 
        },
        children: [
          ...atpTable(aiData.tujuanPembelajaran, aiData.alurTujuanPembelajaran)
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Format_TP_ATP_${(data.subject || "Mapel").replace(/ /g, "_")}.docx`);
}
