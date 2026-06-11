'use client';
import { useState, useRef } from 'react';
import { generateAndDownloadDocx } from '../lib/docxGenerator';
import { Sparkles, Download, Loader2, ChevronDown, ChevronUp, FileUp, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    subject: '', program: '', phase: '', grade: '',
    semester: '', year: '2025/2026', time: '',
    teacher: '', waka: '', principal: '',
    cpText: '',
  });

  // List elemen dinamis
  const [elemenList, setElemenList] = useState([
    { nama: '', capaian: '' },
  ]);

  const [openSection, setOpenSection]     = useState('identitas');
  const [isLoading, setIsLoading]         = useState(false);
  const [isPdfLoading, setIsPdfLoading]   = useState(false);
  const [pdfStatus, setPdfStatus]         = useState(null);
  const [pdfMessage, setPdfMessage]       = useState('');
  const [result, setResult]               = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const toggleSection = (id) => setOpenSection(openSection === id ? null : id);

  // ── Manajemen elemen dinamis ──
  const handleElemenChange = (index, field, value) => {
    const updated = elemenList.map((el, i) => i === index ? { ...el, [field]: value } : el);
    setElemenList(updated);
  };

  const addElemen = () => setElemenList([...elemenList, { nama: '', capaian: '' }]);

  const removeElemen = (index) => {
    if (elemenList.length <= 1) return;
    setElemenList(elemenList.filter((_, i) => i !== index));
  };

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

      // Auto-isi form
      setFormData(prev => ({
        ...prev,
        subject: data.mataPelajaran && !prev.subject ? data.mataPelajaran : prev.subject,
        phase:   data.fase          && !prev.phase   ? data.fase          : prev.phase,
        cpText:  data.cpText        || prev.cpText,
      }));

      // Auto-isi elemen jika ada
      if (data.elemenList && Array.isArray(data.elemenList) && data.elemenList.length > 0) {
        setElemenList(data.elemenList);
      } else if (data.elemen1) {
        const els = [{ nama: data.elemen1, capaian: data.capaian1 || '' }];
        if (data.elemen2) els.push({ nama: data.elemen2, capaian: data.capaian2 || '' });
        setElemenList(els);
      }

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
    if (!formData.cpText) return alert("Teks CP (Deskripsi CP) wajib diisi! Upload PDF atau isi manual.");

    setIsLoading(true); setResult(null);
    try {
      const payload = { ...formData, elemenList };
      const res = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
    generateAndDownloadDocx({ ...formData, elemenList }, result);
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
              <div className="pdf-upload-sub">Upload PDF dokumen CP resmi Kemdikbud — AI otomatis membaca & mengisi form.</div>
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
                    <label>Semester <span className="required">*</span></label>
                    <select name="semester" className="glass-input" onChange={handleChange} value={formData.semester} required>
                      <option value="">-- Pilih Semester --</option>
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tahun Pelajaran</label>
                    <input type="text" name="year" className="glass-input" value={formData.year} onChange={handleChange}/>
                  </div>
                  <div className="form-group">
                    <label>Alokasi Waktu <span className="required">*</span></label>
                    <input required type="text" name="time" className="glass-input" placeholder="Contoh: 4 JP × 36 minggu = 144 JP" onChange={handleChange} value={formData.time}/>
                  </div>
                  <div className="form-group">
                    <label>Guru Mata Pelajaran <span className="required">*</span></label>
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
              <span>B. Capaian Pembelajaran</span>
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

                {/* B.1 */}
                <div className="cp-section-label">B.1 — Capaian Pembelajaran Umum (dari Kepmendikbudristek)</div>
                <div className="form-group">
                  <label>Deskripsi CP Umum <span className="required">*</span></label>
                  <textarea required name="cpText" className="glass-input"
                    style={{ minHeight:'180px', resize:'vertical' }}
                    placeholder={isPdfLoading ? "Menunggu hasil baca PDF..." : "Paste atau upload PDF untuk mengisi otomatis teks CP umum dari Kepmendikbud..."}
                    onChange={handleChange} value={formData.cpText}/>
                </div>

                {/* B.2 */}
                <div className="cp-section-label" style={{ marginTop:'1.5rem' }}>B.2 — Capaian Pembelajaran Per Elemen</div>

                <div className="elemen-list">
                  {elemenList.map((el, index) => (
                    <div key={index} className="elemen-card">
                      <div className="elemen-card-header">
                        <span className="elemen-number">Elemen {index + 1}</span>
                        {elemenList.length > 1 && (
                          <button type="button" className="btn-remove-elemen" onClick={() => removeElemen(index)} title="Hapus elemen">
                            <Trash2 size={14}/>
                          </button>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Nama Elemen</label>
                        <input type="text" className="glass-input"
                          placeholder={`Contoh: Kreativitas, Inovasi, Proses Bisnis...`}
                          value={el.nama}
                          onChange={(e) => handleElemenChange(index, 'nama', e.target.value)}/>
                      </div>
                      <div className="form-group">
                        <label>Capaian Elemen</label>
                        <textarea className="glass-input" style={{ minHeight:'90px', resize:'vertical' }}
                          placeholder="Deskripsi capaian untuk elemen ini..."
                          value={el.capaian}
                          onChange={(e) => handleElemenChange(index, 'capaian', e.target.value)}/>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" className="btn-add-elemen" onClick={addElemen}>
                  <Plus size={16}/> Tambah Elemen
                </button>
              </div>
            )}
          </div>

          <div className="info-box">
            <Sparkles size={16}/>
            <span>Bagian <strong>C, D, E, F, G</strong> (Analisis, Profil Lulusan, Deep Learning, Strategi, Catatan) akan <strong>diisi otomatis oleh AI</strong> berdasarkan teks CP dan Program Keahlian.</span>
          </div>

          <button type="submit" className="glass-button" disabled={isLoading || isPdfLoading} style={{ marginTop:'1.5rem' }}>
            {isLoading ? <Loader2 className="animate-spin"/> : <Sparkles/>}
            {isLoading ? "AI sedang menganalisis CP..." : "Generate & Analisis dengan AI"}
          </button>
        </form>
      </div>

      {result && (
        <div id="result-section" className="glass-panel result-panel" style={{ animation:'fadeIn 0.5s' }}>
          <div className="result-icon">✅</div>
          <h2>Analisis AI Berhasil!</h2>
          <p style={{ color:'var(--text-muted)', marginBottom:'0.5rem' }}>
            Dokumen Format CP sudah siap — <strong>{elemenList.filter(e=>e.nama).length} elemen</strong> tercantum di tabel B.2.
          </p>
          <div className="result-preview">
            <div className="preview-item"><span>📋 Identitas Mata Pelajaran</span><span className="badge">Terisi</span></div>
            <div className="preview-item"><span>📚 B.1 CP Umum (paragraf bebas)</span><span className="badge">Terisi</span></div>
            <div className="preview-item"><span>📊 B.2 Tabel Per Elemen ({elemenList.filter(e=>e.nama).length} baris)</span><span className="badge">Terisi</span></div>
            <div className="preview-item"><span>🧠 Analisis & Kontekstualisasi (C)</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>🏅 8 Dimensi Profil Lulusan (D)</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>⚡ Implementasi Deep Learning (E)</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>🎯 Strategi Pembelajaran (F)</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>📝 Catatan Pengembangan (G)</span><span className="badge ai">AI</span></div>
          </div>
          <button id="download-btn" onClick={handleDownload} className="glass-button" style={{ marginTop:'1.5rem' }}>
            <Download/> Download Format CP Lengkap (.docx)
          </button>
        </div>
      )}
    </div>
  );
}
