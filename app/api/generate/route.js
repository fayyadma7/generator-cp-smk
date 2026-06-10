import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { subject, phase, cpText } = await request.json();

    if (!cpText) {
      return NextResponse.json({ error: 'Teks CP tidak boleh kosong' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API Key Gemini belum diatur di Vercel Environment Variables' }, { status: 500 });
    }

    const prompt = `Anda adalah ahli kurikulum SMK. Saya akan memberikan data mata pelajaran dan teks Capaian Pembelajaran (CP) mentah dari pemerintah.
Tugas Anda adalah merumuskan analisis dan rekomendasi pembelajaran untuk CP tersebut sesuai format SMK Muhammadiyah 3 Purbalingga (Pendekatan Deep Learning).

Mata Pelajaran: ${subject}
Fase: ${phase}
Teks CP Asli:
${cpText}

Hasilkan output dalam format JSON dengan struktur persis seperti berikut:
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              analisis: {
                type: "OBJECT",
                properties: {
                  kompetensiInti: { type: "STRING" },
                  koneksiIndustri: { type: "STRING" },
                  koneksiLokal: { type: "STRING" },
                }
              },
              dimensiProfil: {
                type: "OBJECT",
                properties: {
                  dimensi1: { type: "STRING" },
                  dimensi2: { type: "STRING" },
                  dimensi3: { type: "STRING" },
                  dimensi4: { type: "STRING" },
                  dimensi5: { type: "STRING" },
                  dimensi6: { type: "STRING" },
                  dimensi7: { type: "STRING" },
                  dimensi8: { type: "STRING" },
                }
              },
              deepLearning: {
                type: "OBJECT",
                properties: {
                  mindful: { type: "STRING" },
                  meaningful: { type: "STRING" },
                  joyful: { type: "STRING" },
                }
              },
              strategi: {
                type: "OBJECT",
                properties: {
                  model: { type: "STRING" },
                  asesmen: { type: "STRING" },
                  media: { type: "STRING" },
                  alat: { type: "STRING" },
                }
              }
            }
          }
        }
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error Response:", responseData);
      return NextResponse.json({ error: responseData.error?.message || 'Gagal menghubungi Gemini AI' }, { status: 500 });
    }

    // Parse the actual text response from Gemini
    const textOutput = responseData.candidates[0].content.parts[0].text;
    const result = JSON.parse(textOutput);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan di server' }, { status: 500 });
  }
}
