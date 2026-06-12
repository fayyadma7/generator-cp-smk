import { NextResponse } from 'next/server';
import { buildCPPrompt } from '../../../cpGenerator';

export async function POST(request) {
  try {
    const data = await request.json();
    const { subject, program, phase, cpText, grade, semester, year, time, teacher } = data;

    if (!cpText) {
      return NextResponse.json({ error: 'Teks CP tidak boleh kosong' }, { status: 400 });
    }

    // Load balancer sederhana menggunakan beberapa key Gemini
    const apiKeys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY
    ].filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: 'API Key Gemini belum diatur di Vercel Environment Variables' }, { status: 500 });
    }

    // Pilih random key untuk load balancing simpel
    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

    // Memanggil generator prompt dari cpGenerator.js
    const { systemPrompt, userPrompt } = buildCPPrompt({
      programKeahlian: program || 'Umum',
      konsentrasiKeahlian: subject || '',
      fase: phase?.replace('Fase ', '') || 'E',
      kelas: grade || 'X',
      semester: semester || 'Ganjil',
      tahunPelajaran: year || '2025/2026',
      namaGuru: teacher || 'Guru',
      alokasiWaktu: time || '144 JP',
    });

    const finalUserPrompt = `${userPrompt}

Teks CP Asli (sebagai bahan dasar):
${cpText}

Output harus HANYA berupa JSON persis dengan struktur berikut. PASTIKAN SELURUH PROPERTY DIISI:
{
  "elemenList": [
    { "nama": "Nama Elemen 1", "capaian": "Deskripsi kontekstual elemen 1" },
    { "nama": "Nama Elemen 2", "capaian": "Deskripsi kontekstual elemen 2" }
  ],
  "analisis": {
    "kompetensiInti": "Sebutkan Pengetahuan, Keterampilan, dan Sikap secara spesifik",
    "koneksiIndustri": "Relevansi CP dengan minimal 3 jenis pekerjaan/industri",
    "koneksiLokal": "5-6 tema projek kontekstual berkaitan potensi lokal"
  },
  "dimensiProfil": {
    "dimensi1": "Kaitan dengan Keimanan...",
    "dimensi2": "Kaitan dengan Kewargaan...",
    "dimensi3": "Kaitan dengan Penalaran Kritis...",
    "dimensi4": "Kaitan dengan Kreativitas...",
    "dimensi5": "Kaitan dengan Kemandirian...",
    "dimensi6": "Kaitan dengan Kolaborasi...",
    "dimensi7": "Kaitan dengan Komunikasi...",
    "dimensi8": "Kaitan dengan Kesehatan..."
  },
  "deepLearning": {
    "mindful": "3-4 aktivitas mindful spesifik",
    "meaningful": "3-4 cara materi dikaitkan konteks DUDI lokal",
    "joyful": "3-4 aktivitas pembelajaran menyenangkan"
  },
  "strategi": {
    "model": "Model pembelajaran prioritas",
    "asesmen": "Pendekatan asesmen",
    "media": "Sumber & media belajar",
    "alat": "Alat/perangkat tersedia"
  },
  "catatanPengembangan": {
    "catatan": "Catatan kontekstualisasi CP",
    "tantangan": "2-3 tantangan dan solusi"
  }
}`;

    // Memanggil API Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          { parts: [{ text: finalUserPrompt }] }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.4
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Response:", errorText);
      if (response.status === 429) {
        return NextResponse.json({ error: 'Batas request API tercapai (Rate Limit). Silakan coba lagi.' }, { status: 429 });
      }
      return NextResponse.json({ error: 'Gagal menghubungi Gemini AI' }, { status: 500 });
    }

    const aiData = await response.json();
    const textOutput = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textOutput) {
      return NextResponse.json({ error: 'AI mengembalikan respon kosong.' }, { status: 500 });
    }

    const result = JSON.parse(textOutput);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan di server' }, { status: 500 });
  }
}
