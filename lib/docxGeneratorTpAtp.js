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
  // Classic Core
  navyDark:    "1F3864",
  navyMid:     "2E5D9E",
  navyLight:   "D6E4F0",
  white:       "FFFFFF",
  gray:        "F8F9FA",
  grayDark:    "E9ECEF",
  textDark:    "212529",
  textBlue:    "1F3864",

  // Teal Theme
  tealDark:    "005B60",
  tealMid:     "00796B",
  tealLight:   "E0F2F1",

  // Green Theme
  greenDark:   "1E4620",
  greenMid:    "2E7D32",
  greenLight:  "E8F5E9",
  green:       "375623", // Compatibility alias
  greenLightOld:"E2EFDA",

  // Purple Theme
  purpleDark:  "4A148C",
  purpleMid:   "7B1FA2",
  purpleLight: "F3E5F5",

  // Orange Theme
  orangeDark:  "C55A11",
  orangeMid:   "D84315",
  orangeLight: "FCE4D6",

  // Yellow Theme
  yellowDark:  "B7791F",
  yellowMid:   "FFC000",
  yellowLight: "FFF2CC",
  yellow:      "FFC000", // Compatibility alias
};

const PAGE_W    = 11906;  // A4 portrait
const PAGE_H    = 16838;  // A4 portrait
const PAGE_L_W  = 16838;  // A4 landscape width
const MARGIN    = 1080;
const CONTENT_W = PAGE_W - MARGIN * 2;
const CONTENT_L_W = PAGE_L_W - MARGIN * 2;
const CM        = { top: 100, bottom: 100, left: 150, right: 150 };
const CM_ANS    = { top: 120, bottom: 120, left: 150, right: 150 };


// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════
const solidBorder = (color = C.navyMid, sz = 4) => ({ style: BorderStyle.SINGLE, size: sz, color });
const allBorders  = (color = "AAAAAA", sz = 3)  => { const b = solidBorder(color, sz); return { top: b, bottom: b, left: b, right: b }; };
const noBorder    = () => { const b = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }; return { top: b, bottom: b, left: b, right: b }; };

function makeCoverPage(title, data) {
  const outerBorder = { style: BorderStyle.DOUBLE, size: 12, color: C.navyDark };
  const borderObj = { top: outerBorder, bottom: outerBorder, left: outerBorder, right: outerBorder };

  const schoolName = "SMK MUHAMMADIYAH 3 PURBALINGGA";
  const schoolTagline = "Unggul • Islami • Berjiwa Entrepreneur";

  const metadataRows = [
    new TableRow({
      children: [
        dCell(p("Mata Pelajaran", { bold: true, size: 20, color: C.textBlue }), { w: 3000, borders: noBorder() }),
        dCell(p(`:  ${data.subject || "—"}`, { size: 20 }), { w: CONTENT_W - 3000 - 800, borders: noBorder() }),
      ]
    }),
    new TableRow({
      children: [
        dCell(p("Program Keahlian", { bold: true, size: 20, color: C.textBlue }), { w: 3000, borders: noBorder() }),
        dCell(p(`:  ${data.program || "—"}`, { size: 20 }), { w: CONTENT_W - 3000 - 800, borders: noBorder() }),
      ]
    }),
    new TableRow({
      children: [
        dCell(p("Fase / Kelas", { bold: true, size: 20, color: C.textBlue }), { w: 3000, borders: noBorder() }),
        dCell(p(`:  ${data.phase || "—"} / ${data.grade || "—"}`, { size: 20 }), { w: CONTENT_W - 3000 - 800, borders: noBorder() }),
      ]
    }),
    new TableRow({
      children: [
        dCell(p("Semester", { bold: true, size: 20, color: C.textBlue }), { w: 3000, borders: noBorder() }),
        dCell(p(`:  ${data.semester || "—"}`, { size: 20 }), { w: CONTENT_W - 3000 - 800, borders: noBorder() }),
      ]
    }),
    new TableRow({
      children: [
        dCell(p("Tahun Pelajaran", { bold: true, size: 20, color: C.textBlue }), { w: 3000, borders: noBorder() }),
        dCell(p(`:  ${data.year || "—"}`, { size: 20 }), { w: CONTENT_W - 3000 - 800, borders: noBorder() }),
      ]
    }),
    new TableRow({
      children: [
        dCell(p("Guru Penyusun", { bold: true, size: 20, color: C.textBlue }), { w: 3000, borders: noBorder() }),
        dCell(p(`:  ${data.teacher || "—"}`, { size: 20 }), { w: CONTENT_W - 3000 - 800, borders: noBorder() }),
      ]
    }),
  ];

  const metaTable = new Table({
    width: { size: CONTENT_W - 800, type: WidthType.DXA },
    columnWidths: [3000, CONTENT_W - 3000 - 800],
    borders: noBorder(),
    rows: metadataRows,
  });

  return [
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [CONTENT_W],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: CONTENT_W, type: WidthType.DXA },
              borders: borderObj,
              margins: { top: 900, bottom: 900, left: 400, right: 400 },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                pEmpty(200),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 40 },
                  children: [new TextRun({ text: schoolName, bold: true, size: 28, color: C.navyDark, font: "Arial" })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 120 },
                  children: [new TextRun({ text: schoolTagline, italic: true, size: 18, color: C.navyMid, font: "Arial" })],
                }),
                new Table({
                  width: { size: CONTENT_W - 800, type: WidthType.DXA },
                  columnWidths: [CONTENT_W - 800],
                  borders: {
                    bottom: { style: BorderStyle.SINGLE, size: 12, color: C.yellow },
                    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  },
                  rows: [new TableRow({ children: [dCell([], { borders: noBorder() })] })],
                }),
                pEmpty(800),
                pEmpty(800),

                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 80 },
                  children: [new TextRun({ text: "DOKUMEN PERANGKAT AJAR", bold: true, size: 20, color: C.navyMid, font: "Arial" })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 120 },
                  children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 36, color: C.navyDark, font: "Arial" })],
                }),
                pEmpty(800),
                pEmpty(800),

                new Table({
                  width: { size: CONTENT_W - 800, type: WidthType.DXA },
                  columnWidths: [CONTENT_W - 800],
                  borders: allBorders(C.navyLight, 4),
                  shading: { fill: C.gray, type: ShadingType.CLEAR },
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          borders: allBorders(C.navyLight, 4),
                          margins: { top: 200, bottom: 200, left: 300, right: 300 },
                          children: [metaTable],
                        })
                      ]
                    })
                  ]
                }),

                pEmpty(800),
                pEmpty(800),
                pEmpty(400),

                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0 },
                  children: [new TextRun({ text: "KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI", bold: true, size: 16, color: C.navyMid, font: "Arial" })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 20, after: 0 },
                  children: [new TextRun({ text: `TAHUN AJARAN ${data.year || "—"}`, bold: true, size: 18, color: C.navyDark, font: "Arial" })],
                }),
                pEmpty(200),
              ],
            })
          ]
        })
      ]
    })
  ];
}

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

const labelCell = (text, w, bg = C.tealLight) => dCell(p(text, { bold: true, size: 20, color: C.tealDark }), { w, bg });
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

function secHeader(text, bg = C.navyDark) {
  return bannerTable(text, bg, C.white, 22);
}

// ═══════════════════════════════════════════════════════════
// SECTIONS FOR PORTRAIT
// ═══════════════════════════════════════════════════════════

function bagA() {
  const t = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    rows: [new TableRow({ children: [
      dCell([
        p("Apa itu Tujuan Pembelajaran (TP)?", { bold: true, size: 20, color: C.greenDark }),
        p("Tujuan Pembelajaran adalah jabaran operasional dari Capaian Pembelajaran (CP) yang menggambarkan kompetensi spesifik yang harus dikuasai peserta didik dalam satu atau beberapa kali pertemuan. TP bersifat terukur dan dapat diobservasi.", { size: 20 }),
        pEmpty(40),
        p("Prinsip Perumusan Tujuan Pembelajaran:", { bold: true, size: 20, color: C.greenDark }),
        p("• Mengacu pada Capaian Pembelajaran (CP) yang telah disusun.", { size: 20 }),
        p("• Menggunakan kata kerja operasional (KKO) yang terukur sesuai Taksonomi Bloom (C1-C6).", { size: 20 }),
        p("• Memuat komponen: Audience + Behavior + Condition + Degree (ABCD).", { size: 20 }),
        p("• Berkontribusi pada pengembangan Profil Lulusan SMK Muhammadiyah 3 Purbalingga.", { size: 20 }),
        p("• Mendukung pendekatan Deep Learning: Mindful, Meaningful, dan/atau Joyful.", { size: 20 }),
        p("• Disusun secara progresif dari level kognitif rendah menuju tinggi.", { size: 20 }),
      ], { bg: C.greenLight })
    ]})]
  });
  return [secHeader("BAGIAN A - DASAR DAN PRINSIP PENGEMBANGAN TP", C.greenMid), pEmpty(80), t];
}

function bagB(data) {
  const W = [3000, CONTENT_W - 3000];
  const t = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      new TableRow({ children: [hCell("IDENTITAS MATA PELAJARAN", { colSpan: 2, bg: C.navyMid })] }),
      new TableRow({ children: [labelCell("Nama Mata Pelajaran", W[0], C.navyLight), valueCell(data.subject, W[1])] }),
      new TableRow({ children: [labelCell("Program Keahlian", W[0], C.navyLight), valueCell(data.program, W[1])] }),
      new TableRow({ children: [labelCell("Fase / Kelas", W[0], C.navyLight), valueCell(`${data.phase} / ${data.grade}`, W[1])] }),
      new TableRow({ children: [labelCell("Semester", W[0], C.navyLight), valueCell(data.semester, W[1])] }),
      new TableRow({ children: [labelCell("Tahun Pelajaran", W[0], C.navyLight), valueCell(data.year, W[1])] }),
      new TableRow({ children: [labelCell("Alokasi Waktu Total", W[0], C.navyLight), valueCell(`${data.timeTotal} JP`, W[1])] }),
      new TableRow({ children: [labelCell("Guru Mata Pelajaran", W[0], C.navyLight), valueCell(data.teacher, W[1])] }),
    ]
  });
  return [secHeader("BAGIAN B - IDENTITAS MATA PELAJARAN", C.navyMid), pEmpty(80), t];
}

function bagC(data) {
  const W = [3000, CONTENT_W - 3000];
  const t = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      new TableRow({ children: [hCell("Capaian Pembelajaran (CP) Rujukan", { colSpan: 2, bg: C.navyMid })] }),
      new TableRow({ children: [labelCell("Fase", W[0], C.navyLight), valueCell(data.phase, W[1])] }),
      new TableRow({ children: [labelCell("Deskripsi CP", W[0], C.navyLight), valueCell(data.cpText, W[1])] }),
    ]
  });
  return [secHeader("BAGIAN C - RINGKASAN CAPAIAN PEMBELAJARAN", C.navyMid), pEmpty(80), t];
}

function bagD(tps) {
  const W = [800, 4800, 1600, 2000, 1000];
  const rows = [
    new TableRow({ children: [
      hCell("No. TP", { w: W[0], bg: C.tealMid }), hCell("Rumusan Tujuan Pembelajaran", { w: W[1], bg: C.tealMid }),
      hCell("Level Kognitif", { w: W[2], bg: C.tealMid }), hCell("Dimensi Profil", { w: W[3], bg: C.tealMid }), hCell("Waktu", { w: W[4], bg: C.tealMid })
    ]})
  ];

  (tps || []).forEach((tp, i) => {
    rows.push(new TableRow({ children: [
      dCell(p(tp.id, { bold: true, align: AlignmentType.CENTER, color: C.tealDark }), { w: W[0], bg: i % 2 === 0 ? C.white : C.gray, vAlign: VerticalAlign.CENTER }),
      dCell(p(tp.rumusanTp), { w: W[1], bg: i % 2 === 0 ? C.white : C.gray }),
      dCell(p(tp.levelKognitif, { align: AlignmentType.CENTER }), { w: W[2], bg: i % 2 === 0 ? C.white : C.gray, vAlign: VerticalAlign.CENTER }),
      dCell(p(tp.dimensiProfil, { align: AlignmentType.CENTER }), { w: W[3], bg: i % 2 === 0 ? C.white : C.gray, vAlign: VerticalAlign.CENTER }),
      dCell(p(tp.alokasiWaktu, { align: AlignmentType.CENTER, bold: true }), { w: W[4], bg: i % 2 === 0 ? C.white : C.gray, vAlign: VerticalAlign.CENTER })
    ]}));
  });

  const t = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: W, rows });
  return [
    secHeader("BAGIAN D - TABEL TUJUAN PEMBELAJARAN (TP)", C.tealDark), pEmpty(80),
    p("Rumuskan TP menggunakan komponen ABCD dan terhubung dengan CP.", { italic: true }), pEmpty(40),
    t
  ];
}

function bagE(tps) {
  const W = [800, 3400, 3000, 1500, 1500];
  const rows = [
    new TableRow({ children: [
      hCell("No", { w: W[0], bg: C.tealMid }), hCell("Rumusan TP (singkat)", { w: W[1], bg: C.tealMid }),
      hCell("Indikator Ketercapaian (IKTP)", { w: W[2], bg: C.tealMid }), hCell("Bentuk Asesmen", { w: W[3], bg: C.tealMid }), hCell("Instrumen", { w: W[4], bg: C.tealMid })
    ]})
  ];

  (tps || []).forEach((tp, i) => {
    rows.push(new TableRow({ children: [
      dCell(p(tp.id, { bold: true, align: AlignmentType.CENTER, color: C.tealDark }), { w: W[0], bg: i % 2 === 0 ? C.white : C.gray, vAlign: VerticalAlign.CENTER }),
      dCell(p(tp.rumusanTp), { w: W[1], bg: i % 2 === 0 ? C.white : C.gray }),
      dCell(p(tp.iktp), { w: W[2], bg: i % 2 === 0 ? C.white : C.gray }),
      dCell(p(tp.bentukAsesmen, { align: AlignmentType.CENTER }), { w: W[3], bg: i % 2 === 0 ? C.white : C.gray }),
      dCell(p(tp.instrumen, { align: AlignmentType.CENTER }), { w: W[4], bg: i % 2 === 0 ? C.white : C.gray })
    ]}));
  });

  const t = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: W, rows });
  return [secHeader("BAGIAN E - INDIKATOR KETERCAPAIAN (IKTP) & ASESMEN", C.tealDark), pEmpty(80), t];
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
      new TableRow({ children: [labelCell("Catatan Kontekstualisasi", W[0], C.orangeLight), valueCell(notes?.kontekstualisasi, W[1])] }),
      new TableRow({ children: [labelCell("Kesesuaian Deep Learning", W[0], C.orangeLight), valueCell(notes?.kesesuaianDeepLearning, W[1])] }),
      new TableRow({ children: [labelCell("Model Pembelajaran", W[0], C.orangeLight), valueCell(notes?.modelPembelajaran, W[1])] }),
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

  return [secHeader("BAGIAN F - CATATAN PENGEMBANGAN DAN VALIDASI TP", C.orangeDark), pEmpty(80), t1, pEmpty(120), t2];
}

function atpTable(tps, atpData) {
  const W = [800, 3000, 3000, 1800, 2000, 1000, 1500, 1600];
  const rows = [
    new TableRow({ children: [
      hCell("No.", { w: W[0], bg: C.purpleDark }), hCell("Tujuan Pembelajaran", { w: W[1], bg: C.purpleDark }),
      hCell("Materi / Konten Esensial", { w: W[2], bg: C.purpleDark }), hCell("Dimensi Profil", { w: W[3], bg: C.purpleDark }),
      hCell("Pendekatan Deep Learning", { w: W[4], bg: C.purpleDark }), hCell("Waktu", { w: W[5], bg: C.purpleDark }),
      hCell("Asesmen", { w: W[6], bg: C.purpleDark }), hCell("Pertemuan", { w: W[7], bg: C.purpleDark })
    ]})
  ];

  let currentSemester = null;

  (atpData || []).forEach((item, i) => {
    const tpRef = tps?.find(t => t.id === item.idTp);
    const rumusan = tpRef ? tpRef.rumusanTp : "...";

    if (item.semester && item.semester !== currentSemester) {
      currentSemester = item.semester;
      rows.push(new TableRow({ children: [
        hCell(`SEMESTER ${currentSemester.toUpperCase()}`, { colSpan: 8, bg: C.yellowMid, txtColor: C.navyDark, align: AlignmentType.LEFT })
      ]}));
    }

    rows.push(new TableRow({ children: [
      dCell(p(item.idTp, { bold: true, align: AlignmentType.CENTER, color: C.purpleDark }), { w: W[0], bg: i % 2 === 0 ? C.white : C.purpleLight, vAlign: VerticalAlign.CENTER }),
      dCell(p(rumusan), { w: W[1], bg: i % 2 === 0 ? C.white : C.purpleLight }),
      dCell(pMulti(item.materi.split('\n').map(l => ({ text: l + '\n' }))), { w: W[2], bg: i % 2 === 0 ? C.white : C.purpleLight }),
      dCell(p(item.dimensiProfil, { align: AlignmentType.CENTER }), { w: W[3], bg: i % 2 === 0 ? C.white : C.purpleLight }),
      dCell(p(item.deepLearning, { align: AlignmentType.CENTER }), { w: W[4], bg: i % 2 === 0 ? C.white : C.purpleLight }),
      dCell(p(item.waktu, { align: AlignmentType.CENTER, bold: true }), { w: W[5], bg: i % 2 === 0 ? C.white : C.purpleLight, vAlign: VerticalAlign.CENTER }),
      dCell(p(item.asesmen, { align: AlignmentType.CENTER }), { w: W[6], bg: i % 2 === 0 ? C.white : C.purpleLight }),
      dCell(p(item.pertemuan, { align: AlignmentType.CENTER, italic: true }), { w: W[7], bg: i % 2 === 0 ? C.white : C.purpleLight, vAlign: VerticalAlign.CENTER }),
    ]}));
  });

  const t = new Table({ width: { size: CONTENT_L_W, type: WidthType.DXA }, columnWidths: W, rows });
  
  return [
    bannerTable("ALUR TUJUAN PEMBELAJARAN (ATP)", C.purpleDark, C.white, 24, "SMK Muhammadiyah 3 Purbalingga | Kurikulum Merdeka", CONTENT_L_W),
    pEmpty(80),
    p("Apa itu Alur Tujuan Pembelajaran (ATP)? ATP adalah urutan/sekuens TP yang disusun secara logis dan sistematis dari sederhana ke kompleks.", { italic: true }),
    pEmpty(80),
    t
  ];
}

export async function generateAndDownloadTpAtp(data, aiData) {
  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 20 } } } },
    sections: [
      // ── HALAMAN 1: Cover Page ──
      {
        properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
        children: [...makeCoverPage("Tujuan Pembelajaran & Alur Tujuan Pembelajaran", data)],
      },
      // ── HALAMAN 2 (PORTRAIT): TP ──
      {
        properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
        children: [
          bannerTable("TUJUAN PEMBELAJARAN (TP)", C.navyDark, C.white, 26, "SMK Muhammadiyah 3 Purbalingga | Kurikulum Merdeka | Deep Learning"),
          pEmpty(120),
          ...bagA(), pEmpty(120),
          ...bagB(data), pEmpty(120),
          ...bagC(data), pEmpty(120),
          ...bagD(aiData.tujuanPembelajaran), pEmpty(120),
          ...bagE(aiData.tujuanPembelajaran), pEmpty(120),
          ...bagF(data, aiData.catatan), pEmpty(120)
        ],
      },
      // ── HALAMAN 3 (LANDSCAPE): ATP ──
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
  saveAs(blob, `TP_ATP_${(data.subject || "Mapel").replace(/ /g, "_")}.docx`);
}
