'use client';
import { useState, useRef } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronUp, XCircle, FileUp, CheckCircle, Download } from 'lucide-react';

export default function LampiranGenerator() {
  const [formData, setFormData] = useState({
    namaSekolah: 'SMK Muhammadiyah 3 Purbalingga',
    taglineSekolah: 'Unggul • Islami • Berjiwa Entrepreneur',
    judulModul: '',
    kodeModul: '',
    faseKelas: '',
    semester: 'Ganjil',
    tahunPelajaran: '2025/2026',
    mataPelajaran: '',
    kurikulum: 'Kurikulum Merdeka — Pendekatan Deep Learning',
    pendekatanPembelajaran: 'Deep Learning (Mindful, Meaningful, Joyful)',
    daftarLampiranYangDiminta: 'LKPD x2, Asesmen Formatif, Asesmen Sumatif, Rekap Kelas, Media Pembelajaran, Lembar Refleksi, Pengayaan, Remediasi',
    tujuanPembelajaran: '',
    topikPertemuan1: '',
    metodePertemuan1: '',
    konteksLokal: 'Purbalingga',
    nilaiSekolah: 'Islami, Entrepreneur',
    jumlahAspekAnalisis: '7',
    topikPertemuan2: '',
    dimensiKeterkaitan: 'alam dan sosial',
    jumlahPasanganKeterkaitan: '3',
    iktp: '',
    jumlahPertanyaanLisan: '3',
    jumlahSoalKuis: '5',
    jenisProdukSumatif: 'Laporan Proyek',
    aspekPenilaianSumatif: 'Pengetahuan, Keterampilan, Sikap',
    bobotAspek: 'Pengetahuan 40%, Keterampilan 40%, Sikap 20%',
    kktp: '70',
    jumlahSiswa: '32',
    jumlahSlide: '15',
    jumlahReferensi: '5',
    teknikRefleksi: '3-2-1',
    jumlahPertemuan: '2',
    kutipanPenutup: '',
    kegiatanPengayaan: 'Tugas Proyek Lanjutan',
    kegiatanRemedial: 'Bimbingan Tutor Sebaya',
  });

  const [openSection, setOpenSection] = useState('identitas');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfStatus, setPdfStatus] = useState(null); // 'success' | 'error' | null
  const [pdfMessage, setPdfMessage] = useState('');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const toggleSection = (id) => setOpenSection(openSection === id ? null : id);

  // ── Upload & parse modul PDF ──
  const handleModulUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.name.endsWith('.pdf') || file.type === 'application/pdf';
    const isDocx = file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isPdf && !isDocx) {
      setPdfStatus('error');
      setPdfMessage('File harus berformat PDF atau DOCX.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setPdfStatus('error');
      setPdfMessage('Ukuran file maksimal 15 MB.');
      return;
    }

    setIsPdfLoading(true);
    setPdfStatus(null);
    setPdfMessage('');

    try {
      const fd = new FormData();
      fd.append('modul', file);
      const res = await fetch('/api/parse-modul', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal membaca modul');

      const d = json.data;

      // Merge hanya field yang ada nilainya dari PDF, jangan overwrite field yang sudah diisi guru
      setFormData(prev => ({
        ...prev,
        namaSekolah:             d.namaSekolah              || prev.namaSekolah,
        taglineSekolah:          d.taglineSekolah            || prev.taglineSekolah,
        mataPelajaran:           d.mataPelajaran             || prev.mataPelajaran,
        judulModul:              d.judulModul                || prev.judulModul,
        kodeModul:               d.kodeModul                 || prev.kodeModul,
        faseKelas:               d.faseKelas                 || prev.faseKelas,
        semester:                d.semester                  || prev.semester,
        tahunPelajaran:          d.tahunPelajaran            || prev.tahunPelajaran,
        kurikulum:               d.kurikulum                 || prev.kurikulum,
        tujuanPembelajaran:      d.tujuanPembelajaran        || prev.tujuanPembelajaran,
        iktp:                    d.iktp                      || prev.iktp,
        topikPertemuan1:         d.topikPertemuan1           || prev.topikPertemuan1,
        metodePertemuan1:        d.metodePertemuan1          || prev.metodePertemuan1,
        topikPertemuan2:         d.topikPertemuan2           || prev.topikPertemuan2,
        konteksLokal:            d.konteksLokal              || prev.konteksLokal,
        nilaiSekolah:            d.nilaiSekolah              || prev.nilaiSekolah,
        jenisProdukSumatif:      d.jenisProdukSumatif        || prev.jenisProdukSumatif,
        aspekPenilaianSumatif:   d.aspekPenilaianSumatif     || prev.aspekPenilaianSumatif,
        kktp:                    d.kktp                      || prev.kktp,
        jumlahSiswa:             d.jumlahSiswa               || prev.jumlahSiswa,
        daftarLampiranYangDiminta: d.daftarLampiranYangDiminta || prev.daftarLampiranYangDiminta,
      }));

      setPdfStatus('success');
      setPdfMessage(`✅ Modul "${file.name}" berhasil dibaca! Field yang ditemukan sudah terisi otomatis.`);

      // Buka section pertama agar guru bisa langsung cek
      setOpenSection('identitas');
    } catch (error) {
      setPdfStatus('error');
      setPdfMessage(`Gagal memproses modul: ${error.message}`);
    } finally {
      setIsPdfLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Download DOCX ──
  const handleDownload = async () => {
    if (!result) return;
    setIsDownloading(true);
    try {
      const { generateAndDownloadLampiranDocx } = await import('../../lib/docxGeneratorLampiran');
      await generateAndDownloadLampiranDocx(result, formData);
    } catch (err) {
      alert('Gagal membuat file Word: ' + err.message);
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Generate semua lampiran ──
  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setErrorMsg('');

    try {
      const res = await fetch('/api/generate-lampiran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal generate dari AI');
      }
      const data = await res.json();
      setResult(data);
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch (error) {
      setErrorMsg(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">

      {/* ── HERO SECTION ── */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h1>Generator Lampiran Modul Ajar</h1>
        <p className="subtitle">Hasilkan semua dokumen lampiran secara otomatis menggunakan AI</p>

        {/* ── UPLOAD MODUL BOX ── */}
        <div className="upload-modul-box" style={{
          border: '2px dashed rgba(99,179,237,0.5)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center',
          background: 'rgba(99,179,237,0.05)',
          marginTop: '1.5rem',
          marginBottom: '0.5rem',
          transition: 'border-color 0.2s',
        }}>
          <FileUp size={36} style={{ margin: '0 auto 0.75rem', color: '#63b3ed' }} />
          <p style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '1rem' }}>
            Upload Modul Ajar (PDF / DOCX)
          </p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
            AI akan membaca modul Anda (.pdf / .docx) dan mengisi form di bawah secara otomatis.
            Anda tetap bisa mengedit hasilnya.
          </p>

          <label htmlFor="modul-upload" style={{ cursor: isPdfLoading ? 'not-allowed' : 'pointer' }}>
            <div
              className="btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 24px', borderRadius: '8px',
                background: isPdfLoading ? 'rgba(99,179,237,0.3)' : 'rgba(99,179,237,0.2)',
                border: '1px solid rgba(99,179,237,0.5)',
                color: '#63b3ed', fontWeight: 600, fontSize: '0.9rem',
                pointerEvents: isPdfLoading ? 'none' : 'auto',
              }}
            >
              {isPdfLoading ? (
                <><Loader2 className="spin" size={16} /> Sedang membaca modul…</>
              ) : (
                <><FileUp size={16} /> Pilih File Modul</>
              )}
            </div>
          </label>

          <input
            id="modul-upload"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: 'none' }}
            onChange={handleModulUpload}
            ref={fileInputRef}
            disabled={isPdfLoading}
          />
        </div>

        {/* Status upload */}
        {pdfStatus === 'success' && (
          <div className="pdf-status success" style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
            <CheckCircle size={16} />
            <span>{pdfMessage}</span>
          </div>
        )}
        {pdfStatus === 'error' && (
          <div className="pdf-status error" style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
            <XCircle size={16} />
            <span>{pdfMessage}</span>
          </div>
        )}

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: '0.5rem 0 1.5rem' }}>
          — atau isi form di bawah ini secara manual —
        </p>

        {errorMsg && (
          <div className="pdf-status error" style={{ marginBottom: '1rem' }}>
            <XCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleGenerate}>

          {/* ── A. IDENTITAS SEKOLAH & MODUL ── */}
          <div className="accordion">
            <button type="button" className="accordion-header" onClick={() => toggleSection('identitas')}>
              <span>A. Identitas Sekolah & Modul</span>
              {openSection === 'identitas' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
            </button>
            {openSection === 'identitas' && (
              <div className="accordion-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label>Nama Sekolah</label>
                    <input type="text" name="namaSekolah" className="glass-input" onChange={handleChange} value={formData.namaSekolah}/>
                  </div>
                  <div className="form-group">
                    <label>Tagline / Motto Sekolah</label>
                    <input type="text" name="taglineSekolah" className="glass-input" onChange={handleChange} value={formData.taglineSekolah}/>
                  </div>
                  <div className="form-group">
                    <label>Mata Pelajaran <span className="required">*</span></label>
                    <input required type="text" name="mataPelajaran" className="glass-input" onChange={handleChange} value={formData.mataPelajaran}/>
                  </div>
                  <div className="form-group">
                    <label>Fase / Kelas <span className="required">*</span></label>
                    <input required type="text" name="faseKelas" className="glass-input" onChange={handleChange} value={formData.faseKelas}/>
                  </div>
                  <div className="form-group">
                    <label>Judul Modul <span className="required">*</span></label>
                    <input required type="text" name="judulModul" className="glass-input" onChange={handleChange} value={formData.judulModul}/>
                  </div>
                  <div className="form-group">
                    <label>Kode Modul</label>
                    <input type="text" name="kodeModul" className="glass-input" placeholder="Contoh: MA-IPAS-01 | TP-01" onChange={handleChange} value={formData.kodeModul}/>
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <select name="semester" className="glass-input" onChange={handleChange} value={formData.semester}>
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tahun Pelajaran</label>
                    <input type="text" name="tahunPelajaran" className="glass-input" onChange={handleChange} value={formData.tahunPelajaran}/>
                  </div>
                  <div className="form-group">
                    <label>Konteks Lokal</label>
                    <input type="text" name="konteksLokal" className="glass-input" placeholder="Contoh: Purbalingga, industri setempat" onChange={handleChange} value={formData.konteksLokal}/>
                  </div>
                  <div className="form-group">
                    <label>Nilai / Karakter Sekolah</label>
                    <input type="text" name="nilaiSekolah" className="glass-input" placeholder="Contoh: Islami, Entrepreneur" onChange={handleChange} value={formData.nilaiSekolah}/>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── B. KOMPETENSI & DAFTAR LAMPIRAN ── */}
          <div className="accordion">
            <button type="button" className="accordion-header" onClick={() => toggleSection('kompetensi')}>
              <span>B. Kompetensi & Lampiran</span>
              {openSection === 'kompetensi' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
            </button>
            {openSection === 'kompetensi' && (
              <div className="accordion-body">
                <div className="form-group">
                  <label>Tujuan Pembelajaran (TP) <span className="required">*</span></label>
                  <textarea required name="tujuanPembelajaran" className="glass-input" style={{ minHeight: '90px' }} onChange={handleChange} value={formData.tujuanPembelajaran}/>
                </div>
                <div className="form-group">
                  <label>Indikator Ketercapaian TP (IKTP) <span className="required">*</span></label>
                  <textarea required name="iktp" className="glass-input" style={{ minHeight: '110px' }} placeholder="1. ...&#10;2. ...&#10;3. ..." onChange={handleChange} value={formData.iktp}/>
                </div>
                <div className="form-group">
                  <label>Daftar Lampiran yang Diminta</label>
                  <input required type="text" name="daftarLampiranYangDiminta" className="glass-input" onChange={handleChange} value={formData.daftarLampiranYangDiminta}/>
                  <small style={{ color: 'rgba(255,255,255,0.5)', fontSize:'0.78rem' }}>
                    Contoh: LKPD x2, Asesmen Formatif, Asesmen Sumatif, Rekap Kelas, Media Pembelajaran, Lembar Refleksi, Pengayaan, Remediasi
                  </small>
                </div>
              </div>
            )}
          </div>

          {/* ── C. DETAIL PERTEMUAN (LKPD) ── */}
          <div className="accordion">
            <button type="button" className="accordion-header" onClick={() => toggleSection('lkpd')}>
              <span>C. Detail LKPD & Pertemuan</span>
              {openSection === 'lkpd' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
            </button>
            {openSection === 'lkpd' && (
              <div className="accordion-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label>Topik Pertemuan 1</label>
                    <input type="text" name="topikPertemuan1" className="glass-input" placeholder="Contoh: Fenomena Alam di Purbalingga" onChange={handleChange} value={formData.topikPertemuan1}/>
                  </div>
                  <div className="form-group">
                    <label>Metode / Aktivitas Pertemuan 1</label>
                    <input type="text" name="metodePertemuan1" className="glass-input" placeholder="Contoh: Gallery Walk, Observasi Lapangan" onChange={handleChange} value={formData.metodePertemuan1}/>
                  </div>
                  <div className="form-group">
                    <label>Jumlah Aspek Analisis LKPD 1</label>
                    <input type="number" name="jumlahAspekAnalisis" className="glass-input" min="3" max="10" onChange={handleChange} value={formData.jumlahAspekAnalisis}/>
                  </div>
                  <div className="form-group">
                    <label>Topik Pertemuan 2</label>
                    <input type="text" name="topikPertemuan2" className="glass-input" placeholder="Contoh: Keterkaitan Alam-Sosial" onChange={handleChange} value={formData.topikPertemuan2}/>
                  </div>
                  <div className="form-group">
                    <label>Dimensi Keterkaitan (Pertemuan 2)</label>
                    <input type="text" name="dimensiKeterkaitan" className="glass-input" placeholder="Contoh: alam dan sosial" onChange={handleChange} value={formData.dimensiKeterkaitan}/>
                  </div>
                  <div className="form-group">
                    <label>Jumlah Pasangan Keterkaitan</label>
                    <input type="number" name="jumlahPasanganKeterkaitan" className="glass-input" min="2" max="6" onChange={handleChange} value={formData.jumlahPasanganKeterkaitan}/>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── D. ASESMEN & EVALUASI ── */}
          <div className="accordion">
            <button type="button" className="accordion-header" onClick={() => toggleSection('asesmen')}>
              <span>D. Asesmen, Evaluasi & Lainnya</span>
              {openSection === 'asesmen' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
            </button>
            {openSection === 'asesmen' && (
              <div className="accordion-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label>Jumlah Pertanyaan Lisan (Formatif)</label>
                    <input type="number" name="jumlahPertanyaanLisan" className="glass-input" min="1" max="10" onChange={handleChange} value={formData.jumlahPertanyaanLisan}/>
                  </div>
                  <div className="form-group">
                    <label>Jumlah Soal Kuis (Formatif)</label>
                    <input type="number" name="jumlahSoalKuis" className="glass-input" min="1" max="15" onChange={handleChange} value={formData.jumlahSoalKuis}/>
                  </div>
                  <div className="form-group">
                    <label>Jenis Produk Sumatif</label>
                    <input type="text" name="jenisProdukSumatif" className="glass-input" placeholder="Contoh: Laporan Observasi, Poster" onChange={handleChange} value={formData.jenisProdukSumatif}/>
                  </div>
                  <div className="form-group">
                    <label>Aspek Penilaian Sumatif</label>
                    <input type="text" name="aspekPenilaianSumatif" className="glass-input" placeholder="Contoh: Pengetahuan, Keterampilan, Sikap" onChange={handleChange} value={formData.aspekPenilaianSumatif}/>
                  </div>
                  <div className="form-group">
                    <label>Bobot Tiap Aspek</label>
                    <input type="text" name="bobotAspek" className="glass-input" placeholder="Contoh: Pengetahuan 40%, Keterampilan 40%, Sikap 20%" onChange={handleChange} value={formData.bobotAspek}/>
                  </div>
                  <div className="form-group">
                    <label>Nilai KKTP</label>
                    <input type="number" name="kktp" className="glass-input" min="0" max="100" onChange={handleChange} value={formData.kktp}/>
                  </div>
                  <div className="form-group">
                    <label>Jumlah Siswa per Kelas</label>
                    <input type="number" name="jumlahSiswa" className="glass-input" min="1" onChange={handleChange} value={formData.jumlahSiswa}/>
                  </div>
                  <div className="form-group">
                    <label>Jumlah Slide Presentasi</label>
                    <input type="number" name="jumlahSlide" className="glass-input" min="5" max="30" onChange={handleChange} value={formData.jumlahSlide}/>
                  </div>
                  <div className="form-group">
                    <label>Kegiatan Pengayaan</label>
                    <input type="text" name="kegiatanPengayaan" className="glass-input" onChange={handleChange} value={formData.kegiatanPengayaan}/>
                  </div>
                  <div className="form-group">
                    <label>Kegiatan Remedial</label>
                    <input type="text" name="kegiatanRemedial" className="glass-input" onChange={handleChange} value={formData.kegiatanRemedial}/>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SUBMIT BUTTON ── */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ marginTop: '2rem', width: '100%', height: '56px', fontSize: '17px', gap: '10px' }}
          >
            {isLoading
              ? <><Loader2 className="spin" size={22} /> AI sedang membuat semua lampiran… (15–30 detik)</>
              : <><Sparkles size={22} /> Generate Semua Lampiran Sekaligus</>
            }
          </button>
        </form>
      </div>

      {/* ── HASIL GENERATE ── */}
      {result && (
        <div id="result-section" className="glass-panel result-panel">
          {/* Header sukses */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <CheckCircle size={32} style={{ color: '#68d391', flexShrink: 0 }} />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Semua Lampiran Berhasil Di-generate!</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                {Object.keys(result).length} bagian lampiran siap diunduh sebagai file Word
              </p>
            </div>
          </div>

          {/* Ringkasan bagian yang digenerate */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '8px', marginBottom: '1.5rem'
          }}>
            {[
              { key: 'headerDanDaftar', label: '📋 Cover & Daftar Lampiran' },
              { key: 'lkpd01a',         label: '📝 LKPD Pertemuan 1' },
              { key: 'lkpd01b',         label: '📝 LKPD Pertemuan 2' },
              { key: 'asesmenFormatif', label: '✏️ Asesmen Formatif' },
              { key: 'asesmenSumatif',  label: '📊 Asesmen Sumatif' },
              { key: 'rekapKelas',      label: '📈 Rekap Kelas' },
              { key: 'mediaPembelajaran', label: '🎞️ Media Pembelajaran' },
              { key: 'lembarRefleksi', label: '💭 Lembar Refleksi' },
              { key: 'bahanPengayaan', label: '🚀 Bahan Pengayaan' },
              { key: 'bahanRemediasi', label: '🔁 Bahan Remediasi' },
            ].map(({ key, label }) => (
              <div key={key} style={{
                padding: '8px 12px', borderRadius: '8px',
                background: result[key] && !result[key].error
                  ? 'rgba(104,211,145,0.15)' : 'rgba(252,129,74,0.15)',
                border: `1px solid ${ result[key] && !result[key].error ? 'rgba(104,211,145,0.4)' : 'rgba(252,129,74,0.4)' }`,
                fontSize: '0.8rem', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <span style={{ color: result[key] && !result[key].error ? '#68d391' : '#fc814a' }}>
                  {result[key] && !result[key].error ? '✓' : '✗'}
                </span>
                {label}
              </div>
            ))}
          </div>

          {/* Tombol Download */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn btn-primary"
            style={{ width: '100%', height: '56px', fontSize: '17px', gap: '10px', marginBottom: '1rem' }}
          >
            {isDownloading
              ? <><Loader2 className="spin" size={22}/> Membuat file Word…</>
              : <><Download size={22}/> Unduh Dokumen Lampiran (.docx)</>
            }
          </button>

          {/* JSON preview toggle */}
          <button
            type="button"
            onClick={() => setShowJsonPreview(v => !v)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem',
              display: 'flex', alignItems: 'center', gap: '4px', margin: '0 auto'
            }}
          >
            {showJsonPreview ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            {showJsonPreview ? 'Sembunyikan' : 'Lihat'} data JSON mentah
          </button>

          {showJsonPreview && (
            <pre style={{
              background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '10px',
              overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word',
              fontSize: '12px', color: '#e2e8f0', lineHeight: '1.6', marginTop: '1rem'
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
