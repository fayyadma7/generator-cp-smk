'use client';

/**
 * All 9 section form components.
 * Each receives: data, onChange(sectionKey, partialData)
 */

import { useCallback } from 'react';

/* ═══════════════════════════════════════════════
   DEFAULT DATA
   ═══════════════════════════════════════════════ */

export const DEFAULT_DATA = {
  lkpd:       { judulKegiatan: '', alokasiWaktu: '', tujuan: '', kegiatan: [] },
  formatif:   { teknik: '', jenisPenilaian: [], instrumen: [] },
  sumatif:    { bentuk: '', instrumen: [], kkm: '' },
  rubrik:     { kriteria: [] },
  materi:     { materiList: [], sumber: '' },
  media:      { mediaList: [], catatan: '' },
  refleksi:   { refleksiList: [] },
  pengayaan:  { pengayaanList: [] },
  remediasi:  { remediasiList: [] },
};

export const SECTION_META = [
  { key: 'lkpd',       judul: 'LKPD',        sublabel: 'Lembar Kerja Peserta Didik',      est: '~15 menit' },
  { key: 'formatif',   judul: 'Formatif',    sublabel: 'Penilaian Formatif',               est: '~10 menit' },
  { key: 'sumatif',    judul: 'Sumatif',     sublabel: 'Penilaian Sumatif',                est: '~10 menit' },
  { key: 'rubrik',     judul: 'Rubrik',      sublabel: 'Rubrik Penilaian',                 est: '~8 menit' },
  { key: 'materi',     judul: 'Materi',      sublabel: 'Bahan Ajar / Materi',              est: '~10 menit' },
  { key: 'media',      judul: 'Media',       sublabel: 'Media Pembelajaran',               est: '~8 menit' },
  { key: 'refleksi',   judul: 'Refleksi',    sublabel: 'Refleksi Pembelajaran',            est: '~8 menit' },
  { key: 'pengayaan',  judul: 'Pengayaan',   sublabel: 'Aktivitas Pengayaan',              est: '~5 menit' },
  { key: 'remediasi',  judul: 'Remediasi',   sublabel: 'Aktivitas Remediasi',              est: '~5 menit' },
];

/* ═══════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════ */

const TEKNIK_OPTIONS = ['Observasi','Unjuk Kerja','Tes Tertulis','Tes Lisan','Penugasan','Portofolio','Proyek','Jurnal'];
const JENIS_OPTIONS = ['Sikap','Pengetahuan','Keterampilan','Diagnostik'];
const BENTUK_OPTIONS = ['Pilihan Ganda','Uraian','Essai','Proyek','Portofolio','Unjuk Kerja','Tes Lisan'];
const MEDIA_JENIS = ['Video','Audio','Gambar','PPT','Infografis','Alat Peraga','Simulasi','LMS','Lainnya'];
const TARGET_OPTIONS = ['Guru','Peserta Didik','Keduanya'];

/* ═══════════════════════════════════════════════
   SECTION: LKPD
   ═══════════════════════════════════════════════ */

export function SectionLKPD({ data, onChange }) {
  const d = data || DEFAULT_DATA.lkpd;
  const kegiatan = d.kegiatan || [];

  const updateField = (field, value) => { onChange('lkpd', { ...d, [field]: value }); };
  const updateKegiatan = (idx, field, value) => {
    const k = [...kegiatan];
    if (!k[idx]) k[idx] = { tanggal: '', deskripsi: '', stimulus: '' };
    k[idx] = { ...k[idx], [field]: value };
    updateField('kegiatan', k);
  };
  const addKegiatan = () => updateField('kegiatan', [...kegiatan, { tanggal: '', deskripsi: '', stimulus: '' }]);
  const delKegiatan = (idx) => { if (kegiatan.length > 1) updateField('kegiatan', kegiatan.filter((_, i) => i !== idx)); };

  return (
    <>
      <div className="form-group">
        <label className="form-label">Judul Kegiatan</label>
        <input className="form-input" value={d.judulKegiatan || ''} onChange={e => updateField('judulKegiatan', e.target.value)} placeholder="Misal: Observasi Lingkungan Sekitar" />
      </div>
      <div className="form-group">
        <label className="form-label">Alokasi Waktu</label>
        <input className="form-input" value={d.alokasiWaktu || ''} onChange={e => updateField('alokasiWaktu', e.target.value)} placeholder="Misal: 2 JP × 45 menit" />
      </div>
      <div className="form-group">
        <label className="form-label">Tujuan Kegiatan</label>
        <textarea className="form-textarea" value={d.tujuan || ''} onChange={e => updateField('tujuan', e.target.value)} placeholder="Tujuan dari kegiatan LKPD ini..." />
      </div>
      <div className="form-group">
        <label className="form-label">Langkah Kegiatan</label>
        <div className="dynamic-table-wrap">
          <table className="dynamic-table">
            <thead><tr><th style={{width:90}}>Tanggal</th><th>Deskripsi</th><th style={{width:40}}></th></tr></thead>
            <tbody>
              {kegiatan.map((k, i) => (
                <tr key={i}>
                  <td><input className="dt-input" value={k.tanggal || ''} onChange={e => updateKegiatan(i, 'tanggal', e.target.value)} placeholder="Hr/tgl" /></td>
                  <td>
                    <input className="dt-input" value={k.deskripsi || ''} onChange={e => updateKegiatan(i, 'deskripsi', e.target.value)} placeholder="Deskripsi langkah" style={{marginBottom:2}} />
                    <input className="dt-input" value={k.stimulus || ''} onChange={e => updateKegiatan(i, 'stimulus', e.target.value)} placeholder="Stimulus (opsional)" />
                  </td>
                  <td><button className="btn-dt-del" onClick={() => delKegiatan(i)} disabled={kegiatan.length <= 1}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-dt-add" onClick={addKegiatan}>+ Tambah Baris</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SECTION: FORMATIF
   ═══════════════════════════════════════════════ */

export function SectionFormatif({ data, onChange }) {
  const d = data || DEFAULT_DATA.formatif;
  const instrumen = d.instrumen || [];
  const jenis = d.jenisPenilaian || [];

  const updateField = (field, value) => onChange('formatif', { ...d, [field]: value });
  const toggleJenis = (val) => {
    const next = jenis.includes(val) ? jenis.filter(j => j !== val) : [...jenis, val];
    updateField('jenisPenilaian', next);
  };
  const updateInst = (idx, field, value) => {
    const k = [...instrumen];
    if (!k[idx]) k[idx] = { aspek: '', indikator: '', skor: '' };
    k[idx] = { ...k[idx], [field]: value };
    updateField('instrumen', k);
  };
  const addInst = () => updateField('instrumen', [...instrumen, { aspek: '', indikator: '', skor: '' }]);
  const delInst = (idx) => { if (instrumen.length > 1) updateField('instrumen', instrumen.filter((_, i) => i !== idx)); };

  return (
    <>
      <div className="form-group">
        <label className="form-label">Teknik Penilaian</label>
        <select className="form-select" value={d.teknik || ''} onChange={e => updateField('teknik', e.target.value)}>
          <option value="">— Pilih Teknik —</option>
          {TEKNIK_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Jenis Penilaian</label>
        <div className="checkbox-group">
          {JENIS_OPTIONS.map(j => (
            <label key={j} className={`checkbox-item ${jenis.includes(j) ? 'checked' : ''}`} onClick={() => toggleJenis(j)}>
              <input type="checkbox" checked={jenis.includes(j)} readOnly /> {j}
            </label>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Instrumen Penilaian</label>
        <div className="dynamic-table-wrap">
          <table className="dynamic-table">
            <thead><tr><th>Aspek</th><th>Indikator</th><th style={{width:60}}>Skor</th><th style={{width:40}}></th></tr></thead>
            <tbody>
              {instrumen.map((r, i) => (
                <tr key={i}>
                  <td><input className="dt-input" value={r.aspek || ''} onChange={e => updateInst(i, 'aspek', e.target.value)} placeholder="Aspek" /></td>
                  <td><input className="dt-input" value={r.indikator || ''} onChange={e => updateInst(i, 'indikator', e.target.value)} placeholder="Indikator" /></td>
                  <td><input className="dt-input" value={r.skor || ''} onChange={e => updateInst(i, 'skor', e.target.value)} placeholder="Skor" /></td>
                  <td><button className="btn-dt-del" onClick={() => delInst(i)} disabled={instrumen.length <= 1}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-dt-add" onClick={addInst}>+ Tambah Baris</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SECTION: SUMATIF
   ═══════════════════════════════════════════════ */

export function SectionSumatif({ data, onChange }) {
  const d = data || DEFAULT_DATA.sumatif;
  const instrumen = d.instrumen || [];

  const updateField = (field, value) => onChange('sumatif', { ...d, [field]: value });
  const updateInst = (idx, field, value) => {
    const k = [...instrumen];
    if (!k[idx]) k[idx] = { uraian: '', bobot: '' };
    k[idx] = { ...k[idx], [field]: value };
    updateField('instrumen', k);
  };
  const addInst = () => updateField('instrumen', [...instrumen, { uraian: '', bobot: '' }]);
  const delInst = (idx) => { if (instrumen.length > 1) updateField('instrumen', instrumen.filter((_, i) => i !== idx)); };

  return (
    <>
      <div className="form-group">
        <label className="form-label">Bentuk Penilaian Sumatif</label>
        <select className="form-select" value={d.bentuk || ''} onChange={e => updateField('bentuk', e.target.value)}>
          <option value="">— Pilih Bentuk —</option>
          {BENTUK_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Instrumen / Soal</label>
        <div className="dynamic-table-wrap">
          <table className="dynamic-table">
            <thead><tr><th>Uraian / Soal</th><th style={{width:60}}>Bobot</th><th style={{width:40}}></th></tr></thead>
            <tbody>
              {instrumen.map((r, i) => (
                <tr key={i}>
                  <td><input className="dt-input" value={r.uraian || ''} onChange={e => updateInst(i, 'uraian', e.target.value)} placeholder="Uraian soal / indikator" /></td>
                  <td><input className="dt-input" value={r.bobot || ''} onChange={e => updateInst(i, 'bobot', e.target.value)} placeholder="Bobot" /></td>
                  <td><button className="btn-dt-del" onClick={() => delInst(i)} disabled={instrumen.length <= 1}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-dt-add" onClick={addInst}>+ Tambah Baris</button>
      </div>
      <div className="form-group">
        <label className="form-label">KKM / Kriteria Ketuntasan</label>
        <input className="form-input" value={d.kkm || ''} onChange={e => updateField('kkm', e.target.value)} placeholder="Misal: ≥70" />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SECTION: RUBRIK
   ═══════════════════════════════════════════════ */

export function SectionRubrik({ data, onChange }) {
  const d = data || DEFAULT_DATA.rubrik;
  const kriteria = d.kriteria || [];

  const updateField = (field, value) => onChange('rubrik', { ...d, [field]: value });
  const updateKrit = (idx, field, value) => {
    const k = [...kriteria];
    if (!k[idx]) k[idx] = { kriteria: '', deskripsi: '' };
    k[idx] = { ...k[idx], [field]: value };
    updateField('kriteria', k);
  };
  const addKrit = () => updateField('kriteria', [...kriteria, { kriteria: '', deskripsi: '' }]);
  const delKrit = (idx) => { if (kriteria.length > 1) updateField('kriteria', kriteria.filter((_, i) => i !== idx)); };

  return (
    <div className="form-group">
      <label className="form-label">Kriteria Rubrik</label>
      <div className="dynamic-table-wrap">
        <table className="dynamic-table">
          <thead><tr><th>Kriteria</th><th>Deskripsi / Skala</th><th style={{width:40}}></th></tr></thead>
          <tbody>
            {kriteria.map((r, i) => (
              <tr key={i}>
                <td><input className="dt-input" value={r.kriteria || ''} onChange={e => updateKrit(i, 'kriteria', e.target.value)} placeholder="Nama kriteria" /></td>
                <td><input className="dt-input" value={r.deskripsi || ''} onChange={e => updateKrit(i, 'deskripsi', e.target.value)} placeholder="Deskripsi / skala" /></td>
                <td><button className="btn-dt-del" onClick={() => delKrit(i)} disabled={kriteria.length <= 1}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-dt-add" onClick={addKrit}>+ Tambah Kriteria</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION: MATERI
   ═══════════════════════════════════════════════ */

export function SectionMateri({ data, onChange }) {
  const d = data || DEFAULT_DATA.materi;
  const list = d.materiList || [];

  const updateField = (field, value) => onChange('materi', { ...d, [field]: value });
  const updateItem = (idx, value) => {
    const k = [...list];
    k[idx] = value;
    updateField('materiList', k);
  };
  const addItem = () => updateField('materiList', [...list, '']);
  const delItem = (idx) => { if (list.length > 1) updateField('materiList', list.filter((_, i) => i !== idx)); };

  return (
    <>
      <div className="form-group">
        <label className="form-label">Daftar Materi / Pokok Bahasan</label>
        <div className="dynamic-list">
          {list.map((m, i) => (
            <div key={i} className="dynamic-list-item">
              <input className="form-input" value={m} onChange={e => updateItem(i, e.target.value)} placeholder="Nama materi / topik" />
              <button className="btn-list-del" onClick={() => delItem(i)} disabled={list.length <= 1}>✕</button>
            </div>
          ))}
        </div>
        <button className="btn-dt-add" onClick={addItem} style={{marginTop:8}}>+ Tambah Materi</button>
      </div>
      <div className="form-group">
        <label className="form-label">Sumber Referensi</label>
        <textarea className="form-textarea" value={d.sumber || ''} onChange={e => updateField('sumber', e.target.value)} placeholder="Buku, jurnal, link referensi..." />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SECTION: MEDIA
   ═══════════════════════════════════════════════ */

export function SectionMedia({ data, onChange }) {
  const d = data || DEFAULT_DATA.media;
  const list = d.mediaList || [];

  const updateField = (field, value) => onChange('media', { ...d, [field]: value });
  const updateItem = (idx, field, value) => {
    const k = [...list];
    if (!k[idx]) k[idx] = { jenis: '', deskripsi: '' };
    k[idx] = { ...k[idx], [field]: value };
    updateField('mediaList', k);
  };
  const addItem = () => updateField('mediaList', [...list, { jenis: '', deskripsi: '' }]);
  const delItem = (idx) => { if (list.length > 1) updateField('mediaList', list.filter((_, i) => i !== idx)); };

  return (
    <>
      <div className="form-group">
        <label className="form-label">Daftar Media</label>
        <div className="dynamic-table-wrap">
          <table className="dynamic-table">
            <thead><tr><th style={{width:110}}>Jenis Media</th><th>Nama / Deskripsi</th><th style={{width:40}}></th></tr></thead>
            <tbody>
              {list.map((r, i) => (
                <tr key={i}>
                  <td>
                    <select className="dt-select" value={r.jenis || ''} onChange={e => updateItem(i, 'jenis', e.target.value)}>
                      <option value="">— Pilih —</option>
                      {MEDIA_JENIS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td><input className="dt-input" value={r.deskripsi || ''} onChange={e => updateItem(i, 'deskripsi', e.target.value)} placeholder="Nama / URL / keterangan" /></td>
                  <td><button className="btn-dt-del" onClick={() => delItem(i)} disabled={list.length <= 1}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-dt-add" onClick={addItem}>+ Tambah Media</button>
      </div>
      <div className="form-group">
        <label className="form-label">Catatan Penggunaan</label>
        <textarea className="form-textarea" value={d.catatan || ''} onChange={e => updateField('catatan', e.target.value)} placeholder="Catatan tambahan..." />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SECTION: REFLEKSI
   ═══════════════════════════════════════════════ */

export function SectionRefleksi({ data, onChange }) {
  const d = data || DEFAULT_DATA.refleksi;
  const list = d.refleksiList || [];

  const updateField = (field, value) => onChange('refleksi', { ...d, [field]: value });
  const updateItem = (idx, field, value) => {
    const k = [...list];
    if (!k[idx]) k[idx] = { pertanyaan: '', target: '' };
    k[idx] = { ...k[idx], [field]: value };
    updateField('refleksiList', k);
  };
  const addItem = () => updateField('refleksiList', [...list, { pertanyaan: '', target: '' }]);
  const delItem = (idx) => { if (list.length > 1) updateField('refleksiList', list.filter((_, i) => i !== idx)); };

  return (
    <div className="form-group">
      <label className="form-label">Pertanyaan Refleksi</label>
      <div className="dynamic-table-wrap">
        <table className="dynamic-table">
          <thead><tr><th>Pertanyaan</th><th style={{width:110}}>Target</th><th style={{width:40}}></th></tr></thead>
          <tbody>
            {list.map((r, i) => (
              <tr key={i}>
                <td><input className="dt-input" value={r.pertanyaan || ''} onChange={e => updateItem(i, 'pertanyaan', e.target.value)} placeholder="Pertanyaan refleksi..." /></td>
                <td>
                  <select className="dt-select" value={r.target || ''} onChange={e => updateItem(i, 'target', e.target.value)}>
                    <option value="">— Pilih —</option>
                    {TARGET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </td>
                <td><button className="btn-dt-del" onClick={() => delItem(i)} disabled={list.length <= 1}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-dt-add" onClick={addItem}>+ Tambah Pertanyaan</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION: PENGAYAAN
   ═══════════════════════════════════════════════ */

export function SectionPengayaan({ data, onChange }) {
  const d = data || DEFAULT_DATA.pengayaan;
  const list = d.pengayaanList || [];

  const updateField = (field, value) => onChange('pengayaan', { ...d, [field]: value });
  const updateItem = (idx, value) => {
    const k = [...list]; k[idx] = value; updateField('pengayaanList', k);
  };
  const addItem = () => updateField('pengayaanList', [...list, '']);
  const delItem = (idx) => { if (list.length > 1) updateField('pengayaanList', list.filter((_, i) => i !== idx)); };

  return (
    <>
      <div className="form-group">
        <label className="form-label">Aktivitas Pengayaan</label>
        <div className="dynamic-list">
          {list.map((m, i) => (
            <div key={i} className="dynamic-list-item">
              <input className="form-input" value={m} onChange={e => updateItem(i, e.target.value)} placeholder="Deskripsi aktivitas pengayaan" />
              <button className="btn-list-del" onClick={() => delItem(i)} disabled={list.length <= 1}>✕</button>
            </div>
          ))}
        </div>
        <button className="btn-dt-add" onClick={addItem} style={{marginTop:8}}>+ Tambah Aktivitas</button>
      </div>
      <p className="form-hint">Pengayaan diberikan kepada peserta didik yang telah mencapai ketuntasan.</p>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SECTION: REMEDIASI
   ═══════════════════════════════════════════════ */

export function SectionRemediasi({ data, onChange }) {
  const d = data || DEFAULT_DATA.remediasi;
  const list = d.remediasiList || [];

  const updateField = (field, value) => onChange('remediasi', { ...d, [field]: value });
  const updateItem = (idx, value) => {
    const k = [...list]; k[idx] = value; updateField('remediasiList', k);
  };
  const addItem = () => updateField('remediasiList', [...list, '']);
  const delItem = (idx) => { if (list.length > 1) updateField('remediasiList', list.filter((_, i) => i !== idx)); };

  return (
    <>
      <div className="form-group">
        <label className="form-label">Aktivitas Remediasi</label>
        <div className="dynamic-list">
          {list.map((m, i) => (
            <div key={i} className="dynamic-list-item">
              <input className="form-input" value={m} onChange={e => updateItem(i, e.target.value)} placeholder="Deskripsi aktivitas remediasi" />
              <button className="btn-list-del" onClick={() => delItem(i)} disabled={list.length <= 1}>✕</button>
            </div>
          ))}
        </div>
        <button className="btn-dt-add" onClick={addItem} style={{marginTop:8}}>+ Tambah Aktivitas</button>
      </div>
      <p className="form-hint">Remediasi diberikan kepada peserta didik yang belum mencapai ketuntasan.</p>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SECTION RENDERER MAP
   ═══════════════════════════════════════════════ */

export const SECTION_COMPONENTS = {
  lkpd: SectionLKPD,
  formatif: SectionFormatif,
  sumatif: SectionSumatif,
  rubrik: SectionRubrik,
  materi: SectionMateri,
  media: SectionMedia,
  refleksi: SectionRefleksi,
  pengayaan: SectionPengayaan,
  remediasi: SectionRemediasi,
};
