import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { subject, program, phase, cpText } = await request.json();

    if (!cpText) {
      return NextResponse.json({ error: 'Teks CP tidak boleh kosong' }, { status: 400 });
    }

    // Mengambil API Key dari Groq
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'API Key Groq belum diatur di Vercel Environment Variables' }, { status: 500 });
    }

    const prompt = `Anda adalah ahli kurikulum SMK. Saya akan memberikan data mata pelajaran, program keahlian, dan teks Capaian Pembelajaran (CP) mentah dari pemerintah.
Tugas Anda adalah merumuskan analisis dan rekomendasi pembelajaran untuk CP tersebut sesuai format SMK Muhammadiyah 3 Purbalingga (Pendekatan Deep Learning).

Gunakan informasi Program Keahlian sebagai referensi utama/konteks untuk menyusun Analisis & Kontekstualisasi CP, serta bagian-bagian lainnya agar sangat relevan dengan keahlian spesifik tersebut.

Mata Pelajaran: ${subject}
Program Keahlian: ${program || 'Tidak disebutkan'}
Fase: ${phase}
Teks CP Asli:
${cpText}

Output harus HANYA berupa JSON persis dengan struktur berikut:
{
  "analisis": {
    "kompetensiInti": "Sebutkan Pengetahuan, Keterampilan, dan Sikap secara ringkas dan spesifik sesuai Program Keahlian.",
    "koneksiIndustri": "Jelaskan relevansi CP dengan industri spesifik pada Program Keahlian tersebut.",
    "koneksiLokal": "Jelaskan keterkaitan CP dengan potensi lokal Purbalingga dalam konteks Program Keahlian tersebut."
  },
  "dimensiProfil": {
    "dimensi1": "Penjelasan keterkaitan dengan Keimanan & Ketakwaan...",
    "dimensi2": "Penjelasan keterkaitan dengan Kewargaan (Citizenship)...",
    "dimensi3": "Penjelasan keterkaitan dengan Penalaran Kritis...",
    "dimensi4": "Penjelasan keterkaitan dengan Kreativitas...",
    "dimensi5": "Penjelasan keterkaitan dengan Kemandirian...",
    "dimensi6": "Penjelasan keterkaitan dengan Kolaborasi...",
    "dimensi7": "Penjelasan keterkaitan dengan Komunikasi...",
    "dimensi8": "Penjelasan keterkaitan dengan Kesehatan..."
  },
  "deepLearning": {
    "mindful": "Uraikan aktivitas mindful...",
    "meaningful": "Uraikan pembelajaran bermakna...",
    "joyful": "Uraikan strategi joyful..."
  },
  "strategi": {
    "model": "Contoh: PBL, PjBL...",
    "asesmen": "Contoh: Formatif, Sumatif...",
    "media": "Buku, video, alat peraga...",
    "alat": "Komputer, mesin, alat praktik spesifik..."
  },
  "catatanPengembangan": {
    "catatan": "Tuliskan catatan kontekstualisasi dan penyesuaian CP yang dilakukan oleh guru (dibuat seolah-olah guru yang menulis).",
    "tantangan": "Uraikan potensi tantangan atau kendala dan solusi antisipasinya."
  }
}
Catatan Penting: 
1. Untuk dimensiProfil, PASTIKAN ke-8 (delapan) dimensi diisi semua dan buatlah deskripsinya se-relevan mungkin dengan Mata Pelajaran dan Program Keahlian. TIDAK BOLEH ADA YANG KOSONG.
2. Gunakan selalu konteks Program Keahlian dalam menyusun setiap poin.
`;

    // Memanggil API Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: "system", content: "Anda adalah AI asisten untuk mem-parsing data menjadi JSON. Anda HANYA boleh mengeluarkan output berupa string JSON murni tanpa ada embel-embel markdown atau teks tambahan." },
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
