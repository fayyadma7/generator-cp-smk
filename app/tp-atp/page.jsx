'use client';
import { useState, useRef } from 'react';
import { generateAndDownloadTpAtp } from '../../lib/docxGeneratorTpAtp';
import { Sparkles, Download, Loader2, ChevronDown, ChevronUp, FileUp, CheckCircle, XCircle } from 'lucide-react';

export default function TpAtpGenerator() {
  const [formData, setFormData] = useState({
    subject: '', program: '', phase: '', grade: '',
    semester: 'Ganjil dan Genap', year: '2025/2026', timeTotal: '',
    teacher: '', waka: '', principal: '', cpText: '',
  });

  const [openSection, setOpenSection]     = useState('identitas');
  const [elemenList, setElemenList]       = useState([]);
  const [isLoading, setIsLoading]         = useState(false);
  const [isDocxLoading, setIsDocxLoading] = useState(false);
  const [docxStatus, setDocxStatus]       = useState(null);
  const [docxMessage, setDocxMessage]     = useState('');
  const [result, setResult]               = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const toggleSection = (id) => setOpenSection(openSection === id ? null : id);

  // ── Upload & Parse DOCX ──
  const handleDocxUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.docx') && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { 
      setDocxStatus('error'); setDocxMessage('File harus berformat DOCX.'); return; 
    }
    if (file.size > 10 * 1024 * 1024) { setDocxStatus('error'); setDocxMessage('Ukuran file maksimal 10 MB.'); return; }

    setIsDocxLoading(true); setDocxStatus(null); setDocxMessage('');
    setOpenSection('cp');

    try {
      const fd = new FormData();
      fd.append('docx', file);
      const res  = await fetch('/api/parse-docx', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membaca PDF');

      setFormData(prev => ({
        ...prev,
        subject:   data.mataPelajaran || prev.subject,
        program:   data.program       || prev.program,
        phase:     data.fase          || prev.phase,
        grade:     data.grade         || prev.grade,
        semester:  data.semester      || prev.semester,
        year:      data.year          || prev.year,
        timeTotal: data.timeTotal     || prev.timeTotal,
        teacher:   data.teacher       || prev.teacher,
        waka:      data.waka          || prev.waka,
        principal: data.principal     || prev.principal,
        cpText:    data.cpText        || prev.cpText,
      }));

      // Simpan elemen CP jika tersedia
      if (data.elemenList && Array.isArray(data.elemenList) && data.elemenList.length > 0) {
        setElemenList(data.elemenList);
      } else if (data.elemen1) {
        const els = [{ nama: data.elemen1, capaian: data.capaian1 || '' }];
        if (data.elemen2) els.push({ nama: data.elemen2, capaian: data.capaian2 || '' });
        setElemenList(els);
      }

      setDocxStatus('success');
      setDocxMessage(`✅ Format CP "${file.name}" berhasil dibaca! Kolom CP sudah terisi otomatis.`);
    } catch (error) {
      setDocxStatus('error'); setDocxMessage(`Gagal memproses DOCX: ${error.message}`);
    } finally {
      setIsDocxLoading(false);
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
        body: JSON.stringify({ ...formData, elemenList })
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

        {/* ── DOCX UPLOAD BANNER ── */}
        <div className="pdf-upload-banner">
          <div className="pdf-upload-left">
            <div className="pdf-icon-wrap">
              {isDocxLoading ? <Loader2 className="spin" size={28} /> : <FileUp size={28} />}
            </div>
            <div>
              <div className="pdf-upload-title">Upload Format CP (.docx)</div>
              <div className="pdf-upload-sub">Upload dokumen Format CP yang sudah digenerate dari website ini. AI akan otomatis mengekstrak teks CP.</div>
            </div>
          </div>
          <label className="pdf-upload-btn" htmlFor="docx-input">
            {isDocxLoading ? 'Membaca DOCX...' : 'Pilih File DOCX'}
          </label>
          <input ref={fileInputRef} id="docx-input" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: 'none' }} onChange={handleDocxUpload} disabled={isDocxLoading} />
        </div>

        {docxStatus && (
          <div className={`pdf-status ${docxStatus}`}>
            {docxStatus === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            <span>{docxMessage}</span>
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
                    <label>Semester <span className="required">*</span></label>
                    <select name="semester" className="glass-input" onChange={handleChange} value={formData.semester} required>
                      <option value="Ganjil dan Genap">Ganjil dan Genap</option>
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
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
                {isDocxLoading && (
                  <div className="pdf-reading-indicator">
                    <Loader2 className="spin" size={20}/>
                    <span>AI sedang membaca DOCX dan mengekstrak teks CP...</span>
                  </div>
                )}
                <div className="form-group">
                  <label>Deskripsi CP yang Dirujuk <span className="required">*</span></label>
                  <textarea required name="cpText" className="glass-input"
                    style={{ minHeight:'180px', resize:'vertical' }}
                    placeholder={isDocxLoading ? "Menunggu hasil baca DOCX..." : "Paste atau upload file DOCX untuk mengisi otomatis teks CP..."}
                    onChange={handleChange} value={formData.cpText}/>
                </div>
              </div>
            )}
          </div>

          <div className="info-box">
            <Sparkles size={16}/>
            <span>Tujuan Pembelajaran (TP), IKTP, dan Peta Alur (ATP) akan <strong>digenerate secara otomatis oleh AI</strong> berdasarkan teks CP yang dimasukkan.</span>
          </div>

          <button type="submit" className="glass-button" disabled={isLoading || isDocxLoading} style={{ marginTop:'1.5rem' }}>
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
