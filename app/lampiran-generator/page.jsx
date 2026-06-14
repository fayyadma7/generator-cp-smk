'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { SECTION_META, DEFAULT_DATA, SECTION_COMPONENTS } from './section-forms';
import { DocPreviewWrap, renderSectionPreview } from './preview-utils';
import { ChevronLeft, ChevronRight, Eye, Download, X, Check, Lock } from 'lucide-react';

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */

export default function LampiranGeneratorPage() {
  /* ── State ── */
  const [header, setHeader] = useState({
    namaSekolah: '',
    mataPelajaran: '',
    kodeModul: '',
    judulModul: '',
    nomorTP: '',
    faseKelas: '',
    semester: 'Ganjil',
    tahunPelajaran: '',
    namaGuru: '',
  });

  const [sections, setSections] = useState(() => {
    const map = {};
    SECTION_META.forEach(s => {
      map[s.key] = { enabled: true, data: { ...DEFAULT_DATA[s.key] } };
    });
    // Some off by default
    map.rubrik.enabled = false;
    map.pengayaan.enabled = false;
    map.remediasi.enabled = false;
    return map;
  });

  const [activeKey, setActiveKey] = useState('lkpd');
  const [modalOpen, setModalOpen] = useState(false);

  /* ── Derived ── */
  const headerData = header;

  // Completion count
  const completionCount = useMemo(() => {
    let count = 0;
    SECTION_META.forEach(sec => {
      const s = sections[sec.key];
      if (!s || !s.enabled) return;
      const d = s.data;
      const keys = Object.keys(d);
      const hasData = keys.some(k => {
        const v = d[k];
        if (Array.isArray(v)) return v.length > 0 && v.some(item => {
          if (typeof item === 'string') return item.trim() !== '';
          if (typeof item === 'object') return Object.values(item).some(x => x && String(x).trim() !== '');
          return false;
        });
        if (typeof v === 'string') return v.trim() !== '';
        return v !== null && v !== undefined;
      });
      if (hasData) count++;
    });
    return count;
  }, [sections]);

  /* ── Handlers ── */
  const updateHeader = useCallback((field, value) => {
    setHeader(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateSectionData = useCallback((sectionKey, newData) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], data: { ...newData } }
    }));
  }, []);

  const toggleSectionEnabled = useCallback((sectionKey) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], enabled: !prev[sectionKey].enabled }
    }));
  }, []);

  const navigateTo = useCallback((key) => {
    setActiveKey(key);
  }, []);

  /* ── Active section data ── */
  const activeSection = sections[activeKey];
  const activeMeta = SECTION_META.find(s => s.key === activeKey);
  const activeData = activeSection?.data || DEFAULT_DATA[activeKey];

  /* ── Preview content for active section ── */
  const activePreviewContent = useMemo(() => {
    if (!activeSection?.enabled) return null;
    return renderSectionPreview(headerData, activeKey, activeData);
  }, [headerData, activeKey, activeData, activeSection?.enabled]);

  /* ── Modal full document ── */
  const modalContent = useMemo(() => {
    const enabledKeys = SECTION_META.filter(s => sections[s.key]?.enabled).map(s => s.key);
    if (enabledKeys.length === 0) {
      return <p style={{ textAlign: 'center', padding: 60, color: '#AEB6BF' }}>Tidak ada section yang aktif.</p>;
    }
    return (
      <DocPreviewWrap header={headerData}>
        {enabledKeys.map((key, idx) => {
          const sec = sections[key];
          const preview = renderSectionPreview(headerData, key, sec?.data);
          if (!preview) return null;
          return (
            <div key={key} data-anchor={key}>
              {preview}
              {idx < enabledKeys.length - 1 && <div className="page-divider">— Page Break —</div>}
            </div>
          );
        })}
      </DocPreviewWrap>
    );
  }, [headerData, sections]);

  const toggleModal = useCallback(() => {
    setModalOpen(prev => !prev);
  }, []);

  /* ── Render ── */
  return (
    <div className="lgn-container">
      {/* HEADER / TOP BAR */}
      <header className="lgn-topbar">
        <div className="lgn-topbar-left">
          <span className="lgn-logo">📋 Lampiran Generator</span>
          <span className="lgn-docname">{headerData.judulModul?.trim() || 'Untitled Document'}</span>
        </div>
        <div className="lgn-topbar-right">
          <span className="lgn-badge">{completionCount}/{SECTION_META.length} Lampiran</span>
          <button className="btn btn-secondary btn-sm" onClick={toggleModal}>
            <Eye size={15} /> Preview Semua
          </button>
          <button className="btn btn-primary btn-sm" disabled title="Fitur export akan segera tersedia">
            <Download size={15} /> Export DOCX
          </button>
        </div>
      </header>

      <div className="lgn-main">
        {/* ── SIDEBAR ── */}
        <aside className="lgn-sidebar">
          {/* Header Form */}
          <div className="lgn-hform">
            <div className="lgn-hf-group lgn-hf-full">
              <label>Nama Sekolah</label>
              <input className="lgn-hf-input" value={header.namaSekolah} onChange={e => updateHeader('namaSekolah', e.target.value)} placeholder="SMK Muhammadiyah 3 Purbalingga" />
            </div>
            <div className="lgn-hf-duo">
              <div className="lgn-hf-group">
                <label>Mata Pelajaran</label>
                <input className="lgn-hf-input" value={header.mataPelajaran} onChange={e => updateHeader('mataPelajaran', e.target.value)} placeholder="Projek IPAS" />
              </div>
              <div className="lgn-hf-group">
                <label>Kode Modul</label>
                <input className="lgn-hf-input" value={header.kodeModul} onChange={e => updateHeader('kodeModul', e.target.value)} placeholder="MA-IPAS-01" />
              </div>
            </div>
            <div className="lgn-hf-duo">
              <div className="lgn-hf-group">
                <label>Judul Modul</label>
                <input className="lgn-hf-input" value={header.judulModul} onChange={e => updateHeader('judulModul', e.target.value)} placeholder="Fenomena Alam dan Sosial" />
              </div>
              <div className="lgn-hf-group">
                <label>Nomor TP</label>
                <input className="lgn-hf-input" value={header.nomorTP} onChange={e => updateHeader('nomorTP', e.target.value)} placeholder="TP-01" />
              </div>
            </div>
            <div className="lgn-hf-duo">
              <div className="lgn-hf-group">
                <label>Fase / Kelas</label>
                <input className="lgn-hf-input" value={header.faseKelas} onChange={e => updateHeader('faseKelas', e.target.value)} placeholder="Fase E / Kelas X" />
              </div>
              <div className="lgn-hf-group">
                <label>Semester</label>
                <select className="lgn-hf-input" value={header.semester} onChange={e => updateHeader('semester', e.target.value)}>
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>
            <div className="lgn-hf-group lgn-hf-full">
              <label>Tahun Pelajaran</label>
              <input className="lgn-hf-input" value={header.tahunPelajaran} onChange={e => updateHeader('tahunPelajaran', e.target.value)} placeholder="2025/2026" />
            </div>
            <div className="lgn-hf-group lgn-hf-full">
              <label>Nama Guru</label>
              <input className="lgn-hf-input" value={header.namaGuru} onChange={e => updateHeader('namaGuru', e.target.value)} placeholder="Nama lengkap guru" />
            </div>
          </div>

          <div className="lgn-sb-divider" />

          {/* Navigation */}
          <nav className="lgn-nav">
            <p className="lgn-nav-label">LAMPIRAN</p>
            {SECTION_META.map((sec, i) => {
              const s = sections[sec.key];
              const isActive = sec.key === activeKey;
              const isDone = _isSectionDone(s);
              const num = String(i + 1).padStart(2, '0');
              return (
                <div
                  key={sec.key}
                  className={`lgn-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigateTo(sec.key)}
                  style={{ opacity: s?.enabled === false ? 0.4 : 1 }}
                >
                  <div className="lgn-nav-badge">{num}</div>
                  <div className="lgn-nav-info">
                    <div className="lgn-nav-title">{sec.sublabel}</div>
                    <div className="lgn-nav-sub">{sec.judul}</div>
                  </div>
                  <div className="lgn-nav-est">{sec.est}</div>
                  <div className={`lgn-status-dot ${isDone ? 'done' : ''}`} />
                </div>
              );
            })}
          </nav>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="lgn-content">
          {(!activeSection || !activeSection.enabled) ? (
            /* DISABLED VIEW */
            <div className="lgn-section-disabled">
              <div className="lgn-sh">
                <div>
                  <div className="lgn-section-badge">SECTION {SECTION_META.findIndex(s => s.key === activeKey) + 1}</div>
                  <h2 className="lgn-section-title">{activeMeta?.sublabel || activeKey}</h2>
                  <p className="lgn-section-desc">{activeMeta?.judul}</p>
                </div>
                <ToggleSwitch checked={false} onChange={() => toggleSectionEnabled(activeKey)} />
              </div>
              <div className="lgn-disabled-body">
                <Lock size={48} />
                <p>Section ini dinonaktifkan. Aktifkan toggle untuk mengisi.</p>
              </div>
              <SectionFooter
                activeKey={activeKey}
                navigateTo={navigateTo}
                enabledKeys={SECTION_META.filter(s => sections[s.key]?.enabled).map(s => s.key)}
              />
            </div>
          ) : (
            /* ACTIVE VIEW */
            <div className="lgn-section-active">
              <div className="lgn-sh">
                <div>
                  <div className="lgn-section-badge">SECTION {SECTION_META.findIndex(s => s.key === activeKey) + 1}</div>
                  <h2 className="lgn-section-title">{activeMeta?.sublabel || activeKey}</h2>
                  <p className="lgn-section-desc">{activeMeta?.judul}</p>
                </div>
                <ToggleSwitch checked={true} onChange={() => toggleSectionEnabled(activeKey)} />
              </div>

              <div className="lgn-body">
                {/* LEFT: FORM */}
                <div className="lgn-form-panel">
                  {(() => {
                    const Comp = SECTION_COMPONENTS[activeKey];
                    if (!Comp) return <p>Unknown section: {activeKey}</p>;
                    return (
                      <Comp
                        data={activeData}
                        onChange={(key, newData) => updateSectionData(key, newData)}
                      />
                    );
                  })()}
                </div>

                {/* RIGHT: PREVIEW */}
                <div className="lgn-preview-panel">
                  {activePreviewContent ? (
                    <DocPreviewWrap header={headerData}>
                      {activePreviewContent}
                    </DocPreviewWrap>
                  ) : (
                    <div className="lgn-preview-empty">
                      <span style={{ fontSize: 36 }}>📝</span>
                      <p>Isi formulir di samping untuk melihat pratinjau.</p>
                    </div>
                  )}
                </div>
              </div>

              <SectionFooter
                activeKey={activeKey}
                navigateTo={navigateTo}
                enabledKeys={SECTION_META.filter(s => sections[s.key]?.enabled).map(s => s.key)}
              />
            </div>
          )}
        </main>
      </div>

      {/* ── FULLSCREEN PREVIEW MODAL ── */}
      {modalOpen && (
        <div className="lgn-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) toggleModal(); }}>
          <div className="lgn-modal">
            <div className="lgn-modal-header">
              <button className="btn btn-ghost btn-sm" onClick={toggleModal}><X size={16} /> Tutup</button>
              <h3>Preview Dokumen Lampiran</h3>
              <button className="btn btn-primary btn-sm" disabled title="Fitur export segera tersedia"><Download size={15} /> Export DOCX</button>
            </div>
            <div className="lgn-modal-body">
              <aside className="lgn-modal-toc">
                <h4>Daftar Lampiran</h4>
                {SECTION_META.filter(s => sections[s.key]?.enabled).map((sec, i) => (
                  <div key={sec.key} className="lgn-toc-item" onClick={() => {
                    const el = document.querySelector(`[data-anchor="${sec.key}"]`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}>
                    {i + 1}. {sec.judul}
                  </div>
                ))}
              </aside>
              <div className="lgn-modal-preview">
                <div className="paper-page">
                  {modalContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════ */

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="lgn-toggle" onClick={(e) => e.stopPropagation()}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="lgn-toggle-slider" />
      <span className="lgn-toggle-label">Aktif</span>
    </label>
  );
}

function SectionFooter({ activeKey, navigateTo, enabledKeys }) {
  const idx = SECTION_META.findIndex(s => s.key === activeKey);
  const hasPrev = idx > 0;
  const hasNext = idx < SECTION_META.length - 1;

  return (
    <div className="lgn-footer">
      <button
        className="btn btn-secondary btn-sm"
        disabled={!hasPrev}
        onClick={() => navigateTo(SECTION_META[idx - 1].key)}
      >
        <ChevronLeft size={15} /> Sebelumnya
      </button>
      <span className="lgn-footer-label">{SECTION_META[idx]?.sublabel || activeKey}</span>
      <button
        className={`btn ${hasNext ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        disabled={!hasNext}
        onClick={() => navigateTo(SECTION_META[idx + 1].key)}
      >
        Selanjutnya <ChevronRight size={15} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════ */

function _isSectionDone(s) {
  if (!s || !s.enabled || !s.data) return false;
  const d = s.data;
  return Object.keys(d).some(k => {
    const v = d[k];
    if (Array.isArray(v)) return v.length > 0 && v.some(item => {
      if (typeof item === 'string') return item.trim() !== '';
      if (typeof item === 'object') return Object.values(item).some(x => x && String(x).trim() !== '');
      return false;
    });
    if (typeof v === 'string') return v.trim() !== '';
    return v !== null && v !== undefined;
  });
}
