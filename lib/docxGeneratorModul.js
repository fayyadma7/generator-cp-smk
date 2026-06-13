import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
} from "docx";
import { saveAs } from "file-saver";

// ═══════════════════════════════════════════════════════════
// KONSTANTA & HELPER
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
  orange:      "C55A11", // Compatibility alias

  // Yellow Theme
  yellowDark:  "B7791F",
  yellowMid:   "FFC000",
  yellowLight: "FFF2CC",
  yellow:      "FFC000", // Compatibility alias
};

const PAGE_W    = 11906;  
const PAGE_H    = 16838;  
const MARGIN    = 1080;
const CONTENT_W = PAGE_W - MARGIN * 2;
const CM        = { top: 100, bottom: 100, left: 150, right: 150 };
const CM_ANS    = { top: 120, bottom: 120, left: 150, right: 150 };

const allBorders  = (color = "AAAAAA", sz = 3)  => { const b = { style: BorderStyle.SINGLE, size: sz, color }; return { top: b, bottom: b, left: b, right: b }; };
const noBorder    = () => { const b = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }; return { top: b, bottom: b, left: b, right: b }; };

function makeCoverPage(title, data, subtitle = "") {
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
                pEmpty(600),
                pEmpty(600),

                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 80 },
                  children: [new TextRun({ text: "DOKUMEN PERANGKAT AJAR", bold: true, size: 20, color: C.navyMid, font: "Arial" })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 60 },
                  children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 36, color: C.navyDark, font: "Arial" })],
                }),
                subtitle ? new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 120 },
                  children: [new TextRun({ text: subtitle, bold: true, size: 24, color: C.tealDark, font: "Arial", italic: true })],
                }) : pEmpty(20),
                pEmpty(600),
                pEmpty(600),

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

                pEmpty(400),
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

const pEmpty = (sp = 80) => new Paragraph({ children: [new TextRun("")] , spacing: { before: sp, after: sp } });

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

function secRow(text, colSpan = 2, bg = C.navyDark, textColor = C.white) {
  return new TableRow({ children: [new TableCell({
    columnSpan: colSpan,
    borders: allBorders(C.navyMid, 4),
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    verticalAlign: VerticalAlign.CENTER,
    children: [p(text, { bold: true, size: 22, color: textColor })],
  })] });
}

function valueCell(content, w) {
  if (!content) return dCell(p("\u2014", { size: 20 }), { w });
  
  let paras = [];
  if (Array.isArray(content)) {
    paras = content.map(l => p(`• ${l}`, { size: 20, spBefore: 20, spAfter: 20 }));
  } else if (typeof content === 'object') {
    Object.entries(content).forEach(([k, v]) => {
      paras.push(pMulti([{ text: `${k}: `, bold: true }, { text: String(v) }], { spBefore: 20, spAfter: 20 }));
    });
  } else {
    const lines = String(content).split("\n");
    paras = lines.map(l => p(l, { size: 20, spBefore: 20, spAfter: 20 }));
  }
  return dCell(paras, { w });
}

const labelCell = (text, w = 3000, bg = C.gray) =>
  dCell(p(text, { bold: true, size: 20 }), { w, bg });


// ═══════════════════════════════════════════════════════════
// D. SKENARIO (Helper)
// ═══════════════════════════════════════════════════════════
function makeSkenarioRows(aiData) {
  const W_SKEN = [Math.floor(CONTENT_W * 0.15), Math.floor(CONTENT_W * 0.425), Math.floor(CONTENT_W * 0.425)];
  const skenarioData = aiData.skenario_pembelajaran?.pertemuan || [];
  
  if (skenarioData.length === 0) {
    return [new TableRow({ children: [dCell(p("Belum ada skenario", { size: 20, italic: true }), { colSpan: 3 })] })];
  }

  const rows = [];
  skenarioData.forEach((sken, idx) => {
    // Header Pertemuan
    rows.push(new TableRow({ children: [
      dCell(p(`PERTEMUAN KE-${sken.nomor || idx + 1} (${sken.alokasi_waktu || '... JP'}) - ${sken.topik || ''}`, { bold: true, size: 20 }), { colSpan: 3, bg: C.grayDark })
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
      let guruParas = [];
      let siswaParas = [];
      if (Array.isArray(f.data?.kegiatan_guru)) {
         guruParas = f.data.kegiatan_guru.map((k,i) => p(`${i+1}. ${k}`, { size: 18, spBefore: 20, spAfter: 20 }));
      } else {
         guruParas = [p(String(f.data?.kegiatan_guru || "-"), { size: 18 })];
      }

      if (Array.isArray(f.data?.kegiatan_peserta_didik)) {
         siswaParas = f.data.kegiatan_peserta_didik.map((k,i) => p(`${i+1}. ${k}`, { size: 18, spBefore: 20, spAfter: 20 }));
      } else {
         siswaParas = [p(String(f.data?.kegiatan_peserta_didik || "-"), { size: 18 })];
      }

      rows.push(new TableRow({ children: [
        dCell([
          p(f.nama, { bold: true, size: 20, align: AlignmentType.CENTER }),
          p(f.data?.durasi || "... menit", { size: 18, align: AlignmentType.CENTER })
        ], { w: W_SKEN[0] }),
        dCell(guruParas, { w: W_SKEN[1] }),
        dCell(siswaParas, { w: W_SKEN[2] }),
      ]}));
    });
  });

  return rows;
}


function makeRubrikRows(aiData) {
  const rubrikW = [Math.floor(CONTENT_W * 0.2), Math.floor(CONTENT_W * 0.2), Math.floor(CONTENT_W * 0.2), Math.floor(CONTENT_W * 0.2), Math.floor(CONTENT_W * 0.2)];
  const aspekData = aiData.rubrik_penilaian?.aspek || [];

  if (aspekData.length === 0) {
    return [new TableRow({ children: [dCell(p("Belum ada rubrik", { size: 20, italic: true }), { colSpan: 5 })] })];
  }

  const rows = [];
  rows.push(new TableRow({ children: [
    dCell(p("Aspek Penilaian", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
    dCell(p("Perlu Bimbingan (1)", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
    dCell(p("Cukup (2)", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
    dCell(p("Baik (3)", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
    dCell(p("Sangat Baik (4)", { bold: true, align: AlignmentType.CENTER }), { bg: C.grayDark }),
  ]}));

  aspekData.forEach(a => {
    rows.push(new TableRow({ children: [
      dCell(p(a.nama, { bold: true })),
      dCell(p(a.level_1?.deskriptor || "-")),
      dCell(p(a.level_2?.deskriptor || "-")),
      dCell(p(a.level_3?.deskriptor || "-")),
      dCell(p(a.level_4?.deskriptor || "-")),
    ]}));
  });

  return { rows, rubrikW };
}

// ═══════════════════════════════════════════════════════════
// BAGIAN UTAMA (FORMAT ISIAN MODUL AJAR)
// ═══════════════════════════════════════════════════════════
function makeModulAjar(data, aiData) {
  const W = [3000, CONTENT_W - 3000];
  const lv = (label, value) => new TableRow({ children: [labelCell(label, W[0]), valueCell(value, W[1])] });

  // Dimensi Profil
  const dimNames = ["Keimanan & Ketakwaan", "Kewargaan", "Penalaran Kritis", "Kreativitas", "Kemandirian", "Kolaborasi", "Komunikasi", "Kesehatan"];
  const dimArr = aiData.kerangka_kurikulum?.dimensi_profil_lulusan || [];
  
  const dimCells = dimNames.map((name, i) => {
    const isChecked = dimArr.some(d => d.toLowerCase().includes(name.toLowerCase()));
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
      lv("Judul Modul Ajar", aiData.identitas?.judul_modul),
      lv("Nomor Modul Ajar", aiData.identitas?.nomor_modul),
      lv("Nomor TP yang Dirujuk", aiData.identitas?.nomor_tp || data.targetTp),
      lv("Alokasi Waktu", aiData.identitas?.alokasi_waktu),
      lv("Pertemuan ke-", aiData.identitas?.pertemuan_ke),
      lv("Guru Mata Pelajaran", data.teacher),

      // ── B. KERANGKA KURIKULUM ──
      secRow("B. KERANGKA KURIKULUM"),
      lv("Capaian Pembelajaran (CP)", aiData.kerangka_kurikulum?.capaian_pembelajaran || data.cpText),
      lv("Elemen CP", aiData.kerangka_kurikulum?.elemen_cp || data.elemenCP),
      lv("Tujuan Pembelajaran (TP)", aiData.kerangka_kurikulum?.tujuan_pembelajaran || data.targetTpText),
      lv("Indikator Ketercapaian TP (IKTP)", aiData.kerangka_kurikulum?.indikator_ketercapaian_tp),
      lv("Posisi dalam ATP", aiData.kerangka_kurikulum?.posisi_dalam_atp),
      new TableRow({ children: [
        labelCell("8 Dimensi Profil Lulusan yang Dikembangkan", W[0]),
        dCell([
          ...dimCells,
          pEmpty(40),
          ...dimArr.map(d => p(d, { size: 18, italic: true }))
        ], { w: W[1] })
      ]}),

      // ── C. RANCANGAN PEMBELAJARAN ──
      secRow("C. RANCANGAN PEMBELAJARAN — PENDEKATAN DEEP LEARNING"),
      
      new TableRow({ children: [dCell(p("C.1 MINDFUL LEARNING - Pembelajaran Penuh Kesadaran", { bold: true, color: C.greenDark }), { colSpan: 2, bg: C.greenLight, vAlign: VerticalAlign.CENTER })] }),
      lv("Apersepsi & Aktivasi Pengetahuan Awal", aiData.rancangan_pembelajaran?.mindful_learning?.apersepsi),
      lv("Pertanyaan Pemantik", aiData.rancangan_pembelajaran?.mindful_learning?.pertanyaan_pemantik),
      lv("Penetapan Tujuan Bersama", aiData.rancangan_pembelajaran?.mindful_learning?.penetapan_tujuan_bersama),
      lv("Strategi Refleksi Akhir", aiData.rancangan_pembelajaran?.mindful_learning?.strategi_refleksi),

      new TableRow({ children: [dCell(p("C.2 MEANINGFUL LEARNING - Pembelajaran Bermakna", { bold: true, color: C.tealDark }), { colSpan: 2, bg: C.tealLight, vAlign: VerticalAlign.CENTER })] }),
      lv("Koneksi dengan Dunia Nyata / Industri", aiData.rancangan_pembelajaran?.meaningful_learning?.koneksi_dunia_nyata),
      lv("Koneksi Antar Mata Pelajaran", aiData.rancangan_pembelajaran?.meaningful_learning?.koneksi_antar_mapel),
      lv("Koneksi dengan Kearifan Lokal", aiData.rancangan_pembelajaran?.meaningful_learning?.koneksi_kearifan_lokal),
      lv("Produk / Hasil Belajar Bermakna", aiData.rancangan_pembelajaran?.meaningful_learning?.produk_bermakna),

      new TableRow({ children: [dCell(p("C.3 JOYFUL LEARNING - Pembelajaran yang Menyenangkan", { bold: true, color: C.orangeDark }), { colSpan: 2, bg: C.orangeLight, vAlign: VerticalAlign.CENTER })] }),
      lv("Strategi / Model Pembelajaran", aiData.rancangan_pembelajaran?.joyful_learning?.model_pembelajaran),
      lv("Variasi Aktivitas Pembelajaran", aiData.rancangan_pembelajaran?.joyful_learning?.variasi_aktivitas),
      lv("Diferensiasi Pembelajaran", aiData.rancangan_pembelajaran?.joyful_learning?.diferensiasi_pembelajaran),
      lv("Integrasi Nilai Islami", aiData.rancangan_pembelajaran?.joyful_learning?.integrasi_nilai),
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
      
      new TableRow({ children: [dCell(p("E.1 ASESMEN FORMATIF", { bold: true, color: C.purpleDark }), { colSpan: 2, bg: C.purpleLight, vAlign: VerticalAlign.CENTER })] }),
      lv("Teknik Asesmen Formatif", aiData.asesmen?.formatif?.teknik),
      lv("Instrumen", aiData.asesmen?.formatif?.instrumen),
      lv("Tindak Lanjut", aiData.asesmen?.formatif?.tindak_lanjut),

      new TableRow({ children: [dCell(p("E.2 ASESMEN SUMATIF", { bold: true, color: C.purpleDark }), { colSpan: 2, bg: C.purpleLight, vAlign: VerticalAlign.CENTER })] }),
      lv("Teknik Asesmen Sumatif", aiData.asesmen?.sumatif?.teknik),
      lv("Instrumen", aiData.asesmen?.sumatif?.instrumen),
      lv("Kriteria Ketercapaian (KKTP)", aiData.asesmen?.sumatif?.kktp),
      lv("Dimensi Profil yang Dinilai", aiData.asesmen?.sumatif?.dimensi_dinilai),

      new TableRow({ children: [dCell(p("E.3 ASESMEN DIAGNOSTIK", { bold: true, color: C.purpleDark }), { colSpan: 2, bg: C.purpleLight, vAlign: VerticalAlign.CENTER })] }),
      lv("Teknik Diagnostik", aiData.asesmen?.diagnostik?.teknik),
      lv("Hasil & Tindak Lanjut", aiData.asesmen?.diagnostik?.tindak_lanjut),
    ]
  });

  const materiTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      secRow("F. MATERI DAN SUMBER BELAJAR"),
      lv("Materi Pokok / Esensial", aiData.materi_sumber?.materi_pokok),
      lv("Materi Pengayaan", aiData.materi_sumber?.materi_pengayaan),
      lv("Materi Remedial", aiData.materi_sumber?.materi_remedial),
      lv("Sumber Belajar Utama", aiData.materi_sumber?.sumber_belajar_utama),
      lv("Sumber Belajar Pendukung", aiData.materi_sumber?.sumber_belajar_pendukung),
      lv("Media Pembelajaran", aiData.materi_sumber?.media_pembelajaran),
      lv("Alat & Bahan Praktik", aiData.materi_sumber?.alat_bahan),
      lv("Lembar Kerja Peserta Didik (LKPD)", aiData.materi_sumber?.lkpd?.map?.(l => `${l.kode} - ${l.judul} (Pert. ${l.pertemuan})`) || "-"),
    ]
  });

  const rubData = makeRubrikRows(aiData);
  const rubrikTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: rubData.rubrikW,
    rows: [
      secRow(`G. RUBRIK PENILAIAN HOLISTIK: ${aiData.rubrik_penilaian?.objek_penilaian || "-"}`, 5),
      ...rubData.rows
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
    bannerTable("DOKUMEN MODUL AJAR", C.navyDark, C.white, 26, "SMK Muhammadiyah 3 Purbalingga | Kurikulum Merdeka | Pendekatan Deep Learning"),
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
        children: [...makeCoverPage("Modul Ajar", data, aiData.identitas?.judul_modul)],
      },
      {
        properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
        children: [...makeModulAjar(data, aiData)],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Modul_Ajar_${(data.subject || "Mapel").replace(/ /g, "_")}_${(aiData.identitas?.nomor_tp || "TP").replace(/ /g, "_")}.docx`);
}
