import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
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
  purple:      "7030A0", // Compatibility alias
  purpleLightOld:"EAD1FF",

  // Orange Theme
  orangeDark:  "C55A11",
  orangeMid:   "D84315",
  orangeLight: "FCE4D6",
  orange:      "C55A11", // Compatibility alias

  // Yellow Theme
  yellowDark:  "B7791F",
  yellowMid:   "FFC000",
  yellowLight: "FFF2CC",
  yellow:      "FFC000", // Compatibility alias
};

const PAGE_W    = 11906;  // A4 lebar
const PAGE_H    = 16838;  // A4 tinggi
const MARGIN    = 1080;
const CONTENT_W = PAGE_W - MARGIN * 2;
const CM        = { top: 100, bottom: 100, left: 150, right: 150 }; // Enhanced padding
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
    spBefore = 40, spAfter = 40, indent = null, underline = false,
  } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before: spBefore, after: spAfter },
    indent: indent || undefined,
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

// ── Cell helpers ──
function hCell(text, opts = {}) {
  const { colSpan = 1, rowSpan = 1, w, bg = C.navyDark, size = 20, align = AlignmentType.CENTER } = opts;
  return new TableCell({
    columnSpan: colSpan, rowSpan: rowSpan,
    width: w ? { size: w, type: WidthType.DXA } : undefined,
    borders: allBorders(C.navyMid, 4),
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: CM, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: align, children: [new TextRun({ text, bold: true, size, color: C.white, font: "Arial" })] })],
  });
}

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

const labelCell = (text, w = 3000, bg = C.tealLight) =>
  dCell(p(text, { bold: true, size: 20, color: C.tealDark }), { w, bg });

function parseMarkdownRuns(line, defaultOpts = {}) {
  const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.filter(p => p.length > 0).map(part => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return { ...defaultOpts, text: part.slice(2, -2), bold: true };
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return { ...defaultOpts, text: part.slice(1, -1), italic: true };
    }
    return { ...defaultOpts, text: part };
  });
}

function valueCell(text, w) {
  if (!text) return dCell(p("", { size: 20 }), { w });
  
  let strText = text;
  if (typeof text === 'object') {
    try {
       if (Array.isArray(text)) {
          strText = text.map(t => {
             if (typeof t === 'object') return Object.values(t).join(" - ");
             return String(t);
          }).join("\n");
       } else {
          strText = Object.entries(text).map(([k, v]) => {
            const keyCap = String(k).charAt(0).toUpperCase() + String(k).slice(1);
            if (Array.isArray(v)) {
               return `**${keyCap}**:\n` + v.map(item => `- ${item}`).join("\n");
            }
            return `**${keyCap}**: ${v}`;
          }).join("\n\n");
       }
    } catch(e) {
       strText = String(text);
    }
  } else {
    strText = String(text);
  }
  
  const lines = String(strText).split("\n");
  return dCell(lines.map(l => pMulti(parseMarkdownRuns(l, { size: 20, color: C.textDark }), { spBefore: 20, spAfter: 20 })), { w });
}

// ── Banner full-width ──
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

// ── Section header row inside a table ──
function secRow(text, colSpan = 2, bg = C.navyDark) {
  return new TableRow({ children: [new TableCell({
    columnSpan: colSpan,
    borders: allBorders(C.navyMid, 4),
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [p(text, { bold: true, size: 22, color: C.white })],
  })] });
}

function subSecRow(text, colSpan = 2, bg = C.navyMid) {
  return new TableRow({ children: [new TableCell({
    columnSpan: colSpan,
    borders: allBorders(C.navyMid, 3),
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    children: [p(text, { bold: true, size: 20, color: C.white })],
  })] });
}

// ═══════════════════════════════════════════════════════════
// BAGIAN I — DASAR KEBIJAKAN & IDENTITAS SEKOLAH
// ═══════════════════════════════════════════════════════════
function makeBagian1() {
  // 1. Banner Utama
  const mainBanner = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      borders: allBorders(C.navyDark, 8),
      shading: { fill: C.navyDark, type: ShadingType.CLEAR },
      margins: { top: 200, bottom: 200, left: 200, right: 200 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "CAPAIAN PEMBELAJARAN", bold: true, size: 36, color: C.white, font: "Arial" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "SMK Muhammadiyah 3 Purbalingga", bold: true, size: 28, color: C.yellow, font: "Arial" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "Kurikulum Merdeka   │   Pendekatan Deep Learning", size: 22, color: C.navyLight, font: "Arial" })] }),
      ],
    })] })],
  });

  // 2. Bagian I Banner
  const bag1Banner = bannerTable("BAGIAN I \u2014 DASAR KEBIJAKAN & IDENTITAS SEKOLAH", C.navyMid, C.white, 22);

  // 3. VISI
  const visiTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1600, CONTENT_W - 1600],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: allBorders(C.yellow, 6),
        shading: { fill: C.yellow, type: ShadingType.CLEAR },
        margins: CM, verticalAlign: VerticalAlign.CENTER,
        children: [p("VISI", { bold: true, size: 24, color: C.navyDark, align: AlignmentType.CENTER })],
      }),
      new TableCell({
        borders: allBorders(C.yellow, 4),
        shading: { fill: C.yellowLight, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 160, right: 160 },
        children: [p("MENJADIKAN SMK YANG UNGGUL, ISLAMI, DAN BERJIWA ENTREPRENEUR", { bold: true, size: 22, color: C.navyDark })],
      }),
    ]})],
  });

  // 4. MISI
  const misiList = [
    "Menyelenggarakan pendidikan dan pembiasaan nilai-nilai Islami berbasis Industri.",
    "Menyelenggarakan pendidikan yang mendorong peserta didik untuk mahir dan menguasai keahlian bidang Informasi, Media, dan Teknologi.",
    "Membekali peserta didik dengan pendidikan yang mendorong dalam berinovasi dan mengembangkan diri.",
    "Membekali peserta didik dengan pendidikan kecakapan hidup.",
    "Membina dan membekali peserta didik yang berjiwa kompetitif.",
    "Membekali siswa dengan pendidikan Entrepreneur.",
    "Menyelenggarakan pendidikan berbasis industri / dunia usaha.",
    "Menyelenggarakan pendidikan berwawasan global dan kearifan lokal.",
  ];

  const misiTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1600, CONTENT_W - 1600],
    rows: [
      new TableRow({ children: [hCell("MISI", { bg: C.navyMid }), hCell("Uraian Misi Sekolah", { bg: C.navyMid })] }),
      ...misiList.map((m, i) => new TableRow({ children: [
        dCell(p(`${i + 1}.`, { bold: true, size: 20, align: AlignmentType.CENTER }), { w: 1600, bg: i % 2 === 0 ? C.navyLight : C.gray }),
        dCell(p(m, { size: 20 }), { bg: i % 2 === 0 ? C.white : C.gray }),
      ]})),
    ],
  });

  // 5. TUJUAN UMUM
  const tujuanUmumList = [
    "Meningkatkan keimanan dan ketaqwaan peserta didik kepada Tuhan Yang Maha Esa.",
    "Mengembangkan potensi peserta didik agar menjadi warga negara yang berakhlak mulia, sehat, berilmu, cakap, kreatif, mandiri, demokratis, dan bertanggung jawab.",
    "Mengembangkan potensi peserta didik agar memiliki wawasan kebangsaan, memahami dan menghargai keanekaragaman budaya bangsa Indonesia.",
    "Mengembangkan potensi peserta didik agar memiliki kepedulian terhadap lingkungan hidup dengan secara aktif turut memelihara dan melestarikannya.",
  ];

  const tujuanKhususList = [
    "Mempersiapkan peserta didik yang berakhlak mulia, produktif, mandiri, dan mampu bersaing di dunia kerja sesuai kompetensi program keahliannya.",
    "Mempersiapkan peserta didik agar lebih ulet dan gigih dalam berkompetisi, serta dapat beradaptasi di lingkungan kerja dan mengembangkan sikap profesional.",
    "Membekali peserta didik dengan akidah Islam, Ilmu Pengetahuan, dan teknologi agar mampu mengembangkan diri menjadi manusia beriman dan bertaqwa.",
    "Membekali peserta didik agar memiliki empat kompetensi: kecakapan Informasi, Media & Teknologi; kemampuan berinovasi; keahlian komunikasi; dan kecakapan hidup.",
  ];

  const tujuanTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1600, CONTENT_W - 1600],
    rows: [
      new TableRow({ children: [hCell("TUJUAN", { bg: C.greenMid }), hCell("Uraian Tujuan Sekolah", { bg: C.greenMid })] }),
      new TableRow({ children: [
        dCell(p("Tujuan Umum", { bold: true, size: 20, align: AlignmentType.CENTER }), { bg: C.greenLight }),
        dCell(tujuanUmumList.map((t, i) => p(`${i + 1}. ${t}`, { size: 20, spBefore: 20, spAfter: 20 })), { bg: C.white }),
      ]}),
      new TableRow({ children: [
        dCell(p("Tujuan Khusus", { bold: true, size: 20, align: AlignmentType.CENTER }), { bg: C.greenLight }),
        dCell(tujuanKhususList.map((t, i) => p(`${i + 1}. ${t}`, { size: 20, spBefore: 20, spAfter: 20 })), { bg: C.gray }),
      ]}),
    ],
  });

  return [mainBanner, pEmpty(80), bag1Banner, pEmpty(80), visiTable, pEmpty(80), misiTable, pEmpty(80), tujuanTable];
}

// ═══════════════════════════════════════════════════════════
// BAGIAN II — 8 DIMENSI PROFIL LULUSAN
// ═══════════════════════════════════════════════════════════
function makeBagian2() {
  const dimensi = [
    { no: "1", nama: "Keimanan dan Ketakwaan\nterhadap Tuhan YME",     deskripsi: "Memiliki keyakinan spiritual, berakhlak mulia, dan mengamalkannya dalam kehidupan sehari-hari." },
    { no: "2", nama: "Kewargaan\n(Citizenship)",                        deskripsi: "Memiliki jiwa nasionalisme, cinta tanah air, toleransi dalam keberagaman, serta kepedulian terhadap lingkungan dan masyarakat global." },
    { no: "3", nama: "Penalaran Kritis",                                deskripsi: "Mampu memproses informasi secara logis, objektif, serta mampu menganalisis dan memecahkan masalah." },
    { no: "4", nama: "Kreativitas",                                     deskripsi: "Mampu menghasilkan gagasan, karya, atau tindakan orisinal serta inovatif untuk beradaptasi dengan berbagai situasi." },
    { no: "5", nama: "Kemandirian",                                     deskripsi: "Bertanggung jawab atas proses belajarnya sendiri, mampu mengatur waktu, dan memiliki inisiatif tinggi tanpa ketergantungan penuh." },
    { no: "6", nama: "Kolaborasi",                                      deskripsi: "Kemampuan bekerja sama secara efektif, menghargai pendapat orang lain, dan berkontribusi secara positif dalam kelompok." },
    { no: "7", nama: "Komunikasi",                                      deskripsi: "Terampil menyampaikan ide, gagasan, dan perasaan secara jelas, efektif, dan santun, baik secara lisan maupun tulisan." },
    { no: "8", nama: "Kesehatan",                                       deskripsi: "Memiliki kesadaran dan kemampuan dalam menjaga kesejahteraan fisik dan mental agar siap dan optimal dalam beraktivitas." },
  ];

  const W = [700, 2800, CONTENT_W - 700 - 2800];

  const tabel = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      new TableRow({ children: [hCell("No", { w: W[0], bg: C.purpleDark }), hCell("Dimensi Profil Lulusan", { w: W[1], bg: C.purpleDark }), hCell("Deskripsi", { bg: C.purpleDark })] }),
      ...dimensi.map((d, i) => new TableRow({ children: [
        dCell(p(d.no, { bold: true, size: 22, align: AlignmentType.CENTER, color: C.purpleDark }), { w: W[0], bg: i % 2 === 0 ? C.purpleLight : C.gray, vAlign: VerticalAlign.CENTER }),
        dCell(d.nama.split("\n").map(l => p(l, { bold: true, size: 20, spBefore: 20, spAfter: 20, color: C.purpleDark })), { w: W[1], bg: i % 2 === 0 ? C.white : C.gray }),
        dCell(p(d.deskripsi, { size: 20, italic: true }), { bg: i % 2 === 0 ? C.white : C.gray }),
      ]})),
    ],
  });

  const catatan = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      borders: allBorders(C.navyMid, 3),
      shading: { fill: C.navyLight, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      children: [
        p("Catatan:", { bold: true, size: 20, color: C.textBlue }),
        p("Seluruh Capaian Pembelajaran yang dikembangkan guru di SMK Muhammadiyah 3 Purbalingga harus berkontribusi pada pengembangan satu atau lebih dari 8 Dimensi Profil Lulusan di atas. Libatkan minimal 1 dimensi pada setiap mata pelajaran.", { size: 19, italic: true, color: C.textBlue }),
      ],
    })] })],
  });

  return [
    bannerTable("BAGIAN II \u2014 8 DIMENSI PROFIL LULUSAN", C.navyMid, C.white, 22,
      "Seluruh CP yang dikembangkan harus berkontribusi pada satu atau lebih dimensi berikut"),
    pEmpty(80),
    tabel,
    pEmpty(80),
    catatan,
  ];
}

// ═══════════════════════════════════════════════════════════
// BAGIAN III — PETUNJUK PENGISIAN
// ═══════════════════════════════════════════════════════════
function makeBagian3() {
  const petunjuk = [
    { bag: "A", nama: "Identitas Mata Pelajaran",          isi: "Isi sesuai data mata pelajaran, program keahlian, fase, kelas, dan alokasi waktu yang diajarkan." },
    { bag: "B", nama: "Capaian Pembelajaran",              isi: "Salin teks CP dari dokumen Kepmendikbudristek yang berlaku. Pastikan sesuai dengan fase dan program keahlian. Isi pula CP per elemen jika ada." },
    { bag: "C", nama: "Analisis & Kontekstualisasi CP",    isi: "Jabarkan kompetensi inti (pengetahuan, keterampilan, sikap) dan kaitkan dengan konteks lokal Purbalingga serta kebutuhan dunia industri (DUDI)." },
    { bag: "D", nama: "8 Dimensi Profil Lulusan",          isi: "Beri tanda centang (\u2713) dan uraikan singkat bagaimana mata pelajaran ini mengembangkan dimensi profil yang relevan." },
    { bag: "E", nama: "Implementasi Deep Learning",        isi: "Jelaskan implementasi 3 aspek deep learning: Mindful (sadar penuh), Meaningful (bermakna), Joyful (menyenangkan)." },
    { bag: "F", nama: "Rekomendasi Strategi Pembelajaran", isi: "Rekomendasikan model pembelajaran, asesmen, sumber & media belajar, serta alat yang sesuai. Ini menjadi acuan ATP dan Modul Ajar." },
    { bag: "G", nama: "Catatan Pengembangan & Validasi",   isi: "Dokumentasikan adaptasi yang dilakukan, tantangan yang diperkirakan, dan proses validasi oleh Waka Kurikulum & Kepala Sekolah." },
  ];

  const W = [700, 2800, CONTENT_W - 700 - 2800];

  const tabel = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      new TableRow({ children: [hCell("Bag.", { w: W[0], bg: C.orangeDark }), hCell("Komponen", { w: W[1], bg: C.orangeDark }), hCell("Petunjuk Pengisian", { bg: C.orangeDark })] }),
      ...petunjuk.map((d, i) => new TableRow({ children: [
        dCell(p(d.bag, { bold: true, size: 22, align: AlignmentType.CENTER, color: C.orangeDark }), { w: W[0], bg: i % 2 === 0 ? C.orangeLight : C.grayDark, vAlign: VerticalAlign.CENTER }),
        dCell(p(d.nama, { bold: true, size: 20 }), { w: W[1], bg: i % 2 === 0 ? C.white : C.gray }),
        dCell(p(d.isi, { size: 20, italic: true }), { bg: i % 2 === 0 ? C.white : C.gray }),
      ]})),
    ],
  });

  return [
    bannerTable("BAGIAN III \u2014 PETUNJUK PENGISIAN CAPAIAN PEMBELAJARAN", C.orangeMid, C.white, 22,
      "Bacalah petunjuk berikut sebelum mengisi format CP. Isi setiap bagian secara lengkap, kontekstual, dan selaras visi-misi sekolah."),
    pEmpty(80),
    tabel,
  ];
}

// ═══════════════════════════════════════════════════════════
// BAGIAN IV — FORMAT ISIAN GURU (INTI TEMPLATE)
// ═══════════════════════════════════════════════════════════
function makeBagian4(data, aiData) {
  const W = [3000, CONTENT_W - 3000];

  const lv = (label, value) => new TableRow({ children: [labelCell(label, W[0]), valueCell(value || "\u2014", W[1])] });

  // D. Dimensi profil checklist
  const dimNames = [
    "Keimanan & Ketakwaan terhadap Tuhan YME",
    "Kewargaan (Citizenship)",
    "Penalaran Kritis",
    "Kreativitas",
    "Kemandirian",
    "Kolaborasi",
    "Komunikasi",
    "Kesehatan",
  ];

  const dimCells = dimNames.map((name, i) => {
    const val = aiData.dimensiProfil?.[`dimensi${i + 1}`];
    if (val && val.trim()) {
      return pMulti([
        { text: `\u2611 ${i + 1}. ${name}`, bold: true, size: 20, color: C.navyDark },
        { text: `  \u2192  ${val}`, size: 20, color: C.textDark, italic: true },
      ], { spBefore: 25, spAfter: 25 });
    }
    return p(`\u2610 ${i + 1}. ${name}`, { size: 20, color: "888888", spBefore: 25, spAfter: 25 });
  });

  // G. Tanda tangan
  const today = new Date();
  const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const dateStr = `Purbalingga, ${today.getDate()} ${BULAN[today.getMonth()]} ${today.getFullYear()}`;
  const W3 = [Math.floor(CONTENT_W / 3), Math.floor(CONTENT_W / 3), CONTENT_W - Math.floor(CONTENT_W / 3) * 2];

  const ttdTable = new Table({
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
    ]})],
  });

  // ── B.2 Tabel per elemen (2 kolom: Elemen | Capaian Pembelajaran) ──
  const elemenList = (Array.isArray(aiData.elemenList) && aiData.elemenList.length > 0)
    ? aiData.elemenList
    : (Array.isArray(data.elemenList) && data.elemenList.length > 0
      ? data.elemenList
      : (data.elemen1 ? [{ nama: data.elemen1, capaian: data.capaian1 || '' }, { nama: data.elemen2 || '', capaian: data.capaian2 || '' }] : []));

  const WB2 = [Math.floor(CONTENT_W * 0.35), Math.floor(CONTENT_W * 0.65)];

  const elemenTableRows = [
    new TableRow({ children: [
      hCell("Elemen", { w: WB2[0], bg: C.tealMid }),
      hCell("Capaian Pembelajaran", { bg: C.tealMid }),
    ]}),
    ...(elemenList.length > 0
      ? elemenList.filter(el => el.nama && el.nama.trim()).map((el, i) =>
          new TableRow({ children: [
            dCell(p(el.nama, { bold: true, size: 20, color: C.tealDark }), { w: WB2[0], bg: i % 2 === 0 ? C.white : C.gray }),
            dCell(p(el.capaian || '\u2014', { size: 20 }), { bg: i % 2 === 0 ? C.white : C.gray }),
          ]})
        )
      : [new TableRow({ children: [
          dCell(p('\u2014', { size: 20, color: '888888' }), { w: WB2[0] }),
          dCell(p('Belum diisi', { size: 20, color: '888888', italic: true }), {}),
        ]})]
    ),
  ];

  const elemenTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: WB2,
    rows: elemenTableRows,
  });

  // B.1 teks CP sebagai paragraf bebas (bukan label-value)
  const b1CpLines = (data.cpText || '\u2014').split('\n');
  const b1CpParagraphs = b1CpLines.map(line => p(line, { size: 20, spBefore: 30, spAfter: 30 }));

  const b1Row = new TableRow({ children: [
    new TableCell({
      columnSpan: 2,
      borders: allBorders(C.tealMid, 2),
      shading: { fill: C.white, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 180, right: 180 },
      children: b1CpParagraphs,
    }),
  ]});

  // B.2 sub header + elemen table row (embed as a cell spanning 2 cols)
  const b2EmbedRow = new TableRow({ children: [
    new TableCell({
      columnSpan: 2,
      borders: allBorders(C.tealMid, 2),
      shading: { fill: C.white, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 0, right: 0 },
      children: [elemenTable],
    }),
  ]});

  const mainTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      // ── A. IDENTITAS ──
      secRow("A. IDENTITAS MATA PELAJARAN", 2, C.tealDark),
      lv("Nama Mata Pelajaran", data.subject),
      lv("Program Keahlian", data.program),
      lv("Fase", data.phase),
      lv("Kelas", data.grade),
      lv("Semester", data.semester),
      lv("Tahun Pelajaran", data.year),
      lv("Alokasi Waktu", data.time),
      lv("Guru Mata Pelajaran", data.teacher),

      // ── B. CAPAIAN PEMBELAJARAN ──
      secRow("B. CAPAIAN PEMBELAJARAN", 2, C.tealDark),
      subSecRow("B.1  Capaian Pembelajaran Umum (dari Kepmendikbudristek)", 2, C.tealMid),
      b1Row,
      subSecRow("B.2  Capaian Pembelajaran Per Elemen", 2, C.tealMid),
      b2EmbedRow,

      // ── C. ANALISIS & KONTEKSTUALISASI ──
      secRow("C. ANALISIS & KONTEKSTUALISASI CP", 2, C.tealDark),
      lv("Kompetensi Inti yang Dikembangkan\n(Pengetahuan, Keterampilan, Sikap)", aiData.analisis?.kompetensiInti),
      lv("Koneksi dengan Dunia Kerja / DUDI", aiData.analisis?.koneksiIndustri),
      lv("Koneksi dengan Konteks Lokal Purbalingga", aiData.analisis?.koneksiLokal),

      // ── D. 8 DIMENSI ──
      secRow("D. KETERKAITAN DENGAN 8 DIMENSI PROFIL LULUSAN", 2, C.tealDark),
      new TableRow({ children: [
        labelCell("Dimensi Profil yang Dikembangkan\n(beri tanda \u2611 pada yang relevan)", W[0]),
        dCell(dimCells, { w: W[1] }),
      ]}),

      // ── E. DEEP LEARNING ──
      secRow("E. IMPLEMENTASI DEEP LEARNING", 2, C.tealDark),
      lv("Mindful Learning\n(Pembelajaran Penuh Kesadaran)", aiData.deepLearning?.mindful),
      lv("Meaningful Learning\n(Pembelajaran Bermakna)", aiData.deepLearning?.meaningful),
      lv("Joyful Learning\n(Pembelajaran yang Menyenangkan)", aiData.deepLearning?.joyful),

      // ── F. STRATEGI ──
      secRow("F. REKOMENDASI STRATEGI PEMBELAJARAN", 2, C.tealDark),
      lv("Model Pembelajaran yang Disarankan", aiData.strategi?.model),
      lv("Pendekatan Asesmen", aiData.strategi?.asesmen),
      lv("Sumber & Media Belajar", aiData.strategi?.media),
      lv("Alat / Perangkat yang Dibutuhkan", aiData.strategi?.alat),

      // ── G. CATATAN PENGEMBANGAN ──
      secRow("G. CATATAN PENGEMBANGAN & VALIDASI", 2, C.tealDark),
      lv("Catatan Kontekstualisasi CP", aiData.catatanPengembangan?.catatan || "\u2014"),
      lv("Tantangan & Solusi Antisipasi", aiData.catatanPengembangan?.tantangan || "\u2014"),
      lv("Tanggal Penyusunan", dateStr),
    ],
  });

  return [
    bannerTable("BAGIAN IV \u2014 DOKUMEN UTAMA GURU", C.tealDark, C.white, 26,
      "SMK Muhammadiyah 3 Purbalingga   │   Kurikulum Merdeka   │   Pendekatan Deep Learning"),
    pEmpty(100),
    mainTable,
    pEmpty(120),
    ttdTable,
  ];
}

// ═══════════════════════════════════════════════════════════
// BAGIAN V — ALUR PENGGUNAAN DOKUMEN (Infografis)
// ═══════════════════════════════════════════════════════════
function makeBagian5() {
  const steps = [
    { no: "1", icon: "📋", label: "Capaian Pembelajaran",  sub: "Dokumen ini" },
    { no: "2", icon: "📊", label: "Analisis CP & ATP",     sub: "Alur Tujuan Pembelajaran" },
    { no: "3", icon: "🎯", label: "Tujuan Pembelajaran",   sub: "Per pertemuan" },
    { no: "4", icon: "📖", label: "Modul Ajar",            sub: "Rencana Pembelajaran" },
    { no: "5", icon: "🏫", label: "Pembelajaran di Kelas", sub: "Implementasi" },
  ];

  const BOX = 1700;
  const ARR = 350;
  const colWidths = [];
  for (let i = 0; i < 5; i++) { colWidths.push(BOX); if (i < 4) colWidths.push(ARR); }

  const boxColors = [C.tealDark, C.purpleMid, C.navyMid, C.orangeMid, C.greenMid];

  const alurTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: steps.flatMap((s, i) => {
          const box = new TableCell({
            width: { size: BOX, type: WidthType.DXA },
            borders: allBorders(boxColors[i], 4),
            shading: { fill: boxColors[i], type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 80, right: 80 },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s.icon, size: 36, font: "Arial" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 20 }, children: [new TextRun({ text: s.label, bold: true, size: 18, color: C.white, font: "Arial" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: s.sub, size: 16, color: C.gray, font: "Arial" })] }),
            ],
          });
          if (i < 4) {
            const arrow = new TableCell({
              width: { size: ARR, type: WidthType.DXA },
              borders: noBorder(),
              shading: { fill: C.white, type: ShadingType.CLEAR },
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "➔", size: 32, color: C.navyMid, font: "Arial" })] })],
            });
            return [box, arrow];
          }
          return [box];
        }),
      }),
    ],
  });

  const catatanGuru = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      borders: allBorders(C.purpleMid, 3),
      shading: { fill: C.purpleLight, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      children: [
        p("📌 Catatan Penting untuk Guru:", { bold: true, size: 20, color: C.purpleDark }),
        p("• Dokumen CP ini bersifat template — sesuaikan setiap bagian dengan mata pelajaran dan program keahlian masing-masing.", { size: 19, italic: true }),
        p("• Pastikan CP yang ditulis merujuk pada dokumen resmi Kepmendikbudristek yang berlaku untuk Program Keahlian.", { size: 19, italic: true }),
        p("• Libatkan minimal 1 (satu) Dimensi Profil Lulusan yang relevan pada setiap mata pelajaran.", { size: 19, italic: true }),
        p("• Deep Learning diterapkan melalui aktivitas yang mindful, meaningful, dan joyful — bukan sekadar formalitas dokumen.", { size: 19, italic: true }),
        p("• Dokumen yang telah diisi wajib diverifikasi Waka Kurikulum dan disimpan sebagai arsip kurikulum sekolah.", { size: 19, italic: true }),
      ],
    })] })],
  });

  return [
    bannerTable("BAGIAN V \u2014 ALUR PENGGUNAAN DOKUMEN CP", C.purpleMid, C.white, 22,
      "Gunakan Dokumen CP ini sebagai titik awal penyusunan seluruh perangkat pembelajaran"),
    pEmpty(100),
    alurTable,
    pEmpty(80),
    catatanGuru,
    pEmpty(80),
    bannerTable("SMK MUHAMMADIYAH 3 PURBALINGGA   •   Unggul   •   Islami   •   Berjiwa Entrepreneur", C.navyDark, C.yellow, 20),
  ];
}

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════
export async function generateAndDownloadDocx(data, aiData) {
  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 20 } } } },
    sections: [
      // ── HALAMAN 1: Cover Page ──
      {
        properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
        children: [...makeCoverPage("Capaian Pembelajaran (CP)", data)],
      },
      // ── HALAMAN 2: Bagian I (Identitas Sekolah) ──
      {
        properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
        children: [...makeBagian1(), pEmpty(120)],
      },
      // ── HALAMAN 3: Bagian II & III ──
      {
        properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
        children: [...makeBagian2(), pEmpty(120), ...makeBagian3(), pEmpty(120)],
      },
      // ── HALAMAN 4+: Bagian IV (Format Isian Guru) ──
      {
        properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
        children: [...makeBagian4(data, aiData), pEmpty(120)],
      },
      // ── HALAMAN TERAKHIR: Bagian V (Alur) ──
      {
        properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
        children: [...makeBagian5()],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `CP_${(data.subject || "Mapel").replace(/ /g, "_")}.docx`);
}

