'use client';
import { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';

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
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const toggleSection = (id) => setOpenSection(openSection === id ? null : id);

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
        throw new Error(err.error || "Gagal generate dari AI");
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
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h1>Generator Lampiran Modul Ajar</h1>
        <p className="subtitle">Hasilkan berbagai dokumen lampiran secara otomatis dengan AI</p>

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
                    <label>Mata Pelajaran</label>
                    <input required type="text" name="mataPelajaran" className="glass-input" onChange={handleChange} value={formData.mataPelajaran}/>
                  </div>
                  <div className="form-group">
                    <label>Judul Modul</label>
                    <input required type="text" name="judulModul" className="glass-input" onChange={handleChange} value={formData.judulModul}/>
                  </div>
                  <div className="form-group">
                    <label>Kode Modul</label>
                    <input type="text" name="kodeModul" className="glass-input" onChange={handleChange} value={formData.kodeModul}/>
                  </div>
                  <div className="form-group">
                    <label>Fase / Kelas</label>
                    <input required type="text" name="faseKelas" className="glass-input" onChange={handleChange} value={formData.faseKelas}/>
                  </div>
                  <div className="form-group">
                    <label>Konteks Lokal & Nilai Sekolah</label>
                    <input type="text" name="konteksLokal" className="glass-input" placeholder="Contoh: Purbalingga, Nilai Islami" onChange={handleChange} value={formData.konteksLokal}/>
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
                  <textarea required name="tujuanPembelajaran" className="glass-input" style={{ minHeight: '80px' }} onChange={handleChange} value={formData.tujuanPembelajaran}></textarea>
                </div>
                <div className="form-group">
                  <label>Indikator Ketercapaian TP (IKTP) <span className="required">*</span></label>
                  <textarea required name="iktp" className="glass-input" style={{ minHeight: '100px' }} placeholder="1. ...&#10;2. ..." onChange={handleChange} value={formData.iktp}></textarea>
                </div>
                <div className="form-group">
                  <label>Daftar Lampiran yang Diminta</label>
                  <input required type="text" name="daftarLampiranYangDiminta" className="glass-input" onChange={handleChange} value={formData.daftarLampiranYangDiminta}/>
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
                    <input type="text" name="topikPertemuan1" className="glass-input" onChange={handleChange} value={formData.topikPertemuan1}/>
                  </div>
                  <div className="form-group">
                    <label>Metode Pertemuan 1</label>
                    <input type="text" name="metodePertemuan1" className="glass-input" placeholder="Gallery Walk, dsb" onChange={handleChange} value={formData.metodePertemuan1}/>
                  </div>
                  <div className="form-group">
                    <label>Topik Pertemuan 2</label>
                    <input type="text" name="topikPertemuan2" className="glass-input" onChange={handleChange} value={formData.topikPertemuan2}/>
                  </div>
                  <div className="form-group">
                    <label>Dimensi Keterkaitan (Pertemuan 2)</label>
                    <input type="text" name="dimensiKeterkaitan" className="glass-input" onChange={handleChange} value={formData.dimensiKeterkaitan}/>
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
                    <label>Jenis Produk Sumatif</label>
                    <input type="text" name="jenisProdukSumatif" className="glass-input" onChange={handleChange} value={formData.jenisProdukSumatif}/>
                  </div>
                  <div className="form-group">
                    <label>Aspek Penilaian Sumatif</label>
                    <input type="text" name="aspekPenilaianSumatif" className="glass-input" onChange={handleChange} value={formData.aspekPenilaianSumatif}/>
                  </div>
                  <div className="form-group">
                    <label>Bobot Aspek</label>
                    <input type="text" name="bobotAspek" className="glass-input" onChange={handleChange} value={formData.bobotAspek}/>
                  </div>
                  <div className="form-group">
                    <label>Nilai KKTP</label>
                    <input type="number" name="kktp" className="glass-input" onChange={handleChange} value={formData.kktp}/>
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
          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: '2rem', width: '100%', height: '54px', fontSize: '18px' }}>
            {isLoading ? <Loader2 className="spin" size={24} /> : <><Sparkles size={24} /> Generate Semua Lampiran Sekaligus</>}
          </button>
        </form>
      </div>

      {/* ── HASIL GENERATE ── */}
      {result && (
        <div id="result-section" className="glass-panel result-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Hasil Generate Lampiran</h2>
          </div>
          <p className="subtitle" style={{ marginBottom: '20px' }}>
            Fitur ekspor ke DOCX sedang dalam pengembangan. Berikut adalah data JSON mentah yang dihasilkan AI:
          </p>
          <pre style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '14px', color: '#fff' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
