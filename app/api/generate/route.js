import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { subject, phase, cpText } = await request.json();

    if (!cpText) {
      return NextResponse.json({ error: 'Teks CP tidak boleh kosong' }, { status: 400 });
    }

    // Mengambil API Key dari Groq
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'API Key Groq belum diatur di Vercel Environment Variables' }, { status: 500 });
    }

    const prompt = `Anda adalah ahli kurikulum SMK. Saya akan memberikan data mata pelajaran dan teks Capaian Pembelajaran (CP) mentah dari pemerintah.
Tugas Anda adalah merumuskan analisis dan rekomendasi pembelajaran untuk CP tersebut sesuai format SMK Muhammadiyah 3 Purbalingga (Pendekatan Deep Learning).

Mata Pelajaran: ${subject}
Fase: ${phase}
Teks CP Asli:
${cpText}

Output harus HANYA berupa JSON persis dengan struktur berikut:
{
  "analisis": {
    "kompetensiInti": "Sebutkan Pengetahuan, Keterampilan, dan Sikap secara singkat.",
    "koneksiIndustri": "Jelaskan relevansi CP dengan industri.",
    "koneksiLokal": "Jelaskan keterkaitan CP dengan potensi lokal Purbalingga."
  },
  "dimensiProfil": {
    "dimensi1": "Penjelasan keterkaitan dengan Keimanan & Ketakwaan...",
    "dimensi2": "Penjelasan...",
    "dimensi3": "Penjelasan...",
    "dimensi4": "Penjelasan...",
    "dimensi5": "Penjelasan...",
    "dimensi6": "Penjelasan...",
    "dimensi7": "Penjelasan...",
    "dimensi8": "Penjelasan..."
  },
  "deepLearning": {
    "mindful": "Uraikan aktivitas mindful...",
    "meaningful": "Uraikan pembelajaran bermakna...",
    "joyful": "Uraikan strategi joyful..."
  },
  "strategi": {
    "model": "Contoh: PBL, PjBL...",
    "asesmen": "Contoh: Formatif...",
    "media": "Buku, video...",
    "alat": "Komputer, software..."
  }
}
Catatan: Untuk dimensiProfil, isi dengan string penjelasan singkat BILA relevan. Jika tidak relevan, isi string kosong "". Minimal isi 2 dimensi yang paling cocok.
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
