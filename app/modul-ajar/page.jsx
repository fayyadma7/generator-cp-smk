'use client';
import { useState, useRef } from 'react';
import { generateAndDownloadModulDocx } from '../../lib/docxGeneratorModul';
import { Sparkles, Download, Loader2, ChevronDown, ChevronUp, FileUp, CheckCircle, XCircle } from 'lucide-react';

const STEP_LABELS = [
  { step: 1, icon: '📋', label: 'Identitas & Kerangka Kurikulum' },
  { step: 2, icon: '🧠', label: 'Rancangan Deep Learning' },
  { step: 3, icon: '📝', label: 'Skenario Pembelajaran' },
  { step: 4, icon: '🎯', label: 'Asesmen, Materi & Rubrik' },
];

export default function ModulAjarGenerator() {
  const [formData, setFormData] = useState({
    subject: '', program: '', phase: '', grade: '',
    semester: 'Ganjil', year: '2025/2026',
    teacher: '', cpText: '', targetTp: '', elemenCP: '', targetTpText: ''
  });

  const [tpTextRaw, setTpTextRaw]         = useState('');
  const [openSection, setOpenSection]     = useState('identitas');
  const [isLoading, setIsLoading]         = useState(false);
  const [isDocxLoading, setIsDocxLoading] = useState(false);
  const [docxStatus, setDocxStatus]       = useState(null);
  const [docxMessage, setDocxMessage]     = useState('');
  const [result, setResult]               = useState(null);
  const [currentStep, setCurrentStep]     = useState(0);      // 0 = belum mulai, 1-4 = step aktif
  const [completedSteps, setCompletedSteps] = useState([]);   // array step yang sudah selesai
  const [stepError, setStepError]         = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const toggleSection = (id) => setOpenSection(openSection === id ? null : id);

  // ── Upload & Parse DOCX (TP & ATP) ──
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
      if (!res.ok) throw new Error(data.error || 'Gagal membaca DOCX');

      setTpTextRaw(data.rawText || data.cpText || '');

      setFormData(prev => ({
        ...prev,
        subject: data.mataPelajaran && !prev.subject ? data.mataPelajaran : prev.subject,
        phase:   data.fase          && !prev.phase   ? data.fase          : prev.phase,
        cpText:  data.cpText        ? 'Teks CP berhasil diekstrak...' : prev.cpText,
      }));

      setDocxStatus('success');
      setDocxMessage(`✅ Format TP & ATP "${file.name}" berhasil dibaca! Identitas telah terisi otomatis.`);
    } catch (error) {
      setDocxStatus('error'); setDocxMessage(`Gagal memproses DOCX: ${error.message}`);
    } finally {
      setIsDocxLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Helper: delay ──
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // ── Generate AI — MIPIL (Step by Step) ──
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!tpTextRaw) return alert('Silakan upload dokumen TP & ATP terlebih dahulu!');
    if (!formData.targetTp) return alert('Nomor/Target Tujuan Pembelajaran (TP) wajib diisi!');

    setIsLoading(true);
    setResult(null);
    setCurrentStep(0);
    setCompletedSteps([]);
    setStepError(null);

    const payload = { ...formData, tpText: tpTextRaw };
    const assembled = {};

    for (let step = 1; step <= 4; step++) {
      setCurrentStep(step);
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount <= maxRetries) {
        try {
          const res = await fetch('/api/generate-modul', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, step })
          });

          const data = await res.json();

          if (res.status === 429) {
            // Rate limit — tunggu dan coba lagi
            const waitSec = 20 + retryCount * 10;
            setStepError(`⏳ Batas API tercapai di Bagian ${step}. Menunggu ${waitSec} detik dan akan otomatis lanjut...`);
            await delay(waitSec * 1000);
            setStepError(null);
            retryCount++;
            continue;
          }

          if (!res.ok) {
            throw new Error(data.error || `Gagal di step ${step}`);
          }

          // Merge hasil ke assembled object
          Object.assign(assembled, data.result);
          setCompletedSteps(prev => [...prev, step]);
          retryCount = maxRetries + 1; // break retry loop
          
          // Jeda kecil antar step agar tidak kena rate limit
          if (step < 4) await delay(3000);

        } catch (err) {
          if (retryCount >= maxRetries) {
            setIsLoading(false);
            setStepError(`❌ Gagal pada Bagian ${step} setelah ${maxRetries} percobaan: ${err.message}`);
            return;
          }
          retryCount++;
          await delay(5000);
        }
      }
    }

    setResult(assembled);
    setIsLoading(false);
    setCurrentStep(0);
    setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const handleDownload = () => {
    if (!result) return;
    generateAndDownloadModulDocx(formData, result);
  };

  return (
    <div className="container">
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h1>Generator Modul Ajar</h1>
        <p className="subtitle">SMK Muhammadiyah 3 Purbalingga — Kurikulum Merdeka | Pendekatan Deep Learning</p>

        {/* ── DOCX UPLOAD BANNER ── */}
        <div className="pdf-upload-banner">
          <div className="pdf-upload-left">
            <div className="pdf-icon-wrap">
              {isDocxLoading ? <Loader2 className="spin" size={28} /> : <FileUp size={28} />}
            </div>
            <div>
              <div className="pdf-upload-title">Upload Dokumen TP &amp; ATP (.docx)</div>
              <div className="pdf-upload-sub">Upload dokumen Format TP &amp; ATP yang sudah digenerate dari website ini sebagai acuan Modul Ajar.</div>
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

          {/* ── A. IDENTITAS UMUM ── */}
          <div className="accordion">
            <button type="button" className="accordion-header" onClick={() => toggleSection('identitas')}>
              <span>A. Identitas Dasar</span>
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
                    <label>Semester</label>
                    <select name="semester" className="glass-input" onChange={handleChange} value={formData.semester} required>
                      <option value="">-- Pilih Semester --</option>
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Guru Penyusun <span className="required">*</span></label>
                    <input required type="text" name="teacher" className="glass-input" placeholder="Nama Lengkap & NIP/NUPTK" onChange={handleChange} value={formData.teacher}/>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── B. FOKUS MODUL (TARGET TP) ── */}
          <div className="accordion">
            <button type="button" className="accordion-header" onClick={() => toggleSection('cp')}>
              <span>B. Fokus Modul Ajar</span>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                {formData.targetTp && <span className="badge-filled">Terisi ✓</span>}
                {openSection === 'cp' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
              </div>
            </button>
            {openSection === 'cp' && (
              <div className="accordion-body">
                <div className="form-group">
                  <label>Pilih/Ketik TP yang akan dibuatkan Modul Ajar <span className="required">*</span></label>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    Tulis secara spesifik TP yang ingin difokuskan (misalnya: &quot;TP-01: Menerapkan K3LH&quot;). AI akan mengekstrak detailnya dari file yang Anda upload.
                  </p>
                  <input required type="text" name="targetTp" className="glass-input"
                    placeholder="Contoh: TP-01 s.d. TP-02 (Merakit Komputer)" onChange={handleChange} value={formData.targetTp}/>
                </div>

                <div className="form-group">
                  <label>Elemen CP (Opsional)</label>
                  <input type="text" name="elemenCP" className="glass-input" placeholder="Misal: Sistem Komputer" onChange={handleChange} value={formData.elemenCP}/>
                </div>

                <div className="form-group">
                  <label>Teks Tujuan Pembelajaran Lengkap (Opsional)</label>
                  <textarea name="targetTpText" className="glass-input" rows="2"
                    placeholder="Jika diperlukan, salin bunyi lengkap Tujuan Pembelajaran di sini..."
                    onChange={handleChange} value={formData.targetTpText}/>
                </div>
              </div>
            )}
          </div>

          <div className="info-box">
            <Sparkles size={16}/>
            <span>AI akan menyusun modul secara <strong>bertahap (4 bagian)</strong> — Identitas, Deep Learning, Skenario, Asesmen &amp; Rubrik — untuk hasil terbaik dan menghindari batas API.</span>
          </div>

          <button type="submit" className="glass-button" disabled={isLoading || isDocxLoading} style={{ marginTop:'1.5rem' }}>
            {isLoading ? <Loader2 className="animate-spin"/> : <Sparkles/>}
            {isLoading ? `Menyusun Bagian ${currentStep}/4...` : 'Generate Modul Ajar'}
          </button>
        </form>

        {/* ── PROGRESS STEPS ── */}
        {isLoading && (
          <div className="step-progress" style={{ marginTop: '1.5rem' }}>
            {STEP_LABELS.map(({ step, icon, label }) => {
              const isDone    = completedSteps.includes(step);
              const isActive  = currentStep === step;
              return (
                <div key={step} className={`step-item ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                  <div className="step-icon">
                    {isDone ? '✅' : isActive ? <Loader2 size={18} className="animate-spin"/> : icon}
                  </div>
                  <div className="step-label">
                    <span className="step-num">Bagian {step}/4</span>
                    <span className="step-name">{label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ERROR / RETRY MESSAGE ── */}
        {stepError && (
          <div className="pdf-status error" style={{ marginTop: '1rem' }}>
            <span>{stepError}</span>
          </div>
        )}
      </div>

      {result && (
        <div id="result-section" className="glass-panel result-panel" style={{ animation:'fadeIn 0.5s' }}>
          <div className="result-icon">✅</div>
          <h2>Modul Ajar Berhasil Disusun!</h2>
          <p style={{ color:'var(--text-muted)', marginBottom:'0.5rem' }}>
            Dokumen Modul Ajar sudah siap — difokuskan pada: <strong>{formData.targetTp}</strong>.
          </p>
          <div className="result-preview">
            <div className="preview-item"><span>📋 Identitas &amp; Kerangka Kurikulum</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>🧠 Rancangan Deep Learning (MMJ)</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>📝 Skenario Pembelajaran ({result.skenario_pembelajaran?.pertemuan?.length || 0} Pertemuan)</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>🎯 Rancangan Asesmen (Diag, Form, Sum)</span><span className="badge ai">AI</span></div>
            <div className="preview-item"><span>📊 Rubrik Penilaian Holistik</span><span className="badge ai">AI</span></div>
          </div>
          <button id="download-btn" onClick={handleDownload} className="glass-button" style={{ marginTop:'1.5rem' }}>
            <Download/> Download Modul Ajar Lengkap (.docx)
          </button>
        </div>
      )}
    </div>
  );
}
