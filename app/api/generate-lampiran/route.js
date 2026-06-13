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
  PROMPT_BAHAN_REMEDIASI
} from '../../../lampiranPrompts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // Vercel free tier maksimal 60 detik

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
      try { return JSON.parse(match[1]); } catch {}
    }
    // Coba perbaiki JSON yang terpotong dengan cara melempar sebagai retryable error
    throw new Error(`PARSE_ERROR: Respons AI bukan JSON valid. Preview: ${text.slice(0, 80)}`);
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

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let prompts = [
      { key: 'headerDanDaftar', prompt: PROMPT_HEADER_DAN_DAFTAR(inputGuru) },
      { key: 'lkpd01a', prompt: PROMPT_LKPD_PERTEMUAN_1(inputGuru) },
      { key: 'lkpd01b', prompt: PROMPT_LKPD_PERTEMUAN_2(inputGuru) },
      { key: 'asesmenFormatif', prompt: PROMPT_ASESMEN_FORMATIF(inputGuru) },
      { key: 'asesmenSumatif', prompt: PROMPT_ASESMEN_SUMATIF(inputGuru) },
      { key: 'rekapKelas', prompt: PROMPT_REKAP_KELAS(inputGuru) },
      { key: 'mediaPembelajaran', prompt: PROMPT_MEDIA_PEMBELAJARAN(inputGuru) },
      { key: 'lembarRefleksi', prompt: PROMPT_LEMBAR_REFLEKSI(inputGuru) },
      { key: 'bahanPengayaan', prompt: PROMPT_BAHAN_PENGAYAAN(inputGuru) },
      { key: 'bahanRemediasi', prompt: PROMPT_BAHAN_REMEDIASI(inputGuru) }
    ];

    if (inputGuru.keysToGenerate && Array.isArray(inputGuru.keysToGenerate)) {
      prompts = prompts.filter(p => inputGuru.keysToGenerate.includes(p.key));
    }

    const finalResults = {};

    // Eksekusi tiap prompt yang diminta
    for (const item of prompts) {
      let retryCount = 0;
      let success = false;

      while (retryCount < 7 && !success) {
        // Pilih API key secara acak untuk setiap percobaan
        const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
        
        try {
          console.log(`Memproses ${item.key} dengan key acak (attempt ${retryCount + 1})...`);
          const result = await callGemini(SYSTEM_PROMPT_GLOBAL, item.prompt, randomKey);
          finalResults[item.key] = result;
          success = true;
        } catch (e) {
          // Retry untuk: rate limit, server error, DAN parse error (JSON tidak valid)
          const isRetryable = e.message.includes('429') || e.message.includes('Quota') ||
            e.message.includes('503') || e.message.includes('500') ||
            e.message.includes('PARSE_ERROR') || e.message.includes('did not return');

          if (isRetryable) {
            retryCount++;
            const waitMs = 3000 * retryCount;
            console.log(`Gagal pada ${item.key} (attempt ${retryCount}). Tunggu ${waitMs}ms sebelum ganti key...`);
            await delay(waitMs);
          } else {
            // Error tak terduga yang benar-benar permanen (contoh: 400 Bad Request, 403 Forbidden)
            console.error(`Gagal permanen pada ${item.key}:`, e.message);
            finalResults[item.key] = { error: e.message };
            success = true; // Anggap "selesai" agar loop berhenti
          }
        }
      }

      if (!success) {
        finalResults[item.key] = { error: 'Gagal setelah 7x percobaan karena limit server AI.' };
      }
    }

    return NextResponse.json(finalResults);
  } catch (error) {
    console.error('Error in /api/generate-lampiran:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan saat memproses permintaan' }, { status: 500 });
  }
}
