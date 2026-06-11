'use client';
import { useState, useRef } from 'react';
import { generateAndDownloadTpAtp } from '../../lib/docxGeneratorTpAtp';
import { Sparkles, Download, Loader2, ChevronDown, ChevronUp, FileUp, CheckCircle, XCircle } from 'lucide-react';

export default function TpAtpGenerator() {
  const [formData, setFormData] = useState({
    subject: '', program: '', phase: '', grade: '',
    semester: 'Ganjil & Genap', year: '2025/2026', timeTotal: '',
    teacher: '', waka: '', principal: '', cpText: '',
  });

  const [openSection, setOpenSection]     = useState('identitas');
  const [isLoading, setIsLoading]         = useState(false);
  const [isPdfLoading, setIsPdfLoading]   = useState(false);
  const [pdfStatus, setPdfStatus]         = useState(null);
  const [pdfMessage, setPdfMessage]       = useState('');
  const [result, setResult]               = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const toggleSection = (id) => setOpenSection(openSection === id ? null : id);

  // ── Upload & Parse PDF ──
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { setPdfStatus('error'); setPdfMessage('File harus berformat PDF.'); return; }
    if (file.size > 10 * 1024 * 1024) { setPdfStatus('error'); setPdfMessage('Ukuran file maksimal 10 MB.'); return; }

    setIsPdfLoading(true); setPdfStatus(null); setPdfMessage('');
    setOpenSection('cp');

    try {
      const fd = new FormData();
      fd.append('pdf', file);
      const res  = await fetch('/api/parse-pdf', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membaca PDF');

      setFormData(prev => ({
        ...prev,
        subject: data.mataPelajaran && !prev.subject ? data.mataPelajaran : prev.subject,
        phase:   data.fase          && !prev.phase   ? data.fase          : prev.phase,
        cpText:  data.cpText        || prev.cpText,
      }));

      setPdfStatus('success');
      setPdfMessage(`✅ PDF "${file.name}" berhasil dibaca! Kolom CP sudah terisi otomatis.`);
    } catch (error) {
      setPdfStatus('error'); setPdfMessage(`Gagal memproses PDF: ${error.message}`);
    } finally {
      setIsPdfLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Generate AI ──
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.cpText) return alert("Teks CP (Ringkasan CP) wajib diisi!");

    setIsLoading(true); setResult(null);
    try {
      const res = await fetch('/api/generate-tp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Gagal generate dari AI"); }
      const data = await res.json();
      setResult(data);
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch (error) {
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    generateAndDownloadTpAtp(formData, result);
  };

  return (
    <div className="container">
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h1>Generator Format TP & ATP</h1>
        <p className="subtitle">SMK Muhammadiyah 3 Purbalingga — Kurikulum Merdeka | Pendekatan Deep Learning</p>

        {/* ── PDF UPLOAD BANNER ── */}
        <div className="pdf-upload-banner">
          <div className="pdf-upload-left">
            <div className="pdf-icon-wrap">
              {isPdfLoading ? <Loader2 className="spin" size={28} /> : <FileUp size={28} />}
            </div>
            <div>
              <div className="pdf-upload-title">Upload PDF Capaian Pembelajaran</div>
              <div className="pdf-upload-sub">Upload PDF dokumen CP resmi Kemdikbud — AI otomatis mengekstrak teks CP.</div>
            </div>
          </div>
          <label className="pdf-upload-btn" htmlFor="pdf-input">
            {isPdfLoading ? 'Membaca PDF...' : 'Pilih File PDF'}
          </label>
          <input ref={fileInputRef} id="pdf-input" type="file" accept="application/pdf"
            style={{ display: 'none' }} onChange={handlePdfUpload} disabled={isPdfLoading} />
        </div>

        {pdfStatus && (
          <div className={`pdf-status ${pdfStatus}`}>
            {pdfStatus === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            <span>{pdfMessage}</span>
          </div>
        )}

        <form onSubmit={handleGenerate} style={{ marginTop: '1.5rem' }}>

          {/* ── A. IDENTITAS ── */}
          <div className="accordion">
            <button type="button" className="accordion-header" onClick={() => toggleSection('identitas')}>
              <span>A. Identitas Mata Pelajaran</span>
              {openSection === 'identitas' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
            </button>
            {openSection === 'identitas' && (
              <div className="accordion-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label>Nama Mata Pelajaran <span className="required">*</span></label>
                    <input required type="text" name="subject" className="glass-input" placeholder="Contoh: Informatika" onChange={handleChange} value={formData.subject}/>
                  </div>
                  <div className="form-group">
                    <label>Program Keahlian <span className="required">*</span></label>
                    <input required type="text" name="program" className="glass-input" placeholder="Contoh: Teknik Komputer Jaringan" onChange={handleChange} value={formData.program}/>
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
                    <label>Tahun Pelajaran</label>
                    <input type="text" name="year" className="glass-input" value={formData.year} onChange={handleChange}/>
                  </div>
                  <div className="form-group">
                    <label>Alokasi Waktu Total (JP) <span className="required">*</span></label>
                    <input required type="number" name="timeTotal" className="glass-input" placeholder="Contoh: 144" onChange={handleChange} value={formData.timeTotal}/>
                  </div>
                  <div className="form-group">
                    <label>Guru Penyusun <span className="required">*</span></label>
                    <input required type="text" name="teacher" className="glass-input" placeholder="Nama Lengkap & NIP/NUPTK" onChange={handleChange} value={formData.teacher}/>
                  </div>
                  <div className="form-group">
                    <label>Waka Kurikulum</label>
                    <input type="text" name="waka" className="glass-input" placeholder="Nama Waka Kurikulum" onChange={handleChange} value={formData.waka}/>
                  </div>
                  <div className="form-group">
                    <label>Kepala Sekolah</label>
                    <input type="text" name="principal" className="glass-input" placeholder="Nama Kepala Sekolah" onChange={handleChange} value={formData.principal}/>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── B. CAPAIAN PEMBELAJARAN ── */}
          <div className="accordion">
            <button type="button" className="accordion-header" onClick={() => toggleSection('cp')}>
              <span>B. Teks Capaian Pembelajaran (CP)</span>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                {formData.cpText && <span className="badge-filled">Terisi ✓</span>}
                {openSection === 'cp' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
              </div>
            </button>
            {openSection === 'cp' && (
              <div className="accordion-body">
                {isPdfLoading && (
                  <div className="pdf-reading-indicator">
                    <Loader2 className="spin" size={20}/>
                    <span>AI sedang membaca PDF dan mengekstrak teks CP...</span>
                  </div>
                )}
                <div className="form-group">
                  <label>Deskripsi CP yang Dirujuk <span className="required">*</span></label>
                  <textarea required name="cpText" className="glass-input"
                    style={{ minHeight:'180px', resize:'vertical' }}
                    placeholder={isPdfLoading ? "Menunggu hasil baca PDF..." : "Paste atau upload PDF untuk mengisi otomatis teks CP..."}
                    onChange={handleChange} value={formData.cpText}/>
                </div>
              </div>
            )}
          </div>

          <div className="info-box">
            <Sparkles size={16}/>
            <span>Tujuan Pembelajaran (TP), IKTP, dan Peta Alur (ATP) akan <strong>digenerate secara otomatis oleh AI</strong> berdasarkan teks CP yang dimasukkan.</span>
          </div>

          <button type="submit" className="glass-button" disabled={isLoading || isPdfLoading} style={{ marginTop:'1.5rem' }}>
            {isLoading ? <Loader2 className="animate-spin"/> : <Sparkles/>}
            {isLoading ? "AI sedang merumuskan TP & ATP..." : "Generate TP & ATP"}
          </button>
        </form>
      </div>

      {result && (
        <div id="result-section" className="glass-panel result-panel" style={{ animation:'fadeIn 0.5s' }}>
          <div className="result-icon">✅</div>
          <h2>Analisis AI Berhasil!</h2>
          <p style={{ color:'var(--text-muted)', marginBottom:'0.5rem' }}>
            Dokumen Format TP & ATP sudah siap — <strong>{result.tujuanPembelajaran?.length || 0} Tujuan Pembelajaran</strong> berhasil dirumuskan.
          </p>
          <div className="result-preview">
            <div className="preview-item"><span>📋 Tabel Tujuan Pembelajaran (ABCD)</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>🎯 IKTP & Asesmen</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>🗺️ Peta Alur Tujuan Pembelajaran</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>📊 Alur TP Semester Ganjil & Genap</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>⚡ Integrasi Deep Learning & Profil Lulusan</span><span className="badge ai">AI</span></div>
          </div>
          <button id="download-btn" onClick={handleDownload} className="glass-button" style={{ marginTop:'1.5rem' }}>
            <Download/> Download Format TP & ATP Lengkap (.docx)
          </button>
        </div>
      )}
    </div>
  );
}
