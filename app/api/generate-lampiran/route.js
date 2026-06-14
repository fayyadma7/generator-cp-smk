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
export const maxDuration = 60;

// ── Helper: panggil Gemini satu prompt, return JSON ──
async function callGemini(systemPrompt, userPrompt, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          responseMimeType: 'application/json',
        }
      })
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini ${response.status}: ${errBody.slice(0, 120)}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini did not return any text');

  // Bersihkan markdown wrapper jika ada
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`PARSE_ERROR: ${cleaned.slice(0, 80)}`);
  }
}

export async function POST(request) {
  try {
    const inputGuru = await request.json();

    const apiKeys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
      process.env.GEMINI_API_KEY,
    ].filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json(
        { error: 'API Key Gemini belum diatur di Vercel Environment Variables' },
        { status: 500 }
      );
    }

    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    // Daftar semua prompt yang tersedia
    const allPrompts = [
      { key: 'headerDanDaftar',    prompt: PROMPT_HEADER_DAN_DAFTAR(inputGuru) },
      { key: 'lkpd01a',            prompt: PROMPT_LKPD_PERTEMUAN_1(inputGuru) },
      { key: 'lkpd01b',            prompt: PROMPT_LKPD_PERTEMUAN_2(inputGuru) },
      { key: 'asesmenFormatif',    prompt: PROMPT_ASESMEN_FORMATIF(inputGuru) },
      { key: 'asesmenSumatif',     prompt: PROMPT_ASESMEN_SUMATIF(inputGuru) },
      { key: 'rekapKelas',         prompt: PROMPT_REKAP_KELAS(inputGuru) },
      { key: 'mediaPembelajaran',  prompt: PROMPT_MEDIA_PEMBELAJARAN(inputGuru) },
      { key: 'lembarRefleksi',     prompt: PROMPT_LEMBAR_REFLEKSI(inputGuru) },
      { key: 'bahanPengayaan',     prompt: PROMPT_BAHAN_PENGAYAAN(inputGuru) },
      { key: 'bahanRemediasi',     prompt: PROMPT_BAHAN_REMEDIASI(inputGuru) },
    ];

    // Filter hanya key yang diminta (untuk retry parsial dari frontend)
    let prompts = allPrompts;
    if (inputGuru.keysToGenerate && Array.isArray(inputGuru.keysToGenerate)) {
      prompts = allPrompts.filter((p) => inputGuru.keysToGenerate.includes(p.key));
    }

    const finalResults = {};

    // Proses tiap item dengan retry dan random key rotation
    for (const item of prompts) {
      let retryCount = 0;
      let success = false;

      while (retryCount < 6 && !success) {
        // Pilih API key secara acak setiap percobaan (load balance + fault tolerance)
        const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

        try {
          const result = await callGemini(SYSTEM_PROMPT_GLOBAL, item.prompt, randomKey);
          finalResults[item.key] = result;
          success = true;
        } catch (e) {
          const isRetryable =
            e.message.includes('429') ||
            e.message.includes('Quota') ||
            e.message.includes('503') ||
            e.message.includes('500') ||
            e.message.includes('PARSE_ERROR') ||
            e.message.includes('did not return');

          if (isRetryable) {
            retryCount++;
            const waitMs = 2000 * retryCount; // 2s, 4s, 6s, 8s, 10s, 12s
            console.log(`Retry ${retryCount}/6 untuk ${item.key} — tunggu ${waitMs}ms`);
            await delay(waitMs);
          } else {
            // Gagal permanen (misal 400 Bad Request)
            console.error(`Gagal permanen pada ${item.key}:`, e.message);
            finalResults[item.key] = { error: e.message };
            success = true;
          }
        }
      }

      if (!success) {
        finalResults[item.key] = { error: 'Gagal setelah 6x percobaan.' };
      }
    }

    return NextResponse.json(finalResults);
  } catch (error) {
    console.error('Error in /api/generate-lampiran:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan di server' },
      { status: 500 }
    );
  }
}
