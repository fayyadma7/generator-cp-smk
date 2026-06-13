import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
} from "docx";
import { saveAs } from "file-saver";

// ═══════════════════════════════════════
// KONSTANTA
// ═══════════════════════════════════════
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

const PAGE_W    = 11906;
const MARGIN    = 1080;
const CONTENT_W = PAGE_W - MARGIN * 2;  // 9746
const CM        = { top: 80, bottom: 80, left: 140, right: 140 };
const CM_ANS    = { top: 200, bottom: 200, left: 140, right: 140 };

// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════
const solidBorder = (color = C.navyMid, sz = 4) => ({ style: BorderStyle.SINGLE, size: sz, color });
const allBorders  = (color = "AAAAAA", sz = 3)  => { const b = solidBorder(color, sz); return { top: b, bottom: b, left: b, right: b }; };
const noBorder    = () => { const b = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }; return { top: b, bottom: b, left: b, right: b }; };

const s = (text) => String(text || "");

function p(text, opts = {}) {
  const {
    bold = false, italic = false, size = 20,
    color = C.textDark, align = AlignmentType.LEFT,
    spBefore = 40, spAfter = 40, underline = false,
  } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before: spBefore, after: spAfter },
    children: [new TextRun({ text: s(text), bold, italic, size, color, font: "Arial", underline: underline ? {} : undefined })],
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
  const { colSpan = 1, rowSpan = 1, w, bg = C.navyDark, size = 20, align = AlignmentType.CENTER } = opts;
  return new TableCell({
    columnSpan: colSpan, rowSpan: rowSpan,
    width: w ? { size: w, type: WidthType.DXA } : undefined,
    borders: allBorders(C.navyMid, 4),
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: CM, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: align, children: [new TextRun({ text: s(text), bold: true, size, color: C.white, font: "Arial" })] })],
  });
}

function dCell(children, opts = {}) {
  const { w, bg = C.white, colSpan = 1, rowSpan = 1, vAlign = VerticalAlign.TOP, borders: brd, margins: mg } = opts;
  return new TableCell({
    columnSpan: colSpan, rowSpan: rowSpan,
    width: w ? { size: w, type: WidthType.DXA } : undefined,
    borders: brd || allBorders("BBBBBB", 2),
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: mg || CM, verticalAlign: vAlign,
    children: Array.isArray(children) ? children : [children],
  });
}

const labelCell = (text, w = 3000, bg = C.navyLight) =>
  dCell(p(text, { bold: true, size: 20 }), { w, bg });

// Empty answer cell with extra height
function answerCell(opts = {}) {
  const { w, colSpan = 1, bg = C.white } = opts;
  return new TableCell({
    columnSpan: colSpan,
    width: w ? { size: w, type: WidthType.DXA } : undefined,
    borders: allBorders("CCCCCC", 2),
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: CM_ANS,
    verticalAlign: VerticalAlign.TOP,
    children: [pEmpty(200)],
  });
}

function parseMarkdownRuns(line, defaultOpts = {}) {
  const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.filter(p => p.length > 0).map(part => {
    if (part.startsWith("**") && part.endsWith("**")) return { ...defaultOpts, text: part.slice(2, -2), bold: true };
    if (part.startsWith("*") && part.endsWith("*"))   return { ...defaultOpts, text: part.slice(1, -1), italic: true };
    return { ...defaultOpts, text: part };
  });
}

function valueCell(text, w) {
  if (!text) return dCell(p("", { size: 20 }), { w });
  let strText;
  if (typeof text === "object") {
    try {
      strText = Array.isArray(text)
        ? text.map(t => (typeof t === "object" ? Object.values(t).join(" - ") : String(t))).join("\n")
        : JSON.stringify(text, null, 2);
    } catch { strText = String(text); }
  } else {
    strText = String(text);
  }
  const lines = strText.split("\n");
  return dCell(lines.map(l => pMulti(parseMarkdownRuns(l, { size: 20, color: C.textDark }), { spBefore: 20, spAfter: 20 })), { w });
}

function bannerTable(text, bg = C.navyDark, textColor = C.white, textSize = 22, subText = null) {
  const children = [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s(text), bold: true, size: textSize, color: textColor, font: "Arial" })] })];
  if (subText) children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s(subText), size: textSize - 4, color: textColor, font: "Arial" })] }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      borders: allBorders(C.navyMid, 4),
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 140, bottom: 140, left: 200, right: 200 },
      children,
    })] })],
  });
}

function pageBreak() {
  return new Paragraph({ pageBreakBefore: true, children: [new TextRun("")] });
}

// Identitas 2-col table row
function idRow(label, value) {
  return new TableRow({ children: [labelCell(label, 3000), valueCell(value, CONTENT_W - 3000)] });
}

// Returns [labelCell, answerCell] — use inside TableRow({ children: [...formCells(...)] })
function formCells(label, w1 = 3500) {
  return [
    labelCell(label, w1),
    answerCell({ w: CONTENT_W - w1 }),
  ];
}

// Full-width form row (label left, blank right) as a complete TableRow
function formRow(label, w1 = 3500) {
  return new TableRow({ children: formCells(label, w1) });
}

// ═══════════════════════════════════════
// SECTION BUILDERS
// ═══════════════════════════════════════

// ── COVER + DAFTAR LAMPIRAN ──────────────
function makeCover(header, daftar) {
  const hdr = header || {};
  const els = [];

  // Main cover banner
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      borders: allBorders(C.navyDark, 8),
      shading: { fill: C.navyDark, type: ShadingType.CLEAR },
      margins: { top: 240, bottom: 240, left: 240, right: 240 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 }, children: [new TextRun({ text: s(hdr.sekolah || "SMK"), bold: true, size: 32, color: C.yellow, font: "Arial" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 }, children: [new TextRun({ text: s(hdr.tagline), size: 22, color: C.navyLight, font: "Arial" })] }),
        pEmpty(60),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "DOKUMEN LAMPIRAN", bold: true, size: 40, color: C.white, font: "Arial" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 }, children: [new TextRun({ text: s(hdr.judulModul), bold: true, size: 26, color: C.yellow, font: "Arial" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 40 }, children: [new TextRun({ text: s(hdr.kodeModul), size: 22, color: C.navyLight, font: "Arial" })] }),
        pEmpty(60),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `${s(hdr.mataPelajaran)}   │   ${s(hdr.faseKelas)}   │   ${s(hdr.semester)}`, size: 22, color: C.white, font: "Arial" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: s(hdr.kurikulum), size: 20, color: C.navyLight, font: "Arial" })] }),
      ],
    })] })],
  }));

  els.push(pEmpty(120));
  els.push(bannerTable("DAFTAR LAMPIRAN", C.navyMid));
  els.push(pEmpty(60));

  // Daftar lampiran table
  const daftarArr = Array.isArray(daftar) ? daftar : [];
  const colW = [800, CONTENT_W - 1600, 800];
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colW,
    rows: [
      new TableRow({ children: [
        hCell("No.", { w: colW[0] }),
        hCell("Nama Lampiran & Keterangan", { w: colW[1] }),
        hCell("Halaman", { w: colW[2] }),
      ]}),
      ...daftarArr.map((lamp, i) => new TableRow({
        children: [
          dCell(p(s(lamp.no || i + 1), { align: AlignmentType.CENTER, size: 20 }), { w: colW[0], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell([
            p(s(lamp.namaLampiran), { bold: true, size: 20 }),
            p(s(lamp.keterangan), { size: 18, color: "555555" }),
          ], { w: colW[1], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell(p(s(lamp.halaman || ""), { align: AlignmentType.CENTER, size: 20 }), { w: colW[2], bg: i % 2 === 0 ? C.white : C.gray }),
        ],
      })),
    ],
  }));

  return els;
}

// ── LKPD 01a ─────────────────────────────
function makeLkpd01a(d) {
  if (!d) return [];
  const els = [];

  els.push(bannerTable(`${s(d.judulLampiran || "LKPD-01a")} — ${s(d.subjudul)}`, C.tealDark, C.white, 24, `Metode: ${s(d.metode)}   |   ${s(d.pertemuan)}`));
  els.push(pEmpty(60));

  // Identitas
  const id = d.identitas || {};
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3000, CONTENT_W - 3000],
    rows: [
      idRow("Sekolah", id.sekolah),
      idRow("Mata Pelajaran", id.mataPelajaran),
      idRow("Kelas", id.kelas),
      idRow("TP", id.tp),
    ],
  }));
  els.push(pEmpty(80));

  // TP full-width box
  const hf = d.headerForm || {};
  const colH = [4000, CONTENT_W - 4000];
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [dCell([
      p("Tujuan Pembelajaran:", { bold: true, size: 20 }),
      p(s(hf.tujuanPembelajaran), { size: 20, spBefore: 20, spAfter: 20 }),
    ], { w: CONTENT_W })] })],
  }));
  els.push(pEmpty(40));
  // Form rows
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colH,
    rows: [
      formRow(s(hf.namaFenomenaLabel || "Nama Topik / Objek:")),
      formRow(s(hf.namaKelompokLabel || "Nama / Kelompok:")),
      new TableRow({ children: [
        ...formCells("Kelas:", Math.floor(CONTENT_W / 2)),
        ...formCells("Tanggal:", Math.floor(CONTENT_W / 2)),
      ]}),
    ],
  }));
  els.push(pEmpty(80));

  // Petunjuk
  els.push(bannerTable("PETUNJUK KERJA", C.tealMid, C.white, 20));
  const petunjukArr = Array.isArray(d.petunjuk) ? d.petunjuk : [];
  petunjukArr.forEach((pt, i) => {
    els.push(p(`${i + 1}. ${s(pt)}`, { size: 20, spBefore: 30, spAfter: 20 }));
  });
  els.push(pEmpty(80));

  // Tabel Analisis
  els.push(bannerTable("TABEL ANALISIS", C.tealMid, C.white, 20));
  const analisis = Array.isArray(d.tabelAnalisis) ? d.tabelAnalisis : [];
  const colA = [600, 2800, CONTENT_W - 3400];
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colA,
    rows: [
      new TableRow({ children: [hCell("Kode", { w: colA[0] }), hCell("Aspek", { w: colA[1] }), hCell("Jawaban / Isian Siswa", { w: colA[2] })] }),
      ...analisis.map((asp, i) => new TableRow({
        children: [
          dCell(p(s(asp.kode), { align: AlignmentType.CENTER, bold: true, size: 20 }), { w: colA[0], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell([p(s(asp.judulKolom), { bold: true, size: 20 }), p(s(asp.pertanyaan), { size: 18, color: "555555" })], { w: colA[1], bg: i % 2 === 0 ? C.white : C.gray }),
          answerCell({ w: colA[2] }),
        ],
      })),
    ],
  }));
  els.push(pEmpty(80));

  // Gallery Walk / Penilaian
  const gw = d.penilaianGalleryWalk || {};
  if (gw.instruksi) {
    els.push(bannerTable("PENILAIAN ANTAR KELOMPOK", C.tealMid, C.white, 20));
    els.push(p(s(gw.instruksi), { size: 20, spBefore: 60, spAfter: 40 }));
    const gwCols = Array.isArray(gw.kolomHeader) ? gw.kolomHeader : ["Kelompok yang Dikunjungi", "Komentar / Pertanyaan"];
    const gwW = [Math.floor(CONTENT_W / gwCols.length)];
    const gwWidths = gwCols.map((_, i) => i === 0 ? 2500 : CONTENT_W - 2500);
    const gwBaris = parseInt(gw.jumlahBaris) || 4;
    els.push(new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: gwWidths,
      rows: [
        new TableRow({ children: gwCols.map((h, i) => hCell(h, { w: gwWidths[i] })) }),
        ...Array.from({ length: gwBaris }, (_, i) => new TableRow({
          children: gwCols.map((_, ci) => answerCell({ w: gwWidths[ci] })),
        })),
      ],
    }));
  }

  return els;
}

// ── LKPD 01b ─────────────────────────────
function makeLkpd01b(d) {
  if (!d) return [];
  const els = [];

  els.push(bannerTable(`${s(d.judulLampiran || "LKPD-01b")} — ${s(d.subjudul)}`, C.greenDark, C.white, 24, s(d.deskripsiPertemuan)));
  els.push(pEmpty(60));

  const id = d.identitas || {};
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3000, CONTENT_W - 3000],
    rows: [idRow("Sekolah", id.sekolah), idRow("Mata Pelajaran", id.mataPelajaran), idRow("Kelas", id.kelas), idRow("TP", id.tp)],
  }));

  const hf = d.headerForm || {};
  els.push(pEmpty(60));
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W / 2, CONTENT_W / 2],
    rows: [
      new TableRow({ children: [
        labelCell("Nama / Kelompok:", Math.floor(CONTENT_W / 2)),
        answerCell({ w: Math.floor(CONTENT_W / 2) }),
      ]}),
      new TableRow({ children: [
        labelCell("Tanggal:", Math.floor(CONTENT_W / 2)),
        dCell(p(s(hf.tujuan), { size: 18, color: "555555" }), { w: Math.floor(CONTENT_W / 2) }),
      ]}),
    ],
  }));
  els.push(pEmpty(80));

  // Bagian A
  const bA = d.bagianA || {};
  els.push(bannerTable(s(bA.judul || "BAGIAN A"), C.greenMid));
  const kiri  = bA.kolomKiri  || {};
  const kanan = bA.kolomKanan || {};
  const halfW = CONTENT_W / 2;
  const entriKiri  = parseInt(kiri.jumlahEntri)  || 3;
  const entriKanan = parseInt(kanan.jumlahEntri) || 3;
  const maxEntri   = Math.max(entriKiri, entriKanan);
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [halfW, halfW],
    rows: [
      new TableRow({ children: [hCell(s(kiri.label), { w: halfW }), hCell(s(kanan.label), { w: halfW })] }),
      new TableRow({ children: [
        dCell([p(s(kiri.instruksi), { size: 18, color: "555555" })], { w: halfW }),
        dCell([p(s(kanan.instruksi), { size: 18, color: "555555" })], { w: halfW }),
      ]}),
      ...Array.from({ length: maxEntri }, (_, i) => new TableRow({
        children: [
          dCell(p(`${i + 1}.`, { size: 20 }), { w: halfW, margins: CM_ANS }),
          dCell(p(`${i + 1}.`, { size: 20 }), { w: halfW, margins: CM_ANS }),
        ],
      })),
    ],
  }));
  els.push(pEmpty(80));

  // Bagian B
  const bB = d.bagianB || {};
  els.push(bannerTable(s(bB.judul || "BAGIAN B"), C.greenMid));
  els.push(p(s(bB.instruksi), { size: 20, spBefore: 60, spAfter: 20 }));
  if (bB.contohFormat) els.push(p(`Contoh: ${s(bB.contohFormat)}`, { size: 18, italic: true, color: "555555", spBefore: 0, spAfter: 40 }));
  // Drawing area
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      borders: allBorders(C.navyMid, 3),
      shading: { fill: C.white, type: ShadingType.CLEAR },
      margins: { top: 800, bottom: 800, left: 200, right: 200 },
      children: [p(s(bB.labelRuang || "[Ruang Menggambar Bagan]"), { align: AlignmentType.CENTER, color: "AAAAAA", italic: true, size: 20 })],
    })] })],
  }));
  els.push(pEmpty(80));

  // Bagian C
  const bC = d.bagianC || {};
  els.push(bannerTable(s(bC.judul || "BAGIAN C"), C.greenMid));
  const colC = Array.isArray(bC.kolomHeader) ? bC.kolomHeader : ["Pasangan Keterkaitan", "Penjelasan Ilmiah"];
  const cWidths = [Math.floor(CONTENT_W * 0.35), Math.floor(CONTENT_W * 0.65)];
  const jmlPasangan = parseInt(bC.jumlahPasangan) || 3;
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: cWidths,
    rows: [
      new TableRow({ children: colC.map((h, i) => hCell(h, { w: cWidths[i] })) }),
      ...Array.from({ length: jmlPasangan }, (_, i) => new TableRow({
        children: [answerCell({ w: cWidths[0] }), answerCell({ w: cWidths[1] })],
      })),
    ],
  }));
  els.push(pEmpty(80));

  // Bagian D
  const bD = d.bagianD || {};
  els.push(bannerTable(s(bD.judul || "BAGIAN D — REFLEKSI"), C.greenMid));
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [dCell([
      p(s(bD.pertanyaanRefleksi), { size: 20, bold: true }),
      pEmpty(200),
    ], { w: CONTENT_W, margins: CM_ANS })] })],
  }));

  return els;
}

// ── ASESMEN FORMATIF ──────────────────────
function makeAsesmenFormatif(d) {
  if (!d) return [];
  const els = [];

  els.push(bannerTable(`${s(d.judulLampiran || "Instrumen Asesmen Formatif")}`, C.purpleDark, C.white, 24, s(d.subjudul)));
  els.push(pEmpty(60));

  const id = d.identitas || {};
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3000, CONTENT_W - 3000],
    rows: [idRow("Sekolah", id.sekolah), idRow("Mata Pelajaran", id.mataPelajaran), idRow("Kelas", id.kelas), idRow("TP", id.tp)],
  }));
  els.push(pEmpty(80));

  // Bagian A — Pertanyaan Lisan
  const bA = d.bagianA || {};
  els.push(bannerTable(s(bA.judul || "A. PERTANYAAN LISAN"), C.purpleMid));
  if (bA.keterangan) els.push(p(s(bA.keterangan), { size: 18, color: "555555", spBefore: 40, spAfter: 20 }));
  const pertArr = Array.isArray(bA.pertanyaan) ? bA.pertanyaan : [];
  const colPA = [600, Math.floor((CONTENT_W - 600) * 0.5), Math.floor((CONTENT_W - 600) * 0.5)];
  const hdrPA = Array.isArray(bA.kolomHeader) ? bA.kolomHeader : ["No.", "Pertanyaan Lisan", "Kunci Jawaban (Referensi Guru)"];
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colPA,
    rows: [
      new TableRow({ children: hdrPA.map((h, i) => hCell(h, { w: colPA[i] })) }),
      ...pertArr.map((pt, i) => new TableRow({
        children: [
          dCell(p(s(pt.no || i + 1), { align: AlignmentType.CENTER, size: 20 }), { w: colPA[0], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell(p(s(pt.pertanyaan), { size: 20 }), { w: colPA[1], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell(p(s(pt.kunciJawaban), { size: 20 }), { w: colPA[2], bg: i % 2 === 0 ? C.white : C.gray }),
        ],
      })),
    ],
  }));
  els.push(pEmpty(80));

  // Bagian B — Soal Kuis
  const bB = d.bagianB || {};
  els.push(bannerTable(s(bB.judul || "B. SOAL KUIS TULIS"), C.purpleMid));
  if (bB.petunjuk) els.push(p(`Petunjuk: ${s(bB.petunjuk)}`, { size: 18, italic: true, color: "555555", spBefore: 40, spAfter: 40 }));

  const soalArr = Array.isArray(bB.soal) ? bB.soal : [];
  soalArr.forEach((soal, i) => {
    els.push(p(`${soal.no || i + 1}. ${s(soal.pertanyaan)}`, { size: 20, bold: false, spBefore: 60, spAfter: 20 }));
    const opsiArr = Array.isArray(soal.opsi) ? soal.opsi : [];
    opsiArr.forEach(opsi => {
      els.push(p(`    ${s(opsi.huruf)}. ${s(opsi.teks)}`, { size: 20, spBefore: 10, spAfter: 10 }));
    });
    if (soal.kunci) els.push(p(`    ✓ Kunci: ${s(soal.kunci)}`, { size: 18, bold: true, color: C.green, spBefore: 10, spAfter: 30 }));
  });

  return els;
}

// ── ASESMEN SUMATIF ───────────────────────
function makeAsesmenSumatif(d) {
  if (!d) return [];
  const els = [];

  els.push(bannerTable(s(d.judulLampiran || "Instrumen Asesmen Sumatif"), C.purpleDark, C.white, 24, s(d.subjudul)));
  els.push(pEmpty(60));

  const id = d.identitas || {};
  const hf = d.headerForm || {};
  const kp = d.kriteriaPenilaian || {};
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3000, CONTENT_W - 3000],
    rows: [
      idRow("Sekolah", id.sekolah),
      idRow("Mata Pelajaran", id.mataPelajaran),
      idRow("Kelas", id.kelas),
      idRow("TP", id.tp),
      formRow("Nama Peserta Didik:"),
      formRow("Tanggal Penilaian:"),
      formRow("Guru Penilai:"),
      idRow("Kriteria Ketercapaian (KKTP)", kp.kktp),
      idRow("Formula Nilai Akhir", kp.formulaNilaiAkhir),
    ],
  }));
  els.push(pEmpty(80));

  // Rubrik
  const rubrik = d.rubrik || {};
  const aspekArr = Array.isArray(rubrik.aspek) ? rubrik.aspek : [];
  const kolHdr = Array.isArray(rubrik.kolomHeader) ? rubrik.kolomHeader : ["Aspek Penilaian", "Perlu Bimbingan (1)", "Cukup (2)", "Baik (3)", "Sangat Baik (4)"];
  const colR = [2200, ...Array(kolHdr.length - 1).fill(Math.floor((CONTENT_W - 2200) / (kolHdr.length - 1)))];
  els.push(bannerTable("RUBRIK PENILAIAN", C.purpleMid));
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colR,
    rows: [
      new TableRow({ children: kolHdr.map((h, i) => hCell(h, { w: colR[i] })) }),
      ...aspekArr.map((asp, i) => new TableRow({
        children: [
          dCell([p(s(asp.namaAspek), { bold: true, size: 20 }), p(s(asp.bobot), { size: 18, color: "666666" })], { w: colR[0], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell(p(s(asp.perluBimbingan), { size: 18 }), { w: colR[1], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell(p(s(asp.cukup),          { size: 18 }), { w: colR[2], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell(p(s(asp.baik),           { size: 18 }), { w: colR[3], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell(p(s(asp.sangatBaik),     { size: 18 }), { w: colR[4] || colR[colR.length - 1], bg: i % 2 === 0 ? C.white : C.gray }),
        ],
      })),
    ],
  }));

  // Total skor summary
  const ts = d.totalSkor || {};
  if (ts.kolomSummary) {
    els.push(pEmpty(40));
    const sumCols = ts.kolomSummary;
    const sumW = sumCols.map(() => Math.floor(CONTENT_W / sumCols.length));
    els.push(new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: sumW,
      rows: [
        new TableRow({ children: sumCols.map((h, i) => hCell(h, { w: sumW[i], bg: C.purpleMid, size: 18 })) }),
        new TableRow({ children: [
          dCell(p(s(ts.skorMaksimal ? `Maks. ${ts.skorMaksimal}` : ""), { size: 20 }), { w: sumW[0], margins: CM_ANS }),
          ...sumCols.slice(1).map((_, i) => answerCell({ w: sumW[i + 1] })),
        ]}),
      ],
    }));
  }

  if (d.catatanGuru) {
    els.push(pEmpty(80));
    els.push(bannerTable("CATATAN GURU", C.purpleMid, C.white, 20));
    els.push(new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [CONTENT_W],
      rows: [new TableRow({ children: [answerCell({ w: CONTENT_W, colSpan: 1 })] })],
    }));
  }

  return els;
}

// ── REKAP KELAS ───────────────────────────
function makeRekapKelas(d) {
  if (!d) return [];
  const els = [];

  els.push(bannerTable(s(d.judulLampiran || "Rekap Kelas"), C.grayDark, C.textDark, 24, s(d.subjudul)));
  els.push(pEmpty(60));

  const id = d.identitas || {};
  const hf = d.headerForm || {};
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3000, CONTENT_W - 3000],
    rows: [idRow("Sekolah", id.sekolah), idRow("Mata Pelajaran", id.mataPelajaran), idRow("Kelas", id.kelas), idRow("TP", id.tp), formRow("Guru Mata Pelajaran:"), formRow("Semester:")],
  }));
  els.push(pEmpty(80));

  const tabel = d.tabelRekap || {};
  const aspekArr = Array.isArray(tabel.aspek) ? tabel.aspek : [];
  const kolTambahan = Array.isArray(tabel.kolomTambahan) ? tabel.kolomTambahan : ["Total", "Nilai Akhir"];
  const jumlahSiswa = parseInt(tabel.jumlahSiswa) || 32;

  // Dynamic widths
  const noW = 500;
  const namaW = 2500;
  const aspekW = aspekArr.length > 0 ? Math.floor((CONTENT_W - noW - namaW - kolTambahan.length * 900) / aspekArr.length) : 0;
  const tambahW = 900;
  const allWidths = [noW, namaW, ...aspekArr.map(() => Math.max(aspekW, 700)), ...kolTambahan.map(() => tambahW)];

  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: allWidths,
    rows: [
      // Header
      new TableRow({ children: [
        hCell("No.", { w: noW }),
        hCell("Nama Siswa", { w: namaW }),
        ...aspekArr.map((a, i) => hCell(s(a.label || `Aspek ${a.kode || i + 1}`), { w: allWidths[2 + i] })),
        ...kolTambahan.map((k, i) => hCell(s(k), { w: tambahW })),
      ]}),
      // Empty rows for students
      ...Array.from({ length: jumlahSiswa }, (_, i) => new TableRow({
        children: [
          dCell(p(`${i + 1}.`, { align: AlignmentType.CENTER, size: 18 }), { w: noW, bg: i % 2 === 0 ? C.white : C.gray }),
          answerCell({ w: namaW }),
          ...aspekArr.map((_, ai) => answerCell({ w: allWidths[2 + ai] })),
          ...kolTambahan.map((_, ki) => answerCell({ w: tambahW })),
        ],
      })),
      // Rata-rata row
      new TableRow({ children: [
        dCell(p("", { size: 18 }), { w: noW, bg: C.grayDark }),
        dCell(p("Rata-rata Kelas", { bold: true, size: 18 }), { w: namaW, bg: C.grayDark }),
        ...aspekArr.map((_, ai) => answerCell({ w: allWidths[2 + ai] })),
        ...kolTambahan.map((_, ki) => answerCell({ w: tambahW })),
      ]}),
    ],
  }));

  const ket = Array.isArray(d.keterangan) ? d.keterangan : [];
  if (ket.length > 0) {
    els.push(pEmpty(80));
    els.push(p("Keterangan:", { bold: true, size: 20 }));
    ket.forEach((k, i) => els.push(p(`${i + 1}. ${s(k)}`, { size: 18, spBefore: 20, spAfter: 10 })));
  }

  return els;
}

// ── MEDIA PEMBELAJARAN ────────────────────
function makeMedia(d) {
  if (!d) return [];
  const els = [];

  els.push(bannerTable(s(d.judulLampiran || "Media Pembelajaran"), C.purpleDark, C.white, 24, s(d.subjudul)));
  els.push(pEmpty(60));

  const id = d.identitas || {};
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3000, CONTENT_W - 3000],
    rows: [idRow("Sekolah", id.sekolah), idRow("Mata Pelajaran", id.mataPelajaran), idRow("Kelas", id.kelas), idRow("TP", id.tp)],
  }));
  els.push(pEmpty(80));

  // Bagian A — Slide
  const bA = d.bagianA || {};
  els.push(bannerTable(s(bA.judul || "A. RINCIAN SLIDE"), C.purpleMid));
  const slideArr = Array.isArray(bA.slide) ? bA.slide : [];
  const colS = Array.isArray(bA.kolomHeader) ? bA.kolomHeader : ["Slide", "Judul Slide", "Konten Utama", "Catatan Guru"];
  const sW = [600, 2200, 3600, CONTENT_W - 600 - 2200 - 3600];
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: sW,
    rows: [
      new TableRow({ children: colS.map((h, i) => hCell(h, { w: sW[i] })) }),
      ...slideArr.map((sl, i) => new TableRow({
        children: [
          dCell(p(s(sl.no || i + 1), { align: AlignmentType.CENTER, size: 18 }), { w: sW[0], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell(p(s(sl.judulSlide), { bold: true, size: 18 }), { w: sW[1], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell(p(s(sl.kontenUtama), { size: 18 }), { w: sW[2], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell(p(s(sl.catatanGuru), { size: 18, italic: true }), { w: sW[3], bg: i % 2 === 0 ? C.white : C.gray }),
        ],
      })),
    ],
  }));
  els.push(pEmpty(80));

  // Bagian B — Referensi
  const bB = d.bagianB || {};
  els.push(bannerTable(s(bB.judul || "B. REFERENSI VIDEO & SUMBER DIGITAL"), C.purpleMid));
  const refArr = Array.isArray(bB.referensi) ? bB.referensi : [];
  const colR2 = Array.isArray(bB.kolomHeader) ? bB.kolomHeader : ["No.", "Judul / Sumber", "Keterangan", "Durasi"];
  const rW = [500, 3000, 4000, CONTENT_W - 500 - 3000 - 4000];
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: rW,
    rows: [
      new TableRow({ children: colR2.map((h, i) => hCell(h, { w: rW[i] })) }),
      ...refArr.map((ref, i) => new TableRow({
        children: [
          dCell(p(s(ref.no || i + 1), { align: AlignmentType.CENTER, size: 18 }), { w: rW[0], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell(p(s(ref.judul), { size: 18 }), { w: rW[1], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell(p(s(ref.keterangan), { size: 18 }), { w: rW[2], bg: i % 2 === 0 ? C.white : C.gray }),
          dCell(p(s(ref.durasi), { size: 18 }), { w: rW[3], bg: i % 2 === 0 ? C.white : C.gray }),
        ],
      })),
    ],
  }));

  return els;
}

// ── LEMBAR REFLEKSI ───────────────────────
function makeLembarRefleksi(d) {
  if (!d) return [];
  const els = [];

  els.push(bannerTable(s(d.judulLampiran || "Lembar Refleksi"), C.purpleMid, C.white, 24, `Teknik: ${s(d.teknik || "3-2-1")}   |   ${s(d.keterangan)}`));
  els.push(pEmpty(60));

  const pertemuanArr = Array.isArray(d.pertemuan) ? d.pertemuan : [];
  pertemuanArr.forEach((prt, idx) => {
    if (idx > 0) els.push(pEmpty(120));
    els.push(bannerTable(s(prt.labelPertemuan || `Pertemuan ${idx + 1}`), C.purpleMid));

    const hf = prt.headerForm || {};
    els.push(pEmpty(40));
    els.push(new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [CONTENT_W / 2, CONTENT_W / 2],
      rows: [
        new TableRow({ children: [
          labelCell("Nama:", Math.floor(CONTENT_W / 2)),
          answerCell({ w: Math.floor(CONTENT_W / 2) }),
        ]}),
        new TableRow({ children: [
          labelCell("Tanggal:", Math.floor(CONTENT_W / 2)),
          dCell(p(`Topik: ${s(hf.topik)}`, { size: 18, color: "555555" }), { w: Math.floor(CONTENT_W / 2) }),
        ]}),
      ],
    }));
    els.push(pEmpty(60));

    const boxes = [
      { data: prt.tiga, bg: C.greenLight,  border: C.green,  labelBg: C.green },
      { data: prt.dua,  bg: C.navyLight,   border: C.navyMid,labelBg: C.navyMid },
      { data: prt.satu, bg: C.yellowLight,  border: "C49500", labelBg: "C49500" },
    ];

    boxes.forEach(({ data, bg, border, labelBg }) => {
      if (!data) return;
      const jumlahBaris = parseInt(data.jumlahBaris) || 2;
      const emptyLines = Array.from({ length: jumlahBaris }, () => pEmpty(160));
      els.push(new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [800, CONTENT_W - 800],
        rows: [new TableRow({ children: [
          new TableCell({
            width: { size: 800, type: WidthType.DXA },
            borders: allBorders(border, 4),
            shading: { fill: labelBg, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s(data.label), bold: true, size: 48, color: C.white, font: "Arial" })] })],
          }),
          new TableCell({
            width: { size: CONTENT_W - 800, type: WidthType.DXA },
            borders: allBorders(border, 3),
            shading: { fill: bg, type: ShadingType.CLEAR },
            margins: CM,
            children: [p(s(data.pertanyaan), { bold: true, size: 20, spBefore: 20, spAfter: 40 }), ...emptyLines],
          }),
        ]})]
      }));
      els.push(pEmpty(40));
    });
  });

  if (d.kutipanPenutup) {
    els.push(pEmpty(80));
    els.push(new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [CONTENT_W],
      rows: [new TableRow({ children: [dCell([
        p(s(d.kutipanPenutup), { align: AlignmentType.CENTER, italic: true, size: 20 }),
      ], { bg: C.yellowLight })] })],
    }));
  }

  return els;
}

// ── BAHAN PENGAYAAN ───────────────────────
function makePengayaan(d) {
  if (!d) return [];
  const els = [];

  els.push(bannerTable(s(d.judulLampiran || "Bahan Pengayaan"), C.greenDark, C.white, 24, s(d.subjudul)));
  els.push(pEmpty(60));

  const id = d.identitas || {};
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3000, CONTENT_W - 3000],
    rows: [idRow("Sekolah", id.sekolah), idRow("Mata Pelajaran", id.mataPelajaran), idRow("Kelas", id.kelas), idRow("TP", id.tp)],
  }));
  els.push(pEmpty(40));

  if (d.targetPesertaDidik) els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [dCell([p(`Target: ${s(d.targetPesertaDidik)}`, { bold: true, size: 20 }), p(s(d.deskripsiUmum), { size: 18 })], { bg: C.greenLight })] })],
  }));
  els.push(pEmpty(80));

  // Materi bacaan
  const materiArr = Array.isArray(d.bagianMateriBacaan) ? d.bagianMateriBacaan : [];
  materiArr.forEach((mat, i) => {
    els.push(bannerTable(s(mat.judul || `Materi ${i + 1}`), C.greenMid));
    if (mat.narasiBacaan) els.push(p(s(mat.narasiBacaan), { size: 20, spBefore: 60, spAfter: 40 }));
    const tabel = mat.tabelAnalisis || {};
    const hdrs = Array.isArray(tabel.kolomHeader) ? tabel.kolomHeader : [];
    const baris = Array.isArray(tabel.baris) ? tabel.baris : [];
    if (hdrs.length > 0) {
      const tW = hdrs.map(() => Math.floor(CONTENT_W / hdrs.length));
      els.push(new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: tW,
        rows: [
          new TableRow({ children: hdrs.map((h, j) => hCell(h, { w: tW[j] })) }),
          ...baris.map((row, ri) => {
            const vals = Array.isArray(row) ? row : Object.values(row);
            return new TableRow({ children: vals.map((v, ci) => dCell(p(s(v), { size: 18 }), { w: tW[ci], bg: ri % 2 === 0 ? C.white : C.gray })) });
          }),
        ],
      }));
    }
    els.push(pEmpty(80));
  });

  // Study case
  const sc = d.studyCase || {};
  if (sc.judul) {
    els.push(bannerTable(s(sc.judul), C.greenMid));
    if (sc.narasiPengantar) els.push(p(s(sc.narasiPengantar), { size: 20, spBefore: 60, spAfter: 40 }));
    const levelArr = Array.isArray(sc.levelAnalisis) ? sc.levelAnalisis : [];
    levelArr.forEach((lv, i) => {
      els.push(p(`${i + 1}. ${s(lv.label)}: ${s(lv.deskripsi)}`, { size: 20, spBefore: 20, spAfter: 20 }));
    });
    els.push(pEmpty(60));
  }

  // Tugas
  const tugas = d.tugasPengayaan || {};
  if (tugas.instruksi) {
    els.push(bannerTable("TUGAS PENGAYAAN", C.greenMid));
    els.push(p(s(tugas.instruksi), { size: 20, spBefore: 60, spAfter: 20 }));
    if (tugas.format) els.push(p(`Format: ${s(tugas.format)}`, { size: 18, italic: true, color: "555555", spBefore: 0 }));
    const poinArr = Array.isArray(tugas.poin) ? tugas.poin : [];
    poinArr.forEach((pt, i) => els.push(p(`${i + 1}. ${s(pt)}`, { size: 20, spBefore: 20, spAfter: 10 })));
    if (tugas.batasWaktu) els.push(p(`⏰ Batas Waktu: ${s(tugas.batasWaktu)}`, { size: 20, bold: true, color: C.orange, spBefore: 40 }));
  }

  return els;
}

// ── BAHAN REMEDIASI ───────────────────────
function makeRemediasi(d) {
  if (!d) return [];
  const els = [];

  els.push(bannerTable(s(d.judulLampiran || "Bahan Remediasi"), C.orangeDark, C.white, 24, s(d.subjudul)));
  els.push(pEmpty(60));

  const id = d.identitas || {};
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3000, CONTENT_W - 3000],
    rows: [idRow("Sekolah", id.sekolah), idRow("Mata Pelajaran", id.mataPelajaran), idRow("Kelas", id.kelas), idRow("TP", id.tp)],
  }));
  els.push(pEmpty(40));

  if (d.targetPesertaDidik || d.pesanMotivasi) {
    els.push(new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [CONTENT_W],
      rows: [new TableRow({ children: [dCell([
        d.targetPesertaDidik ? p(`Target: ${s(d.targetPesertaDidik)}`, { bold: true, size: 20 }) : pEmpty(20),
        d.pesanMotivasi ? p(s(d.pesanMotivasi), { size: 20, italic: true }) : pEmpty(20),
      ], { bg: C.orangeLight })] })],
    }));
  }
  els.push(pEmpty(80));

  // Bagian Materi
  const materiArr = Array.isArray(d.bagianMateri) ? d.bagianMateri : [];
  materiArr.forEach((mat, i) => {
    els.push(bannerTable(`${mat.nomor || i + 1}. ${s(mat.judul)}`, C.orangeMid));
    if (mat.narasiPengantar) els.push(p(s(mat.narasiPengantar), { size: 20, spBefore: 60, spAfter: 40 }));
    const tabel = mat.tabelContoh || {};
    const hdrs = Array.isArray(tabel.kolomHeader) ? tabel.kolomHeader : [];
    const baris = Array.isArray(tabel.baris) ? tabel.baris : [];
    if (hdrs.length > 0) {
      const tW = hdrs.map(() => Math.floor(CONTENT_W / hdrs.length));
      els.push(new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: tW,
        rows: [
          new TableRow({ children: hdrs.map((h, j) => hCell(h, { w: tW[j] })) }),
          ...baris.map((row, ri) => {
            const vals = Array.isArray(row) ? row : Object.values(row);
            return new TableRow({ children: vals.map((v, ci) => dCell(p(s(v), { size: 18 }), { w: tW[ci], bg: ri % 2 === 0 ? C.white : C.gray })) });
          }),
        ],
      }));
    }
    els.push(pEmpty(80));
  });

  // Latihan soal
  const latihan = d.latihanSoal || {};
  const hfL = latihan.headerForm || {};

  els.push(bannerTable("LATIHAN SOAL", C.orangeMid));
  els.push(pEmpty(40));
  els.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W / 2, CONTENT_W / 2],
    rows: [
      new TableRow({ children: [
        labelCell("Nama:", Math.floor(CONTENT_W / 2)),
        answerCell({ w: Math.floor(CONTENT_W / 2) }),
      ]}),
      new TableRow({ children: [
        labelCell("Tanggal:", Math.floor(CONTENT_W / 2)),
        answerCell({ w: Math.floor(CONTENT_W / 2) }),
      ]}),
    ],
  }));
  els.push(pEmpty(60));

  // Bagian A
  const bA = latihan.bagianA || {};
  if (bA.judul) {
    els.push(p(s(bA.judul), { bold: true, size: 22, spBefore: 60, spAfter: 20 }));
    if (bA.instruksi) els.push(p(s(bA.instruksi), { size: 18, italic: true, color: "555555", spBefore: 0, spAfter: 40 }));
    const colBA = Array.isArray(bA.kolomHeader) ? bA.kolomHeader : ["No.", "Kasus", "Kategori", "Penjelasan Singkat"];
    const baW = [500, Math.floor((CONTENT_W - 500) * 0.4), Math.floor((CONTENT_W - 500) * 0.25), Math.floor((CONTENT_W - 500) * 0.35)];
    const jumlahSoal = parseInt(bA.jumlahSoal) || 5;
    els.push(new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: baW,
      rows: [
        new TableRow({ children: colBA.map((h, i) => hCell(h, { w: baW[i] })) }),
        ...Array.from({ length: jumlahSoal }, (_, i) => new TableRow({
          children: [
            dCell(p(`${i + 1}.`, { align: AlignmentType.CENTER, size: 18 }), { w: baW[0] }),
            ...baW.slice(1).map(w => answerCell({ w })),
          ],
        })),
      ],
    }));
    els.push(pEmpty(80));
  }

  // Bagian B
  const bB = latihan.bagianB || {};
  if (bB.judul) {
    els.push(p(s(bB.judul), { bold: true, size: 22, spBefore: 40, spAfter: 20 }));
    if (bB.instruksi) els.push(p(s(bB.instruksi), { size: 18, italic: true, color: "555555", spBefore: 0, spAfter: 40 }));
    const pertArr = Array.isArray(bB.pertanyaan) ? bB.pertanyaan : [];
    pertArr.forEach((pt, i) => {
      els.push(p(`${pt.no || i + 1}. ${s(pt.pertanyaan)}`, { size: 20, bold: true, spBefore: 40, spAfter: 20 }));
      const subpoin = parseInt(pt.jumlahSubpoin) || 3;
      Array.from({ length: subpoin }, (_, j) => {
        els.push(new Table({
          width: { size: CONTENT_W - 400, type: WidthType.DXA },
          columnWidths: [CONTENT_W - 400],
          rows: [new TableRow({ children: [answerCell({ w: CONTENT_W - 400 })] })],
        }));
      });
      els.push(pEmpty(40));
    });
  }

  // Pesan penutup
  if (d.pesanPenutup) {
    els.push(pEmpty(60));
    els.push(new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [CONTENT_W],
      rows: [new TableRow({ children: [dCell([
        p("📌 " + s(d.pesanPenutup), { align: AlignmentType.CENTER, size: 20, italic: true }),
      ], { bg: C.orangeLight })] })],
    }));
  }

  return els;
}

// ═══════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════
export async function generateAndDownloadLampiranDocx(result, inputGuru) {
  const r = result || {};
  const hd = r.headerDanDaftar || {};
  const namaFile = `Lampiran_${String(inputGuru?.judulModul || "Modul").replace(/\s+/g, "_")}.docx`;

  // Build all sections
  const sections = [
    ...makeCover(hd.dokumenHeader, hd.daftarLampiran),
    ...(r.lkpd01a        ? [pageBreak(), ...makeLkpd01a(r.lkpd01a)]           : []),
    ...(r.lkpd01b        ? [pageBreak(), ...makeLkpd01b(r.lkpd01b)]           : []),
    ...(r.asesmenFormatif? [pageBreak(), ...makeAsesmenFormatif(r.asesmenFormatif)] : []),
    ...(r.asesmenSumatif ? [pageBreak(), ...makeAsesmenSumatif(r.asesmenSumatif)]  : []),
    ...(r.rekapKelas     ? [pageBreak(), ...makeRekapKelas(r.rekapKelas)]      : []),
    ...(r.mediaPembelajaran ? [pageBreak(), ...makeMedia(r.mediaPembelajaran)] : []),
    ...(r.lembarRefleksi ? [pageBreak(), ...makeLembarRefleksi(r.lembarRefleksi)] : []),
    ...(r.bahanPengayaan ? [pageBreak(), ...makePengayaan(r.bahanPengayaan)]   : []),
    ...(r.bahanRemediasi ? [pageBreak(), ...makeRemediasi(r.bahanRemediasi)]   : []),
  ];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 20, color: C.textDark },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
        },
      },
      children: sections,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, namaFile);
}
