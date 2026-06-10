'use client';
import { useState } from 'react';
import { generateAndDownloadDocx } from '../lib/docxGenerator';
import { Sparkles, Download, Loader2 } from 'lucide-react';

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
    cpText: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.cpText) return alert("Teks CP wajib diisi!");
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error("Gagal generate dari AI");
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses data dengan AI.");
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
        <h1>Auto-Generate Format CP</h1>
        <p className="subtitle">SMK Muhammadiyah 3 Purbalingga - Pendekatan Deep Learning</p>
        
        <form onSubmit={handleGenerate}>
          <div className="grid-2">
            <div className="form-group">
              <label>Nama Mata Pelajaran</label>
              <input required type="text" name="subject" className="glass-input" placeholder="Contoh: Informatika" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Program Keahlian</label>
              <input required type="text" name="program" className="glass-input" placeholder="Contoh: Teknik Komputer Jaringan" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Fase</label>
              <input required type="text" name="phase" className="glass-input" placeholder="Contoh: E" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Kelas</label>
              <input required type="text" name="grade" className="glass-input" placeholder="Contoh: X" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Semester</label>
              <input required type="text" name="semester" className="glass-input" placeholder="Contoh: Ganjil" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tahun Pelajaran</label>
              <input required type="text" name="year" className="glass-input" value={formData.year} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Alokasi Waktu</label>
              <input required type="text" name="time" className="glass-input" placeholder="Contoh: 4 JP x 36 minggu" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Guru Mata Pelajaran</label>
              <input required type="text" name="teacher" className="glass-input" placeholder="Nama Guru" onChange={handleChange} />
            </div>
          </div>
          
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Teks Capaian Pembelajaran (Copy-Paste dari Dokumen Resmi)</label>
            <textarea 
              required
              name="cpText" 
              className="glass-input" 
              style={{ minHeight: '150px', resize: 'vertical' }}
              placeholder="Paste teks CP di sini..."
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="glass-button" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {isLoading ? "Sedang Menganalisis dengan AI..." : "Generate Analisis CP"}
          </button>
        </form>
      </div>

      {result && (
        <div className="glass-panel" style={{ animation: 'fadeIn 0.5s' }}>
          <h2>✨ Hasil Analisis AI Berhasil Dibuat!</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            AI telah merumuskan analisis kontekstual, dimensi profil pelajar pancasila, dan strategi deep learning untuk dokumen Anda.
          </p>
          
          <button onClick={handleDownload} className="glass-button secondary">
            <Download />
            Download Format DOCX
          </button>
        </div>
      )}
    </div>
  );
}
