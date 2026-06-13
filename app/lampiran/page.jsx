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
    metodePertemuan2: '',
    konteksLokal: 'Purbalingga',
    nilaiSekolah: 'Islami, Entrepreneur',
    jumlahAspekAnalisis: '7',
    topikPertemuan2: '',
    dimensiKeterkaitan: '',
    jumlahPasanganKeterkaitan: '3',
    iktp: '',
    iktpRemediasi: '',
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
    nilaiAmbangPengayaan: '85',
    topikPengayaan: '',
    jenisTugasPengayaan: '',
    batasWaktuPengayaan: '1 minggu',
    gayaBelajarRemediasi: 'visual + tekstual',
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

      // Log untuk debug: field apa saja yang berhasil diekstrak AI
      console.log('📄 Parse-modul response:', d ? Object.keys(d).filter(k => d[k] && d[k] !== '').length + ' field terisi' : 'KOSONG');
      if (d?._debug) console.log('📊 Per-bagian:', d._debug);
      if (d) Object.entries(d).forEach(([k, v]) => { if (v && typeof v === 'string' && v.trim()) console.log(`  ✅ ${k}: "${v.slice(0, 60)}"`); });

      // Merge: data AI mengisi field yang KOSONG atau masih default bawaan
      // Logic: AI punya nilai → pake AI. Sisanya pertahankan form (default/input guru).
      const { _source, _debug, ...cleanData } = d || {};
      setFormData(prev => {
        const aiValue = (key) => {
          const v = cleanData[key];
          // Skip kalau AI gak ngembaliin apa-apa (undefined/null)
          if (v === undefined || v === null) return undefined;
          // Skip kalau AI cuma ngasih string kosong (artinya gak ketemu di dokumen)
          if (typeof v === 'string' && v.trim() === '') return undefined;
          // Skip kalau AI ngasih objek (bukan tipe field biasa)
          if (typeof v === 'object') return undefined;
          return v;
        };
        return {
          ...prev,
          namaSekolah:                aiValue('namaSekolah') ?? prev.namaSekolah,
          taglineSekolah:             aiValue('taglineSekolah') ?? prev.taglineSekolah,
          mataPelajaran:              aiValue('mataPelajaran') ?? prev.mataPelajaran,
          judulModul:                 aiValue('judulModul') ?? prev.judulModul,
          kodeModul:                  aiValue('kodeModul') ?? prev.kodeModul,
          faseKelas:                  aiValue('faseKelas') ?? prev.faseKelas,
          semester:                   aiValue('semester') ?? prev.semester,
          tahunPelajaran:             aiValue('tahunPelajaran') ?? prev.tahunPelajaran,
          kurikulum:                  aiValue('kurikulum') ?? prev.kurikulum,
          pendekatanPembelajaran:     aiValue('pendekatanPembelajaran') ?? prev.pendekatanPembelajaran,
          daftarLampiranYangDiminta:  aiValue('daftarLampiranYangDiminta') ?? prev.daftarLampiranYangDiminta,
          tujuanPembelajaran:         aiValue('tujuanPembelajaran') ?? prev.tujuanPembelajaran,
          topikPertemuan1:            aiValue('topikPertemuan1') ?? prev.topikPertemuan1,
          metodePertemuan1:           aiValue('metodePertemuan1') ?? prev.metodePertemuan1,
          metodePertemuan2:           aiValue('metodePertemuan2') ?? prev.metodePertemuan2,
          konteksLokal:               aiValue('konteksLokal') ?? prev.konteksLokal,
          nilaiSekolah:               aiValue('nilaiSekolah') ?? prev.nilaiSekolah,
          jumlahAspekAnalisis:        aiValue('jumlahAspekAnalisis') ?? prev.jumlahAspekAnalisis,
          topikPertemuan2:            aiValue('topikPertemuan2') ?? prev.topikPertemuan2,
          dimensiKeterkaitan:         aiValue('dimensiKeterkaitan') ?? prev.dimensiKeterkaitan,
          jumlahPasanganKeterkaitan:  aiValue('jumlahPasanganKeterkaitan') ?? prev.jumlahPasanganKeterkaitan,
          iktp:                       aiValue('iktp') ?? prev.iktp,
          iktpRemediasi:              aiValue('iktpRemediasi') ?? prev.iktpRemediasi,
          jumlahPertanyaanLisan:      aiValue('jumlahPertanyaanLisan') ?? prev.jumlahPertanyaanLisan,
          jumlahSoalKuis:             aiValue('jumlahSoalKuis') ?? prev.jumlahSoalKuis,
          jenisProdukSumatif:         aiValue('jenisProdukSumatif') ?? prev.jenisProdukSumatif,
          aspekPenilaianSumatif:      aiValue('aspekPenilaianSumatif') ?? prev.aspekPenilaianSumatif,
          bobotAspek:                 aiValue('bobotAspek') ?? prev.bobotAspek,
          kktp:                       aiValue('kktp') ?? prev.kktp,
          jumlahSiswa:                aiValue('jumlahSiswa') ?? prev.jumlahSiswa,
          jumlahSlide:                aiValue('jumlahSlide') ?? prev.jumlahSlide,
          jumlahReferensi:            aiValue('jumlahReferensi') ?? prev.jumlahReferensi,
          teknikRefleksi:             aiValue('teknikRefleksi') ?? prev.teknikRefleksi,
          jumlahPertemuan:            aiValue('jumlahPertemuan') ?? prev.jumlahPertemuan,
          kutipanPenutup:             aiValue('kutipanPenutup') ?? prev.kutipanPenutup,
          nilaiAmbangPengayaan:       aiValue('nilaiAmbangPengayaan') ?? prev.nilaiAmbangPengayaan,
          topikPengayaan:             aiValue('topikPengayaan') ?? prev.topikPengayaan,
          jenisTugasPengayaan:        aiValue('jenisTugasPengayaan') ?? prev.jenisTugasPengayaan,
          batasWaktuPengayaan:        aiValue('batasWaktuPengayaan') ?? prev.batasWaktuPengayaan,
          gayaBelajarRemediasi:       aiValue('gayaBelajarRemediasi') ?? prev.gayaBelajarRemediasi,
        };
      });

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

  // Helper: safely parse JSON from response, handles HTML error pages
  const safeParseJson = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      if (text.includes('FUNCTION_INVOCATION_TIMEOUT') || text.includes('504') || text.includes('timeout')) {
        throw new Error('Server timeout — AI membutuhkan waktu terlalu lama.');
      }
      throw new Error('Server mengembalikan respons tidak valid.');
    }
  };

  const allKeys = [
    'headerDanDaftar', 'lkpd01a', 'lkpd01b', 'asesmenFormatif',
    'asesmenSumatif', 'rekapKelas', 'mediaPembelajaran',
    'lembarRefleksi', 'bahanPengayaan', 'bahanRemediasi'
  ];

  // Eksekusi per 1 item agar tidak kena Vercel 60s timeout
  const generateItem = async (key) => {
    try {
      const res = await fetch('/api/generate-lampiran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, keysToGenerate: [key] })
      });
      const data = await safeParseJson(res);
      if (!res.ok) throw new Error(data.error || 'Gagal generate');
      
      // Update state incrementally
      setResult(prev => ({ ...prev, [key]: data[key] }));
      return data[key];
    } catch (err) {
      setResult(prev => ({ ...prev, [key]: { error: err.message } }));
      return { error: err.message };
    }
  };

  // Eksekusi antrean dalam batch untuk menjaga concurrency maksimal 3
  const processQueue = async (keysToProcess) => {
    const concurrencyLimit = 3;
    for (let i = 0; i < keysToProcess.length; i += concurrencyLimit) {
      const batch = keysToProcess.slice(i, i + concurrencyLimit);
      await Promise.allSettled(batch.map(key => generateItem(key)));
    }
  };

  // ── Generate semua lampiran ──
  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Inisialisasi semua key dengan state loading (null)
    const initialResult = {};
    allKeys.forEach(k => initialResult[k] = null);
    setResult(initialResult);
    setErrorMsg('');

    setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 300);

    try {
      // Jalankan dengan batch maksimal 3 bersamaan agar tidak kena Rate Limit (429) massal
      await processQueue(allKeys);
    } catch (error) {
      setErrorMsg(`Terjadi kesalahan sistem: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryFailed = async () => {
    if (!result) return;
    const failedKeys = Object.keys(result).filter(k => !result[k] || result[k].error);
    if (failedKeys.length === 0) return;
    
    setIsLoading(true);
    setErrorMsg('');
    try {
      // Reset state yang gagal menjadi loading (null)
      setResult(prev => {
        const nextState = { ...prev };
        failedKeys.forEach(k => nextState[k] = null);
        return nextState;
      });
      
      // Retry antrean yang gagal dengan batasan concurrency 3
      await processQueue(failedKeys);
    } catch (error) {
      setErrorMsg(`Terjadi kesalahan saat retry: ${error.message}`);
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
                    <label>Metode / Aktivitas Pertemuan 2</label>
                    <input type="text" name="metodePertemuan2" className="glass-input" placeholder="Contoh: Diskusi, Presentasi" onChange={handleChange} value={formData.metodePertemuan2}/>
                  </div>
                  <div className="form-group">
                    <label>Jumlah Aspek Analisis LKPD 1</label>
                    <input type="number" name="jumlahAspekAnalisis" className="glass-input" min="3" max="10" onChange={handleChange} value={formData.jumlahAspekAnalisis}/>
                  </div>
                  <div className="form-group">
                    <label>Topik Pertemuan 2</label>
                    <input type="text" name="topikPertemuan2" className="glass-input" placeholder="Contoh: Teori & Praktik Industri, Keterkaitan Alam-Sosial" onChange={handleChange} value={formData.topikPertemuan2}/>
                  </div>
                  <div className="form-group">
                    <label>Dimensi Keterkaitan (Pertemuan 2)</label>
                    <input type="text" name="dimensiKeterkaitan" className="glass-input" placeholder="Contoh: teori & praktik, peluang & risiko, alam & sosial" onChange={handleChange} value={formData.dimensiKeterkaitan}/>
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
                    <label>Nilai Ambang Pengayaan</label>
                    <input type="number" name="nilaiAmbangPengayaan" className="glass-input" min="0" max="100" onChange={handleChange} value={formData.nilaiAmbangPengayaan}/>
                  </div>
                  <div className="form-group">
                    <label>Topik Pengayaan</label>
                    <input type="text" name="topikPengayaan" className="glass-input" placeholder="Contoh: dampak perubahan iklim global → ekosistem lokal" onChange={handleChange} value={formData.topikPengayaan}/>
                  </div>
                  <div className="form-group">
                    <label>Jenis Tugas Pengayaan</label>
                    <input type="text" name="jenisTugasPengayaan" className="glass-input" placeholder="Contoh: mini-infografis, esai ilmiah" onChange={handleChange} value={formData.jenisTugasPengayaan}/>
                  </div>
                  <div className="form-group">
                    <label>Batas Waktu Pengayaan</label>
                    <input type="text" name="batasWaktuPengayaan" className="glass-input" placeholder="Contoh: 1 minggu" onChange={handleChange} value={formData.batasWaktuPengayaan}/>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>IKTP yang Jadi Fokus Remediasi</label>
                    <textarea name="iktpRemediasi" className="glass-input" style={{ minHeight: '70px' }} placeholder="Indikator ketercapaian yang belum tercapai oleh siswa remediasi" onChange={handleChange} value={formData.iktpRemediasi}/>
                  </div>
                  <div className="form-group">
                    <label>Gaya Belajar Remediasi</label>
                    <input type="text" name="gayaBelajarRemediasi" className="glass-input" placeholder="Contoh: visual + tekstual" onChange={handleChange} value={formData.gayaBelajarRemediasi}/>
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
              ? <><Loader2 className="spin" size={22} /> AI sedang memproses lampiran…</>
              : <><Sparkles size={22} /> Generate Semua Lampiran Sekaligus</>
            }
          </button>
        </form>
      </div>

      {/* ── HASIL GENERATE ── */}
      {result && (() => {
        const hasError = Object.keys(result).some(key => result[key] && result[key].error);
        const isDone = Object.keys(result).every(key => result[key] !== null);
        
        return (
        <div id="result-section" className="glass-panel result-panel">
          {/* Header sukses / error / loading */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            {!isDone ? (
              <Loader2 className="spin" size={32} style={{ color: '#63b3ed', flexShrink: 0 }} />
            ) : hasError ? (
              <XCircle size={32} style={{ color: '#fc814a', flexShrink: 0 }} />
            ) : (
              <CheckCircle size={32} style={{ color: '#68d391', flexShrink: 0 }} />
            )}
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>
                {!isDone 
                  ? 'Sedang Memproses Dokumen AI...' 
                  : hasError 
                    ? 'Beberapa Lampiran Gagal Di-generate!' 
                    : 'Semua Lampiran Berhasil Di-generate!'}
              </h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                {!isDone 
                  ? 'Mohon tunggu, setiap kotak akan berubah hijau jika selesai diproses.'
                  : hasError 
                    ? 'Silakan klik "Coba Ulang yang Gagal" sebelum dapat mengunduh.'
                    : `${Object.keys(result).length} bagian lampiran siap diunduh sebagai file Word`
                }
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
            ].map(({ key, label }) => {
              const statusData = result[key];
              const status = statusData === null ? 'loading' : (statusData.error ? 'error' : 'success');
              
              return (
              <div key={key} title={status === 'error' ? statusData.error : ''} style={{
                padding: '8px 12px', borderRadius: '8px',
                background: status === 'loading' ? 'rgba(99,179,237,0.1)' 
                          : status === 'success' ? 'rgba(104,211,145,0.15)' 
                          : 'rgba(252,129,74,0.15)',
                border: `1px solid ${ status === 'loading' ? 'rgba(99,179,237,0.3)' 
                                   : status === 'success' ? 'rgba(104,211,145,0.4)' 
                                   : 'rgba(252,129,74,0.4)' }`,
                fontSize: '0.8rem', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <span style={{ 
                  color: status === 'loading' ? '#63b3ed' 
                       : status === 'success' ? '#68d391' : '#fc814a',
                  display: 'flex', alignItems: 'center'
                }}>
                  {status === 'loading' ? <Loader2 size={14} className="spin" /> 
                   : status === 'success' ? '✓' : '✗'}
                </span>
                {label}
                {status === 'error' && (
                  <span style={{ fontSize: '0.65rem', color: '#fc814a', marginLeft: '4px', fontStyle: 'italic', maxWidth: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    (Error)
                  </span>
                )}
              </div>
            )})}
          </div>

          {/* Tombol Retry (jika ada error) */}
          {hasError && (
            <button
              type="button"
              onClick={handleRetryFailed}
              disabled={isLoading}
              className="btn"
              style={{ width: '100%', height: '56px', fontSize: '16px', gap: '10px', marginBottom: '1rem', background: 'rgba(252,129,74,0.15)', border: '1px solid rgba(252,129,74,0.5)', color: '#fc814a', fontWeight: 'bold' }}
            >
              {isLoading
                ? <><Loader2 className="spin" size={20}/> Mencoba ulang bagian yang gagal…</>
                : <><Sparkles size={20}/> Coba Ulang yang Gagal</>
              }
            </button>
          )}

          {/* Tombol Download */}
          <button
            onClick={handleDownload}
            disabled={isDownloading || hasError}
            className="btn btn-primary"
            style={{ width: '100%', height: '56px', fontSize: '17px', gap: '10px', marginBottom: '1rem', opacity: hasError ? 0.5 : 1, cursor: hasError ? 'not-allowed' : 'pointer' }}
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
        );
      })()}
    </div>
  );
}
