import { useState, useCallback } from 'react';
import { Loader2, Sparkles, CheckCircle, XCircle, FileUp, ChevronDown, ChevronUp, Download, FileText } from 'lucide-react';
import { exportToDocx } from './export-docx';

// ── Daftar semua lampiran ──
const ALL_KEYS = [
  { key: 'headerDanDaftar',   label: '📋 Cover & Daftar Lampiran' },
  { key: 'lkpd01a',           label: '📝 LKPD Pertemuan 1' },
  { key: 'lkpd01b',           label: '📝 LKPD Pertemuan 2' },
  { key: 'asesmenFormatif',   label: '✏️ Asesmen Formatif' },
  { key: 'asesmenSumatif',    label: '📊 Asesmen Sumatif' },
  { key: 'rekapKelas',        label: '📈 Rekap Kelas' },
  { key: 'mediaPembelajaran', label: '🎞️ Media Pembelajaran' },
  { key: 'lembarRefleksi',    label: '💭 Lembar Refleksi' },
  { key: 'bahanPengayaan',    label: '🚀 Bahan Pengayaan' },
  { key: 'bahanRemediasi',    label: '🔁 Bahan Remediasi' },
];

const DEFAULT_FORM = {
  // Identitas
  namaSekolah: '', taglineSekolah: '', judulModul: '', kodeModul: '',
  faseKelas: '', semester: 'Ganjil', tahunPelajaran: '', mataPelajaran: '',
  kurikulum: 'Kurikulum Merdeka', nilaiSekolah: '', konteksLokal: '',
  // Tujuan
  tujuanPembelajaran: '', iktp: '', iktpRemediasi: '',
  // Skenario LKPD
  topikPertemuan1: '', metodePertemuan1: 'Gallery Walk',
  topikPertemuan2: '', metodePertemuan2: 'Diskusi',
  dimensiKeterkaitan: '', jumlahAspekAnalisis: 7, jumlahPasanganKeterkaitan: 3,
  // Asesmen
  jumlahPertanyaanLisan: 3, jumlahSoalKuis: 5,
  jenisProdukSumatif: '', aspekPenilaianSumatif: '', bobotAspek: '', kktp: 70,
  // Rekap
  jumlahSiswa: 32,
  // Media
  jumlahSlide: 15, jumlahReferensi: 5,
  // Refleksi
  teknikRefleksi: '3-2-1', kutipanPenutup: '',
  // Pengayaan
  nilaiAmbangPengayaan: 85, topikPengayaan: '', jenisTugasPengayaan: '', batasWaktuPengayaan: '1 minggu',
  // Remediasi
  gayaBelajarRemediasi: 'visual + tekstual',
  // Lampiran
  daftarLampiranYangDiminta: 'LKPD x2, Asesmen Formatif, Asesmen Sumatif, Rekap Kelas, Media Pembelajaran, Lembar Refleksi, Pengayaan, Remediasi',
};

export default function LampiranPage() {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [openSection, setOpenSection] = useState('identitas');
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const toggleSection = (key) => setOpenSection((prev) => (prev === key ? null : key));

  // ── Upload Modul (PDF/DOCX) ──
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPdfLoading(true);
    setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/parse-modul', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membaca modul');
      if (data.extracted) {
        setFormData((prev) => ({ ...prev, ...data.extracted }));
      }
      if (data.warning) setErrorMsg(`⚠️ ${data.warning}`);
    } catch (err) {
      setErrorMsg(`Gagal memproses modul: ${err.message}`);
    } finally {
      setIsPdfLoading(false);
      e.target.value = '';
    }
  };

  // ── Helper: fetch satu lampiran ──
  const generateItem = useCallback(async (key) => {
    try {
      const res = await fetch('/api/generate-lampiran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, keysToGenerate: [key] }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); }
      catch {
        if (text.includes('timeout') || text.includes('504')) throw new Error('Server timeout');
        throw new Error('Respons server tidak valid');
      }
      if (!res.ok) throw new Error(data.error || 'Gagal generate');
      setResult((prev) => ({ ...prev, [key]: data[key] }));
      return data[key];
    } catch (err) {
      setResult((prev) => ({ ...prev, [key]: { error: err.message } }));
      return { error: err.message };
    }
  }, [formData]);

  // ── Antrian dengan batas 3 bersamaan ──
  const processQueue = useCallback(async (keys) => {
    const CONCURRENCY = 3;
    const active = new Set();
    for (const key of keys) {
      if (active.size >= CONCURRENCY) await Promise.race(active);
      const p = generateItem(key).finally(() => active.delete(p));
      active.add(p);
    }
    await Promise.allSettled([...active]);
  }, [generateItem]);

  // ── Generate semua ──
  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const init = {};
    ALL_KEYS.forEach(({ key }) => (init[key] = null));
    setResult(init);
    setErrorMsg('');
    setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 300);
    try {
      await processQueue(ALL_KEYS.map((k) => k.key));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Retry yang gagal ──
  const handleRetry = async () => {
    if (!result) return;
    const failedKeys = ALL_KEYS.map((k) => k.key).filter((k) => !result[k] || result[k]?.error);
    if (!failedKeys.length) return;
    setIsLoading(true);
    setResult((prev) => {
      const next = { ...prev };
      failedKeys.forEach((k) => (next[k] = null));
      return next;
    });
    try {
      await processQueue(failedKeys);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Unduh JSON (download untuk diproses lebih lanjut) ──
  const handleDownloadJSON = () => {
    if (!result) return;
    const formattedData = {
      header: result.headerDanDaftar?.dokumenHeader || {},
      daftarLampiran: result.headerDanDaftar?.daftarLampiran || [],
      lampiran: {
        lkpd01a: result.lkpd01a || {},
        lkpd01b: result.lkpd01b || {},
        asesmenFormatif: result.asesmenFormatif || {},
        asesmenSumatif: result.asesmenSumatif || {},
        rekapKelas: result.rekapKelas || {},
        mediaPembelajaran: result.mediaPembelajaran || {},
        lembarRefleksi: result.lembarRefleksi || {},
        bahanPengayaan: result.bahanPengayaan || {},
        bahanRemediasi: result.bahanRemediasi || {},
      }
    };
    const blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lampiran-${formData.kodeModul || 'modul'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Unduh DOCX (Ukuran F4) ──
  const handleDownloadDocx = () => {
    if (!result) return;
    exportToDocx(result, formData);
  };

  // ── Derived ──
  const isDone = result && ALL_KEYS.every(({ key }) => result[key] !== null);
  const hasError = result && ALL_KEYS.some(({ key }) => result[key]?.error);
  const allSuccess = isDone && !hasError;

  const getStatus = (key) => {
    if (!result || result[key] === undefined) return 'idle';
    if (result[key] === null) return 'loading';
    if (result[key]?.error) return 'error';
    return 'success';
  };

  return (
    <div className="container">

      {/* ── HERO ── */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h1>Generator Lampiran Modul Ajar</h1>
        <p className="subtitle">Hasilkan semua dokumen lampiran secara otomatis menggunakan AI</p>

        {/* Upload modul */}
        <div style={{
          border: '2px dashed rgba(99,179,237,0.5)', borderRadius: '12px',
          padding: '1.5rem', textAlign: 'center', background: 'rgba(99,179,237,0.05)',
          marginTop: '1.5rem',
        }}>
          <FileUp size={36} style={{ margin: '0 auto 0.75rem', color: '#63b3ed', display: 'block' }} />
          <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Upload Modul Ajar (PDF / DOCX)</p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
            AI akan membaca modul Anda dan mengisi form di bawah secara otomatis.
          </p>
          <label htmlFor="modul-upload" style={{ cursor: isPdfLoading ? 'not-allowed' : 'pointer' }}>
            <div className="btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 24px', borderRadius: '8px',
              background: 'rgba(99,179,237,0.2)', border: '1px solid rgba(99,179,237,0.5)',
              color: '#63b3ed', fontWeight: 600, fontSize: '0.9rem',
              pointerEvents: isPdfLoading ? 'none' : 'auto',
            }}>
              {isPdfLoading
                ? <><Loader2 className="spin" size={16} /> Sedang membaca modul…</>
                : <><FileUp size={16} /> Pilih File Modul</>}
            </div>
          </label>
          <input id="modul-upload" type="file" accept=".pdf,.docx,.doc"
            style={{ display: 'none' }} onChange={handleFileUpload} />
        </div>
        {errorMsg && (
          <div style={{
            marginTop: '1rem', padding: '12px 16px', borderRadius: '8px',
            background: 'rgba(252,129,74,0.1)', border: '1px solid rgba(252,129,74,0.3)',
            color: '#fc814a', fontSize: '0.9rem',
          }}>{errorMsg}</div>
        )}
      </div>

      {/* ── FORM ── */}
      <form onSubmit={handleGenerate}>
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>

          {/* A. Identitas */}
          <div className="accordion" style={{ marginBottom: '0.75rem' }}>
            <button type="button" className="accordion-header" onClick={() => toggleSection('identitas')}>
              <span>A. Identitas Modul</span>
              {openSection === 'identitas' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
            </button>
            {openSection === 'identitas' && (
              <div className="accordion-body">
                <div className="grid-2">
                  {[
                    ['namaSekolah','Nama Sekolah *','text',true],
                    ['taglineSekolah','Tagline / Motto Sekolah','text',false],
                    ['mataPelajaran','Mata Pelajaran *','text',true],
                    ['faseKelas','Fase / Kelas *','text',true],
                    ['judulModul','Judul Modul *','text',true],
                    ['kodeModul','Kode Modul','text',false],
                    ['tahunPelajaran','Tahun Pelajaran','text',false],
                    ['kurikulum','Kurikulum','text',false],
                    ['konteksLokal','Konteks Lokal','text',false],
                    ['nilaiSekolah','Nilai / Karakter Sekolah','text',false],
                  ].map(([name, label, type, req]) => (
                    <div className="form-group" key={name}>
                      <label>{label}{req && <span className="required"> *</span>}</label>
                      <input required={req} type={type} name={name} className="glass-input"
                        onChange={handleChange} value={formData[name]} />
                    </div>
                  ))}
                  <div className="form-group">
                    <label>Semester</label>
                    <select name="semester" className="glass-input" onChange={handleChange} value={formData.semester}>
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* B. Kompetensi */}
          <div className="accordion" style={{ marginBottom: '0.75rem' }}>
            <button type="button" className="accordion-header" onClick={() => toggleSection('kompetensi')}>
              <span>B. Kompetensi & Lampiran</span>
              {openSection === 'kompetensi' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
            </button>
            {openSection === 'kompetensi' && (
              <div className="accordion-body">
                <div className="form-group">
                  <label>Tujuan Pembelajaran (TP) <span className="required">*</span></label>
                  <textarea required name="tujuanPembelajaran" className="glass-input"
                    style={{ minHeight: '90px' }} onChange={handleChange} value={formData.tujuanPembelajaran} />
                </div>
                <div className="form-group">
                  <label>Indikator Ketercapaian TP (IKTP) <span className="required">*</span></label>
                  <textarea required name="iktp" className="glass-input"
                    style={{ minHeight: '110px' }} placeholder="1. ...&#10;2. ...&#10;3. ..."
                    onChange={handleChange} value={formData.iktp} />
                </div>
                <div className="form-group">
                  <label>Daftar Lampiran yang Diminta</label>
                  <input type="text" name="daftarLampiranYangDiminta" className="glass-input"
                    onChange={handleChange} value={formData.daftarLampiranYangDiminta} />
                  <small style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>
                    Contoh: LKPD x2, Asesmen Formatif, Asesmen Sumatif, Rekap Kelas, Media Pembelajaran, Lembar Refleksi, Pengayaan, Remediasi
                  </small>
                </div>
              </div>
            )}
          </div>

          {/* C. Detail LKPD */}
          <div className="accordion" style={{ marginBottom: '0.75rem' }}>
            <button type="button" className="accordion-header" onClick={() => toggleSection('lkpd')}>
              <span>C. Detail LKPD & Pertemuan</span>
              {openSection === 'lkpd' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
            </button>
            {openSection === 'lkpd' && (
              <div className="accordion-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label>Topik Pertemuan 1</label>
                    <input type="text" name="topikPertemuan1" className="glass-input"
                      placeholder="Contoh: Fenomena Alam di Purbalingga"
                      onChange={handleChange} value={formData.topikPertemuan1} />
                  </div>
                  <div className="form-group">
                    <label>Metode / Aktivitas Pertemuan 1</label>
                    <input type="text" name="metodePertemuan1" className="glass-input"
                      placeholder="Contoh: Gallery Walk, Observasi Lapangan"
                      onChange={handleChange} value={formData.metodePertemuan1} />
                  </div>
                  <div className="form-group">
                    <label>Jumlah Aspek Analisis LKPD 1</label>
                    <input type="number" name="jumlahAspekAnalisis" className="glass-input"
                      min="3" max="10" onChange={handleChange} value={formData.jumlahAspekAnalisis} />
                  </div>
                  <div className="form-group">
                    <label>Topik Pertemuan 2</label>
                    <input type="text" name="topikPertemuan2" className="glass-input"
                      placeholder="Contoh: Keterkaitan Alam-Sosial"
                      onChange={handleChange} value={formData.topikPertemuan2} />
                  </div>
                  <div className="form-group">
                    <label>Dimensi Keterkaitan (Pertemuan 2)</label>
                    <input type="text" name="dimensiKeterkaitan" className="glass-input"
                      placeholder="Contoh: teori & praktik, peluang & risiko, alam & sosial"
                      onChange={handleChange} value={formData.dimensiKeterkaitan} />
                  </div>
                  <div className="form-group">
                    <label>Jumlah Pasangan Keterkaitan LKPD 2</label>
                    <input type="number" name="jumlahPasanganKeterkaitan" className="glass-input"
                      min="2" max="8" onChange={handleChange} value={formData.jumlahPasanganKeterkaitan} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* D. Asesmen */}
          <div className="accordion" style={{ marginBottom: '0.75rem' }}>
            <button type="button" className="accordion-header" onClick={() => toggleSection('asesmen')}>
              <span>D. Detail Asesmen</span>
              {openSection === 'asesmen' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
            </button>
            {openSection === 'asesmen' && (
              <div className="accordion-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label>Jumlah Pertanyaan Lisan (Formatif)</label>
                    <input type="number" name="jumlahPertanyaanLisan" className="glass-input"
                      min="1" max="10" onChange={handleChange} value={formData.jumlahPertanyaanLisan} />
                  </div>
                  <div className="form-group">
                    <label>Jumlah Soal Kuis (Formatif)</label>
                    <input type="number" name="jumlahSoalKuis" className="glass-input"
                      min="1" max="15" onChange={handleChange} value={formData.jumlahSoalKuis} />
                  </div>
                  <div className="form-group">
                    <label>Jenis Produk Sumatif</label>
                    <input type="text" name="jenisProdukSumatif" className="glass-input"
                      placeholder="Contoh: Laporan Observasi, Poster"
                      onChange={handleChange} value={formData.jenisProdukSumatif} />
                  </div>
                  <div className="form-group">
                    <label>Aspek Penilaian Sumatif</label>
                    <input type="text" name="aspekPenilaianSumatif" className="glass-input"
                      placeholder="Contoh: Pengetahuan, Keterampilan, Sikap"
                      onChange={handleChange} value={formData.aspekPenilaianSumatif} />
                  </div>
                  <div className="form-group">
                    <label>Bobot Tiap Aspek</label>
                    <input type="text" name="bobotAspek" className="glass-input"
                      placeholder="Contoh: Pengetahuan 40%, Keterampilan 40%, Sikap 20%"
                      onChange={handleChange} value={formData.bobotAspek} />
                  </div>
                  <div className="form-group">
                    <label>Nilai KKTP</label>
                    <input type="number" name="kktp" className="glass-input"
                      min="0" max="100" onChange={handleChange} value={formData.kktp} />
                  </div>
                  <div className="form-group">
                    <label>Jumlah Siswa per Kelas</label>
                    <input type="number" name="jumlahSiswa" className="glass-input"
                      min="1" onChange={handleChange} value={formData.jumlahSiswa} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* E. Media, Refleksi, Pengayaan, Remediasi */}
          <div className="accordion" style={{ marginBottom: '0.75rem' }}>
            <button type="button" className="accordion-header" onClick={() => toggleSection('extras')}>
              <span>E. Media, Refleksi, Pengayaan & Remediasi</span>
              {openSection === 'extras' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
            </button>
            {openSection === 'extras' && (
              <div className="accordion-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label>Jumlah Slide Presentasi</label>
                    <input type="number" name="jumlahSlide" className="glass-input"
                      min="5" max="30" onChange={handleChange} value={formData.jumlahSlide} />
                  </div>
                  <div className="form-group">
                    <label>Jumlah Referensi Video/Sumber</label>
                    <input type="number" name="jumlahReferensi" className="glass-input"
                      min="1" max="10" onChange={handleChange} value={formData.jumlahReferensi} />
                  </div>
                  <div className="form-group">
                    <label>Kutipan / Ayat Penutup (Opsional)</label>
                    <input type="text" name="kutipanPenutup" className="glass-input"
                      placeholder="Kosongkan jika tidak diperlukan"
                      onChange={handleChange} value={formData.kutipanPenutup} />
                  </div>
                  <div className="form-group">
                    <label>Topik Pengayaan</label>
                    <input type="text" name="topikPengayaan" className="glass-input"
                      placeholder="Contoh: Dampak perubahan iklim global"
                      onChange={handleChange} value={formData.topikPengayaan} />
                  </div>
                  <div className="form-group">
                    <label>Jenis Tugas Pengayaan</label>
                    <input type="text" name="jenisTugasPengayaan" className="glass-input"
                      placeholder="Contoh: mini-infografis, esai ilmiah, poster digital"
                      onChange={handleChange} value={formData.jenisTugasPengayaan} />
                  </div>
                  <div className="form-group">
                    <label>IKTP Fokus Remediasi</label>
                    <input type="text" name="iktpRemediasi" className="glass-input"
                      placeholder="Contoh: Siswa belum bisa membedakan fenomena alam dan sosial"
                      onChange={handleChange} value={formData.iktpRemediasi} />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── TOMBOL GENERATE ── */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
          style={{ marginTop: '0', width: '100%', height: '56px', fontSize: '17px', gap: '10px' }}
        >
          {isLoading
            ? <><Loader2 className="spin" size={22} /> AI sedang memproses lampiran…</>
            : <><Sparkles size={22} /> Generate Semua Lampiran Sekaligus</>}
        </button>
      </form>

      {/* ── HASIL ── */}
      {result && (
        <div id="result-section" className="glass-panel result-panel" style={{ marginTop: '2rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            {!isDone
              ? <Loader2 className="spin" size={32} style={{ color: '#63b3ed', flexShrink: 0 }} />
              : allSuccess
                ? <CheckCircle size={32} style={{ color: '#68d391', flexShrink: 0 }} />
                : <XCircle size={32} style={{ color: '#fc814a', flexShrink: 0 }} />}
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>
                {!isDone
                  ? 'Sedang Memproses Dokumen AI…'
                  : allSuccess
                    ? 'Semua Lampiran Berhasil Di-generate!'
                    : 'Beberapa Lampiran Gagal Di-generate!'}
              </h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                {!isDone
                  ? 'Mohon tunggu, setiap kotak akan berubah hijau jika selesai.'
                  : allSuccess
                    ? `${ALL_KEYS.length} bagian lampiran siap diunduh.`
                    : 'Silakan klik "Coba Ulang yang Gagal" sebelum mengunduh.'}
              </p>
            </div>
          </div>

          {/* Grid status */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: '8px', marginBottom: '1.5rem' }}>
            {ALL_KEYS.map(({ key, label }) => {
              const status = getStatus(key);
              const colorMap = { idle: '#a0aec0', loading: '#63b3ed', success: '#68d391', error: '#fc814a' };
              const bgMap = {
                idle: 'rgba(160,174,192,0.1)',
                loading: 'rgba(99,179,237,0.1)',
                success: 'rgba(104,211,145,0.15)',
                error: 'rgba(252,129,74,0.15)',
              };
              const borderMap = {
                idle: 'rgba(160,174,192,0.3)',
                loading: 'rgba(99,179,237,0.3)',
                success: 'rgba(104,211,145,0.4)',
                error: 'rgba(252,129,74,0.4)',
              };
              return (
                <div key={key} title={status === 'error' ? result[key]?.error : ''}
                  style={{
                    padding: '8px 12px', borderRadius: '8px',
                    background: bgMap[status], border: `1px solid ${borderMap[status]}`,
                    fontSize: '0.8rem', fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                  <span style={{ color: colorMap[status], display: 'flex', alignItems: 'center' }}>
                    {status === 'loading'
                      ? <Loader2 size={13} className="spin" />
                      : status === 'success' ? '✓'
                      : status === 'error' ? '✗' : '○'}
                  </span>
                  {label}
                </div>
              );
            })}
          </div>

          {/* Tombol aksi */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {hasError && isDone && (
              <button
                type="button"
                onClick={handleRetry}
                disabled={isLoading}
                className="btn"
                style={{
                  flex: 1, height: '48px', fontSize: '15px', gap: '8px',
                  background: 'rgba(252,129,74,0.15)', border: '1px solid rgba(252,129,74,0.4)',
                  color: '#fc814a',
                }}
              >
                {isLoading ? <><Loader2 className="spin" size={18} /> Mencoba ulang…</> : '🔄 Coba Ulang yang Gagal'}
              </button>
            )}
            <button
              type="button"
              onClick={handleDownloadDocx}
              disabled={!allSuccess}
              className="btn btn-primary"
              style={{ flex: 1, height: '48px', fontSize: '15px', gap: '8px', opacity: allSuccess ? 1 : 0.4 }}
            >
              <FileText size={18} /> Unduh Dokumen Word (.docx) - Kertas F4
            </button>
            <button
              type="button"
              onClick={handleDownloadJSON}
              disabled={!allSuccess}
              className="btn"
              style={{ height: '48px', fontSize: '15px', gap: '8px', opacity: allSuccess ? 1 : 0.4, background: 'rgba(255,255,255,0.1)' }}
            >
              <Download size={18} /> JSON
            </button>
          </div>

          {/* Raw JSON toggle */}
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
              ˅ Lihat data JSON mentah
            </summary>
            <pre style={{
              marginTop: '0.75rem', padding: '1rem', borderRadius: '8px',
              background: 'rgba(0,0,0,0.3)', fontSize: '0.72rem',
              maxHeight: '400px', overflow: 'auto', color: '#a0aec0',
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
