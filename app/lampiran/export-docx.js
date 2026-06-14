'use client';
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, PageBreak, VerticalAlign, BorderStyle, ShadingType
} from 'docx';
import { saveAs } from 'file-saver';

// Konstanta Layout
const FULL_W = 100;
const FONT = 'Arial';
const MAIN_SIZE = 22; // 11pt

// Helper dasar
const t = (text, opts = {}) => new TextRun({ text: text || '—', size: MAIN_SIZE, font: FONT, ...opts });
const p = (children, opts = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [children],
  spacing: { after: 100 },
  ...opts
});
const pTitle = (text) => p(t(text, { bold: true, size: 28 }), { alignment: AlignmentType.CENTER, spacing: { after: 200 } });
const pSub = (text) => p(t(text, { bold: true, size: 24 }), { spacing: { before: 200, after: 100 } });

// Helper Table
const tc = (children, wPercent, bg = null, isHeader = false) => {
  return new TableCell({
    children: Array.isArray(children) ? children : [p(children, { alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT })],
    width: { size: wPercent, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined,
    margins: { top: 100, bottom: 100, left: 100, right: 100 }
  });
};

const createTable = (rows) => new Table({
  rows,
  width: { size: FULL_W, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
    left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
    right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  }
});

// Helper Header Identitas
const buildHeaderIdentitas = (id) => {
  if (!id) return [];
  return [
    createTable([
      new TableRow({ children: [tc(t('Mata Pelajaran', { bold: true }), 25), tc(t(id.mataPelajaran), 75)] }),
      new TableRow({ children: [tc(t('Fase / Kelas', { bold: true }), 25), tc(t(id.kelas || id.faseKelas), 75)] }),
      new TableRow({ children: [tc(t('Tujuan Pemb.', { bold: true }), 25), tc(t(id.tp), 75)] }),
    ]),
    p('', { spacing: { after: 200 } })
  ];
};

export async function exportToDocx(data) {
  const sections = [];

  // ==========================================
  // COVER & DAFTAR LAMPIRAN
  // ==========================================
  const header = data.headerDanDaftar?.dokumenHeader;
  const daftar = data.headerDanDaftar?.daftarLampiran;
  if (header) {
    sections.push({
      children: [
        p(t(header.sekolah, { size: 32, bold: true }), { alignment: AlignmentType.CENTER, spacing: { after: 50 } }),
        p(t(header.tagline, { italics: true }), { alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
        p(t(header.judulDokumen, { size: 40, bold: true }), { alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
        p(t(header.judulModul, { size: 28, bold: true }), { alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
        createTable([
          new TableRow({ children: [tc(t('Kode Modul', { bold: true }), 30, 'E2E8F0'), tc(t(header.kodeModul), 70)] }),
          new TableRow({ children: [tc(t('Fase / Kelas', { bold: true }), 30, 'E2E8F0'), tc(t(header.faseKelas), 70)] }),
          new TableRow({ children: [tc(t('Semester', { bold: true }), 30, 'E2E8F0'), tc(t(header.semester), 70)] }),
          new TableRow({ children: [tc(t('Kurikulum', { bold: true }), 30, 'E2E8F0'), tc(t(header.kurikulum), 70)] }),
        ]),
        p('', { spacing: { after: 400 } }),
        pSub('Daftar Lampiran:'),
        ...(daftar || []).map(item => p(t(`${item.no}. ${item.namaLampiran} - ${item.keterangan}`))),
        new Paragraph({ children: [new PageBreak()] })
      ]
    });
  }

  // ==========================================
  // LKPD 1
  // ==========================================
  const lkpd1 = data.lkpd01a;
  if (lkpd1) {
    const lkpdRows = [
      new TableRow({ children: lkpd1.tabelAnalisis?.map(c => tc(t(c.judulKolom, { bold: true }), 100/lkpd1.tabelAnalisis.length, 'E2E8F0', true)) || [] })
    ];
    for(let i=0; i<4; i++){
      lkpdRows.push(new TableRow({ children: lkpd1.tabelAnalisis?.map(c => tc(t(c.pertanyaan, { italics: true, color: '666666', size: 18 }), 100/lkpd1.tabelAnalisis.length)) || [] }));
    }

    sections.push({
      children: [
        pTitle(lkpd1.judulLampiran + ' - ' + lkpd1.subjudul),
        ...buildHeaderIdentitas(lkpd1.identitas),
        pSub('Tabel Analisis:'),
        createTable(lkpdRows),
        new Paragraph({ children: [new PageBreak()] })
      ]
    });
  }

  // ==========================================
  // ASESMEN FORMATIF
  // ==========================================
  const form = data.asesmenFormatif;
  if (form) {
    const lisanRows = [
      new TableRow({ children: [tc(t('No', { bold:true }), 10, 'E2E8F0', true), tc(t('Pertanyaan Lisan', { bold:true }), 45, 'E2E8F0', true), tc(t('Kunci Jawaban', { bold:true }), 45, 'E2E8F0', true)] })
    ];
    form.bagianA?.pertanyaan?.forEach(q => {
      lisanRows.push(new TableRow({ children: [tc(t(q.no), 10), tc(t(q.pertanyaan), 45), tc(t(q.kunciJawaban), 45)] }));
    });

    const kuisChildren = [];
    form.bagianB?.soal?.forEach(s => {
      kuisChildren.push(p(t(`${s.no}. ${s.pertanyaan}`, { bold: true })));
      s.opsi?.forEach(o => kuisChildren.push(p(t(`   ${o.huruf}. ${o.teks}`))));
      kuisChildren.push(p(t(`   (Kunci: ${s.kunci})`, { italics: true, color: '38A169' })));
    });

    sections.push({
      children: [
        pTitle(form.judulLampiran),
        ...buildHeaderIdentitas(form.identitas),
        pSub(form.bagianA?.judul || 'A. LISAN'),
        createTable(lisanRows),
        p('', { spacing: { after: 300 } }),
        pSub(form.bagianB?.judul || 'B. KUIS TULIS'),
        ...kuisChildren,
        new Paragraph({ children: [new PageBreak()] })
      ]
    });
  }

  // ==========================================
  // ASESMEN SUMATIF
  // ==========================================
  const sum = data.asesmenSumatif;
  if (sum) {
    const h = sum.rubrik?.kolomHeader || ['Aspek','1','2','3','4'];
    const rRows = [
      new TableRow({ children: h.map(x => tc(t(x, { bold:true }), 100/5, 'E2E8F0', true)) })
    ];
    sum.rubrik?.aspek?.forEach(a => {
      rRows.push(new TableRow({ children: [
        tc(t(a.namaAspek, { bold: true }), 20), tc(t(a.perluBimbingan), 20), tc(t(a.cukup), 20), tc(t(a.baik), 20), tc(t(a.sangatBaik), 20)
      ]}));
    });

    sections.push({
      children: [
        pTitle(sum.judulLampiran),
        ...buildHeaderIdentitas(sum.identitas),
        pSub('Rubrik Penilaian:'),
        createTable(rRows),
        new Paragraph({ children: [new PageBreak()] })
      ]
    });
  }

  // ==========================================
  // REKAP KELAS
  // ==========================================
  const rkp = data.rekapKelas;
  if (rkp) {
    const asp = rkp.tabelRekap?.aspek || [];
    const tRows = [
      new TableRow({ children: [
        tc(t('No', { bold:true }), 5, 'E2E8F0', true),
        tc(t('Nama Siswa', { bold:true }), 25, 'E2E8F0', true),
        ...asp.map(a => tc(t(a.label, { bold:true }), 50/asp.length, 'E2E8F0', true)),
        tc(t('Nilai Akhir', { bold:true }), 20, 'E2E8F0', true)
      ]})
    ];
    for(let i=1; i<=10; i++){
      tRows.push(new TableRow({ children: [
        tc(t(i), 5), tc(t(''), 25), ...asp.map(() => tc(t(''), 50/asp.length)), tc(t(''), 20)
      ]}));
    }

    sections.push({
      children: [
        pTitle(rkp.judulLampiran),
        ...buildHeaderIdentitas(rkp.identitas),
        createTable(tRows),
        new Paragraph({ children: [new PageBreak()] })
      ]
    });
  }

  // ==========================================
  // MEDIA PEMBELAJARAN
  // ==========================================
  const med = data.mediaPembelajaran;
  if (med) {
    const mRows = [
      new TableRow({ children: [tc(t('Slide', { bold:true }), 10, 'E2E8F0', true), tc(t('Judul', { bold:true }), 30, 'E2E8F0', true), tc(t('Konten', { bold:true }), 60, 'E2E8F0', true)] })
    ];
    med.bagianA?.slide?.forEach(s => {
      mRows.push(new TableRow({ children: [tc(t(s.no), 10), tc(t(s.judulSlide, { bold: true }), 30), tc(t(s.kontenUtama), 60)] }));
    });

    sections.push({
      children: [
        pTitle(med.judulLampiran),
        ...buildHeaderIdentitas(med.identitas),
        pSub('Rincian Slide:'),
        createTable(mRows),
        new Paragraph({ children: [new PageBreak()] })
      ]
    });
  }

  // ==========================================
  // PENGAYAAN & REMEDIASI
  // ==========================================
  const py = data.bahanPengayaan;
  const rm = data.bahanRemediasi;
  if (py || rm) {
    const elems = [];
    if (py) {
      elems.push(pTitle(py.judulLampiran));
      elems.push(p(t(py.deskripsiUmum)));
      elems.push(pSub('Tugas Pengayaan:'));
      elems.push(p(t(py.tugasPengayaan?.instruksi)));
    }
    if (rm) {
      elems.push(pTitle(rm.judulLampiran));
      elems.push(p(t(rm.pesanMotivasi)));
      elems.push(pSub('Latihan Remediasi:'));
      rm.latihanSoal?.bagianB?.pertanyaan?.forEach(q => {
        elems.push(p(t(`${q.no}. ${q.pertanyaan}`)));
      });
    }
    sections.push({ children: elems });
  }

  // === COMPILE DOCUMENT ===
  const doc = new Document({
    creator: "Antigravity Lampiran Generator",
    title: "Lampiran Modul Ajar",
    styles: {
      default: {
        document: {
          run: { size: MAIN_SIZE, font: FONT },
          paragraph: { spacing: { after: 100 } },
        }
      }
    },
    sections
  });

  const blob = await Packer.toBlob(doc);
  const safeName = (data.headerDanDaftar?.dokumenHeader?.kodeModul || "Modul").replace(/[^a-z0-9]/gi, '_');
  saveAs(blob, `Lampiran_${safeName}.docx`);
}
