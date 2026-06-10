import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, LevelFormat, PageNumber,
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
  white:     "FFFFFF",
  gray:      "F2F2F2",
  textDark:  "1A1A1A",
  textBlue:  "1F3864",
};

const PAGE_W   = 11906;  // ~21 cm
const PAGE_H   = 16838;  // ~29.7 cm
const MARGIN   = 1080;   // ~1.9 cm
const CONTENT_W = PAGE_W - MARGIN * 2;  

function solidBorder(color = C.navyMid, sz = 4) {
  return { style: BorderStyle.SINGLE, size: sz, color };
}
function allBorders(color = "AAAAAA", sz = 3) {
  const b = solidBorder(color, sz);
  return { top: b, bottom: b, left: b, right: b };
}
const CM = { top: 80, bottom: 80, left: 140, right: 140 };

function p(text, opts = {}) {
  const {
    bold = false, italic = false, size = 22,
    color = C.textDark, align = AlignmentType.LEFT,
    spBefore = 40, spAfter = 40, indent = null,
  } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before: spBefore, after: spAfter },
    indent: indent || undefined,
    children: [new TextRun({ text, bold, italic, size, color, font: "Arial" })],
  });
}

function pEmpty(sp = 80) {
  return new Paragraph({ children: [new TextRun("")], spacing: { before: sp, after: sp } });
}

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

function labelCell(text, w = 2800) {
  return dCell(p(text, { bold: true, size: 20 }), { w, bg: C.navyLight });
}

function valueCell(text, w, italic = false) {
  // Handle multi-line text
  const lines = text.split('\n');
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
    ]})]
  });
}

// ─────────────────────────────────────────────
// KONTEN DOKUMEN (Bagian IV Saja sesuai form)
// ─────────────────────────────────────────────
export async function generateAndDownloadDocx(data, aiData) {
  const W2 = [3200, 6546];

  function lv(label, value) {
    return new TableRow({ children: [
      labelCell(label, W2[0]),
      valueCell(value || "...", W2[1]),
    ]});
  }

  function secHeader(text, colSpan = 2) {
    return new TableRow({ children: [
      new TableCell({
        columnSpan: colSpan,
        borders: allBorders(C.navyMid, 4),
        shading: { fill: C.navyDark, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [p(text, { bold: true, size: 21, color: C.white })],
      }),
    ]});
  }
  
  const dimProfilTexts = [];
  if (aiData.dimensiProfil.dimensi1) dimProfilTexts.push(p(`☑ 1. Keimanan & Ketakwaan \u2192 ${aiData.dimensiProfil.dimensi1}`, { italic: true, size: 20 }));
  else dimProfilTexts.push(p(`☐ 1. Keimanan & Ketakwaan`, { italic: true, size: 20 }));
  
  if (aiData.dimensiProfil.dimensi2) dimProfilTexts.push(p(`☑ 2. Kewargaan \u2192 ${aiData.dimensiProfil.dimensi2}`, { italic: true, size: 20 }));
  else dimProfilTexts.push(p(`☐ 2. Kewargaan`, { italic: true, size: 20 }));

  if (aiData.dimensiProfil.dimensi3) dimProfilTexts.push(p(`☑ 3. Penalaran Kritis \u2192 ${aiData.dimensiProfil.dimensi3}`, { italic: true, size: 20 }));
  else dimProfilTexts.push(p(`☐ 3. Penalaran Kritis`, { italic: true, size: 20 }));

  if (aiData.dimensiProfil.dimensi4) dimProfilTexts.push(p(`☑ 4. Kreativitas \u2192 ${aiData.dimensiProfil.dimensi4}`, { italic: true, size: 20 }));
  else dimProfilTexts.push(p(`☐ 4. Kreativitas`, { italic: true, size: 20 }));

  if (aiData.dimensiProfil.dimensi5) dimProfilTexts.push(p(`☑ 5. Kemandirian \u2192 ${aiData.dimensiProfil.dimensi5}`, { italic: true, size: 20 }));
  else dimProfilTexts.push(p(`☐ 5. Kemandirian`, { italic: true, size: 20 }));

  if (aiData.dimensiProfil.dimensi6) dimProfilTexts.push(p(`☑ 6. Kolaborasi \u2192 ${aiData.dimensiProfil.dimensi6}`, { italic: true, size: 20 }));
  else dimProfilTexts.push(p(`☐ 6. Kolaborasi`, { italic: true, size: 20 }));

  if (aiData.dimensiProfil.dimensi7) dimProfilTexts.push(p(`☑ 7. Komunikasi \u2192 ${aiData.dimensiProfil.dimensi7}`, { italic: true, size: 20 }));
  else dimProfilTexts.push(p(`☐ 7. Komunikasi`, { italic: true, size: 20 }));

  if (aiData.dimensiProfil.dimensi8) dimProfilTexts.push(p(`☑ 8. Kesehatan \u2192 ${aiData.dimensiProfil.dimensi8}`, { italic: true, size: 20 }));
  else dimProfilTexts.push(p(`☐ 8. Kesehatan`, { italic: true, size: 20 }));


  const mainTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W2,
    rows: [
      secHeader("A. IDENTITAS MATA PELAJARAN"),
      lv("Nama Mata Pelajaran", data.subject),
      lv("Program Keahlian",    data.program),
      lv("Fase",                data.phase),
      lv("Kelas",               data.grade),
      lv("Semester",            data.semester),
      lv("Tahun Pelajaran",     data.year),
      lv("Alokasi Waktu",       data.time),
      lv("Guru Mata Pelajaran", data.teacher),

      secHeader("B. CAPAIAN PEMBELAJARAN"),
      lv("Deskripsi CP", data.cpText),

      secHeader("C. ANALISIS DAN KONTEKSTUALISASI CP"),
      lv("Kompetensi Inti yang Dikembangkan", aiData.analisis.kompetensiInti),
      lv("Koneksi dengan Dunia Kerja / Industri", aiData.analisis.koneksiIndustri),
      lv("Koneksi dengan Konteks Lokal", aiData.analisis.koneksiLokal),

      secHeader("D. KETERKAITAN DENGAN 8 DIMENSI PROFIL LULUSAN"),
      new TableRow({ children: [
        labelCell("Dimensi Profil yang Dikembangkan", W2[0]),
        dCell(dimProfilTexts, { w: W2[1] }),
      ]}),

      secHeader("E. PENDEKATAN DEEP LEARNING"),
      lv("Mindful Learning", aiData.deepLearning.mindful),
      lv("Meaningful Learning", aiData.deepLearning.meaningful),
      lv("Joyful Learning", aiData.deepLearning.joyful),

      secHeader("F. REKOMENDASI STRATEGI PEMBELAJARAN"),
      lv("Model Pembelajaran", aiData.strategi.model),
      lv("Pendekatan Asesmen", aiData.strategi.asesmen),
      lv("Sumber & Media", aiData.strategi.media),
      lv("Alat / Perangkat", aiData.strategi.alat),
    ],
  });

  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    sections: [{
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      children: [
        bannerTable("FORMAT CAPAIAN PEMBELAJARAN", C.navyDark, C.white, 28),
        bannerTable("SMK Muhammadiyah 3 Purbalingga  │  Kurikulum Merdeka  │  Pendekatan Deep Learning", C.navyMid, C.white, 22),
        pEmpty(120),
        mainTable,
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Format_CP_${data.subject.replace(/ /g, '_')}.docx`);
}
