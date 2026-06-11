import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { subject, program, phase, grade, cpText, timeTotal } = await request.json();

    if (!cpText) {
      return NextResponse.json({ error: 'Teks CP tidak boleh kosong' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'API Key Groq belum diatur di Vercel Environment Variables' }, { status: 500 });
    }

    const prompt = `Anda adalah ahli kurikulum SMK. Saya akan memberikan data mata pelajaran, program keahlian, alokasi waktu total, dan teks Capaian Pembelajaran (CP).
Tugas Anda adalah memecah CP tersebut menjadi daftar Tujuan Pembelajaran (TP) beserta Indikator Ketercapaian TP (IKTP), dan menyusun Alur Tujuan Pembelajaran (ATP) sesuai format SMK Muhammadiyah 3 Purbalingga (Kurikulum Merdeka & Deep Learning).

Gunakan informasi Program Keahlian sebagai referensi utama.

Mata Pelajaran: ${subject}
Program Keahlian: ${program || 'Umum'}
Fase/Kelas: ${phase} / ${grade}
Alokasi Waktu Total: ${timeTotal} JP
Teks CP Asli:
${cpText}

Output harus HANYA berupa JSON persis dengan struktur berikut:
{
  "tujuanPembelajaran": [
    {
      "id": "TP-01",
      "rumusanTp": "Peserta didik mampu ... [menggunakan komponen ABCD (Audience, Behavior, Condition, Degree)]",
      "levelKognitif": "Contoh: C2, C3, C4, dll",
      "dimensiProfil": "Pilih 1 atau 2 dimensi yang paling relevan (misal: Penalaran Kritis, Kreativitas)",
      "alokasiWaktu": "Contoh: 4 JP",
      "iktp": "Indikator ketercapaian TP yang dapat diobservasi/diukur secara spesifik (minimal 1 kalimat)",
      "bentukAsesmen": "Contoh: Formatif (unjuk kerja), Sumatif (proyek)",
      "instrumen": "Contoh: Rubrik penilaian praktik, Lembar kerja"
    }
  ],
  "alurTujuanPembelajaran": [
    {
      "idTp": "TP-01",
      "materi": "- Topik A\\n- Topik B",
      "dimensiProfil": "Penalaran Kritis",
      "deepLearning": "Mindful: Refleksi... / Meaningful: Studi kasus... / Joyful: Proyek...",
      "waktu": "4 JP",
      "asesmen": "Formatif lisan",
      "semester": "Ganjil",
      "pertemuan": "Pertemuan 1-2"
    }
  ],
  "catatan": {
    "kontekstualisasi": "Jelaskan penyesuaian TP dengan konteks lokal Purbalingga / DUDI.",
    "kesesuaianDeepLearning": "Jelaskan bagaimana rangkaian TP mendukung Mindful, Meaningful, Joyful Learning.",
    "modelPembelajaran": "Contoh: PjBL / Teaching Factory / Discovery"
  }
}

Catatan Penting:
1. Buat minimal 5 TP dan maksimal 10 TP, disusun secara progresif dari level kognitif rendah (C1-C2) menuju tinggi (C4-C6).
2. Pastikan total JP di seluruh TP sesuai atau mendekati Alokasi Waktu Total (${timeTotal} JP).
3. Bagilah TP secara proporsional ke dalam "Ganjil" dan "Genap" di dalam "semester" pada array alurTujuanPembelajaran.
4. Gunakan kata kerja operasional (KKO) yang tepat sesuai taksonomi Bloom.
`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: "system", content: "Anda adalah AI asisten untuk mem-parsing data menjadi JSON murni tanpa ada formatting markdown." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Groq API Error Response:", responseData);
      return NextResponse.json({ error: responseData.error?.message || 'Gagal menghubungi Groq AI' }, { status: 500 });
    }

    const textOutput = responseData.choices[0].message.content;
    const result = JSON.parse(textOutput);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan di server' }, { status: 500 });
  }
}
