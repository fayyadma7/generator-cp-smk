'use client';

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, PageBreak, VerticalAlign, ShadingType,
} from 'docx';
import { saveAs } from 'file-saver';

const F4_W = 12240;
const F4_H = 18720;
const MARGIN = 1134;

const LABELS = {
  lkpd: 'LEMBAR KERJA PESERTA DIDIK (LKPD)',
  formatif: 'PENILAIAN FORMATIF',
  sumatif: 'PENILAIAN SUMATIF',
  rubrik: 'RUBRIK PENILAIAN',
  materi: 'BAHAN AJAR / MATERI',
  media: 'MEDIA PEMBELAJARAN',
  refleksi: 'REFLEKSI PEMBELAJARAN',
  pengayaan: 'AKTIVITAS PENGAYAAN',
  remediasi: 'AKTIVITAS REMEDIASI',
};

function v(val) { return (val !== undefined && val !== null && val !== '') ? String(val) : '\u2014'; }
function tr(text, opts = {}) { return new TextRun({ text: v(text), size: opts.size || 20, ...opts }); }

function para(children, opts = {}) {
  if (typeof children === 'string') children = [tr(children)];
  return new Paragraph({ children, spacing: { after: opts.after || 80 }, ...opts });
}

function hCell(text, wp) {
  return new TableCell({
    children: [para([tr(text, { bold: true, size: 16 })], { after: 0 })],
    shading: { type: ShadingType.CLEAR, fill: 'EAF2F8' },
    verticalAlign: VerticalAlign.CENTER,
    width: wp ? { size: wp, type: WidthType.PERCENTAGE } : undefined,
  });
}
function dCell(text, wp) {
  return new TableCell({
    children: [para([tr(text, { size: 16 })], { after: 0 })],
    verticalAlign: VerticalAlign.CENTER,
    width: wp ? { size: wp, type: WidthType.PERCENTAGE } : undefined,
  });
}

function tbl(headers, rows, cw) {
  return new Table({
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => hCell(h, cw ? cw[i] : undefined)) }),
      ...rows.map(r => new TableRow({ children: r.map((c, i) => dCell(c, cw ? cw[i] : undefined)) })),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function sub(children, text) {
  children.push(para([tr(text, { bold: true, size: 18 })], { after: 60, spacing: { before: 120 } }));
}

/* ── MAIN EXPORT ── */

export async function exportToDocx(header, sections) {
  const children = [];

  // ═══ COVER PAGE ═══
  children.push(new Paragraph({ spacing: { before: 3000 }, children: [] }));
  children.push(new Paragraph({
    children: [new TextRun({ text: header.namaSekolah || 'Nama Sekolah', bold: true, size: 28, color: '1B4F72' })],
    alignment: AlignmentType.CENTER, spacing: { after: 60 },
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: 'Lampiran Modul Ajar \u2014 ' + (header.mataPelajaran || '\u2014'), size: 20, color: '5D6D7E' })],
    alignment: AlignmentType.CENTER, spacing: { after: 400 },
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: 'LAMPIRAN MODUL AJAR', bold: true, size: 32, color: '1B4F72' })],
    alignment: AlignmentType.CENTER, spacing: { after: 200 },
  }));
  children.push(new Paragraph({
    border: { bottom: { style: 'single', size: 6, color: '1B4F72' } },
    spacing: { after: 400 }, children: [],
  }));

  // Cover meta
  [['Mata Pelajaran', header.mataPelajaran], ['Kode Modul', header.kodeModul],
   ['Judul Modul', header.judulModul], ['Nomor TP', header.nomorTP],
   ['Fase / Kelas', header.faseKelas], ['Semester', header.semester]].forEach(([l, val]) => {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: l + '  :  ', bold: true, size: 20, color: '1B4F72' }),
        new TextRun({ text: v(val), size: 20 }),
      ],
      alignment: AlignmentType.CENTER, spacing: { after: 40 },
    }));
  });

  children.push(new Paragraph({ spacing: { before: 2000 }, children: [] }));
  children.push(new Paragraph({
    children: [new TextRun({ text: header.tahunPelajaran || '______', size: 20, color: '5D6D7E' })],
    alignment: AlignmentType.CENTER,
  }));
  if (header.namaGuru) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'Disusun oleh: ' + header.namaGuru, size: 18, color: '5D6D7E' })],
      alignment: AlignmentType.CENTER,
    }));
  }

  // ═══ DAFTAR LAMPIRAN ═══
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(new Paragraph({
    children: [new TextRun({ text: 'DAFTAR LAMPIRAN', bold: true, size: 24, color: '1B4F72' })],
    alignment: AlignmentType.CENTER, spacing: { after: 300 },
  }));

  const enabledKeys = Object.keys(sections).filter(k => sections[k]?.enabled);
  enabledKeys.forEach((key, i) => {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: 'Lampiran ' + (i + 1), bold: true, size: 20, color: '1B4F72' }),
        new TextRun({ text: '    ' + (LABELS[key] || key), size: 20 }),
      ],
      spacing: { after: 60 },
    }));
  });
  children.push(new Paragraph({ spacing: { after: 200 }, children: [] }));

  // ═══ SECTIONS ═══
  for (let si = 0; si < enabledKeys.length; si++) {
    const key = enabledKeys[si];
    const d = sections[key]?.data;
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({
      children: [new TextRun({ text: LABELS[key] || key, bold: true, size: 22, color: '1B4F72' })],
      alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 },
    }));

    switch (key) {
      case 'lkpd': _lkpd(children, header, d); break;
      case 'formatif': _formatif(children, header, d); break;
      case 'sumatif': _sumatif(children, header, d); break;
      case 'rubrik': _rubrik(children, header, d); break;
      case 'materi': _materi(children, header, d); break;
      case 'media': _media(children, header, d); break;
      case 'refleksi': _refleksi(children, header, d); break;
      case 'pengayaan': _listSection(children, 'Aktivitas Pengayaan', d?.pengayaanList); break;
      case 'remediasi': _listSection(children, 'Aktivitas Remediasi', d?.remediasiList); break;
    }
  }

  // ═══ DOCUMENT ═══
  const doc = new Document({
    title: 'Lampiran Modul - ' + (header.judulModul || header.mataPelajaran || 'Untitled'),
    styles: {
      default: {
        document: {
          run: { size: 22, font: 'Times New Roman' },
          paragraph: { alignment: AlignmentType.JUSTIFIED, spacing: { line: 360 } },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: F4_W, height: F4_H },
          margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'Lampiran_' + (header.kodeModul || header.mataPelajaran || 'Modul') + '.docx');
}

/* ═══════════════════════════════════════
   SECTION RENDERERS
   ═══════════════════════════════════════ */

function _lkpd(children, h, d) {
  if (!d) return;
  sub(children, 'Identitas LKPD');
  children.push(tbl(['', ''], [
    ['Mata Pelajaran', h.mataPelajaran], ['Fase / Kelas', h.faseKelas],
    ['Judul Kegiatan', d.judulKegiatan], ['Alokasi Waktu', d.alokasiWaktu],
    ['Tujuan', d.tujuan],
  ], [30, 70]));
  const k = d.kegiatan || [];
  if (k.length > 0) {
    sub(children, 'Langkah Kegiatan');
    children.push(tbl(['#', 'Tanggal', 'Deskripsi', 'Stimulus'],
      k.map((r, i) => [i + 1, r.tanggal, r.deskripsi, r.stimulus]), [6, 15, 45, 34]));
  }
}

function _formatif(children, h, d) {
  if (!d) return;
  children.push(tbl(['', ''], [['Teknik Penilaian', d.teknik], ['Jenis Penilaian', (d.jenisPenilaian || []).join(', ')]], [30, 70]));
  const inst = d.instrumen || [];
  if (inst.length > 0) {
    sub(children, 'Instrumen Penilaian');
    children.push(tbl(['#', 'Aspek', 'Indikator', 'Skor'],
      inst.map((r, i) => [i + 1, r.aspek, r.indikator, r.skor]), [8, 25, 50, 17]));
  }
}

function _sumatif(children, h, d) {
  if (!d) return;
  children.push(tbl(['', ''], [['Bentuk Penilaian', d.bentuk]], [30, 70]));
  const inst = d.instrumen || [];
  if (inst.length > 0) {
    sub(children, 'Instrumen Penilaian Sumatif');
    children.push(tbl(['#', 'Soal / Indikator', 'Bobot'],
      inst.map((r, i) => [i + 1, r.uraian, r.bobot]), [8, 65, 27]));
  }
  children.push(tbl(['', ''], [['KKM / Kriteria', d.kkm || '\u2014']], [30, 70]));
}

function _rubrik(children, h, d) {
  if (!d) return;
  const krit = d.kriteria || [];
  if (krit.length > 0) {
    sub(children, 'Kriteria Penilaian');
    children.push(tbl(['#', 'Kriteria', 'Deskripsi / Skala'],
      krit.map((r, i) => [i + 1, r.kriteria, r.deskripsi]), [8, 35, 57]));
  }
}

function _materi(children, h, d) {
  if (!d) return;
  const list = d.materiList || [];
  if (list.length > 0) {
    sub(children, 'Materi Pembelajaran');
    list.forEach((m, i) => children.push(para([tr((i + 1) + '. ' + v(m), { size: 18 })], { indent: 400, after: 40 })));
  }
  if (d.sumber) { sub(children, 'Sumber Referensi'); children.push(para([tr(d.sumber, { size: 18 })])); }
}

function _media(children, h, d) {
  if (!d) return;
  const list = d.mediaList || [];
  if (list.length > 0) {
    sub(children, 'Daftar Media');
    children.push(tbl(['#', 'Jenis Media', 'Nama / Deskripsi'],
      list.map((r, i) => [i + 1, r.jenis, r.deskripsi]), [8, 25, 67]));
  }
  if (d.catatan) { sub(children, 'Catatan Penggunaan'); children.push(para([tr(d.catatan, { size: 18 })])); }
}

function _refleksi(children, h, d) {
  if (!d) return;
  const list = d.refleksiList || [];
  if (list.length > 0) {
    sub(children, 'Pertanyaan Refleksi');
    children.push(tbl(['#', 'Pertanyaan Refleksi', 'Target'],
      list.map((r, i) => [i + 1, r.pertanyaan, r.target]), [8, 65, 27]));
  }
}

function _listSection(children, title, list) {
  if (!list || list.length === 0) return;
  sub(children, title);
  list.forEach((item, i) => children.push(para([tr((i + 1) + '. ' + v(item), { size: 18 })], { indent: 400, after: 40 })));
}
