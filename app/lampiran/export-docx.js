import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, PageBreak, VerticalAlign, ShadingType, BorderStyle
} from 'docx';
import { saveAs } from 'file-saver';

// F4 Page Size
const F4_W = 12240; // 8.5 inches in twips
const F4_H = 18720; // 13 inches in twips
const MARGIN = 1134; // 2 cm

// Helper: Teks
const v = (val) => (val !== undefined && val !== null && val !== '') ? String(val) : '—';
const tr = (text, opts = {}) => new TextRun({ text: v(text), size: opts.size || 22, font: "Arial", ...opts });
const para = (children, opts = {}) => {
  if (typeof children === 'string') children = [tr(children)];
  return new Paragraph({ children, spacing: { after: opts.after ?? 100 }, ...opts });
};

// Helper: Tabel
const headCell = (text, widthPct) => new TableCell({
  children: [para([tr(text, { bold: true, size: 20 })], { alignment: AlignmentType.CENTER, after: 0 })],
  shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
  verticalAlign: VerticalAlign.CENTER,
  margins: { top: 100, bottom: 100, left: 100, right: 100 },
  width: widthPct ? { size: widthPct, type: WidthType.PERCENTAGE } : undefined,
});
const dataCell = (text, widthPct, opts = {}) => new TableCell({
  children: [para([tr(text, { size: 20, ...opts.textOpts })], { after: 0 })],
  verticalAlign: VerticalAlign.CENTER,
  margins: { top: 100, bottom: 100, left: 100, right: 100 },
  width: widthPct ? { size: widthPct, type: WidthType.PERCENTAGE } : undefined,
});
const makeTbl = (headers, rows) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({ children: headers.map((h, i) => headCell(h.text, h.w)) }),
    ...rows.map(r => new TableRow({ children: r.map((c, i) => dataCell(c, headers[i]?.w)) }))
  ],
});

export const exportToDocx = async (result, formInput) => {
  const sections = [];

  // ==========================================
  // HELPER: Tambah Judul Lampiran
  // ==========================================
  const addHeader = (judul, subjudul, identitas, addPageBreak = true) => {
    if (addPageBreak && sections.length > 0) sections.push(new Paragraph({ children: [new PageBreak()] }));
    sections.push(
      para([tr(judul, { bold: true, size: 28 })], { alignment: AlignmentType.CENTER, after: 50 }),
      para([tr(subjudul, { size: 22, italics: true })], { alignment: AlignmentType.CENTER, after: 300 })
    );
    if (identitas) {
      sections.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
          rows: [
            new TableRow({ children: [ dataCell("Mata Pelajaran", 25), dataCell(": " + v(identitas.mataPelajaran), 75) ] }),
            new TableRow({ children: [ dataCell("Kelas / Fase", 25), dataCell(": " + v(identitas.kelas), 75) ] }),
            new TableRow({ children: [ dataCell("Sekolah", 25), dataCell(": " + v(identitas.sekolah), 75) ] }),
          ]
        })
      );
      sections.push(para("", { after: 200 }));
    }
  };

  // ==========================================
  // 1. LKPD 1
  // ==========================================
  if (result.lkpd01a) {
    const d = result.lkpd01a;
    addHeader(d.judulLampiran, d.subjudul, d.identitas, false);
    
    sections.push(para("A. Petunjuk Pengerjaan", { bold: true }));
    (d.petunjuk || []).forEach((p, i) => sections.push(para(`${i+1}. ${p}`)));
    
    sections.push(para("B. Tabel Analisis", { bold: true, after: 100 }));
    const tblHeaders = [ { text: "KODE", w: 10 }, { text: "ASPEK ANALISIS", w: 35 }, { text: "JAWABAN / PENJELASAN", w: 55 } ];
    const tblRows = (d.tabelAnalisis || []).map(a => [a.kode, a.judulKolom + "\n" + (a.pertanyaan || ""), ""]);
    sections.push(makeTbl(tblHeaders, tblRows));
  }

  // ==========================================
  // 2. LKPD 2
  // ==========================================
  if (result.lkpd01b) {
    const d = result.lkpd01b;
    addHeader(d.judulLampiran, d.subjudul, d.identitas);
    
    if (d.bagianC) {
      sections.push(para(d.bagianC.judul || "Analisis Keterkaitan", { bold: true, after: 100 }));
      const tblHeaders = [ { text: "No", w: 10 }, { text: "Pasangan Keterkaitan", w: 40 }, { text: "Penjelasan Ilmiah", w: 50 } ];
      const tblRows = Array(d.bagianC.jumlahPasangan || 3).fill(0).map((_, i) => [String(i+1), "", ""]);
      sections.push(makeTbl(tblHeaders, tblRows));
    }
  }

  // ==========================================
  // 3. Asesmen Formatif
  // ==========================================
  if (result.asesmenFormatif) {
    const d = result.asesmenFormatif;
    addHeader(d.judulLampiran, d.subjudul, d.identitas);
    
    if (d.bagianA) {
      sections.push(para(d.bagianA.judul, { bold: true }));
      const tblHeaders = [ { text: "No", w: 10 }, { text: "Pertanyaan Lisan", w: 45 }, { text: "Kunci Jawaban", w: 45 } ];
      const tblRows = (d.bagianA.pertanyaan || []).map((p, i) => [String(p.no || i+1), p.pertanyaan, p.kunciJawaban]);
      sections.push(makeTbl(tblHeaders, tblRows));
      sections.push(para("", { after: 300 }));
    }

    if (d.bagianB) {
      sections.push(para(d.bagianB.judul, { bold: true }));
      (d.bagianB.soal || []).forEach((s, i) => {
        sections.push(para(`${s.no || i+1}. ${s.pertanyaan}`));
        (s.opsi || []).forEach(o => {
          sections.push(para(`    ${o.huruf}. ${o.teks}`));
        });
        sections.push(para(`    Kunci: ${s.kunci}`, { after: 200 }));
      });
    }
  }

  // ==========================================
  // 4. Asesmen Sumatif (Rubrik)
  // ==========================================
  if (result.asesmenSumatif) {
    const d = result.asesmenSumatif;
    addHeader(d.judulLampiran, d.subjudul, d.identitas);
    
    if (d.rubrik) {
      const headers = (d.rubrik.kolomHeader || []).map(h => ({ text: h, w: 20 }));
      const rows = (d.rubrik.aspek || []).map(a => [
        a.namaAspek + "\n(Bobot: " + (a.bobot || "") + ")",
        a.perluBimbingan, a.cukup, a.baik, a.sangatBaik
      ]);
      sections.push(makeTbl(headers, rows));
    }
  }

  // ==========================================
  // 5. Rekap Kelas
  // ==========================================
  if (result.rekapKelas) {
    const d = result.rekapKelas;
    addHeader(d.judulLampiran, d.subjudul, d.identitas);
    
    if (d.tabelRekap) {
      const aspek = d.tabelRekap.aspek || [];
      const headers = [ { text: "No", w: 5 }, { text: "Nama Siswa", w: 25 }, ...aspek.map(a => ({ text: a.label, w: 12 })), { text: "Total", w: 10 }, { text: "Nilai", w: 10 } ];
      const rows = Array(5).fill(0).map((_, i) => [String(i+1), "", ...aspek.map(()=>""), "", ""]);
      sections.push(makeTbl(headers, rows));
      sections.push(para("(Baris dipotong untuk contoh, cetak sesuai jumlah siswa: " + (d.tabelRekap.jumlahSiswa || 32) + ")", { italics: true, after: 200 }));
    }
    
    if (d.keterangan) {
      sections.push(para("Keterangan:", { bold: true }));
      d.keterangan.forEach(k => sections.push(para("- " + k)));
    }
  }

  // ==========================================
  // 6. Media Pembelajaran
  // ==========================================
  if (result.mediaPembelajaran) {
    const d = result.mediaPembelajaran;
    addHeader(d.judulLampiran, d.subjudul, d.identitas);
    
    if (d.bagianA) {
      sections.push(para(d.bagianA.judul, { bold: true }));
      const headers = [ { text: "Slide", w: 10 }, { text: "Judul Slide", w: 30 }, { text: "Konten Utama", w: 40 }, { text: "Catatan Guru", w: 20 } ];
      const rows = (d.bagianA.slide || []).map(s => [String(s.no || ""), s.judulSlide, s.kontenUtama, s.catatanGuru]);
      sections.push(makeTbl(headers, rows));
      sections.push(para("", { after: 300 }));
    }

    if (d.bagianB) {
      sections.push(para(d.bagianB.judul, { bold: true }));
      const headers = [ { text: "No", w: 10 }, { text: "Referensi / Sumber", w: 40 }, { text: "Penggunaan", w: 30 }, { text: "Durasi", w: 20 } ];
      const rows = (d.bagianB.referensi || []).map(r => [String(r.no || ""), r.judul, r.keterangan, r.durasi]);
      sections.push(makeTbl(headers, rows));
    }
  }

  // ==========================================
  // 7. Lembar Refleksi
  // ==========================================
  if (result.lembarRefleksi) {
    const d = result.lembarRefleksi;
    addHeader(d.judulLampiran, d.keterangan, d.identitas);
    
    (d.pertemuan || []).forEach(p => {
      sections.push(para(p.labelPertemuan || "Refleksi Pertemuan", { bold: true }));
      sections.push(para(`3 Hal yang dipelajari: ${p.tiga?.pertanyaan || ""}`));
      sections.push(para("1. \n2. \n3. \n", { after: 200 }));
      sections.push(para(`2 Hal yang ingin ditanyakan: ${p.dua?.pertanyaan || ""}`));
      sections.push(para("1. \n2. \n", { after: 200 }));
      sections.push(para(`1 Hal rencana aksi: ${p.satu?.pertanyaan || ""}`));
      sections.push(para("1. \n", { after: 400 }));
    });
  }

  // ==========================================
  // 8. Pengayaan & 9. Remediasi
  // ==========================================
  [result.bahanPengayaan, result.bahanRemediasi].forEach(d => {
    if (d) {
      addHeader(d.judulLampiran, d.subjudul, d.identitas);
      sections.push(para(`Target Siswa: ${d.targetPesertaDidik || ""}`, { bold: true, after: 200 }));
      
      if (d.bagianMateriBacaan) {
        d.bagianMateriBacaan.forEach(m => {
          sections.push(para(m.judul || "", { bold: true }));
          sections.push(para(m.narasiBacaan || "", { after: 200 }));
        });
      } else if (d.bagianMateri) {
        d.bagianMateri.forEach(m => {
          sections.push(para(m.judul || "", { bold: true }));
          sections.push(para(m.narasiPengantar || "", { after: 200 }));
        });
      }
      
      if (d.tugasPengayaan) {
        sections.push(para("Tugas Pengayaan:", { bold: true }));
        sections.push(para(d.tugasPengayaan.instruksi || ""));
      } else if (d.latihanSoal?.bagianA) {
        sections.push(para(d.latihanSoal.bagianA.judul || "Latihan Soal", { bold: true }));
        sections.push(para(d.latihanSoal.bagianA.instruksi || ""));
      }
    }
  });

  // ==========================================
  // BUNDLE & DOWNLOAD
  // ==========================================
  const doc = new Document({
    sections: [{
      properties: {
        page: { size: { width: F4_W, height: F4_H }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } }
      },
      children: sections,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const safeName = (formInput?.kodeModul || 'Modul').replace(/[^a-zA-Z0-9-]/g, '_');
  saveAs(blob, `Lampiran_${safeName}.docx`);
};
