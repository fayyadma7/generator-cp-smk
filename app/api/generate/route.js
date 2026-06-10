import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { subject, phase, cpText } = await request.json();

    if (!cpText) {
      return NextResponse.json({ error: 'Teks CP tidak boleh kosong' }, { status: 400 });
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analisis: {
              type: Type.OBJECT,
              properties: {
                kompetensiInti: { type: Type.STRING },
                koneksiIndustri: { type: Type.STRING },
                koneksiLokal: { type: Type.STRING },
              }
            },
            dimensiProfil: {
              type: Type.OBJECT,
              properties: {
                dimensi1: { type: Type.STRING },
                dimensi2: { type: Type.STRING },
                dimensi3: { type: Type.STRING },
                dimensi4: { type: Type.STRING },
                dimensi5: { type: Type.STRING },
                dimensi6: { type: Type.STRING },
                dimensi7: { type: Type.STRING },
                dimensi8: { type: Type.STRING },
              }
            },
            deepLearning: {
              type: Type.OBJECT,
              properties: {
                mindful: { type: Type.STRING },
                meaningful: { type: Type.STRING },
                joyful: { type: Type.STRING },
              }
            },
            strategi: {
              type: Type.OBJECT,
              properties: {
                model: { type: Type.STRING },
                asesmen: { type: Type.STRING },
                media: { type: Type.STRING },
                alat: { type: Type.STRING },
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text());
    return NextResponse.json(result);

  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Gagal menghubungi Gemini AI' }, { status: 500 });
  }
}
