import { NextResponse } from 'next/server';
import {
  SYSTEM_PROMPT_GLOBAL,
  PROMPT_HEADER_DAN_DAFTAR,
  PROMPT_LKPD_PERTEMUAN_1,
  PROMPT_LKPD_PERTEMUAN_2,
  PROMPT_ASESMEN_FORMATIF,
  PROMPT_ASESMEN_SUMATIF,
  PROMPT_REKAP_KELAS,
  PROMPT_MEDIA_PEMBELAJARAN,
  PROMPT_LEMBAR_REFLEKSI,
  PROMPT_BAHAN_PENGAYAAN,
  PROMPT_BAHAN_REMEDIAL
} from '../../../lampiranPrompts';

export const runtime = 'nodejs';
export const maxDuration = 120; // 2 minutes, as generating all might take a while

async function callGemini(systemPrompt, userPrompt, apiKey) {
  const payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      responseMimeType: "application/json",
    }
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Gemini API Error:", response.status, errorBody);
    throw new Error(`Gemini API Error: ${response.status} - ${errorBody.slice(0, 100)}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini did not return any text');
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    // Attempt to extract JSON if markdown wrapped
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
    throw new Error('Failed to parse Gemini response as JSON');
  }
}

export async function POST(request) {
  try {
    const inputGuru = await request.json();

    const apiKeys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY
    ].filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: 'API Key Gemini belum diatur di Vercel Environment Variables' }, { status: 500 });
    }

    const getRandomKey = () => apiKeys[Math.floor(Math.random() * apiKeys.length)];

    const prompts = [
      { key: 'headerDanDaftar', prompt: PROMPT_HEADER_DAN_DAFTAR(inputGuru) },
      { key: 'lkpd01a', prompt: PROMPT_LKPD_PERTEMUAN_1(inputGuru) },
      { key: 'lkpd01b', prompt: PROMPT_LKPD_PERTEMUAN_2(inputGuru) },
      { key: 'asesmenFormatif', prompt: PROMPT_ASESMEN_FORMATIF(inputGuru) },
      { key: 'asesmenSumatif', prompt: PROMPT_ASESMEN_SUMATIF(inputGuru) },
      { key: 'rekapKelas', prompt: PROMPT_REKAP_KELAS(inputGuru) },
      { key: 'mediaPembelajaran', prompt: PROMPT_MEDIA_PEMBELAJARAN(inputGuru) },
      { key: 'lembarRefleksi', prompt: PROMPT_LEMBAR_REFLEKSI(inputGuru) },
      { key: 'bahanPengayaan', prompt: PROMPT_BAHAN_PENGAYAAN(inputGuru) },
      { key: 'bahanRemedial', prompt: PROMPT_BAHAN_REMEDIAL(inputGuru) }
    ];

    // Jalankan semua call secara paralel menggunakan Promise.all
    const results = await Promise.all(prompts.map(async (item) => {
      try {
        const result = await callGemini(SYSTEM_PROMPT_GLOBAL, item.prompt, getRandomKey());
        return { [item.key]: result };
      } catch (e) {
        console.error(`Error generating ${item.key}:`, e);
        return { [item.key]: { error: e.message } };
      }
    }));

    // Gabungkan array of objects menjadi satu object besar
    const finalData = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    return NextResponse.json(finalData);
  } catch (error) {
    console.error('Error in /api/generate-lampiran:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan saat memproses permintaan' }, { status: 500 });
  }
}
