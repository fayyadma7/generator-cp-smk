'use client';

/**
 * Preview rendering utilities — converts section data into JSX preview.
 */

function esc(s) {
  if (!s && s !== 0) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>g/, '&gt;');
}

function nl2br(s) {
  if (!s) return '';
  return s.split('\n').map((line, i) => i === 0 ? line : <br key={i} />).concat(s.includes('\n') ? [] : []);
  // simpler:
}
function nl2brStr(s) {
  if (!s) return '';
  return s.split('\n').map((line, i) => i === 0 ? line : '\n' + line).join('\n');
}

function valOrDash(v) {
  return (v !== undefined && v !== null && v !== '') ? String(v) : '—';
}

/** Render a section's preview content */
export function renderSectionPreview(header, sectionKey, data) {
  if (!data) return null;
  switch (sectionKey) {
    case 'lkpd': return <LKPDPreview header={header} data={data} />;
    case 'formatif': return <FormatifPreview header={header} data={data} />;
    case 'sumatif': return <SumatifPreview header={header} data={data} />;
    case 'rubrik': return <RubrikPreview header={header} data={data} />;
    case 'materi': return <MateriPreview header={header} data={data} />;
    case 'media': return <MediaPreview header={header} data={data} />;
    case 'refleksi': return <RefleksiPreview header={header} data={data} />;
    case 'pengayaan': return <PengayaanPreview header={header} data={data} />;
    case 'remediasi': return <RemediasiPreview header={header} data={data} />;
    default: return null;
  }
}

/** Wrap preview in document shell */
export function DocPreviewWrap({ header, children }) {
  return (
    <div className="doc-preview">
      <div className="doc-header">
        <div className="school-name">{valOrDash(header.namaSekolah)}</div>
        <div className="school-tagline">Lampiran Modul Ajar — {valOrDash(header.mataPelajaran)}</div>
      </div>
      <div className="doc-meta-bar">
        <span>{valOrDash(header.kodeModul)}</span>
        <span>{valOrDash(header.judulModul)}</span>
        <span>TP: {valOrDash(header.nomorTP)}</span>
        <span>{valOrDash(header.faseKelas)}</span>
        <span>{valOrDash(header.semester)} {valOrDash(header.tahunPelajaran)}</span>
        <span>Guru: {valOrDash(header.namaGuru)}</span>
      </div>
      {children}
      <div className="doc-watermark">Dokumen ini digenerate secara otomatis &bull; Generator Lampiran Modul Ajar</div>
    </div>
  );
}

/* ── LKPD ── */
function LKPDPreview({ header, data }) {
  const kegiatan = data.kegiatan || [];
  return (
    <>
      <div className="doc-title">LEMBAR KERJA PESERTA DIDIK (LKPD)</div>
      <div className="doc-section-title">Identitas LKPD</div>
      <table className="doc-table">
        <tbody>
          <tr><th style={{width:150}}>Mata Pelajaran</th><td>{valOrDash(header.mataPelajaran)}</td></tr>
          <tr><th>Fase / Kelas</th><td>{valOrDash(header.faseKelas)}</td></tr>
          <tr><th>Judul Kegiatan</th><td>{valOrDash(data.judulKegiatan)}</td></tr>
          <tr><th>Alokasi Waktu</th><td>{valOrDash(data.alokasiWaktu)}</td></tr>
          <tr><th>Tujuan</th><td style={{whiteSpace:'pre-wrap'}}>{valOrDash(data.tujuan)}</td></tr>
        </tbody>
      </table>
      <div className="doc-section-title">Langkah Kegiatan</div>
      {kegiatan.length === 0 ? (
        <p className="doc-text" style={{color:'#AEB6BF'}}>Belum ada kegiatan.</p>
      ) : (
        <table className="doc-table">
          <thead><tr><th style={{width:30}}>#</th><th style={{width:80}}>Tanggal</th><th>Kegiatan</th></tr></thead>
          <tbody>
            {kegiatan.map((k, i) => (
              <tr key={i}><td>{i+1}</td><td>{valOrDash(k.tanggal)}</td>
                <td>
                  <div style={{whiteSpace:'pre-wrap'}}>{valOrDash(k.deskripsi)}</div>
                  {k.stimulus ? <small><strong>Stimulus:</strong> {k.stimulus}</small> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

/* ── Formatif ── */
function FormatifPreview({ header, data }) {
  const jenis = (data.jenisPenilaian || []).join(', ') || '—';
  const instrumen = data.instrumen || [];
  return (
    <>
      <div className="doc-title">PENILAIAN FORMATIF</div>
      <table className="doc-table">
        <tbody>
          <tr><th style={{width:140}}>Teknik Penilaian</th><td>{valOrDash(data.teknik)}</td></tr>
          <tr><th>Jenis Penilaian</th><td>{jenis}</td></tr>
        </tbody>
      </table>
      <div className="doc-section-title">Instrumen Penilaian</div>
      {instrumen.length === 0 ? (
        <p className="doc-text" style={{color:'#AEB6BF'}}>Belum ada instrumen.</p>
      ) : (
        <table className="doc-table">
          <thead><tr><th>#</th><th>Aspek</th><th>Indikator</th><th>Skor</th></tr></thead>
          <tbody>{instrumen.map((r, i) => (
            <tr key={i}><td>{i+1}</td><td>{valOrDash(r.aspek)}</td><td>{valOrDash(r.indikator)}</td><td>{valOrDash(r.skor)}</td></tr>
          ))}</tbody>
        </table>
      )}
    </>
  );
}

/* ── Sumatif ── */
function SumatifPreview({ header, data }) {
  const instrumen = data.instrumen || [];
  return (
    <>
      <div className="doc-title">PENILAIAN SUMATIF</div>
      <table className="doc-table">
        <tbody><tr><th style={{width:140}}>Bentuk Penilaian</th><td>{valOrDash(data.bentuk)}</td></tr></tbody>
      </table>
      <div className="doc-section-title">Instrumen Penilaian</div>
      {instrumen.length === 0 ? (
        <p className="doc-text" style={{color:'#AEB6BF'}}>Belum ada instrumen.</p>
      ) : (
        <table className="doc-table">
          <thead><tr><th>#</th><th>Soal / Indikator</th><th>Bobot</th></tr></thead>
          <tbody>{instrumen.map((r, i) => (
            <tr key={i}><td>{i+1}</td><td>{valOrDash(r.uraian)}</td><td>{valOrDash(r.bobot)}</td></tr>
          ))}</tbody>
        </table>
      )}
      {data.kkm ? <table className="doc-table"><tbody><tr><th style={{width:140}}>KKM / Kriteria</th><td>{data.kkm}</td></tr></tbody></table> : null}
    </>
  );
}

/* ── Rubrik ── */
function RubrikPreview({ header, data }) {
  const kriteria = data.kriteria || [];
  return (
    <>
      <div className="doc-title">RUBRIK PENILAIAN</div>
      <div className="doc-section-title">Kriteria Penilaian</div>
      {kriteria.length === 0 ? (
        <p className="doc-text" style={{color:'#AEB6BF'}}>Belum ada kriteria.</p>
      ) : (
        <table className="doc-table">
          <thead><tr><th>#</th><th>Kriteria</th><th>Skala / Deskripsi</th></tr></thead>
          <tbody>{kriteria.map((r, i) => (
            <tr key={i}><td>{i+1}</td><td>{valOrDash(r.kriteria)}</td><td>{valOrDash(r.deskripsi)}</td></tr>
          ))}</tbody>
        </table>
      )}
    </>
  );
}

/* ── Materi ── */
function MateriPreview({ header, data }) {
  const list = data.materiList || [];
  return (
    <>
      <div className="doc-title">BAHAN AJAR / MATERI</div>
      <div className="doc-section-title">Materi Pembelajaran</div>
      {list.length === 0 ? (
        <p className="doc-text" style={{color:'#AEB6BF'}}>Belum ada materi.</p>
      ) : (
        <ul className="doc-text">{list.map((m, i) => <li key={i} style={{whiteSpace:'pre-wrap'}}>{m || '—'}</li>)}</ul>
      )}
      {data.sumber ? <table className="doc-table"><tbody><tr><th style={{width:120}}>Sumber Referensi</th><td style={{whiteSpace:'pre-wrap'}}>{data.sumber}</td></tr></tbody></table> : null}
    </>
  );
}

/* ── Media ── */
function MediaPreview({ header, data }) {
  const list = data.mediaList || [];
  return (
    <>
      <div className="doc-title">MEDIA PEMBELAJARAN</div>
      <div className="doc-section-title">Daftar Media</div>
      {list.length === 0 ? (
        <p className="doc-text" style={{color:'#AEB6BF'}}>Belum ada media.</p>
      ) : (
        <table className="doc-table">
          <thead><tr><th>#</th><th>Jenis Media</th><th>Nama / Deskripsi</th></tr></thead>
          <tbody>{list.map((r, i) => (
            <tr key={i}><td>{i+1}</td><td>{valOrDash(r.jenis)}</td><td>{valOrDash(r.deskripsi)}</td></tr>
          ))}</tbody>
        </table>
      )}
      {data.catatan ? <table className="doc-table"><tbody><tr><th style={{width:120}}>Catatan</th><td style={{whiteSpace:'pre-wrap'}}>{data.catatan}</td></tr></tbody></table> : null}
    </>
  );
}

/* ── Refleksi ── */
function RefleksiPreview({ header, data }) {
  const list = data.refleksiList || [];
  return (
    <>
      <div className="doc-title">REFLEKSI</div>
      <div className="doc-section-title">Pertanyaan Refleksi</div>
      {list.length === 0 ? (
        <p className="doc-text" style={{color:'#AEB6BF'}}>Belum ada pertanyaan.</p>
      ) : (
        <table className="doc-table">
          <thead><tr><th>#</th><th>Pertanyaan Refleksi</th><th>Target</th></tr></thead>
          <tbody>{list.map((r, i) => (
            <tr key={i}><td>{i+1}</td><td>{valOrDash(r.pertanyaan)}</td><td>{valOrDash(r.target)}</td></tr>
          ))}</tbody>
        </table>
      )}
    </>
  );
}

/* ── Pengayaan ── */
function PengayaanPreview({ header, data }) {
  const list = data.pengayaanList || [];
  return (
    <>
      <div className="doc-title">PENGAYAAN</div>
      {list.length === 0 ? (
        <p className="doc-text" style={{color:'#AEB6BF'}}>Belum ada aktivitas.</p>
      ) : (
        <ol className="doc-text">{list.map((m, i) => <li key={i} style={{whiteSpace:'pre-wrap'}}>{m || '—'}</li>)}</ol>
      )}
    </>
  );
}

/* ── Remediasi ── */
function RemediasiPreview({ header, data }) {
  const list = data.remediasiList || [];
  return (
    <>
      <div className="doc-title">REMEDIASI</div>
      {list.length === 0 ? (
        <p className="doc-text" style={{color:'#AEB6BF'}}>Belum ada aktivitas.</p>
      ) : (
        <ol className="doc-text">{list.map((m, i) => <li key={i} style={{whiteSpace:'pre-wrap'}}>{m || '—'}</li>)}</ol>
      )}
    </>
  );
}
