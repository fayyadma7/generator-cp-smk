'use client';
import { useState, useRef } from 'react';
import { generateAndDownloadDocx } from '../lib/docxGenerator';
import { Sparkles, Download, Loader2, ChevronDown, ChevronUp, FileUp, CheckCircle, XCircle } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    subject: '',
    program: '',
    phase: '',
    grade: '',
    semester: '',
    year: '2025/2026',
    time: '',
    teacher: '',
    waka: '',
    principal: '',
    elemcp: '',
    cpText: '',
    elemen1: '',
    capaian1: '',
    elemen2: '',
    capaian2: '',
    catatan: '',
    tantangan: '',
  });

  const [openSection, setOpenSection] = useState('identitas');
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfStatus, setPdfStatus] = useState(null); // null | 'success' | 'error'
  const [pdfMessage, setPdfMessage] = useState('');
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  // ── Upload & Parse PDF ──
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setPdfStatus('error');
      setPdfMessage('File harus berformat PDF.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPdfStatus('error');
      setPdfMessage('Ukuran file maksimal 10 MB.');
      return;
    }

    setIsPdfLoading(true);
    setPdfStatus(null);
    setPdfMessage('');

    // Buka section CP agar guru bisa lihat progress
    setOpenSection('cp');

    try {
      const fd = new FormData();
      fd.append('pdf', file);

      const res = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal membaca PDF');
      }

      // Auto-isi form dengan data hasil ekstraksi
      setFormData(prev => ({
        ...prev,
        // Hanya isi jika field masih kosong (jangan timpa yang sudah diisi guru)
        subject:   data.mataPelajaran && !prev.subject   ? data.mataPelajaran : prev.subject,
        phase:     data.fase          && !prev.phase     ? data.fase          : prev.phase,
        elemcp:    data.elemcp        && !prev.elemcp    ? data.elemcp        : prev.elemcp,
        cpText:    data.cpText        || prev.cpText,
        elemen1:   data.elemen1       && !prev.elemen1   ? data.elemen1       : prev.elemen1,
        capaian1:  data.capaian1      && !prev.capaian1  ? data.capaian1      : prev.capaian1,
        elemen2:   data.elemen2       && !prev.elemen2   ? data.elemen2       : prev.elemen2,
        capaian2:  data.capaian2      && !prev.capaian2  ? data.capaian2      : prev.capaian2,
      }));

      setPdfStatus('success');
      setPdfMessage(`✅ PDF berhasil dibaca! Kolom CP sudah terisi otomatis dari "${file.name}". Silakan periksa dan lengkapi data lainnya.`);

    } catch (error) {
      console.error(error);
      setPdfStatus('error');
      setPdfMessage(`Gagal memproses PDF: ${error.message}`);
    } finally {
      setIsPdfLoading(false);
      // Reset file input agar bisa upload ulang file yang sama
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Generate AI ──
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.cpText) return alert("Teks CP (Deskripsi CP) wajib diisi! Upload PDF atau isi manual.");

    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal generate dari AI");
      }

      const data = await res.json();
      setResult(data);

      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (error) {
      console.error(error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    generateAndDownloadDocx(formData, result);
  };

  return (
    <div className="container">
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h1>Generator Format CP</h1>
        <p className="subtitle">SMK Muhammadiyah 3 Purbalingga — Kurikulum Merdeka | Pendekatan Deep Learning</p>

        {/* ── PDF UPLOAD BANNER ── */}
        <div className="pdf-upload-banner">
          <div className="pdf-upload-left">
            <div className="pdf-icon-wrap">
              {isPdfLoading ? <Loader2 className="spin" size={28} /> : <FileUp size={28} />}
            </div>
            <div>
              <div className="pdf-upload-title">Upload PDF Capaian Pembelajaran</div>
              <div className="pdf-upload-sub">
                Upload file PDF dokumen CP resmi dari Kepmendikbud — AI akan otomatis membaca dan mengisi kolom teks CP.
              </div>
            </div>
          </div>
          <label className="pdf-upload-btn" htmlFor="pdf-input">
            {isPdfLoading ? 'Membaca PDF...' : 'Pilih File PDF'}
          </label>
          <input
            ref={fileInputRef}
            id="pdf-input"
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={handlePdfUpload}
            disabled={isPdfLoading}
          />
        </div>

        {/* Status PDF */}
        {pdfStatus && (
          <div className={`pdf-status ${pdfStatus}`}>
            {pdfStatus === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            <span>{pdfMessage}</span>
          </div>
        )}

        <form onSubmit={handleGenerate} style={{ marginTop: '1.5rem' }}>

          {/* ── SECTION A: IDENTITAS ── */}
          <div className="accordion">
            <button type="button" className="accordion-header" onClick={() => toggleSection('identitas')}>
              <span>A. Identitas Mata Pelajaran</span>
              {openSection === 'identitas' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSection === 'identitas' && (
              <div className="accordion-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label>Nama Mata Pelajaran <span className="required">*</span></label>
                    <input required type="text" name="subject" className="glass-input" placeholder="Contoh: Informatika" onChange={handleChange} value={formData.subject} />
                  </div>
                  <div className="form-group">
                    <label>Program Keahlian <span className="required">*</span></label>
                    <input required type="text" name="program" className="glass-input" placeholder="Contoh: Teknik Komputer Jaringan" onChange={handleChange} value={formData.program} />
                  </div>
                  <div className="form-group">
                    <label>Fase <span className="required">*</span></label>
                    <select name="phase" className="glass-input" onChange={handleChange} value={formData.phase} required>
                      <option value="">-- Pilih Fase --</option>
                      <option value="Fase E">Fase E</option>
                      <option value="Fase F">Fase F</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Kelas <span className="required">*</span></label>
                    <select name="grade" className="glass-input" onChange={handleChange} value={formData.grade} required>
                      <option value="">-- Pilih Kelas --</option>
                      <option value="X">X</option>
                      <option value="XI">XI</option>
                      <option value="XII">XII</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Semester <span className="required">*</span></label>
                    <select name="semester" className="glass-input" onChange={handleChange} value={formData.semester} required>
                      <option value="">-- Pilih Semester --</option>
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tahun Pelajaran</label>
                    <input type="text" name="year" className="glass-input" value={formData.year} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Alokasi Waktu <span className="required">*</span></label>
                    <input required type="text" name="time" className="glass-input" placeholder="Contoh: 4 JP × 36 minggu = 144 JP" onChange={handleChange} value={formData.time} />
                  </div>
                  <div className="form-group">
                    <label>Guru Mata Pelajaran <span className="required">*</span></label>
                    <input required type="text" name="teacher" className="glass-input" placeholder="Nama Lengkap & NIP/NUPTK" onChange={handleChange} value={formData.teacher} />
                  </div>
                  <div className="form-group">
                    <label>Waka Kurikulum</label>
                    <input type="text" name="waka" className="glass-input" placeholder="Nama Waka Kurikulum" onChange={handleChange} value={formData.waka} />
                  </div>
                  <div className="form-group">
                    <label>Kepala Sekolah</label>
                    <input type="text" name="principal" className="glass-input" placeholder="Nama Kepala Sekolah" onChange={handleChange} value={formData.principal} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SECTION B: CAPAIAN PEMBELAJARAN ── */}
          <div className="accordion">
            <button type="button" className="accordion-header" onClick={() => toggleSection('cp')}>
              <span>B. Capaian Pembelajaran</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {formData.cpText && <span className="badge-filled">Terisi ✓</span>}
                {openSection === 'cp' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>
            {openSection === 'cp' && (
              <div className="accordion-body">
                {isPdfLoading && (
                  <div className="pdf-reading-indicator">
                    <Loader2 className="spin" size={20} />
                    <span>AI sedang membaca PDF dan mengekstrak teks CP...</span>
                  </div>
                )}
                <div className="form-group">
                  <label>Elemen CP (B.1)</label>
                  <input type="text" name="elemcp" className="glass-input" placeholder="Contoh: Pemrograman, Jaringan Komputer, dll." onChange={handleChange} value={formData.elemcp} />
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Deskripsi CP Umum — dari Kepmendikbudristek (B.1) <span className="required">*</span></label>
                  <textarea
                    required
                    name="cpText"
                    className="glass-input"
                    style={{ minHeight: '180px', resize: 'vertical' }}
                    placeholder={isPdfLoading ? "Menunggu hasil baca PDF..." : "Paste teks CP resmi di sini, atau upload PDF di atas untuk mengisi otomatis..."}
                    onChange={handleChange}
                    value={formData.cpText}
                  />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.5rem 0 1rem' }}>
                  (B.2) Opsional — isi jika ada per elemen yang ingin dicantumkan:
                </p>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Nama Elemen 1</label>
                    <input type="text" name="elemen1" className="glass-input" placeholder="Contoh: Pemrograman Dasar" onChange={handleChange} value={formData.elemen1} />
                  </div>
                  <div className="form-group">
                    <label>Capaian Elemen 1</label>
                    <textarea name="capaian1" className="glass-input" style={{ minHeight: '80px' }} placeholder="Deskripsi capaian elemen 1..." onChange={handleChange} value={formData.capaian1} />
                  </div>
                  <div className="form-group">
                    <label>Nama Elemen 2</label>
                    <input type="text" name="elemen2" className="glass-input" placeholder="Contoh: Jaringan Komputer" onChange={handleChange} value={formData.elemen2} />
                  </div>
                  <div className="form-group">
                    <label>Capaian Elemen 2</label>
                    <textarea name="capaian2" className="glass-input" style={{ minHeight: '80px' }} placeholder="Deskripsi capaian elemen 2..." onChange={handleChange} value={formData.capaian2} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SECTION G: CATATAN ── */}
          <div className="accordion">
            <button type="button" className="accordion-header" onClick={() => toggleSection('catatan')}>
              <span>G. Catatan Pengembangan (Opsional)</span>
              {openSection === 'catatan' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSection === 'catatan' && (
              <div className="accordion-body">
                <div className="form-group">
                  <label>Catatan Kontekstualisasi CP</label>
                  <textarea name="catatan" className="glass-input" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="Tuliskan catatan penyesuaian yang dilakukan..." onChange={handleChange} value={formData.catatan} />
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Tantangan & Solusi Antisipasi</label>
                  <textarea name="tantangan" className="glass-input" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="Uraikan potensi kendala dan solusinya..." onChange={handleChange} value={formData.tantangan} />
                </div>
              </div>
            )}
          </div>

          <div className="info-box">
            <Sparkles size={16} />
            <span>Bagian <strong>C, D, E, F</strong> (Analisis, Profil Lulusan, Deep Learning, Strategi) akan <strong>diisi otomatis oleh AI</strong> berdasarkan teks CP yang Anda masukkan.</span>
          </div>

          <button type="submit" className="glass-button" disabled={isLoading || isPdfLoading} style={{ marginTop: '1.5rem' }}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {isLoading ? "AI sedang menganalisis CP..." : "Generate & Analisis dengan AI"}
          </button>
        </form>
      </div>

      {result && (
        <div id="result-section" className="glass-panel result-panel" style={{ animation: 'fadeIn 0.5s' }}>
          <div className="result-icon">✅</div>
          <h2>Analisis AI Berhasil!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Dokumen Format CP sudah siap. Klik tombol di bawah untuk mengunduh file <strong>.docx</strong> lengkap sesuai format resmi SMK Muhammadiyah 3 Purbalingga (5 Bagian).
          </p>
          <div className="result-preview">
            <div className="preview-item"><span>📋 Identitas Mata Pelajaran</span><span className="badge">Terisi</span></div>
            <div className="preview-item"><span>📚 Capaian Pembelajaran (B.1 & B.2)</span><span className="badge">Terisi</span></div>
            <div className="preview-item"><span>🧠 Analisis & Kontekstualisasi (C)</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>🏅 8 Dimensi Profil Lulusan (D)</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>⚡ Implementasi Deep Learning (E)</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>🎯 Strategi Pembelajaran (F)</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>📝 Catatan Pengembangan (G)</span><span className="badge">Terisi</span></div>
            <div className="preview-item"><span>🗺️ Alur Penggunaan Dokumen (Bag. V)</span><span className="badge">Otomatis</span></div>
          </div>
          <button id="download-btn" onClick={handleDownload} className="glass-button" style={{ marginTop: '1.5rem' }}>
            <Download />
            Download Format CP Lengkap (.docx)
          </button>
        </div>
      )}
    </div>
  );
}
