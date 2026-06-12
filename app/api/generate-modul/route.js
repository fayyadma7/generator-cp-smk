import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.tpText) {
      return NextResponse.json({ error: 'Teks dokumen TP & ATP tidak boleh kosong' }, { status: 400 });
    }

    const targetTp = data.targetTp || 'Satu Tujuan Pembelajaran';

    const prompt = `Anda adalah seorang asisten AI yang ahli dalam menyusun Modul Ajar Kurikulum Merdeka dengan pendekatan Deep Learning (Mindful, Meaningful, Joyful).
Pengguna telah mengupload dokumen "Format TP & ATP" mereka, dan mereka ingin membuat Modul Ajar spesifik untuk Tujuan Pembelajaran (TP) berikut:
"${targetTp}"

Berikut adalah teks lengkap dari dokumen TP & ATP mereka (sebagai konteks utama):
---
${data.tpText.substring(0, 10000)}
---

TUGAS ANDA:
1. Pahami konteks dari dokumen TP & ATP tersebut (Mata Pelajaran, Fase, Elemen, IKTP, dll).
2. Susun konten Modul Ajar HANYA untuk hal-hal yang spesifik dan belum ada/detail di dokumen tersebut, sesuai panduan berikut.
3. Kembalikan HASIL dalam format JSON MURNI yang memiliki struktur persis seperti di bawah ini, TANPA penjelasan lain, TANPA markdown block.

Struktur JSON yang WAJIB dihasilkan:
{
  "identitas": {
    "judulModul": "Tulis judul modul yang menarik sesuai materi dari TP tersebut",
    "nomorModul": "Contoh: MA-01",
    "alokasiWaktu": "Contoh: 4 JP (1 pertemuan @ 4 JP) - sesuaikan dengan perkiraan materi",
    "pertemuanKe": "Contoh: 1"
  },
  "kerangka": {
    "iktp": "Ekstrak atau susun Indikator Ketercapaian TP (IKTP) yang spesifik untuk TP yang dipilih. (Pisahkan dengan newline jika lebih dari satu)",
    "posisiAtp": "Jelaskan secara singkat posisi materi ini dalam alur (sebelumnya belajar apa, setelahnya akan belajar apa - tebak dari dokumen TP & ATP)",
    "dimensiProfil": ["Tulis 1 sampai 3 dimensi profil lulusan yang paling relevan (pilih dari: Keimanan & Ketakwaan, Kewargaan, Penalaran Kritis, Kreativitas, Kemandirian, Kolaborasi, Komunikasi, Kesehatan)"],
    "detailDimensi": "Penjelasan singkat bagaimana dimensi tersebut diintegrasikan dalam pembelajaran ini."
  },
  "deepLearning": {
    "mindful": {
      "apersepsi": "Cara guru mengaktifkan pengetahuan awal (contoh: mengamati gambar/video, permainan ringan).",
      "pemantik": "Tuliskan 2-3 pertanyaan pemantik yang merangsang rasa ingin tahu (pisahkan dengan newline).",
      "tujuan": "Cara menyampaikan tujuan agar siswa sadar penuh (mindful) pentingnya materi ini.",
      "refleksi": "Strategi refleksi akhir (contoh: Jurnal, 3-2-1, dll)."
    },
    "meaningful": {
      "dudi": "Kaitan materi dengan dunia industri atau dunia kerja nyata.",
      "antarMapel": "Kaitan materi dengan mata pelajaran lain (jika ada).",
      "lokal": "Kaitan materi dengan kearifan lokal Purbalingga (budaya/geografis/potensi daerah).",
      "produk": "Produk/hasil belajar yang bermakna."
    },
    "joyful": {
      "model": "Sebutkan model pembelajaran (misal: PjBL, PBL, Discovery) dan alasannya.",
      "aktivitas": "Variasi aktivitas (individu, kelompok, presentasi). Buat menyenangkan.",
      "diferensiasi": "Diferensiasi konten/proses/produk bagi siswa yang berbeda tingkat pemahaman.",
      "islami": "Integrasi nilai Islami (Karakter Muhammadiyah, misal ayat, hadis, atau pembiasaan adab)."
    }
  },
  "skenario": [
    {
      "waktu": "Contoh: 4 JP",
      "pendahuluan": { "waktu": "15 menit", "guru": "Kegiatan guru secara step-by-step...", "siswa": "Kegiatan siswa merespon guru..." },
      "inti": { "waktu": "150 menit", "guru": "Kegiatan eksplorasi, diskusi, proyek... libatkan elemen Joyful dan Meaningful.", "siswa": "Aktivitas aktif siswa..." },
      "penutup": { "waktu": "15 menit", "guru": "Menyimpulkan, asesmen formatif ringan, refleksi (Mindful).", "siswa": "Menyusun kesimpulan, refleksi..." }
    }
  ],
  "asesmen": {
    "formatif": { "teknik": "Observasi / Lisan / Kuis", "instrumen": "Lembar observasi / Kuis interaktif", "waktu": "Selama proses pembelajaran", "tindakLanjut": "Tindakan cepat jika ada yang belum paham" },
    "sumatif": { "teknik": "Tes Tulis / Penugasan Proyek / Praktik", "instrumen": "Rubrik penilaian", "kktp": "Siswa dinyatakan kompeten jika...", "profil": "Dimensi profil yang akan dinilai di akhir" },
    "diagnostik": { "teknik": "Pertanyaan lisan / kuis singkat di awal", "tindakLanjut": "Pembagian kelompok berdasarkan kesiapan belajar" }
  },
  "materi": {
    "pokok": "Poin-poin materi esensial (1-3 poin singkat)",
    "pengayaan": "Materi untuk siswa cerdas istimewa (melampaui KKTP)",
    "remedial": "Fokus materi untuk siswa yang butuh remidial",
    "sumberUtama": "Buku referensi utama atau modul",
    "sumberPendukung": "Link YouTube, artikel web, sumber DUDI",
    "media": "PPT, Quizizz, Canva, alat peraga fisik",
    "alat": "Alat/bahan praktik yang dibutuhkan spesifik",
    "lkpd": "Judul/topik LKPD (contoh: LKPD Analisis Jaringan) - Terlampir: Ya"
  }
}

INGAT: Format output harus HANYA JSON MURNI tanpa blok kode (\`\`\`) dan tanpa pendahuluan!`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'Anda adalah asisten API murni yang hanya mengeluarkan output JSON terstruktur.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Groq API Error:', errorText);
      return NextResponse.json({ error: 'Gagal menghubungi Groq AI' }, { status: 500 });
    }

    const aiData = await res.json();
    const result = JSON.parse(aiData.choices[0].message.content);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses permintaan: ' + error.message },
      { status: 500 }
    );
  }
}
